# Pagination - Improve Disabled Button Styling

## Overview

Replace the opacity-based disabled state styling for pagination buttons with more explicit and clear visual indicators.

## Current State

The pagination buttons (first, previous, next, last) currently rely on opacity to indicate disabled state, which can be subtle and hard to distinguish at a glance.

## Desired State

Disabled pagination buttons should have:

-   More distinct visual appearance (e.g., different background color, border style, or text color)
-   Clear contrast between enabled and disabled states
-   Maintained accessibility standards (sufficient color contrast)
-   Consistent with overall design system

## Implementation Notes

-   Located in `/libraries/structure/source/components/navigation/pagination/Pagination.tsx`
-   Uses Button component with `variant="Primary"` and `size="Icon"`
-   Four navigation buttons affected:
    -   First page (ChevronLeftDoubleIcon) - lines 228-248
    -   Previous page (ChevronLeftIcon) - lines 250-270
    -   Next page (ChevronRightIcon) - lines 272-292
    -   Last page (ChevronRightDoubleIcon) - lines 294-314
-   May need to update Button component's disabled state styling or add custom classes to pagination buttons
-   Consider whether this should be a global Button component change or specific to pagination

## Success Criteria

-   [ ] Disabled pagination buttons are immediately distinguishable from enabled buttons
-   [ ] Styling does not rely solely on opacity
-   [ ] Maintains consistency with design system
-   [ ] Passes accessibility color contrast requirements
-   [ ] Works in both light and dark modes
