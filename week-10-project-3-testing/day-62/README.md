# Day 62 — Testing Your Projects

**Status:** 📋 READY TO START
**Week:** 10 | **Theme:** Testing + Polish + Open Source

---

## Today's Goal

Add a real test suite to your projects. By end of today you have 9 passing tests across all three projects and you understand the testing setup well enough to add more tomorrow.

By end of today:
- Vitest + React Testing Library installed and configured in the e-commerce project
- 3 passing tests for the e-commerce project
- 3 passing tests for the dashboard project
- 3 passing tests for the Next.js project
- You understand: render, screen, userEvent, getByRole

---

## What to Open

1. `cheatsheets/react/15-testing-basics.md`

---

## Morning (8:00 – 11:00 AM) — Read + Setup + E-Commerce Tests

### Step 1 — Read the Cheatsheet

Open `cheatsheets/react/15-testing-basics.md` and read it fully first.

The core testing philosophy to internalize:

> **Test behavior, not implementation.** Don't test that a variable changed — test that the user sees what they expect to see after taking an action.

### Step 2 — Install Testing Dependencies

In your `ecommerce-starter` project:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

### Step 3 — Create `vitest.config.js`

```js
// vitest.config.js (at project root, next to package.json)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

### Step 4 — Create the Setup File

```js
// src/test/setup.js
import '@testing-library/jest-dom'
```

### Step 5 — Add Test Script to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

Run `npm test` — it should start in watch mode with zero tests (that's fine, add tests next).

### Step 6 — Write 3 E-Commerce Tests

Create `src/test/ecommerce.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// --- Test 1: Product list renders ---
// Import your actual ProductList or ProductCard component
import ProductCard from '../components/ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
    category: 'electronics',
    rating: { rate: 4.5, count: 100 },
  }

  it('renders the product title and price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText(/29\.99/)).toBeInTheDocument()
  })

  // --- Test 2: Add to cart calls the callback ---
  it('calls onAddToCart when the add to cart button is clicked', async () => {
    const user = userEvent.setup()
    const mockAddToCart = vi.fn()

    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)

    const button = screen.getByRole('button', { name: /add to cart/i })
    await user.click(button)

    expect(mockAddToCart).toHaveBeenCalledOnce()
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})

// --- Test 3: Search filter logic ---
// Test pure utility functions without rendering any component

// Import your actual filterProducts function (or write the test for wherever filtering lives)
describe('filterProducts (utility)', () => {
  const products = [
    { id: 1, title: 'Laptop', category: 'electronics', price: 999 },
    { id: 2, title: 'T-Shirt', category: 'clothing', price: 25 },
    { id: 3, title: 'Phone Case', category: 'electronics', price: 15 },
  ]

  it('filters products by search term', () => {
    const result = products.filter(p =>
      p.title.toLowerCase().includes('laptop')
    )
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Laptop')
  })

  it('filters products by category', () => {
    const result = products.filter(p => p.category === 'electronics')
    expect(result).toHaveLength(2)
  })

  it('returns all products when search is empty', () => {
    const result = products.filter(p =>
      p.title.toLowerCase().includes('')
    )
    expect(result).toHaveLength(3)
  })
})
```

**Adapt these tests to match your actual component names and props.** The pattern is what matters — read the actual component you're testing and write tests that match its real API.

Run `npm test` — all tests should pass. If a test fails, read the error message carefully — it tells you exactly what was expected vs what was received.

---

## Midday (11:20 AM – 1:30 PM) — Dashboard Tests + Next.js Tests

### Dashboard Tests

In your `dashboard-starter` project, set up the same testing stack, then write 3 tests:

```jsx
// src/test/dashboard.test.jsx

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCard from '../components/ui/StatCard'
import OrdersTable from '../components/ui/OrdersTable'

// Test 1: StatCard renders label and value
describe('StatCard', () => {
  it('renders label and value', () => {
    const data = {
      id: 'revenue',
      label: 'Total Revenue',
      value: '48,295',
      change: 12.5,
      changeDirection: 'up',
      prefix: '$',
    }

    render(<StatCard data={data} />)

    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText(/48,295/)).toBeInTheDocument()
  })

  // Test 2: Up trend shows green indicator
  it('shows green trend for "up" direction', () => {
    const data = {
      id: 'users',
      label: 'Users',
      value: '3,842',
      change: 8.1,
      changeDirection: 'up',
    }

    const { container } = render(<StatCard data={data} />)
    // Check for the upward indicator text or class
    expect(screen.getByText(/8\.1%/)).toBeInTheDocument()
    expect(screen.getByText(/▲/)).toBeInTheDocument()
  })
})

// Test 3: OrdersTable renders all rows
describe('OrdersTable', () => {
  const orders = [
    { id: 'ORD-001', customer: 'Alice', product: 'Pro Plan', amount: 99, status: 'completed', date: '2026-04-08' },
    { id: 'ORD-002', customer: 'Bob', product: 'Starter', amount: 29, status: 'pending', date: '2026-04-08' },
  ]

  it('renders a row for each order', () => {
    render(<OrdersTable orders={orders} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('ORD-001')).toBeInTheDocument()
  })
})
```

### Next.js Project Tests

Next.js requires slightly different setup since components may use Next.js-specific APIs (`Link`, `Image`, `useRouter`). Mock these:

```js
// src/test/setup.js (in nextjs-starter)
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ children, href }) => <a href={href}>{children}</a>,
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}))
```

Then write 3 tests for your Next.js project's components. Focus on components that don't use async Server Component patterns (those require a different testing approach — integration tests cover them better).

---

## Afternoon (1:30 – 3:00 PM) — DSA

Solve 3 DSA problems from `dsa-bank/`. Create `day-62-dsa.js` in this folder.

---

## Key Testing Concepts to Lock In Today

**The 3 steps of every test:**
```
render → query → assert
```

**Query priority (use in this order):**
1. `getByRole` — most accessible, preferred
2. `getByLabelText` — for form fields
3. `getByPlaceholderText` — for inputs without labels
4. `getByText` — for visible text
5. `getByTestId` — last resort (add `data-testid` attribute)

**`vi.fn()` vs real implementations:**
- Use `vi.fn()` for callbacks and functions passed as props
- Don't mock internal implementation details — test the output/behavior

**`userEvent` vs `fireEvent`:**
- Always use `userEvent` for user interactions — it simulates real browser events (focus, blur, input, click in sequence)
- `fireEvent` is lower-level and skips some browser behaviors

---

## End of Day Checklist

- [ ] Read `cheatsheets/react/15-testing-basics.md` fully
- [ ] Installed: vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom
- [ ] Created `vitest.config.js` — `environment: 'jsdom'`
- [ ] Created `src/test/setup.js` — imports `@testing-library/jest-dom`
- [ ] Added `"test": "vitest"` to `package.json` scripts
- [ ] E-commerce: 3 tests pass (render, click callback, filter logic)
- [ ] Dashboard: 3 tests pass (StatCard render, trend indicator, OrdersTable rows)
- [ ] Next.js: 3 tests pass (with next/navigation and next/image mocked)
- [ ] `npm test` in each project — all green, no failures
- [ ] Completed 3 DSA problems in `day-62-dsa.js`

---

*Tests don't prove code is correct. They prove code behaves the way you believe it does — and they tell you immediately when something you changed broke something you didn't mean to.*
