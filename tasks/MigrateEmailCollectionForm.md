# Migrate EmailCollectionForm to Structure and Create Opsis Action Primary Button Variant

## Context

During the Button consolidation to the new Structure Button component, we discovered that `EmailCollectionForm.tsx` uses a custom button styling with `opsis-action-primary` colors that doesn't match any existing Button variant.

**Current Status:**

-   ✅ EmailCollectionForm uses Structure Button component
-   ❌ Button styling is hardcoded via className (not using a variant)
-   ❌ EmailCollectionForm is in project code, should be in Structure
-   ❌ No "OpsisActionPrimary" or similar variant exists in ButtonTheme

**Current Implementation:**

```tsx
<Button
    className="relative inline-flex aspect-square h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-opsis-action-primary text-sm font-medium whitespace-nowrap text-opsis-action-general-light transition-colors hover:bg-opsis-action-primary-hover focus:transition focus-visible:ring-1 focus-visible:ring-blue focus-visible:ring-offset-1 focus-visible:outline-none active:bg-opsis-action-primary-pressed disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-opsis-action-general-disabled disabled:text-opsis-content-disabled data-[state=open]:bg-opsis-action-primary-pressed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    type="submit"
    disabled={contactListEntryCreateRequest.isLoading}
>
```

## Goal

1. Create a proper Button variant for the opsis-action-primary styling
2. Migrate EmailCollectionForm component to Structure library
3. Use the new variant instead of hardcoded classes

## Implementation Steps

### Step 1: Add Opsis Action Primary Variant to Project ButtonTheme

Location: `/app/_theme/components/ButtonTheme.ts`

Add a new variant to the project's button theme:

```typescript
export const buttonTheme: DeepPartialComponentTheme<ButtonThemeConfiguration> = {
    variants: {
        // ... existing PrimaryBlue variant

        // Opsis Action Primary - Primary action button with opsis brand colors
        OpsisActionPrimary:
            `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
            // Base styling
            `rounded-full transition-colors font-medium [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ` +
            // Colors
            `bg-opsis-action-primary text-opsis-action-general-light ` +
            // Hover
            `hover:bg-opsis-action-primary-hover ` +
            // Active (includes when used as open popover trigger)
            `active:bg-opsis-action-primary-pressed data-[state=open]:bg-opsis-action-primary-pressed ` +
            // Focus
            `focus-visible:ring-blue focus:transition focus-visible:ring-1 focus-visible:ring-offset-1 ` +
            // Disabled
            `disabled:bg-opsis-action-general-disabled disabled:text-opsis-content-disabled`,
    },
};
```

Also add the TypeScript module augmentation:

```typescript
declare module '../../../libraries/structure/source/components/buttons/ButtonTheme' {
    interface ButtonVariants {
        PrimaryBlue: 'PrimaryBlue';
        OpsisActionPrimary: 'OpsisActionPrimary'; // Add this
    }
}
```

### Step 2: Update EmailCollectionForm to Use New Variant

Replace the hardcoded className with the variant:

```tsx
<Button
    className="aspect-square h-10 w-10 shrink-0 overflow-hidden"
    type="submit"
    variant="OpsisActionPrimary"
    disabled={contactListEntryCreateRequest.isLoading}
>
```

### Step 3: Move EmailCollectionForm to Structure

**From:** `/app/(main-layout)/_components/EmailCollectionForm.tsx`
**To:** `/libraries/structure/source/modules/marketing/components/EmailCollectionForm.tsx`

**Changes needed:**

1. Remove project-specific imports (like `useContactListEntryCreateRequest`)
2. Accept these as props instead:
    ```typescript
    interface EmailCollectionFormProperties {
        contactListIdentifier: string;
        successMessage: string;
        initialEmailAddress?: string;
        onSubmit: (emailAddress: string) => Promise<void>;
        isLoading?: boolean;
        error?: Error | null;
    }
    ```
3. Let the parent component handle the API calls and state management
4. Update imports to use `@structure` paths

### Step 4: Create Wrapper in Project

Create a project-specific wrapper that handles the API logic:

**Location:** `/app/(main-layout)/_components/EmailCollectionFormWrapper.tsx`

```tsx
'use client';

import React from 'react';
import { EmailCollectionForm } from '@structure/source/modules/marketing/components/EmailCollectionForm';
import { useContactListEntryCreateRequest } from '../_hooks/useContactListEntryCreateRequest';

export function EmailCollectionFormWrapper(properties: {
    contactListIdentifier: string;
    successMessage: string;
    initialEmailAddress?: string;
}) {
    const contactListEntryCreateRequest = useContactListEntryCreateRequest();

    async function handleSubmit(emailAddress: string) {
        await contactListEntryCreateRequest.execute({
            data: {
                contactListIdentifier: properties.contactListIdentifier,
                emailAddress: emailAddress,
            },
        });
    }

    return (
        <EmailCollectionForm
            {...properties}
            onSubmit={handleSubmit}
            isLoading={contactListEntryCreateRequest.isLoading}
            error={contactListEntryCreateRequest.error}
        />
    );
}
```

### Step 5: Update All Usages

Find and replace all imports:

```bash
# Find all usages
grep -r "EmailCollectionForm" app/
```

Replace with the new wrapper component.

## Benefits After Completion

-   ✅ Proper theming pattern - no hardcoded classNames for colors
-   ✅ EmailCollectionForm becomes reusable across projects
-   ✅ OpsisActionPrimary variant available for other components
-   ✅ Clear separation: Structure has UI, Project has business logic
-   ✅ Easier to maintain and test

## Related Files

-   `/app/(main-layout)/_components/EmailCollectionForm.tsx` - Current location
-   `/app/_theme/components/ButtonTheme.ts` - Where to add variant
-   `/libraries/structure/source/components/buttons/ButtonTheme.ts` - Base theme reference
-   `/libraries/structure/source/components/buttons/Button.tsx` - Button component

## Priority

Low-Medium - The component currently works with hardcoded classes. This is a code quality improvement that makes the component more maintainable and reusable, but isn't blocking any functionality.

## Notes

-   The opsis-action-primary colors are project-specific (Connected branding), so the variant belongs in the project's ButtonTheme, not Structure's
-   This follows the pattern established by PrimaryBlue variant
-   Consider if other components might benefit from this variant (if so, this becomes higher priority)
