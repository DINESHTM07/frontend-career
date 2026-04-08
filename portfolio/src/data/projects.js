/**
 * PROJECTS DATA
 * ─────────────────────────────────────────────────────────────
 * This is the ONLY file you need to edit to add or update projects.
 * Changes here automatically appear in the Projects section.
 *
 * Each project object:
 *  id          - unique slug (used as React key)
 *  title       - project name shown on the card
 *  description - 1-2 sentence summary shown on the card
 *  image       - path to screenshot in /public/projects/  (or '' for placeholder)
 *  tags        - tech stack array — shown as colored badges
 *  liveUrl     - deployed URL  ('' to hide the button)
 *  githubUrl   - GitHub repo URL ('' to hide the button)
 *  featured    - true → shown first, gets a slightly larger card treatment
 * ─────────────────────────────────────────────────────────────
 */

export const projects = [
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description:
      'A full-featured analytics dashboard with real-time charts, KPI cards, date filtering, and dark mode. Built with Recharts and TanStack Query.',
    image: '',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'TanStack Query'],
    liveUrl: '',
    githubUrl: 'https://github.com/DINESHTM07/frontend-career',
    featured: true,
  },
  {
    id: 'ecommerce-store',
    title: 'E-Commerce Store',
    description:
      'A responsive shopping experience with cart management, product filtering, search, and a checkout flow. State managed with Zustand.',
    image: '',
    tags: ['React', 'Zustand', 'React Router', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/DINESHTM07/frontend-career',
    featured: true,
  },
  {
    id: 'portfolio-site',
    title: 'Developer Portfolio',
    description:
      'This site — built with React, Tailwind CSS, and Framer Motion. Fully responsive with dark mode, smooth scroll animations, and a contact form.',
    image: '',
    tags: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    liveUrl: '',
    githubUrl: 'https://github.com/DINESHTM07/frontend-career',
    featured: false,
  },
]
