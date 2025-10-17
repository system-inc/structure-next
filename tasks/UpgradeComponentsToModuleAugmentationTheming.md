# Upgrade Components to Module Augmentation Theming System

## Context

We've successfully implemented a new theming system using TypeScript module augmentation for Button components. This allows:
- Structure to define base variants/sizes via interfaces
- Projects to extend via `declare module` augmentation
- ESLint to validate structure doesn't use project-specific variants
- Runtime warnings when variants don't exist in theme

**Current Status:**
- ✅ Button component fully upgraded
- ✅ ButtonVariants and ButtonSizes interfaces created
- ✅ ESLint rule validates Button/AnimatedButton only
- ❌ Other components (Alert, Input, etc.) still use old theming

## Goal

Upgrade all themed components to use the new module augmentation pattern, making the ESLint rule generic across all components.

## Components That Need Upgrading

Components with `variant` or `size` props that should use the new system:

1. **Alert / Notification Components**
   - Current: Likely uses string literals or old theme approach
   - Need: `AlertVariants` interface + module augmentation

2. **Input / Form Components**
   - Current: May have variant props without proper theming
   - Need: `InputVariants` interface + module augmentation

3. **Card Components**
   - Current: Check if uses variant props
   - Need: `CardVariants` interface if applicable

4. **Badge / Tag Components**
   - Current: Check if uses variant props
   - Need: `BadgeVariants` interface if applicable

5. **Menu Components**
   - Current: Check if uses variant props
   - Need: `MenuVariants` interface if applicable

## Implementation Steps

For each component:

1. **Create Component Theme File** (e.g., `AlertTheme.ts`)
   ```typescript
   export interface AlertVariants {
       Success: 'Success';
       Error: 'Error';
       Warning: 'Warning';
       Info: 'Info';
   }

   export type AlertVariant = keyof AlertVariants;

   export interface AlertSizes {
       Small: 'Small';
       Base: 'Base';
       Large: 'Large';
   }

   export type AlertSize = keyof AlertSizes;
   ```

2. **Update Component to Use New Types**
   - Import `AlertVariant` instead of string literals
   - Use `createVariantClassNames` with proper typing
   - Ensure runtime validation works via wrapper

3. **Update ESLint Rule**
   - Extend `NoStructureProjectImportsRule` to read multiple theme interfaces
   - Map component names to their theme interfaces
   - Validate each component against its specific variants

4. **Test Each Component**
   - Verify TypeScript autocomplete works
   - Verify ESLint catches project variants in structure
   - Verify runtime warnings appear when theme missing

## ESLint Rule Enhancement

The rule should be refactored to:

```javascript
// Map of component names to their theme file paths
const componentThemeMap = {
    Button: 'libraries/structure/source/components/buttons/ButtonTheme.ts',
    AnimatedButton: 'libraries/structure/source/components/buttons/ButtonTheme.ts',
    Alert: 'libraries/structure/source/components/notifications/AlertTheme.ts',
    Input: 'libraries/structure/source/components/forms/InputTheme.ts',
    // ... etc
};

// Dynamically read all theme interfaces and validate
```

## Benefits After Completion

- ✅ Consistent theming pattern across all components
- ✅ Projects can extend any component's variants
- ✅ ESLint protection for all themed components
- ✅ Runtime validation for all themed components
- ✅ Single source of truth for all component variants

## Related Files

- `/libraries/structure/source/components/buttons/ButtonTheme.ts` - Reference implementation
- `/libraries/structure/code-quality/eslint/rules/NoStructureProjectImportsRule.mjs` - Needs enhancement
- `/libraries/structure/source/utilities/style/ClassName.ts` - Runtime validation wrapper

## Priority

Medium - This is a refactor that improves consistency and DX, but existing components still work. Should be done before adding many new project-specific variants to other components.
