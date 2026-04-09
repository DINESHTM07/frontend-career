# Day 63 — More Tests + Bug Fixes Found Through Testing

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Expand test coverage and fix any bugs that testing uncovers. By end of today you have 20+ passing tests total and you've fixed at least one real bug that only showed up because of tests.

By end of today:
- 20+ passing tests across all three projects
- At least one bug found and fixed through testing (testing pays off here)
- You can write tests for: render, click, type into input, conditional rendering, async behavior
- Edge cases tested: empty arrays, null values, boundary conditions

---

## Morning (8:00 – 11:00 AM) — Expand E-Commerce Test Coverage

Pick the most important untested behavior in the e-commerce project and cover it. Aim for 7+ tests total in this project.

### Test the Cart

The cart is the most critical business logic in the e-commerce app. If it's wrong, the user's experience is broken. Test it thoroughly:

```jsx
// src/test/cart.test.jsx

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Test the Zustand store directly (if using Zustand)
// or test the CartPage component behavior

describe('Cart logic', () => {
  it('starts with an empty cart', () => {
    // If using Zustand, import and test the store directly:
    // const { useCartStore } = await import('../stores/cartStore')
    // const { items } = useCartStore.getState()
    // expect(items).toHaveLength(0)

    // Or render the cart page and check empty state:
    render(<CartPage items={[]} />)
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('shows item count in cart badge', () => {
    const items = [
      { id: 1, title: 'Laptop', price: 999, quantity: 2 },
      { id: 2, title: 'Phone', price: 499, quantity: 1 },
    ]
    // Render your Navbar or CartBadge with these items
    // and assert the count shows "3"
    render(<CartBadge count={items.reduce((sum, i) => sum + i.quantity, 0)} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calculates the correct total', () => {
    const items = [
      { id: 1, price: 100, quantity: 2 },
      { id: 2, price: 50, quantity: 1 },
    ]
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    expect(total).toBe(250)
  })
})
```

### Test the Search Input Interaction

This tests user behavior end-to-end in a component:

```jsx
import userEvent from '@testing-library/user-event'

describe('ProductSearch', () => {
  it('filters the product list as the user types', async () => {
    const user = userEvent.setup()
    const products = [
      { id: 1, title: 'Laptop', price: 999, category: 'electronics' },
      { id: 2, title: 'T-Shirt', price: 25, category: 'clothing' },
    ]

    render(<ProductList products={products} />)

    // Before typing — both products visible
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('T-Shirt')).toBeInTheDocument()

    // Type into the search input
    const input = screen.getByPlaceholderText(/search/i)
    await user.type(input, 'laptop')

    // After typing — only Laptop visible
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument()
  })

  it('shows "no results" message when search finds nothing', async () => {
    const user = userEvent.setup()
    render(<ProductList products={[{ id: 1, title: 'Laptop', price: 999 }]} />)

    await user.type(screen.getByPlaceholderText(/search/i), 'zzz')

    expect(screen.getByText(/no products/i)).toBeInTheDocument()
  })
})
```

### Test Edge Cases

```jsx
describe('ProductList edge cases', () => {
  it('renders an empty state when no products are passed', () => {
    render(<ProductList products={[]} />)
    expect(screen.getByText(/no products/i)).toBeInTheDocument()
  })

  it('handles products with no rating gracefully', () => {
    const product = { id: 1, title: 'New Product', price: 10, rating: null }
    // Should render without crashing
    expect(() => render(<ProductCard product={product} onAddToCart={vi.fn()} />)).not.toThrow()
  })
})
```

---

## Midday (11:20 AM – 1:30 PM) — Dashboard + Next.js Tests

### More Dashboard Tests

Add coverage for interactive behavior:

```jsx
describe('OrdersTable sorting/filtering', () => {
  it('shows correct status badge color for each status', () => {
    const orders = [
      { id: 'ORD-1', customer: 'Alice', product: 'Pro', amount: 99, status: 'completed', date: '2026-04-01' },
      { id: 'ORD-2', customer: 'Bob', product: 'Pro', amount: 99, status: 'pending', date: '2026-04-01' },
      { id: 'ORD-3', customer: 'Carol', product: 'Pro', amount: 99, status: 'cancelled', date: '2026-04-01' },
    ]
    render(<OrdersTable orders={orders} />)

    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('cancelled')).toBeInTheDocument()
  })
})
```

### More Next.js Tests — Test Client Component Interactions

```tsx
// Any Client Component with useState is straightforward to test
describe('ThemeToggle', () => {
  it('calls setTheme when clicked', async () => {
    const user = userEvent.setup()

    // Mock useTheme
    vi.mock('next-themes', () => ({
      useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
    }))

    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle dark mode/i })
    await user.click(button)
    // Verify click doesn't throw
  })
})
```

### When a Test Fails — The Bug Fix

This is the most valuable part of the day. When a test fails because of a genuine bug (not a test setup issue), you've found a real bug.

The process:
1. Read the error message carefully — what was expected vs actual?
2. Find the component or function that's wrong
3. Fix the code (not the test — unless the test was wrong)
4. Run tests again — the fix should make the test pass
5. Note what the bug was — this is portfolio-worthy: "wrote tests, found and fixed a bug in cart total calculation"

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-63-dsa.js` in this folder.

---

## Testing Patterns to Know

**Test conditional rendering:**
```jsx
// Use queryBy (returns null, doesn't throw) for things that might not be there
expect(screen.queryByText('Error message')).not.toBeInTheDocument()
// Use getBy (throws) for things that must be there
expect(screen.getByText('Success')).toBeInTheDocument()
```

**Test async behavior:**
```jsx
import { waitFor } from '@testing-library/react'

it('shows data after loading', async () => {
  render(<AsyncComponent />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

**Reset mocks between tests:**
```js
beforeEach(() => {
  vi.clearAllMocks()
})
```

---

## End of Day Checklist

- [ ] E-commerce project: 7+ tests total (render, cart logic, search filter, edge cases)
- [ ] Dashboard project: 5+ tests total
- [ ] Next.js project: 5+ tests total
- [ ] Total: 20+ passing tests across all projects
- [ ] Used `queryByText` (not `getByText`) for elements that might not be present
- [ ] Used `waitFor` for at least one async test
- [ ] Found and fixed at least one real bug (or confirmed all behavior is correct)
- [ ] Written down what the bug was (if found) — this is interview material
- [ ] Completed 3 DSA problems in `day-63-dsa.js`

---

*The first test you write that catches a real bug is the moment testing stops feeling like overhead and starts feeling like a superpower.*
