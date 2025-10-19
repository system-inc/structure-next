# Style Cleanup Phase 3: Remove Duplicate CSS Variables

**Priority:** High
**Estimated Time:** 30 minutes
**Risk:** Low (just removing duplicates)

## Overview

Remove ~300 lines of duplicated CSS variables from theme.css that are already defined in structure's variables.css. Keep only project-specific overrides.

## Duplicates to Remove from `/app/_theme/styles/theme.css`

### 1. Transparent Scales (Lines 4-69)

-   Remove all `--transparent-white-*` and `--transparent-black-*` variables
-   These are duplicated from `/libraries/structure/source/theme/styles/variables.css` lines 2-69

### 2. Black/White/Gray Scales (Lines 72-139)

-   Remove `--black-*`, `--white-*`, `--gray-*` variables (all scales from 0-1000)
-   Already defined in structure's variables.css lines 71-138

### 3. Border Radius Variables (Lines 312-318)

-   Remove `--border-radius-*` variables
-   Already in structure's variables.css lines 156-162

### 4. Shadow/Effects Variables (Lines 145-150, 320-326)

-   Remove `--effects-shadow-*` variables
-   Remove `--shadow-01` through `--shadow-05` (redundant with Tailwind boxShadow config)
-   Keep only in structure's variables.css lines 242-246

### 5. Phi Variable (Line 341)

-   Remove `--phi: 1.618rem;`
-   Already in structure's variables.css line 4

### 6. Semantic Color Mappings (Lines 164-247 - if duplicated)

-   Check if `--background-primary`, `--foreground-primary`, etc. are duplicated
-   Keep project-specific opsis mappings, remove structure duplicates

## What to KEEP in theme.css

### Keep Project-Specific:

-   **Opsis tokenized colors** (lines 37-171) - Project-specific design system
-   **Badge colors** (custom, non-generated)
-   **Phi spacing multiples** (if project-specific)
-   **Old colors** (lines 173-232) - Will be removed in Phase 4, but keep for now

### Keep Shadcn Variables (if used):

-   Lines 343-363 and 440-460 (old shadcn system)
-   Only if shadcn components are still in use
-   Document as "shadcn compatibility only"

## Expected Result

-   **Before:** theme.css ~530 lines
-   **After:** theme.css ~230 lines
-   **Removed:** ~300 lines of duplicates

## Testing

-   [ ] Run `npm run dev`
-   [ ] Verify all colors still work in light mode
-   [ ] Verify all colors still work in dark mode
-   [ ] Check buttons, forms, tables for visual regressions
-   [ ] Run `npm run build` successfully

## Success Criteria

-   ✅ No duplicate CSS variables between theme.css and variables.css
-   ✅ All colors render correctly
-   ✅ No build errors
-   ✅ File size reduced by ~300 lines
