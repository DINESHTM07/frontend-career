// SearchBar
// TODO (Day 3): Build the search input component.
//
// Props:
//   value:    string         — controlled input value
//   onChange: (val) => void  — called on every keystroke (raw value, no debounce here)
//
// What to build:
//   - Input field with a search icon on the left
//   - Clear button (✕) that appears when there is input, clears it on click
//   - Placeholder: "Search products…"
//
// Notes:
//   - Debouncing happens in the parent (HomePage) via useDebounce — not here
//   - Use the .input-field CSS class for consistent styling
//   - The search icon and clear button should be absolutely positioned inside
//     a relative wrapper

export default function SearchBar({ value, onChange }) {
  // TODO: implement SearchBar
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search products…"
        className="input-field pl-9"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      {/* TODO: add clear button when value is not empty */}
    </div>
  )
}
