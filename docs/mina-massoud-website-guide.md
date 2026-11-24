# How mina-massoud.com Was Built — Full Teardown & Recreation Guide

This is a practical breakdown of the site, based on its public metadata, on-page content, the Awwwards listing for it, and the developer's own public tooling preferences. It is **not** a copy of the original source code (that wasn't accessible to inspect directly), so treat the stack list as a confident reconstruction, and the build steps as a from-scratch guide to make something equivalent in spirit and technique — not a clone of his proprietary code.

---

## 1. Confirmed facts about the site

From the Awwwards entry for this project (mina-massoud.com, Honorable Mention, Apr 2026), the listed disciplines/technologies are:

- **GSAP** (GreenSock Animation Platform) — scroll-triggered and timeline animation
- **GLSL** — custom shader code
- **WebGL** — the rendering layer the shaders run on
- Categories: Experimental, Web & Interactive, Illustration, Storytelling, Animation, Portfolio, Interaction Design, Typography

Brand colors used on the site: `#0A0A0A` (near-black background) and `#8B0F1D` (deep blood-red accent). The `<meta theme-color>` confirms `#0A0A0A` as the primary surface.

From the page's own content/metadata:
- Title/description position him as a **frontend engineer**, and the "Kitsune" section explicitly lists his stack: **React · Next · Swift · WebGL**, plus mentions of **Figma** (design), and a workflow that goes "Figma to pull request."
- Booking is handled via an embedded **Cal.com** widget (`cal.com/mina-massoud/30min`), with graceful no-JS fallback text ("JavaScript is disabled. Book directly at...").
- Audio: a `theme-shamisen.mp3` file is loaded for an opt-in soundtrack ("TAP TO ENTER · AUDIO ON FOR FULL EXPERIENCE") — a classic "intro gate" pattern used to unlock autoplay audio after a user gesture (browsers block autoplay otherwise).
- Assets are `.webp` (images) and `.svg` (ornaments/icons/dividers) — a deliberate performance choice (webp is far lighter than jpg/png; svg scales losslessly for line-art motifs).
- og:image is a 1200×630 JPG portrait — standard social-share image sizing.

From his public GitHub profile and repos (Mina-Massoud), his stated/used stack across projects is consistently:
**HTML5, CSS3, JavaScript/TypeScript, React, Next.js, Redux, Tailwind CSS, Vite, Framer Motion, Figma, shadcn/ui, Sanity (CMS), Git.**

### Most likely concrete stack for this specific site
| Layer | Likely tech | Why |
|---|---|---|
| Framework | **Next.js (React)** | His default stack everywhere; also the cleanest path to good SEO meta tags like the ones in the page head |
| Styling | **Tailwind CSS** | His default everywhere; pairs naturally with utility-driven editorial layouts |
| Scroll/timeline animation | **GSAP + ScrollTrigger** | Explicitly tagged on Awwwards |
| 3D/shader background ("ASSEMBLING SHADERS · PORTRAIT") | **WebGL via raw GLSL or a thin wrapper (Three.js / OGL / vanilla `<canvas>` + WebGL context)** | "GLSL" + "WebGL" tags, and copy literally says "ASSEMBLING SHADERS" during the loading screen |
| Micro-interactions / component transitions | **Framer Motion** (layered on top of GSAP for scroll) | Used across his other projects; common combo with Next.js |
| Scheduling | **Cal.com embed** | Directly linked and referenced in fallback copy |
| Fonts/icons | Custom variable font + Japanese glyphs (see Section 3) | Visible in rendered text |
| Hosting | Likely **Vercel** (mentioned by name in his "Hitomi" inspirations list: "Linear · Vercel · Rauno") | Standard pairing with Next.js |
| Image hosting | Static `/assets/*.webp` and `.svg`, self-hosted | Visible in asset URLs |

---

## 2. Section-by-section breakdown

The site is structured as **numbered "chapters"** (零 00 through 八 08), styled like a graphic novel or game intro — this chaptering is the core structural concept, not just a visual flourish.

### Chapter 00 — Entering (preloader/intro gate)
- Full-screen loading sequence with a percentage counter (000% → 100%), status text ("ASSEMBLING SHADERS · PORTRAIT"), and a "TAP TO ENTER" gate.
- Purpose: (1) preloads the WebGL shader + heavy assets before reveal, (2) unlocks audio autoplay via the required user gesture, (3) sets tone immediately (cinematic, deliberate, not instant).
- Build pattern: track asset load progress (Promise.all on image/font/audio loads, or a GSAP/Next loading state), animate a counter with GSAP, then on click/tap: start audio, fade out the loader, trigger the hero's entrance timeline.

### Hero
- Large kinetic typography with a "Hover to Reveal" interaction — likely a mix of two stacked portraits (`mina-samurai.webp` / `mina-modern.webp`) cross-faded or masked on hover/scroll, swords as decorative flanking elements.
- Mixed Japanese kanji/phrases interleaved with English tagline fragments ("FRONTEND AS RITUAL 執念", "CODE LIKE A SAMURAI 斬") — a marquee/ticker style repeating line, almost certainly CSS `@keyframes` infinite scroll or GSAP `repeat: -1` timeline.
- Numbered chapter nav list (jump links) doubles as a table of contents.

### Chapter 一 (01) — Manifesto
- Pull-quote driven section ("What pulled me in", Marianne Williamson quote) with large serif/italic typographic treatment.
- Repeating word loops ("Fear×Tremble×Dread×Flinch") — same ticker pattern as hero, used as a transitional rhythm device between sections.
- Two dragon illustrations (`dragon-skitched.webp`, `dragon-filled.webp`) — likely scroll-linked, one appearing "sketched" then resolving to "filled" as you scroll (a progressive reveal via scroll-triggered opacity/clip-path).

### Chapter 二 (02) — About
- Straightforward bio copy + a stat/metadata grid (LOCATION / ROLE / YEARS / STATUS) — laid out like a character stat sheet, reinforcing the "samurai RPG" concept.

### Chapter 三 (03) — Numbers
- Four stat counters (2 awards, 36+ OSS contributions, 50+ projects, coffee cups) — classic animated count-up on scroll-into-view, done with GSAP `ScrollTrigger` + a number-tween, or a small custom `requestAnimationFrame` counter.

### Kitsune section — "How I work" (Four Movements)
- A nine-tailed fox sprite/animation sequence (`kitsune-frames/frame_0001.webp` — naming convention implies a **frame sequence**, i.e., individual WebP frames stepped through on scroll to fake a hand-drawn animation, a technique popularized by Apple product pages and recreated with GSAP ScrollTrigger scrubbing through a `<canvas>` drawing each frame).
- Four labeled "movements" (智 Chi, 九 Kyū, 霊 Rei, 神 Shin) each pairing a Japanese concept word with an English translation and a short philosophy statement — this is a recurring content pattern across the site (also used in "Hitomi"): **kanji + romaji + translation + 1-line philosophy + supporting detail**. Worth treating as a reusable component/content-model if rebuilding (e.g., a Sanity/CMS schema: `{kanji, romaji, translation, title, body}`).

### Countries section
- Three portrait illustrations representing Egypt (Anubis), USA (Statue of Liberty), Australia (kangaroo) — these read as **stylized/illustrated or AI-generated portraits** rather than photography, consistent with the rest of the site's painterly/illustrated visual language (see Section 4 on image generation).
- Each paired with a "chapter" of bio copy (career timeline disguised as a travel narrative).

### Hitomi section — Inspirations
- Same four-part Japanese-concept pattern as Kitsune (映 Utsu, 観 Kan, 蔵 Kura, 創 Sō), again backed by a frame-sequence image animation (`inspiration-frames/frame_0001.webp`) of an eye.
- Name-drops real inspirations: Awwwards, FWA, Dribbble, Linear, Vercel, Rauno (Rauno Freiberg, known for interaction-design work) — useful signal for what reference sites to study if you want to build something in this style.

### CTA / Booking (Chapter 八/08)
- Repeating marquee text again ("SO NOW IS THE TIME 今こそ") as a section transition.
- Embedded **Cal.com** scheduler iframe, with explicit progressive-enhancement fallback (plain text + direct link if JS is off) — good practice to replicate.
- Contact list (email, LinkedIn, GitHub, Instagram) each with a one-line personality blurb instead of a bare label.

### Footer / Index
- A secondary "table of contents" nav (目次 = "table of contents") repeating the chapter list — reinforces the book/manga framing device used throughout.

---

## 3. Typography & language treatment

You can't get the literal font files without inspecting the site's CSS/network requests directly, but the **typographic system** is clearly built from:

1. **A condensed/grotesk sans-serif** for body copy, nav, and labels (the "ALL CAPS, tight tracking" look used throughout headers like "BUILD · M.26", "MINA MASSOUD").
2. **A serif or high-contrast display serif, often italicized**, for pull-quotes and the manifesto section ("*design meets logic*", "*imagine and create anything*") — this contrast between grotesk-sans for UI chrome and editorial-serif for "voice" moments is a deliberate, common technique in editorial portfolio design.
3. **Japanese typeface support** — kanji/CJK glyphs (零, 一, 二, 三, etc., used as both numerals/section markers and thematic flourishes) require a font stack with CJK coverage. Likely candidates:
   - A Western font like **Neue Montreal, General Sans, Söhne, PP Editorial, or Suisse Int'l** (all popular in this "premium portfolio" aesthetic) for Latin text
   - Paired with a system or web CJK font (e.g., **Noto Sans JP / Noto Serif JP**, or relying on the OS's default CJK font) for the Japanese characters, since shipping a full custom CJK webfont is expensive (CJK fonts can be 5–20MB+ due to glyph count) — most sites either subset only the exact characters they use, or fall back to system fonts for CJK.
4. The kanji numerals (零 = 0, 一 = 1, 二 = 2, etc.) used as section numbering is a strong, reusable design idea independent of font choice — it's content/IA design, not just typography.

**To recreate this typography system**, practically:
- Pick one geometric/grotesk sans for UI (e.g., **Neue Montreal** or **General Sans** from Fontshare — both free and in this exact aesthetic family) as `--font-sans`.
- Pick one editorial serif with good italics for quotes (e.g., **PP Editorial New**, **Canela**, or **Times-adjacent serif like Lyon/Tiempos**) as `--font-serif`.
- For CJK glyphs, subset only the specific kanji/characters you actually use (a handful of characters, not the whole alphabet) using a tool like `glyphhanger` or `fonttools subset`, and self-host that tiny subset — this keeps load time low while still using a real, well-designed CJK font rather than the user's system default.

---

## 4. How the imagery was likely generated

The visual language across the site — the samurai/menpō portrait, the Anubis/Liberty/kangaroo "country" portraits, the dragon line-art pair, the kitsune and eye frame sequences — is consistently **illustrated/painterly and stylistically unified**, not photography or stock art. That consistency across very different subjects (a person, a deity, a statue, an animal, a fox spirit) strongly suggests either:

(a) one illustrator working in a consistent style, or
(b) **AI image generation** (Midjourney, Ideogram, or similar) used with a tightly consistent style prompt/seed, then cleaned up and converted to WebP — which is extremely common for solo-developer portfolios in 2025–2026, since it lets one person achieve a cohesive high-end illustrated look without a hired illustrator.

If you wanted to **recreate this visual style yourself with AI image generation**, here's a practical prompt framework based on what's visible (sumi-e/ink-wash aesthetic, high contrast, red/black palette, samurai theme):

### Base style prompt (use as a suffix on every image for consistency)
```
sumi-e ink wash style, minimal brushstroke linework, high contrast black and red,
dark background #0A0A0A, deep red accent #8B0F1D, editorial illustration,
clean negative space, Japanese woodblock print influence, ukiyo-e meets modern
editorial design, monochrome with single red accent, no text, no watermark
```

### Example subject prompts built on that base
- **Hero portrait (samurai/menpō mask):**
  `Portrait of a person wearing a black samurai menpō mask, twin katanas crossed behind, sumi-e ink wash style, minimal brushstroke linework, high contrast black and red, dark background, deep red accent, editorial illustration, clean negative space`
- **Country portraits:**
  `Stylized portrait of Anubis, Egyptian deity, sumi-e ink wash style, minimal linework, black and red palette, dark background, editorial illustration` (swap subject for Statue of Liberty / red kangaroo, keep style suffix identical)
- **Dragon pair (sketched + filled):**
  Generate the same composition twice — once with prompt modifier `loose pencil sketch, unfinished line art, sparse strokes` and once with `fully inked, solid fills, finished illustration` — to get the "skitched → filled" before/after pair seen on the site.
- **Frame-sequence animations (kitsune, eye):**
  These need **multiple consistent frames of the same subject** at different states. Practically, this means either: (1) generating one base image then using an image-to-image / consistent-character workflow (same seed + incremental prompt changes, or a tool with native character consistency) to produce a 10–30 frame sequence, or (2) generating one frame and using traditional frame interpolation / simple CSS transform sequences instead of true multi-frame art — much cheaper to build than full hand-animated sequences.

### Practical generation tools
- **Midjourney** (with `--style raw`, consistent `--seed`, and `--cref` for character/style reference across images) is the most common tool for this aesthetic.
- **Ideogram** or **Adobe Firefly** as alternatives if you want commercially-cleared output.
- After generation: convert everything to **WebP** (`cwebp` CLI or an online converter) at 80–85% quality for the final site — this is almost certainly why every asset on the live site ends in `.webp`.

---

## 5. Step-by-step guide to build a similar site yourself

### Step 1 — Project setup
```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --app
cd my-portfolio
npm install gsap framer-motion
```

### Step 2 — Information architecture
Plan your site as numbered "chapters" up front (a content/IA decision, not a coding one):
```
00 Entering (preloader)
01 Hero
02 Manifesto / About
03 Numbers / Stats
04 How I Work (4-part framework)
05 Background / Journey
06 Inspirations (4-part framework)
07 CTA
08 Contact / Booking
```
Model the repeating "concept card" pattern (kanji + translation + title + body) as a single React component fed by an array of objects, so you only build it once and reuse it across the "How I Work" and "Inspirations" sections.

### Step 3 — Preloader / intro gate
- Build a full-screen overlay component that:
  1. Tracks loading of critical assets (hero images, fonts, first shader) via `Promise.all`.
  2. Animates a percentage counter with GSAP (`gsap.to({val:0}, {val:100, onUpdate...})`).
  3. Shows a "tap to enter" CTA once loaded.
  4. On click: starts background audio (`<audio>` `.play()` — must happen inside a user gesture handler to satisfy browser autoplay policy), then fades the overlay out and kicks off your hero entrance timeline.

### Step 4 — WebGL/shader background
- If you want a genuine animated shader portrait (not just a static image), the lightest path is:
  ```bash
  npm install ogl   # or "three" if you want a fuller 3D toolkit
  ```
  Set up a `<canvas>`, write a vertex + fragment shader pair (GLSL) that distorts/reveals a texture (your portrait image) based on a uniform time value and mouse/scroll input, and render it in a `useEffect`/custom hook so it mounts client-side only (`"use client"` in Next.js).
- If a full custom shader is too heavy for your timeline, a CSS-only fallback (mix-blend-mode, clip-path animation, or a simple WebGL noise/grain overlay library) gets you 70% of the visual effect for far less effort.

### Step 5 — Scroll-driven motion (GSAP ScrollTrigger)
```bash
npm install gsap
```
```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".dragon-sketch", {
  opacity: 0,
  scrollTrigger: { trigger: ".manifesto", start: "top center", end: "bottom center", scrub: true }
});
```
Use this pattern for: the sketched→filled dragon crossfade, the stat counters (animate a number from 0 to target on enter), and the frame-sequence canvases (scrub through frames based on scroll position instead of opacity).

### Step 6 — Marquee/ticker text loops
A CSS-only infinite scroll is enough and is more performant than JS for this:
```css
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```
Duplicate the content once inside the track so the loop is seamless.

### Step 7 — Typography setup
```css
:root {
  --font-sans: 'Neue Montreal', system-ui, sans-serif;
  --font-serif: 'PP Editorial New', Georgia, serif;
  --font-cjk: 'Noto Sans JP', sans-serif; /* subsetted */
}
```
Self-host Latin fonts with `next/font/local`. For CJK characters, generate a subset font containing only the exact kanji you use (a handful of characters), to avoid shipping a multi-megabyte CJK font file.

### Step 8 — Booking integration
```bash
npm install @calcom/embed-react
```
```jsx
import Cal from "@calcom/embed-react";
<Cal calLink="your-username/30min" />
```
Wrap it in a `<noscript>` fallback linking directly to your Cal.com page, matching the progressive-enhancement pattern seen on the original.

### Step 9 — Image pipeline
- Generate/commission your illustrations (see Section 4).
- Convert everything to WebP: `cwebp -q 85 input.png -o output.webp`.
- Use `next/image` for automatic responsive sizing and lazy-loading.
- For frame-sequence animations, export your frame set as `frame_0001.webp`, `frame_0002.webp`, etc., preload them, draw the active frame to a `<canvas>` each scroll-tick (or just swap an `<img src>` if frame count is low).

### Step 10 — SEO/meta parity
Match the meta pattern seen on the original (good practice regardless of style):
```jsx
export const metadata = {
  title: "Your Name",
  description: "Your one-line positioning statement.",
  openGraph: { images: ["/assets/og.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
  themeColor: "#0A0A0A",
};
```

### Step 11 — Deploy
```bash
npm install -g vercel
vercel --prod
```
Vercel is the natural fit given the Next.js stack and matches the "Vercel" name-drop in the site's own copy.

---

## 6. Honest caveats

- I retrieved this site's **rendered content and metadata**, plus its **public Awwwards listing** (which confirms GSAP/GLSL/WebGL as tagged technologies) and the developer's **public GitHub profile** (which shows his general stack preferences across other projects). I did not have access to the actual deployed JavaScript bundle, CSS source, or font files, so anything beyond those confirmed facts (exact font names, exact shader code, exact image-generation prompts he personally used) is an informed reconstruction based on visible design patterns — not a verbatim extraction of his code.
- If you want pixel-exact font names, the most reliable way is to open the live site in a browser, open DevTools → Elements/Computed styles, and read the `font-family` directly, or use a font-identifier browser extension (e.g., WhatFont).
- For exact build tooling, the developer's own footer hints "Maybe find this site's code" on his GitHub (https://github.com/Mina-Massoud) — worth checking there directly if a public repo for this specific portfolio exists or gets published.
