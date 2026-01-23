# Dark Matter Theme - Design System Blueprint
## shadcn/ui + Tailwind v4 Theme Analysis

> **Theme Source**: `https://tweakcn.com/r/themes/darkmatter.json`  
> **Framework**: Tailwind CSS v4 + shadcn/ui  
> **Color Space**: OKLCH (Perceptually Uniform)  
> **Mode**: Light + Dark theme support

---

## 1️⃣ THEME OVERVIEW & ARCHITECTURE

### Theme Identity
- **Name**: Dark Matter
- **Style**: Warm monospace aesthetic with orange/amber accents
- **Character**: Technical, developer-focused, warm undertones
- **Color Model**: OKLCH for perceptually uniform color manipulation

### Architecture Pattern
```
┌─────────────────────────────────────────────────────────┐
│                    CSS CUSTOM PROPERTIES                │
├─────────────────────────────────────────────────────────┤
│  :root (Light Mode)                                     │
│    └── Semantic tokens (--background, --primary, etc.)  │
│                                                         │
│  .dark (Dark Mode)                                      │
│    └── Override semantic tokens                         │
│                                                         │
│  @theme inline (Tailwind v4)                            │
│    └── Map to --color-* utilities                       │
│    └── Computed radius, shadow, tracking scales         │
└─────────────────────────────────────────────────────────┘
```

### Token Hierarchy
```
Level 1: Primitive Values (OKLCH colors, px values)
    ↓
Level 2: Semantic Tokens (--background, --primary, --muted)
    ↓
Level 3: Component Tokens (--sidebar-*, --card-*)
    ↓
Level 4: Utility Classes (bg-background, text-primary)
```

---

## 2️⃣ COLOR SYSTEM (OKLCH)

### Understanding OKLCH
```
oklch(L C H)
  │  │  │
  │  │  └── Hue: 0-360° color wheel position
  │  └───── Chroma: 0-0.4 saturation intensity  
  └──────── Lightness: 0-1 (black to white)
```

### Light Mode Palette

#### Core Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--background` | `oklch(1.0000 0 0)` | `#FFFFFF` | Pure white background |
| `--foreground` | `oklch(0.2101 0.0318 264.6645)` | `#1a1a2e` | Deep blue-gray text |
| `--card` | `oklch(1.0000 0 0)` | `#FFFFFF` | Card surface |
| `--card-foreground` | `oklch(0.2101 0.0318 264.6645)` | `#1a1a2e` | Card text |

#### Interactive Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--primary` | `oklch(0.6716 0.1368 48.5130)` | `#c2633a` | Warm orange/amber |
| `--primary-foreground` | `oklch(1.0000 0 0)` | `#FFFFFF` | White on primary |
| `--secondary` | `oklch(0.5360 0.0398 196.0280)` | `#3d7a7a` | Muted teal |
| `--secondary-foreground` | `oklch(1.0000 0 0)` | `#FFFFFF` | White on secondary |

#### Utility Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--muted` | `oklch(0.9670 0.0029 264.5419)` | `#f5f5f7` | Light gray surface |
| `--muted-foreground` | `oklch(0.5510 0.0234 264.3637)` | `#6b6b7a` | Muted text |
| `--accent` | `oklch(0.9491 0 0)` | `#ebebeb` | Neutral accent surface |
| `--accent-foreground` | `oklch(0.2101 0.0318 264.6645)` | `#1a1a2e` | Text on accent |

#### Semantic Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--destructive` | `oklch(0.6368 0.2078 25.3313)` | `#dc3545` | Error red |
| `--destructive-foreground` | `oklch(0.9851 0 0)` | `#fafafa` | White on destructive |
| `--border` | `oklch(0.9276 0.0058 264.5313)` | `#e5e5e8` | Border gray |
| `--input` | `oklch(0.9276 0.0058 264.5313)` | `#e5e5e8` | Input border |
| `--ring` | `oklch(0.6716 0.1368 48.5130)` | `#c2633a` | Focus ring (primary) |

#### Chart Colors

| Token | OKLCH Value | Approx HEX | Usage |
|-------|-------------|------------|-------|
| `--chart-1` | `oklch(0.5940 0.0443 196.0233)` | `#4a8585` | Teal |
| `--chart-2` | `oklch(0.7214 0.1337 49.9802)` | `#d97b4a` | Light orange |
| `--chart-3` | `oklch(0.8721 0.0864 68.5474)` | `#e8c07a` | Gold/yellow |
| `--chart-4` | `oklch(0.6268 0 0)` | `#8c8c8c` | Medium gray |
| `--chart-5` | `oklch(0.6830 0 0)` | `#a3a3a3` | Light gray |

#### Sidebar Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--sidebar` | `oklch(0.9670 0.0029 264.5419)` | `#f5f5f7` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.2101 0.0318 264.6645)` | `#1a1a2e` | Sidebar text |
| `--sidebar-primary` | `oklch(0.6716 0.1368 48.5130)` | `#c2633a` | Active nav item |
| `--sidebar-primary-foreground` | `oklch(1.0000 0 0)` | `#FFFFFF` | Text on active |
| `--sidebar-accent` | `oklch(1.0000 0 0)` | `#FFFFFF` | Sidebar accent surface |
| `--sidebar-accent-foreground` | `oklch(0.2101 0.0318 264.6645)` | `#1a1a2e` | Text on accent |
| `--sidebar-border` | `oklch(0.9276 0.0058 264.5313)` | `#e5e5e8` | Sidebar dividers |
| `--sidebar-ring` | `oklch(0.6716 0.1368 48.5130)` | `#c2633a` | Focus ring |

---

### Dark Mode Palette

#### Core Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--background` | `oklch(0.1797 0.0043 308.1928)` | `#121214` | Near-black with purple tint |
| `--foreground` | `oklch(0.8109 0 0)` | `#c9c9c9` | Light gray text |
| `--card` | `oklch(0.1822 0 0)` | `#141414` | Slightly elevated surface |
| `--card-foreground` | `oklch(0.8109 0 0)` | `#c9c9c9` | Card text |

#### Interactive Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--primary` | `oklch(0.7214 0.1337 49.9802)` | `#d97b4a` | Lighter orange (more visible) |
| `--primary-foreground` | `oklch(0.1797 0.0043 308.1928)` | `#121214` | Dark on primary |
| `--secondary` | `oklch(0.5940 0.0443 196.0233)` | `#4a8585` | Teal |
| `--secondary-foreground` | `oklch(0.1797 0.0043 308.1928)` | `#121214` | Dark on secondary |

#### Utility Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--muted` | `oklch(0.2520 0 0)` | `#2a2a2a` | Dark muted surface |
| `--muted-foreground` | `oklch(0.6268 0 0)` | `#8c8c8c` | Muted text |
| `--accent` | `oklch(0.3211 0 0)` | `#3d3d3d` | Elevated accent surface |
| `--accent-foreground` | `oklch(0.8109 0 0)` | `#c9c9c9` | Text on accent |

#### Semantic Colors

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--destructive` | `oklch(0.5940 0.0443 196.0233)` | `#4a8585` | ⚠️ Teal (unusual choice) |
| `--destructive-foreground` | `oklch(0.1797 0.0043 308.1928)` | `#121214` | Dark on destructive |
| `--border` | `oklch(0.2520 0 0)` | `#2a2a2a` | Subtle border |
| `--input` | `oklch(0.2520 0 0)` | `#2a2a2a` | Input border |
| `--ring` | `oklch(0.7214 0.1337 49.9802)` | `#d97b4a` | Focus ring (primary) |

#### Sidebar Colors (Dark)

| Token | OKLCH Value | Approx HEX | Description |
|-------|-------------|------------|-------------|
| `--sidebar` | `oklch(0.1822 0 0)` | `#141414` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.8109 0 0)` | `#c9c9c9` | Sidebar text |
| `--sidebar-primary` | `oklch(0.7214 0.1337 49.9802)` | `#d97b4a` | Active nav item |
| `--sidebar-accent` | `oklch(0.3211 0 0)` | `#3d3d3d` | Hover state |
| `--sidebar-border` | `oklch(0.2520 0 0)` | `#2a2a2a` | Sidebar dividers |

---

### Color Relationship Diagram

```
LIGHT MODE                          DARK MODE
──────────────────────────────────────────────────────────
Background Layer
┌─────────────────────┐           ┌─────────────────────┐
│ #FFFFFF (L: 1.0)    │           │ #121214 (L: 0.18)   │
│ Pure White          │  ──────▶  │ Near Black + Purple │
└─────────────────────┘           └─────────────────────┘

Surface Elevation
┌─────────────────────┐           ┌─────────────────────┐
│ #f5f5f7 (L: 0.97)   │           │ #2a2a2a (L: 0.25)   │
│ Off-white           │  ──────▶  │ Dark gray           │
└─────────────────────┘           └─────────────────────┘

Primary Accent
┌─────────────────────┐           ┌─────────────────────┐
│ #c2633a (L: 0.67)   │           │ #d97b4a (L: 0.72)   │
│ Warm Orange         │  ──────▶  │ Lighter Orange      │
└─────────────────────┘           └─────────────────────┘
         ↑ Lightness increases in dark mode for visibility

Text Hierarchy  
┌─────────────────────┐           ┌─────────────────────┐
│ #1a1a2e (L: 0.21)   │           │ #c9c9c9 (L: 0.81)   │
│ Dark blue-gray      │  ──────▶  │ Light gray          │
└─────────────────────┘           └─────────────────────┘
```

---

## 3️⃣ TYPOGRAPHY SYSTEM

### Font Stack

| Role | Font Family | Fallback |
|------|-------------|----------|
| **Sans (Body)** | Geist Mono | ui-monospace, monospace |
| **Mono (Code)** | JetBrains Mono | monospace |
| **Serif (Display)** | System serif | serif |

### Typography Variables

```css
--font-sans: Geist Mono, ui-monospace, monospace;
--font-serif: serif;
--font-mono: JetBrains Mono, monospace;
```

### Tracking (Letter Spacing) Scale

| Token | Computed Value | Usage |
|-------|----------------|-------|
| `--tracking-tighter` | `-0.05em` | Tight headlines |
| `--tracking-tight` | `-0.025em` | Headlines |
| `--tracking-normal` | `0rem` | Body text |
| `--tracking-wide` | `+0.025em` | Labels |
| `--tracking-wider` | `+0.05em` | Uppercase labels |
| `--tracking-widest` | `+0.1em` | All-caps, badges |

### Recommended Type Scale (Not in theme, suggested)

| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| H1 | 2.25rem (36px) | 700 | tight |
| H2 | 1.875rem (30px) | 600 | tight |
| H3 | 1.5rem (24px) | 600 | normal |
| H4 | 1.25rem (20px) | 600 | normal |
| Body | 1rem (16px) | 400 | normal |
| Small | 0.875rem (14px) | 400 | normal |
| Caption | 0.75rem (12px) | 500 | wider |

---

## 4️⃣ SPACING SYSTEM

### Base Unit

```css
--spacing: 0.25rem; /* 4px base unit */
```

### Spacing Scale (Tailwind Default Compatible)

| Token | Value | Pixels |
|-------|-------|--------|
| `spacing-0` | 0 | 0px |
| `spacing-1` | 0.25rem | 4px |
| `spacing-2` | 0.5rem | 8px |
| `spacing-3` | 0.75rem | 12px |
| `spacing-4` | 1rem | 16px |
| `spacing-5` | 1.25rem | 20px |
| `spacing-6` | 1.5rem | 24px |
| `spacing-8` | 2rem | 32px |
| `spacing-10` | 2.5rem | 40px |
| `spacing-12` | 3rem | 48px |
| `spacing-16` | 4rem | 64px |
| `spacing-20` | 5rem | 80px |
| `spacing-24` | 6rem | 96px |

---

## 5️⃣ BORDER RADIUS SYSTEM

### Base Radius

```css
--radius: 0.75rem; /* 12px base */
```

### Radius Scale

| Token | Formula | Computed | Pixels |
|-------|---------|----------|--------|
| `--radius-sm` | `calc(var(--radius) - 4px)` | 0.5rem | 8px |
| `--radius-md` | `calc(var(--radius) - 2px)` | 0.625rem | 10px |
| `--radius-lg` | `var(--radius)` | 0.75rem | 12px |
| `--radius-xl` | `calc(var(--radius) + 4px)` | 1rem | 16px |

### Usage Guidelines

| Component | Radius Token |
|-----------|--------------|
| Buttons | `radius-md` |
| Cards | `radius-lg` |
| Inputs | `radius-md` |
| Modals | `radius-xl` |
| Badges/Pills | `radius-sm` or `full` |
| Avatars | `full` |

---

## 6️⃣ SHADOW SYSTEM

### Shadow Variables

```css
/* Base shadow parameters */
--shadow-x: 0px;
--shadow-y: 1px;
--shadow-blur: 4px;
--shadow-spread: 0px;
--shadow-opacity: 0.05;
--shadow-color: #000000;
```

### Shadow Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `--shadow-2xs` | `0px 1px 4px 0px hsl(0 0% 0% / 0.03)` | Subtle lift |
| `--shadow-xs` | `0px 1px 4px 0px hsl(0 0% 0% / 0.03)` | Minimal shadow |
| `--shadow-sm` | `0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)` | Buttons |
| `--shadow` | `0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)` | Default |
| `--shadow-md` | `0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05)` | Cards |
| `--shadow-lg` | `0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05)` | Dropdowns |
| `--shadow-xl` | `0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05)` | Modals |
| `--shadow-2xl` | `0px 1px 4px 0px hsl(0 0% 0% / 0.13)` | Popovers |

### Shadow Philosophy
- **Light touch**: Very subtle shadows (0.03-0.13 opacity)
- **Layered**: Multiple shadow layers for depth
- **Consistent**: Same base offset (0, 1px) across scale
- **Neutral**: Pure black shadows, no colored shadows

---

## 7️⃣ COMPONENT TOKEN MAPPING

### shadcn/ui Component → Token Mapping

#### Button Component

```css
/* Primary Button */
.btn-primary {
  background: var(--primary);        /* Orange */
  color: var(--primary-foreground);  /* White/Dark */
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* Secondary Button */
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}

/* Destructive Button */
.btn-destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
}

/* Ghost/Outline Button */
.btn-ghost {
  background: transparent;
  color: var(--foreground);
}
.btn-ghost:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

#### Card Component

```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

#### Input Component

```css
.input {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--input);
  border-radius: var(--radius-md);
}

.input:focus {
  outline: none;
  ring: 2px solid var(--ring);
  ring-offset: 2px;
  ring-offset-color: var(--background);
}
```

#### Sidebar Component

```css
.sidebar {
  background: var(--sidebar);
  color: var(--sidebar-foreground);
  border-right: 1px solid var(--sidebar-border);
}

.sidebar-item:hover {
  background: var(--sidebar-accent);
  color: var(--sidebar-accent-foreground);
}

.sidebar-item.active {
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
}

.sidebar-item:focus-visible {
  ring: 2px solid var(--sidebar-ring);
}
```

---

## 8️⃣ TAILWIND V4 INTEGRATION

### @theme inline Block

The `@theme inline` directive maps CSS variables to Tailwind utilities:

```css
@theme inline {
  /* Colors become: bg-background, text-foreground, etc. */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... */

  /* Fonts become: font-sans, font-mono, font-serif */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  /* Radius becomes: rounded-sm, rounded-md, rounded-lg, rounded-xl */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Shadows become: shadow-sm, shadow-md, shadow-lg, etc. */
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  /* ... */

  /* Tracking becomes: tracking-tight, tracking-wide, etc. */
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  /* ... */
}
```

### Utility Class Reference

| CSS Variable | Tailwind Class |
|--------------|----------------|
| `--background` | `bg-background` |
| `--foreground` | `text-foreground` |
| `--primary` | `bg-primary`, `text-primary` |
| `--primary-foreground` | `text-primary-foreground` |
| `--muted` | `bg-muted` |
| `--muted-foreground` | `text-muted-foreground` |
| `--border` | `border-border` |
| `--ring` | `ring-ring` |
| `--radius-lg` | `rounded-lg` |
| `--shadow-md` | `shadow-md` |

---

## 9️⃣ COMPLETE CSS VARIABLES EXPORT

### Light Mode (Default)

```css
:root {
  /* ===== CORE COLORS ===== */
  --background: oklch(1.0000 0 0);
  --foreground: oklch(0.2101 0.0318 264.6645);
  
  /* ===== SURFACE COLORS ===== */
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.2101 0.0318 264.6645);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.2101 0.0318 264.6645);
  
  /* ===== INTERACTIVE COLORS ===== */
  --primary: oklch(0.6716 0.1368 48.5130);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.5360 0.0398 196.0280);
  --secondary-foreground: oklch(1.0000 0 0);
  
  /* ===== UTILITY COLORS ===== */
  --muted: oklch(0.9670 0.0029 264.5419);
  --muted-foreground: oklch(0.5510 0.0234 264.3637);
  --accent: oklch(0.9491 0 0);
  --accent-foreground: oklch(0.2101 0.0318 264.6645);
  
  /* ===== SEMANTIC COLORS ===== */
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(0.9851 0 0);
  
  /* ===== BORDER & INPUT ===== */
  --border: oklch(0.9276 0.0058 264.5313);
  --input: oklch(0.9276 0.0058 264.5313);
  --ring: oklch(0.6716 0.1368 48.5130);
  
  /* ===== CHART COLORS ===== */
  --chart-1: oklch(0.5940 0.0443 196.0233);
  --chart-2: oklch(0.7214 0.1337 49.9802);
  --chart-3: oklch(0.8721 0.0864 68.5474);
  --chart-4: oklch(0.6268 0 0);
  --chart-5: oklch(0.6830 0 0);
  
  /* ===== SIDEBAR ===== */
  --sidebar: oklch(0.9670 0.0029 264.5419);
  --sidebar-foreground: oklch(0.2101 0.0318 264.6645);
  --sidebar-primary: oklch(0.6716 0.1368 48.5130);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(1.0000 0 0);
  --sidebar-accent-foreground: oklch(0.2101 0.0318 264.6645);
  --sidebar-border: oklch(0.9276 0.0058 264.5313);
  --sidebar-ring: oklch(0.6716 0.1368 48.5130);
  
  /* ===== TYPOGRAPHY ===== */
  --font-sans: Geist Mono, ui-monospace, monospace;
  --font-serif: serif;
  --font-mono: JetBrains Mono, monospace;
  --tracking-normal: 0rem;
  
  /* ===== SPACING ===== */
  --spacing: 0.25rem;
  --radius: 0.75rem;
  
  /* ===== SHADOWS ===== */
  --shadow-2xs: 0px 1px 4px 0px hsl(0 0% 0% / 0.03);
  --shadow-xs: 0px 1px 4px 0px hsl(0 0% 0% / 0.03);
  --shadow-sm: 0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
  --shadow: 0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
  --shadow-md: 0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05);
  --shadow-lg: 0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05);
  --shadow-xl: 0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05);
  --shadow-2xl: 0px 1px 4px 0px hsl(0 0% 0% / 0.13);
}
```

### Dark Mode Override

```css
.dark {
  /* ===== CORE COLORS ===== */
  --background: oklch(0.1797 0.0043 308.1928);
  --foreground: oklch(0.8109 0 0);
  
  /* ===== SURFACE COLORS ===== */
  --card: oklch(0.1822 0 0);
  --card-foreground: oklch(0.8109 0 0);
  --popover: oklch(0.1797 0.0043 308.1928);
  --popover-foreground: oklch(0.8109 0 0);
  
  /* ===== INTERACTIVE COLORS ===== */
  --primary: oklch(0.7214 0.1337 49.9802);
  --primary-foreground: oklch(0.1797 0.0043 308.1928);
  --secondary: oklch(0.5940 0.0443 196.0233);
  --secondary-foreground: oklch(0.1797 0.0043 308.1928);
  
  /* ===== UTILITY COLORS ===== */
  --muted: oklch(0.2520 0 0);
  --muted-foreground: oklch(0.6268 0 0);
  --accent: oklch(0.3211 0 0);
  --accent-foreground: oklch(0.8109 0 0);
  
  /* ===== SEMANTIC COLORS ===== */
  --destructive: oklch(0.5940 0.0443 196.0233);
  --destructive-foreground: oklch(0.1797 0.0043 308.1928);
  
  /* ===== BORDER & INPUT ===== */
  --border: oklch(0.2520 0 0);
  --input: oklch(0.2520 0 0);
  --ring: oklch(0.7214 0.1337 49.9802);
  
  /* ===== SIDEBAR ===== */
  --sidebar: oklch(0.1822 0 0);
  --sidebar-foreground: oklch(0.8109 0 0);
  --sidebar-primary: oklch(0.7214 0.1337 49.9802);
  --sidebar-primary-foreground: oklch(0.1797 0.0043 308.1928);
  --sidebar-accent: oklch(0.3211 0 0);
  --sidebar-accent-foreground: oklch(0.8109 0 0);
  --sidebar-border: oklch(0.2520 0 0);
  --sidebar-ring: oklch(0.7214 0.1337 49.9802);
}
```

---

## 🔟 HEX FALLBACK CONVERSION

For browsers without OKLCH support, here are approximate HEX values:

### Light Mode HEX

```css
:root {
  --background: #ffffff;
  --foreground: #1a1a2e;
  --card: #ffffff;
  --card-foreground: #1a1a2e;
  --popover: #ffffff;
  --popover-foreground: #1a1a2e;
  --primary: #c2633a;
  --primary-foreground: #ffffff;
  --secondary: #3d7a7a;
  --secondary-foreground: #ffffff;
  --muted: #f5f5f7;
  --muted-foreground: #6b6b7a;
  --accent: #ebebeb;
  --accent-foreground: #1a1a2e;
  --destructive: #dc3545;
  --destructive-foreground: #fafafa;
  --border: #e5e5e8;
  --input: #e5e5e8;
  --ring: #c2633a;
  --chart-1: #4a8585;
  --chart-2: #d97b4a;
  --chart-3: #e8c07a;
  --chart-4: #8c8c8c;
  --chart-5: #a3a3a3;
  --sidebar: #f5f5f7;
  --sidebar-foreground: #1a1a2e;
  --sidebar-primary: #c2633a;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #ffffff;
  --sidebar-accent-foreground: #1a1a2e;
  --sidebar-border: #e5e5e8;
  --sidebar-ring: #c2633a;
}
```

### Dark Mode HEX

```css
.dark {
  --background: #121214;
  --foreground: #c9c9c9;
  --card: #141414;
  --card-foreground: #c9c9c9;
  --popover: #121214;
  --popover-foreground: #c9c9c9;
  --primary: #d97b4a;
  --primary-foreground: #121214;
  --secondary: #4a8585;
  --secondary-foreground: #121214;
  --muted: #2a2a2a;
  --muted-foreground: #8c8c8c;
  --accent: #3d3d3d;
  --accent-foreground: #c9c9c9;
  --destructive: #4a8585;
  --destructive-foreground: #121214;
  --border: #2a2a2a;
  --input: #2a2a2a;
  --ring: #d97b4a;
  --sidebar: #141414;
  --sidebar-foreground: #c9c9c9;
  --sidebar-primary: #d97b4a;
  --sidebar-primary-foreground: #121214;
  --sidebar-accent: #3d3d3d;
  --sidebar-accent-foreground: #c9c9c9;
  --sidebar-border: #2a2a2a;
  --sidebar-ring: #d97b4a;
}
```

---

## 1️⃣1️⃣ JSON DESIGN TOKENS

```json
{
  "colors": {
    "light": {
      "background": { "oklch": "oklch(1.0000 0 0)", "hex": "#ffffff" },
      "foreground": { "oklch": "oklch(0.2101 0.0318 264.6645)", "hex": "#1a1a2e" },
      "primary": { "oklch": "oklch(0.6716 0.1368 48.5130)", "hex": "#c2633a" },
      "secondary": { "oklch": "oklch(0.5360 0.0398 196.0280)", "hex": "#3d7a7a" },
      "muted": { "oklch": "oklch(0.9670 0.0029 264.5419)", "hex": "#f5f5f7" },
      "accent": { "oklch": "oklch(0.9491 0 0)", "hex": "#ebebeb" },
      "destructive": { "oklch": "oklch(0.6368 0.2078 25.3313)", "hex": "#dc3545" },
      "border": { "oklch": "oklch(0.9276 0.0058 264.5313)", "hex": "#e5e5e8" }
    },
    "dark": {
      "background": { "oklch": "oklch(0.1797 0.0043 308.1928)", "hex": "#121214" },
      "foreground": { "oklch": "oklch(0.8109 0 0)", "hex": "#c9c9c9" },
      "primary": { "oklch": "oklch(0.7214 0.1337 49.9802)", "hex": "#d97b4a" },
      "secondary": { "oklch": "oklch(0.5940 0.0443 196.0233)", "hex": "#4a8585" },
      "muted": { "oklch": "oklch(0.2520 0 0)", "hex": "#2a2a2a" },
      "accent": { "oklch": "oklch(0.3211 0 0)", "hex": "#3d3d3d" },
      "destructive": { "oklch": "oklch(0.5940 0.0443 196.0233)", "hex": "#4a8585" },
      "border": { "oklch": "oklch(0.2520 0 0)", "hex": "#2a2a2a" }
    },
    "chart": {
      "1": { "oklch": "oklch(0.5940 0.0443 196.0233)", "hex": "#4a8585" },
      "2": { "oklch": "oklch(0.7214 0.1337 49.9802)", "hex": "#d97b4a" },
      "3": { "oklch": "oklch(0.8721 0.0864 68.5474)", "hex": "#e8c07a" },
      "4": { "oklch": "oklch(0.6268 0 0)", "hex": "#8c8c8c" },
      "5": { "oklch": "oklch(0.6830 0 0)", "hex": "#a3a3a3" }
    }
  },
  "typography": {
    "fontFamilies": {
      "sans": "Geist Mono, ui-monospace, monospace",
      "serif": "serif",
      "mono": "JetBrains Mono, monospace"
    },
    "tracking": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  },
  "spacing": {
    "base": "0.25rem"
  },
  "borderRadius": {
    "sm": "0.5rem",
    "md": "0.625rem",
    "lg": "0.75rem",
    "xl": "1rem"
  },
  "shadows": {
    "2xs": "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
    "xs": "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
    "sm": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
    "default": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
    "md": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05)",
    "lg": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05)",
    "xl": "0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05)",
    "2xl": "0px 1px 4px 0px hsl(0 0% 0% / 0.13)"
  }
}
```

---

## 1️⃣2️⃣ THEME ADAPTATION GUIDE

### Core Identity Elements

1. **Warm Orange Primary** - Hue ~48-50° in OKLCH
2. **Teal Secondary** - Hue ~196° in OKLCH  
3. **Monospace Typography** - Technical, developer aesthetic
4. **Subtle Shadows** - Very light opacity (0.03-0.13)
5. **Purple-tinted Dark Mode** - Hue 308° in background

### Safe Adaptations

| Original | Adaptation Options |
|----------|-------------------|
| Orange primary (H: 48°) | Coral (H: 25°), Gold (H: 70°), Amber (H: 55°) |
| Teal secondary (H: 196°) | Blue (H: 230°), Green (H: 150°), Cyan (H: 190°) |
| Purple-tint dark (H: 308°) | Blue-tint (H: 260°), Neutral (H: 0, C: 0) |

### OKLCH Color Manipulation

```css
/* To shift the entire palette warmer */
/* Add ~15° to all hue values */

/* To shift cooler */
/* Subtract ~15° from all hue values */

/* To increase vibrancy */
/* Increase chroma values by 0.02-0.05 */

/* To make more muted */
/* Decrease chroma values, or set to 0 for grayscale */
```

---

## 1️⃣3️⃣ INSTALLATION & USAGE

### Install via shadcn CLI

```bash
# Using npm
npx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json

# Using pnpm
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json

# Using yarn
yarn dlx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json

# Using bun
bunx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json
```

### Manual Installation

1. Copy the CSS variables to your `globals.css` or `index.css`
2. Ensure Tailwind v4 is configured with the `@theme inline` block
3. Import the required fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Dark Mode Toggle

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark');

// Or with system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│               DARK MATTER THEME CHEAT SHEET             │
├─────────────────────────────────────────────────────────┤
│ PRIMARY COLOR                                           │
│   Light: oklch(0.67 0.14 48) → #c2633a (warm orange)   │
│   Dark:  oklch(0.72 0.13 50) → #d97b4a (lighter)       │
├─────────────────────────────────────────────────────────┤
│ SECONDARY COLOR                                         │
│   Light: oklch(0.54 0.04 196) → #3d7a7a (teal)         │
│   Dark:  oklch(0.59 0.04 196) → #4a8585 (teal)         │
├─────────────────────────────────────────────────────────┤
│ BACKGROUNDS                                             │
│   Light: #ffffff | Dark: #121214 (purple-tinted)       │
├─────────────────────────────────────────────────────────┤
│ TYPOGRAPHY                                              │
│   Sans: Geist Mono | Mono: JetBrains Mono              │
├─────────────────────────────────────────────────────────┤
│ RADIUS                                                  │
│   sm: 8px | md: 10px | lg: 12px | xl: 16px             │
├─────────────────────────────────────────────────────────┤
│ SPACING BASE: 4px (0.25rem)                            │
├─────────────────────────────────────────────────────────┤
│ SHADOWS: Very subtle (0.03-0.13 opacity)               │
└─────────────────────────────────────────────────────────┘
```

---

*Dark Matter Theme extracted for Tailwind v4 + shadcn/ui projects.*
