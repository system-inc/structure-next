# Style Cleanup Phase 4.5: Remove Shadcn Accent System

**Priority:** Medium
**Estimated Time:** 45 minutes
**Risk:** Low-Medium (affects button hover states)
**Dependencies:** Requires Phase 4 semantic tokens to be defined

## Overview

Remove the old shadcn/ui accent color system (`bg-accent`, `text-accent-foreground`) and replace with new semantic tokens. This is part of migrating away from the shadcn HSL color system to our 0-1000 scale foundation.

## Background

### What is bg-accent?

`bg-accent` is from the shadcn/ui design system, defined as HSL values:

```css
/* Light mode */
--accent: 240 4.8% 95.9%; /* Very light grayish-blue */
--accent-foreground: 240 5.9% 10%;

/* Dark mode */
--accent: 240 3.7% 15.9%; /* Very dark grayish-blue */
--accent-foreground: 0 0% 98%;
```

It's used for:

-   Subtle hover states on ghost-style buttons
-   Toggle component active/hover states
-   Low-emphasis interactive backgrounds

### The Problem

1. **Conflicts with new system** - Uses HSL instead of 0-1000 scales
2. **Not semantic** - "accent" doesn't clearly indicate purpose (is it brand color? interactive state?)
3. **Shadcn-specific** - Ties structure library to shadcn conventions
4. **Doesn't match architecture** - Should use unprefixed semantic tokens

## Current Usage

### Files Using bg-accent (9 occurrences total):

1. `/libraries/structure/source/components/buttons/ButtonTheme.ts` (lines 158, 201)

    - Ghost variant: `hover:bg-accent`
    - GhostDestructive variant: `hover:bg-accent`

2. `/libraries/structure/source/components/buttons/ButtonVariants.ts` (lines 92, 96)

    - Ghost: `hover:bg-accent border border-transparent hover:text-accent-foreground`
    - GhostDestructive: `hover:bg-accent hover:text-accent-foreground`

3. `/libraries/structure/source/components/buttons/Toggle.tsx` (lines 9, 13)

    - Base classes: `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`
    - Default variant: `hover:bg-accent hover:text-accent-foreground`

4. `/app/_components/controls/Toggle.tsx` (lines 9, 13)

    - Same as structure Toggle (project copy)

5. `/app/(main-layout)/pro/checkout/success/ProCheckoutSuccessPage.tsx` (line 81)
    - Custom usage: `border-accent-primary bg-accent-primary/5`
    - **Note:** This uses `accent-primary` not `accent` - likely opsis token

## Migration Strategy

### Step 1: Decide Replacement Token

**Must complete Phase 4 semantic token naming first!**

Potential replacements based on naming proposals:

-   `bg-interactive-hover` (if using Proposal 1)
-   `bg-state-hover` (if using Proposal 2)
-   `bg-button-hover` (if using component-specific tokens)
-   `bg-background-hover` (if using simple pattern)

**For this document, we'll use placeholder: `bg-[HOVER-TOKEN]`**

### Step 2: Update ButtonTheme.ts

**Location:** `/libraries/structure/source/components/buttons/ButtonTheme.ts`

**Line 156-159 (Ghost variant):**

```typescript
// Before:
Ghost:
    `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
    // Rounded and hover
    `rounded-medium hover:bg-accent border border-transparent hover:text-accent-foreground`,

// After:
Ghost:
    `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
    // Rounded and hover
    `rounded-medium hover:bg-[HOVER-TOKEN] border border-transparent hover:text-[HOVER-TEXT-TOKEN]`,
```

**Line 199-204 (GhostDestructive variant):**

```typescript
// Before:
GhostDestructive:
    `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
    // Rounded and hover
    `rounded-medium hover:bg-accent hover:text-accent-foreground ` +
    // Color, hover, and active states
    `text-neutral+6 hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,

// After:
GhostDestructive:
    `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
    // Rounded and hover
    `rounded-medium hover:bg-[HOVER-TOKEN] hover:text-[HOVER-TEXT-TOKEN] ` +
    // Color, hover, and active states
    `text-[TEXT-SECONDARY-TOKEN] hover:bg-red-500/10 hover:text-red-500 dark:text-[TEXT-SUBTLE-TOKEN] dark:hover:text-red-500 active:border-0`,
```

**Note:** GhostDestructive also uses old colors `text-neutral+6` and `dark:text-light-4` - migrate these too

### Step 3: Update ButtonVariants.ts (if still in use)

**Location:** `/libraries/structure/source/components/buttons/ButtonVariants.ts`

This file might be deprecated in favor of ButtonTheme.ts. Check if it's still used before updating.

If used, apply same changes as ButtonTheme.ts.

### Step 4: Update Toggle Components

**Location:** `/libraries/structure/source/components/buttons/Toggle.tsx`

**Lines 9 and 13:**

```typescript
// Before:
const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
                outline: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
            },
        },
    },
);

// After:
const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-[HOVER-TOKEN] hover:text-[HOVER-TEXT-TOKEN] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[ACTIVE-TOKEN] data-[state=on]:text-[ACTIVE-TEXT-TOKEN] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'border border-input bg-transparent shadow-sm hover:bg-[HOVER-TOKEN] hover:text-[HOVER-TEXT-TOKEN]',
                outline:
                    'border border-input bg-transparent shadow-sm hover:bg-[HOVER-TOKEN] hover:text-[HOVER-TEXT-TOKEN]',
            },
        },
    },
);
```

**Also replace:** `bg-muted`, `text-muted-foreground`, `border-input`, `ring-ring` - these are all shadcn tokens

### Step 5: Update Project Toggle (if exists)

**Location:** `/app/_components/controls/Toggle.tsx`

Apply same changes as structure Toggle, or ideally remove this file and use structure's Toggle component directly.

### Step 6: Review ProCheckoutSuccessPage.tsx

**Location:** `/app/(main-layout)/pro/checkout/success/ProCheckoutSuccessPage.tsx` line 81

```tsx
// Current:
<Card className="border-accent-primary bg-accent-primary/5 mb-8 p-8">

// This uses accent-primary not accent - likely already using opsis tokens
// Check if accent-primary is defined in opsis system
// If not, replace with appropriate opsis token
```

This might already be correct if `accent-primary` is an opsis token.

### Step 7: Remove Accent Variables from CSS

**Location:** `/app/_theme/styles/theme.css`

Find and remove:

```css
/* Remove from :root */
--accent: 240 4.8% 95.9%;
--accent-foreground: 240 5.9% 10%;

/* Remove from .dark */
--accent: 240 3.7% 15.9%;
--accent-foreground: 0 0% 98%;
```

**Only remove after all references are migrated!**

## Additional Shadcn Tokens to Consider Removing

While removing accent, consider also migrating these shadcn tokens found in Toggle:

-   `bg-muted` / `text-muted-foreground`
-   `border-input`
-   `ring-ring`

These should also be replaced with new semantic tokens in a coordinated effort.

## Testing Checklist

After migration:

-   [ ] Ghost buttons have correct hover state (subtle background)
-   [ ] GhostDestructive buttons have correct hover (should show red)
-   [ ] Toggle component works in both states (on/off)
-   [ ] Toggle hover states work correctly
-   [ ] Light mode looks correct
-   [ ] Dark mode looks correct
-   [ ] No console errors about missing CSS variables
-   [ ] Visual parity maintained with current design

## Success Criteria

-   ✅ Zero references to `bg-accent` or `text-accent-foreground` in structure library
-   ✅ All hover states use new semantic tokens
-   ✅ Accent variables removed from theme.css
-   ✅ No visual regressions
-   ✅ Toggle components work correctly
-   ✅ Documentation updated if needed

## Notes

-   **Do NOT start this phase until Phase 4 semantic tokens are finalized**
-   This is a good test case for the new semantic token system
-   If the new tokens don't work well here, it's a sign to revisit naming
-   Consider creating a visual regression test for button hover states
-   Document the final token mapping for future reference
