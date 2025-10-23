# Migrate InputSelect and InputText to New Theme Variant System

## Context

InputSelect and InputText components currently have hardcoded variant and size systems that don't follow the project-wide theme architecture used by Button. These components should use the same pattern as Button to enable project-level customization and maintain consistency across the design system.

**Current Status:**

-   ✅ InputSelect uses Button component internally with FormInputSelect variant
-   ✅ InputText has basic variant system (default, search, menuSearch)
-   ❌ InputText variants are defined inline in the component file
-   ❌ No theme provider integration for project-level overrides
-   ❌ Doesn't follow ButtonTheme pattern (theme object + interface augmentation)

**Current Implementation:**

```typescript
// InputText.tsx - Current approach
export const InputTextVariants = {
    default: mergeClassNames(/* ...classNames */),
    search: mergeClassNames(/* ...classNames */),
    menuSearch: mergeClassNames(/* ...classNames */),
};

export const InputTextSizes = {
    default: 'text-sm',
    large: 'text-base h-10',
};
```

```typescript
// InputSelect.tsx - Current approach
export const InputSelectVariants = {
    default: '',
};

export const InputSelectSizes = {
    default: '',
    large: '',
};
```

## Goal

Migrate InputSelect and InputText to use a proper theme system that:

1. Follows the ButtonTheme pattern (separate theme file + interface augmentation)
2. Enables project-level customization via ProjectSettings.theme.components
3. Maintains consistency with the rest of the design system
4. Preserves all existing functionality and styling

## Implementation Steps

### Step 1: Create InputTextTheme.ts

Location: `/libraries/structure/source/components/forms/InputTextTheme.ts`

Create a theme file following the ButtonTheme pattern:

```typescript
/**
 * Structure InputText Theme
 *
 * Default input text theme for the structure library. Provides portable, framework-agnostic
 * input variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.InputText
 */

// Dependencies - Utilities
import { mergeClassNames } from './../../utilities/style/ClassName';

// Common input styles
export const commonInputTextClassNames = mergeClassNames(
    // Content
    'content--0',
    // Placeholder
    'placeholder:opacity-70',
    // Placeholder (disabled)
    'disabled:placeholder:opacity-20',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-20',
);

// Background styles
export const backgroundStyleClassNames = 'background--2 inset-shadow-xs dark:background--3';

// Border styles
export const borderStyleClassNames = 'rounded-lg border border--1';

// Focus styles: background and text color changes on hover
export const focusStyleClassNames =
    'focus:border-blue-400 focus-visible:ring-0 focus-visible:outline-none dark:focus:border-blue-500';

// Autofill styles
export const autofillStyleClassNames = 'autofill:bg-transparent dark:autofill:bg-transparent';

// InputText Variants Interface - Source of truth for all input text variants
// Structure defines its base variants here, and projects can augment to add custom variants
export interface InputTextVariants {
    Default: 'Default';
    Search: 'Search';
    MenuSearch: 'MenuSearch';
}

// Type - InputText Variant (derived from InputTextVariants interface)
export type InputTextVariant = keyof InputTextVariants;

// InputText Sizes Interface - Source of truth for all input text sizes
export interface InputTextSizes {
    Default: 'Default';
    Large: 'Large';
}

// Type - InputText Size (derived from InputTextSizes interface)
export type InputTextSize = keyof InputTextSizes;

// InputText Theme Configuration Interface
export interface InputTextThemeConfiguration {
    variants: {
        [K in keyof InputTextVariants]: string;
    };
    sizes: {
        [K in keyof InputTextSizes]: string;
    };
}

// Structure InputText Default Theme
export const inputTextTheme: InputTextThemeConfiguration = {
    variants: {
        // Default variant: standard dark background and text color
        Default: mergeClassNames(
            commonInputTextClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
            autofillStyleClassNames,
            // Layout and sizing
            'h-9 px-3',
        ),
        // Search variant: with left icon spacing
        Search: mergeClassNames(
            commonInputTextClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
            autofillStyleClassNames,
            // Layout and sizing
            'h-9 pr-4 pl-9',
            // Background
            'bg-transparent',
        ),
        // Menu search variant: for use in popover menus
        MenuSearch: mergeClassNames(
            commonInputTextClassNames,
            autofillStyleClassNames,
            // Focus
            'focus-visible:ring-0 focus-visible:outline-none',
            // Layout and sizing
            'w-full py-3 pr-4 pl-9',
            // Border
            'border-b border--0',
            // Background
            'bg-transparent',
        ),
    },
    sizes: {
        Default: 'text-sm',
        Large: 'text-base h-10',
    },
};

// Type helper for deep partial theme overrides
export type DeepPartialComponentTheme<T> = {
    [P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P];
};
```

### Step 2: Create InputSelectTheme.ts

Location: `/libraries/structure/source/components/forms/InputSelectTheme.ts`

Create a theme file for InputSelect (which primarily delegates to Button):

```typescript
/**
 * Structure InputSelect Theme
 *
 * Default input select theme for the structure library. Provides portable, framework-agnostic
 * select variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.InputSelect
 *
 * Note: InputSelect uses Button internally, so most visual customization should happen
 * via ButtonTheme's FormInputSelect variant. This theme primarily handles container-level styling.
 */

// InputSelect Variants Interface - Source of truth for all input select variants
export interface InputSelectVariants {
    Default: 'Default';
}

// Type - InputSelect Variant (derived from InputSelectVariants interface)
export type InputSelectVariant = keyof InputSelectVariants;

// InputSelect Sizes Interface - Source of truth for all input select sizes
export interface InputSelectSizes {
    Default: 'Default';
    Large: 'Large';
}

// Type - InputSelect Size (derived from InputSelectSizes interface)
export type InputSelectSize = keyof InputSelectSizes;

// InputSelect Theme Configuration Interface
export interface InputSelectThemeConfiguration {
    variants: {
        [K in keyof InputSelectVariants]: string;
    };
    sizes: {
        [K in keyof InputSelectSizes]: string;
    };
}

// Structure InputSelect Default Theme
export const inputSelectTheme: InputSelectThemeConfiguration = {
    variants: {
        // Default variant: inherits styling from ButtonTheme FormInputSelect variant
        Default: '',
    },
    sizes: {
        Default: '',
        Large: '',
    },
};

// Type helper for deep partial theme overrides
export type DeepPartialComponentTheme<T> = {
    [P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P];
};
```

### Step 3: Update InputText.tsx

Remove inline variant/size definitions and use the theme system:

```typescript
// Remove these exports from InputText.tsx:
// export const InputTextVariants = { ... }
// export const InputTextSizes = { ... }

// Add imports at top:
import {
    inputTextTheme,
    InputTextThemeConfiguration,
    InputTextVariant,
    InputTextSize,
} from '@structure/source/components/forms/InputTextTheme';

// Add theme integration (similar to Button.tsx):
const theme = projectSettings.theme?.components?.InputText ?? inputTextTheme;

// Update properties interface:
export interface InputTextProperties extends Omit<InputProperties, 'onChange' | 'onBlur'> {
    // ... existing properties
    variant?: InputTextVariant;
    size?: InputTextSize;
}

// Update usage in component:
const variant = properties.variant || 'Default';
const size = properties.size || 'Default';

// Update className construction:
className={mergeClassNames(theme.variants[variant], theme.sizes[size], properties.className)}
```

### Step 4: Update InputSelect.tsx

Remove inline variant/size definitions and use the theme system:

```typescript
// Remove these exports from InputSelect.tsx:
// export const InputSelectVariants = { ... }
// export const InputSelectSizes = { ... }

// Add imports at top:
import {
    inputSelectTheme,
    InputSelectThemeConfiguration,
    InputSelectVariant,
    InputSelectSize,
} from '@structure/source/components/forms/InputSelectTheme';

// Add theme integration:
const theme = projectSettings.theme?.components?.InputSelect ?? inputSelectTheme;

// Update properties interface:
export interface InputSelectProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    // ... existing properties
    variant?: InputSelectVariant;
    size?: InputSelectSize;
}

// Update usage in component:
const variant = properties.variant || 'Default';
const size = properties.size || 'Default';

// Note: Container-level styling would use theme if needed
// Button already uses FormInputSelect variant from ButtonTheme
```

### Step 5: Update ProjectSettings Interface

Add InputText and InputSelect theme configuration to ProjectSettings:

```typescript
// In ProjectSettings.ts
export interface ProjectSettingsTheme {
    components?: {
        Button?: DeepPartialComponentTheme<ButtonThemeConfiguration>;
        InputText?: DeepPartialComponentTheme<InputTextThemeConfiguration>;
        InputSelect?: DeepPartialComponentTheme<InputSelectThemeConfiguration>;
    };
}
```

### Step 6: Update All Usage Sites

Find and update all imports and usage:

```bash
# Find all usages of InputTextVariants
grep -r "InputTextVariants" libraries/structure/source/
grep -r "InputTextVariants" app/

# Find all usages of InputSelectVariants
grep -r "InputSelectVariants" libraries/structure/source/
grep -r "InputSelectVariants" app/
```

Update variant names to use PascalCase:

```typescript
// Before
<InputText variant="default" />
<InputText variant="search" />
<InputText variant="menuSearch" />

// After
<InputText variant="Default" />
<InputText variant="Search" />
<InputText variant="MenuSearch" />
```

### Step 7: Enable Project-Level Customization

Projects can now extend variants:

```typescript
// In app/_theme/components/InputTextTheme.ts
import type {
    InputTextThemeConfiguration,
    DeepPartialComponentTheme,
} from '@structure/source/components/forms/InputTextTheme';

// Extend the InputTextVariants interface
declare module '@structure/source/components/forms/InputTextTheme' {
    interface InputTextVariants {
        ConnectedSearch: 'ConnectedSearch'; // Custom project variant
    }
}

// Export project-specific theme overrides
export const inputTextTheme: DeepPartialComponentTheme<InputTextThemeConfiguration> = {
    variants: {
        // Override default variant
        Default: 'custom classes for Connected project',
        // Add new custom variant
        ConnectedSearch: 'custom search styling',
    },
};
```

## Benefits After Completion

-   ✅ Consistent theme architecture across all form components
-   ✅ Project-level customization without modifying structure code
-   ✅ Type-safe variant and size selection
-   ✅ Easier to maintain and extend
-   ✅ Follows established ButtonTheme pattern
-   ✅ Enables design system evolution at project level
-   ✅ Better developer experience with autocomplete

## Related Files

-   Structure Components:

    -   `/libraries/structure/source/components/forms/InputText.tsx` - Text input component
    -   `/libraries/structure/source/components/forms/InputSelect.tsx` - Select input component
    -   `/libraries/structure/source/components/buttons/ButtonTheme.ts` - Reference pattern

-   New Theme Files (to create):

    -   `/libraries/structure/source/components/forms/InputTextTheme.ts`
    -   `/libraries/structure/source/components/forms/InputSelectTheme.ts`

-   Project Integration:
    -   `/libraries/structure/source/ProjectSettings.ts` - Add theme configuration
    -   `/app/_theme/components/InputTextTheme.ts` - Example project override (optional)

## Priority

Low-Medium - The components currently work fine with inline variants. This is a code quality and architecture improvement that:

-   Improves consistency with the rest of the design system
-   Enables project-level customization
-   Makes the codebase easier to maintain long-term
-   Not blocking any functionality

## Migration Checklist

### Phase 1: Create Theme Files

-   [ ] Create `InputTextTheme.ts` with complete theme configuration
-   [ ] Create `InputSelectTheme.ts` with complete theme configuration
-   [ ] Export all necessary types and constants

### Phase 2: Update Components

-   [ ] Update `InputText.tsx` to use InputTextTheme
-   [ ] Update `InputSelect.tsx` to use InputSelectTheme
-   [ ] Remove old inline variant/size definitions
-   [ ] Test components with default theme

### Phase 3: Update ProjectSettings

-   [ ] Add InputText theme to ProjectSettings interface
-   [ ] Add InputSelect theme to ProjectSettings interface
-   [ ] Update type imports

### Phase 4: Update Usage Sites

-   [ ] Find all InputText usage with variants
-   [ ] Update variant names to PascalCase (default → Default, search → Search)
-   [ ] Find all InputSelect usage with variants
-   [ ] Update variant names to PascalCase
-   [ ] Test all updated components

### Phase 5: Documentation

-   [ ] Document theme customization pattern
-   [ ] Create examples of project-level overrides
-   [ ] Update component documentation

## Testing Checklist

-   [ ] InputText Default variant renders correctly
-   [ ] InputText Search variant renders correctly
-   [ ] InputText MenuSearch variant renders correctly
-   [ ] InputText size variants work (Default, Large)
-   [ ] InputSelect Default variant renders correctly
-   [ ] InputSelect large size works correctly
-   [ ] Project-level theme overrides work
-   [ ] TypeScript interface augmentation works
-   [ ] All existing forms still function properly
-   [ ] No visual regressions

## Notes

-   InputSelect primarily delegates to Button component, so most visual customization happens via ButtonTheme's FormInputSelect variant
-   The theme system should be backwards compatible during migration - old code continues working
-   Consider adding more size variants if needed (ExtraSmall, ExtraLarge)
-   This pattern can be extended to other form components (InputTextArea, InputCheckbox, etc.)
-   The PascalCase naming for variants matches ButtonTheme convention (A, Outline, Ghost, etc.)

## Future Enhancements

After completing this migration, consider:

1. **Migrate Other Form Components**: Apply the same pattern to InputTextArea, InputCheckbox, InputRadio, etc.
2. **Shared Form Component Utilities**: Create shared classNames exports similar to buttonLayoutClassNames, buttonCommonClassNames
3. **Form Theme Provider**: Consider a unified FormTheme that manages all form component themes
4. **Design Token Integration**: Ensure all variants use design tokens (--0-10 system) consistently
5. **Storybook Integration**: Create Storybook stories demonstrating all variants and customization patterns
