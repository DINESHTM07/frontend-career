// ============================================
// INTRO: Observer + Filtering + Transformation and WHY it matters
// ============================================
// This exercise combines three patterns that appear in EVERY data-heavy UI:
//
// OBSERVER (useEffect): Watch for changes and trigger side effects.
//   "When the search query changes → re-fetch from the API"
//   "When the component mounts → load initial data"
//
// FILTERING: Reduce a dataset to a matching subset without mutating it.
//   pokemon.filter(p => p.name.includes(query) && p.type === selectedType)
//
// TRANSFORMATION: Convert raw API data into the shape your UI needs.
//   Raw: { name: "pikachu", base_experience: 112, sprites: { front_default: "..." } }
//   Clean: { id, name, displayName, imageUrl, types, stats }
//
// WHY it matters:
// - Real-world React apps spend 80% of their complexity managing data fetching,
//   loading states, errors, filtering, and sorting — not the UI itself.
// - The PokeAPI is a perfect training ground: free, no key, rich data.
// - These patterns (fetch → transform → filter → render) appear in every
//   dashboard, e-commerce site, admin panel, and data explorer ever built.
//
// React concepts:
//   useEffect — side effects (data fetching, subscriptions)
//   useCallback — stable function references for useEffect dependencies
//   Loading/error/data states — the three states of any async operation
//   Pagination — chunking large datasets for performance
//   Optimistic UI — update UI before server confirms
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Think of this component as a TV with channels:
//   The "antenna" (useEffect) receives signals from outside (PokeAPI)
//   The "remote" (user input: search, filter) changes what you watch
//   The "screen" (JSX) shows the current channel
//
// When you change the channel (update filter state), the Observer
// (useEffect) notices the change and tunes into the new signal (re-fetches).
// The Transformer converts the raw signal (API JSON) into something
// your screen (component) can display beautifully.
//
// Key insight: useEffect with a dependency array says:
// "Run this effect whenever [these values] change"
// Empty []: run once on mount
// [query, type]: run whenever query or type changes
// ============================================

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// ============================================
// CONSTANTS & HELPERS
// ============================================

const POKEMON_TYPES = [
  'all', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal',
]

const TYPE_COLORS = {
  fire: '#ff6b35', water: '#4dabf7', grass: '#51cf66', electric: '#ffd43b',
  ice: '#74c0fc', fighting: '#f03e3e', poison: '#9c36b5', ground: '#f59f00',
  flying: '#339af0', psychic: '#e64980', bug: '#66a80f', rock: '#868e96',
  ghost: '#6741d9', dragon: '#6741d9', dark: '#495057', steel: '#868e96',
  fairy: '#f783ac', normal: '#adb5bd',
}

// Transform raw PokeAPI data → clean shape for our UI
function transformPokemon(raw) {
  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.name.charAt(0).toUpperCase() + raw.name.slice(1),
    imageUrl: raw.sprites?.other?.['official-artwork']?.front_default
      || raw.sprites?.front_default
      || null,
    types: raw.types?.map(t => t.type.name) ?? [],
    stats: {
      hp:      raw.stats?.find(s => s.stat.name === 'hp')?.base_stat ?? 0,
      attack:  raw.stats?.find(s => s.stat.name === 'attack')?.base_stat ?? 0,
      defense: raw.stats?.find(s => s.stat.name === 'defense')?.base_stat ?? 0,
      speed:   raw.stats?.find(s => s.stat.name === 'speed')?.base_stat ?? 0,
    },
    height: ((raw.height ?? 0) / 10).toFixed(1),   // dm → m
    weight: ((raw.weight ?? 0) / 10).toFixed(1),   // hg → kg
    baseExperience: raw.base_experience ?? 0,
  }
}

// ============================================
// SUB-COMPONENTS
// ============================================

// ---- TypeBadge ----
function TypeBadge({ type }) {
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '0.65rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: TYPE_COLORS[type] ?? '#adb5bd',
      color: '#fff',
    }}>
      {type}
    </span>
  )
}

// ---- StatBar ----
function StatBar({ label, value, max = 255 }) {
  const pct = Math.min(100, Math.round(value / max * 100))
  const color = pct >= 70 ? '#51cf66' : pct >= 40 ? '#ffd43b' : '#ff6b35'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem' }}>
      <span style={{ width: '42px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ width: '28px', textAlign: 'right', fontWeight: 600, color: '#374151' }}>{value}</span>
    </div>
  )
}

// ---- PokemonCard ----
function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const primaryType = pokemon.types[0] ?? 'normal'
  const bgColor = TYPE_COLORS[primaryType] + '22' // 22 = 13% opacity in hex

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Card header */}
      <div style={{ background: bgColor, padding: '16px', position: 'relative', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <button
          onClick={() => onToggleFavorite(pokemon.id)}
          style={{ position: 'absolute', top: '6px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        {pokemon.imageUrl ? (
          <img
            src={pokemon.imageUrl}
            alt={pokemon.displayName}
            width={90}
            height={90}
            style={{ objectFit: 'contain', imageRendering: 'crisp-edges' }}
            loading="lazy"
          />
        ) : (
          <div style={{ fontSize: '3rem' }}>❓</div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: '#111827' }}>
          {pokemon.displayName}
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <StatBar label="HP"  value={pokemon.stats.hp} />
          <StatBar label="ATK" value={pokemon.stats.attack} />
          <StatBar label="DEF" value={pokemon.stats.defense} />
          <StatBar label="SPD" value={pokemon.stats.speed} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem', color: '#9ca3af' }}>
          <span>{pokemon.height}m</span>
          <span>{pokemon.weight}kg</span>
          <span>{pokemon.baseExperience} XP</span>
        </div>
      </div>
    </div>
  )
}

// ---- Skeleton card (loading placeholder) ----
function SkeletonCard() {
  const shimmer = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  }
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '120px', ...shimmer }} />
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '16px', ...shimmer }} />
        <div style={{ height: '12px', width: '60%', ...shimmer }} />
        <div style={{ height: '8px', ...shimmer }} />
        <div style={{ height: '8px', ...shimmer }} />
      </div>
    </div>
  )
}

// ============================================
// CUSTOM HOOKS
// ============================================

// useDebounce: delay applying a value until user stops changing it
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // cleanup cancels the timer on next change
  }, [value, delay])
  return debounced
}

// ============================================
// DATA FETCHING HOOK
// ============================================

function usePokemonList(limit = 151) {
  const [allPokemon, setAllPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // The observer: watch for mount and fetch data
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        // Step 1: Get list of pokemon names + urls
        const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        if (!listRes.ok) throw new Error(`Failed to fetch list: ${listRes.status}`)
        const listData = await listRes.json()

        // Step 2: Fetch each pokemon's details in parallel (Promise.all)
        // For performance: batch into groups of 20
        const BATCH = 20
        const transformed = []
        for (let i = 0; i < listData.results.length; i += BATCH) {
          if (cancelled) return
          const batch = listData.results.slice(i, i + BATCH)
          const details = await Promise.all(
            batch.map(p => fetch(p.url).then(r => r.json()))
          )
          transformed.push(...details.map(transformPokemon))
          // Update progressively so UI shows cards as they load
          if (!cancelled) setAllPokemon(prev => [...prev, ...details.map(transformPokemon)])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()

    // Cleanup: if component unmounts before fetch completes, ignore results
    return () => { cancelled = true }
  }, [limit])

  return { allPokemon, loading, error }
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PokemonBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('id')        // 'id' | 'name' | 'hp' | 'attack'
  const [favorites, setFavorites] = useState(new Set())
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 24

  // Debounce the search so we don't filter on every keystroke
  const debouncedQuery = useDebounce(searchQuery, 250)

  // Fetch all pokemon
  const { allPokemon, loading, error } = usePokemonList(151)

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [debouncedQuery, selectedType, sortBy, showFavOnly])

  // ---- FILTERING + SORTING (derived from state) ----
  const filtered = useMemo(() => {
    let result = [...allPokemon]

    // Filter by search
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter(p =>
        p.name.includes(q) ||
        String(p.id).includes(q) ||
        p.types.some(t => t.includes(q))
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(p => p.types.includes(selectedType))
    }

    // Filter favorites
    if (showFavOnly) {
      result = result.filter(p => favorites.has(p.id))
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':   return a.name.localeCompare(b.name)
        case 'hp':     return b.stats.hp - a.stats.hp
        case 'attack': return b.stats.attack - a.stats.attack
        default:       return a.id - b.id
      }
    })

    return result
  }, [allPokemon, debouncedQuery, selectedType, sortBy, showFavOnly, favorites])

  // Paginate
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Toggle favorite
  const handleToggleFav = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // ---- RENDER ----
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Pokédex 🔴</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
          {loading
            ? `Loading... (${allPokemon.length}/151)`
            : `${filtered.length} of ${allPokemon.length} Pokémon`}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, #, or type..."
          style={{
            flex: 1, minWidth: '200px', padding: '8px 14px',
            border: '2px solid #e5e7eb', borderRadius: '10px',
            fontSize: '0.85rem', outline: 'none',
          }}
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.85rem', background: '#fff' }}
        >
          <option value="id">Sort: #ID</option>
          <option value="name">Sort: Name</option>
          <option value="hp">Sort: HP</option>
          <option value="attack">Sort: Attack</option>
        </select>
        <button
          onClick={() => setShowFavOnly(v => !v)}
          style={{
            padding: '8px 14px', border: '2px solid #e5e7eb', borderRadius: '10px',
            background: showFavOnly ? '#fee2e2' : '#fff', cursor: 'pointer', fontSize: '0.85rem',
          }}
        >
          {showFavOnly ? '❤️ Favs only' : '🤍 Show favs'}
        </button>
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
              border: '2px solid transparent', cursor: 'pointer', fontWeight: 600,
              background: selectedType === type
                ? (TYPE_COLORS[type] ?? '#374151')
                : '#f3f4f6',
              color: selectedType === type ? '#fff' : '#6b7280',
              transition: 'all 0.15s',
            }}
          >
            {type === 'all' ? 'All' : type}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', textAlign: 'center', marginBottom: '20px' }}>
          Failed to load: {error}
          <button onClick={() => window.location.reload()} style={{ marginLeft: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😶</div>
          <div>No Pokémon match your filters.</div>
          <button onClick={() => { setSearchQuery(''); setSelectedType('all'); setShowFavOnly(false) }}
            style={{ marginTop: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {paginated.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={favorites.has(pokemon.id)}
            onToggleFavorite={handleToggleFav}
          />
        ))}
        {/* Show skeletons while loading */}
        {loading && paginated.length < PAGE_SIZE && (
          Array.from({ length: Math.min(12, PAGE_SIZE - paginated.length) })
            .map((_, i) => <SkeletonCard key={`sk-${i}`} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#d1d5db' : '#374151' }}>
            ← Prev
          </button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#d1d5db' : '#374151' }}>
            Next →
          </button>
        </div>
      )}

      {/* CSS for skeleton shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why is the shimmer animation defined in a <style> tag inside JSX
//    instead of inline styles?
//    Answer: CSS animations defined with @keyframes cannot be written as
//    inline styles — inline styles don't support @keyframes. The <style>
//    tag inside JSX is a practical workaround. In a real app, use a CSS
//    file, CSS Modules, or a CSS-in-JS library.
//
// 2. Why does useDebounce create a cleanup function?
//    Answer: clearTimeout(timer) in the cleanup cancels any pending timer
//    when the value changes again before the delay completes. Without this,
//    old timers accumulate and might fire after the component unmounts.
//    This is the same AbortController pattern from vanilla JS, but for timers.
//
// 3. What happens if Promise.all in usePokemonList rejects mid-batch?
//    Answer: The entire batch fails. A better approach is Promise.allSettled,
//    which gives you each result individually. Failed pokemon would be logged
//    and skipped rather than cancelling the whole fetch. Consider this YOUR TURN.
//
// 4. Why wrap handleToggleFav in useCallback?
//    Answer: Without useCallback, handleToggleFav is recreated on every render.
//    Since it's passed as a prop to every PokemonCard, all 24 cards would
//    re-render every time ANY state changes. useCallback memoizes the function
//    reference so cards only re-render when favorites actually changes.
// ============================================

// ============================================
// YOUR TURN: Movie Browser with TMDB API
// ============================================
// Rebuild this exact pattern but with TMDB (The Movie Database) API.
// TMDB is free but requires an API key (get one at themoviedb.org/settings/api)
// Store your key as VITE_TMDB_KEY in .env.local
//
// API endpoints to use:
//   GET /movie/popular?api_key=KEY&page=1     → trending movies
//   GET /movie/{id}?api_key=KEY              → movie details
//   GET /search/movie?api_key=KEY&query=Q    → search
//   GET /genre/movie/list?api_key=KEY        → genre list
//   Image base: https://image.tmdb.org/t/p/w500/POSTER_PATH
//
// COMPONENTS to build:
//   MovieCard({ movie, isFavorite, onToggle })
//   → Poster image, title, year, rating (⭐ 7.8), genres, overview snippet
//
//   GenreFilter({ genres, selected, onSelect })
//   → Horizontal scrollable list of genre buttons (like type filter)
//
//   RatingFilter({ min, max, onChange })
//   → Range slider: "Show movies rated 6+ / 7+ / 8+"
//
//   MovieModal({ movie, onClose })
//   → Full details: overview, cast, runtime, similar movies
//   → Closes on Escape key and backdrop click
//
// FEATURES:
//   - Debounced search (calls API on each debounced query change)
//   - Filter by genre (multiple genres can be selected)
//   - Filter by min rating
//   - Sort by: popularity, release date, rating
//   - Infinite scroll (load next page when scrolled to bottom)
//   - Favorites persisted to localStorage
//   - Loading skeleton cards while fetching

export function MovieBrowser() {
  // YOUR CODE HERE
  // Hint: const API_KEY = import.meta.env.VITE_TMDB_KEY
  //       const BASE_URL = 'https://api.themoviedb.org/3'
  //       const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
}

// ============================================
// BOSS CHALLENGE: Virtualized Pokemon Grid
// ============================================
// The current grid renders all 24 cards per page in the DOM.
// With 151 pokemon, all cards are in the DOM between page loads.
// Build a virtualized grid that only renders VISIBLE cards.
//
// VirtualGrid({ items, renderItem, itemHeight, itemWidth, columns })
// → Renders only items currently in the viewport + buffer of 2 rows above/below
// → On scroll: recalculates which items are visible and updates DOM
// → Total height is maintained so scrollbar is correct
//
// Use IntersectionObserver or onScroll + getBoundingClientRect.
// The rendered item count should stay constant (~PAGE_SIZE) regardless
// of total items count. This is how Twitter, LinkedIn, and Pinterest
// handle feeds with thousands of items.

// ============================================
// PATTERN LEARNED: Observer + Filtering + Transformation
// ============================================
// PATTERN NAME: Fetch → Transform → Filter → Render pipeline
// WHEN YOU SEE: Any data browser, catalog, dashboard, or search UI
// USE THIS:
//
//   FETCH (useEffect + async):
//     useEffect(() => {
//       let cancelled = false
//       async function load() {
//         setLoading(true)
//         try {
//           const raw = await fetch(url).then(r => r.json())
//           if (!cancelled) setData(raw.map(transform))
//         } catch (e) {
//           if (!cancelled) setError(e.message)
//         } finally {
//           if (!cancelled) setLoading(false)
//         }
//       }
//       load()
//       return () => { cancelled = true }
//     }, [url])
//
//   TRANSFORM (pure function, outside component):
//     function transformItem(raw) {
//       return { id: raw.id, name: raw.display_name, ... }
//     }
//
//   FILTER + SORT (useMemo — recompute only when deps change):
//     const processed = useMemo(() =>
//       data.filter(matchesFilters).sort(compareFn)
//     , [data, filters, sortBy])
//
//   THREE STATES (always handle all three):
//     if (loading) return <SkeletonGrid />
//     if (error)   return <ErrorState error={error} onRetry={load} />
//     if (!data.length) return <EmptyState />
//     return <Grid items={data} />
//
// REACT CONNECTION:
//   React Query / SWR: abstract the entire fetch pattern above
//   useEffect + fetch: vanilla React approach (what you built here)
//   Suspense + React Query: declarative loading states (future)
// ============================================
