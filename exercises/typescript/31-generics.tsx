// ============================================
// INTRO: TypeScript Generics — Code That Works With Any Type
// ============================================
// Generics let you write one piece of code that works safely with many types.
// Without generics, you'd either:
//   (a) Write the same code 5 times for 5 types — code duplication
//   (b) Use 'any' everywhere — lose all type safety
// Generics give you the best of both: reusable AND type-safe.
//
// ANALOGY:
//   A cardboard box is generic — it holds anything.
//   A typed box<T> is specific — "this holds only eggs", "this holds only books".
//   You get to DECIDE the type when you use it, not when you define it.
//
//   function identity<T>(value: T): T { return value; }
//   identity<string>("hello")  → TypeScript knows return is string
//   identity<number>(42)       → TypeScript knows return is number
//
// PATTERN: Factory (Generics)
//   Build ONE generic component/hook → use it for infinite data shapes.
//   The caller "stamps" the type when using it, like a factory stamp.
// ============================================

import React, { useState, useEffect, useCallback, useRef } from "react";

// ============================================
// PART 1: DataList<T> — A Generic List Component
// Works with ANY data type: users, posts, products, orders...
// ============================================

// Without generics, you'd need UserList, PostList, ProductList...
// With generics: ONE component handles all of them.

interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;   // caller decides how to render
  keyExtractor: (item: T) => string | number;                 // caller knows which field is the key
  emptyMessage?: string;
  isLoading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onItemClick?: (item: T) => void;
}

function DataList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items found.",
  isLoading = false,
  header,
  footer,
  onItemClick,
}: DataListProps<T>) {
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {header && <div>{header}</div>}

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          {emptyMessage}
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item, index) => (
            <li
              key={keyExtractor(item)}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              style={{
                cursor: onItemClick ? "pointer" : "default",
                padding: "0.75rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      )}

      {footer && <div>{footer}</div>}
    </div>
  );
}

// ---- Using DataList<T> with different data types ----

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
}

interface Product {
  sku: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface Post {
  id: number;
  title: string;
  views: number;
  tags: string[];
}

// User list — TypeScript knows 'user' is User
function UserListExample() {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  ];

  return (
    <DataList<User>
      items={users}
      keyExtractor={(user) => user.id}       // user.id is number — TS knows this
      renderItem={(user) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong>{user.name}</strong>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{user.email}</div>
          </div>
          <span style={{ fontSize: "0.75rem", background: "#e0f2fe", padding: "2px 8px", borderRadius: "4px" }}>
            {user.role}
          </span>
        </div>
      )}
      emptyMessage="No users found"
      onItemClick={(user) => alert(`Clicked: ${user.name}`)}  // user is User — TS knows!
    />
  );
}

// Product list — same component, completely different data shape
function ProductListExample() {
  const products: Product[] = [
    { sku: "SHIRT-001", name: "Dev T-Shirt", price: 29.99, inStock: true },
    { sku: "MUG-002", name: "Coffee Mug", price: 14.99, inStock: false },
  ];

  return (
    <DataList<Product>
      items={products}
      keyExtractor={(product) => product.sku}    // sku is string
      renderItem={(product) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{product.name}</span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <strong>${product.price.toFixed(2)}</strong>
            <span style={{ color: product.inStock ? "#16a34a" : "#dc2626", fontSize: "0.8rem" }}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      )}
    />
  );
}

// ============================================
// PART 2: Generic Sorting/Filtering Utilities
// ============================================

// Sort any array by any key — TypeScript ensures 'key' exists on T
function sortBy<T, K extends keyof T>(items: T[], key: K, order: "asc" | "desc" = "asc"): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// Filter any array by a string field — TypeScript ensures 'key' is a string field of T
function filterByText<T>(items: T[], key: keyof T, query: string): T[] {
  const q = query.toLowerCase();
  return items.filter((item) => String(item[key]).toLowerCase().includes(q));
}

// Group any array by a key
function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  return items.reduce((map, item) => {
    const groupKey = item[key];
    const group = map.get(groupKey) || [];
    return map.set(groupKey, [...group, item]);
  }, new Map<T[K], T[]>());
}

// Usage — TypeScript catches mistakes:
const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "moderator" },
];

const sorted = sortBy(users, "name");                // TS knows 'name' exists on User
const filtered = filterByText(users, "email", "alice"); // TS knows 'email' is string field
// sortBy(users, "nonExistent") → TypeScript ERROR: not a key of User!

const byRole = groupBy(users, "role");   // Map<"admin"|"user"|"moderator", User[]>

// ============================================
// PART 3: Generic Pagination Hook
// ============================================

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goNext: () => void;
  goPrev: () => void;
  goToPage: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

function usePagination<T>(
  items: T[],
  { initialPage = 1, pageSize = 10 }: PaginationOptions = {}
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Clamp page if items change and current page is now out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [items.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = items.slice(startIndex, startIndex + pageSize);

  return {
    currentItems,                      // T[] — TypeScript knows the type!
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goNext: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    goPrev: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    goToPage: (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    pageSize,
    totalItems: items.length,
  };
}

// Usage:
function PaginatedUserList() {
  const [allUsers] = useState<User[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: (["admin", "user", "moderator"] as const)[i % 3],
    }))
  );

  const {
    currentItems,  // TypeScript: currentItems is User[]
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    goNext,
    goPrev,
  } = usePagination<User>(allUsers, { pageSize: 5 });

  return (
    <div>
      <DataList<User>
        items={currentItems}
        keyExtractor={(u) => u.id}
        renderItem={(u) => <span>{u.name} — {u.role}</span>}
      />
      <div style={{ display: "flex", gap: "1rem", padding: "1rem", justifyContent: "center" }}>
        <button onClick={goPrev} disabled={!hasPrev}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goNext} disabled={!hasNext}>Next</button>
      </div>
    </div>
  );
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. In DataList<T>, what does 'K extends keyof T' mean in sortBy<T, K>?
//    Why is it safer than just using 'string' as the key type?
//
// 2. Why does renderItem: (item: T, index: number) => React.ReactNode
//    inside DataListProps<T> know what type 'item' is?
//    Trace through: when you use DataList<User>, what does T become?
//
// 3. In usePagination<T>, why does the caller need to specify <User>?
//    What would happen if you just wrote usePagination(allUsers, ...)?
//    (Hint: TypeScript infers T from the argument — does it need the hint?)
//
// 4. The groupBy function returns Map<T[K], T[]>.
//    If T is User and K is "role", what does T[K] resolve to?
// ============================================

// ============================================
// YOUR TURN: Build a generic useApi<T> hook
// ============================================
// Build a production-quality useApi<T> hook that handles:
//   - Fetching data from any URL
//   - Loading, error, and success states
//   - Automatic refetching (refetch function)
//   - Request deduplication (don't send duplicate requests)
//   - Abort on unmount (cancel in-flight requests)
//   - Optional polling (refetch every N milliseconds)
//   - Optional transformation (transform response before storing)
//
// Interface:
//
//   interface UseApiOptions<T> {
//     enabled?: boolean         // if false, don't fetch automatically (default: true)
//     pollInterval?: number     // re-fetch every N ms (default: 0 = no polling)
//     transform?: (raw: unknown) => T  // transform raw response
//     onSuccess?: (data: T) => void    // callback on success
//     onError?: (error: Error) => void // callback on error
//   }
//
//   interface UseApiResult<T> {
//     data: T | null
//     loading: boolean
//     error: Error | null
//     refetch: () => void
//     reset: () => void     // clear data and error, go back to idle state
//     isStale: boolean      // true if data is older than 5 minutes
//   }
//
//   function useApi<T>(url: string, options?: UseApiOptions<T>): UseApiResult<T>
//
// Usage examples to support:
//
//   // Basic usage — type inferred from transform
//   const { data } = useApi<User[]>('/api/users')
//
//   // With transform
//   const { data } = useApi<User[]>('/api/users', {
//     transform: (raw) => (raw as any[]).map(normalizeUser)
//   })
//
//   // With polling — auto-refresh every 30 seconds
//   const { data } = useApi<StockPrice>('/api/stock/AAPL', {
//     pollInterval: 30_000
//   })
//
//   // Conditional fetch — only when user is logged in
//   const { data } = useApi<Profile>('/api/me', {
//     enabled: !!authToken
//   })

// YOUR CODE BELOW:

interface UseApiOptions<T> {
  enabled?: boolean;
  pollInterval?: number;
  transform?: (raw: unknown) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  reset: () => void;
  isStale: boolean;
}

function useApi<T>(url: string, options?: UseApiOptions<T>): UseApiResult<T> {
  // YOUR CODE HERE
  // Hint: useRef for AbortController, lastFetchTime for isStale
  // Hint: useEffect cleanup → abort in-flight requests
  // Hint: polling → setInterval inside useEffect
  // Hint: deduplication → track if request already in-flight with a ref

  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
    reset: () => {},
    isStale: false,
  };
}

// BONUS — Build these generic utilities:

// 1. Generic local storage hook
//    function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void]
//    - stores and retrieves JSON-serialized values
//    - T must be JSON-serializable (can't easily enforce in TS but try)

function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] {
  // YOUR CODE HERE
  return [initial, () => {}];
}

// 2. Generic modal hook
//    function useModal<T = undefined>(): {
//      isOpen: boolean
//      data: T | undefined
//      open: (data?: T) => void
//      close: () => void
//    }
//    - T = undefined means open() with no args
//    - useModal<User>() means open(user: User) — opens modal with user data

function useModal<T = undefined>() {
  // YOUR CODE HERE — return { isOpen, data, open, close }
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  return {
    isOpen,
    data,
    open: (d?: T) => { setData(d); setIsOpen(true); },
    close: () => { setIsOpen(false); setData(undefined); },
  };
}

// Usage:
// const userModal = useModal<User>()
// userModal.open(selectedUser)        → userModal.data is User
// const confirmModal = useModal()     → open() with no args, data is undefined

// ============================================
// PATTERN LEARNED: Factory (Generics)
// ============================================
// WHEN TO USE GENERICS:
//   - You're writing code that should work with multiple types
//   - You're writing a component/hook that accepts "any data"
//   - You want the caller to decide the type, not the implementation
//   - You're writing utility functions (sort, filter, group, paginate)
//
// GENERIC CONSTRAINTS:
//   <T extends object>           → T must be an object (not primitive)
//   <T extends { id: number }>   → T must have an 'id: number' field
//   <K extends keyof T>          → K must be a key of T
//   <T extends string | number>  → T must be string or number
//
// TYPESCRIPT INFERENCE:
//   TypeScript often INFERS the generic type from arguments:
//   const result = sortBy(users, 'name')   → T inferred as User from 'users'
//   You only need explicit <T> when inference doesn't work or is ambiguous.
//
// REAL-WORLD GENERICS IN REACT:
//   - react-query's useQuery<TData, TError> — generic data + error types
//   - react-hook-form's useForm<T> — generic form values type
//   - zustand's create<T> — generic store type
//   - axios.get<T>(url) — generic response type
//
// GOTCHAS:
//   - Don't over-generify: if something is only ever a string, type it as string
//   - JSX and generics: <T,> not <T> (comma to disambiguate from JSX in .tsx files)
//   - Generic default: function useApi<T = unknown>(...) — fallback type
// ============================================
