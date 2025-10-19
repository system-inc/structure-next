# Deprecate Old Validation System

## Context

The codebase currently has two validation systems:

1. **Old System** (to be deprecated):
   - `Validation.ts` - Basic validation utilities and interfaces
   - `ValidationSchema.ts` - Class-based validation schema
   - Used with custom form components (FormInputText, Form, etc.)

2. **New System** (current standard):
   - `schema/Schema.ts` - Modern type-safe schema system
   - `schema/adapters/ReactHookFormSchemaAdapter.ts` - React Hook Form integration
   - Inspired by Zod, with full TypeScript inference
   - Used with react-hook-form

**Current Locations:**
- Old: `/libraries/structure/source/utilities/validation/`
- New: `/libraries/structure/source/utilities/schema/`

## Goal

Complete migration to the new schema system and remove the old validation system:

1. **Phase 1**: Migrate all usages of `ValidationSchema` to new `schema` system
2. **Phase 2**: Migrate form components that use old validation to react-hook-form pattern
3. **Phase 3**: Remove `ValidationSchema.ts` and update `Validation.ts`
4. **Phase 4**: Clean up and document the final state

## Current Usage Analysis

### Old ValidationSchema Usages

Files using `new ValidationSchema()`:
1. `/libraries/structure/source/components/forms/FormInputText.tsx` - Email validation
2. `/libraries/structure/source/components/forms/Form.tsx` - Form validation
3. `/libraries/structure/source/modules/account/pages/profile/profile/components/UsernameForm.tsx` - Username validation
4. `/libraries/structure/source/modules/account/pages/profile/security/components/ManagePasswordForm.tsx` - Password validation

Additional files importing `ValidationSchema`:
- `/libraries/structure/source/components/forms/FormInput.tsx`
- `/libraries/structure/source/modules/post/report/components/dialogs/PostReportDialog.tsx`
- `/libraries/structure/source/modules/post/comments/components/controls/PostCommentReportDialog.tsx`
- Various other FormInput components (Checkbox, TextArea, Select, etc.)

### New Schema System Usages

Files already using the new system:
1. `/app/(main-layout)/_components/EmailCollectionForm.tsx` - Email collection
2. `/app/ops/support/_components/ticket/TicketMessageForm.tsx` - Ticket messages
3. `/libraries/structure/source/modules/support/contact/components/ContactForm.tsx` - Contact form

## Migration Strategy

### Phase 1: Audit and Categorize Components

1. **List all components using ValidationSchema**:
   - Identify which are form components vs. business logic
   - Determine migration complexity for each
   - Note any unique validation rules that need porting

2. **Identify validation rules to port**:
   - Username validation (with GraphQL uniqueness check)
   - Password validation (complexity rules)
   - Email validation (already in new system)
   - Custom validators

### Phase 2: Migrate Form Components

#### Option A: Keep Custom Form Components, Update Validation

Update custom form components to work with new schema:

```typescript
// Before - FormInputText.tsx
const validate = React.useCallback(
    async function (value: string | undefined) {
        if(propertiesType === 'email') {
            validationResult = await new ValidationSchema().emailAddress().validate(value);
        }
        // ...
    },
    [propertiesType, propertiesValidationSchema, propertiesValidate]
);

// After - FormInputText.tsx
const validate = React.useCallback(
    async function (value: string | undefined) {
        if(propertiesType === 'email') {
            // Use new schema system
            const emailSchema = schema.string().email();
            validationResult = await emailSchema.validate(value);
        }
        // ...
    },
    [propertiesType, propertiesValidationSchema, propertiesValidate]
);
```

**Pros:**
- Maintains existing form components
- Incremental migration
- Backward compatible during transition

**Cons:**
- Still maintains custom validation system
- Doesn't leverage react-hook-form fully

#### Option B: Migrate to React Hook Form Pattern (Recommended)

Convert all forms to use react-hook-form with the new schema system:

```typescript
// Before - UsernameForm.tsx (custom form system)
<Form>
    <FormInputText
        validationSchema={new ValidationSchema().username(currentUsername)}
        // ... other props
    />
</Form>

// After - UsernameForm.tsx (react-hook-form)
const formSchema = schema.object({
    username: schema.string()
        .minimumLength(3)
        .maximumLength(32)
        .custom(validateUsername) // Custom validator
});

const form = useForm({
    resolver: reactHookFormSchemaAdapter(formSchema),
});

<form onSubmit={form.handleSubmit(handleSubmit)}>
    <InputText {...form.register('username')} />
</form>
```

**Pros:**
- Industry standard form library
- Better TypeScript inference
- Consistent with new code
- More performant
- Better error handling

**Cons:**
- Requires rewriting forms
- More upfront work
- Learning curve if unfamiliar with react-hook-form

### Phase 3: Port Validation Rules to New System

#### Username Validation

Old system:
```typescript
new ValidationSchema()
    .username(currentUsername)
    .graphQlQuery(
        AccountProfileUsernameValidateDocument,
        (value) => ({ username: value as string }),
    )
```

New system approach:
```typescript
const usernameSchema = schema.string()
    .minimumLength(3)
    .maximumLength(32)
    .pattern(/^[a-zA-Z0-9_.]+$/, 'Letters, numbers, and underscores only')
    .custom(async function(value, path) {
        // Check if current username
        if(currentUsername && value === currentUsername) {
            return {
                successes: [{
                    path,
                    identifier: 'currentUsername',
                    message: 'Current username.'
                }]
            };
        }

        // GraphQL validation
        const result = await networkService.graphQlRequest(
            AccountProfileUsernameValidateDocument,
            { username: value }
        );

        // Return validation result based on response
        // ...
    });
```

#### Password Validation

Old system:
```typescript
new ValidationSchema()
    .password() // Includes minimum/maximum + complexity
```

New system approach:
```typescript
const passwordSchema = schema.string()
    .minimumLength(8)
    .maximumLength(128)
    .custom(function(value, path) {
        const errors = [];
        const successes = [];

        // Check uppercase
        if(!/[A-Z]/.test(value)) {
            errors.push({
                path,
                identifier: 'noUppercase',
                message: 'Must contain at least one uppercase letter.'
            });
        } else {
            successes.push({
                path,
                identifier: 'hasUppercase',
                message: 'Contains at least one uppercase letter.'
            });
        }

        // Check number
        if(!/[0-9]/.test(value)) {
            errors.push({
                path,
                identifier: 'noNumber',
                message: 'Must contain at least one number.'
            });
        } else {
            successes.push({
                path,
                identifier: 'hasNumber',
                message: 'Contains at least one number.'
            });
        }

        // Check special character
        if(!/[^a-zA-Z0-9]/.test(value)) {
            errors.push({
                path,
                identifier: 'noSpecialCharacter',
                message: 'Must contain at least one special character.'
            });
        } else {
            successes.push({
                path,
                identifier: 'hasSpecialCharacter',
                message: 'Contains at least one special character.'
            });
        }

        return {
            valid: errors.length === 0,
            errors,
            successes
        };
    });
```

Or create a reusable helper:
```typescript
// In Schema.ts or new PasswordSchema.ts
schema.password = function() {
    return new PasswordSchema(); // Extends StringSchema with password rules
};
```

### Phase 4: Remove Old Validation System

Once all usages are migrated:

1. **Delete ValidationSchema.ts**:
   ```bash
   rm libraries/structure/source/utilities/validation/ValidationSchema.ts
   ```

2. **Update Validation.ts**:
   - Keep useful utilities like `isEmailAddress()`, `isUsername()`
   - Remove unused interfaces and types
   - Consider moving helpers to new schema system if still needed
   - Or deprecate entirely if new system replaces it

3. **Update imports**:
   - Search for any remaining imports
   - Update to use new schema system
   - Remove unused imports

## Implementation Checklist

### Discovery Phase
- [ ] Audit all files using `ValidationSchema`
- [ ] Audit all files using `Validation` utilities
- [ ] Document all validation rules and their requirements
- [ ] Identify forms using custom form components
- [ ] Identify forms using react-hook-form

### Migration Phase
- [ ] Decide: Option A (update custom forms) or Option B (migrate to react-hook-form)
- [ ] Port username validation to new schema system
- [ ] Port password validation to new schema system
- [ ] Port email validation (already exists, ensure consistency)
- [ ] Port any other custom validators

### Form Migration (if Option B)
- [ ] Migrate `UsernameForm.tsx` to react-hook-form
- [ ] Migrate `ManagePasswordForm.tsx` to react-hook-form
- [ ] Migrate `PostReportDialog.tsx` if using old validation
- [ ] Migrate `PostCommentReportDialog.tsx` if using old validation
- [ ] Migrate any other forms using old validation

### Form Component Updates (if Option A)
- [ ] Update `FormInputText.tsx` to use new schema
- [ ] Update `Form.tsx` to use new schema
- [ ] Update other FormInput components
- [ ] Test all form components

### Cleanup Phase
- [ ] Remove `ValidationSchema.ts`
- [ ] Update or remove `Validation.ts`
- [ ] Remove all old validation imports
- [ ] Update any documentation
- [ ] Search codebase for any missed usages

### Testing Phase
- [ ] Test username validation (including GraphQL uniqueness)
- [ ] Test password validation (all complexity rules)
- [ ] Test email validation
- [ ] Test all migrated forms
- [ ] Verify error messages display correctly
- [ ] Verify success messages display correctly (progressive validation)

## New Schema System Enhancement Opportunities

While migrating, consider adding these to the new schema system:

### Add Convenience Methods

```typescript
// In StringSchema.ts
class StringSchema extends BaseSchema<string> {
    // ... existing methods

    email() {
        return this.pattern(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Must be a valid email address'
        );
    }

    username() {
        return this
            .minimumLength(3)
            .maximumLength(32)
            .pattern(/^[a-zA-Z0-9_.]+$/, 'Letters, numbers, and underscores only')
            .custom(validateNoLeadingTrailingPeriod)
            .custom(validateSingleInternalPeriod);
    }

    password() {
        return this
            .minimumLength(8)
            .maximumLength(128)
            .custom(validatePasswordComplexity);
    }

    url() {
        return this.pattern(
            /^https?:\/\/.+/,
            'Must be a valid URL'
        );
    }
}
```

### Add Schema Utilities

```typescript
// In Schema.ts
export const schema = {
    // ... existing

    // Common validation helpers
    common: {
        username: (currentUsername?: string) => {
            return schema.string().username().custom(
                validateUsernameUnique(currentUsername)
            );
        },

        password: () => {
            return schema.string().password();
        },

        email: () => {
            return schema.string().email();
        }
    }
};

// Usage:
const formSchema = schema.object({
    username: schema.common.username(currentUsername),
    password: schema.common.password(),
    email: schema.common.email()
});
```

## Decision Points

### 1. Form Component Strategy

**Question:** Keep custom form components or migrate to react-hook-form?

**Recommendation:** Migrate to react-hook-form (Option B)
- Industry standard
- Better long-term maintainability
- Already being used in new code
- More features (field arrays, dynamic validation, etc.)

### 2. Validation Utilities Fate

**Question:** Keep `Validation.ts` helper functions or remove entirely?

**Options:**
- **Keep helpers**: `isEmailAddress()`, `isUsername()` might be useful
- **Move to schema**: Integrate into new schema system
- **Remove entirely**: If not needed outside validation context

**Recommendation:** Keep useful helpers, deprecate validation result types

### 3. Migration Approach

**Question:** Big bang migration or incremental?

**Recommendation:** Incremental
- Less risky
- Can test each form individually
- Won't break existing functionality
- Can roll back if issues found

## Timeline Estimate

- **Discovery Phase**: 1-2 hours
- **Schema Enhancement**: 2-4 hours (add convenience methods)
- **Form Migration**: 1-2 hours per form (4-8 forms estimated)
- **Testing**: 2-3 hours
- **Cleanup**: 1 hour

**Total**: 10-20 hours depending on number of forms and complexity

## Benefits After Completion

- ✅ Single, consistent validation system
- ✅ Better TypeScript inference
- ✅ Industry-standard form handling (react-hook-form)
- ✅ Less code to maintain
- ✅ Easier for new developers to understand
- ✅ Better performance
- ✅ More robust error handling
- ✅ Consistent with modern React patterns

## Related Files

- Old System:
  - `/libraries/structure/source/utilities/validation/Validation.ts`
  - `/libraries/structure/source/utilities/validation/ValidationSchema.ts`

- New System:
  - `/libraries/structure/source/utilities/schema/Schema.ts`
  - `/libraries/structure/source/utilities/schema/adapters/ReactHookFormSchemaAdapter.ts`
  - `/libraries/structure/source/utilities/schema/internal/*` - All schema implementations

- Examples of New Pattern:
  - `/app/ops/support/_components/ticket/TicketMessageForm.tsx`
  - `/app/(main-layout)/_components/EmailCollectionForm.tsx`
  - `/libraries/structure/source/modules/support/contact/components/ContactForm.tsx`

- To Migrate:
  - `/libraries/structure/source/modules/account/pages/profile/profile/components/UsernameForm.tsx`
  - `/libraries/structure/source/modules/account/pages/profile/security/components/ManagePasswordForm.tsx`
  - `/libraries/structure/source/components/forms/Form.tsx`
  - `/libraries/structure/source/components/forms/FormInputText.tsx`
  - Other FormInput components

## Priority

Medium-High - The new schema system is superior and already in use. Completing this migration will:
- Remove technical debt
- Improve developer experience
- Reduce confusion about which system to use
- Enable deprecation of old validation code

Not critical/blocking, but valuable for long-term code health and consistency.

## Notes

- The new schema system was inspired by Zod but built custom to fit our needs
- Consider if we want to eventually migrate to actual Zod instead of maintaining custom system
- react-hook-form is well-maintained and widely used (good long-term choice)
- Some custom form components may still be valuable even with react-hook-form
- Consider creating a migration guide document for developers
- May want to keep both systems briefly during transition with clear deprecation warnings

## Open Questions

1. Should we migrate to actual Zod instead of maintaining our custom schema system?
2. Do we want to keep any of the custom form components (Form, FormInput, etc.)?
3. Should validation utilities like `isEmailAddress()` stay in `Validation.ts` or move elsewhere?
4. Do we want to add deprecation warnings before removing old system?
5. Should we create schema convenience methods (`.username()`, `.password()`) or keep it explicit?
