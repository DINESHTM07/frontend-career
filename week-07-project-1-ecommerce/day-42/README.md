# Day 42 — Project 1 Day 2: ProductCard + Fetch + Display Products

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

Yesterday you built the shell — the layout and navigation. Today the app gets real: you fetch actual products from the FakeStore API and display them in a responsive grid.

By end of today:
- `useProducts` custom hook fetches all products via React Query
- `ProductCard` component displays image, title, price, star rating, and category badge
- `ProductGrid` renders the full grid of cards
- `HomePage` shows loading skeletons while fetching, an error message if fetch fails, and the grid when data loads

---

## Daily Rule: Study → Close → Build

Before writing any code for today's features, open the complete version and read:
- `src/hooks/useProducts.js`
- `src/components/ProductCard.jsx`
- `src/components/ProductGrid.jsx`
- `src/components/LoadingSkeleton.jsx`
- `src/pages/HomePage.jsx` (the section that renders the grid)

Take notes on what props `ProductCard` accepts and what `useProducts` returns. Then **close the complete version** and build.

---

## Files to Open Today

1. **This README**
2. `project-starters/ecommerce-complete/src/hooks/useProducts.js` — study only
3. `project-starters/ecommerce-complete/src/components/ProductCard.jsx` — study only
4. `project-starters/ecommerce-starter/TASKS.md` — Day 2 tasks (authoritative task list)
5. `project-starters/ecommerce-starter/src/` — where you build

---

## Morning (8:00 – 11:00 AM) — useProducts Hook + ProductCard

### The FakeStore API

The data source for this project:
```
All products:        https://fakestoreapi.com/products
Single product:      https://fakestoreapi.com/products/:id
Products by category: https://fakestoreapi.com/products/category/:name
All categories:      https://fakestoreapi.com/products/categories
```

A product object looks like:
```js
{
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description: "Your perfect pack for everyday use...",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fAn...",
  rating: { rate: 3.9, count: 120 }
}
```

---

### Build: useProducts hook

Create `src/hooks/useProducts.js`:

```js
import { useQuery } from '@tanstack/react-query'

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes — API doesn't change
  });
}
```

Also create `src/hooks/useProduct.js` (single product for Day 44):

```js
import { useQuery } from '@tanstack/react-query'

async function fetchProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error(`Product ${id} not found`);
  return res.json();
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id, // don't fetch if id is undefined
  });
}
```

---

### Build: ProductCard component

Create `src/components/ProductCard.jsx`. It renders a single product.

The card needs:
- Product image (fixed height, `object-contain` so nothing gets cropped)
- Category badge (pill tag, capitalized)
- Product title (truncated to 2 lines — use `line-clamp-2`)
- Star rating display (filled/empty stars) + review count
- Price (formatted as currency)
- "Add to Cart" button
- Favorite button (heart icon — hollow or filled)

**Tailwind `line-clamp` for truncating text:**
```jsx
<h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
  {product.title}
</h3>
```

**Star rating helper:**
```jsx
function StarRating({ rate, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400 text-sm">
        {"★".repeat(Math.round(rate))}{"☆".repeat(5 - Math.round(rate))}
      </div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}
```

**Price formatting:**
```js
const formatPrice = (price) => `$${price.toFixed(2)}`;
```

For "Add to Cart" and favorites — use placeholder `onClick={() => {}}` for now. You'll wire them to Zustand stores on Days 45 and 46.

---

### Build: ProductGrid component

Create `src/components/ProductGrid.jsx`:

```jsx
import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-xl">No products found</p>
        <p className="text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### Build: LoadingSkeleton

Create `src/components/LoadingSkeleton.jsx` — animated placeholder cards:

```jsx
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4" />
      <div className="bg-gray-200 h-3 rounded w-1/3 mb-3" />
      <div className="bg-gray-200 h-4 rounded w-full mb-2" />
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-4" />
      <div className="bg-gray-200 h-4 rounded w-1/4 mb-4" />
      <div className="bg-gray-200 h-10 rounded-lg" />
    </div>
  );
}

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

`animate-pulse` is a built-in Tailwind class that fades the element in and out — the classic skeleton loading effect.

---

### Wire it up in HomePage

Update `src/pages/HomePage.jsx`:

```jsx
import { useProducts } from '../hooks/useProducts.js'
import ProductGrid from '../components/ProductGrid.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'

export default function HomePage() {
  const { data: products, isLoading, isError, error } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        All Products
        {products && <span className="text-gray-400 font-normal text-lg ml-2">({products.length})</span>}
      </h1>

      {isLoading && <LoadingSkeleton count={8} />}

      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg">{error.message}</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      )}

      {products && <ProductGrid products={products} />}
    </div>
  );
}
```

Open the browser. You should see skeleton cards briefly, then 20 real product cards appear. If not, open DevTools → Network tab and check if the FakeStore API call is succeeding.

---

## Midday (11:20 AM – 1:00 PM) — Refer to TASKS.md

Open `project-starters/ecommerce-starter/TASKS.md` and complete all Day 2 tasks listed there. The tasks above are the foundation — TASKS.md may have additional requirements specific to the starter structure.

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/trees.md`. Solve **problems 4, 5, and 6**.

Create `day-42-dsa.js` in the `week-07-project-1-ecommerce/day-42/` folder.

---

## Wrap Up

Write in `journal.md`:
- Why does `useProducts` use `staleTime: 5 minutes`? What would happen without it?
- Why is `enabled: !!id` needed in `useProduct(id)`?
- What does `animate-pulse` do technically — what CSS property does it animate?

```bash
git add .
git commit -m "Day 42: ProductCard + fetch and display products from API"
git push origin main
```

---

## End of Day Checklist

- [ ] Studied complete version: `useProducts`, `ProductCard`, `ProductGrid`, `LoadingSkeleton`, `HomePage`
- [ ] Created `src/hooks/useProducts.js` — React Query wrapping FakeStore API
- [ ] Created `src/hooks/useProduct.js` — single product fetch, `enabled: !!id`
- [ ] `ProductCard.jsx` — image (fixed height, object-contain), category badge, title (line-clamp-2), stars, price, buttons
- [ ] `ProductGrid.jsx` — maps products to cards, shows empty state
- [ ] `LoadingSkeleton.jsx` — 8 animated pulse placeholder cards
- [ ] `HomePage.jsx` — loading → skeleton, error → message, success → grid
- [ ] Real products appear in browser with images, prices, ratings
- [ ] Solved 3 DSA problems in `day-42-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — React Query + Data Display

```jsx
// Fetch all products
const { data, isLoading, isError, error } = useProducts();

// Three states to handle
if (isLoading) return <LoadingSkeleton />;
if (isError)   return <ErrorMessage message={error.message} />;
return <ProductGrid products={data} />;

// Tailwind for card grid
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"

// Line clamp (truncate to N lines)
className="line-clamp-2"

// Skeleton animation
className="animate-pulse bg-gray-200 h-48 rounded-lg"
```
