import { Link } from 'react-router-dom'

// ProductCard
// TODO (Day 2): Build the product grid card.
//
// Props:
//   product: {
//     id:          number
//     title:       string
//     price:       number
//     image:       string
//     category:    string
//     rating:      { rate: number, count: number }
//     description: string
//   }
//   isFavorite:       boolean       — whether this product is in favorites
//   onToggleFavorite: (id) => void  — called when heart icon is clicked
//
// What to build:
//   - Clickable card that links to /product/:id
//   - Product image (centered, fixed height, object-contain)
//   - Category badge (use getCategoryColor() + badge CSS class)
//   - Product title (truncated — use truncate() from helpers)
//   - Star rating row (use getRatingStars() from helpers)
//   - Price (use formatCurrency() from helpers)
//   - "Add to Cart" button — calls addItem from useCartStore
//   - Heart/favorite toggle button — calls onToggleFavorite(product.id)
//   - Visual feedback when item is in cart (e.g. checkmark or "In Cart" label)
//
// Hints:
//   - Wrap the card in <Link to={`/product/${product.id}`}> but make buttons
//     stop propagation so clicking them doesn't navigate
//   - Use the .card CSS class for the container
//   - const addItem = useCartStore(state => state.addItem)

export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  // TODO: implement ProductCard
  return (
    <Link to={`/product/${product.id}`} className="card p-4 flex flex-col gap-2 group">
      <div className="h-44 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
        {product.title}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-base font-bold text-brand-600 dark:text-brand-400">
          ${product.price}
        </span>
        <span className="text-xs text-gray-400 italic">build me! (Day 2)</span>
      </div>
    </Link>
  )
}
