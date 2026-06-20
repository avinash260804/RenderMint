# ATELIER ANIMATION SPECIFICATIONS

## Summary

Based on the Atelier architecture documentation, animations in the project follow a **tiered motion language**:

1. **Premium/Hero animations** - GSAP-driven, complex scene motion (landing, hero sections, imported v0 surfaces)
2. **Community page animations** - Light CSS transitions (form interactions, button feedback)
3. **Accessibility** - Full respect for `prefers-reduced-motion` media query

---

## Animation Stack

### Primary Tools
- **GSAP** - Hero animations, complex scene transitions, premium surfaces
- **Framer Motion** - Imported premium components, some card/grid motion
- **CSS Transitions** - Form interactions, basic state changes (primary for community pages)

### Application
- **Hero/Landing:** Rich GSAP animations (scene parallax, scrolling effects, tween sequences)
- **Premium Surfaces:** Imported v0 components with Framer Motion choreography
- **Community Pages:** Light CSS transitions (buttons, toggles, focus states)

---

## Atelier Settings Page - Light Motion Language

The Settings page should use **community page motion standards** (not hero/premium motion).

### Specifications by Interaction

#### 1. Form Input Interactions
**When:** User focuses/blurs form inputs

```css
/* Focus state */
input:focus {
  border-color: var(--accent, #ff6b35);
  transition: border-color 0.15s ease;
}

/* Tailwind class */
.transition-colors duration-150
```

**Duration:** 150ms
**Easing:** ease (linear cubic-bezier)
**Effect:** Border color fade from gray to orange

---

#### 2. Toggle Switch Interaction
**When:** User clicks a toggle switch

```css
/* Toggle state change */
.toggle {
  transition-all duration-200;
}

.toggle.active {
  background-color: var(--accent);
  transform: translateX(24px);
}
```

**Duration:** 200ms
**Easing:** ease (default)
**Effect:** Smooth slide + color change

**Keyboard Accessible:** Press Space/Enter to toggle

---

#### 3. Button Hover/Active States
**When:** User hovers or clicks buttons

```css
/* Pill button */
.pill-button {
  transition: all 0.15s ease;
}

.pill-button:hover {
  opacity: 0.9;
}

.pill-button:active {
  transform: scale(0.98);
}
```

**Duration:** 150ms hover, 100ms active
**Easing:** ease
**Effect:** Subtle opacity fade + micro-scale on press

---

#### 4. SaveBar Appearance (Custom Animation)
**When:** Form becomes dirty (has unsaved changes)

```typescript
// Slide up from bottom + fade in
@keyframes slideUpFromBottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.save-bar {
  animation: slideUpFromBottom 300ms ease-out forwards;
}

.save-bar-backdrop {
  backdrop-filter: blur(4px);
  background: rgba(10, 10, 10, 0.5);
}
```

**Duration:** 300ms
**Easing:** ease-out (cubic-bezier(0.16, 1, 0.3, 1))
**Effect:** 
- SaveBar slides up from bottom with smooth deceleration
- Background blurs slightly
- Appears immediately when form is modified

**Disappear:** Slide down + fade (reverse) when cleared or saved

---

#### 5. Toast Notification Lifecycle
**When:** User saves settings or encounters error

```typescript
// Fade in
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

// Fade out (after 3 seconds)
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.toast {
  animation: fadeIn 150ms ease-out;
  animation-fill-mode: forwards;
}

.toast.dismissing {
  animation: fadeOut 300ms ease-in;
}
```

**Timings:**
- **Appear:** 150ms ease-out
- **Dwell:** 3000ms (3 seconds) - static, no motion
- **Disappear:** 300ms ease-in
- **Total lifecycle:** 3450ms

**Position:** Bottom-right corner
**Variants:**
- Success (green checkmark) + message
- Error (orange × or alert icon) + message

---

#### 6. Sidebar Navigation Highlight
**When:** User navigates between settings sections

```css
/* Active nav item */
.nav-item.active {
  background-color: var(--accent);
  transition: background-color 0.2s ease;
}

.nav-item {
  transition: background-color 0.15s ease;
}

.nav-item:hover:not(.active) {
  background-color: var(--muted);
}
```

**Duration:** 200ms for active, 150ms for hover
**Easing:** ease
**Effect:** Background color smooth transition to orange

---

### Reduce Motion Implementation

When user enables "Reduce Motion" in Appearance settings:

```html
<!-- Set on <html> element -->
<html data-reduce-motion="true">
```

```css
/* Disable ALL animations/transitions */
[data-reduce-motion="true"] * {
  transition-duration: 0.01ms !important;
  animation-duration: 0.01ms !important;
}
```

**Behavior:**
- All durations collapse to 0.01ms (effectively instant)
- All animations/transitions still occur (state changes happen)
- No visual motion/smoothing
- Respects OS `prefers-reduced-motion: reduce` by default

**Detection Code:**
```typescript
// Check if user has system-level reduce-motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Or read from HTML attribute
const hasReducedMotion = document.documentElement.getAttribute('data-reduce-motion') === 'true'
```

---

## Framer Motion / GSAP - NOT Required

The Settings page should **NOT** include:
- ❌ Stagger animations (sequential element animations)
- ❌ Complex GSAP tweens
- ❌ Parallax or scroll-driven motion
- ❌ Advanced Framer Motion choreography
- ❌ Page transition animations
- ❌ Morph/clip-path animations
- ❌ Heavy hero animations

These are reserved for:
- Landing pages
- Hero sections
- Imported v0 premium surfaces
- Marketing/preview areas

---

## Motion Summary Table

| Interaction | Tool | Duration | Easing | Effect |
|---|---|---|---|---|
| Input focus | CSS | 150ms | ease | Border color orange |
| Toggle switch | CSS | 200ms | ease | Slide + color |
| Button hover | CSS | 150ms | ease | Opacity fade |
| Button press | CSS | 100ms | ease | Scale micro |
| SaveBar appear | CSS + Keyframes | 300ms | ease-out | Slide up + fade in |
| SaveBar dismiss | CSS + Keyframes | 300ms | ease-out | Slide down + fade out |
| Toast appear | CSS + Keyframes | 150ms | ease-out | Fade in + translate |
| Toast dismiss | CSS + Keyframes | 300ms | ease-in | Fade out |
| Nav highlight | CSS | 200ms | ease | Background color |

---

## CSS Custom Properties for Motion

If building a motion utility library, use these CSS variables:

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  
  /* Easings */
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Combined */
  --transition-fast: all var(--duration-fast) var(--easing-in-out);
  --transition-normal: all var(--duration-normal) var(--easing-in-out);
}
```

---

## Accessibility Considerations

1. **Always provide non-motion fallback:**
   - State changes must be visible even without animation
   - Color, opacity, scale, or text change (not just motion)

2. **Test with `prefers-reduced-motion`:**
   ```bash
   # Chrome DevTools: Rendering > Emulate CSS media feature prefers-reduced-motion
   ```

3. **Keyboard navigation must work without hover effects:**
   - Use `:focus-visible` for keyboard focus
   - `:hover` for mouse only

4. **Screen reader announcements:**
   - Use `aria-live="polite"` for toast/SaveBar
   - Don't hide state changes behind animations

---

## Tailwind CSS Motion Classes

Atelier uses Tailwind CSS v4. Available motion utilities:

```
transition-all          /* All properties */
transition-colors       /* Color transitions only */
transition-opacity      /* Opacity only */
transition-transform    /* Transform only */

duration-150            /* 150ms */
duration-200            /* 200ms */
duration-300            /* 300ms */
duration-500            /* 500ms */

ease-in                 /* cubic-bezier(0.4, 0, 1, 1) */
ease-out                /* cubic-bezier(0, 0, 0.2, 1) */
ease-in-out             /* cubic-bezier(0.4, 0, 0.2, 1) */
ease-linear             /* linear */
```

**Usage:**
```html
<!-- Smooth border color change on focus -->
<input class="transition-colors duration-150 ease-out focus:border-accent" />

<!-- Toggle slide animation -->
<div class="toggle transition-all duration-200 active:translate-x-6" />
```

---

## Files to Update/Create

1. **Global motion CSS:**
   - `src/app/globals.css` - Add motion utility variables + `[data-reduce-motion]` rule

2. **Settings component styles:**
   - Component-scoped styles for SaveBar keyframes
   - Toast keyframes
   - Inline Tailwind motion classes

3. **Toast component:**
   - Implement fade in/out animations
   - 3-second auto-dismiss timer

4. **SaveBar component:**
   - Implement slide-up animation
   - Backdrop blur effect

5. **Form inputs:**
   - Add `transition-colors duration-150` focus state

6. **Toggle switches:**
   - Add `transition-all duration-200` for state changes

---

## Testing Motion

```typescript
// Test reduce-motion behavior
it('respects prefers-reduced-motion', () => {
  const html = document.documentElement
  html.setAttribute('data-reduce-motion', 'true')
  
  // Animation should occur but instantly (0.01ms)
  const toast = screen.getByRole('alert')
  expect(toast).toBeInTheDocument()
  
  // Visual change should be immediate
  expect(getComputedStyle(toast).opacity).toBe('1')
})

// Test SaveBar animation
it('animates SaveBar slide-up', async () => {
  const user = userEvent.setup()
  render(<SettingsPage />)
  
  const input = screen.getByLabelText('Display Name')
  await user.type(input, 'New Name')
  
  const saveBar = screen.getByText('UNSAVED CHANGES')
  // Should have animation class applied
  expect(saveBar).toHaveClass('animate-slideUp')
})
```

---

## Summary

Settings page animations are **deliberately light:**

- **Focus:** Form interaction feedback, not visual spectacle
- **Tool:** CSS transitions + simple keyframes, not GSAP/Framer Motion
- **Duration:** 150-300ms range (fast)
- **Easing:** Mostly ease or ease-out (natural deceleration)
- **Accessibility:** Full respect for `prefers-reduced-motion`

This maintains the Atelier design philosophy: **form follows function**, with motion serving clarity, not distraction.
