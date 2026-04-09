# Day 57 Tasks — Shadcn/UI Setup + Beautiful UI Components

## Morning Block (8:00 – 11:00 AM) — Shadcn Setup
- [ ] In `my-nextjs-app`: run `npx shadcn@latest init`
- [ ] Select: Style → Default, Base color → Slate, CSS variables → Yes
- [ ] Confirm: `src/components/ui/` folder created
- [ ] Confirm: `src/lib/utils.ts` created with `cn()` function
- [ ] Open `src/lib/utils.ts` — write down in your own words what `cn()` does
- [ ] Open `tailwind.config.ts` — note the CSS variable additions from Shadcn init
- [ ] Open `src/app/globals.css` — note the CSS variable definitions in `:root` and `.dark`
- [ ] Run: `npx shadcn@latest add button`
- [ ] Run: `npx shadcn@latest add card`
- [ ] Run: `npx shadcn@latest add input`
- [ ] Run: `npx shadcn@latest add badge`
- [ ] Run: `npx shadcn@latest add dialog`
- [ ] Run: `npx shadcn@latest add table`
- [ ] Open `src/components/ui/button.tsx` — read it fully, understand `cva` variants
- [ ] Open `src/components/ui/card.tsx` — read it, understand the sub-components pattern

## Midday Block (11:20 AM – 1:30 PM) — Build the Demo Page
- [ ] Create `src/app/components-demo/page.tsx`
  - [ ] Import and use `Button` (at least 3 variants)
  - [ ] Import and use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
  - [ ] Import and use `Input` with placeholder
  - [ ] Import and use `Badge` with `default` and `secondary` variants
  - [ ] Import and use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
  - [ ] Data for table comes from a local array (3+ rows)
- [ ] Create `src/components/AddPostDialog.tsx` — `'use client'` component
  - [ ] `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
  - [ ] `Input` inside the dialog for post title
  - [ ] Submit button disabled when title is empty
- [ ] Confirm: "Add Post" button opens dialog
- [ ] Confirm: pressing Esc closes the dialog
- [ ] Confirm: Submit button is disabled when input is empty
- [ ] Confirm: Badge renders green for 'published', gray for 'draft'
- [ ] Page looks genuinely professional — not like a tutorial project
- [ ] Try: `<Button variant="destructive">Delete</Button>` — confirm red styling

## Afternoon Block (1:30 – 3:00 PM) — DSA
- [ ] Create `day-57-dsa.js` in `week-09-nextjs-tailwind/day-57/`
- [ ] Solve Problem 1 — write solution + explain time complexity in a comment
- [ ] Solve Problem 2 — write solution + explain time complexity in a comment
- [ ] Solve Problem 3 — write solution + explain time complexity in a comment

## Wrap Up
- [ ] Run: `git add . && git commit -m "Day 57: Shadcn/UI setup + 6 components + demo page + DSA"`
