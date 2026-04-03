# Shadcn/UI Cheatsheet

---

## CONCEPT

Shadcn/UI is **NOT a component library** you install as a dependency. It's a **collection of re-usable components that you copy into your own codebase**. When you run `npx shadcn-ui@latest add button`, it copies the Button source code into your `components/ui/` folder. You own the code — you can read it, modify it, and customize it completely.

Built on:
- **Radix UI** — accessible, unstyled primitives (handles keyboard nav, ARIA, focus management)
- **Tailwind CSS** — styling
- **class-variance-authority (CVA)** — variant management
- **clsx + tailwind-merge** — conditional class merging

---

## WHY IT MATTERS

- **You own the code** — no waiting for library updates for a simple tweak.
- **Fully accessible** — Radix primitives handle ARIA out of the box.
- **Customizable** — change colors, spacing, variants to match your design.
- **Industry standard** — used in most new Next.js projects; Vercel uses it internally.
- Knowing shadcn means knowing how production component libraries are actually built.

---

## EXAMPLES

### 1. Installation with Next.js

```bash
# New Next.js project
npx create-next-app@latest my-app --typescript --tailwind --eslint

# Initialize shadcn
npx shadcn-ui@latest init

# Answer the prompts:
# - Style: Default (or New York for sharper look)
# - Base color: Slate / Gray / etc.
# - CSS variables: Yes (recommended)
# - Components path: @/components/ui (default)
```

This creates:
```
components/
└── ui/           ← shadcn components land here
lib/
└── utils.ts      ← cn() helper (clsx + tailwind-merge)
tailwind.config.ts ← updated with CSS variables
app/globals.css   ← CSS variables for colors (--background, --foreground, etc.)
```

### 2. Adding components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add table
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add form
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast

# Or add multiple at once
npx shadcn-ui@latest add button card input dialog
```

### 3. Button — variants, sizes, asChild

```tsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><TrashIcon /></Button>

// Loading state (add manually — shadcn gives you the code)
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// asChild — renders as a Link instead of <button>
import Link from 'next/link'
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
// Renders: <a href="/dashboard" class="btn styles...">Go to Dashboard</a>
```

### 4. Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
    <CardDescription>Manage your account preferences.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### 5. Input + Label

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

// With error state
<div className="space-y-2">
  <Label htmlFor="email" className={error ? 'text-destructive' : ''}>
    Email
  </Label>
  <Input
    id="email"
    type="email"
    className={error ? 'border-destructive' : ''}
    aria-invalid={!!error}
  />
  {error && <p className="text-sm text-destructive">{error}</p>}
</div>
```

### 6. Dialog (modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Trigger-based (recommended — no state needed for basic usage)
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Form content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog (with state)
const [open, setOpen] = useState(false)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Delete Account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 7. Sheet (slide-over panel)

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </SheetTrigger>
  <SheetContent side="right">   {/* side: top | right | bottom | left */}
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
      <SheetDescription>Browse the site</SheetDescription>
    </SheetHeader>
    <nav className="flex flex-col gap-4 mt-6">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  </SheetContent>
</Sheet>
```

### 8. Toast / Sonner for notifications

```tsx
// shadcn now recommends Sonner (simpler) over the built-in Toast

// Install
npx shadcn-ui@latest add sonner

// Setup in root layout
import { Toaster } from '@/components/ui/sonner'
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

// Usage anywhere in the app
import { toast } from 'sonner'

toast('Event saved!')
toast.success('Profile updated')
toast.error('Something went wrong')
toast.warning('Low disk space')
toast.loading('Saving...')
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
})
```

### 9. Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>
```

### 10. Form with React Hook Form integration

```tsx
// Install
npx shadcn-ui@latest add form
npm install react-hook-form zod @hookform/resolvers

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'At least 3 characters'),
})

type FormValues = z.infer<typeof schema>

export function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', username: '' },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>Your email address.</FormDescription>
              <FormMessage />  {/* Shows validation errors */}
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### 11. Skeleton for loading states

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Match the shape of the content it replaces
function PostCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />  {/* image */}
      <Skeleton className="h-4 w-3/4" />               {/* title */}
      <Skeleton className="h-4 w-1/2" />               {/* subtitle */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />  {/* avatar */}
        <Skeleton className="h-4 w-24" />              {/* name */}
      </div>
    </div>
  )
}
```

---

## COMMON MISTAKES

1. **Treating it like a regular npm package** — You can't `import Button from 'shadcn-ui'`. You import from your local `@/components/ui/button` because you own the code.

2. **Not running `npx shadcn-ui@latest init` first** — Components depend on the `cn()` utility and CSS variables set up during init. Add components before init and nothing works.

3. **Customizing by adding Tailwind classes directly** — Instead, open the component file and modify it. It's your code now.

4. **Forgetting `asChild`** — `asChild` merges the component's styles with its child element. Without it, you get a button wrapping another element (double-click target, invalid HTML).

5. **Not including `<Toaster />` in layout** — Toast/Sonner requires the `<Toaster />` component mounted somewhere in the tree (usually root layout). Forgetting it means toasts never appear.

6. **Using the old toast pattern** — The `useToast` hook is the older pattern. New projects should use Sonner (`toast.success()`).

7. **Modifying components without reading them first** — Since you own the code, read `components/ui/button.tsx` before adding variants. CVA makes it easy to add new variants correctly.

---

## INTERVIEW TIP

> "What's your approach to UI components? Do you use a component library?"

**Answer framework:**
- "I use shadcn/UI as a starting point — it gives accessible, well-structured components based on Radix UI, but because it copies code into my project, I have full control to customize without fighting library constraints."
- "I understand that shadcn is not an npm package — I can read the source, add variants with CVA, and adapt the styles to match the design."
- "For forms, I combine shadcn's Form component with React Hook Form and Zod for type-safe validation."
- **Key differentiator**: Mention you know it's built on Radix UI for accessibility and that you've customized components (not just used defaults). This shows depth.
