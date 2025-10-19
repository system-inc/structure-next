# Style Cleanup Phase 6: Consolidate Animations

**Priority:** Medium
**Estimated Time:** 30 minutes
**Risk:** Low

## Overview
Move all animation definitions to a single location (animations.css) for better organization and maintainability.

## Current State - Animations Scattered Across 3 Files

### 1. TailwindConfiguration.ts (lines 174-211)
```typescript
keyframes: {
    'accordion-down': { ... },
    'accordion-up': { ... },
    blink: { ... },
    blinkOnce: { ... },
    shimmer: { ... },
}
animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    blink: 'blink 1.3s ease-in-out infinite',
    blinkOnce: 'blinkOnce 500ms linear',
    shimmer: 'shimmer 5s infinite',
}
```

### 2. animations.css (lines 1-54)
- Custom centered animations for dialogs
- `@keyframes in-centered`, `@keyframes out-centered`
- Utility classes for these animations

### 3. theme.css (lines 478-531)
```css
@keyframes marquee { ... }
@keyframes borderGlow { ... }
.animate-marquee { ... }
.animate-border-glow { ... }
```

## New Organization

### Move to `/libraries/structure/source/theme/styles/animations.css`

**Section 1: Dialog/Modal Animations** (keep existing)
```css
/* Dialog/Modal Centered Animations */
@keyframes in-centered { ... }
@keyframes out-centered { ... }
/* Utility classes */
.animate-in-centered { ... }
.animate-out-centered { ... }
```

**Section 2: Project-Specific Animations** (move from theme.css)
```css
/* Marquee Animation */
@keyframes marquee { ... }
.animate-marquee { ... }

/* Border Glow Animation */
@keyframes borderGlow { ... }
.animate-border-glow { ... }
```

**Section 3: Tailwind-Managed Animations** (document, keep in config)
```css
/*
 * The following animations are defined in TailwindConfiguration.ts
 * and available as Tailwind utilities (animate-blink, etc.):
 * - accordion-down / accordion-up
 * - blink / blinkOnce
 * - shimmer
 */
```

## Tasks

### 1. Move Animations from theme.css
- **Source:** `/app/_theme/styles/theme.css` lines 478-531
- **Destination:** `/libraries/structure/source/theme/styles/animations.css`
- **Move:**
  - `@keyframes marquee`
  - `@keyframes borderGlow`
  - `.animate-marquee` utility class
  - `.animate-border-glow` utility class

### 2. Remove from theme.css
- Delete lines 478-531 after moving to animations.css

### 3. Add Documentation Comment
- Add comment block in animations.css explaining organization
- Note which animations are in Tailwind config vs CSS file

### 4. Verify Imports
- Ensure animations.css is imported in the build
- Check that marquee and borderGlow animations still work

## Documentation to Add

```css
/**
 * Structure Library Animations
 *
 * Organization:
 * - Dialog/Modal animations: Defined here as @keyframes + utility classes
 * - Tailwind-managed animations: Defined in TailwindConfiguration.ts
 *   (Available as animate-blink, animate-shimmer, etc.)
 * - Project-specific animations: Moved from theme.css
 *
 * Adding new animations:
 * 1. Simple animations: Add @keyframes here
 * 2. Tailwind utilities: Add to TailwindConfiguration.ts extend.animation
 */
```

## Testing
- [ ] Dialog/modal animations work (centered fade/zoom)
- [ ] Marquee animation works if used
- [ ] Border glow animation works if used
- [ ] Tailwind animations work (blink, shimmer, accordion)
- [ ] No console errors
- [ ] Build succeeds

## Success Criteria
- ✅ All animation definitions organized logically
- ✅ Single source of truth for CSS animations
- ✅ Clear documentation of organization
- ✅ All animations work identically to before
- ✅ theme.css no longer contains animations
