/*
  WHY skeleton components instead of a spinner:
  A spinner says "something is loading, wait."
  A skeleton says "here is where content will appear, and it looks like THIS."

  Skeletons reduce perceived loading time by:
  1. Eliminating layout shift — the page doesn't jump when content loads
  2. Setting user expectations — the user knows the shape of what's coming
  3. Feeling faster — animation in a familiar shape feels more "alive" than a spinner

  This skeleton exactly mirrors the dimensions of <ProductCard> so there's
  zero visual shift when real cards replace skeleton cards.
*/

export default function ProductCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse" aria-hidden="true" aria-label="Loading product">
      {/* Image placeholder — same aspect ratio as real product images (1:1 roughly) */}
      <div className="skeleton h-52 w-full mb-4" />

      {/* Category badge placeholder */}
      <div className="skeleton h-5 w-24 mb-3" />

      {/* Title placeholder — two lines to match typical title height */}
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-3/4 mb-4" />

      {/* Rating placeholder */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-10" />
      </div>

      {/* Price + button row */}
      <div className="flex items-center justify-between mt-auto">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-9 w-28 rounded-lg" />
      </div>
    </div>
  )
}

/*
  WHY export a SkeletonGrid as well:
  The HomePage needs exactly 12 skeletons in a grid during loading.
  Exporting a convenience wrapper avoids writing Array(12).fill(0).map(...)
  in the page component — that logic belongs in the skeleton file.
*/
export function ProductGridSkeleton({ count = 12 }) {
  return (
    // WHY aria-busy: Screen readers announce "loading" to users waiting for content
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
