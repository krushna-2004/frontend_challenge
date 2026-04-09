# 🗓️ Wall Calendar — Interactive React Component

A polished, interactive wall calendar component inspired by the physical wall calendar aesthetic, built with React and vanilla CSS.

---

## ✨ Features

### Core Requirements
- **Wall Calendar Aesthetic** — Hero image with a diagonal wave cutout, spiral ring binders, and a physical paper feel
- **Day Range Selector** — Click a start date, then an end date; hover previews the selection in real time; clear visual states for start, end, and in-between days
- **Integrated Notes Section** — Per-month notes textarea with lined-paper styling; range label updates live as you select dates
- **Fully Responsive** — Stacked (mobile) ↔ Side-by-side panels (desktop ≥680px)

### Creative Extras
- **4 Theme Switcher** — Alpine 🏔️, Forest 🌲, Desert 🏜️, Ocean 🌊; each swaps the hero image, accent color, and diagonal gradient in one click
- **Holiday Markers** — Emoji indicators for major holidays (New Year's, Valentine's, Halloween, Christmas, etc.)
- **Page-flip animation** — Hero image rotates on the X-axis when navigating months
- **Keyboard navigation** — `←` / `→` arrow keys navigate months
- **Today indicator** — Subtle dot below today's date + accent-tinted background
- **Ring binders** — CSS-only decorative spiral rings above the card
- **Hover range preview** — Dragging your cursor over dates previews the range before committing

---

## 🗂️ Files

| File | Description |
|---|---|
| `WallCalendar.html` | Standalone HTML/CSS/JS — open in any browser, zero dependencies |
| `WallCalendar.jsx` | React component (requires React 18+, Google Fonts) |
| `README.md` | This file |

---

## 🚀 Running Locally

### Option A — Standalone HTML (Fastest)
```bash
# Just open in your browser:
open WallCalendar.html
# or
npx serve .
```
No build step, no dependencies.

### Option B — React (Vite)
```bash
npm create vite@latest wall-calendar -- --template react
cd wall-calendar
# Copy WallCalendar.jsx into src/
# Replace src/App.jsx with:
# import WallCalendar from './WallCalendar'
# export default function App() { return <WallCalendar /> }

npm install
npm run dev
```

---

## 🎨 Design Decisions

### Physical Calendar Metaphor
The spiral rings, wave-cut hero image, and diagonal colored triangle are direct translations of the physical wall calendar in the reference. The `clip-path` triangle and SVG wave cut together create the illusion of a layered paper calendar without any images.

### Theme System
CSS custom properties (`--accent`, `--accent-light`, etc.) let a single `applyTheme()` call instantly re-skin the entire component. The 4 themes were chosen for scenic diversity — cold (Alpine/Ocean) vs warm (Desert) vs natural (Forest).

### Range Selection UX
Two-click pattern: first click sets start, second sets end. Hover previews the range live. Clicking the same date twice or pressing "Clear" resets. This avoids drag-on-mobile issues while staying intuitive on desktop.

### Notes Per Month
Notes are stored in a plain JS object keyed by `year-month`, persisting across navigation within the session. For production, `localStorage` would be a one-line addition.

### No Dependencies
The standalone HTML version has zero npm dependencies — Google Fonts is the only CDN load. This keeps it self-contained, fast, and easy to drop into any project.

---

## ♿ Accessibility
- All interactive elements are `<button>` or keyboard-reachable
- `title` attributes on holiday cells expose names to screen readers
- Keyboard arrows navigate months
- Color is never the sole indicator (today dot + background, start/end bold weight)
