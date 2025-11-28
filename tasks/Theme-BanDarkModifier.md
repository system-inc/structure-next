# Ban `dark:` Modifier for Colors

## Summary

Replace all color-related `dark:` Tailwind modifiers with `light-dark()` CSS tokens. The `dark:` modifier does not properly support nested scheme islands, while `light-dark()` respects `color-scheme` inheritance natively.

## Problem

Tailwind's `dark:` modifier is class-based and cannot express "closest scheme ancestor wins" logic. This breaks when:

-   Page is `scheme-light` with a `scheme-dark` island inside
-   Page is `scheme-dark` with a `scheme-light` island inside
-   Any nested combination of scheme islands

We implemented a `:has()` workaround in `@custom-variant dark`, but it's complex, has edge cases, and adds selector overhead.

## Solution

1. **Ban** `dark:`
2. **Use `light-dark()` tokens** - Define semantic color variables that automatically respect scheme islands

## Migration

### Before (anti-pattern)

```tsx
className="bg-red-650 dark:bg-red-900 border-red-750 dark:border-red-800"
```

### After (correct)

```css
/* variables.css */
--color-destructive-bg: light-dark(var(--color-red-650), var(--color-red-900));
--color-destructive-border: light-dark(var(--color-red-750), var(--color-red-800));
```

```tsx
className="bg-destructive border-destructive-border"
```

## Tasks

-   [ ] Add ESLint rule to error on `dark:`
-   [ ] Create semantic tokens for all color pairs currently using `dark:`
-   [ ] Update CLAUDE.md documentation
-   [ ] Remove `:has()` workaround from `@custom-variant dark`

## Benefits

1. **Islands work correctly** - `light-dark()` respects `color-scheme` inheritance
2. **Single source of truth** - Colors defined once, not duplicated with `dark:`
3. **Simpler selectors** - No complex `:has()` workarounds needed
4. **Better performance** - No `:has()` selector overhead

## References

-   `global.css` - Current `:has()` workaround in `@custom-variant dark`
-   `variables.css` - Where semantic tokens should be defined
