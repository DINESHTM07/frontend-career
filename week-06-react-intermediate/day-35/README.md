# Day 35 — Forms + Validation with React Hook Form

**Status:** 📋 READY TO START
**Week:** 6 | **Theme:** React Intermediate

---

## What You'll Learn Today

Building forms in React the "pure useState" way gets painful fast. Every field needs its own state variable, every validation needs manual checks, every error message needs manual wiring. A registration form with 6 fields and proper validation is 150+ lines of boilerplate.

**React Hook Form** solves this. It:
- Eliminates per-field `useState` (the library tracks values internally via refs)
- Provides a clean `register()` API to hook any input into the form
- Runs validation automatically with built-in rules (required, minLength, pattern)
- Gives you `formState.errors` for every field — no manual error state needed
- Only re-renders on submit, not on every keystroke (huge performance win)

By end of day you'll have:
- A production-quality registration form with full validation
- A 4-step form wizard (the kind every job application and checkout flow uses)

---

## Files to Open Today

1. **This README** — read first
2. `cheatsheets/react/10-forms.md` — read before coding
3. `exercises/react-basics/27-form-hell.jsx` — midday
4. Your React project — add new form components here

---

## Morning (8:00 – 11:00 AM) — Registration Form with Validation

### Step 1 — Install React Hook Form

```bash
cd week-05-react-basics/day-27/my-react-app
npm install react-hook-form
```

### Step 2 — Read the forms cheatsheet

Open `cheatsheets/react/10-forms.md` and read the full thing. Focus on:
- What `register()` does and why inputs don't need `value`/`onChange` anymore
- The `handleSubmit` wrapper and how it prevents default
- Validation rules syntax (`required`, `minLength`, `pattern`, `validate`)
- `formState.errors` — the shape of the error object
- `watch()` for reading field values (e.g., to compare password fields)

---

### Step 3 — Build the Registration Form

Create `src/pages/RegisterPage.jsx`:

```jsx
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm();

  const password = watch("password"); // watch password to compare in confirm field

  async function onSubmit(data) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", data);
  }

  if (isSubmitSuccessful) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2 style={{ color: "#10b981" }}>Account Created!</h2>
        <p>Check your email to verify your account.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "480px", margin: "0 auto" }}>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Name */}
        <Field label="Full Name" error={errors.name?.message}>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              maxLength: { value: 50, message: "Name must be under 50 characters" }
            })}
            placeholder="Dinesh S"
            style={inputStyle(errors.name)}
          />
        </Field>

        {/* Email */}
        <Field label="Email Address" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter a valid email address"
              }
            })}
            type="email"
            placeholder="dinesh@example.com"
            style={inputStyle(errors.email)}
          />
        </Field>

        {/* Password */}
        <Field label="Password" error={errors.password?.message}>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "Must contain uppercase, lowercase, and a number"
              }
            })}
            type="password"
            placeholder="••••••••"
            style={inputStyle(errors.password)}
          />
        </Field>

        {/* Confirm Password */}
        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
            type="password"
            placeholder="••••••••"
            style={inputStyle(errors.confirmPassword)}
          />
        </Field>

        {/* Role select */}
        <Field label="Role" error={errors.role?.message}>
          <select
            {...register("role", { required: "Please select a role" })}
            style={{ ...inputStyle(errors.role), background: "white" }}
          >
            <option value="">— select —</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </Field>

        {/* Terms checkbox */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <input
            {...register("terms", { required: "You must accept the terms" })}
            type="checkbox"
            id="terms"
            style={{ marginTop: "3px" }}
          />
          <label htmlFor="terms" style={{ fontSize: "14px" }}>
            I agree to the Terms of Service
            {errors.terms && (
              <span style={{ color: "#ef4444", display: "block", fontSize: "13px" }}>
                {errors.terms.message}
              </span>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px",
            background: isSubmitting ? "#a5b4fc" : "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: isSubmitting ? "default" : "pointer"
          }}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

      </form>
    </div>
  );
}

// Reusable field wrapper
function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: "block", fontWeight: "500", marginBottom: "6px", fontSize: "14px" }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: "#ef4444", fontSize: "13px", margin: "4px 0 0" }}>{error}</p>
      )}
    </div>
  );
}

// Input border changes red on error
function inputStyle(error) {
  return {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  };
}
```

Add the route in `App.jsx`:
```jsx
import RegisterPage from './pages/RegisterPage.jsx'
// ...
<Route path="/register" element={<RegisterPage />} />
```

**Test every validation rule:**
- Submit empty — every field shows its required error
- Enter a short name — shows minLength error
- Enter invalid email — shows pattern error
- Enter a weak password — shows pattern error
- Enter non-matching confirmPassword — shows custom validate error
- Leave terms unchecked — shows checkbox error
- Fill everything correctly — form "submits" (simulated 1.5s delay), success screen appears

---

## Mid-Morning Break (11:00 – 11:20 AM)

---

## Midday (11:20 AM – 1:00 PM) — Multi-Step Form Exercise

### `exercises/react-basics/27-form-hell.jsx`

**Pattern: State Machine / Multi-step**

This is a 4-step form wizard. Step 1: personal info. Step 2: account details. Step 3: preferences. Step 4: review + submit.

A progress bar shows which step you're on. You can go back to previous steps. The final step shows a summary of all entered data before submitting.

Create `src/pages/MultiStepForm.jsx` and work through the exercise here.

**Key insight for multi-step forms:** Don't use one giant `useForm` — use `useForm` per step, or use a `mode: "onChange"` approach with manual step validation:

```jsx
const { trigger } = useForm();

async function goToNextStep() {
  // Validate only the fields in the current step before advancing
  const fieldsToValidate = stepFields[currentStep];
  const isValid = await trigger(fieldsToValidate);
  if (isValid) setCurrentStep(prev => prev + 1);
}
```

Work through INTRO → GUIDED → YOUR TURN. The BOSS CHALLENGE: add "Save and continue later" that persists form data to localStorage.

---

## Afternoon (2:00 – 4:00 PM) — DSA

Open `dsa-bank/stacks.md`. Solve **problems 3, 4, and 5**.

Create `day-35-dsa.js` in the `week-06-react-intermediate/day-35/` folder.

---

## Wrap Up (4:15 – 5:45 PM)

Write in `journal.md`:
- What does `...register("email", { required: "..." })` actually spread onto the input?
- Why is `watch("password")` needed for the confirm password validation?
- How does `handleSubmit` work — what does it do before calling your `onSubmit` function?
- Confidence: 1-5

Then commit:
```bash
git add .
git commit -m "Day 35: Forms + validation + multi-step form + 3 DSA"
git push origin main
```

---

## End of Day Checklist

- [ ] Installed `react-hook-form`
- [ ] Read `cheatsheets/react/10-forms.md` in full
- [ ] Built `RegisterPage.jsx` with 5 fields + terms checkbox
- [ ] All validation rules working: required, minLength, pattern, validate
- [ ] Confirm password uses `validate` with `watch("password")` comparison
- [ ] Form shows loading state during submit (`isSubmitting`)
- [ ] Success screen appears after submit (`isSubmitSuccessful`)
- [ ] Inputs get red border when their field has an error
- [ ] Completed `27-form-hell.jsx` 4-step form wizard
- [ ] Progress bar shows current step
- [ ] Back/Next buttons navigate steps
- [ ] Final step shows review of all data before submit
- [ ] Solved 3 DSA problems in `day-35-dsa.js`
- [ ] Committed and pushed

---

## Quick Reference — React Hook Form

```jsx
import { useForm } from 'react-hook-form'

const { register, handleSubmit, watch, formState: { errors } } = useForm();

// Register an input (spreads name, onChange, onBlur, ref onto the input)
<input {...register("email", {
  required: "Email is required",
  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email" }
})} />

// Error message
{errors.email && <p>{errors.email.message}</p>}

// Watch a field value (useful for cross-field validation)
const password = watch("password");

// Custom validation
{...register("confirmPassword", {
  validate: value => value === password || "Passwords don't match"
})}

// Submit handler (runs only if all validation passes)
<form onSubmit={handleSubmit(async (data) => {
  await sendToServer(data);
})}>
```

---

*Forms are on every job listing. "Build a login page." "Build a checkout form." "Validate user input." React Hook Form is now how you answer all of those.*
