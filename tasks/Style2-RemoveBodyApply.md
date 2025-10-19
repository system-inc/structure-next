# Style Cleanup Phase 2: Remove @apply from Body Element

**Priority:** High
**Estimated Time:** 20 minutes
**Risk:** Low-Medium (requires layout component changes)

## Overview

Remove the `@apply` directive from the `body` element in CSS and apply classes directly in the layout component instead. This follows Tailwind best practices and prevents specificity issues.

## Tasks

### 1. Identify Current Body Styles

-   **File:** `/app/_theme/styles/theme.css`
-   **Lines:** 463-476
-   **Current Code:**
    ```css
    body {
        @apply bg-background text-foreground;
        font-feature-settings: '"rlig" 1, "calt" 1';
    }
    ```

### 2. Remove Body Styles from CSS

-   **Action:** Delete the entire `body` block from theme.css (lines 463-476)
-   **Note:** `font-feature-settings` is already in tailwind.config.mts, so no need to preserve it

### 3. Apply Classes in Layout Component

-   **File:** Find the root layout file (likely `/app/layout.tsx`)
-   **Change:** Add `bg-background text-foreground` classes directly to the `<body>` element
-   **Example:**
    ```tsx
    <body className="bg-background text-foreground">{children}</body>
    ```

## Testing

-   [ ] Verify body has correct background color in light mode
-   [ ] Verify body has correct background color in dark mode
-   [ ] Verify text color is correct
-   [ ] Check that font ligatures still work
-   [ ] No visual regressions

## Success Criteria

-   ✅ No `@apply` used on global elements
-   ✅ Body styling works identically to before
-   ✅ Classes applied directly in React component
