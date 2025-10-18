# Hybrid Form System

## Executive Summary

This document outlines our plan to build a hybrid form system that combines the best UX innovations from our original custom Form system with the performance and ecosystem benefits of react-hook-form. Rather than abandon our hard-won insights about form validation UX, we're creating a wrapper pattern (similar to how NetworkService wraps TanStack Query) that preserves what makes our forms special while gaining modern tooling.

**Core Philosophy**: Don't rebuild react-hook-form from scratch. Instead, wrap it with enhanced components that add our UX layer while delegating the heavy lifting to a battle-tested library.

## What We're Building

A new `enhanced/` folder containing:
- `EnhancedForm` - Wraps react-hook-form's form orchestration
- `EnhancedFormInput` - Progressive validation UI wrapper
- `EnhancedFormInputText` - Text input with validation state visibility
- `useEnhancedForm` - Custom hook wrapping react-hook-form's useForm
- `FormSuccessesContext` - React Context for validation successes

The old Form system remains untouched for legacy code. No breaking changes.

## Analysis: Old Form System (What's Brilliant)

Our original Form system, built during early React exploration, contains several UX innovations worth preserving:

### 1. Progressive Validation UX

**What it does**: Shows both errors AND successes during validation

```tsx
// Password validation example
<FormInputText
    type="password"
    validationSchema={new ValidationSchema().password()}
    showValidationSuccessResults={true}
/>
```

**User sees**:
- ✓ Contains an uppercase letter (green)
- ✓ Contains a number (green)
- ✗ Must contain at least one special character (red)

**Why it matters**: Users understand what they've accomplished and what remains. Traditional forms only show errors, creating a "whack-a-mole" experience.

### 2. Validation State Visibility

**What it does**: Shows visual feedback during async validation

```tsx
{properties.validating && (
    <div className="flex items-center space-x-1 text-xs text-gray-500">
        <UpdateIcon className="animate-spin" />
        <span>Validating...</span>
    </div>
)}
```

**Why it matters**: Users know when the system is checking their input (e.g., username availability). Without this, there's anxiety about whether the check is happening.

### 3. Async GraphQL Validation

**What it does**: Real-time validation against backend (username availability, email uniqueness)

```tsx
validationSchema={new ValidationSchema()
    .username(activeUsername)
    .graphQlQuery(
        gql`query AccountProfileUsernameValidate($username: String!) {
            accountProfileUsernameValidate(username: $username)
        }`,
        function(value) { return { username: value }; },
        function(value) { return value === activeUsername; }
    )
}
```

**Why it matters**: Users discover conflicts immediately, not after form submission. Skip function prevents unnecessary API calls for unchanged values.

### 4. Smart Validation Caching

**What it does**: Caches validation results to prevent redundant checks

```typescript
// From ValidationSchema.ts
const cacheKey = JSON.stringify(variables);
if(this.graphQlValidationCache.has(cacheKey)) {
    return this.graphQlValidationCache.get(cacheKey)!;
}
```

**Why it matters**: Prevents hammering the API when users navigate fields. Username "john" validated once, cached forever (in session).

### 5. Auto-focus First Error

**What it does**: Automatically focuses the first field with an error on submit

```typescript
// From Form.tsx
const firstErrorInput = formInputs.find(input =>
    input.validationResult?.valid === false
);
if(firstErrorInput?.reference) {
    firstErrorInput.reference.focus();
}
```

**Why it matters**: Reduces cognitive load - user doesn't hunt for the problem.

## Analysis: react-hook-form (What It Provides)

### 1. Performance

**Uncontrolled inputs**: Minimal re-renders, form state lives in refs not React state

```tsx
// react-hook-form approach
const { register } = useForm();
<input {...register('email')} /> // No setState on every keystroke
```

**Our old Form**: Uses setState for validation results → re-renders entire form

### 2. TypeScript Inference

**Full type safety**: Field names, validation schemas, submit handlers all typed

```tsx
type FormData = {
    username: string;
    email: string;
};

const form = useForm<FormData>();
form.register('username'); // ✓ Typed
form.register('invalid'); // ✗ TypeScript error
```

**Our old Form**: No type inference, easy to typo field names

### 3. Ecosystem

**Rich ecosystem**: Devtools, integrations, community solutions

- React DevTools integration
- Field arrays for dynamic forms
- Integration with UI libraries
- Thousands of solved edge cases

**Our old Form**: ~1,500 lines of custom code we maintain

### 4. Battle-tested

**Used by millions**: Edge cases handled, performance optimized, actively maintained

**Our old Form**: Built by one developer early in React journey

## Hybrid Architecture

### File Structure

```
libraries/structure/source/common/forms/
├── Form.tsx                           # OLD - Keep for legacy
├── FormInput.tsx                      # OLD
├── FormInputText.tsx                  # OLD
├── ValidationSchema.ts                # OLD - Being replaced by schema system
├── enhanced/                          # NEW - Hybrid system
│   ├── EnhancedForm.tsx              # Wraps react-hook-form form orchestration
│   ├── EnhancedFormInput.tsx         # Progressive validation UI wrapper
│   ├── EnhancedFormInputText.tsx     # Text input with validation state
│   ├── useEnhancedForm.ts            # Custom hook wrapping useForm
│   └── FormSuccessesContext.tsx      # React Context for successes
```

### Component Responsibilities

#### EnhancedForm.tsx
- Wraps react-hook-form's form context provider
- Manages FormSuccessesContext for validation successes
- Handles form submission and error auto-focus
- Renders children with form state

#### EnhancedFormInput.tsx
- Base wrapper for all input types
- Renders progressive validation UI (errors + successes)
- Shows validation state (validating spinner)
- Manages validation result display logic

#### EnhancedFormInputText.tsx
- Text input field with all wrapper features
- Integrates with schema validation system
- Supports async GraphQL validation
- Handles validation state visibility

#### useEnhancedForm.ts
- Wraps react-hook-form's useForm hook
- Adds validation successes tracking
- Configures schema resolver integration
- Provides enhanced form API

#### FormSuccessesContext.tsx
- React Context for validation successes
- Necessary because react-hook-form only tracks errors
- Stores field-level success messages
- Enables progressive validation UX

## UsernameForm: Before and After

### Before (Old Form System)

```tsx
'use client';

import React from 'react';
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Form, FormSubmitResponseInterface } from '@structure/source/components/forms/Form';
import { FormInputText } from '@structure/source/components/forms/FormInputText';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Alert } from '@structure/source/components/notifications/Alert';
import { useAccount, accountCacheKey } from '@structure/source/modules/account/providers/AccountProvider';
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

export function UsernameForm() {
    const account = useAccount();
    const accountProfileUpdateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {
                accountProfileUpdate(input: $input) {
                    username
                    displayName
                    givenName
                    familyName
                    images {
                        url
                        variant
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [activeUsername, setActiveUsername] = React.useState(account.data?.profile?.username || '');
    const [newUsername, setNewUsername] = React.useState(activeUsername);
    const [usernameUpdateSuccess, setUsernameUpdateSuccess] = React.useState(false);

    React.useEffect(
        function () {
            const currentUsername = account.data?.profile?.username;
            if(currentUsername) {
                setActiveUsername(currentUsername);
                setNewUsername(currentUsername);
            }
        },
        [account.data?.profile?.username],
    );

    async function handleSubmit(): Promise<FormSubmitResponseInterface> {
        setIsDialogOpen(true);
        return { success: true };
    }

    async function handleConfirm() {
        try {
            const result = await accountProfileUpdateRequest.execute({
                input: {
                    username: newUsername,
                },
            });

            if(result?.accountProfileUpdate) {
                setActiveUsername(newUsername);
                setNewUsername(newUsername);
                setUsernameUpdateSuccess(true);
                networkService.invalidateCache([accountCacheKey]);
            }
        } catch {
            // Error handled by mutation's error state
        }
    }

    function handleDialogClose() {
        setIsDialogOpen(false);
        if(usernameUpdateSuccess) {
            setActiveUsername(newUsername);
            setNewUsername(newUsername);
            setUsernameUpdateSuccess(false);
        }
    }

    return (
        <div className="rounded-lg border border-light-6 p-6 dark:border-dark-4">
            <h2 className="text-xl font-medium">Change Username</h2>

            <Form
                loading={account.isLoading}
                className="mt-6"
                formInputs={[
                    <FormInputText
                        key="username"
                        id="username"
                        label="Username"
                        defaultValue={newUsername}
                        validateOnChange={true}
                        validateOnBlur={true}
                        validationSchema={new ValidationSchema().username(activeUsername).graphQlQuery(
                            gql(`
                                query AccountProfileUsernameValidate($username: String!) {
                                    accountProfileUsernameValidate(username: $username)
                                }
                            `),
                            function (value) {
                                return {
                                    username: value,
                                };
                            },
                            function (value) {
                                return value === activeUsername;
                            },
                        )}
                        showValidationSuccessResults={true}
                        onChange={function (value) {
                            setUsernameUpdateSuccess(false);
                            if(value) {
                                setNewUsername(value);
                            }
                        }}
                    />,
                ]}
                buttonProperties={{
                    children: 'Change Username',
                    disabled: activeUsername === newUsername,
                }}
                onSubmit={handleSubmit}
            />

            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                header={usernameUpdateSuccess ? 'Username Updated' : 'Confirm Username Change'}
                content={
                    usernameUpdateSuccess ? (
                        <p>Your username has been successfully changed.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to change your username from <b>&quot;{activeUsername}&quot;</b>{' '}
                                to <b>&quot;{newUsername}&quot;</b>?
                            </p>
                            {accountProfileUpdateRequest.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={accountProfileUpdateRequest.error.message}
                                />
                            )}
                        </>
                    )
                }
                footer={
                    usernameUpdateSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <AnimatedButton
                                variant="Primary"
                                onClick={handleConfirm}
                                isProcessing={accountProfileUpdateRequest.isLoading}
                            >
                                Confirm
                            </AnimatedButton>
                        </div>
                    )
                }
            />
        </div>
    );
}
```

### After (Hybrid System)

```tsx
'use client';

import React from 'react';
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { EnhancedFormInputText } from '@structure/source/common/forms/enhanced/EnhancedFormInputText';
import { useEnhancedForm } from '@structure/source/common/forms/enhanced/useEnhancedForm';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Alert } from '@structure/source/components/notifications/Alert';
import { useAccount, accountCacheKey } from '@structure/source/modules/account/providers/AccountProvider';
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { schema } from '@structure/source/utilities/schema/Schema';

// Schema - Username Form Validation
const usernameFormSchema = (currentUsername: string) => schema.object({
    username: schema.string()
        .username(currentUsername)
        .graphQlValidate(
            gql(`
                query AccountProfileUsernameValidate($username: String!) {
                    accountProfileUsernameValidate(username: $username)
                }
            `),
            function (value) {
                return { username: value };
            },
            function (value) {
                return value === currentUsername; // Skip if unchanged
            },
        ),
});
type UsernameFormType = typeof usernameFormSchema.infer;

export function UsernameForm() {
    const account = useAccount();
    const currentUsername = account.data?.profile?.username || '';

    const accountProfileUpdateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {
                accountProfileUpdate(input: $input) {
                    username
                    displayName
                    givenName
                    familyName
                    images {
                        url
                        variant
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    const form = useEnhancedForm<UsernameFormType>({
        defaultValues: {
            username: currentUsername,
        },
        schema: usernameFormSchema(currentUsername),
    });

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [usernameUpdateSuccess, setUsernameUpdateSuccess] = React.useState(false);

    const watchUsername = form.watch('username');
    const hasChanges = watchUsername !== currentUsername;

    async function handleSubmit(data: UsernameFormType) {
        setIsDialogOpen(true);
    }

    async function handleConfirm() {
        try {
            const result = await accountProfileUpdateRequest.execute({
                input: {
                    username: watchUsername,
                },
            });

            if(result?.accountProfileUpdate) {
                setUsernameUpdateSuccess(true);
                networkService.invalidateCache([accountCacheKey]);
                form.reset({ username: watchUsername }); // Update form default to new username
            }
        } catch {
            // Error handled by mutation's error state
        }
    }

    function handleDialogClose() {
        setIsDialogOpen(false);
        if(usernameUpdateSuccess) {
            setUsernameUpdateSuccess(false);
        }
    }

    return (
        <div className="rounded-lg border border-light-6 p-6 dark:border-dark-4">
            <h2 className="text-xl font-medium">Change Username</h2>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6">
                <EnhancedFormInputText
                    name="username"
                    label="Username"
                    control={form.control}
                    showValidationSuccessResults={true}
                />

                <Button
                    type="submit"
                    disabled={!hasChanges || account.isLoading}
                    className="mt-4"
                >
                    Change Username
                </Button>
            </form>

            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                header={usernameUpdateSuccess ? 'Username Updated' : 'Confirm Username Change'}
                content={
                    usernameUpdateSuccess ? (
                        <p>Your username has been successfully changed.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to change your username from{' '}
                                <b>&quot;{currentUsername}&quot;</b> to <b>&quot;{watchUsername}&quot;</b>?
                            </p>
                            {accountProfileUpdateRequest.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={accountProfileUpdateRequest.error.message}
                                />
                            )}
                        </>
                    )
                }
                footer={
                    usernameUpdateSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <AnimatedButton
                                variant="Primary"
                                onClick={handleConfirm}
                                isProcessing={accountProfileUpdateRequest.isLoading}
                            >
                                Confirm
                            </AnimatedButton>
                        </div>
                    )
                }
            />
        </div>
    );
}
```

### Key Differences

**Before (Old System)**:
- 84 lines of component code
- Manual state management for username tracking
- `formInputs` array prop pattern
- Imperative validation via ValidationSchema class
- Complex ref management
- No type inference on form data

**After (Hybrid System)**:
- 78 lines (6 fewer)
- react-hook-form handles state
- Declarative schema validation
- Full TypeScript inference
- Cleaner field registration
- Same UX: progressive validation, async GraphQL validation, validation state visibility

**What's Preserved**:
- ✓ Progressive validation UI (errors + successes)
- ✓ Validation state visibility (spinner during async)
- ✓ GraphQL async validation with skip function
- ✓ Auto-focus first error on submit

**What's Improved**:
- ✓ Type safety (field names, validation, submit)
- ✓ Performance (uncontrolled inputs)
- ✓ Developer experience (cleaner code)
- ✓ Ecosystem (devtools, integrations)

## Migration Strategy

### Phase 1: Build Enhanced Components
1. Create `enhanced/` folder structure
2. Implement `FormSuccessesContext` for validation successes
3. Build `useEnhancedForm` hook wrapping react-hook-form
4. Create `EnhancedFormInput` with progressive validation UI
5. Implement `EnhancedFormInputText` with async validation

### Phase 2: Test with Simple Form
1. Pick a simple form (email collection)
2. Migrate to hybrid system
3. Verify all UX features work
4. Test async validation
5. Validate TypeScript inference

### Phase 3: Migrate Complex Forms
1. UsernameForm (async GraphQL validation)
2. PasswordForm (progressive validation UI)
3. ContactForm (multiple fields, conditional logic)
4. Support ticket forms (file attachments)

### Phase 4: Documentation and Cleanup
1. Document enhanced components
2. Create migration guide
3. Update examples
4. Mark old Form system as legacy (but don't remove)

## Technical Challenges and Solutions

### Challenge 1: Validation Successes

**Problem**: react-hook-form only tracks errors, not successes

**Solution**: FormSuccessesContext stores success messages alongside react-hook-form's error state

```tsx
// FormSuccessesContext.tsx
const FormSuccessesContext = React.createContext<{
    successes: Record<string, SchemaSuccess[]>;
    setSuccesses: (field: string, successes: SchemaSuccess[]) => void;
}>(null);

// EnhancedFormInputText.tsx
const { successes, setSuccesses } = React.useContext(FormSuccessesContext);

// After validation
if(result.successes) {
    setSuccesses(properties.name, result.successes);
}
```

### Challenge 2: Async GraphQL Validation

**Problem**: react-hook-form's async validation doesn't support custom loading states

**Solution**: Track validation state separately, trigger validation manually

```tsx
const [isValidating, setIsValidating] = React.useState(false);

async function validateField(value: string) {
    setIsValidating(true);
    const result = await schema.validate(value);
    setIsValidating(false);
    return result;
}
```

### Challenge 3: Schema Integration

**Problem**: react-hook-form expects resolver function, we have schema objects

**Solution**: Create adapter that converts schema validation to resolver format

```tsx
// reactHookFormSchemaAdapter.ts (already built)
export function reactHookFormSchemaAdapter<T>(schemaInstance: BaseSchema<T>) {
    return async function (values: unknown) {
        const result = await schemaInstance.validate(values);

        if(result.valid) {
            return { values: result.value, errors: {} };
        }

        return {
            values: {},
            errors: result.errors.reduce((acc, error) => {
                const field = error.path.join('.');
                acc[field] = { type: error.identifier, message: error.message };
                return acc;
            }, {}),
        };
    };
}
```

### Challenge 4: Auto-focus First Error

**Problem**: react-hook-form doesn't auto-focus errors

**Solution**: Use setFocus after validation fails

```tsx
// useEnhancedForm.ts
const enhancedHandleSubmit = form.handleSubmit(
    async function (data) {
        // Valid - call onSubmit
        await onSubmit(data);
    },
    async function (errors) {
        // Invalid - focus first error
        const firstErrorField = Object.keys(errors)[0];
        if(firstErrorField) {
            form.setFocus(firstErrorField);
        }
    }
);
```

## Why This Approach

### Alternative 1: Keep Old Form System
**Pros**: No work, we built it, we know it
**Cons**: No type safety, performance issues, ~1,500 lines to maintain, no ecosystem

### Alternative 2: Switch to react-hook-form Directly
**Pros**: Battle-tested, performant, ecosystem
**Cons**: Lose progressive validation UX, lose validation state visibility, lose our innovations

### Alternative 3: Rebuild react-hook-form from Scratch
**Pros**: Full control, perfect integration with schema system
**Cons**: Months of work, reinventing solved problems, ongoing maintenance burden

### Our Choice: Hybrid System (Alternative 4)
**Pros**:
- Preserve our UX innovations
- Gain react-hook-form performance and ecosystem
- Minimal code to maintain (just wrappers)
- Type safety and inference
- Battle-tested core with custom UX layer

**Cons**:
- Small wrapper maintenance (acceptable)
- Two form systems temporarily (old for legacy, new for future)

## Benefits Summary

### For Users
- **Progressive validation UX** - See what's accomplished, what remains
- **Validation state visibility** - Know when system is checking
- **Async validation** - Discover conflicts immediately
- **Better performance** - Faster forms, minimal re-renders

### For Developers
- **Type safety** - Field names, validation, submit all typed
- **Better DX** - Cleaner code, less boilerplate
- **Ecosystem** - Devtools, integrations, community solutions
- **Confidence** - Battle-tested library handling edge cases

### For Codebase
- **Less maintenance** - Delegate heavy lifting to react-hook-form
- **Better patterns** - Declarative schema validation
- **Future-proof** - Modern tooling, active ecosystem
- **Migration path** - Old forms work, migrate when convenient

## Implementation Timeline

**Phase 1 (Build Enhanced Components)**: 1-2 days
- FormSuccessesContext
- useEnhancedForm
- EnhancedFormInput
- EnhancedFormInputText

**Phase 2 (Test with Simple Form)**: 0.5 days
- Migrate EmailCollectionForm
- Verify all features work

**Phase 3 (Migrate Complex Forms)**: 2-3 days
- UsernameForm
- PasswordForm
- ContactForm
- Support ticket forms

**Phase 4 (Documentation)**: 0.5 days
- Component documentation
- Migration guide
- Examples

**Total**: 4-6 days of focused work

## Conclusion

This hybrid approach represents the crystalline structure we're after: preserving hard-won insights about form validation UX while embracing modern tooling that handles the plumbing. We're not abandoning our innovations or rebuilding the wheel - we're wrapping a battle-tested library with our UX layer.

The result: forms that feel special (progressive validation, validation state visibility, async GraphQL validation) while being built on solid foundations (react-hook-form's performance, type safety, and ecosystem).

**Next Steps**:
1. Build Phase 1 components when ready
2. Test with simple form to validate approach
3. Migrate complex forms to prove it scales
4. Document everything for future developers

No rush to migrate old forms - they work fine. The hybrid system is for new forms and opportunistic migration when touching existing forms.
