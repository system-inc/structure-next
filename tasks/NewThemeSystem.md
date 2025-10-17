# Technical Debt

## Component Modernization

### InputText Theme System

**Priority:** High
**Status:** Not Started

Update InputText to use the modern theme and variant system implemented in ButtonTheme. Currently InputText has hardcoded styling and icon positioning that should be themeable and support project-level overrides.

**Current Issues:**

-   Hardcoded icon positioning (line 196): Icon is always `left-0` with `pl-3`, should be themeable to support right-positioned icons
-   Hardcoded icon size (line 197): `h-4 w-4` is fixed, should come from theme iconSizes like Button does
-   Variant/size objects exported directly (lines 52-84): Should be in separate InputTextTheme.ts file following ButtonTheme pattern
-   No theme provider integration: Unlike Button which uses `useComponentTheme()` and `mergeComponentTheme()`, InputText doesn't support project-level theme overrides
-   No discriminated union for icon positioning: Should have variants like `{ iconLeft: X }` OR `{ iconRight: X }` OR no icon, similar to Button's icon pattern

**What Modern Theme System Would Provide:**

-   `InputTextTheme.ts` with variants, sizes, configuration (including iconSizes, iconPosition classes)
-   Support for both left and right icon positioning via discriminated union
-   Project-level theme overrides via ComponentThemeProvider
-   Consistent architecture with Button
-   Icon sizing that scales with input size variants

**Related Files:**

-   `/libraries/structure/source/components/forms/InputText.tsx`
-   `/libraries/structure/source/components/buttons/ButtonTheme.ts` (reference implementation)
-   `/libraries/structure/source/components/buttons/Button.tsx` (reference for discriminated union pattern)

### ImageUploader Theme System

**Priority:** High
**Status:** Not Started

Update ImageUploader to use the modern theme and variant system. Currently ImageUploader has hardcoded styling for layout, spacing, progress bars, and states that should be themeable and support project-level overrides.

**Current Issues:**

-   Hardcoded layout and spacing (lines 87-92): File selection display uses hardcoded `mt-4`, `mb-2`, `text-sm`
-   Hardcoded button arrangement (lines 106-140): Button container uses hardcoded `space-x-2`, no theme control over layout
-   Hardcoded progress bar styling (lines 143-149): Progress bar colors `bg-neutral-200`, `bg-neutral-700`, `bg-blue-500` are fixed
-   Hardcoded button variants (lines 108, 134): Uses hardcoded `Primary` and `Secondary` variants instead of theme defaults
-   No theme provider integration: Doesn't use `useComponentTheme()` and `mergeComponentTheme()`
-   No centralized styling: All styles are inline in the component instead of separate theme file

**What Modern Theme System Would Provide:**

-   `ImageUploaderTheme.ts` with variants, configuration for layout, spacing, progress bar styling
-   Project-level theme overrides via ComponentThemeProvider
-   Themeable progress bar colors that adapt to project design system
-   Configurable default button variants and sizes
-   Consistent architecture with Button and other themed components
-   Separation of styling concerns from component logic

**Related Files:**

-   `/libraries/structure/source/components/images/uploader/ImageUploader.tsx`
-   `/libraries/structure/source/components/buttons/ButtonTheme.ts` (reference implementation)

### TipIcon Theme System

**Priority:** Medium
**Status:** Not Started

Update TipIcon to use the modern theme and variant system implemented in ButtonTheme. Currently TipIcon uses hardcoded variant strings, but it should follow the same architecture as Button:

-   Unstyled by default (no variant = no styling)
-   Variants only apply when explicitly specified
-   Use shared style constants for reusability
-   Support default variants per component theme configuration

**Current Issue:**

-   TipIcon with `variant="unstyled"` requires manual className with all styles
-   Inconsistent with Button's theme architecture
-   Missing `cursor-pointer` must be added manually to unstyled variants

**Related Files:**

-   `/libraries/structure/source/components/popovers/TipIcon.tsx`
-   `/libraries/structure/source/components/buttons/ButtonTheme.ts` (reference implementation)

Once Button is working, extend the pattern:

1. **Input** → `InputTheme.ts` in structure + project
2. **Card** → `CardTheme.ts` in structure + project
3. **Badge** → `BadgeTheme.ts` in structure + project
4. **Table** → `TableTheme.ts` in structure + project

Each follows the identical pattern:

-   Structure provides defaults
-   Project overrides/extends
-   ProjectSettings.theme.components.{Component}
-   Hard override for variants/sizes
-   Merge for configuration
