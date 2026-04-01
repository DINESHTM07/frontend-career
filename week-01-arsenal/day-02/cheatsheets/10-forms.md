# React Forms Cheatsheet

## CONCEPT
React has two approaches to form inputs:

- **Controlled components**: React state is the single source of truth. Every keystroke updates state via `onChange`.
- **Uncontrolled components**: The DOM holds the value. You read it with a ref when needed (e.g., on submit).

For complex forms, **React Hook Form** eliminates most of the boilerplate and re-renders.

---

## WHY IT MATTERS
Forms are everywhere in UIs. Handling them poorly leads to inconsistent validation, excessive re-renders on every keystroke, and scattered error logic. Understanding the controlled/uncontrolled distinction and knowing when to reach for a library is essential.

---

## EXAMPLES

### 1. Controlled vs. Uncontrolled Components

```jsx
import { useState, useRef } from 'react';

// CONTROLLED: React state drives the input value
function ControlledInput() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}                         // React controls the value
      onChange={e => setName(e.target.value)} // update state on every keystroke
    />
  );
  // Pro: instant access to value, can validate/transform on every change
  // Con: re-render on every keystroke (usually fine, rarely a problem)
}

// UNCONTROLLED: DOM controls the value, you read it with a ref
function UncontrolledInput() {
  const inputRef = useRef(null);

  function handleSubmit() {
    console.log(inputRef.current.value); // read when needed
  }

  return (
    <>
      <input ref={inputRef} defaultValue="initial value" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
  // Pro: no re-renders, simpler for one-time reads
  // Con: can't react to changes, harder to validate, can't set value programmatically
}
```

### 2. Handling Text, Select, Checkbox, and Radio

```jsx
import { useState } from 'react';

function AllInputTypes() {
  const [form, setForm] = useState({
    username:  '',
    role:      'viewer',
    agree:     false,
    plan:      'free',
  });

  // Generic change handler for text + select
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  return (
    <form>
      {/* Text input */}
      <input
        name="username"
        type="text"
        value={form.username}
        onChange={handleChange}
      />

      {/* Select */}
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      {/* Checkbox — use "checked" not "value" */}
      <input
        name="agree"
        type="checkbox"
        checked={form.agree}
        onChange={handleChange}
      />

      {/* Radio buttons — same name, different values */}
      <label>
        <input
          name="plan"
          type="radio"
          value="free"
          checked={form.plan === 'free'}
          onChange={handleChange}
        /> Free
      </label>
      <label>
        <input
          name="plan"
          type="radio"
          value="pro"
          checked={form.plan === 'pro'}
          onChange={handleChange}
        /> Pro
      </label>
    </form>
  );
}
```

### 3. Form Submission with preventDefault

```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // ALWAYS: prevents browser from reloading the page

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      // navigate to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

### 4. React Hook Form — Setup and register

```bash
npm install react-hook-form
```

```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const {
    register,       // connects input to RHF
    handleSubmit,   // wraps your submit handler
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    // data = { username: '...', email: '...', password: '...' }
    // called only if ALL validation passes
    await createUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register(name, validationRules) */}
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'At least 3 characters' },
        })}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username.message}</p>}

      <input
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'At least 8 characters' },
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create account'}
      </button>
    </form>
  );
}
// Key advantage: zero re-renders on keystroke — RHF uses uncontrolled inputs internally.
```

### 5. Zod Schema Validation with React Hook Form

```bash
npm install zod @hookform/resolvers
```

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema with Zod
const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  email: z
    .string()
    .email('Must be a valid email'),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int()
    .min(18, 'Must be 18 or older')
    .max(120),
  website: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')), // allow empty string
});

// TypeScript: type ProfileForm = z.infer<typeof profileSchema>;

function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema), // Zod handles ALL validation
    defaultValues: { name: '', email: '', age: 0, website: '' },
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('age', { valueAsNumber: true })} type="number" />
      {errors.age && <p>{errors.age.message}</p>}

      <input {...register('website')} placeholder="Website (optional)" />
      {errors.website && <p>{errors.website.message}</p>}

      <button type="submit">Save profile</button>
    </form>
  );
}
```

### 6. Displaying Error Messages — Patterns

```jsx
import { useForm } from 'react-hook-form';

// Pattern 1: inline under each field (most common)
function InlineErrors() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div className="field">
        <label>Email</label>
        <input
          {...register('email', { required: 'Email is required' })}
          className={errors.email ? 'input--error' : ''}
          aria-describedby="email-error"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span id="email-error" role="alert" className="error-text">
            {errors.email.message}
          </span>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

// Pattern 2: summary at top of form
function SummaryErrors() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const errorMessages = Object.values(errors).map(e => e.message);

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {errorMessages.length > 0 && (
        <ul className="error-summary" role="alert">
          {errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      )}
      <input {...register('name', { required: 'Name is required' })} />
      <input {...register('email', { required: 'Email is required' })} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 7. Multi-field Form with useForm defaultValues

```jsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const checkoutSchema = z.object({
  firstName:   z.string().min(1),
  lastName:    z.string().min(1),
  email:       z.string().email(),
  address:     z.string().min(5),
  city:        z.string().min(1),
  zipCode:     z.string().regex(/^\d{5}$/, 'Must be 5 digits'),
  cardNumber:  z.string().regex(/^\d{16}$/, 'Must be 16 digits'),
  saveDetails: z.boolean(),
});

function CheckoutForm({ user }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName:   user?.firstName ?? '',
      lastName:    user?.lastName ?? '',
      email:       user?.email ?? '',
      address:     '',
      city:        '',
      zipCode:     '',
      cardNumber:  '',
      saveDetails: false,
    },
    mode: 'onBlur', // validate when user leaves a field (not on every keystroke)
  });

  const saveDetails = watch('saveDetails'); // watch a specific field value

  return (
    <form onSubmit={handleSubmit(submitOrder)}>
      <fieldset>
        <legend>Personal Info</legend>
        <input {...register('firstName')} placeholder="First name" />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <input {...register('lastName')} placeholder="Last name" />
        <input {...register('email')} type="email" placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </fieldset>

      <fieldset>
        <legend>Shipping</legend>
        <input {...register('address')} placeholder="Address" />
        <input {...register('city')}    placeholder="City" />
        <input {...register('zipCode')} placeholder="ZIP" />
        {errors.zipCode && <p>{errors.zipCode.message}</p>}
      </fieldset>

      <fieldset>
        <legend>Payment</legend>
        <input {...register('cardNumber')} placeholder="Card number (16 digits)" />
        {errors.cardNumber && <p>{errors.cardNumber.message}</p>}
      </fieldset>

      <label>
        <input type="checkbox" {...register('saveDetails')} />
        Save details for next time
      </label>
      {saveDetails && <p>Details will be saved securely.</p>}

      <button type="submit" disabled={!isValid || !isDirty}>
        Place Order
      </button>
    </form>
  );
}
```

### 8. Dynamic Form Fields with useFieldArray

```jsx
import { useForm, useFieldArray } from 'react-hook-form';

// useFieldArray manages arrays of fields (add/remove rows dynamically)
function InvoiceForm() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      clientName: '',
      items: [{ description: '', quantity: 1, price: 0 }], // start with one row
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,   // pass control from useForm
    name: 'items', // name of the array field
  });

  const items = watch('items');
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('clientName')} placeholder="Client name" />

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}> {/* field.id is stable — use it as key, not index */}
              <td>
                <input
                  {...register(`items.${index}.description`, { required: true })}
                  placeholder="Item description"
                />
              </td>
              <td>
                <input
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  min="1"
                />
              </td>
              <td>
                <input
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1} // keep at least one row
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => append({ description: '', quantity: 1, price: 0 })}
      >
        Add item
      </button>

      <p>Total: ${total.toFixed(2)}</p>
      <button type="submit">Send invoice</button>
    </form>
  );
}
```

---

## QUICK REFERENCE

| Scenario | Approach |
|----------|----------|
| Simple 1-2 field form | `useState` controlled inputs |
| Complex multi-field form | `react-hook-form` |
| Rich validation rules | `zod` + `@hookform/resolvers` |
| Dynamic add/remove rows | `useFieldArray` |
| One-time read on submit | Uncontrolled + `useRef` |
| Watch a field's value | `watch('fieldName')` from RHF |

**Key RHF hooks/helpers:**

| API | Purpose |
|-----|---------|
| `register(name, rules)` | Connect input, define validation |
| `handleSubmit(fn)` | Runs fn only if validation passes |
| `formState.errors` | Object of validation errors |
| `formState.isSubmitting` | True while submit fn is running |
| `formState.isValid` | True when no errors |
| `watch(name)` | Subscribe to a field's current value |
| `setValue(name, value)` | Programmatically update a field |
| `reset(values)` | Reset form to default values |
| `useFieldArray` | Dynamic array of fields |
