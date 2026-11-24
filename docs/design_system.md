# Portfolio V2 - Production Design System

This document establishes the official Design System for the **Dark Luxury / Orange Energy** cinematic storytelling portfolio. It acts as the visual specification for developer handoff, detailing every styling token, design rule, and interaction standard to maintain visual excellence and consistency.

---

## 1. Color System

The color palette is built using HSL color variables to support smooth alpha transitions, glows, and theme adjustments. It avoids standard browser colors in favor of a bespoke Obsidian Dark and High-Energy Orange spectrum.

### The Palette (HSL Configuration)

```css
:root {
  /* Dark Luxury Base (Obsidian Spectrum) */
  --color-bg-deep: hsl(240, 10%, 3%);        /* #070708 - Deep Obsidian (Main background) */
  --color-bg-surface: hsl(240, 8%, 6%);     /* #0e0e10 - Charcoal Dark (Section overlays, cards) */
  --color-bg-elevated: hsl(240, 6%, 10%);   /* #18181b - Medium Muted (Hover surfaces) */
  
  /* Borders & Dividers */
  --color-border-subtle: hsla(240, 5%, 15%, 0.5); /* Semi-transparent boundary */
  --color-border-glow: hsla(18, 100%, 50%, 0.15); /* Accent border outline */

  /* Orange Energy Accent (High-Voltage Spectrum) */
  --color-accent-primary: hsl(18, 100%, 50%);    /* #ff4d00 - Primary Orange Energy */
  --color-accent-glow: hsla(18, 100%, 50%, 0.25); /* Glow shadow utility */
  --color-accent-hover: hsl(18, 100%, 60%);     /* #ff6622 - Hover brighter orange */
  --color-accent-muted: hsl(18, 70%, 25%);       /* #6d2000 - Dark Amber (Background highlights) */

  /* Text Hierarchy */
  --color-text-primary: hsl(0, 0%, 95%);         /* #f2f2f2 - Pure luxury white */
  --color-text-secondary: hsl(240, 5%, 65%);     /* #a1a1aa - Muted zinc/gray */
  --color-text-muted: hsl(240, 5%, 45%);         /* #71717a - Muted caption gray */
  --color-text-accent: var(--color-accent-primary);
}
```

### Visual Application Rules
1. **Contrast Ratio**: Body text (`--color-text-primary`) against background (`--color-bg-deep`) must maintain a minimum contrast ratio of **7:1** for AAA legibility.
2. **Glassmorphism**: When laying elements over WebGL/Canvas fields, use:
   `background: hsla(240, 8%, 6%, 0.65); backdrop-filter: blur(16px); border: 1px solid var(--color-border-subtle);`
3. **Orange Energy Glows**: Glowing effects must never look solid. Use CSS filters (`filter: drop-shadow(0 0 20px var(--color-accent-glow))`) or high-blur radial gradients.

---

## 2. Typography System

The typography creates a contrast between **Syne** (a wide, avant-garde sans-serif for futuristic impact headers) and **Inter** (an elegant, neutral, geometric sans-serif for technical readability).

### Font Families
* **Display / Header Family**: `Syne, sans-serif` (Google Font - weights: 700, 800)
* **Body / Technical Family**: `Inter, sans-serif` (Google Font - weights: 300, 400, 500)

### Typographic Scale

| Type Class | Size (rem) | Size (px) | Line Height | Letter Spacing | Weight | Font | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `clamp(3.5rem, 8vw, 8rem)` | 56px - 128px | 1.05 | `-0.03em` | 800 | Syne | Landing title text |
| **Section Title** | `clamp(2rem, 5vw, 4rem)` | 32px - 64px | 1.1 | `-0.02em` | 700 | Syne | Section entry headers |
| **Subtitle / Label** | `0.875rem` | 14px | 1.5 | `0.2em` | 500 | Inter | Uppercase tracking tags |
| **Body Large** | `1.125rem` | 18px | 1.6 | `normal` | 300 | Inter | Project intro, key logs |
| **Body Medium** | `1rem` | 16px | 1.6 | `normal` | 400 | Inter | General content and lists |
| **Caption / Small**| `0.75rem` | 12px | 1.5 | `0.05em` | 400 | Inter | Technical metadata, small links |

---

## 3. Spacing System

A mathematical **8px grid** is used to determine padding, margins, and component dimensions. Spacing scales up to generate cinematic breathing room.

```
$space-xxs: 4px;
$space-xs:  8px;
$space-sm:  16px;
$space-md:  24px;
$space-lg:  32px;
$space-xl:  48px;
$space-xxl: 64px;
$space-cinematic-sm: 96px;
$space-cinematic-lg: 160px;
```

* **Section Margin**: All major sections use a minimum gap of `$space-cinematic-sm` on mobile and `$space-cinematic-lg` on desktop to enforce a luxury editorial feel.
* **Component Padding**: Standard container margins are mapped directly to `$space-md` (mobile) and `$space-xl` (desktop).

---

## 4. Grid System

The design is built on a responsive 12-column grid, constrained within a wide screen container to preserve proportion on ultra-wide monitors.

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);
  }
}
```

### Column Layout Rules
* **12-Column Desktop Grid**: Gutters set to `32px` (`$space-lg`). Max width constrained to `1440px`.
* **6-Column Tablet Grid**: Gutters set to `24px` (`$space-md`).
* **4-Column Mobile Grid**: Gutters set to `16px` (`$space-sm`).

---

## 5. Motion Principles

Animations must feel fluid, premium, and integrated into scroll behaviors. Snap transitions or sudden bounces are forbidden.

### Core GSAP Easing Defaults
* **Dynamic / Interactive Ease**: `power4.out` (very fast out, long deceleration tail).
* **Scroll-Linked Ease**: `power2.out` (moderate deceleration, works best with ScrollTrigger scrub speeds of `1` to `1.5`s).
* **Cinematic Entrance / Fade**: `power3.inOut` (slow accelerate, slow decelerate).
* **CSS Transition Equivalent**: `cubic-bezier(0.25, 1, 0.5, 1)` (Out-quartic ease).

### Timing Durations
* **Micro-interactions (Hover, cursor react)**: `200ms` - `350ms`.
* **Page Transitions / Overlay Reveals**: `600ms` - `800ms`.
* **Cinematic Animations (Hero moon load, panel fades)**: `1200ms` - `1800ms`.

---

## 6. Component Design Rules

Every UI component must follow these strict rules to project a "Futuristic Luxury" product design quality:

1. **Border Treatments**:
   * Never use solid white borders. Use subtle, semi-transparent gradients:
     `linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
   * Rounded corners must use a maximum radius of `8px` (`border-radius: 8px`). Sharp corners (`0px`) are preferred for navigation headers, timeline nodes, and primary buttons.
2. **Glassmorphism & Backgrounds**:
   * Backdrop filters are mandatory for elements overlaying the WebGL Moon or Particle fields.
   * Add a `mix-blend-mode: screen` orange energy aura (`--color-accent-muted`) beneath glass elements to create a three-dimensional lighting depth.
3. **Magnet Attraction Hover (GSAP-powered)**:
   * Interactive text links, social links, and primary buttons must use a magnet effect. When the cursor approaches within `50px` of the element, the element pulls towards the cursor position by `15px` to `20px` max.

---

## 7. Cursor Design Rules (Katana Cursor)

The custom cursor replaces the default system pointer and acts as a central visual mechanic.

```
┌──────────────────────────────────────────────────────────────────┐
│                      KATANA CURSOR STATE MAP                     │
├───────────────┬─────────────────────────┬────────────────────────┤
│     STATE     │      VISUAL DOT         │      SLASH TRAIL       │
├───────────────┼─────────────────────────┼────────────────────────┤
│ Default       │ 6px solid orange dot    │ Thin, low opacity trail│
│ Hover (Link)  │ Hollow circle (24px)    │ Spawns particles       │
│ Active (Press)│ Expands to solid 32px   │ Blade flash swipe      │
│ Fast Swipe    │ Hidden                  │ Curved neon orange glow│
└───────────────┴─────────────────────────┴────────────────────────┘
```

### Interaction Specifications
* **The Slash Trail**: Drawn on an independent Fullscreen HTML5 Canvas. As the mouse speed increases, the trail interpolates coordinate segments using cubic bezier splines, drawing a sharp blade-like slash.
* **Canvas Trail Fade**: The trail segment opacity decays exponentially using:
  `opacity *= 0.85` inside the requestAnimationFrame loop to ensure no performance leaks or trail clutter.
* **Hover Interaction**: When hovering over links or buttons, the cursor dot morphs into an orange ring, and the hovered element triggers its dynamic Magnet Attraction.

---

## 8. Visual Hierarchy

Hierarchy must be clear, giving prominent visual weight to headers and interactive elements while secondary details remain clean and readable.

```
[VISUAL WEIGHT SCALE]
  █ 100% - Orange Energy Accents / Glowing Katana slash
  █  85% - Display Headings (Syne, White, Bold)
  █  65% - Primary Action Buttons / Active timeline state
  █  45% - Body Copy (Inter, Muted Gray)
  █  20% - Interactive Borders / Background grids / Muted tags
```

* **Focus Anchors**: Only one element per viewport can use the glowing Orange Energy accent at full opacity. If a primary button glows, nearby titles must remain pure white.
* **Contrast Controls**: To keep the website cinematic, text should use relative sizing (`clamp`) rather than excessive colors. Keep colors restricted to the main palette.

---

## 9. Section Design Specifications

### Section 1: Hero (Cinematic Launchpad)
* **Layout**: Full viewport height (`100vh`), centered column flex.
* **Aesthetics**: Obsidian black background overlaid with WebGL canvas. A realistic Moon model spins slowly in the center. Light-gray dust particles float in a 3D Z-plane.
* **Accent**: A subtle, slow-pulse radial gradient of Orange Energy (`--color-accent-muted` with `0.15` opacity) glowing behind the Moon.

### Section 2: Journey (The Narrative Timeline)
* **Layout**: Full-screen vertical scroll container.
* **Timeline Line**: Centered vertical SVG line. As the page scrolls, the path changes from a dark charcoal color to glowing Orange Energy.
* **Interactions**: Milestone cards are pinned to the timeline. When scrolled into view, GSAP reveals the card contents using an offset fade-in (`y: 30, opacity: 0`).

### Section 3: Skills (Orbital Network)
* **Layout**: `100vh` pinned scroll layout.
* **Grid**: Centered circular field.
* **Visuals**: A central point representing "Bhanu Sai" with technical skills orbiting around the center.
* **Orbits**: Orbit paths are drawn as thin circular lines (`--color-border-subtle`). Skill nodes orbit at varied speeds (using cosine/sine coordinate offsets). Hovering on a node pauses its orbit and expands its Orange Glow.

### Section 4: Projects (Sequential Showcase)
* **Layout**: Horizontal Scroll / pinned vertical stack using GSAP ScrollTrigger.
* **Visuals**: Fullscreen viewport where projects overlap or slide in one at a time.
* **Transitions**: As the user scrolls, the active project scales up and fades in, while the previous project slides out with a slight dark filter applied, giving depth to the transition.

### Section 5: Footer (Cinematic Exit Scene)
* **Layout**: `100vh` container with a large visual ending scene.
* **Aesthetics**: Cosmic horizon or dark grid geometry receding into a neon Orange Energy sun/glow.
* **CTA**: Large, bold "Work With Me" header using the Syne display typeface, featuring a persistent, organic ambient energy pulse on hover.
