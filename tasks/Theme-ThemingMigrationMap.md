# Theming System Migration Map

This document maps old color classes to the new theming system, showing the actual color values in both light and dark modes to verify semantic correctness.

## Color Reference Key

Older System

white: '#FFFFFF',
light: '#FFFFFF',
'light-1': '#F6F6F6',
'light-2': '#EEEEEE',
'light-3': '#E5E5E5',
'light-4': '#DDDDDD',
'light-5': '#D4D4D4',
'light-6': '#CCCCCC',

black: '#000000',
'dark+6': '#000000',
'dark+5': '#090909',
'dark+4': '#0B0B0B',
'dark+3': '#0D0D0D',
'dark+2': '#0F0F0F',
'dark+1': '#101010',
dark: '#111111',
'dark-1': '#191919',
'dark-2': '#222222',
'dark-3': '#2A2A2A',
'dark-4': '#333333',
'dark-5': '#3B3B3B',
'dark-6': '#444444',

'neutral-6': '#4C4C4C',
'neutral-5': '#565656',
'neutral-4': '#606060',
'neutral-3': '#6A6A6A',
'neutral-2': '#747474',
'neutral-1': '#7E7E7E',
neutral: '#888888',
'neutral+1': '#929292',
'neutral+2': '#9C9C9C',
'neutral+3': '#A6A6A6',
'neutral+4': '#B0B0B0',
'neutral+5': '#BABAAB',
'neutral+6': '#C4C4C4',

**Old System (Phi):**

-   Light mode colors defined at `:root` (lines 1-307)
-   Dark mode colors defined at `.dark :not(:where(.light *, .light))` (lines 367-458)

**New System (Structure):**

-   Uses `light-dark()` function in `variables.css`
-   Automatically switches between light/dark values

---

## Foreground/Text Classes

| Old Class                   | Old Light Mode                                      | Old Dark Mode                                      | New Class       | New Light Mode                | New Dark Mode                 | Status   |
| --------------------------- | --------------------------------------------------- | -------------------------------------------------- | --------------- | ----------------------------- | ----------------------------- | -------- |
| `text-foreground-primary`   | `#181818` (--content-primary → --global-black-700)  | `#e7e7e7` (--content-primary → --global-white-700) | `foreground--a` | `#181818` (--color-black-700) | `#e7e7e7` (--color-white-700) | ✅ EXACT |
| `text-foreground-secondary` | `#686868` (--content-secondary → --global-grey-800) | `#a3a3a3` (--content-secondary → --global-grey-50) | `foreground--b` | `#686868` (--color-gray-800)  | `#a3a3a3` (--color-gray-50)   | ✅ EXACT |
| `text-foreground-tertiary`  | `#787878` (--content-tetriary → --global-grey-600)  | `#878787` (--content-tetriary → --global-grey-400) | `foreground--c` | `#787878` (--color-gray-600)  | `#878787` (--color-gray-400)  | ✅ EXACT |
| `text-foreground`           | `#181818` (--content-primary)                       | `#e7e7e7` (--content-primary)                      | `foreground--a` | `#181818` (--color-black-700) | `#e7e7e7` (--color-white-700) | ✅ EXACT |
| `text-content`              | `#181818` (--content-primary)                       | `#e7e7e7` (--content-primary)                      | `foreground--a` | `#181818` (--color-black-700) | `#e7e7e7` (--color-white-700) | ✅ EXACT |

---

## Background Classes

| Old Class                        | Old Light Mode                                          | Old Dark Mode                                           | New Class             | New Light Mode                 | New Dark Mode                 | Status          |
| -------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | --------------------- | ------------------------------ | ----------------------------- | --------------- |
| `bg-opsis-background-primary`    | `#ffffff` (--background-primary → --global-white-1000)  | `#181818` (--background-primary → --global-black-700)   | `background--a`       | `#ffffff` (--color-white-1000) | `#181818` (--color-black-700) | ✅ EXACT        |
| `bg-opsis-background-secondary`  | `#f7f7f7` (--background-secondary → --global-white-900) | `#282828` (--background-secondary → --global-black-500) | `background--b`       | `#f7f7f7` (--color-white-900)  | `#282828` (--color-black-500) | ✅ EXACT        |
| `bg-opsis-background-tertiary`   | `#ffffff` (--background-tetriary → --global-white-1000) | `#202020` (--background-tetriary → --global-black-600)  | `background--c`       | `#ffffff` (--color-white-1000) | `#202020` (--color-black-600) | ✅ EXACT        |
| `bg-background-tertiary`         | Various (shadcn)                                        | Various (shadcn)                                        | `background--c`       | `#ffffff` (--color-white-1000) | `#202020` (--color-black-600) | Map to tertiary |
| `hover:bg-background-quaternary` | Various (shadcn)                                        | Various (shadcn)                                        | `hover:background--d` | `#efefef` (--color-white-800)  | `#303030` (--color-black-400) | Approximate     |

---

## Border Classes

### Semantic Borders (Exact Matches)

| Old Semantic Class | Old Light Mode | Old Dark Mode | New Class          | New Light Mode                | New Dark Mode                 | Status   |
| ------------------ | -------------- | ------------- | ------------------ | ----------------------------- | ----------------------------- | -------- |
| `border-primary`   | `#e7e7e7`      | `#383838`     | `border--a`        | `#e7e7e7` (--color-white-700) | `#383838` (--color-black-300) | ✅ EXACT |
| `border-secondary` | `#f3f3f3`      | `#282828`     | `border--b`        | `#f3f3f3` (--color-white-850) | `#282828` (--color-black-500) | ✅ EXACT |
| `border-tetriary`  | `#d7d7d7`      | `#484848`     | `border--c`        | `#d7d7d7` (--color-white-500) | `#484848` (--color-black-100) | ✅ EXACT |
| `border-contrast`  | `#afafaf`      | `#afafaf`     | `border--contrast` | `#afafaf` (--color-white-0)   | `#afafaf` (--color-white-0)   | ✅ EXACT |

### Old Border Pairs → New Semantic Mapping

| Old Class Pattern                   | Old Light | Old Dark  | New Class   | New Light | New Dark  | Match Quality                |
| ----------------------------------- | --------- | --------- | ----------- | --------- | --------- | ---------------------------- |
| `border-light-3 dark:border-dark-3` | `#e5e5e5` | `#2a2a2a` | `border--d` | `#dfdfdf` | `#2c2c2c` | Close (~2-8 units off)       |
| `border-light-4 dark:border-dark-4` | `#dddddd` | `#333333` | `border--d` | `#dfdfdf` | `#2c2c2c` | Approximate (~2-7 units off) |
| `border-light-6 dark:border-dark-3` | `#cccccc` | `#2a2a2a` | `border--c` | `#d7d7d7` | `#484848` | Use prominent border instead |

---

## Semantic State Colors

| Old Class                                    | Old Light Mode                                        | Old Dark Mode                                         | New Class                             | New Light Mode                | New Dark Mode                 | Notes                  |
| -------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------- | ----------------------------- | ----------------------------- | ---------------------- |
| `text-opsis-content-positive`                | `#16a34a` (--content-positive → --global-green-600)   | `#4ade80` (--content-positive → --global-green-400)   | `foreground--positive`                | `#16a34a` (--color-green-600) | `#22c55e` (--color-green-500) | Success/positive state |
| `text-opsis-content-negative`                | `#dc2626` (--content-negative → --global-red-600)     | `#f87171` (--content-negative → --global-red-400)     | `foreground--negative`                | `#dc2626` (--color-red-600)   | `#ef4444` (--color-red-500)   | Error/negative state   |
| `placeholder:text-opsis-content-placeholder` | `#808080` (--content-placeholder → --global-grey-500) | `#808080` (--content-placeholder → --global-grey-500) | `placeholder:foreground--placeholder` | `#808080` (--color-gray-500)  | `#808080` (--color-gray-500)  | Placeholder text       |

---

## Action/Interactive Classes

| Old Class                         | Old Light Mode                                            | Old Dark Mode                                             | New Class | New Light Mode | New Dark Mode | Notes                              |
| --------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------- | -------------- | ------------- | ---------------------------------- |
| `bg-opsis-action-primary`         | `#181818` (--action-primary-default → --global-black-700) | `#e7e7e7` (--action-primary-default → --global-white-700) | Custom    | N/A            | N/A           | Button-specific, handle separately |
| `text-opsis-action-general-light` | `#e7e7e7` (--action-general-light → --global-white-700)   | `#202020` (--action-general-light → --global-black-600)   | Custom    | N/A            | N/A           | Button-specific, handle separately |

---

## Special Cases / Needs Manual Review

| Old Class             | Issue                            | Recommendation                         |
| --------------------- | -------------------------------- | -------------------------------------- |
| `text-neutral`        | Uses old neutral scale (#888888) | Map to `foreground--c` or custom color |
| `text-neutral+2`      | Uses old neutral scale (#9c9c9c) | Map to `foreground--c` or custom color |
| `dark:text-neutral+3` | Uses old neutral scale (#a6a6a6) | Map to appropriate foreground variant  |
| `text-accent-primary` | Uses shadcn accent system        | Needs semantic mapping decision        |
| `primary`             | Vague class name                 | Context-dependent replacement          |
| `neutral`             | Old color system                 | Replace with semantic equivalent       |
| `md/block`            | Syntax error?                    | Investigate usage                      |

---

## Final Color Comparison Summary

After adjusting Structure's theme variables to match Phi's exact hex values:

**✅ All Core Semantic Tokens - EXACT MATCHES:**

-   `foreground--a` (#181818 → #e7e7e7) - Primary text
-   `foreground--b` (#686868 → #a3a3a3) - Secondary text
-   `foreground--c` (#787878 → #878787) - Tertiary text
-   `background--a` (#ffffff → #181818) - Primary background
-   `background--b` (#f7f7f7 → #282828) - Secondary background
-   `background--c` (#ffffff → #202020) - Tertiary background
-   `border--a` (#e7e7e7 → #383838) - Standard border
-   `border--b` (#f3f3f3 → #282828) - Subtle border
-   `border--c` (#d7d7d7 → #484848) - Prominent border

**🆕 New Addition:**

-   `border--d` (#dfdfdf → #2c2c2c) - Moderate border (for old light/dark pairs)

---

## Border Hierarchy (Lightest to Strongest)

1. **border--b** - Subtle (Light `#f3f3f3`, Dark `#282828`) - Barely visible, nested elements
2. **border--d** - Moderate (Light `#dfdfdf`, Dark `#2c2c2c`) - Medium visibility [NEW]
3. **border--a** - Standard (Light `#e7e7e7`, Dark `#383838`) - Clear, typical borders
4. **border--c** - Prominent (Light `#d7d7d7`, Dark `#484848`) - Strong, noticeable

---

## Migration Strategy

### ✅ Safe Replacements (Exact Matches - APPROVED)

These are **exact hex value matches** and can be done with IDE find & replace:

**Foregrounds:**

1. `text-foreground-primary` → `foreground--a` ✅ EXACT
2. `text-foreground-secondary` → `foreground--b` ✅ EXACT
3. `text-foreground-tertiary` → `foreground--c` ✅ EXACT
4. `text-foreground` → `foreground--a` ✅ EXACT
5. `text-content` → `foreground--a` ✅ EXACT

**Backgrounds:** 6. `bg-opsis-background-primary` → `background--a` ✅ EXACT 7. `bg-opsis-background-secondary` → `background--b` ✅ EXACT 8. `bg-opsis-background-tertiary` → `background--c` ✅ EXACT

**Semantic States:** 9. `placeholder:text-opsis-content-placeholder` → `placeholder:foreground--placeholder` ✅ EXACT

### Approximate Replacements (Close Matches)

These are close but not pixel-perfect - acceptable drift:

**Borders (old light/dark pairs):**

1. `border-light-3 dark:border-dark-3` → `border--d` (~2-8 hex units difference)
2. `border-light-4 dark:border-dark-4` → `border--d` (~2-7 hex units difference)
3. `border-light-6 dark:border-dark-3` → `border--c` (use prominent instead)

### Requires Context (Manual Review)

These need to be evaluated based on usage:

1. Action/button classes - may need component-specific handling
2. Neutral colors - decide on appropriate semantic mapping
3. Accent colors - map to semantic equivalents

---

## Next Steps

1. ✅ Review this mapping for accuracy
2. ⬜ Decide on acceptable color drift for "close match" migrations
3. ⬜ Identify components that need visual QA after migration
4. ⬜ Execute safe replacements first
5. ⬜ Handle special cases file-by-file with visual review
