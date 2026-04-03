# Deployment: Vercel, Netlify & Modern Frontend Hosting

---

## CONCEPT

Deployment is the process of making your local application available on the internet. Modern frontend hosting platforms (Vercel, Netlify) handle the hard parts: build servers, CDN distribution, SSL certificates, and preview environments. You push code → they build and deploy automatically.

**Key terms:**
- **CDN (Content Delivery Network)**: Files served from edge servers closest to the user, reducing latency.
- **Serverless function**: A backend function that runs on-demand without a persistent server.
- **Edge function**: Like serverless, but runs at CDN edge nodes — even closer to the user, cold start ~0ms.
- **Preview deployment**: A live URL generated for every pull request, for testing before merging.

---

## WHY IT MATTERS

- Every project in your portfolio needs to be live. Dead links = dead job application.
- Vercel is the standard for Next.js (built by the same team). Knowing it is expected.
- Preview deployments change how teams do code review — reviewers test the actual PR, not just read the diff.
- Environment variables, build configuration, and deployment pipelines are daily DevOps skills even for frontend devs.

---

## EXAMPLES

### 1. Deploy to Vercel from GitHub (step by step)

```
STEP 1 — Push your project to GitHub
  git init
  git add .
  git commit -m "initial commit"
  git remote add origin https://github.com/yourusername/my-project.git
  git push -u origin main

STEP 2 — Connect to Vercel
  1. Go to vercel.com → Sign up with GitHub
  2. Click "Add New Project"
  3. Select your GitHub repository from the list
  4. Click "Import"

STEP 3 — Configure build settings (Vercel usually auto-detects)
  Framework Preset: Next.js  (auto-detected)
  Root Directory: ./          (keep default unless monorepo)
  Build Command: next build   (auto-filled)
  Output Directory: .next     (auto-filled)
  Install Command: npm install

STEP 4 — Add environment variables
  Expand "Environment Variables"
  Add each variable:
    Name: DATABASE_URL
    Value: postgresql://...
    Environment: Production | Preview | Development (select all)
  Click "Add"
  Repeat for each variable

STEP 5 — Click "Deploy"
  Vercel runs: npm install → next build → deploys to CDN
  URL format: https://my-project-xyz.vercel.app

STEP 6 — Every git push to main auto-deploys from now on
```

### 2. Vercel environment variables

```bash
# Three environments in Vercel:
# - Production: main branch
# - Preview: all other branches (pull requests)
# - Development: local dev (you pull these with vercel env pull)

# In your Next.js code:
# Public (exposed to browser) — prefix with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Private (server-only) — no prefix
DATABASE_URL=postgresql://...
JWT_SECRET=supersecretvalue
STRIPE_SECRET_KEY=sk_live_...

# Access in code:
process.env.DATABASE_URL          // Server-side only
process.env.NEXT_PUBLIC_API_URL   // Available in browser too

# Pull env vars to local development
npm i -g vercel
vercel login
vercel link          # Link local project to Vercel project
vercel env pull      # Downloads .env.local with your Vercel env vars
```

### 3. Preview deployments for PRs

```
How it works:
  1. You create a branch: git checkout -b feature/dark-mode
  2. Push to GitHub: git push origin feature/dark-mode
  3. Open a PR on GitHub
  4. Vercel automatically builds the branch
  5. Posts a comment on the PR with a unique URL:
     https://my-project-feature-dark-mode.vercel.app
  6. Team reviews at the actual live URL, not just the code diff
  7. When PR is merged → preview deployment is retired

Benefits:
  - QA can test before merge
  - Designer can verify the implementation matches the mockup
  - No "it works on my machine" — everyone sees the same deployed version
  - Each preview is isolated — doesn't affect production
```

### 4. Custom domain setup on Vercel

```
STEP 1 — In Vercel dashboard:
  Project → Settings → Domains
  Click "Add Domain"
  Type: myapp.com
  Click "Add"
  Vercel shows you DNS records to add

STEP 2 — In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
  Go to DNS settings for your domain
  Add the records Vercel provides:

  Option A (recommended — use Vercel nameservers):
    Change nameservers to:
      ns1.vercel-dns.com
      ns2.vercel-dns.com

  Option B (keep your registrar's DNS):
    Add A record:  @ → 76.76.21.21
    Add CNAME:     www → cname.vercel-dns.com

STEP 3 — Wait for DNS propagation (minutes to 48 hours)
  Vercel auto-provisions SSL certificate (HTTPS) via Let's Encrypt
  yourapp.com → automatically redirects to https://yourapp.com
```

### 5. Build settings for different frameworks

```bash
# Next.js (App Router)
Build Command:   npm run build   (runs next build)
Output:          .next/
Install Command: npm install
Node Version:    18.x (set in Vercel project settings)

# Vite + React
Build Command:   npm run build   (runs vite build)
Output:          dist/
Install Command: npm install

# Create React App
Build Command:   npm run build
Output:          build/

# Static site (no build step)
Build Command:   (leave empty)
Output:          . or public/ or dist/

# Monorepo (e.g. apps/web)
Root Directory:  apps/web        ← IMPORTANT: set this
Build Command:   npm run build
```

### 6. Serverless vs Edge Functions

```tsx
// Serverless Function (Vercel) — runs in Node.js runtime
// File: app/api/hello/route.ts
export async function GET() {
  const data = await db.query(...)    // Can access databases, heavy npm packages
  return Response.json(data)
}
// Cold start: ~200-500ms | Region: single region (e.g. us-east-1)
// Use for: database queries, heavy computation, Node-specific packages

// Edge Function — runs at CDN edge, globally distributed
// File: app/api/hello/route.ts
export const runtime = 'edge'        // Add this line to make it an edge function

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country')
  return Response.json({ country })
}
// Cold start: ~0ms | Runs: globally at edge nodes near user
// Use for: auth middleware, geolocation, A/B testing, fast redirects
// Limitation: no Node.js APIs (no fs, no full ORM), Web APIs only
```

### 7. Netlify as an alternative

```
When to use Netlify over Vercel:
  - Not using Next.js (Gatsby, Astro, SvelteKit, plain React+Vite)
  - Need Netlify Forms (HTML forms with no backend)
  - Need Netlify Identity (simple auth)
  - Prefer Netlify's UI or pricing

Netlify deploy from GitHub:
  1. netlify.com → Add new site → Import from Git
  2. Choose GitHub → select repo
  3. Configure build settings (auto-detected for most frameworks)
  4. Deploy site

Netlify build settings for Vite:
  Build Command:  npm run build
  Publish dir:    dist
  Environment:    Add env vars in Site settings → Environment variables

Netlify vs Vercel comparison:
  Feature              Vercel          Netlify
  Next.js support      Best (built it) Good (community support)
  Edge network         150+ locations  100+ locations
  Preview deploys      Yes             Yes
  Serverless fns       Yes (Node/Edge) Yes (Node/Edge)
  Free tier            100GB/mo        100GB/mo
  Forms handling       No built-in     Yes (Netlify Forms)
  Split testing (A/B)  No              Yes
```

### 8. Vercel CLI for power users

```bash
# Install
npm i -g vercel

# Login
vercel login

# Link existing project
cd my-project
vercel link

# Deploy (without pushing to git)
vercel                  # Deploy to preview URL
vercel --prod           # Deploy to production

# Pull env variables
vercel env pull .env.local

# List deployments
vercel ls

# Inspect a deployment
vercel inspect <deployment-url>

# Roll back to a previous deployment
# In Vercel dashboard: Deployments → click older deployment → "Promote to Production"
# Or via CLI:
vercel rollback
```

---

## COMMON MISTAKES

1. **Committing `.env` to git** — Never commit secrets. Add `.env*` to `.gitignore` immediately. Use Vercel/Netlify's environment variable UI instead.

2. **Forgetting `NEXT_PUBLIC_` prefix for client-side variables** — Variables without this prefix are server-only. Accessing them in a Client Component returns `undefined`. No error is thrown.

3. **Setting env variables after deploying** — If you deploy first and add env vars after, the build already ran without them. Re-deploy after adding variables.

4. **Assuming Edge Functions work like Node.js** — Edge runtime doesn't have `fs`, `path`, or full ORM support. Prisma, for example, doesn't work in the edge runtime without special configuration.

5. **Not setting the Root Directory for monorepos** — If your app is in `apps/web/`, Vercel needs `Root Directory: apps/web` or it looks for `package.json` in the wrong place.

6. **Ignoring build logs when deployment fails** — Vercel shows full build logs. The error is always there — usually a missing env var, TypeScript error, or missing dependency.

7. **Using `npm run dev` output directory** — Dev servers output to memory, not disk. Always test `npm run build` locally before deploying to catch build-time errors.

---

## INTERVIEW TIP

> "How do you deploy a Next.js application? Walk me through your process."

**Answer framework:**
1. "I push to GitHub and connect the repo to Vercel — it auto-detects Next.js and configures the build."
2. "I configure environment variables in Vercel's dashboard, being careful to prefix public variables with `NEXT_PUBLIC_` and keep secrets without that prefix so they stay server-only."
3. "Each branch gets a preview deployment URL, which lets the team test PRs in a real environment before merging."
4. "For production, I set up a custom domain through Vercel's DNS settings, and SSL is provisioned automatically."
5. Bonus: Mention the distinction between Serverless and Edge runtimes and when you'd choose each — most juniors have never thought about this.
