// ============================================
// INTRO: TypeScript Translator — JS to TS
// ============================================
// TypeScript adds a type system on top of JavaScript.
// The type system catches bugs before your code runs — at write time.
//
// WHY TypeScript?
//   - "Cannot read properties of undefined" → TypeScript catches this at compile time
//   - Autocomplete that knows exactly what properties an object has
//   - Refactoring is safe: rename a prop, TS shows every place it breaks
//   - Self-documenting: types ARE documentation that never goes stale
//   - Scales: essential for large codebases, teams, long-lived projects
//
// MENTAL MODEL:
//   TypeScript is a LINTER that understands your data shapes.
//   It doesn't change what runs — it checks what you WRITE.
//   All types disappear at compile time. The output is plain JavaScript.
//
// PATTERN: Type Safety
//   Define the shape of data BEFORE writing logic.
//   If data changes shape, TypeScript tells you everywhere you need to update.
// ============================================

// ============================================
// PART 1: Translating a Button Component
// ============================================

// ---- BEFORE: JavaScript (no types) ----
function ButtonJS({ label, onClick, variant, disabled, size }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
}
// Problem: What is 'variant'? What values are valid?
// Someone could pass variant="huge" or size="giant" — no error, broken UI.

// ---- AFTER: TypeScript (with types) ----

// Step 1: Define the shape of props
interface ButtonProps {
  label: string;                                    // must be a string
  onClick: () => void;                              // function with no args, returns nothing
  variant?: "primary" | "secondary" | "danger";    // optional, only these 3 values
  disabled?: boolean;                               // optional, true/false
  size?: "sm" | "md" | "lg";                       // optional, only these 3 values
}

// Step 2: Type the component parameter
function ButtonTS({ label, onClick, variant = "primary", disabled = false, size = "md" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
}

// Now TypeScript will error if you try:
//   <ButtonTS label={42} />           → Error: Type 'number' is not assignable to type 'string'
//   <ButtonTS variant="huge" />       → Error: '"huge"' is not assignable to type '"primary" | "secondary" | "danger"'
//   <ButtonTS />                      → Error: Property 'label' is missing
//   <ButtonTS label="Hi" />           → Error: Property 'onClick' is missing

// ============================================
// PART 2: Translating a User Card Component
// ============================================

// ---- BEFORE: JavaScript ----
function UserCardJS({ user, onFollow, showStats }) {
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
      {showStats && <span>{user.followers} followers</span>}
      <button onClick={() => onFollow(user.id)}>Follow</button>
    </div>
  );
}
// Problem: What shape is 'user'? Does it have 'avatar'? Is 'bio' always present?

// ---- AFTER: TypeScript ----

interface User {
  id: number;
  name: string;
  avatar: string;
  bio?: string;           // optional — may not always be set
  followers: number;
  following: number;
  isVerified: boolean;
}

interface UserCardProps {
  user: User;
  onFollow: (userId: number) => void;   // callback receives the user's id
  showStats?: boolean;
}

function UserCardTS({ user, onFollow, showStats = true }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>
        {user.name}
        {user.isVerified && <span title="Verified">✓</span>}
      </h3>
      {user.bio && <p>{user.bio}</p>}   {/* safe: bio is optional, check before render */}
      {showStats && (
        <div>
          <span>{user.followers} followers</span>
          <span>{user.following} following</span>
        </div>
      )}
      <button onClick={() => onFollow(user.id)}>Follow</button>
    </div>
  );
}

// ============================================
// PART 3: Translating a Data Fetching Hook
// ============================================

// ---- BEFORE: JavaScript ----
function useFetchJS(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
// Problem: data is 'any' — no autocomplete, no safety.

// ---- AFTER: TypeScript with Generics ----
// <T> means "this hook works with ANY data type — caller decides which"

import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;   // prevent state update on unmounted component

    async function load() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data: T = await res.json();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err as Error });
        }
      }
    }

    load();
    return () => { cancelled = true; };   // cleanup on unmount or url change
  }, [url]);

  return state;
}

// Usage — TypeScript knows exactly what 'data' looks like:
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function PostComponent() {
  const { data: post, loading, error } = useFetch<Post>(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  // Now: post?.title has autocomplete — TypeScript knows Post has 'title'!
  // post?.nonExistent → TypeScript ERROR: Property 'nonExistent' does not exist

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return null;

  return <h1>{post.title}</h1>;  // TypeScript: 'title' is string ✓
}

// ============================================
// PART 4: Translating an Event Handler Component
// ============================================

// ---- BEFORE: JavaScript ----
function SearchFormJS({ onSearch, placeholder, initialValue }) {
  const [value, setValue] = useState(initialValue || "");

  const handleChange = (e) => setValue(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} placeholder={placeholder} />
      <button type="submit">Search</button>
    </form>
  );
}

// ---- AFTER: TypeScript ----

interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

function SearchFormTS({ onSearch, placeholder = "Search...", initialValue = "" }: SearchFormProps) {
  const [value, setValue] = useState<string>(initialValue);

  // React.ChangeEvent<HTMLInputElement> — TS knows e.target is an <input>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  // React.FormEvent<HTMLFormElement> — TS knows this is a form event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  );
}

// Common React event types:
//   React.ChangeEvent<HTMLInputElement>        → onChange for <input>
//   React.ChangeEvent<HTMLSelectElement>       → onChange for <select>
//   React.ChangeEvent<HTMLTextAreaElement>     → onChange for <textarea>
//   React.FormEvent<HTMLFormElement>           → onSubmit for <form>
//   React.MouseEvent<HTMLButtonElement>        → onClick for <button>
//   React.KeyboardEvent<HTMLInputElement>      → onKeyDown/onKeyUp
//   React.FocusEvent<HTMLInputElement>         → onFocus/onBlur

// ============================================
// PART 5: Translating a Context + Reducer
// ============================================

// ---- BEFORE: JavaScript ----
const ThemeContextJS = React.createContext(null);

function themeReducerJS(state, action) {
  switch (action.type) {
    case "TOGGLE": return { ...state, isDark: !state.isDark };
    case "SET_ACCENT": return { ...state, accent: action.payload };
    default: return state;
  }
}

// ---- AFTER: TypeScript ----

// 1. Define the state shape
interface ThemeState {
  isDark: boolean;
  accent: "blue" | "green" | "purple" | "orange";
  fontSize: "sm" | "md" | "lg";
}

// 2. Define all possible actions as a discriminated union
// Discriminated union: each action has a unique 'type' — TS narrows payload per type
type ThemeAction =
  | { type: "TOGGLE_DARK" }
  | { type: "SET_ACCENT"; payload: ThemeState["accent"] }
  | { type: "SET_FONT_SIZE"; payload: ThemeState["fontSize"] }
  | { type: "RESET" };

// 3. Type the reducer — TS ensures every action type is handled
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "TOGGLE_DARK":
      return { ...state, isDark: !state.isDark };
    case "SET_ACCENT":
      return { ...state, accent: action.payload };   // payload is ThemeState["accent"]
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "RESET":
      return initialThemeState;
    default:
      // TypeScript exhaustive check: if we add a new action type and forget to handle it,
      // this line will error — forcing us to handle every case
      const _exhaustive: never = action;
      return state;
  }
}

const initialThemeState: ThemeState = {
  isDark: false,
  accent: "blue",
  fontSize: "md",
};

// 4. Type the context value
interface ThemeContextValue {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  toggleDark: () => void;        // convenience helpers
  setAccent: (accent: ThemeState["accent"]) => void;
}

import React, { createContext, useContext, useReducer } from "react";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  const toggleDark = () => dispatch({ type: "TOGGLE_DARK" });
  const setAccent = (accent: ThemeState["accent"]) =>
    dispatch({ type: "SET_ACCENT", payload: accent });

  return (
    <ThemeContext.Provider value={{ state, dispatch, toggleDark, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with null-check — throws if used outside provider
function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

// Usage in a component:
function ThemeToggle() {
  const { state, toggleDark, setAccent } = useTheme();
  // state.accent → TypeScript knows it's "blue" | "green" | "purple" | "orange"
  // setAccent("red") → TypeScript ERROR: '"red"' is not assignable

  return (
    <div>
      <button onClick={toggleDark}>
        {state.isDark ? "Light Mode" : "Dark Mode"}
      </button>
      <select
        value={state.accent}
        onChange={(e) => setAccent(e.target.value as ThemeState["accent"])}
      >
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="purple">Purple</option>
        <option value="orange">Orange</option>
      </select>
    </div>
  );
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is the difference between 'interface' and 'type' in TypeScript?
//    When would you use each? (hint: union types, extension)
//
// 2. In useFetch<T>, what does the <T> mean and why is it useful?
//    Give two examples of how you'd call useFetch with different T values.
//
// 3. What is a discriminated union? (see ThemeAction)
//    Why is it better than { type: string; payload: any }?
//
// 4. What does 'never' do in the reducer's default case?
//    What happens if you add a new action type and forget to handle it?
// ============================================

// ============================================
// YOUR TURN: Type a Full Form Component with Complex Props
// ============================================
// Build a fully typed multi-step registration form component.
//
// The form collects:
//   Step 1 — Account:  email (validated), password, confirmPassword
//   Step 2 — Profile:  firstName, lastName, username, bio (optional)
//   Step 3 — Settings: notifications (object with checkboxes), theme preference
//
// Type requirements:
//
//   interface RegistrationFormData {
//     // Step 1
//     email: string
//     password: string
//     confirmPassword: string
//     // Step 2
//     firstName: string
//     lastName: string
//     username: string
//     bio?: string
//     // Step 3
//     notifications: {
//       email: boolean
//       sms: boolean
//       push: boolean
//     }
//     theme: 'light' | 'dark' | 'system'
//   }
//
//   type FormErrors = Partial<Record<keyof RegistrationFormData, string>>
//   // Partial<Record<K, V>> = every key is optional. Errors only appear when invalid.
//
//   interface StepProps<T extends Partial<RegistrationFormData>> {
//     data: T
//     errors: FormErrors
//     onChange: <K extends keyof T>(field: K, value: T[K]) => void
//   }
//
// Components to build:
//   - RegistrationForm (orchestrates steps, state, submission)
//   - Step1Account: React.FC<StepProps<Pick<RegistrationFormData, 'email' | 'password' | 'confirmPassword'>>>
//   - Step2Profile:  React.FC<StepProps<Pick<RegistrationFormData, 'firstName' | 'lastName' | 'username' | 'bio'>>>
//   - Step3Settings: React.FC<StepProps<Pick<RegistrationFormData, 'notifications' | 'theme'>>>
//
// Validation function to type:
//   function validateStep(step: 1 | 2 | 3, data: RegistrationFormData): FormErrors { ... }
//
// CHALLENGE: Type a useFormWizard<T> hook that:
//   - Takes initialData: T and steps: number
//   - Returns { data, errors, currentStep, goNext, goBack, updateField, submit }
//   - updateField should be generic: <K extends keyof T>(key: K, val: T[K]) => void

// YOUR CODE BELOW:

interface RegistrationFormData {
  // YOUR CODE HERE — define all fields with correct types
}

type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

function validateStep(step: 1 | 2 | 3, data: RegistrationFormData): FormErrors {
  // YOUR CODE HERE
  // Return object with error messages for any invalid fields
  // Example: { email: 'Invalid email format', password: 'Must be 8+ chars' }
  return {};
}

function RegistrationForm() {
  // YOUR CODE HERE
  // Use useReducer or useState with RegistrationFormData
  // Show one step at a time
  // Validate before allowing to proceed to next step
  // On final step submit: call onSubmit with complete data
  return <div>Registration Form — YOUR CODE HERE</div>;
}

// ============================================
// PATTERN LEARNED: Type Safety
// ============================================
// KEY TYPESCRIPT CONCEPTS FOR REACT:
//
//   Interfaces vs Types:
//     interface — for object shapes, can be extended/merged
//     type — for unions, intersections, mapped types, aliases
//     Rule of thumb: interface for props/state, type for complex unions
//
//   Common prop types:
//     children: React.ReactNode         → any renderable content
//     style?: React.CSSProperties       → inline style object
//     className?: string                → CSS class name
//     ref?: React.Ref<HTMLDivElement>   → for forwardRef
//     onClick?: React.MouseEventHandler<HTMLButtonElement>
//
//   Generics:
//     function Component<T>({ data }: { data: T }) → works with any type
//     interface List<T> { items: T[] }   → typed collection
//
//   Utility types (built-in):
//     Partial<T>       → all props optional
//     Required<T>      → all props required
//     Readonly<T>      → all props read-only
//     Pick<T, K>       → only these keys from T
//     Omit<T, K>       → all keys except these
//     Record<K, V>     → object with keys K and values V
//     NonNullable<T>   → removes null and undefined
//
//   React-specific:
//     React.FC<Props>              → function component (includes children)
//     React.ReactNode              → anything renderable
//     React.Dispatch<Action>       → useReducer dispatch type
//     React.MutableRefObject<T>    → useRef return type
// ============================================
