# Repeating Form Elements: Council Findings & Architecture

**Date**: November 30, 2024
**Status**: Research Complete - Ready for Implementation
**Council Members**: GPT-5, Grok, Gemini, Claude
**Topic**: Designing a robust system for repeating/array form elements in a TanStack Form-based architecture

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem We're Solving](#2-the-problem-were-solving)
3. [Current Architecture Context](#3-current-architecture-context)
4. [TanStack Form Deep Dive](#4-tanstack-form-deep-dive)
5. [The Key Stability Problem](#5-the-key-stability-problem)
6. [Architectural Decision: Generic vs Specialized](#6-architectural-decision-generic-vs-specialized)
7. [Component Architecture](#7-component-architecture)
8. [Schema and Validation Design](#8-schema-and-validation-design)
9. [GraphQL Integration](#9-graphql-integration)
10. [Performance at Scale](#10-performance-at-scale)
11. [Accessibility Requirements](#11-accessibility-requirements)
12. [Drag-and-Drop Reordering](#12-drag-and-drop-reordering)
13. [Advanced Features](#13-advanced-features)
14. [Implementation Plan](#14-implementation-plan)
15. [API Reference](#15-api-reference)
16. [Appendix: Code Artifacts](#16-appendix-code-artifacts)

---

## 1. Executive Summary

### The Challenge

Our form system needs to handle repeating elements—arrays of scalars (like tags) and arrays of objects (like order items). Currently, we have a hardcoded hack for `topicIds` that wraps single values in arrays, and no general solution for array fields in our GraphQL auto-generation system.

### The Solution

The council unanimously recommends a **"Primitive-Composite" pattern**:

1. **Primitive Layer**: A generic `FieldArray` component that handles:

    - TanStack Form integration (`mode="array"`)
    - Stable React key generation (parallel UUID array)
    - Array manipulation methods (push, remove, move, swap)
    - Validation orchestration

2. **Composite Layer**: Specialized components built on the primitive:
    - `FieldInputTagList` - Chip/tag input for `string[]`
    - `FieldInputRepeatingText` - Stacked text inputs for `string[]`
    - `FieldArrayGroup` - Card-based groups for object arrays
    - `SortableFieldArrayGroup` - Drag-and-drop wrapper

### Key Insights

| Finding                                                   | Implication                                       |
| --------------------------------------------------------- | ------------------------------------------------- |
| TanStack Form doesn't generate stable IDs                 | We must implement parallel UUID arrays            |
| 100+ item arrays have known performance issues            | Virtualization support is required                |
| Array validation is complex (item vs array vs cross-item) | Schema system needs `.unique()`, `.refineArray()` |
| GraphQL can't distinguish tag lists from multi-selects    | Heuristic mapping + explicit overrides needed     |

### Success Metrics

-   [ ] Remove the hardcoded `topicIds` hack
-   [ ] Type-safe array fields inferred from schema
-   [ ] No focus loss on reorder/delete operations
-   [ ] Support 100+ items without performance degradation
-   [ ] Full keyboard accessibility
-   [ ] GraphQL auto-generation works for all array types

---

## 2. The Problem We're Solving

### 2.1 Current Pain Points

**The `topicIds` Hack**

In `GraphQlFieldMetadataExtraction.tsx`, we have this embarrassing code:

```typescript
// TODO: Remove this - hard coding this fix for now
if(key === 'input.topicIds' && value) {
    graphQlValue = [value];
}
```

This exists because:

1. The form stores a single value
2. GraphQL expects `[String!]`
3. We have no array field components
4. We have no array detection in schema generation

**No Array Field Components**

Our `forms-new` system has:

-   `FieldInputText` ✓
-   `FieldInputTextArea` ✓
-   `FieldInputCheckbox` ✓
-   `FieldInputSelect` ✓
-   `FieldInputFile` ✓
-   `FieldInputMarkup` ✓
-   `FieldInput???Array` ✗ (missing!)

**Schema System Gap**

We have `ArraySchema` with `minimumLength()` and `maximumLength()`, but:

-   No `.unique()` for duplicate detection
-   No cross-item validation
-   Not connected to form field generation

### 2.2 Types of Repeating Elements We Need

#### Scenario A: Arrays of Scalars

```graphql
input PostInput {
    tags: [String!] # Free-form tags
    topicIds: [ID!] # Reference IDs (needs lookup)
    ratings: [Int!] # Numeric values
    emails: [String!] # Validated strings
}
```

**UI Patterns**:

-   Tag/chip input (type + Enter)
-   Multi-select dropdown
-   Repeating text fields with add/remove

#### Scenario B: Arrays of Objects

```graphql
input OrderInput {
    items: [OrderItemInput!]!
}

input OrderItemInput {
    productId: ID!
    quantity: Int!
    notes: String
}
```

**UI Patterns**:

-   Card per item with multiple fields
-   Accordion sections
-   Table rows with inline editing

#### Scenario C: Nested Arrays

```graphql
input SurveyInput {
    sections: [SectionInput!]!
}

input SectionInput {
    title: String!
    questions: [QuestionInput!]!
}

input QuestionInput {
    text: String!
    options: [String!] # Array inside array inside array!
}
```

**UI Patterns**:

-   Hierarchical card nesting
-   Tree-like structures
-   Collapsible sections

---

## 3. Current Architecture Context

### 3.1 The Four-Layer System

```
┌─────────────────────────────────────────────────────────────┐
│  PROJECT (@project/)                                         │
│  Application-specific code (Phi health platform)            │
│  - Pages, domain components, business logic                 │
├─────────────────────────────────────────────────────────────┤
│  STRUCTURE (@structure/)                                     │
│  Shared frontend library (forms, components, utilities)     │
│  - useForm, FieldInputText, schema system                   │
│  - WHERE ARRAY FIELDS WILL LIVE                             │
├─────────────────────────────────────────────────────────────┤
│  NEXUS (@nexus/)                                            │
│  Bridge between frontend and backend                        │
├─────────────────────────────────────────────────────────────┤
│  BASE (Backend)                                             │
│  TypeScript backend with GraphQL API                        │
└─────────────────────────────────────────────────────────────┘
```

**Key Constraint**: Array field components must be generic enough for any project, living in `@structure/`, not `@project/`.

### 3.2 Current Form System Structure

```
libraries/structure/source/
├── components/forms-new/
│   ├── useForm.tsx                    # Core hook wrapping TanStack Form
│   ├── fields/
│   │   ├── text/
│   │   │   ├── InputText.tsx          # Standalone (no form awareness)
│   │   │   └── FieldInputText.tsx     # Form-connected
│   │   ├── text-area/
│   │   ├── checkbox/
│   │   ├── select/
│   │   ├── file/
│   │   ├── markup/
│   │   └── arrays/                    # NEW - TO BE CREATED
│   │       ├── FieldArray.tsx         # Primitive
│   │       ├── FieldInputTagList.tsx  # Composite
│   │       ├── FieldArrayGroup.tsx    # Composite
│   │       └── SortableFieldArrayGroup.tsx
│   ├── providers/
│   └── hooks/
├── api/graphql/forms/
│   ├── GraphQlMutationForm.tsx
│   └── utilities/
│       ├── GraphQlFieldMetadataExtraction.tsx
│       ├── GraphQlFormSchemaGeneration.tsx
│       └── GraphQlFormFieldMapping.tsx
└── utilities/schema/
    └── schemas/
        └── ArraySchema.ts             # Needs extension
```

### 3.3 The Two-Component Pattern

Every field type follows this pattern:

1. **`InputX`** - Standalone, no form awareness:

    ```tsx
    <InputText value={value} onChange={onChange} />
    ```

2. **`FieldInputX`** - Form-connected via context:
    ```tsx
    <form.Field identifier="email">
        <FieldInputText type="email" />
    </form.Field>
    ```

Array components will follow this same pattern, but with additional complexity for managing item identity and sub-fields.

---

## 4. TanStack Form Deep Dive

### 4.1 How `mode="array"` Works

TanStack Form treats array fields as mutable collections rather than atomic values. When you mount a field with `mode="array"`, the `FieldApi` exposes additional methods:

| Method         | Signature                                  | Behavior              |
| -------------- | ------------------------------------------ | --------------------- |
| `pushValue`    | `(value: T) => void`                       | Add item to end       |
| `insertValue`  | `(index: number, value: T) => void`        | Insert at index       |
| `removeValue`  | `(index: number) => void`                  | Remove at index       |
| `swapValues`   | `(indexA: number, indexB: number) => void` | Swap two items        |
| `moveValue`    | `(from: number, to: number) => void`       | Move item to position |
| `replaceValue` | `(index: number, value: T) => void`        | Replace item          |
| `clearValues`  | `() => void`                               | Remove all items      |

**Basic TanStack Pattern**:

```tsx
<form.Field name="tags" mode="array">
    {(field) => (
        <>
            {field.state.value.map((_, index) => (
                <form.Field key={index} name={`tags[${index}]`}>
                    {(subField) => (
                        <input value={subField.state.value} onChange={(e) => subField.handleChange(e.target.value)} />
                    )}
                </form.Field>
            ))}
            <button onClick={() => field.pushValue('')}>Add</button>
        </>
    )}
</form.Field>
```

### 4.2 What TanStack Form Does NOT Provide

1. **Stable React Keys**: Documentation uses `key={index}`, which is problematic
2. **Auto-generated Item IDs**: Unlike React Hook Form, no `item.id` is generated
3. **Parent Validation Triggers**: Child changes don't automatically validate parent
4. **Performance Optimization**: No built-in virtualization or lazy rendering

### 4.3 Known Issues and Gotchas

From GitHub issues analysis:

| Issue                                                 | Description                                          | Mitigation                               |
| ----------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| [#692](https://github.com/TanStack/form/issues/692)   | Moving subfields with undefined values shuffles data | Initialize all items with defined values |
| [#695](https://github.com/TanStack/form/issues/695)   | Bad performance with 100+ rows                       | Virtualization required                  |
| [#704](https://github.com/TanStack/form/issues/704)   | StrictMode double-render breaks `pushValue`          | Use refs for ID management               |
| [#1439](https://github.com/TanStack/form/issues/1439) | Falsy values become `undefined` on removal           | Explicit value handling                  |
| [#1786](https://github.com/TanStack/form/issues/1786) | `validateAllFields` triggers O(n²) updates           | Per-field validation only                |

### 4.4 Reactive Store Architecture

TanStack Form uses a subscription model:

```
┌─────────────────────────────────────────────────────────────┐
│                     FORM STORE                               │
├─────────────────────────────────────────────────────────────┤
│  values: {                                                   │
│      items: [                                                │
│          { productId: 'abc', quantity: 2 },  ─────────────┐ │
│          { productId: 'def', quantity: 1 },               │ │
│      ]                                                     │ │
│  }                                                         │ │
└───────────────────────────────────────────────────────────┼─┘
                                                             │
    ┌────────────────────────────────────────────────────────┼─┐
    │ FIELD SUBSCRIPTIONS                                    │ │
    ├────────────────────────────────────────────────────────┤ │
    │  items           → subscribes to full array ──────────┐│ │
    │  items[0]        → subscribes to first item ──────────┼┤ │
    │  items[0].productId → subscribes to nested value ─────┼┼─┘
    │  items[1].quantity  → subscribes to nested value      ││
    └───────────────────────────────────────────────────────┼┼─┘
                                                             ││
    PROBLEM: Parent "items" re-renders on ANY child change! ◄┘│
    SOLUTION: Subscribe parent to LENGTH only ◄───────────────┘
```

**Performance Optimization**:

```tsx
// BAD: Re-renders on every keystroke in any sub-field
const arrayValue = form.useStore((state) => state.values.items);

// GOOD: Only re-renders when items added/removed
const arrayLength = form.useStore((state) => state.values.items?.length ?? 0);
```

---

## 5. The Key Stability Problem

### 5.1 Why Index Keys Fail

Consider this sequence:

```
Initial State:        User deletes item 1:    React sees:
─────────────         ───────────────────     ──────────────────
key=0: "Apple"        key=0: "Apple"          key=0: still exists (reuse DOM)
key=1: "Banana" ←─┐   key=1: "Cherry"         key=1: still exists (reuse DOM)
key=2: "Cherry"   │                           key=2: GONE (destroy DOM)
                  │
                  └── DELETED but key=1 DOM node persists!
```

**What Goes Wrong**:

-   Focus stays on key=1 (now showing "Cherry", not "Banana")
-   Animations on key=1 continue (wrong item)
-   Internal component state (refs, hover, selection) is wrong
-   User thinks they deleted "Cherry" but deleted "Banana"

### 5.2 The Stable ID Solution

Maintain a parallel array of UUIDs:

```
Form Values:              ID Map:               React Keys:
─────────────             ────────              ───────────
items[0]: "Apple"    →    ids[0]: "uuid-a"  →  key="uuid-a"
items[1]: "Banana"   →    ids[1]: "uuid-b"  →  key="uuid-b"
items[2]: "Cherry"   →    ids[2]: "uuid-c"  →  key="uuid-c"

After deleting items[1]:

Form Values:              ID Map:               React Keys:
─────────────             ────────              ───────────
items[0]: "Apple"    →    ids[0]: "uuid-a"  →  key="uuid-a" (same node)
items[1]: "Cherry"   →    ids[1]: "uuid-c"  →  key="uuid-c" (same node!)

                          "uuid-b" removed from both arrays
```

### 5.3 Why WeakMap Doesn't Work for Primitives

A common pattern for object identity is `WeakMap`:

```tsx
const idMap = new WeakMap<object, string>();

function getId(item: object): string {
    if(!idMap.has(item)) {
        idMap.set(item, crypto.randomUUID());
    }
    return idMap.get(item)!;
}
```

**Problem**: This fails for `string[]` or `number[]` because primitives are passed by value, not reference. Each time you access `items[0]`, it's a new string value, not the same reference.

**Solution**: Use a parallel array synchronized via action wrappers:

```tsx
const [ids, setIds] = useState<string[]>([]);

const push = (value: TItem) => {
    setIds((prev) => [...prev, crypto.randomUUID()]);
    field.pushValue(value);
};

const remove = (index: number) => {
    setIds((prev) => prev.filter((_, i) => i !== index));
    field.removeValue(index);
};
```

### 5.4 React Hook Form's Approach (For Comparison)

React Hook Form's `useFieldArray` automatically generates stable IDs:

```tsx
const { fields, append, remove } = useFieldArray({ name: 'items' });

fields.map((field) => (
    <div key={field.id}>
        {' '}
        {/* Auto-generated stable ID! */}
        <input {...register(`items.${field.index}.name`)} />
    </div>
));
```

TanStack Form lacks this feature, so we must implement it ourselves.

---

## 6. Architectural Decision: Generic vs Specialized

### 6.1 The Options

**Option A: Generic Only**

```tsx
<form.FieldArray identifier="tags">
    {({ items, push, remove }) => (
        <>
            {items.map((item) => (
                <div key={item.key}>
                    <FieldInputText name={`tags[${item.index}]`} />
                    <button onClick={() => remove(item.index)}>X</button>
                </div>
            ))}
            <button onClick={() => push('')}>Add</button>
        </>
    )}
</form.FieldArray>
```

**Option B: Specialized Only**

```tsx
<FieldInputTagList identifier="tags" />
<FieldInputRepeatingGroup identifier="items" itemComponent={OrderItemFields} />
```

**Option C: Hybrid (Recommended)**

```tsx
// Simple cases: Use specialized
<form.Field identifier="tags">
    <FieldInputTagList />
</form.Field>

// Complex cases: Use generic
<form.FieldArray identifier="items">
    {({ items, push, remove }) => (
        /* Custom rendering with full control */
    )}
</form.FieldArray>
```

### 6.2 Trade-Off Analysis

| Criterion                   | Generic Only      | Specialized Only     | Hybrid                          |
| --------------------------- | ----------------- | -------------------- | ------------------------------- |
| **Flexibility**             | ★★★★★             | ★★☆☆☆                | ★★★★★                           |
| **Simplicity (Easy Cases)** | ★★☆☆☆             | ★★★★★                | ★★★★★                           |
| **Boilerplate**             | High              | Low                  | Low for common, High for custom |
| **Type Safety**             | ★★★★★             | ★★★★☆                | ★★★★★                           |
| **Maintenance**             | Low (1 component) | High (many variants) | Medium                          |
| **GraphQL Integration**     | Requires wrapper  | Direct mapping       | Best of both                    |
| **Learning Curve**          | Steep             | Gentle               | Gradual                         |

### 6.3 Council Consensus: Primitive-Composite Pattern

All four council members agreed:

> Build a robust generic `FieldArray` primitive, then layer specialized composites on top. The specialized components should be thin wrappers that delegate to the primitive.

**Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│  COMPOSITES (User-Facing)                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │FieldInput   │ │FieldInput   │ │FieldArrayGroup         ││
│  │TagList      │ │RepeatingText│ │                         ││
│  └──────┬──────┘ └──────┬──────┘ └────────────┬────────────┘│
│         │               │                      │             │
│         └───────────────┼──────────────────────┘             │
│                         │                                    │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  PRIMITIVE: FieldArray                                   ││
│  │  - Stable ID management                                  ││
│  │  - TanStack Form integration                             ││
│  │  - Array manipulation methods                            ││
│  │  - Validation orchestration                              ││
│  └─────────────────────────────────────────────────────────┘│
│                         │                                    │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  TanStack Form (mode="array")                            ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Component Architecture

### 7.1 The `FieldArray` Primitive

This is the engine room. It's a headless component exposing logic via render props.

**Interface**:

```typescript
interface FieldArrayItem {
    key: string; // Stable React key (UUID)
    index: number; // Current position in array
}

interface FieldArrayRenderProps<TItem> {
    // The items to render
    items: FieldArrayItem[];

    // Array manipulation
    push: (value: TItem) => void;
    insert: (index: number, value: TItem) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
    swap: (indexA: number, indexB: number) => void;
    replace: (index: number, value: TItem) => void;
    clear: () => void;

    // State
    field: FieldApi<TItem[]>;
    isEmpty: boolean;
    length: number;
}

interface FieldArrayProps<TItem> {
    identifier: string;
    children: (props: FieldArrayRenderProps<TItem>) => React.ReactNode;
}
```

**Usage**:

```tsx
<form.FieldArray identifier="items">
    {({ items, push, remove }) => (
        <>
            {items.map((row) => (
                <Card key={row.key}>
                    <form.Field identifier={`items[${row.index}].productId`}>
                        <FieldInputSelect options={products} />
                    </form.Field>
                    <form.Field identifier={`items[${row.index}].quantity`}>
                        <FieldInputNumber />
                    </form.Field>
                    <Button onClick={() => remove(row.index)}>Remove</Button>
                </Card>
            ))}
            <Button onClick={() => push({ productId: '', quantity: 1 })}>Add Item</Button>
        </>
    )}
</form.FieldArray>
```

### 7.2 `FieldInputTagList` (Scalar Arrays)

A chip/tag input for `string[]` fields.

**Interface**:

```typescript
interface FieldInputTagListProps {
    placeholder?: string;
    allowDuplicates?: boolean;
    maxTags?: number;
    separator?: string | RegExp; // Default: Enter key
    suggestions?: string[];
    validateTag?: (tag: string) => boolean | string;
    renderTag?: (tag: string, onRemove: () => void) => React.ReactNode;
}
```

**Usage**:

```tsx
<form.Field identifier="tags">
    <form.FieldLabel>Tags</form.FieldLabel>
    <FieldInputTagList
        placeholder="Add tag..."
        allowDuplicates={false}
        maxTags={10}
        suggestions={['react', 'vue', 'angular']}
    />
</form.Field>
```

**Internal Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│ FieldInputTagList                                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Tag Display Area                                        ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                   ││
│  │  │ react ✕ │ │ vue ✕   │ │ angular✕│                   ││
│  │  └─────────┘ └─────────┘ └─────────┘                   ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Staging Input (NOT in form store)                       ││
│  │  [Type here and press Enter...                        ] ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  State Flow:                                                │
│  1. User types in staging input (local state)              │
│  2. User presses Enter                                      │
│  3. Validate tag against item schema                        │
│  4. If valid: field.pushValue(tag), clear staging input    │
│  5. If invalid: show error on staging input                │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 `FieldInputRepeatingText` (Scalar Arrays as Stacked Inputs)

For when you want a visible text input per item.

**Interface**:

```typescript
interface FieldInputRepeatingTextProps {
    placeholder?: string;
    maxItems?: number;
    minItems?: number;
    addButtonText?: string;
    showRemoveButton?: boolean;
}
```

**Usage**:

```tsx
<form.Field identifier="aliases">
    <form.FieldLabel>Aliases</form.FieldLabel>
    <FieldInputRepeatingText placeholder="Enter alias..." maxItems={5} addButtonText="Add Alias" />
</form.Field>
```

**Rendered Output**:

```
Aliases
┌─────────────────────────────────────────────────────────┐
│ [Primary alias                                      ] ✕ │
├─────────────────────────────────────────────────────────┤
│ [Secondary alias                                    ] ✕ │
├─────────────────────────────────────────────────────────┤
│ [Another alias                                      ] ✕ │
└─────────────────────────────────────────────────────────┘
                                        [+ Add Alias]
```

### 7.4 `FieldArrayGroup` (Object Arrays)

For arrays of complex objects with multiple fields per item.

**Interface**:

```typescript
interface FieldArrayGroupProps<TItem> {
    identifier: string;
    createDefaultItem: () => TItem;
    mode?: 'card' | 'accordion' | 'table' | 'list';
    addButtonText?: string;
    emptyMessage?: string;
    maxItems?: number;
    children: (context: FieldArrayGroupItemContext) => React.ReactNode;
}

interface FieldArrayGroupItemContext {
    index: number;
    isFirst: boolean;
    isLast: boolean;
    remove: () => void;
    moveUp: () => void;
    moveDown: () => void;
    // Helper to construct field paths
    field: (name: string) => string; // e.g., field('quantity') → 'items[2].quantity'
}
```

**Usage**:

```tsx
<FieldArrayGroup<OrderItem>
    identifier="items"
    createDefaultItem={() => ({ productId: '', quantity: 1, notes: '' })}
    mode="card"
    addButtonText="Add Item"
>
    {({ index, remove, field }) => (
        <Card>
            <CardHeader>
                <span>Item {index + 1}</span>
                <Button onClick={remove} icon={TrashIcon} />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <form.Field identifier={field('productId')}>
                    <form.FieldLabel>Product</form.FieldLabel>
                    <FieldInputSelect options={products} />
                </form.Field>
                <form.Field identifier={field('quantity')}>
                    <form.FieldLabel>Quantity</form.FieldLabel>
                    <FieldInputNumber min={1} />
                </form.Field>
                <form.Field identifier={field('notes')} className="col-span-2">
                    <form.FieldLabel>Notes</form.FieldLabel>
                    <FieldInputTextArea rows={2} />
                </form.Field>
            </CardContent>
        </Card>
    )}
</FieldArrayGroup>
```

### 7.5 Component Hierarchy Summary

```
form.FieldArray (Primitive - Render Prop)
│
├── FieldInputTagList (Composite - Chip UI)
│   └── Uses FieldArray internally for scalar string arrays
│
├── FieldInputRepeatingText (Composite - Stacked Inputs)
│   └── Uses FieldArray internally for scalar string arrays
│
├── FieldArrayGroup (Composite - Card/Accordion)
│   └── Uses FieldArray internally for object arrays
│
└── SortableFieldArrayGroup (Composite - DnD Wrapper)
    └── Wraps FieldArrayGroup with dnd-kit
```

---

## 8. Schema and Validation Design

### 8.1 Current ArraySchema Capabilities

```typescript
// Current (limited)
schema.array(schema.string()).minimumLength(1).maximumLength(10).notEmpty();
```

### 8.2 Proposed Extensions

```typescript
// Extended API
schema
    .array(schema.string())
    .minimumLength(1)
    .maximumLength(10)
    .unique() // No duplicates
    .unique((a, b) => a.toLowerCase() === b.toLowerCase()) // Custom comparator
    .refineArray((items, context) => {
        // Array-level validation
        const total = items.reduce((sum, i) => sum + i.quantity, 0);
        if(total > 100) {
            return { path: 'items', message: 'Total quantity cannot exceed 100' };
        }
    })
    .refineItems((item, context) => {
        // Per-item validation with context
        if(item.quantity > 10 && !item.notes) {
            return {
                path: `items[${context.index}].notes`,
                message: 'Notes required for bulk orders',
            };
        }
    });
```

### 8.3 Validation Timing Strategy

| Validation Type                     | Trigger                          | Rationale                        |
| ----------------------------------- | -------------------------------- | -------------------------------- |
| **Item Field** (e.g., email format) | `onBlur` of the field            | Standard field behavior          |
| **Array Length** (min/max)          | `onChange` of array structure    | Immediate feedback on add/remove |
| **Uniqueness**                      | `onBlur` of array container      | Avoid O(n) on every keystroke    |
| **Cross-Item** (e.g., total sum)    | `onBlur` or debounced `onChange` | Balance feedback vs. performance |
| **Async** (e.g., all IDs exist)     | `onBlur` or `onSubmit`           | Batch network requests           |

### 8.4 Error Path Structure

Validation errors must include paths for proper routing:

```typescript
interface ValidationError {
    path: string; // e.g., 'items', 'items[2]', 'items[2].quantity'
    identifier: string; // e.g., 'required', 'tooFewItems', 'duplicate'
    message: string; // Human-readable message
}

// Example error set from array validation:
const errors = [
    { path: 'items', identifier: 'tooFewItems', message: 'At least 2 items required' },
    { path: 'items[0]', identifier: 'duplicate', message: 'Duplicate item' },
    { path: 'items[2]', identifier: 'duplicate', message: 'Duplicate item' },
    { path: 'items[1].quantity', identifier: 'maximum', message: 'Maximum 99' },
];
```

### 8.5 Propagating Errors to UI

The `FieldArray` component must parse error paths and distribute them:

```tsx
function FieldArray({ identifier, children }) {
    const field = useFieldContext();

    // Parse errors into a map by index
    const errorsByIndex = React.useMemo(() => {
        const map: Record<number, string[]> = {};
        for(const error of field.state.meta.errors ?? []) {
            // Parse paths like "items[2].quantity" or "items[2]"
            const match = error.path?.match(/\[(\d+)\]/);
            if(match) {
                const index = parseInt(match[1], 10);
                map[index] = map[index] ?? [];
                map[index].push(error.message);
            }
        }
        return map;
    }, [field.state.meta.errors]);

    // Pass to render prop
    return children({ items, errorsByIndex /* ... */ });
}
```

---

## 9. GraphQL Integration

### 9.1 Current Problem

The `GraphQlFieldMetadata` type doesn't distinguish:

-   Scalar vs. array
-   Array of scalars vs. array of objects
-   What UI component to use for each

```typescript
// Current metadata (insufficient)
interface GraphQlFieldMetadata {
    name: string; // 'topicIds'
    type: string; // 'String' (loses array info!)
    kind: string; // 'scalar'
    required: boolean;
    validation?: object; // Has 'isArray' buried here
}
```

### 9.2 Extended Metadata Structure

```typescript
// Proposed metadata
interface GraphQlFieldMetadata {
    name: string;
    path: string; // 'input.topicIds'

    // Type information
    baseType: 'String' | 'Int' | 'Float' | 'Boolean' | 'ID' | string;
    isArray: boolean; // NEW
    isNonNull: boolean;

    // For arrays of objects
    isInputObject: boolean; // NEW
    inputObjectName?: string; // NEW - e.g., 'OrderItemInput'
    inputObjectFields?: GraphQlFieldMetadata[]; // NEW - nested fields

    // Existing
    isEnum: boolean;
    enumValues?: string[];
    validation?: GraphQlValidation;
}
```

### 9.3 Detection Algorithm

In `GraphQlFieldMetadataExtraction.tsx`:

```typescript
function extractFieldMetadata(field: GraphQLField): GraphQlFieldMetadata {
    let type = field.type;
    let isArray = false;
    let isNonNull = false;

    // Unwrap NON_NULL
    if(type.kind === 'NON_NULL') {
        isNonNull = true;
        type = type.ofType;
    }

    // Detect LIST
    if(type.kind === 'LIST') {
        isArray = true;
        type = type.ofType;

        // Unwrap inner NON_NULL
        if(type.kind === 'NON_NULL') {
            type = type.ofType;
        }
    }

    // Detect INPUT_OBJECT
    const isInputObject = type.kind === 'INPUT_OBJECT';

    return {
        name: field.name,
        baseType: type.name,
        isArray,
        isNonNull,
        isInputObject,
        inputObjectName: isInputObject ? type.name : undefined,
        // ... rest
    };
}
```

### 9.4 Component Mapping Heuristics

In `GraphQlFormFieldMapping.tsx`:

```typescript
function componentFromFieldMetadata(field: GraphQlFieldMetadata): React.ComponentType {
    // Non-array fields (existing logic)
    if(!field.isArray) {
        return existingScalarMapping(field);
    }

    // Array of input objects → FieldArrayGroup
    if(field.isInputObject) {
        return createFieldArrayGroupWrapper(field);
    }

    // Array of scalars - use heuristics

    // IDs with reference semantics → Multi-select
    if(field.baseType === 'ID' || field.name.endsWith('Ids')) {
        return FieldInputMultiSelect;
    }

    // Enums or constrained values → Multi-select
    if(field.isEnum || field.validation?.isIn) {
        return FieldInputMultiSelect;
    }

    // String arrays with "tag" naming → Tag list
    if(field.baseType === 'String' && /tags?|keywords?|labels?|aliases?/i.test(field.name)) {
        return FieldInputTagList;
    }

    // Default string array → Tag list (most common case)
    if(field.baseType === 'String') {
        return FieldInputTagList;
    }

    // Numeric arrays → Repeating number inputs
    if(field.baseType === 'Int' || field.baseType === 'Float') {
        return FieldInputRepeatingNumber;
    }

    // Fallback
    return FieldInputRepeatingText;
}
```

### 9.5 Default Value Normalization

**Critical Fix**: Array fields must initialize to `[]`, never `null` or `undefined`:

```typescript
function normalizeDefaultValues(
    fields: GraphQlFieldMetadata[],
    data: Record<string, unknown>,
): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for(const field of fields) {
        const value = data[field.path];

        if(field.isArray) {
            // ALWAYS default to empty array
            normalized[field.path] = Array.isArray(value) ? value : [];
        }
        else {
            normalized[field.path] = value ?? null;
        }
    }

    return normalized;
}
```

This eliminates the `topicIds` hack.

### 9.6 Override System

Allow explicit component overrides in `GraphQlMutationForm`:

```tsx
<GraphQlMutationForm
    operation={PostCreateOperation}
    defaultValues={
        {
            /* ... */
        }
    }
    fieldComponents={{
        'input.topicIds': FieldInputTopicSelect, // Custom component
        'input.tags': {
            component: FieldInputTagList,
            props: { maxTags: 5, suggestions: tagSuggestions },
        },
    }}
    hiddenFields={
        {
            /* ... */
        }
    }
/>
```

---

## 10. Performance at Scale

### 10.1 The 100+ Items Problem

TanStack Form has documented performance issues with large arrays:

-   Each sub-field subscribes to the store
-   Validation can trigger O(n²) updates
-   React reconciliation for 100+ items is expensive
-   No built-in virtualization

### 10.2 Optimization Strategies

#### Strategy 1: Length-Only Parent Subscription

```tsx
function FieldArray({ identifier, children }) {
    const form = useFormContext();

    // GOOD: Only re-render when length changes
    const length = form.useStore((state) => state.values[identifier]?.length ?? 0);

    // NOT: const value = form.useStore(state => state.values[identifier]);

    const items = Array.from({ length }, (_, index) => ({
        key: ids[index],
        index,
    }));

    return children({ items /* ... */ });
}
```

#### Strategy 2: Isolated Item Components

```tsx
// Each item is its own component with its own subscription
function FieldArrayItem({ index, itemKey }) {
    // This component only re-renders when THIS item changes
    const field = useFieldContext();
    const itemValue = useStore(field.store, (state) => state.value?.[index]);

    return <Card key={itemKey}>{/* ... */}</Card>;
}
```

#### Strategy 3: Virtualization

Using `@tanstack/react-virtual`:

```tsx
function VirtualizedFieldArrayGroup({ identifier, children, itemHeight = 100 }) {
    const parentRef = React.useRef<HTMLDivElement>(null);
    const { items } = useFieldArrayContext();

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => itemHeight,
        overscan: 5,
    });

    return (
        <div ref={parentRef} className="h-[400px] overflow-auto">
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const item = items[virtualRow.index];
                    return (
                        <div
                            key={item.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {children({ index: virtualRow.index /* ... */ })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
```

#### Strategy 4: Mode-Based Rendering

```tsx
interface FieldArrayGroupProps {
    mode?: 'inline' | 'collapsed' | 'virtualized';
    // ...
}

// inline (default): Full render of all items - good for < 20 items
// collapsed: Show summary, expand on click - good for 20-100 items
// virtualized: Only render visible items - required for 100+ items
```

### 10.3 Validation Performance

For large arrays, avoid `validateAllFields`:

```typescript
// BAD: O(n²) for nested forms
await form.validateAllFields();

// GOOD: Validate specific fields
await form.validateField('items'); // Array-level only
await form.validateField('items[5].quantity'); // Specific item
```

---

## 11. Accessibility Requirements

### 11.1 ARIA Roles and Structure

```html
<!-- Container -->
<div role="list" aria-label="Order items">
    <!-- Each item -->
    <div role="listitem" aria-label="Item 1 of 3">
        <!-- Fields inside -->
        <label for="items-0-product">Product</label>
        <select id="items-0-product" aria-describedby="items-0-product-error">
            ...
        </select>
        <span id="items-0-product-error" role="alert">Required</span>

        <!-- Remove button -->
        <button type="button" aria-label="Remove item 1" aria-describedby="items-0-summary">Remove</button>
    </div>
</div>

<!-- Add button -->
<button type="button" aria-label="Add new item">Add Item</button>

<!-- Live region for announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
    <!-- Dynamic announcements inserted here -->
</div>
```

### 11.2 Live Region Announcements

```tsx
function FieldArray({ identifier, children }) {
    const [announcement, setAnnouncement] = React.useState('');

    const push = (value) => {
        field.pushValue(value);
        setAnnouncement(`Item added. ${items.length + 1} items total.`);
    };

    const remove = (index) => {
        field.removeValue(index);
        setAnnouncement(`Item ${index + 1} removed. ${items.length - 1} items remaining.`);
    };

    const move = (from, to) => {
        field.moveValue(from, to);
        setAnnouncement(`Item moved from position ${from + 1} to position ${to + 1}.`);
    };

    return (
        <>
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </div>
            {children({ items, push, remove, move })}
        </>
    );
}
```

### 11.3 Focus Management

```tsx
function FieldArrayGroup({ children }) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const addButtonRef = React.useRef<HTMLButtonElement>(null);

    const remove = (index: number) => {
        field.removeValue(index);

        // Focus recovery after removal
        requestAnimationFrame(() => {
            const container = containerRef.current;
            if(!container) return;

            const items = container.querySelectorAll('[role="listitem"]');

            if(items.length === 0) {
                // List is empty, focus add button
                addButtonRef.current?.focus();
            }
            else if(index < items.length) {
                // Focus the item that took this index
                const nextItem = items[index];
                const firstFocusable = nextItem.querySelector('input, select, button');
                (firstFocusable as HTMLElement)?.focus();
            }
            else {
                // Removed last item, focus new last item
                const lastItem = items[items.length - 1];
                const firstFocusable = lastItem.querySelector('input, select, button');
                (firstFocusable as HTMLElement)?.focus();
            }
        });
    };

    const push = (value) => {
        field.pushValue(value);

        // Focus first field of new item
        requestAnimationFrame(() => {
            const container = containerRef.current;
            const items = container?.querySelectorAll('[role="listitem"]');
            const newItem = items?.[items.length - 1];
            const firstFocusable = newItem?.querySelector('input, select');
            (firstFocusable as HTMLElement)?.focus();
        });
    };

    return (
        <div ref={containerRef} role="list">
            {/* items */}
            <button ref={addButtonRef}>Add Item</button>
        </div>
    );
}
```

### 11.4 Keyboard Navigation

| Key             | Context           | Action                             |
| --------------- | ----------------- | ---------------------------------- |
| `Tab`           | Any               | Move to next focusable element     |
| `Shift+Tab`     | Any               | Move to previous focusable element |
| `Enter`         | Tag input         | Add tag                            |
| `Backspace`     | Tag input (empty) | Remove last tag                    |
| `Delete`        | Focused on chip   | Remove chip                        |
| `Arrow Up/Down` | Reorder buttons   | Move item up/down                  |

---

## 12. Drag-and-Drop Reordering

### 12.1 Library Choice: dnd-kit

**Why dnd-kit**:

-   Modern React hooks-based API
-   Excellent accessibility (keyboard DnD built-in)
-   Modular (only import what you need)
-   Good TypeScript support
-   Active maintenance

### 12.2 Architecture: Wrapper Component

DnD is implemented as a wrapper, not baked into the core:

```
┌─────────────────────────────────────────────────────────────┐
│  SortableFieldArrayGroup                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  DndContext (from dnd-kit)                              ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  SortableContext                                    │││
│  │  │  ┌─────────────────────────────────────────────────┐│││
│  │  │  │  FieldArrayGroup (regular component)            ││││
│  │  │  │  ┌─────────────────────────────────────────────┐││││
│  │  │  │  │  SortableItem wrappers                      │││││
│  │  │  │  │  ┌───────────────────────────────────────┐  │││││
│  │  │  │  │  │  Your item content                    │  │││││
│  │  │  │  │  └───────────────────────────────────────┘  │││││
│  │  │  │  └─────────────────────────────────────────────┘││││
│  │  │  └─────────────────────────────────────────────────┘│││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 12.3 Implementation

```tsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

function SortableFieldArrayGroup<TItem>(props: FieldArrayGroupProps<TItem>) {
    return (
        <FieldArrayGroup {...props}>
            {(context) => <SortableFieldArrayGroupInner {...props} context={context} />}
        </FieldArrayGroup>
    );
}

function SortableFieldArrayGroupInner({ context, children }) {
    const { items, move } = context;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if(active.id !== over?.id) {
            const oldIndex = items.findIndex((x) => x.key === active.id);
            const newIndex = items.findIndex((x) => x.key === over.id);

            // This calls both field.moveValue AND updates the ID array
            move(oldIndex, newIndex);
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem key={item.key} id={item.key}>
                        {children({ index: item.index /* ... */ })}
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
}

function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {/* Drag handle - only this is draggable, not the whole row */}
            <button {...listeners} aria-label="Drag to reorder">
                <GripVerticalIcon />
            </button>
            {children}
        </div>
    );
}
```

### 12.4 Drag Handle Requirement

**Critical**: The entire row should NOT be draggable. Only a drag handle should initiate drag operations. This prevents conflicts with text selection in form inputs.

```tsx
// BAD: Entire row is draggable - can't select text in inputs
<div {...listeners}>
    <input value={...} />  {/* Can't select text! */}
</div>

// GOOD: Only handle is draggable
<div>
    <button {...listeners}><GripIcon /></button>
    <input value={...} />  {/* Text selection works */}
</div>
```

---

## 13. Advanced Features

### 13.1 Template-Based Item Creation

Allow adding items from predefined templates:

```tsx
interface Template<TItem> {
    label: string;
    description?: string;
    value: TItem;
    icon?: React.ComponentType;
}

interface FieldArrayGroupProps<TItem> {
    // ...existing props
    templates?: Template<TItem>[];
}
```

**Usage**:

```tsx
<FieldArrayGroup<OrderItem>
    identifier="items"
    createDefaultItem={() => ({ productId: '', quantity: 1, notes: '' })}
    templates={[
        {
            label: 'Single Item',
            value: { productId: '', quantity: 1, notes: '' },
        },
        {
            label: 'Bulk Order',
            value: { productId: '', quantity: 100, notes: 'Bulk pricing applies' },
        },
        {
            label: 'Sample',
            value: { productId: '', quantity: 1, notes: 'Sample - no charge' },
        },
    ]}
>
    {/* ... */}
</FieldArrayGroup>
```

**Rendered UI**:

```
┌─────────────────────────────────────────────────────────────┐
│ [Add Item ▼]                                                │
├─────────────────────────────────────────────────────────────┤
│  ○ Single Item                                              │
│  ○ Bulk Order                                               │
│  ○ Sample                                                   │
└─────────────────────────────────────────────────────────────┘
```

### 13.2 Bulk Operations

```tsx
interface FieldArrayGroupProps<TItem> {
    // ...existing props
    allowBulkDelete?: boolean;
    allowSelectAll?: boolean;
}

// Exposes additional methods in context:
interface FieldArrayGroupContext<TItem> {
    // ...existing
    selectedIndices: number[];
    toggleSelection: (index: number) => void;
    selectAll: () => void;
    clearSelection: () => void;
    removeSelected: () => void;
}
```

### 13.3 Copy/Duplicate Item

```tsx
interface FieldArrayGroupContext<TItem> {
    // ...existing
    duplicate: (index: number) => void;
}

// Usage
<Button onClick={() => duplicate(index)}>
    <CopyIcon /> Duplicate
</Button>;
```

### 13.4 Collapse/Expand Items

For large object arrays, show collapsed summaries:

```tsx
interface FieldArrayGroupProps<TItem> {
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    renderSummary?: (item: TItem, index: number) => React.ReactNode;
}

// Usage
<FieldArrayGroup
    identifier="items"
    collapsible
    defaultCollapsed
    renderSummary={(item, index) => (
        <span>
            {item.productName} × {item.quantity}
        </span>
    )}
>
    {/* Full edit form shown when expanded */}
</FieldArrayGroup>;
```

---

## 14. Implementation Plan

### Phase 1: Foundation (Week 1)

**Goal**: Ship the `FieldArray` primitive with stable ID management

**Tasks**:

1. Create `libraries/structure/source/components/forms-new/arrays/` directory
2. Implement `useStableIds` hook (parallel UUID array)
3. Implement `FieldArray` component with render props
4. Implement `FieldArrayContext` and `useFieldArrayContext`
5. Unit tests for:
    - Key stability during add/remove/move/swap
    - Synchronization with TanStack Form store
    - Edge cases (empty array, single item, rapid operations)

**Deliverables**:

-   `FieldArray.tsx`
-   `useStableIds.ts`
-   `FieldArrayContext.tsx`
-   Test suite

### Phase 2: Scalar Components (Week 2)

**Goal**: Ship `FieldInputTagList` and `FieldInputRepeatingText`

**Tasks**:

1. Implement `FieldInputTagList` with:
    - Chip rendering
    - Staging input pattern
    - Enter/comma to add
    - Backspace to remove
    - Duplicate prevention
    - Max items limit
2. Implement `FieldInputRepeatingText` with:
    - Stacked text inputs
    - Add/remove buttons
    - Min/max items
3. Integration tests with form submission

**Deliverables**:

-   `FieldInputTagList.tsx`
-   `FieldInputRepeatingText.tsx`
-   Storybook stories
-   Test suite

### Phase 3: Object Array Components (Week 3)

**Goal**: Ship `FieldArrayGroup`

**Tasks**:

1. Implement `FieldArrayGroup` with:
    - Render prop for item content
    - `field()` helper for path construction
    - Card/accordion/list modes
    - Add button with default item
2. Implement path helper (`field('quantity')` → `items[2].quantity`)
3. Error propagation from array to items
4. Integration with existing `form.Field` pattern

**Deliverables**:

-   `FieldArrayGroup.tsx`
-   Storybook stories demonstrating all modes
-   Test suite

### Phase 4: GraphQL Integration (Week 4)

**Goal**: Remove `topicIds` hack, enable auto-generation for arrays

**Tasks**:

1. Extend `GraphQlFieldMetadata` with `isArray`, `isInputObject`
2. Update `GraphQlFieldMetadataExtraction.tsx` to detect arrays
3. Update `GraphQlFormSchemaGeneration.tsx` for array schemas
4. Update `GraphQlFormFieldMapping.tsx` with component heuristics
5. Implement default value normalization (`[]` not `null`)
6. Add override system for custom components
7. **Delete the `topicIds` hack**

**Deliverables**:

-   Updated GraphQL form utilities
-   Working `GraphQlMutationForm` with array fields
-   Migration guide for existing forms

### Phase 5: Schema Extensions (Week 5)

**Goal**: Extended validation capabilities

**Tasks**:

1. Add `.unique()` to `ArraySchema`
2. Add `.refineArray()` for array-level validation
3. Add `.refineItems()` for per-item validation with context
4. Update error path parsing in `FieldArray`
5. Document validation timing recommendations

**Deliverables**:

-   Extended `ArraySchema.ts`
-   Updated `FieldArray` error handling
-   Validation documentation

### Phase 6: Performance & Advanced (Week 6)

**Goal**: Virtualization and drag-and-drop

**Tasks**:

1. Install `@tanstack/react-virtual` and `@dnd-kit/core`
2. Implement `VirtualizedFieldArrayGroup` mode
3. Implement `SortableFieldArrayGroup` wrapper
4. Performance testing with 100+ items
5. Accessibility audit (NVDA/VoiceOver testing)

**Deliverables**:

-   Virtualization support
-   Drag-and-drop support
-   Performance benchmarks
-   Accessibility report

### Phase 7: Polish & Documentation (Week 7)

**Goal**: Production-ready release

**Tasks**:

1. Comprehensive Storybook documentation
2. API reference documentation
3. Migration guide for existing forms
4. Edge case handling (empty states, loading, errors)
5. Template and bulk operation features

**Deliverables**:

-   Complete documentation
-   All features implemented
-   Production deployment

---

## 15. API Reference

### 15.1 `FieldArray<TItem>`

The primitive component for array field management.

```typescript
interface FieldArrayProps<TItem> {
    /** Field identifier in the form schema */
    identifier: string;

    /** Render prop receiving array manipulation helpers */
    children: (props: FieldArrayRenderProps<TItem>) => React.ReactNode;
}

interface FieldArrayRenderProps<TItem> {
    /** Array items with stable keys */
    items: Array<{ key: string; index: number }>;

    /** Add item to end of array */
    push: (value: TItem) => void;

    /** Insert item at specific index */
    insert: (index: number, value: TItem) => void;

    /** Remove item at index */
    remove: (index: number) => void;

    /** Move item from one index to another */
    move: (from: number, to: number) => void;

    /** Swap two items */
    swap: (indexA: number, indexB: number) => void;

    /** Replace item at index */
    replace: (index: number, value: TItem) => void;

    /** Remove all items */
    clear: () => void;

    /** Whether array is empty */
    isEmpty: boolean;

    /** Number of items */
    length: number;

    /** Underlying TanStack field API */
    field: FieldApi<TItem[]>;

    /** Errors mapped by item index */
    errorsByIndex: Record<number, string[]>;
}
```

### 15.2 `FieldInputTagList`

Chip-based input for string arrays.

```typescript
interface FieldInputTagListProps {
    /** Placeholder text for input */
    placeholder?: string;

    /** Allow duplicate values (default: false) */
    allowDuplicates?: boolean;

    /** Maximum number of tags */
    maxTags?: number;

    /** Characters that trigger tag creation (default: Enter) */
    separators?: string[];

    /** Autocomplete suggestions */
    suggestions?: string[];

    /** Custom tag validation */
    validateTag?: (tag: string) => boolean | string;

    /** Custom tag rendering */
    renderTag?: (tag: string, onRemove: () => void) => React.ReactNode;

    /** Size variant */
    size?: 'small' | 'medium' | 'large';

    /** Disabled state */
    disabled?: boolean;
}
```

### 15.3 `FieldInputRepeatingText`

Stacked text inputs for string arrays.

```typescript
interface FieldInputRepeatingTextProps {
    /** Placeholder for each input */
    placeholder?: string;

    /** Minimum number of items */
    minItems?: number;

    /** Maximum number of items */
    maxItems?: number;

    /** Text for add button */
    addButtonText?: string;

    /** Show remove button on each item (default: true) */
    showRemoveButton?: boolean;

    /** Input type (default: 'text') */
    type?: 'text' | 'email' | 'url' | 'tel';
}
```

### 15.4 `FieldArrayGroup<TItem>`

Card-based groups for object arrays.

```typescript
interface FieldArrayGroupProps<TItem> {
    /** Field identifier in the form schema */
    identifier: string;

    /** Factory function for new items */
    createDefaultItem: () => TItem;

    /** Visual mode */
    mode?: 'card' | 'accordion' | 'table' | 'list';

    /** Performance mode for large arrays */
    performanceMode?: 'inline' | 'collapsed' | 'virtualized';

    /** Text for add button */
    addButtonText?: string;

    /** Message when array is empty */
    emptyMessage?: string;

    /** Maximum number of items */
    maxItems?: number;

    /** Minimum number of items */
    minItems?: number;

    /** Enable collapsible items */
    collapsible?: boolean;

    /** Summary renderer for collapsed items */
    renderSummary?: (item: TItem, index: number) => React.ReactNode;

    /** Item templates for quick add */
    templates?: Array<{
        label: string;
        description?: string;
        value: TItem;
        icon?: React.ComponentType;
    }>;

    /** Render prop for item content */
    children: (context: FieldArrayGroupItemContext) => React.ReactNode;
}

interface FieldArrayGroupItemContext {
    /** Current index in array */
    index: number;

    /** Whether this is the first item */
    isFirst: boolean;

    /** Whether this is the last item */
    isLast: boolean;

    /** Remove this item */
    remove: () => void;

    /** Move this item up */
    moveUp: () => void;

    /** Move this item down */
    moveDown: () => void;

    /** Duplicate this item */
    duplicate: () => void;

    /** Path helper: field('name') → 'items[2].name' */
    field: (name: string) => string;

    /** Whether item is collapsed (if collapsible enabled) */
    isCollapsed: boolean;

    /** Toggle collapsed state */
    toggleCollapsed: () => void;

    /** Errors for this specific item */
    errors: string[];
}
```

### 15.5 `SortableFieldArrayGroup<TItem>`

Drag-and-drop wrapper for `FieldArrayGroup`.

```typescript
interface SortableFieldArrayGroupProps<TItem> extends FieldArrayGroupProps<TItem> {
    /** Position of drag handle */
    handlePosition?: 'left' | 'right';

    /** Custom drag handle component */
    renderHandle?: () => React.ReactNode;

    /** Callback when item is being dragged */
    onDragStart?: (index: number) => void;

    /** Callback when item is dropped */
    onDragEnd?: (from: number, to: number) => void;
}
```

---

## 16. Appendix: Code Artifacts

### 16.1 `useStableIds` Hook

```typescript
// libraries/structure/source/components/forms-new/arrays/useStableIds.ts

import React from 'react';

/**
 * Maintains a parallel array of stable UUIDs for React keys.
 * Synchronized with array manipulation operations.
 */
export function useStableIds(initialLength: number = 0) {
    const [ids, setIds] = React.useState<string[]>(() =>
        Array.from({ length: initialLength }, () => crypto.randomUUID()),
    );

    // Sync length if external changes occur
    const syncLength = React.useCallback((newLength: number) => {
        setIds((prev) => {
            if(newLength === prev.length) return prev;

            if(newLength > prev.length) {
                // Items were added externally
                const additional = Array.from({ length: newLength - prev.length }, () => crypto.randomUUID());
                return [...prev, ...additional];
            }
            else {
                // Items were removed externally (truncate)
                return prev.slice(0, newLength);
            }
        });
    }, []);

    const push = React.useCallback(() => {
        const newId = crypto.randomUUID();
        setIds((prev) => [...prev, newId]);
        return newId;
    }, []);

    const insert = React.useCallback((index: number) => {
        const newId = crypto.randomUUID();
        setIds((prev) => [...prev.slice(0, index), newId, ...prev.slice(index)]);
        return newId;
    }, []);

    const remove = React.useCallback((index: number) => {
        setIds((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const move = React.useCallback((from: number, to: number) => {
        setIds((prev) => {
            const result = [...prev];
            const [removed] = result.splice(from, 1);
            result.splice(to, 0, removed);
            return result;
        });
    }, []);

    const swap = React.useCallback((indexA: number, indexB: number) => {
        setIds((prev) => {
            const result = [...prev];
            [result[indexA], result[indexB]] = [result[indexB], result[indexA]];
            return result;
        });
    }, []);

    const clear = React.useCallback(() => {
        setIds([]);
    }, []);

    return {
        ids,
        syncLength,
        push,
        insert,
        remove,
        move,
        swap,
        clear,
    };
}
```

### 16.2 `FieldArray` Component (Simplified)

```typescript
// libraries/structure/source/components/forms-new/arrays/FieldArray.tsx

'use client';

import React from 'react';
import { useFieldContext, useStore } from '../useForm';
import { useStableIds } from './useStableIds';

export interface FieldArrayItem {
    key: string;
    index: number;
}

export interface FieldArrayRenderProps<TItem> {
    items: FieldArrayItem[];
    push: (value: TItem) => void;
    insert: (index: number, value: TItem) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
    swap: (indexA: number, indexB: number) => void;
    replace: (index: number, value: TItem) => void;
    clear: () => void;
    isEmpty: boolean;
    length: number;
}

export interface FieldArrayProps<TItem> {
    identifier: string;
    children: (props: FieldArrayRenderProps<TItem>) => React.ReactNode;
}

export function FieldArray<TItem>(properties: FieldArrayProps<TItem>) {
    const field = useFieldContext<TItem[]>();

    // Subscribe to length only for performance
    const length = useStore(field.store, function(state) {
        return Array.isArray(state.value) ? state.value.length : 0;
    });

    // Manage stable IDs
    const stableIds = useStableIds(length);

    // Sync if length changed externally
    React.useEffect(function() {
        stableIds.syncLength(length);
    }, [length, stableIds]);

    // Build items array with stable keys
    const items: FieldArrayItem[] = React.useMemo(function() {
        return stableIds.ids.map(function(id, index) {
            return { key: id, index };
        });
    }, [stableIds.ids]);

    // Wrapped operations that sync both form and IDs
    const push = React.useCallback(function(value: TItem) {
        stableIds.push();
        field.pushValue(value);
    }, [field, stableIds]);

    const insert = React.useCallback(function(index: number, value: TItem) {
        stableIds.insert(index);
        field.insertValue(index, value);
    }, [field, stableIds]);

    const remove = React.useCallback(function(index: number) {
        stableIds.remove(index);
        field.removeValue(index);
    }, [field, stableIds]);

    const move = React.useCallback(function(from: number, to: number) {
        stableIds.move(from, to);
        field.moveValue(from, to);
    }, [field, stableIds]);

    const swap = React.useCallback(function(indexA: number, indexB: number) {
        stableIds.swap(indexA, indexB);
        field.swapValues(indexA, indexB);
    }, [field, stableIds]);

    const replace = React.useCallback(function(index: number, value: TItem) {
        field.replaceValue(index, value);
    }, [field]);

    const clear = React.useCallback(function() {
        stableIds.clear();
        // TanStack doesn't have clearValues, so we remove all
        const currentLength = field.state.value?.length ?? 0;
        for (let i = currentLength - 1; i >= 0; i--) {
            field.removeValue(i);
        }
    }, [field, stableIds]);

    // Render props
    const renderProps: FieldArrayRenderProps<TItem> = {
        items,
        push,
        insert,
        remove,
        move,
        swap,
        replace,
        clear,
        isEmpty: length === 0,
        length,
    };

    return <>{properties.children(renderProps)}</>;
}
```

### 16.3 Updated GraphQL Metadata Types

```typescript
// libraries/structure/source/api/graphql/forms/utilities/GraphQlFieldMetadataExtraction.tsx

export interface GraphQlFieldMetadata {
    // Identity
    name: string;
    path: string; // Dotted path: 'input.items'

    // Type information
    baseType: 'String' | 'Int' | 'Float' | 'Boolean' | 'ID' | string;
    kind: 'scalar' | 'enum' | 'object';
    required: boolean;

    // Array handling (NEW)
    isArray: boolean;

    // For arrays of objects (NEW)
    isInputObject: boolean;
    inputObjectName?: string;
    inputObjectFields?: GraphQlFieldMetadata[];

    // Enum handling
    isEnum: boolean;
    enumValues?: string[];

    // Validation rules
    validation?: GraphQlValidation;
}
```

### 16.4 Extended ArraySchema

```typescript
// libraries/structure/source/utilities/schema/schemas/ArraySchema.ts

// Add these methods to the existing ArraySchema class:

/**
 * Validates that all items are unique.
 * @param comparator Optional custom comparison function
 * @param message Custom error message
 */
unique(
    comparator?: (a: TItem, b: TItem) => boolean,
    message?: string
): this {
    const compare = comparator ?? ((a, b) => a === b);

    this.addValidator('unique', function(value: unknown, path) {
        const arrayValue = value as TItem[];
        const duplicateIndices: number[] = [];

        for (let i = 0; i < arrayValue.length; i++) {
            for (let j = i + 1; j < arrayValue.length; j++) {
                if (compare(arrayValue[i], arrayValue[j])) {
                    if (!duplicateIndices.includes(i)) duplicateIndices.push(i);
                    if (!duplicateIndices.includes(j)) duplicateIndices.push(j);
                }
            }
        }

        if (duplicateIndices.length > 0) {
            return {
                valid: false,
                errors: duplicateIndices.map(index => ({
                    path: [...path, String(index)],
                    identifier: 'duplicate',
                    message: message ?? 'Duplicate value.',
                })),
                successes: [],
            };
        }

        return { valid: true, errors: [], successes: [] };
    });

    return this;
}

/**
 * Add array-level refinement validation.
 * Runs after all items are validated.
 */
refineArray(
    validator: (
        items: TItem[],
        context: { path: string[] }
    ) => ValidationError[] | void | Promise<ValidationError[] | void>
): this {
    this.addValidator('refineArray', async function(value: unknown, path) {
        const errors = await validator(value as TItem[], { path });

        if (errors && errors.length > 0) {
            return { valid: false, errors, successes: [] };
        }

        return { valid: true, errors: [], successes: [] };
    });

    return this;
}

/**
 * Add per-item refinement validation with access to all items.
 * Useful for cross-item validation.
 */
refineItems(
    validator: (
        item: TItem,
        context: { index: number; allItems: TItem[]; path: string[] }
    ) => ValidationError[] | void | Promise<ValidationError[] | void>
): this {
    this.addValidator('refineItems', async function(value: unknown, path) {
        const items = value as TItem[];
        const allErrors: ValidationError[] = [];

        for (let index = 0; index < items.length; index++) {
            const itemErrors = await validator(items[index], {
                index,
                allItems: items,
                path: [...path, String(index)],
            });

            if (itemErrors && itemErrors.length > 0) {
                allErrors.push(...itemErrors);
            }
        }

        if (allErrors.length > 0) {
            return { valid: false, errors: allErrors, successes: [] };
        }

        return { valid: true, errors: [], successes: [] };
    });

    return this;
}
```

---

## Conclusion

This document represents the synthesized wisdom of four foundation models analyzing the repeating form elements challenge. The key takeaways are:

1. **Build primitives first**: The `FieldArray` component handles the hard problems (key stability, TanStack integration) once, then all specialized components benefit.

2. **Key stability is non-negotiable**: Parallel UUID arrays synchronized with form operations prevent the focus/state bugs that plague naive implementations.

3. **Layer your validation**: Item → Array → Cross-item, each with appropriate timing.

4. **Performance requires architecture**: Length-only subscriptions, virtualization, and mode-based rendering are necessary for scale.

5. **Accessibility is integral**: ARIA roles, live regions, and focus management must be built in from the start.

6. **GraphQL integration can be smart**: Heuristic-based component selection with override capabilities eliminates hardcoded hacks.

The implementation plan provides a clear 7-week path from foundation to production-ready release. Each phase builds on the previous, with clear deliverables and test requirements.

---

_Document prepared by the Council of Foundation Models_
_GPT-5 • Grok • Gemini • Claude_
