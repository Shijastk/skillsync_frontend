# Landing Page Color System Documentation

## Overview
This document provides a comprehensive guide to the color system available for building stunning landing pages in the Black and White Skillswap project.

## Color Categories

### 1. Neutral Colors (Black & White Theme)
Perfect for creating high-contrast, modern designs:

```css
--color-black: #000000
--color-white: #ffffff
--color-dark: #030303
--color-dark-lighter: #0a0a0a
--color-dark-light: #1a1a1a
```

**Usage Examples:**
```jsx
// Tailwind classes
<div className="bg-dark text-white">Dark background with white text</div>
<div className="bg-white text-dark">White background with dark text</div>

// CSS variables
<div style={{ backgroundColor: 'var(--color-dark)' }}>Custom styling</div>
```

---

### 2. Gray Scale
A complete gray palette for subtle variations:

```css
--color-gray-50 to --color-gray-950 (11 shades)
```

**Usage Examples:**
```jsx
<div className="bg-gray-100 text-gray-900">Light gray background</div>
<div className="border border-gray-300">Gray border</div>
<p className="text-gray-600">Muted text</p>
```

---

### 3. Vibrant Accent Colors
Use these to make your landing page pop!

#### Violet/Purple
```css
--color-violet-50 to --color-violet-900
```
```jsx
<button className="bg-violet-500 hover:bg-violet-600 text-white">
  Violet Button
</button>
```

#### Indigo
```css
--color-indigo-50 to --color-indigo-900
```
```jsx
<div className="bg-indigo-500/10 border border-indigo-500">
  Indigo accent box
</div>
```

#### Rose/Pink
```css
--color-rose-50 to --color-rose-900
```
```jsx
<span className="text-rose-500">Rose colored text</span>
```

#### Cyan/Teal
```css
--color-cyan-50 to --color-cyan-900
```
```jsx
<div className="bg-cyan-500 text-white">Cyan background</div>
```

#### Amber/Gold
```css
--color-amber-50 to --color-amber-900
```
```jsx
<div className="bg-amber-400 text-dark">Amber highlight</div>
```

---

### 4. Primary Theme Colors
Pre-configured theme colors for consistency:

```css
--color-primary: #8b5cf6 (Violet)
--color-primary-light: #a78bfa
--color-primary-dark: #7c3aed

--color-secondary: #06b6d4 (Cyan)
--color-secondary-light: #22d3ee
--color-secondary-dark: #0891b2

--color-accent: #f43f5e (Rose)
--color-accent-light: #fb7185
--color-accent-dark: #e11d48
```

**Usage Examples:**
```jsx
<button className="bg-primary hover:bg-primary-dark text-white">
  Primary Action
</button>

<div className="bg-secondary/10 border border-secondary">
  Secondary highlight
</div>

<span className="text-accent">Accent text</span>
```

---

### 5. Semantic Colors
For UI feedback and states:

```css
Success: --color-success (green)
Warning: --color-warning (amber)
Error: --color-error (red)
Info: --color-info (blue)
```

**Usage Examples:**
```jsx
<div className="bg-success text-white">Success message</div>
<div className="bg-warning text-dark">Warning message</div>
<div className="bg-error text-white">Error message</div>
<div className="bg-info text-white">Info message</div>
```

---

### 6. Gradient Colors
Pre-defined gradients for stunning backgrounds:

```css
--gradient-primary: Violet to Indigo
--gradient-secondary: Cyan to Blue
--gradient-accent: Rose gradient
--gradient-sunset: Amber to Rose
--gradient-ocean: Cyan to Violet
--gradient-dark: Dark gradient
--gradient-light: Light gradient
```

**Usage Examples:**
```jsx
// Using Tailwind
<div className="bg-gradient-primary">Gradient background</div>
<div className="bg-gradient-ocean text-white">Ocean gradient</div>

// Using inline styles
<div style={{ background: 'var(--gradient-sunset)' }}>
  Sunset gradient
</div>
```

---

### 7. Opacity Variants
For glassmorphism and layered effects:

```css
--opacity-5: 0.05
--opacity-10: 0.1
--opacity-15: 0.15
--opacity-20: 0.2
--opacity-30: 0.3
--opacity-40: 0.4
--opacity-50: 0.5
--opacity-60: 0.6
--opacity-70: 0.7
--opacity-80: 0.8
--opacity-90: 0.9
```

**Usage Examples:**
```jsx
// Glassmorphism effect
<div className="bg-white/10 backdrop-blur-lg border border-white/20">
  Glass card
</div>

// Semi-transparent overlays
<div className="bg-dark/80">Dark overlay</div>
<div className="bg-violet-500/15">Subtle violet tint</div>
```

---

## Complete Landing Page Examples

### Example 1: Hero Section with Gradient
```jsx
<section className="min-h-screen bg-dark relative overflow-hidden">
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-ocean opacity-20" />
  
  {/* Content */}
  <div className="relative z-10 container mx-auto px-6 py-20">
    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-white to-rose-300">
      Welcome to Our Platform
    </h1>
    <p className="text-gray-400 text-xl mt-4">
      Building the future, one pixel at a time
    </p>
    <button className="mt-8 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all">
      Get Started
    </button>
  </div>
</section>
```

### Example 2: Feature Card with Glassmorphism
```jsx
<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
  <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4">
    <Icon className="text-violet-400" />
  </div>
  <h3 className="text-xl font-semibold text-white mb-2">Feature Title</h3>
  <p className="text-gray-400">Feature description goes here</p>
</div>
```

### Example 3: CTA Section with Gradient
```jsx
<section className="bg-gradient-sunset py-20">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold text-white mb-4">
      Ready to Get Started?
    </h2>
    <p className="text-white/80 mb-8">
      Join thousands of satisfied users today
    </p>
    <button className="bg-white text-rose-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all">
      Start Free Trial
    </button>
  </div>
</section>
```

---

## Best Practices

### 1. **Contrast is Key**
- Always ensure sufficient contrast between text and background
- Use light text on dark backgrounds and vice versa
- Test with accessibility tools

### 2. **Use Opacity for Depth**
- Layer elements with different opacity levels
- Create depth with `bg-white/5`, `bg-white/10`, etc.
- Combine with `backdrop-blur` for glassmorphism

### 3. **Gradient Usage**
- Use gradients sparingly for maximum impact
- Apply to hero sections, CTAs, and key highlights
- Combine with text using `bg-clip-text text-transparent`

### 4. **Color Harmony**
- Stick to 2-3 main colors per page
- Use the primary, secondary, and accent colors consistently
- Add pops of color with the vibrant accent palette

### 5. **Dark Mode First**
- The system is optimized for dark backgrounds
- Use `bg-dark` as your base
- Layer with semi-transparent whites for UI elements

---

## Quick Reference

### Most Used Combinations

```jsx
// Dark hero with gradient text
<div className="bg-dark">
  <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-rose-300">
    Gradient Text
  </h1>
</div>

// Glass card
<div className="bg-white/5 backdrop-blur-lg border border-white/10">
  Glass effect
</div>

// Floating shape
<div className="bg-gradient-to-r from-violet-500/15 to-transparent rounded-full blur-3xl">
  Ambient glow
</div>

// Primary button
<button className="bg-primary hover:bg-primary-dark text-white">
  Click me
</button>

// Success state
<div className="bg-success/10 border border-success text-success">
  Success message
</div>
```

---

## Need Help?

- All colors are defined in `src/main.css` under the `@theme` section
- Tailwind mappings are in `tailwind.config.js`
- Use browser DevTools to inspect and experiment with colors
- Check the Hero.jsx component for real-world examples
