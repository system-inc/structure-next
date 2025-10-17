# Update Structure Icons to Phosphor Way

**Priority:** Medium
**Status:** Not Started

## Goal

Update structure library icons to use the same import pattern as Phosphor Icons for consistency and better developer experience.

## Current State

Structure icons are currently imported from individual SVG files:

```typescript
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
```

## Desired State

Structure icons should be importable the same way as Phosphor Icons:

```typescript
import { ChevronDownIcon, CheckIcon } from '@structure/assets/Icons';
```

## Benefits

-   **Consistency**: Match the Phosphor Icons import pattern that's already established in the codebase
-   **Developer Experience**: Simpler imports, better autocomplete
-   **Discoverability**: All icons available from a single import source
-   **Tree Shaking**: Bundlers can still optimize and only include used icons
-   **Maintainability**: Easier to manage icon exports from a central location

## Implementation Notes

-   Create a barrel export file at `@structure/assets/icons/Icons.ts` (or `index.ts`)
-   Export all SVG icons with their proper names
-   Ensure icon names follow the `IconName + "Icon"` suffix convention
-   **Support Phosphor-style properties**: Icons should accept the same properties as Phosphor Icons:
    -   `size`: Number or string for icon dimensions (e.g., `size={24}` or `size="1.5em"`)
    -   `weight`: Icon weight/style (e.g., `"thin"`, `"light"`, `"regular"`, `"bold"`, `"fill"`)
    -   `color`: Icon color (inherits currentColor by default)
    -   `className`: For additional styling
    -   Standard SVG properties (mirrored, etc.)
-   **Handle SSR properly**: Ensure icons work correctly in server-side rendering contexts
    -   No client-side only code in icon components
    -   Proper hydration behavior
    -   Compatible with Next.js App Router
-   Maintain backward compatibility during migration or provide clear migration guide
-   Update documentation and examples to show the new import pattern

## Related Patterns

This aligns with how Phosphor Icons work in the codebase per CLAUDE.md:

```typescript
// ✅ Current Phosphor pattern (also desired for Structure icons)
import { SparkleIcon, UserPlusIcon } from '@phosphor-icons/react';

// ❌ Avoid renaming/aliasing
import { Sparkle as SparkleIcon } from '@phosphor-icons/react';
```
