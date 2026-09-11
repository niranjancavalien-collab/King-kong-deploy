# King Kong — Animation Studio

A dark, cinematic landing page for **King Kong**, a premium animation studio.
Built with React 19, Vite, Tailwind CSS v4, Motion (Framer Motion), GSAP, and
lucide-react.

## Design notes

- **Palette** — pure black background, white text at varying opacity, and a
  single warm brass accent (`#E8B54A`) used sparingly (logo mark, one CTA
  underline) rather than the more common acid-green/vermilion treatment.
- **Type** — Manrope carries all headings, body copy and UI; JetBrains Mono
  is reserved for small data-like fragments (timecodes, section numbers, the
  copyright line) rather than tracked-out uppercase labels.
- **Mark** — the header/footer logo is an aperture-blade ring around a "KK"
  monogram: a nod to the camera iris every frame of animation passes
  through.
- **Copy** — the hero line ("Scaling The Impossible Into Motion") and the
  footer CTA ("Ready To Build Your Next World?") are written for an
  animation studio specifically, not reused sports-brand boilerplate.

## Background video

`public/king-kong-reel.mp4` is the showreel used for the scroll-scrubbed
background. Swap in your own cut at the same path (or update `VIDEO_URL` in
`src/App.tsx`) — an .mp4 with clear, high-contrast frames scrubs best.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/
    Logo.tsx          KK aperture-mark SVG
    NavItem.tsx        hover-flying nav link (vertical fly, cycle-keyed)
    Reveal.tsx          motion.div viewport fade-in wrapper
    ScrollReveal.tsx     GSAP word-by-word scroll reveal
  App.tsx              layout, scroll-driven video, all 3 sections
  index.css             Tailwind v4 entry + custom keyframes
  main.tsx              app entry
```

## Scroll-driven video

The background video's `currentTime` is scrubbed against scroll position,
reaching the end of the clip once the footer sits 20% of the viewport height
from the top of the screen. The scroll handler is throttled with
`requestAnimationFrame` and additionally checks `video.seeking` before
assigning a new `currentTime` — without that guard, fast scrolling queues up
competing seeks and the video visibly tears between frames.
