// CartItem
// TODO (Day 5): Build a single row in the cart drawer.
//
// Props:
//   item: {
//     id:       number
//     title:    string
//     price:    number
//     image:    string
//     quantity: number
//   }
//
// What to build:
//   - Product image (small thumbnail)
//   - Product title (truncated to ~2 lines)
//   - Price per item
//   - Quantity controls: decrement button | quantity display | increment button
//   - Remove button (trash icon)
//   - Line total (price × quantity)
//
// Hints:
//   - updateQuantity(item.id, item.quantity - 1) — decrement (removes at 0)
//   - updateQuantity(item.id, item.quantity + 1) — increment
//   - removeItem(item.id) — remove entirely
//   - Use formatCurrency() for prices

export default function CartItem({ item }) {
  // TODO: implement CartItem
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800">
      <img src={item.image} alt={item.title} className="w-14 h-14 object-contain rounded" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
        <p className="text-xs text-gray-400 italic mt-1">CartItem — build me! (Day 5)</p>
        <p className="text-sm font-bold text-brand-600 mt-1">${item.price} × {item.quantity}</p>
      </div>
    </div>
  )
}
