# Week 10 — Project 3 + Testing (Days 62–68)

**Status:** 📋 CURRICULUM PLANNED — Start when you reach this week
**Theme:** Build a portfolio-quality Next.js project and learn real-world testing

## Project 3 — Choose One
Pick based on what interests you most:
- **Dev Blog** — Next.js + MDX + full-text search + code syntax highlighting
- **Job Board** — listings, filtering, saved jobs, apply flow (mock)
- **Recipe Finder** — search, ingredient filtering, favourites, shopping list

## Testing Stack
- **Vitest** — fast unit testing (Vite-native, Jest-compatible)
- **React Testing Library** — component testing via user interactions
- **MSW (optional)** — mock API handlers for integration tests

## Daily Plan

| Day | Focus | Deliverable |
|-----|-------|------------|
| 62 | Project 3 setup + feature breakdown + data model | App shell with routing |
| 63 | Core features — the main screen works | 60% feature-complete |
| 64 | Remaining features + polish | 100% feature-complete |
| 65 | Unit tests with Vitest — utility functions and hooks | 10 passing tests |
| 66 | Component tests with RTL — user interactions | 10 component tests |
| 67 | Integration tests — full user flows | 5 flow tests, Lighthouse 90+ |
| 68 | Deploy to Vercel + portfolio update | Live URL |

## Install Testing Stack
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```
