# Style Cleanup Phase 7: Documentation & Guidelines

**Priority:** Low
**Estimated Time:** 45 minutes
**Risk:** None (documentation only)

## Overview

Create comprehensive documentation for the color system architecture and style organization to prevent future confusion and regressions.

## Tasks

### 1. Create Color System Documentation

-   **File:** Create `/libraries/structure/docs/ColorSystem.md`
-   **Content:**

````markdown
# Structure Color System Architecture

## Overview

The Structure library uses a two-layer color system: foundational scales for the library, and semantic tokens for projects.

## Structure Layer: 0-1000 Scales

**Purpose:** Reusable, framework-agnostic color foundation
**Usage:** Structure library components only

### Scales (21 steps each, every 50):

-   **black-0 to black-1000**: #505050 → #000000 (lightest to darkest)
-   **gray-0 to gray-1000**: #a7a7a7 → #585858 (light gray to dark gray)
-   **white-0 to white-1000**: #afafaf → #ffffff (darkest to lightest)

### Examples:

```tsx
// Structure components use numeric scales
<button className="bg-white-900 border-black-300">
```
````

## Project Layer: Opsis Semantic Tokens

**Purpose:** Themeable, semantic design tokens
**Usage:** Project-specific components

### Categories:

-   `opsis-content-*`: Text colors (primary, secondary, tertiary, etc.)
-   `opsis-background-*`: Background colors
-   `opsis-action-*`: Interactive element colors
-   `opsis-border-*`: Border colors
-   `opsis-link-*`: Link colors

### Examples:

```tsx
// Project components use semantic tokens
<div className="bg-opsis-background-primary foreground--a">
```

## When to Use Which System

| Context                     | Use           | Example                         |
| --------------------------- | ------------- | ------------------------------- |
| Structure library component | 0-1000 scales | `bg-white-850 border-black-400` |
| Project-specific component  | Opsis tokens  | `bg-opsis-background-primary`   |
| Quick prototype (structure) | 0-1000 scales | `text-black-700`                |
| Production (project)        | Opsis tokens  | `foreground--b`                 |

## Migration from Old System

### Old → New Mapping:

-   `light-1` → `white-950`
-   `light-2` → `white-850`
-   `dark-2` → `black-700`
-   `dark-3` → `black-600`
-   `neutral` → `gray-500`

**Status:** Old system removed as of [Date]

## Color Variables Location

-   **0-1000 scales**: `/libraries/structure/source/theme/styles/variables.css`
-   **Opsis tokens**: `/app/_theme/styles/theme.css`
-   **Tailwind config**: Maps variables to utility classes

````

### 2. Add Color System Usage Comments

#### In `/libraries/structure/source/theme/styles/variables.css`:
```css
/**
 * Structure Color System - Foundation Scales
 *
 * These scales provide 21 steps (0-1000, every 50) for precise color control.
 * Use these in Structure library components for framework-agnostic styling.
 *
 * For project-specific code, use Opsis semantic tokens instead.
 * See: /libraries/structure/docs/ColorSystem.md
 */
````

#### In `/app/_theme/styles/theme.css`:

```css
/**
 * Project Color System - Opsis Semantic Tokens
 *
 * These semantic tokens provide themeable, context-aware colors.
 * Use these in project-specific components instead of direct color values.
 *
 * Structure library uses 0-1000 scales - see variables.css
 * See: /libraries/structure/docs/ColorSystem.md
 */
```

### 3. Document !important Usage

#### In `/libraries/structure/source/theme/styles/global.css`:

```css
/*
 * React Day Picker Border Radius Override
 *
 * !important is required here to override react-day-picker's inline styles.
 * The library sets conflicting border-radius values that must be overridden
 * to maintain consistent styling with our design system.
 */
.rdp-month {
    border-radius: var(--border-radius-medium) !important;
}
```

### 4. Create Style Organization Guide

-   **File:** Create `/libraries/structure/docs/StyleOrganization.md`
-   **Content:**

```markdown
# Style Organization Guide

## File Structure
```

/app/\_theme/styles/
└── theme.css # Project-specific styles (Opsis tokens, custom styles)

/libraries/structure/source/theme/styles/
├── variables.css # Foundation color scales (0-1000 system)
├── animations.css # All CSS animations and keyframes
└── global.css # Global utility classes and third-party overrides

```

## What Goes Where

### theme.css (Project Layer)
- Opsis semantic tokens
- Project-specific custom colors
- Project-specific utilities
- **DO NOT**: Duplicate structure variables

### variables.css (Structure Layer)
- Black/white/gray 0-1000 scales
- Transparent color scales
- Structure semantic mappings
- Global color scales (blue, orange, red, green, etc.)

### animations.css (Structure Layer)
- All @keyframes definitions
- Animation utility classes
- Documentation of Tailwind-managed animations

### global.css (Structure Layer)
- Third-party library style overrides
- Global utility classes (links, etc.)
- Reset/normalization styles

## Adding New Styles

### New Color
1. **Project-specific?** → Add Opsis token to theme.css
2. **Reusable?** → Add to appropriate scale in variables.css

### New Animation
1. **Simple CSS animation?** → Add to animations.css
2. **Need Tailwind utility?** → Add to TailwindConfiguration.ts

### New Utility
1. **Project-specific?** → Add to theme.css
2. **Reusable?** → Add to global.css or create new utility file

## Guidelines

- ✅ Use semantic tokens in project code
- ✅ Use 0-1000 scales in structure library
- ✅ Document why !important is used
- ❌ Don't duplicate variables across files
- ❌ Don't use @apply on global elements (body, *, etc.)
- ❌ Don't mix color systems within a component
```

### 5. Add Inline Documentation for Complex Sections

Update theme.css with section markers:

```css
/* ============================================
   OPSIS SEMANTIC TOKENS - Project Design System
   ============================================
   These tokens are used in project-specific components.
   Structure library components use 0-1000 scales instead.
   ============================================ */

/* ============================================
   SHADCN COMPATIBILITY VARIABLES
   ============================================
   Legacy variables for shadcn/ui components.
   Only used if shadcn components are present.
   ============================================ */
```

## Testing

-   [ ] Documentation is clear and accurate
-   [ ] Examples in docs actually work
-   [ ] Links to docs are correct
-   [ ] All style files have header comments

## Success Criteria

-   ✅ ColorSystem.md created with comprehensive guide
-   ✅ StyleOrganization.md created with file structure docs
-   ✅ All style files have explanatory headers
-   ✅ !important usage is documented
-   ✅ Future developers can understand the system
