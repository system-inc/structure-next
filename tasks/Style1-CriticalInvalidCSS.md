# Style Cleanup Phase 1: Critical Invalid CSS Fixes

**Priority:** Critical
**Estimated Time:** 15 minutes
**Risk:** Low

## Overview

Fix invalid CSS and critical syntax errors that could cause parsing issues or unexpected behavior.

## Tasks

### 1. Fix Invalid CSS: Move `strong` Element Out of `:root` Block

-   **File:** `/app/_theme/styles/theme.css`
-   **Line:** 365-367
-   **Issue:** The `strong { font-weight: 500; }` rule is nested inside `:root {}` which is invalid CSS
-   **Fix:** Move this rule to the Tailwind plugin in `tailwind.config.mts` where other base element styles are defined (around line 297)
-   **Code:**
    ```typescript
    // In tailwind.config.mts plugin.addBase():
    strong: {
        fontWeight: plugin.theme('fontWeight.medium'),
    },
    ```

### 2. Fix `@reference` Directive

-   **File:** `/app/_theme/styles/theme.css`
-   **Line:** 2
-   **Issue:** Uses non-standard `@reference` directive which is not valid CSS
-   **Fix:** Change to `@import` if the file needs to be imported, or remove if it's imported elsewhere
-   **Action:** Check if this is needed, likely remove it

### 3. Remove Duplicate `font-feature-settings` from theme.css

-   **File:** `/app/_theme/styles/theme.css`
-   **Lines:** 472-475
-   **Issue:** This is already defined in `tailwind.config.mts` lines 335-337
-   **Fix:** Remove the duplicate from theme.css, keep only in Tailwind config

## Testing

-   [ ] Run `npm run build` - should complete without CSS parsing errors
-   [ ] Verify strong elements still have font-weight: 500
-   [ ] Check no visual regressions in the app

## Success Criteria

-   ✅ All CSS validates correctly
-   ✅ No invalid syntax warnings in build output
-   ✅ Strong text still renders with medium weight
