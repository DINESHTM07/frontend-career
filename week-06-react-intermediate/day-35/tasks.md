# Day 35 Tasks — Forms + Validation with React Hook Form

## Morning Block (8:00 – 11:00 AM)
- [ ] Run: `npm install react-hook-form` in your React project
- [ ] Read `cheatsheets/react/10-forms.md` fully — focus on register, errors, watch, validate
- [ ] Create `src/pages/RegisterPage.jsx`
- [ ] Import `useForm` and destructure: `register`, `handleSubmit`, `watch`, `formState`
- [ ] Add `<form onSubmit={handleSubmit(onSubmit)} noValidate>`
- [ ] Field 1: Full Name — `required` + `minLength: 2` + `maxLength: 50`
- [ ] Field 2: Email — `required` + `pattern` regex for email format
- [ ] Field 3: Password — `required` + `minLength: 8` + `pattern` for complexity
- [ ] Field 4: Confirm Password — `validate: value => value === watch("password") || "Passwords do not match"`
- [ ] Field 5: Role — `<select>` with `required` validation
- [ ] Field 6: Terms checkbox — `required: "You must accept the terms"`
- [ ] Build reusable `Field` wrapper component (label + error message slot)
- [ ] `inputStyle(error)` function — returns red border when field has an error
- [ ] Submit button: disabled when `isSubmitting`, shows "Creating account..." text
- [ ] Success screen: render when `isSubmitSuccessful` is true
- [ ] Add route `/register` in App.jsx, link in Navbar
- [ ] Test: submit empty form — every field shows its required error
- [ ] Test: enter weak password — pattern error shows
- [ ] Test: mismatched confirmPassword — custom validate error shows
- [ ] Test: valid data — 1.5s simulated delay, success screen appears

## Midday Block (11:20 AM – 1:00 PM)
- [ ] Open `exercises/react-basics/27-form-hell.jsx`
- [ ] Create `src/pages/MultiStepForm.jsx`
- [ ] State: `currentStep` (0–3), collected `formData` object
- [ ] Render step-specific fields based on `currentStep`
- [ ] Progress bar: 4 segments, filled up to current step
- [ ] "Next" button: validate current step fields with `trigger(stepFieldNames)` before advancing
- [ ] "Back" button: decrement `currentStep` — no validation needed to go back
- [ ] Step 4: Review screen showing all entered data before final submit
- [ ] Final submit: `handleSubmit(onSubmit)` — log data, show success
- [ ] BOSS CHALLENGE: save form state to localStorage on each "Next" — restore on page refresh
- [ ] Add route `/signup` in App.jsx

## Afternoon Block (2:00 – 4:00 PM)
- [ ] Create `day-35-dsa.js` in `week-06-react-intermediate/day-35/`
- [ ] Open `dsa-bank/stacks.md`
- [ ] Solve Problem 3 — pattern + complexity
- [ ] Solve Problem 4 — pattern + complexity
- [ ] Solve Problem 5 — pattern + complexity

## Wrap Up (4:15 – 5:45 PM)
- [ ] Write in `journal.md` — what register spreads, why watch is needed, how handleSubmit works, confidence 1-5
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Day 35: Forms + validation + multi-step form + 3 DSA"`
- [ ] Run: `git push origin main`

## Stretch Goals
- [ ] Add `zod` schema validation: `npm install @hookform/resolvers zod` — define form schema
- [ ] Add a password strength indicator bar that updates as you type
- [ ] Add `useFieldArray` for a dynamic "add a skill" section with + / − buttons
- [ ] Research: what is the difference between controlled and uncontrolled inputs in React?
