/*
  WHY a dedicated SearchBar component:
  The search input has its own concerns: the icon, clear button, keyboard focus,
  and accessibility attributes. Extracting it avoids cluttering the FilterBar
  with input management details. It's also reusable if we add a header search later.
*/

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className="relative w-full">
      {/* Search icon — positioned absolutely inside the input container */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/*
          WHY pointer-events-none: The icon sits visually inside the input.
          Without this, clicking the icon area wouldn't focus the input —
          the icon would "intercept" the click. pointer-events-none makes it
          transparent to mouse events, passing clicks through to the input.
        */}
        <svg
          className="h-4 w-4 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/*
        WHY pl-10: Padding-left 40px leaves room for the search icon (pl-3 + icon width).
        WHY pr-10: Same logic for the clear button on the right.
        WHY the input is "controlled": We pass value and onChange from the parent.
        The parent holds the state so FilterBar can also read the search query.
      */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
        aria-label="Search products"
        // WHY autocomplete="off": Browser autocomplete dropdowns interfere with
        // our own filtered list. We handle our own suggestions.
        autoComplete="off"
      />

      {/* Clear button — only visible when there's a value */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     transition-colors"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
