# Style Cleanup Phase 5: Fix Missing Variables & Conflicts

**Priority:** Medium
**Estimated Time:** 20 minutes
**Risk:** Low

## Overview

Fix missing CSS variables and resolve conflicts between different systems.

## Tasks

### 1. Fix action-secondary-DEFAULT Missing Variable

-   **Issue:** Tailwind config defines `action.secondary.DEFAULT` but CSS variable doesn't exist
-   **Location:**
    -   Config: `/libraries/structure/source/theme/TailwindConfiguration.ts` lines 108-112
    -   Variables: `/libraries/structure/source/theme/styles/variables.css`
-   **Options:**
    -   **Option A:** Add `--action-secondary-default` to variables.css
    -   **Option B:** Remove DEFAULT from Tailwind config (if no default state exists)
-   **Recommended:** Option B - remove DEFAULT if secondary actions don't have a default state
-   **Fix:**
    ```typescript
    // In TailwindConfiguration.ts, change:
    secondary: {
        DEFAULT: 'var(--action-secondary-default)', // Remove this line
        hover: 'var(--action-secondary-hover)',
        pressed: 'var(--action-secondary-pressed)',
    },
    // To:
    secondary: {
        hover: 'var(--action-secondary-hover)',
        pressed: 'var(--action-secondary-pressed)',
    },
    ```

### 2. Standardize grey vs gray Spelling

-   **Issue:** Inconsistent use of "grey" (British) and "gray" (American)
-   **Decision:** Use American "gray" throughout (Tailwind standard)
-   **Files to update:**
    -   `/libraries/structure/source/theme/TailwindConfiguration.ts` line 126
    -   `/app/_theme/styles/theme.css` line 63
    -   Any other occurrences
-   **Changes:**
    -   `grey` → `gray` in all variable names
    -   `--global-grey` → `--global-gray`
    -   Update all references

### 3. Remove Unused --font-sans Variable

-   **Location:** `/libraries/structure/source/theme/styles/variables.css` line 7
-   **Issue:** Defined but never used in Tailwind config or components
-   **Fix:** Remove if truly unused, or integrate into Tailwind font family config
-   **Verification:** Search codebase for `--font-sans` usage

### 4. Remove Unused Focus Shadow CSS Variable

-   **Location:** `/app/_theme/styles/theme.css` line 321
-   **Issue:** `--focus-primary` duplicates Tailwind boxShadow focus definition
-   **Fix:** Remove CSS variable, use only Tailwind config version (line 236)

## Testing

-   [ ] Run `npm run build`
-   [ ] Check for any CSS variable reference errors
-   [ ] Verify action colors work (especially secondary)
-   [ ] Verify gray colors render correctly
-   [ ] No TypeScript errors

## Success Criteria

-   ✅ All CSS variables have corresponding definitions
-   ✅ Consistent spelling throughout (gray not grey)
-   ✅ No unused variables
-   ✅ No duplicate variable definitions
