# Raffles Supit — Portfolio

Personal portfolio site built to the spec in [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md): a
single-page, editorial layout with a motion-first dark hero, light/dark theming, and
scroll-reveal sections for About, Experience, Projects, and Contact.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All site copy — name, bio, skills, experience, and projects — lives in one file:

```
src/lib/data.ts
```

Update that file to change what's on the page; the components render straight from it.

## Structure

- `src/app/globals.css` — design tokens (color, type scale, radius, shadow) as CSS custom
  properties, theme-switched via `[data-theme]` on `<html>`.
- `src/app/layout.tsx` — fonts (Space Grotesk / Inter / JetBrains Mono), metadata, and the
  no-flash theme script.
- `src/components/` — primitives (`Button`, `TextLink`, `SectionHeader`) and page sections
  (`Hero`, `About`, `Experience`, `Projects`, `Contact`).
- `src/components/hero-canvas.tsx` — the animated hero background (Canvas2D, client-only,
  degrades to a static frame under `prefers-reduced-motion` or if canvas fails to init).

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build (also type-checks)
npm run lint    # eslint
```

## Deploying

Any Next.js host works (Vercel is the zero-config option): `npm run build` then serve with
`npm run start`, or connect the repo to Vercel/Netlify for automatic deploys.
