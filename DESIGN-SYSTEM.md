# Design System Specification — Portfolio Website

Prepared as a senior UI/UX designer's handoff document for a senior frontend developer.
References: **stevenmengin.com** (dark, WebGL-driven, motion-first) and **thieb.co** (light,
editorial, structure-first). This document assumes **no existing project or code** — it is a
from-scratch specification. Stack assumption: Next.js + Tailwind CSS + Framer Motion (swap
freely; every token below is framework-agnostic).

## How to read this document

Every claim is tagged:

- **✅ Verified** — confirmed by directly fetching the live site or its Awwwards/press coverage.
  Quoted or cited where possible.
- **🎨 Design decision** — both reference sites are heavy client-rendered SPAs; exact hex values,
  `@font-face` rules, pixel paddings, and animation curves are **not extractable** from a text
  fetch (no browser/DOM access was available). Where marked 🎨, this is *my professional
  specification*, designed in the spirit of the verified facts — not a claim about the
  reference site's actual CSS. Do not present these as "the reference site uses X."

---

## 1. Design direction

| | stevenmengin.com | thieb.co |
|---|---|---|
| Verified facts | Awwwards tags: *Minimal, Portfolio, Single page, WebGL*. Site of the Day, monochrome ("Minimal, Black & WebGL"). Third-party review: opens on an "animated cloudscape effect," "bold typography," single-page, scroll/pagination navigation. ✅ | Header wordmark `"{Name} — {Role}"`, one-line intro, unlabeled bio paragraph, then labeled sections Experience → Awards → Press → Credits → project case studies with TYPE/COMPANY/ROLE/YEAR metadata. Typeface credited to "Displaay." Social links + email in header, no nav menu. ✅ |
| Design decision | Full-bleed black canvas, restrained monochrome palette, one large animated visual as the emotional opening beat. 🎨 | Neutral light background, black text, information-dense but generously spaced, typography carries the hierarchy (no heavy color, no card shadows). 🎨 |

**Synthesis for this spec:** a light, editorial, content-structured site (thieb.co's information
architecture) with the *option* of a dark, motion-forward opening moment (Mengin's opening beat)
— specified below as a distinct, optional hero treatment so the frontend team can choose either
or build both and A/B them.

---

## 2. Typography

Both reference typefaces are not freely licensable ("Displaay" is a paid foundry; Mengin's face
is not identifiable from a text fetch). 🎨 **Recommendation:**

| Role | Typeface | Why |
|---|---|---|
| Display / headings | **Space Grotesk** (Google Fonts, free, self-hostable via `next/font`) | Geometric, confident, bold weights available (500/700) — closest free match to the "bold typography" quality noted on both references, without licensing cost. |
| Body / UI | **Inter** (Google Fonts, free) | Best-in-class readability at small sizes, huge weight range, pairs cleanly against a geometric display face. |
| If budget allows | **PP Neue Montreal**, **PP Editorial New**, or an actual Displaay Type Foundry license | Closer visual fidelity to the references' premium feel — swap in later without restructuring the type scale below, since sizes/line-heights are typeface-agnostic. |

### Type scale

Fluid sizing via `clamp()` — scales smoothly between the mobile and desktop value, no breakpoint
jump. All values 🎨 design decisions (a standard ~1.25–1.333 modular scale).

| Token | Mobile | Desktop | Weight | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|---|
| `display-xl` | 40px | 96px (`clamp(2.5rem, 5vw + 1rem, 6rem)`) | 700 | 0.95 | -0.02em | Hero name/role, single hero-only moments |
| `display-l` | 32px | 56px | 700 | 1.05 | -0.01em | Section-opening statements ("Let's work together") |
| `h1` | 28px | 40px | 700 | 1.1 | -0.01em | Page titles |
| `h2` | 22px | 32px | 600 | 1.15 | 0 | Section headings ("Featured work") |
| `h3` | 18px | 24px | 600 | 1.25 | 0 | Card titles, sub-sections |
| `h4` | 16px | 20px | 600 | 1.3 | 0 | Minor headings |
| `body-lg` | 17px | 18px | 400 | 1.6 | 0 | Intro/lede paragraphs |
| `body` | 15px | 16px | 400 | 1.6 | 0 | Default paragraph text |
| `body-sm` | 13px | 14px | 400 | 1.5 | 0 | Secondary text, card descriptions |
| `caption` | 12px | 12px | 600 | 1.4 | **0.2em**, uppercase | Section micro-labels ("EXPERIENCE", "AWARDS") — thieb.co's confirmed all-caps label pattern ✅ |
| `meta` | 11px | 12px | 600 | 1.4 | 0.15em, uppercase | Project metadata row (TYPE · ROLE · YEAR) |

Font weights to load: 400, 500, 600, 700 for both families (skip 300/800/900 — unused, saves
bundle weight).

---

## 3. Color system

🎨 All values below are design decisions — informed by the verified "monochrome"/"black" facts
about Mengin and the verified "light, neutral" facts about thieb.co, not extracted from either
site's actual stylesheet.

### Light mode (primary/default)

| Token | Value | Use |
|---|---|---|
| `color-bg` | `#FAFAFA` | Page background |
| `color-surface` | `#FFFFFF` | Cards, elevated panels |
| `color-ink` (text primary) | `#0F1115` | Headings, primary text |
| `color-text-secondary` | `#57606A` (~gray-600) | Body copy, descriptions |
| `color-text-muted` | `#9AA1AC` (~gray-400) | Meta text, timestamps, placeholders |
| `color-border` | `#E5E7EB` (~gray-200) | Dividers, card borders, input borders |
| `color-accent` | `#6366F1` (indigo-500) | Links, focus rings, interactive affordances **only** — never a fill/background |

### Dark mode

| Token | Value | Use |
|---|---|---|
| `color-bg` | `#000000` | Matches Mengin's confirmed monochrome-black palette |
| `color-surface` | `#111113` | Cards on dark bg |
| `color-ink` | `#F5F5F5` | Primary text on dark |
| `color-text-secondary` | `#A1A1AA` | Body copy on dark |
| `color-text-muted` | `#6B7280` | Meta text on dark |
| `color-border` | `#27272A` | Dividers on dark |
| `color-accent` | `#818CF8` (indigo-400, lightened for contrast) | Same usage rules as light mode |

### Semantic (form/system states — both modes, standard practice)

| Token | Light | Dark |
|---|---|---|
| Success | bg `#F0FDF4` / text `#166534` | bg `#052E16` / text `#4ADE80` |
| Error | bg `#FEF2F2` / text `#B91C1C` | bg `#450A0A` / text `#F87171` |
| Warning | bg `#FFFBEB` / text `#92400E` | bg `#451A03` / text `#FBBF24` |

**Contrast requirement:** every text/background pairing above must clear **WCAG AA** (4.5:1 body
text, 3:1 large text/UI components). Verify with a contrast checker after final hex selection if
these exact values are adjusted during implementation.

**Color usage rule (informed by thieb.co's verified restraint — no heavy UI color, imagery
supplies the color):** `color-accent` appears only on: links, focus-visible rings, active nav
state, form validation. It is never a card/section background fill.

---

## 4. Spacing, layout, radius, elevation

🎨 All design decisions — standard, implementation-agnostic scales.

**Spacing scale** (4px base unit): `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px`
(`0.25rem` → `10rem`). Use consistently for padding/margin/gap — no arbitrary one-off values.

**Container widths:** content max-width `768px` (long-form text — bio, case study body),
`1024px` (project grids, section content), full-bleed for hero-only moments.

**Breakpoints:** `sm 640px · md 768px · lg 1024px · xl 1280px · 2xl 1536px` (industry-standard,
not reference-specific).

**Border radius:** `sm 4px · md 8px · lg 12px · full 9999px` (pills, avatars). Bias toward the
smaller end — thieb.co's editorial, "design studio" feel reads as more sharp-cornered than
rounded/friendly-SaaS. 🎨

**Elevation:** flat by default (no shadow at rest — matches the observed minimal aesthetic of
both references 🎨). On hover/interaction only:
`box-shadow: 0 8px 24px rgba(0,0,0,0.08)` (light mode) / `0 8px 24px rgba(0,0,0,0.4)` (dark mode).

---

## 5. Components

### 5.1 Buttons

Two paradigms — use both, per context:

**A. Solid button** (forms, primary conversion actions — e.g. "Send message"):

| State | Style |
|---|---|
| Default | `bg: color-ink`, `text: color-bg` (inverted), `padding: 12px 24px`, `radius: md`, `font: body, 600` |
| Hover | `bg` lightens 8% (light mode) / lightens 12% (dark mode); `transform: translateY(-1px)`; `transition: 200ms cubic-bezier(0.4,0,0.2,1)` |
| Active/pressed | `transform: translateY(0)`, `bg` darkens 4% |
| Focus-visible | `outline: none`; `box-shadow: 0 0 0 2px color-bg, 0 0 0 4px color-accent` (double-ring, visible on any background) |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, no hover transform |
| Loading | Spinner replaces/precedes label, `aria-busy="true"`, button stays same size (no layout shift) |

**B. Text-link with underline reveal** (nav links, "View project," inline CTAs — the
award-portfolio-site signature interaction 🎨):

- Default: text in `color-text-secondary`, a 1px underline bar at `0%` width, `transform-origin: left`
- Hover: text transitions to `color-ink`, underline bar animates `width: 0% → 100%` over
  `250ms cubic-bezier(0.65, 0, 0.35, 1)`
- Implementation: `::after` pseudo-element, not `text-decoration` (so the animation is
  controllable) — `content: ''; position: absolute; bottom: -2px; left: 0; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform 250ms ease-out;` → `:hover { transform: scaleX(1); }`
- Tap targets: minimum `44×44px` hit area even when the visible text is smaller (padding, not
  margin, to keep the hit area contiguous)

### 5.2 Cards (project case-study cards)

- `radius: lg`, `border: 1px solid color-border`, no shadow at rest
- Cover image: `aspect-ratio: 16/9`, `object-fit: cover`
- On hover: image `transform: scale(1.04)` over `500ms cubic-bezier(0.16,1,0.3,1)` (contained via
  `overflow: hidden` on the image wrapper, not the whole card, so the card border stays static);
  card gains the elevation shadow from §4
- Metadata row above the title: `meta` type token, `color-text-muted`, values separated by a
  center-dot (`·`), e.g. `WEB APP · SOFTWARE ENGINEER · 2026`
- Title: `h3`, 2-line clamp, underline-reveal on hover (§5.1B) since the whole title is the click
  target into the case study
- Description: `body-sm`, `color-text-secondary`, 3-line clamp
- Tag pills: `caption` token, `bg: color-surface`, `border: 1px solid color-border`, `radius: full`,
  `padding: 4px 10px`

### 5.3 Carousel / image gallery

**Not observed on either reference site** (not detectable from a text-based fetch of either
SPA) — included here because a project case study with multiple images/videos is a near-certain
real need, and "carousel" was explicitly requested. Spec below is an original design, in the
same restrained visual language as the rest of this system: 🎨

- Layout: horizontal scroll-snap (`scroll-snap-type: x mandatory`), each slide
  `scroll-snap-align: center`, native touch/trackpad scroll — **not** a JS-timer autoplay (autoplay
  on unmuted or motion content without user control is an accessibility anti-pattern; keep it
  user-driven)
- Slide sizing: `85%` viewport width on mobile (peeks the next slide as an affordance),
  `70%` on desktop for a similar peek, `gap: 16px`
- Controls: previous/next arrow buttons (44×44px tap target, `radius: full`,
  `bg: color-surface`, `border: 1px solid color-border`), visible always on mobile, fade in on
  container `:hover` on desktop (`opacity: 0 → 1`, `200ms`)
- Position indicator: dot pagination below the carousel — active dot `8px` wide pill, inactive
  dots `6px` circles at 40% opacity, `4px` gap
- Keyboard: arrow buttons are real `<button>`s with `aria-label="Previous image"/"Next image"`;
  the scroll container itself is focusable (`tabindex="0"`) with arrow-key scroll support
- Reduced motion: `scroll-behavior: auto` instead of `smooth` when
  `prefers-reduced-motion: reduce` is set

### 5.4 Navigation

- Wordmark: `"{Name} — {Role}"` — verified thieb.co pattern ✅. Role text can collapse (`hidden`
  below `sm`) to save space on mobile.
- Desktop: horizontal links + social links + theme toggle, `sticky top-0`, `backdrop-filter: blur(8px)`,
  background `color-bg` at 80% opacity so content is legible scrolling underneath
- Mobile: hamburger toggle (44×44px), slide-down panel, `max-height` transition (`0 → 24rem`,
  `200ms ease-in-out`), closes on route change and `Escape`
- Active link: `color-ink` + permanent underline (not just hover state) + `aria-current="page"`

### 5.5 Section label

Thieb.co's confirmed all-caps section headers ✅: `caption` type token, `color-text-muted`,
always precedes a section heading, e.g. `EXPERIENCE` above `h2`-level content.

### 5.6 Forms

- Inputs: `radius: md`, `border: 1px solid color-border`, `padding: 10px 14px`, `font: body`
- Focus: `border-color: color-accent`, `box-shadow: 0 0 0 3px {accent at 20% opacity}`
- Error state: `border-color: {error color}`, error message in `body-sm` + error color directly
  below the field, `aria-invalid="true"` + `aria-describedby` pointing at the message
- Label: `body-sm`, `600` weight, `4px` below label to input

---

## 6. Motion system

🎨 Design decisions, informed by the verified "bold... animated... engaging interactive
animations" quality noted for Mengin's site and the general absence of heavy motion documented
for thieb.co (its Awwwards/review coverage emphasizes structure and typography, not animation).

### Timing tokens

| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion-micro` | 150ms | `ease-out` | Hover color/opacity changes |
| `motion-base` | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button/link states, form focus |
| `motion-moderate` | 400–500ms | `cubic-bezier(0.16, 1, 0.3, 1)` ("expo-out") | Card image hover-zoom, dropdown/menu open |
| `motion-slow` | 600–900ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-reveal entrances, hero entrance |

### Scroll-reveal (content sections)

- Elements enter `opacity: 0, translateY(24px)` → `opacity: 1, translateY(0)`
- Trigger: `IntersectionObserver`, fires once when ~20% of the element is in view (don't
  re-trigger on scroll-back — re-animating on every pass reads as noisy, not polished)
- Stagger siblings (e.g. a row of project cards) by `80–100ms` each, capped at ~5 staggered
  items to avoid a slow cascading load feeling
- **Always** gate behind `prefers-reduced-motion` — render the final state directly, no motion,
  for users who've requested it

### Hero entrance — two documented options for the frontend team to choose between

**Option A — Typographic entrance (baseline, no new dependencies):**
Heading renders line-by-line or word-by-word, each unit animating `translateY(100%) → 0` with
`clip-path` or `overflow: hidden` masking, `600–900ms`, staggered `60–80ms` per line, `expo-out`
easing. Achievable with Framer Motion or plain CSS + Intersection Observer. Low risk, no
performance cost, works everywhere.

**Option B — Motion-first opening (stretch goal, inspired by Mengin's confirmed animated
cloudscape opening ✅):**
A full-bleed animated visual (WebGL via Three.js/react-three-fiber, or a lighter Canvas2D/CSS
gradient animation as a cheaper alternative) plays behind or above the hero text on load.
Requirements if built:
- Client-only, dynamically imported (never SSR'd)
- Must degrade to a static gradient/image when `prefers-reduced-motion: reduce` is set, or when
  the canvas/WebGL context fails to initialize
- Should not block text-content paint — text renders immediately, visual layers in behind it
- Budget: this is meaningfully more engineering effort and bundle weight than Option A; only
  commit to it if the team has capacity to build and maintain it

### Micro-interactions

- Cursor-follow "View" label on hoverable project cards (optional, desktop-only, common on
  Awwwards-tier sites — a small pill that tracks the cursor reading "View" while hovering a card,
  fades in/out over `motion-micro`) — nice-to-have, not required for launch
- Page transitions between routes: simple cross-fade, `motion-base`, avoid slide/wipe transitions
  that can feel gimmicky on a content-heavy multi-page site

---

## 7. Dark/light mode strategy

- Class-based (`<html class="dark">`), not `prefers-color-scheme`-only — user needs a manual
  toggle in the nav (thieb.co doesn't have this, since it's single-mode; this is a practical
  addition for a real product 🎨)
- Persist choice in `localStorage`, respect system preference on first visit only
- No-flash: an inline script sets the class before first paint, before any framework hydrates
- If the team builds Hero Option B (dark motion-first opening), decide explicitly whether that
  hero is **always dark regardless of toggle** (a fixed "cover" moment, like Mengin's own
  always-black site) or **respects the toggle** (fully light in light mode) — pick one and apply
  it consistently; don't leave it ambiguous per-component.

---

## 8. Accessibility checklist

- All interactive elements are real semantic elements (`<button>`, `<a>`) — never `<div onClick>`
- Focus-visible rings on every interactive element, using `color-accent`, never suppressed
- Minimum tap target `44×44px`, including icon-only buttons (theme toggle, carousel arrows,
  hamburger)
- Every animation/transition respects `prefers-reduced-motion: reduce`
- Color is never the *only* signal (e.g. form errors get an icon + text, not just red border)
- All text/background pairs meet WCAG AA contrast (§3)
- Images: meaningful `alt` text for content images, `alt=""` for decorative ones
- Empty/loading/error states designed for every data-driven section (project grid, testimonials,
  etc.) — never a blank gap where content failed to load

---

## 9. Handoff notes for the frontend developer

- Treat every token in §2–§4 as a CSS custom property / Tailwind theme extension — never
  hardcode a hex/px value inline in a component.
- Build primitives first (Button, Card, Input, Carousel) as documented in §5, then compose pages
  from them — don't one-off a page-specific button style.
- Ship Hero Option A first; treat Option B as a follow-up enhancement once the base site is
  live and content is real, not placeholder.
- Every list-driven section (Experience, Awards, Press, project grid) must handle **zero items**
  gracefully — hide the section or show explicit empty-state copy, never render an empty heading
  over nothing.
- This document does not include actual copy, real project data, or a real color/font license
  decision — those are content and legal decisions for the site owner, not design-system
  decisions.
