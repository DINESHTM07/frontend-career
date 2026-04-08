# Dinesh S — Portfolio

A complete personal portfolio website built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

- **React 18** — UI framework
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — scroll animations & transitions
- **Lucide React** — icons
- **Formspree** — contact form backend (free tier)

## Getting Started

```bash
# 1. Install dependencies
cd portfolio
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   └── projects/        ← drop project screenshots here (e.g. analytics-dashboard.png)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Book.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── projects.js   ← EDIT THIS to add/update projects
│   ├── hooks/
│   │   └── useDarkMode.js
│   ├── utils/
│   │   └── animations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## How to Add a New Project

Open **`src/data/projects.js`** and add an entry to the `projects` array:

```js
{
  id:          'my-project',                 // unique slug
  title:       'My New Project',
  description: 'What it does in 1-2 sentences.',
  image:       '/projects/my-project.png',   // or '' for placeholder
  tags:        ['React', 'TypeScript'],
  liveUrl:     'https://my-project.vercel.app',
  githubUrl:   'https://github.com/DINESHTM07/my-project',
  featured:    false,                        // true → shown in top row
}
```

Place the screenshot at `public/projects/my-project.png`. That's it — no other changes needed.

## Personalization Checklist

- [ ] `src/components/Book.jsx` — update `BOOK.title`, `BOOK.description`, `BOOK.publishUrl`, `BOOK.coverImage`
- [ ] `src/components/Contact.jsx` — update `FORMSPREE_URL` and `SOCIALS` email/LinkedIn
- [ ] `src/components/Footer.jsx` — update social links
- [ ] `src/components/Hero.jsx` — update GitHub/LinkedIn href values
- [ ] `src/data/projects.js` — replace placeholder projects with real ones
- [ ] `public/projects/` — add real screenshots
- [ ] `index.html` — update `og:description` meta tag

## Setting Up Formspree (Contact Form)

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get a URL like `https://formspree.io/f/xyzabcde`
3. Paste it into `FORMSPREE_URL` in `src/components/Contact.jsx`
4. Done — form submissions go straight to your email

## Deploying

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# drag the dist/ folder to netlify.com/drop
```

### GitHub Pages
Add `base: '/repo-name/'` to `vite.config.js`, then run:
```bash
npm run build
# push dist/ to the gh-pages branch
```

## Dark Mode

Dark mode is toggled via the moon/sun icon in the navbar. The preference persists in `localStorage` and respects the system's `prefers-color-scheme` on first visit.
