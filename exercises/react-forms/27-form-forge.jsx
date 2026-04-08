/**
 * Exercise 27 — Form Forge
 * ─────────────────────────────────────────────────────────────
 * Build 3 forms from scratch — controlled, validated, and library-powered.
 *
 * Run: paste into a Vite React app
 * Install for Part 3: npm install react-hook-form zod @hookform/resolvers
 */

import { useState } from 'react'

// ─── PART 1: Controlled Form (plain React) ──────────────────────────────────
// Build a registration form with these fields:
//   - Full Name (required, min 2 chars)
//   - Email (required, must be valid email format)
//   - Password (required, min 8 chars)
//   - Confirm Password (must match Password)
//
// Requirements:
//   - Validate on submit (not on every keystroke)
//   - Show inline error messages below each field
//   - Disable submit button while there are errors
//   - Show a success message on valid submit
//   - Reset form after successful submit

function ControlledForm() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (vals) => {
    const errs = {}
    if (!vals.name || vals.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!vals.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) errs.email = 'Enter a valid email'
    if (!vals.password || vals.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (vals.confirm !== vals.password) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
      setValues({ name: '', email: '', password: '', confirm: '' })
    }
  }

  // TODO: render the form with labels, inputs, error messages, and success state

  return (
    <div>
      <h2>Part 1 — Controlled Form</h2>
      {submitted && <p style={{ color: 'green' }}>Registered successfully!</p>}
      <form onSubmit={handleSubmit}>
        {/* TODO: Full Name field */}
        {/* TODO: Email field */}
        {/* TODO: Password field */}
        {/* TODO: Confirm Password field */}
        {/* TODO: Submit button — disabled if errors exist */}
      </form>
    </div>
  )
}


// ─── PART 2: Dynamic Form (field array) ─────────────────────────────────────
// Build an "experience" form where users can add/remove job entries.
// Each entry has: Company Name, Role, Start Year, End Year (or "Present" checkbox)
//
// Requirements:
//   - "Add Experience" button adds a new empty entry
//   - "Remove" button on each entry removes it
//   - Minimum 1 entry must remain (disable Remove if only 1 left)
//   - Console.log the array of entries on submit

function DynamicForm() {
  const empty = { company: '', role: '', start: '', end: '', present: false }
  const [entries, setEntries] = useState([{ ...empty }])

  const addEntry = () => setEntries(prev => [...prev, { ...empty }])

  const removeEntry = (i) => setEntries(prev => prev.filter((_, idx) => idx !== i))

  const updateEntry = (i, field, value) => {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Experience entries:', entries)
  }

  return (
    <div>
      <h2>Part 2 — Dynamic Form (Field Array)</h2>
      <form onSubmit={handleSubmit}>
        {entries.map((entry, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 6 }}>
            <p>Entry {i + 1}</p>
            {/* TODO: Company input */}
            {/* TODO: Role input */}
            {/* TODO: Start year input */}
            {/* TODO: End year input (disabled if present is checked) */}
            {/* TODO: Present checkbox */}
            {/* TODO: Remove button (disabled if only 1 entry) */}
          </div>
        ))}
        <button type="button" onClick={addEntry}>+ Add Experience</button>
        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}


// ─── PART 3: React Hook Form + Zod ──────────────────────────────────────────
// Rebuild Part 1's registration form using:
//   - react-hook-form for form state management
//   - zod for schema validation
//   - @hookform/resolvers/zod as the adapter
//
// Why this matters: this is the industry-standard pattern.
// Notice how much less code this is vs Part 1.

// Uncomment and complete after installing dependencies:
/*
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
}).refine(data => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

function RHFForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log('Valid data:', data)
    reset()
  }

  return (
    <div>
      <h2>Part 3 — React Hook Form + Zod</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        TODO: fields using register('name'), register('email'), etc.
        TODO: error messages from errors.name?.message, etc.
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
*/

function RHFForm() {
  return (
    <div>
      <h2>Part 3 — React Hook Form + Zod</h2>
      <p style={{ color: '#888' }}>
        Install dependencies first:
        <code style={{ display: 'block', marginTop: 8, background: '#f5f5f5', padding: 8 }}>
          npm install react-hook-form zod @hookform/resolvers
        </code>
        Then uncomment the code above.
      </p>
    </div>
  )
}


// ─── EXPORT ALL ─────────────────────────────────────────────────────────────
export default function FormForge() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Form Forge — Exercise 27</h1>
      <hr />
      <ControlledForm />
      <hr />
      <DynamicForm />
      <hr />
      <RHFForm />
    </div>
  )
}

/*
 * SOLUTIONS CHECKLIST
 * ───────────────────
 * Part 1 Controlled:  [ ] validate on submit  [ ] inline errors  [ ] success state  [ ] reset
 * Part 2 Dynamic:     [ ] add entry  [ ] remove (min 1)  [ ] present toggle  [ ] console log
 * Part 3 RHF + Zod:   [ ] schema defined  [ ] resolver wired  [ ] errors displayed  [ ] reset on submit
 *
 * CONCEPTS PRACTICED
 * ──────────────────
 * - Controlled inputs (value + onChange)
 * - Validation logic (custom vs library)
 * - Dynamic field arrays
 * - react-hook-form register / handleSubmit / formState
 * - Zod schema + zodResolver
 */
