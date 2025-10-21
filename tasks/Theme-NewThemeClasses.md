# Style Migration Plan 😎

## Prioritized Task List

### Component Migrations

-   [x] Update HomePage.tsx with new styles
-   [ ] Update Navigation.tsx
-   [ ] Update Footer.tsx
-   [ ] Update Button components
-   [ ] Update Form components
-   [ ] Update Table components
-   [ ] Update Dialog components
-   [ ] Update any other components

### Feature Implementations

-   [ ] Create internal admin theme variables
-   [ ] Add proper link styling for all link types (primary, blue, secondary, muted)
-   [ ] Create test page to showcase all theme variables

## Current State

Currently, the project uses three styling approaches:

1. **Old Approach**: Direct color classes with dark mode variants

    - Example: `bg-light dark:bg-dark`, `text-light-2 dark:text-dark-2`
    - Problem: Requires dual-definitions for light/dark modes

2. **CSS Variables**: Defined in theme.css

    - Color scales: `--black-*`, `--gray-*`, `--white-*`, `--blue-*`
    - Semantic variables: `--content-primary`, `--background-primary`, etc.

3. **Tailwind Configuration**: Extended with semantic colors
    - Maps to CSS variables: `bg-primary` → `var(--background-primary)`
    - Automatically handles dark mode without prefixes

## Migration Reference

### Common Component Classes

| Old Style                           | New Style             | Notes                               |
| ----------------------------------- | --------------------- | ----------------------------------- |
| `bg-light dark:bg-dark`             | `bg-primary`          | Primary background                  |
| `bg-light-1 dark:bg-dark-1`         | `bg-secondary`        | Secondary background                |
| `text-black dark:text-white`        | `text-primary`        | Primary text                        |
| `text-neutral dark:text-neutral-1`  | `text-secondary`      | Secondary text                      |
| `border-light-4 dark:border-dark-4` | `border-primary`      | Primary border                      |
| `text-blue underline`               | `link-blue underline` | Blue links with hover/active states |
