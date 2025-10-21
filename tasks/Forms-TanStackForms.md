# Migration: TanStack Form Adoption

## Overview

This document outlines the migration from react-hook-form (RHF) to TanStack Form, a decision driven by React 19 capabilities and React Compiler compatibility. The migration follows a pragmatic, incremental approach that acknowledges different form complexity levels.

## Why TanStack Form?

### React Compiler Compatibility

-   **Designed for Compiler**: TanStack team removed dynamic hooks (`useField`) and problematic `useStore` usage that violated Rules of Hooks
-   **Fine-grained Reactivity**: Uses stable subscription APIs that align with compiler's preference for pure components
-   **No "use no memo" Required**: Unlike RHF patterns that may need compiler opt-outs, TanStack Form works naturally with compilation

### React 19 Alignment

-   **Server Actions Integration**: Ships with Next.js Server Actions examples that pair well with React 19's form primitives
-   **SSR First**: Built for meta-frameworks and server-side rendering from the ground up
-   **Complements Native Forms**: Works alongside React 19's `useActionState` and `useFormStatus` for hybrid approaches

### Technical Advantages

-   **Type Safety**: First-class TypeScript with Standard Schema support (Zod, Valibot, ArkType, Effect/Schema)
-   **Performance**: Fine-grained subscriptions via `useStore(form.store, selector)` avoid tree-wide re-renders
-   **Composition**: Headless design with render props and composition primitives
-   **Bundle Size**: ~12.5 kB gzipped (comparable to RHF's 9-11 kB)

## Three-Tier Strategy

### Tier 1: Simple Forms → React 19 Native

For login, single-step settings, profile edits, and similar cases, use React 19's built-in form primitives instead of any library.

**When to use:**

-   Single-step forms with 2-5 fields
-   Server submission via actions
-   Basic validation (required, email, etc.)

**Example:**

```typescript
'use client'; // This component uses client-only features

import { useActionState } from 'react';

export function UpdateEmailForm() {
    const [error, submitAction, isPending] = useActionState(
        async function (_previousState, formData) {
            const email = String(formData.get('email') || '');

            // Validate
            if (!email.includes('@')) {
                return 'Invalid email address';
            }

            // Call server action or API
            try {
                await updateEmail(email);
                return null;
            } catch (error) {
                return 'Failed to update email';
            }
        },
        null,
    );

    // Render the component
    return (
        <form action={submitAction}>
            <input name="email" type="email" required />
            <button disabled={isPending}>Save</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}
```

**Benefits:**

-   Zero dependencies for simple cases
-   Automatic pending states and form reset
-   Native React 19 patterns

### Tier 2: Medium Complexity → TanStack Form (Simple Mode)

For multi-step forms, conditional fields, or moderate validation, use TanStack Form with straightforward patterns.

**When to use:**

-   Forms with 5-15 fields
-   Field dependencies and conditional rendering
-   Schema validation with Zod
-   Field arrays with simple add/remove

**Example:**

```typescript
'use client'; // This component uses client-only features

import React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18 or older'),
});

export function UserRegistrationForm() {
    // Hooks
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            age: 0,
        },
        validatorAdapter: zodValidator(),
        validators: {
            onChange: userSchema,
        },
        onSubmit: async function ({ value }) {
            // Submit to server
            await registerUser(value);
        },
    });

    // Render the component
    return (
        <form
            onSubmit={function (event) {
                event.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field name="name">
                {function (field) {
                    return (
                        <div>
                            <input
                                type="text"
                                value={field.state.value}
                                onChange={function (event) {
                                    field.handleChange(event.target.value);
                                }}
                            />
                            {field.state.meta.errors && <span>{field.state.meta.errors[0]}</span>}
                        </div>
                    );
                }}
            </form.Field>

            <form.Field name="email">
                {function (field) {
                    return (
                        <div>
                            <input
                                type="email"
                                value={field.state.value}
                                onChange={function (event) {
                                    field.handleChange(event.target.value);
                                }}
                            />
                            {field.state.meta.errors && <span>{field.state.meta.errors[0]}</span>}
                        </div>
                    );
                }}
            </form.Field>

            <form.Field
                name="age"
                validators={{
                    onChange: function ({ value }) {
                        return value >= 18 || 'Must be 18 or older';
                    },
                }}
            >
                {function (field) {
                    return (
                        <div>
                            <input
                                type="number"
                                value={field.state.value}
                                onChange={function (event) {
                                    field.handleChange(Number(event.target.value));
                                }}
                            />
                            {field.state.meta.errors && <span>{field.state.meta.errors[0]}</span>}
                        </div>
                    );
                }}
            </form.Field>

            <button type="submit">Register</button>
        </form>
    );
}
```

### Tier 3: Complex Forms → TanStack Form (Advanced)

For wizard flows, dynamic field arrays, dependent validation, and complex state management, use TanStack Form's full feature set.

**When to use:**

-   Forms with 15+ fields
-   Multi-step wizards
-   Complex field arrays (nested objects, conditional items)
-   Cross-field validation with dependencies
-   Devtools needed for debugging

**Example - Dependent Fields with Fine-grained Subscriptions:**

```typescript
'use client'; // This component uses client-only features

import React from 'react';
import { useForm } from '@tanstack/react-form';
import { useStore } from '@tanstack/react-store';

interface RangeFormValues {
    minimum: number;
    maximum: number;
}

export function RangeForm() {
    // Hooks
    const form = useForm<RangeFormValues>({
        defaultValues: {
            minimum: 0,
            maximum: 10,
        },
        onSubmit: async function ({ value }) {
            console.log('Submitting:', value);
        },
    });

    // Fine-grained subscription to minimum value only
    const minimum = useStore(form.store, function (state) {
        return state.values.minimum;
    });

    // Render the component
    return (
        <form
            onSubmit={function (event) {
                event.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field name="minimum">
                {function (field) {
                    return (
                        <div>
                            <label>Minimum:</label>
                            <input
                                type="number"
                                value={field.state.value}
                                onChange={function (event) {
                                    field.handleChange(Number(event.target.value));
                                }}
                            />
                        </div>
                    );
                }}
            </form.Field>

            <form.Field
                name="maximum"
                validators={{
                    onChange: function ({ value }) {
                        return value >= minimum || `Maximum must be >= ${minimum}`;
                    },
                }}
            >
                {function (field) {
                    return (
                        <div>
                            <label>Maximum:</label>
                            <input
                                type="number"
                                value={field.state.value}
                                onChange={function (event) {
                                    field.handleChange(Number(event.target.value));
                                }}
                            />
                            {field.state.meta.errors && <span>{field.state.meta.errors[0]}</span>}
                        </div>
                    );
                }}
            </form.Field>

            <button type="submit">Submit</button>
        </form>
    );
}
```

**Advanced Pattern - Field Arrays:**

```typescript
'use client'; // This component uses client-only features

import React from 'react';
import { useForm } from '@tanstack/react-form';

interface TodoItem {
    title: string;
    completed: boolean;
}

interface TodoFormValues {
    todos: TodoItem[];
}

export function TodoListForm() {
    // Hooks
    const form = useForm<TodoFormValues>({
        defaultValues: {
            todos: [{ title: '', completed: false }],
        },
        onSubmit: async function ({ value }) {
            console.log('Todos:', value.todos);
        },
    });

    // Render the component
    return (
        <form
            onSubmit={function (event) {
                event.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field name="todos" mode="array">
                {function (field) {
                    return (
                        <div>
                            {field.state.value.map(function (_, index) {
                                return (
                                    <div key={index}>
                                        <form.Field name={`todos[${index}].title`}>
                                            {function (subField) {
                                                return (
                                                    <input
                                                        type="text"
                                                        value={subField.state.value}
                                                        onChange={function (event) {
                                                            subField.handleChange(event.target.value);
                                                        }}
                                                    />
                                                );
                                            }}
                                        </form.Field>

                                        <form.Field name={`todos[${index}].completed`}>
                                            {function (subField) {
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        checked={subField.state.value}
                                                        onChange={function (event) {
                                                            subField.handleChange(event.target.checked);
                                                        }}
                                                    />
                                                );
                                            }}
                                        </form.Field>

                                        <button
                                            type="button"
                                            onClick={function () {
                                                field.removeValue(index);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                onClick={function () {
                                    field.pushValue({ title: '', completed: false });
                                }}
                            >
                                Add Todo
                            </button>
                        </div>
                    );
                }}
            </form.Field>

            <button type="submit">Save All</button>
        </form>
    );
}
```

## Migration Checklist

### Phase 1: Setup and Dependencies

-   [ ] Install TanStack Form: `npm install @tanstack/react-form`
-   [ ] Install Zod adapter if using Zod: `npm install @tanstack/zod-form-adapter`
-   [ ] Install React Compiler and ESLint plugin if not already present
-   [ ] Audit existing forms and categorize into Tier 1/2/3

### Phase 2: Incremental Migration

**Tier 1 Forms (Simple):**

-   [ ] Identify forms with 2-5 fields and server submission
-   [ ] Replace with React 19 `useActionState` pattern
-   [ ] Remove react-hook-form dependency from these files
-   [ ] Test pending states and error handling

**Tier 2 Forms (Medium):**

-   [ ] Identify forms with 5-15 fields or moderate complexity
-   [ ] Create TanStack Form instances with schema validation
-   [ ] Replace RHF `register()` with `<form.Field>` render props
-   [ ] Replace RHF `watch()` with `useStore` subscriptions
-   [ ] Migrate validation from RHF resolvers to TanStack validators
-   [ ] Test field dependencies and conditional rendering

**Tier 3 Forms (Complex):**

-   [ ] Identify complex forms with 15+ fields, wizards, or field arrays
-   [ ] Plan migration strategy for multi-step state management
-   [ ] Implement field arrays with `mode="array"`
-   [ ] Add TanStack DevTools for debugging
-   [ ] Migrate cross-field validation to fine-grained subscriptions
-   [ ] Test entire flow with React Compiler enabled

### Phase 3: Pattern Replacement Guide

| RHF Pattern                          | TanStack Form Equivalent                                          |
| ------------------------------------ | ----------------------------------------------------------------- |
| `const { register } = useForm()`     | `<form.Field name="...">{field => ...}</form.Field>`              |
| `{...register('email')}`             | `value={field.state.value} onChange={field.handleChange}`         |
| `watch('fieldName')`                 | `useStore(form.store, s => s.values.fieldName)`                   |
| `useWatch({ control, name })`        | `useStore(form.store, s => s.values[name])`                       |
| `formState.errors`                   | `field.state.meta.errors`                                         |
| `setValue('field', value)`           | `form.setFieldValue('field', value)`                              |
| `reset()`                            | `form.reset()`                                                    |
| `handleSubmit(onSubmit)`             | `form.handleSubmit()` in `onSubmit` prop                          |
| `resolver: zodResolver(schema)`      | `validatorAdapter: zodValidator(), validators: { onChange: ... }` |
| `useFieldArray({ control, name })`   | `<form.Field name="items" mode="array">`                          |
| `fields.map((field, index) => ...)`  | `field.state.value.map((_, index) => ...)`                        |
| `append(item)`                       | `field.pushValue(item)`                                           |
| `remove(index)`                      | `field.removeValue(index)`                                        |
| `control` prop for Controller        | Not needed - `<form.Field>` handles controlled inputs natively    |
| `formState.isSubmitting`             | `useStore(form.store, s => s.isSubmitting)`                       |
| `formState.isDirty`                  | `useStore(form.store, s => s.isDirty)`                            |
| `trigger('field')` manual validation | `field.validate('change')`                                        |

### Phase 4: React Compiler Validation

-   [ ] Enable React Compiler for migrated form components
-   [ ] Run ESLint with compiler plugin to catch violations
-   [ ] Verify no "use no memo" directives needed
-   [ ] Test performance with React DevTools Profiler
-   [ ] Ensure fine-grained subscriptions prevent unnecessary re-renders

### Phase 5: Cleanup

-   [ ] Remove react-hook-form from package.json when all forms migrated
-   [ ] Update component library documentation
-   [ ] Create reusable form field components using TanStack patterns
-   [ ] Document common patterns in team wiki/CLAUDE.md

## Compiler-Safe Patterns

### ✅ Fine-grained Subscriptions

```typescript
// Subscribe to specific values only
const fieldValue = useStore(form.store, function (state) {
    return state.values.specificField;
});

// Subscribe to specific error state
const fieldError = useStore(form.store, function (state) {
    return state.fieldMeta.specificField?.errors;
});
```

### ✅ Stable Field References

```typescript
// TanStack Form provides stable field references through render props
<form.Field name="email">
    {function (field) {
        // 'field' is stable across renders
        return <input value={field.state.value} onChange={field.handleChange} />;
    }}
</form.Field>
```

### ❌ Avoid These Patterns

```typescript
// ❌ Don't destructure in component body without spreading
function MyForm(properties) {
    const { className, onSubmit } = properties; // Avoid this
    // Use properties.className and properties.onSubmit directly
}

// ❌ Don't use abbreviated ref names
const formRef = React.useRef(); // Use formReference instead

// ❌ Don't use props/params naming
function MyForm(props) {} // Use 'properties' instead
```

## Common Gotchas

### Render Props Verbosity

TanStack Form uses render props by default, which can be more verbose than RHF's `register()`. Create reusable field components to reduce boilerplate:

```typescript
// Reusable text field component
export function TextField(properties: {
    form: ReturnType<typeof useForm>;
    name: string;
    label: string;
}) {
    return (
        <properties.form.Field name={properties.name}>
            {function (field) {
                return (
                    <div>
                        <label>{properties.label}</label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={function (event) {
                                field.handleChange(event.target.value);
                            }}
                        />
                        {field.state.meta.errors && <span>{field.state.meta.errors[0]}</span>}
                    </div>
                );
            }}
        </properties.form.Field>
    );
}

// Usage
<TextField form={form} name="email" label="Email Address" />
```

### Schema Validation Timing

TanStack Form validates on different events. Configure appropriately:

```typescript
const form = useForm({
    validatorAdapter: zodValidator(),
    validators: {
        onChange: schema, // Validate on every change (live feedback)
        onBlur: schema, // Validate on blur (less aggressive)
        onSubmit: schema, // Validate only on submit (minimal UX)
    },
});
```

### Type Inference

TanStack Form has excellent TypeScript inference, but you need to type the form values:

```typescript
interface MyFormValues {
    email: string;
    age: number;
    tags: string[];
}

const form = useForm<MyFormValues>({
    defaultValues: {
        email: '',
        age: 0,
        tags: [],
    },
});

// Now field.state.value is properly typed
<form.Field name="email">
    {function (field) {
        // field.state.value is string
        return <input type="text" value={field.state.value} />;
    }}
</form.Field>;
```

## Resources

-   **Official Docs**: https://tanstack.com/form/latest
-   **React Examples**: https://tanstack.com/form/latest/docs/framework/react/examples
-   **Server Actions Example**: https://tanstack.com/form/latest/docs/framework/react/guides/server-actions
-   **Migration from RHF**: https://tanstack.com/form/latest/docs/framework/react/comparison
-   **React Compiler**: https://react.dev/learn/react-compiler
-   **Standard Schema**: https://github.com/standard-schema/standard-schema

## Decision Matrix

| Scenario                                  | Recommendation                                         |
| ----------------------------------------- | ------------------------------------------------------ |
| Simple login/settings forms (2-5 fields)  | React 19 native (`useActionState`)                     |
| Medium forms with validation (5-15)       | TanStack Form with Zod                                 |
| Complex wizards, field arrays (15+)       | TanStack Form advanced patterns                        |
| Existing RHF codebase, no Compiler yet    | Keep RHF, migrate incrementally                        |
| Existing RHF + enabling React Compiler    | Migrate to TanStack Form or refactor RHF to `useWatch` |
| Greenfield project with React 19/Compiler | TanStack Form + React 19 native hybrid                 |

## Success Metrics

-   [ ] All Tier 1 forms use React 19 native primitives
-   [ ] All Tier 2/3 forms use TanStack Form
-   [ ] React Compiler enabled for all form components
-   [ ] No "use no memo" directives needed
-   [ ] Zero react-hook-form dependencies in package.json
-   [ ] Reusable form field components created
-   [ ] Team documentation updated
-   [ ] Performance benchmarks show no regressions (use React DevTools Profiler)

## Timeline Estimate

-   **Phase 1 (Setup)**: 1 day
-   **Phase 2 (Tier 1 Migration)**: 1-2 weeks
-   **Phase 2 (Tier 2 Migration)**: 2-3 weeks
-   **Phase 2 (Tier 3 Migration)**: 3-4 weeks
-   **Phase 3 (Pattern Replacement)**: Ongoing during Phase 2
-   **Phase 4 (Compiler Validation)**: 1 week
-   **Phase 5 (Cleanup)**: 1 week

**Total**: 8-11 weeks for a typical codebase with 20-30 forms

## Notes

-   This migration can be done incrementally - TanStack Form and RHF can coexist
-   Prioritize high-traffic or complex forms first for maximum impact
-   Create a shared form component library early to reduce boilerplate
-   Document team-specific patterns in CLAUDE.md as they emerge
-   Consider React 19 native forms as the first choice for new simple forms
