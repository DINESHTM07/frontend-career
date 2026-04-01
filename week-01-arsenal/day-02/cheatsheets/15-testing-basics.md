# 15 — Testing Basics (React Testing Library)

---

## RTL PHILOSOPHY

### CONCEPT
React Testing Library (RTL) is built on one guiding principle: **test your components the way users interact with them**, not the way they're implemented.

### WHY IT MATTERS
- Tests tied to implementation details (component state, instance methods, CSS class names) break on refactors even when behavior is unchanged — creating false negatives
- Tests that mirror user behavior survive refactors, catch real bugs, and build confidence
- RTL makes it easy to write the right tests and hard to write the wrong ones

### EXAMPLES

**Example 1 — Implementation detail tests vs user-behavior tests**
```jsx
// COMPONENT
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// BAD test — tests implementation details
it('updates internal state when button clicked', () => {
  const wrapper = shallow(<Counter />);
  wrapper.find('button').simulate('click');
  expect(wrapper.state('count')).toBe(1);  // ← testing state directly
  // If you rename `count` to `value`, this breaks even though the UI is identical
});

// GOOD test — tests what the user sees
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('shows updated count after clicking increment', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
  // If you rename state, this still passes — behavior is correct
});
```

**The RTL guiding queries (priority order)**
```
Most preferred → least preferred:

1. getByRole          — matches accessible role (button, heading, textbox…)
2. getByLabelText     — form inputs by their label
3. getByPlaceholderText — inputs by placeholder (lower priority than label)
4. getByText          — non-interactive elements by text content
5. getByDisplayValue  — current value of input/select/textarea
6. getByAltText       — images by alt text
7. getByTitle         — elements with title attribute
8. getByTestId        — last resort, explicit test ID

High priority = close to how users find elements.
Low priority = implementation detail.
```

### COMMON MISTAKES
- Querying by CSS class name — couples tests to styling, not behavior
- Using `container.querySelector()` — bypasses RTL's accessibility-first query API
- Testing that state variables have certain values — test the rendered output instead

### INTERVIEW TIP
"RTL's mental model: 'If a screen reader user can find it, so can my test.' `getByRole` and `getByLabelText` test accessibility and behavior simultaneously — they pass only if the component is also accessible. That's two wins from one test."

---

## RENDER AND SCREEN

### CONCEPT
`render` mounts a component into a real DOM (via jsdom). `screen` is a global object with all query methods bound to the rendered output — no need to destructure from `render`.

### WHY IT MATTERS
`screen` is the recommended pattern over destructuring from `render`. It keeps queries globally accessible and makes it clear you're querying the rendered DOM.

### EXAMPLES

**Example 2 — render and screen setup**
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Helper: wraps with common providers so you don't repeat this in every test
function renderWithProviders(ui, options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },  // don't retry on error in tests
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>,
    options
  );
}

// Test using the helper
it('renders the user greeting', () => {
  renderWithProviders(<UserGreeting name="Alice" />);

  // screen queries the whole document — no destructuring needed
  expect(screen.getByText('Hello, Alice')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Alice');
});
```

**Example 3 — Querying variations (get / query / find)**
```js
// get*   — throws if not found (use when element MUST be there)
screen.getByRole('button', { name: /submit/i });

// query* — returns null if not found (use to assert element is ABSENT)
expect(screen.queryByText('Error!')).not.toBeInTheDocument();

// find*  — async, returns Promise, waits for element (use for async renders)
const heading = await screen.findByRole('heading', { name: /dashboard/i });
```

### COMMON MISTAKES
- Using `getBy*` to assert an element is absent — it throws before your assertion runs; use `queryBy*`
- Using `findBy*` for synchronous elements — unnecessary async overhead; use `getBy*`
- Not wrapping app-level providers in tests — components that use Context/Router/QueryClient will throw

### INTERVIEW TIP
"The three query families have a contract: `getBy` = synchronous, must exist. `queryBy` = synchronous, may or may not exist. `findBy` = async, waits up to timeout. Using the wrong family is a common source of flaky tests."

---

## QUERY METHODS — getByText / getByRole / getByTestId

### CONCEPT
Each query method finds elements differently. Choosing the right one makes tests resilient and doubles as an accessibility check.

### WHY IT MATTERS
`getByRole` is the most powerful query because it mirrors how assistive technologies traverse the DOM. If your test uses it and passes, your component is likely accessible.

### EXAMPLES

**Example 4 — getByRole (highest priority)**
```jsx
// getByRole uses ARIA roles — maps to semantic HTML automatically
render(
  <div>
    <h1>Dashboard</h1>
    <button>Save</button>
    <input type="text" aria-label="Search" />
    <nav>
      <a href="/home">Home</a>
    </nav>
  </div>
);

screen.getByRole('heading', { name: /dashboard/i, level: 1 });
screen.getByRole('button',  { name: /save/i });
screen.getByRole('textbox', { name: /search/i });
screen.getByRole('navigation');
screen.getByRole('link',    { name: /home/i });

// Common roles: button, link, textbox, checkbox, radio, heading,
// listitem, list, dialog, alert, navigation, main, img, combobox
```

**Example 5 — getByLabelText for forms**
```jsx
render(
  <form>
    <label htmlFor="email">Email address</label>
    <input id="email" type="email" />

    <label>
      Password
      <input type="password" />  {/* implicit label association */}
    </label>

    <input type="text" aria-label="Search query" />
  </form>
);

// All of these work — RTL finds inputs by their associated label
screen.getByLabelText('Email address');
screen.getByLabelText('Password');
screen.getByLabelText('Search query');

// If getByLabelText fails → your form is not accessible (missing label association)
```

**Example 6 — getByTestId (last resort)**
```jsx
// When semantic queries can't find an element, add data-testid
function Avatar({ user }) {
  return (
    <div data-testid="user-avatar">
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}

// Test
screen.getByTestId('user-avatar');

// Why it's last resort:
// - data-testid doesn't exist for users or screen readers
// - brittle: anyone can change the testid string without noticing tests break
// - first try: getByRole('img', { name: user.name }) via alt text
```

### COMMON MISTAKES
- Defaulting to `getByTestId` for everything — makes tests fragile and non-accessible
- Case-sensitive text matches: `getByText('Submit')` fails if text is 'submit'; use regex `/submit/i`
- `getByRole('button')` when there are multiple buttons — add `{ name: /label/i }` to disambiguate

### INTERVIEW TIP
"`getByRole` failing is often a bug report in disguise. If you can't find a button by its role and name, a screen reader user can't either. RTL's query priority order is the WCAG accessibility tree priority order — same thing."

---

## FIREEVENT VS USEREVENT

### CONCEPT
`fireEvent` dispatches a single DOM event. `userEvent` simulates full user interactions (focus, type, click, tab) including all the intermediate events a real browser would fire.

### WHY IT MATTERS
`fireEvent.click(button)` fires only the `click` event. A real user click fires `pointerover`, `pointerenter`, `mouseover`, `mouseenter`, `pointermove`, `mousemove`, `pointerdown`, `mousedown`, `focus`, `pointerup`, `mouseup`, `click`. Using `userEvent` catches bugs that `fireEvent` misses.

### EXAMPLES

**Example 7 — fireEvent vs userEvent typing**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSearch(value)}
      placeholder="Search"
    />
  );
}

// ─── fireEvent (low-level, often sufficient for simple cases) ───
it('fireEvent: updates on change', () => {
  render(<SearchInput onSearch={jest.fn()} />);
  const input = screen.getByPlaceholderText('Search');

  fireEvent.change(input, { target: { value: 'react' } });
  // Sets value directly — doesn't simulate individual keystrokes
  expect(input.value).toBe('react');
});

// ─── userEvent (high-fidelity, recommended default) ───
it('userEvent: types like a real user', async () => {
  const user = userEvent.setup();
  const handleSearch = jest.fn();
  render(<SearchInput onSearch={handleSearch} />);

  const input = screen.getByPlaceholderText('Search');
  await user.type(input, 'react{Enter}');
  // Fires: focus, keydown, keypress, input, keyup for each character
  // Then: keydown for Enter → triggers onKeyDown → calls handleSearch

  expect(input.value).toBe('react');
  expect(handleSearch).toHaveBeenCalledWith('react');
});
```

**When to use which**
```
userEvent (default):
  → user.click(element)
  → user.type(input, 'text')
  → user.selectOptions(select, ['option'])
  → user.upload(input, file)
  → user.tab()

fireEvent (for specific low-level events or edge cases):
  → fireEvent.scroll(container, { target: { scrollTop: 100 } })
  → fireEvent.keyDown(input, { key: 'Escape' })
  → custom events that userEvent doesn't model
```

### COMMON MISTAKES
- Using `userEvent` without `await` — v14+ is fully async, all interactions return Promises
- Calling `userEvent.setup()` inside each assertion — call once per test; reuse the `user` object
- Using `fireEvent.change` for text inputs and wondering why `onKeyDown` doesn't fire

### INTERVIEW TIP
"`userEvent` is a more realistic simulation at the cost of being async. I use it as the default and only reach for `fireEvent` when I need precise control over a low-level event that userEvent doesn't expose, like scroll position or custom DOM events."

---

## TESTING ASYNC COMPONENTS — findBy AND waitFor

### CONCEPT
`findBy*` queries are async versions of `getBy*` — they poll until the element appears (default timeout: 1000ms). `waitFor` is more general — it retries any assertion until it passes or times out.

### WHY IT MATTERS
Components that fetch data, use `useEffect`, or show/hide elements based on async state require async queries. Synchronous queries will fail because the element isn't in the DOM yet.

### EXAMPLES

**Example 8 — Testing a component that fetches data**
```jsx
// COMPONENT
function UserProfile({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(setUser)
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p role="alert">Error: {error}</p>;
  if (!user) return <p>Loading…</p>;
  return <h1>{user.name}</h1>;
}

// TEST
import { render, screen, waitFor } from '@testing-library/react';

it('displays user name after loading', async () => {
  // Mock the fetch (see next section)
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'Alice', id: 1 }),
  });

  render(<UserProfile id={1} />);

  // 1. Assert loading state is shown immediately
  expect(screen.getByText('Loading…')).toBeInTheDocument();

  // 2. findBy* waits for the element to appear
  const heading = await screen.findByRole('heading', { name: /alice/i });
  expect(heading).toBeInTheDocument();

  // 3. Loading text is gone
  expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
});

it('displays error when fetch fails', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

  render(<UserProfile id={1} />);

  // waitFor retries the assertion until it passes
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
  });
});
```

**Example 9 — waitFor for state-dependent assertions**
```jsx
it('disables submit after form submission', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // After click, state updates asynchronously — waitFor retries until button is disabled
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  // Or more concisely with findBy:
  // await screen.findByRole('button', { name: /submitting/i });
});
```

### COMMON MISTAKES
- Not awaiting `findBy*` — returns a Promise; without `await` you get a pending Promise, not the element
- Wrapping a `findBy*` in `waitFor` — redundant; `findBy` already handles the waiting
- Setting very long timeouts to make flaky tests pass — investigate the root cause instead

### INTERVIEW TIP
"`findBy*` is `waitFor(() => getBy*())` with a cleaner API. I use `findBy*` when I'm waiting for an element to appear, and `waitFor` when I need to wait for a side effect (like a mock to be called or an element to disappear)."

---

## MOCKING API CALLS

### CONCEPT
Tests should not hit real network endpoints. Mock the network layer to control response data, simulate errors, and keep tests fast and deterministic.

### WHY IT MATTERS
Real network calls in tests are slow, flaky, and depend on external state. Mocking ensures tests are isolated, fast, and run offline.

### EXAMPLES

**Example 10 — Mocking with Jest (manual mock)**
```jsx
// Simple: mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

it('renders users from API', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
  });

  render(<UserList />);
  await screen.findByText('Alice');
  expect(screen.getByText('Bob')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/users');
});

it('shows error on failed fetch', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));
  render(<UserList />);
  await screen.findByRole('alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Network error');
});
```

**Example 11 — Mocking with MSW (Mock Service Worker — recommended)**
```bash
npm install --save-dev msw
```

```js
// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  }),

  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice' });
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 201 });
  }),
];

// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/setupTests.js (runs before all tests)
import { server } from './mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());   // reset per-test overrides
afterAll(() => server.close());
```

```js
// Overriding a handler in a single test
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

it('shows error state', async () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    })
  );

  render(<UserList />);
  await screen.findByRole('alert');
});
```

### COMMON MISTAKES
- Not resetting mocks between tests — stale mock responses bleed into other tests
- Mocking at too high a level (mocking the entire module) when MSW is cleaner
- Asserting on mock implementation details (exact URL strings) instead of behavior

### INTERVIEW TIP
"MSW is the gold standard for mocking APIs in tests because it mocks at the network level, not the module level. This means the same handlers work in unit tests, integration tests, and a local dev environment — one mock, three uses."

---

## WHAT TO TEST AND WHAT NOT TO TEST

### CONCEPT
Testing strategy: test behavior, not implementation. Write tests that verify what the user can do and see, not how your code achieves it internally.

### WHY IT MATTERS
Testing the wrong things creates tests that break on refactors (false negatives) or pass despite broken behavior (false positives). Strategic testing gives you maximum confidence with minimum maintenance burden.

### EXAMPLES

**Example 12 — Test checklist**
```
TEST THESE (behavior & contracts):
  ✓ Component renders correct output given props
  ✓ User interactions produce correct output (click, type, submit)
  ✓ Async data loads and displays correctly
  ✓ Error states are shown when API fails
  ✓ Conditional rendering (empty state, loading state, error state, success state)
  ✓ Form validation messages appear on invalid submission
  ✓ Accessibility: can users find elements by role/label?
  ✓ Integration: does the component work with its real dependencies?

SKIP THESE (implementation details):
  ✗ Internal state values (state.count, state.isOpen)
  ✗ Component instance methods
  ✗ Whether a specific function was called internally
  ✗ CSS class names (unless they represent behavior like 'hidden')
  ✗ Exact prop types (TypeScript already does this)
  ✗ How data is fetched (getById vs filter) — only test the output
  ✗ Third-party library internals
```

**Example 13 — Testing the right level**
```jsx
// COMPONENT
function PasswordInput() {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label htmlFor="pw">Password</label>
      <input id="pw" type={shown ? 'text' : 'password'} />
      <button onClick={() => setShown(s => !s)}>
        {shown ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

// BAD tests — testing implementation
it('sets shown to true when button clicked', () => { /* tests state */ });
it('renders input with type="text" when shown is true', () => { /* tests implementation */});

// GOOD tests — testing behavior
it('password is hidden by default', () => {
  render(<PasswordInput />);
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  expect(screen.getByRole('button')).toHaveTextContent('Show');
});

it('reveals password when show button is clicked', async () => {
  const user = userEvent.setup();
  render(<PasswordInput />);

  await user.click(screen.getByRole('button', { name: /show/i }));

  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  expect(screen.getByRole('button')).toHaveTextContent('Hide');
});

// Both tests survive a full internal refactor as long as the UX is unchanged
```

### COMMON MISTAKES
- Testing that a function is called N times — tests implementation; test the side effect instead
- 100% code coverage as a goal — coverage measures execution, not correctness; you can have 100% coverage with useless tests
- Not testing error states — they're the most user-impacting scenarios and most frequently untested

### INTERVIEW TIP
"My test strategy: one test per user scenario, not one test per code path. I ask 'what would a user experience?' — loading, success, error, empty, interaction — and write a test for each. Coverage follows naturally. I avoid testing 'was this internal function called?' and instead test 'did the UI update correctly?'"

---

## QUICK REFERENCE

```
Setup:
  render(<Component />)                 — mount component
  renderWithProviders(<Component />)    — mount with Context/Router/Query wrappers
  screen.debug()                        — print current DOM to console

Queries (priority: getByRole > getByLabelText > getByText > getByTestId):
  getBy*    — synchronous, throws if not found  (element MUST exist)
  queryBy*  — synchronous, returns null          (use to assert absence)
  findBy*   — async Promise, waits up to 1s     (element appears later)
  *AllBy*   — returns array of all matches

Events:
  const user = userEvent.setup()        — create user interaction instance
  await user.click(el)                  — full click simulation
  await user.type(el, 'text')           — character-by-character typing
  await user.selectOptions(el, ['val']) — dropdown selection
  fireEvent.change(el, { target: { value: 'x' } })  — low-level, no await

Async assertions:
  await screen.findByRole('heading')    — wait for element
  await waitFor(() => expect(...))      — wait for assertion to pass

Mocking:
  jest.fn().mockResolvedValueOnce(data) — mock single async return
  MSW (msw/node)                        — network-level mocks (recommended)

Matchers (jest-dom):
  toBeInTheDocument()
  toBeVisible()
  toBeDisabled() / toBeEnabled()
  toHaveTextContent('text')
  toHaveValue('input value')
  toHaveAttribute('type', 'email')
```
