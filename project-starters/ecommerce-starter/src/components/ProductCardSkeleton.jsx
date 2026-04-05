// ProductCardSkeleton + ProductGridSkeleton
// TODO (Day 7): Build loading skeleton placeholders.
//
// ProductCardSkeleton — a single card-shaped shimmer placeholder.
//   Should match the dimensions of a real ProductCard exactly so the
//   layout doesn't jump when real cards load.
//
//   Structure (mirror ProductCard layout):
//     - Image area: h-44 skeleton block
//     - Category line: h-3 w-20 skeleton
//     - Title line 1: h-4 w-full skeleton
//     - Title line 2: h-4 w-3/4 skeleton
//     - Price + button row: h-8 skeleton
//
//   Use the .skeleton CSS class (defined in index.css) for shimmer effect.
//
// ProductGridSkeleton — renders `count` skeleton cards in the same grid as HomePage.
//   Props:
//     count: number — how many skeletons to show (default 12)

export function ProductCardSkeleton() {
  // TODO: implement skeleton card matching real card dimensions
  return (
    <div className="card p-4 flex flex-col gap-3 animate-pulse">
      <div className="h-44 skeleton rounded-xl" />
      <div className="h-3 w-20 skeleton" />
      <div className="h-4 w-full skeleton" />
      <div className="h-4 w-3/4 skeleton" />
      <div className="h-8 skeleton mt-auto" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 12 }) {
  // TODO: render `count` ProductCardSkeleton components in a grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
