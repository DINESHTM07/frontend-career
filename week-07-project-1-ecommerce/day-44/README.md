# Day 44 — Project 1 Day 4: Product Detail Page + Dynamic Routing

**Status:** 📋 READY TO START
**Week:** 7 | **Theme:** E-Commerce Project

---

## Today's Goal

Clicking a product card should take you to a dedicated product page at `/product/1`, `/product/2`, etc. That page fetches the full product data, displays a larger image, the full description, and an "Add to Cart" button.

This is where `useParams` + `useProduct` hook come together. It's also where you make the `ProductCard`'s click handler navigate to the detail page.

By end of today:
- Clicking any product card navigates to `/product/:id`
- `ProductDetailPage` reads the `:id` from the URL, fetches that product, displays it
- Loading skeleton on the detail page while fetching
- Error state if the product id is invalid
- "Add to Cart" button on the detail page (wires to Zustand tomorrow — placeholder today)
- "Back to Products" link

---

## Daily Rule: Study → Close → Build

Before building, open the complete version and read:
- `src/pages/ProductDetailPage.jsx`
- `src/App.jsx` — how is the `/product/:id` route defined?
- `src/components/ProductCard.jsx` — how does the card navigate on click?
- `src/hooks/useProduct.js`

Note: how does the detail page handle the loading state differently from the grid? Take notes, close, build.

---

## Morning (8:00 – 11:00 AM) — ProductCard Click + Route Setup

### Step 1 — Add the product detail route in App.jsx

Open `src/App.jsx`. Add the route for the detail page inside your `MainLayout` route:

```jsx
import ProductDetailPage from './pages/ProductDetailPage.jsx'

// Inside your Routes/MainLayout:
<Route path="/product/:id" element={<ProductDetailPage />} />
```

The `:id` is a URL parameter. When someone visits `/product/7`, `useParams()` will give you `{ id: "7" }` (always a string).

---

### Step 2 — Make ProductCard navigate on click

Open `src/components/ProductCard.jsx`. Import `useNavigate`:

```jsx
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      {/* ... rest of card ... */}
      <button
        onClick={e => {
          e.stopPropagation(); // prevent card click from firing
          // Add to cart — wired on Day 45
        }}
        className="..."
      >
        Add to Cart
      </button>
    </div>
  );
}
```

**Critical:** The "Add to Cart" button is inside the clickable card div. Without `e.stopPropagation()`, clicking the button would ALSO trigger the card's `onClick` and navigate to the detail page. Always stop propagation on nested clickable elements.

---

## Midday (11:20 AM – 1:00 PM) — ProductDetailPage

### Build: ProductDetailPage

Create `src/pages/ProductDetailPage.jsx`:

```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct.js'

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg mb-4">{error.message}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Image */}
        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-80 w-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category badge */}
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full capitalize self-start mb-4">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-400">
              {"★".repeat(Math.round(product.rating.rate))}
              {"☆".repeat(5 - Math.round(product.rating.rate))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => {/* wire to cart store on Day 45 */}}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {/* wire to favorites store on Day 46 */}}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xl"
              aria-label="Add to favorites"
            >
              ♡
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse mt-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mt-auto" />
        </div>
      </div>
    </div>
  );
}
```

Test: click any product card from the home page → you land on `/product/1` with the full product details. Click "Back to Products" → returns to where you came from. Directly type `/product/999` in the address bar → error state appears.

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/linked-lists.md`. Solve **problems 4, 5, and 6**.

Create `day-44-dsa.js` in the `week-07-project-1-ecommerce/day-44/` folder.

---

## Wrap Up

Write in `journal.md`:
- Why does `useNavigate(-1)` work as a "back" button — what does -1 mean?
- Why is `e.stopPropagation()` needed on the Add to Cart button inside the card?
- What does `enabled: !!id` do in `useProduct` — what would happen if you fetched with `id = undefined`?

```bash
git add .
git commit -m "Day 44: Product detail page with dynamic routing /product/:id"
git push origin main
```

---

## End of Day Checklist

- [ ] Studied: `ProductDetailPage`, route in `App.jsx`, `ProductCard` click handler, `useProduct` in complete version
- [ ] Added `/product/:id` route in `App.jsx`
- [ ] `ProductCard` navigates with `useNavigate` on click
- [ ] `e.stopPropagation()` on the Add to Cart button inside the card
- [ ] `ProductDetailPage.jsx` built with `useParams` + `useProduct`
- [ ] Loading skeleton on detail page (different from grid skeleton)
- [ ] Error state with Go Back button if product id is invalid
- [ ] Two-column layout: image left, info right (stacks on mobile)
- [ ] Full description displayed
- [ ] "Back to Products" uses `navigate(-1)` — browser history aware
- [ ] Add to Cart and Favorite buttons exist (placeholder for now)
- [ ] Solved 3 DSA problems in `day-44-dsa.js`
- [ ] Committed and pushed
