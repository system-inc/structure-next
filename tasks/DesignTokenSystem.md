# Design Token System: Letter-Based Hierarchy

## Dear Magda,

We're implementing a major redesign of our token naming system that will affect all design tokens in Figma. This document explains why we're making this change and exactly what needs to be updated.

### Why We're Changing

Our current token system (`border--a`, `bg-opsis-background-secondary`, etc.) has several critical problems:

**1. Excessive Redundancy**

-   `border--a` repeats "border" twice
-   `bg-opsis-background-secondary` repeats "background"
-   Average token length: 27 characters

**2. Latin Hierarchy Doesn't Scale**

-   Primary → Secondary → Tertiary → Quartary (typo-prone, we had 11 "tetriary" typos!)
-   Complex UIs need 6-8 background levels, but what comes after tertiary? Quaternary? Quinary?
-   Obscure Latin words that are hard to spell and remember

**3. "Primary" Means Different Things**

-   `bg-primary` = lowest elevation (page background)
-   `text-primary` = highest emphasis (main text)
-   `button-primary` = main action
-   Same word, three different meanings = confusion

**4. Metaphors Are Synonyms**

-   Industry tries metaphors: "raised" vs "elevated" vs "floating"
-   These words mean essentially the same thing
-   Doesn't solve the scaling problem

### The Solution: Letters for Hierarchy, Words for Semantics

After extensive analysis (including consultation with multiple AI models), we've designed a system that is:

-   **Brief**: 8 characters average (vs 27)
-   **Scalable**: A→Z (26 levels) without inventing words
-   **Clear**: Alphabetical order is universal
-   **Consistent**: "A" always means "first/default in category"
-   **Typo-proof**: Can't misspell A/B/C

The core principle:

-   **Use letters (A/B/C/D)** for hierarchical levels
-   **Use words (Success/Error/Destructive)** when meaning matters more than hierarchy

---

## Complete Token Specification

### Backgrounds (Elevation Hierarchy)

Backgrounds use letters to indicate visual elevation from lowest to highest:

| Token         | Usage                                     | Example                                         |
| ------------- | ----------------------------------------- | ----------------------------------------------- |
| `bg-a`        | Page/canvas background (lowest elevation) | Main app background                             |
| `bg-b`        | App chrome, sections, headers             | Navigation bars, section containers             |
| `bg-c`        | Cards, standard panels                    | Content cards, form containers                  |
| `bg-d`        | Insets, wells, code blocks                | Nested content, syntax highlighting backgrounds |
| `bg-e`        | Modals, dialogs, drawers                  | Overlay panels that sit above page content      |
| `bg-f`        | Popovers, tooltips (highest elevation)    | Floating UI elements                            |
| `bg-backdrop` | Modal backdrop/scrim (semantic)           | Darkened overlay behind modals                  |

**Key principle**: As you move from A→F, visual elevation increases (elements appear "closer" to the user).

### Text (Emphasis Hierarchy + Semantic States)

Text uses letters for emphasis levels, words for states:

| Token                 | Usage                                 |
| --------------------- | ------------------------------------- |
| `text-a`              | Primary text (highest emphasis)       |
| `text-b`              | Secondary text (medium emphasis)      |
| `text-c`              | Tertiary text (lowest emphasis)       |
| `text-disabled`       | Disabled state (semantic)             |
| `text-placeholder`    | Placeholder text (semantic)           |
| `text-on-accent`      | Text on brand color backgrounds       |
| `text-on-success`     | Text on success color backgrounds     |
| `text-on-error`       | Text on error color backgrounds       |
| `text-on-warning`     | Text on warning color backgrounds     |
| `text-on-information` | Text on information color backgrounds |

**Key principle**: A is highest emphasis (headings, primary content), C is lowest (helper text, captions).

### Borders (Weight Hierarchy + Semantic)

Borders use letters for visual weight:

| Token          | Usage                            |
| -------------- | -------------------------------- |
| `border-a`     | Default border (standard weight) |
| `border-b`     | Subtle border (lighter weight)   |
| `border-c`     | Strong border (heavier weight)   |
| `border-focus` | Focus ring (semantic)            |

### Semantic Backgrounds (Status Colors)

Status colors use descriptive words because their meaning matters:

| Token                   | Usage                         |
| ----------------------- | ----------------------------- |
| `bg-accent-solid`       | Brand color solid background  |
| `bg-accent-subtle`      | Brand color tinted background |
| `bg-success-solid`      | Success solid background      |
| `bg-success-subtle`     | Success tinted background     |
| `bg-error-solid`        | Error solid background        |
| `bg-error-subtle`       | Error tinted background       |
| `bg-warning-solid`      | Warning solid background      |
| `bg-warning-subtle`     | Warning tinted background     |
| `bg-information-solid`  | Information solid background  |
| `bg-information-subtle` | Information tinted background |

**Solid vs Subtle**:

-   **Solid**: Full saturation, requires `text-on-*` for contrast
-   **Subtle**: Tinted/low opacity, uses regular text colors

### Additional Semantic States

| Token                 | Usage                                           |
| --------------------- | ----------------------------------------------- |
| `bg-attention-subtle` | "Look here" highlighting without status meaning |
| `bg-selected-subtle`  | Selected list items, active menu items          |
| `bg-hover-subtle`     | Generic hover state                             |
| `bg-skeleton`         | Loading placeholder shimmer                     |

---

## Component Variants

Components follow the same pattern: letters for hierarchy, words for semantics.

### Button

```tsx
<Button variant="A" />           // Primary action (highest emphasis)
<Button variant="B" />           // Secondary action
<Button variant="C" />           // Tertiary action
<Button variant="D" />           // Quaternary action (lowest emphasis)
<Button variant="Ghost" />       // Transparent background
<Button variant="Link" />        // Link-style button
<Button variant="Destructive" /> // Dangerous action (semantic)
<Button variant="Warning" />     // Warning action (semantic)
<Button variant="Success" />     // Success action (semantic)
```

### Card

```tsx
<Card variant="A" />        // Base card (bg-c)
<Card variant="B" />        // Subtle card (bg-b)
<Card variant="Elevated" /> // Emphasized card (bg-d)
```

### Badge

```tsx
<Badge variant="A" />           // Default badge
<Badge variant="B" />           // Subtle badge
<Badge variant="Success" />     // Success badge (semantic)
<Badge variant="Warning" />     // Warning badge (semantic)
<Badge variant="Error" />       // Error badge (semantic)
<Badge variant="Information" /> // Information badge (semantic)
```

### Input

```tsx
<Input variant="A" />       // Default input
<Input variant="Error" />   // Error state (semantic)
<Input variant="Warning" /> // Warning state (semantic)
```

### Alert

```tsx
<Alert variant="Success" />     // Success alert
<Alert variant="Warning" />     // Warning alert
<Alert variant="Error" />       // Error alert
<Alert variant="Information" /> // Information alert
```

---

## Real-World Examples

### Page Layout with Background Hierarchy

```tsx
<div className="bg-a">
    {' '}
    {/* Page background (lowest) */}
    <Header className="bg-b border-a" /> {/* Header bar (elevated) */}
    <Card className="bg-c border-a">
        {' '}
        {/* Card (more elevated) */}
        <h3 className="text-a">Title</h3> {/* Primary text */}
        <p className="text-b">Subtitle</p> {/* Secondary text */}
        <small className="text-c">Helper</small> {/* Tertiary text */}
    </Card>
    <CodeBlock className="bg-d border-b">
        {' '}
        {/* Inset (even more elevated) */}
        <code className="text-a">const x = 1;</code>
    </CodeBlock>
</div>
```

### Button Hierarchy in a Dialog

```tsx
<Dialog className="bg-e">
    {' '}
    {/* Modal background */}
    <DialogTitle className="text-a">Delete Account?</DialogTitle>
    <DialogDescription className="text-b">This action cannot be undone.</DialogDescription>
    <Button variant="B">Cancel</Button> {/* Secondary action */}
    <Button variant="Destructive">Delete</Button> {/* Semantic: dangerous */}
</Dialog>
```

### Form with States

```tsx
<Form className="bg-c border-a">
    <Input variant="A" placeholder="Email" /> {/* Default state */}
    <Input variant="Error" placeholder="Password" /> {/* Error state */}
    <Button variant="A">Submit</Button> {/* Primary action */}
    <Button variant="C">Cancel</Button> {/* Tertiary action */}
</Form>
```

### Status Messages

```tsx
<Alert variant="Success" className="bg-success-subtle border-a">
  <CheckIcon className="text-on-success" />
  <AlertTitle className="text-success">Success!</AlertTitle>
  <AlertDescription className="text-b">Your changes have been saved.</AlertDescription>
</Alert>

<Alert variant="Error" className="bg-error-subtle border-a">
  <XIcon className="text-on-error" />
  <AlertTitle className="text-error">Error</AlertTitle>
  <AlertDescription className="text-b">Something went wrong.</AlertDescription>
</Alert>
```

---

## Migration Guide for Figma

### Top Token Migrations

Here are the most common tokens that need to be renamed:

| Old Token                       | New Token  | Occurrences |
| ------------------------------- | ---------- | ----------- |
| `border--a`                     | `border-a` | 94          |
| `bg-opsis-background-secondary` | `bg-b`     | 38          |
| `foreground--a`                 | `text-a`   | 26          |
| `foreground--b`                 | `text-b`   | 26          |
| `bg-opsis-background-primary`   | `bg-a`     | 24          |
| `bg-opsis-background-tertiary`  | `bg-c`     | 15          |
| `bg-opsis-background-tetriary`  | `bg-d`     | 11 (typo!)  |
| `text-opsis-content-tetriary`   | `text-c`   | 6 (typo!)   |
| `bg-opsis-background-quartary`  | `bg-d`     | 5           |
| `border-opsis-border-tetriary`  | `border-c` | 2 (typo!)   |

### Complete Mapping Reference

#### Background Tokens

-   `bg-opsis-background-primary` → `bg-a`
-   `bg-opsis-background-secondary` → `bg-b`
-   `bg-opsis-background-tertiary` → `bg-c`
-   `bg-opsis-background-tetriary` → `bg-d` (fix typo)
-   `bg-opsis-background-quartary` → `bg-d`
-   `bg-opsis-background-overlay` → `bg-backdrop`
-   `bg-opsis-background-subtle-positive` → `bg-success-subtle`
-   `bg-opsis-background-subtle-negative` → `bg-error-subtle`
-   `bg-opsis-background-subtle-warning` → `bg-warning-subtle`
-   `bg-opsis-background-subtle-informative` → `bg-information-subtle`

#### Text Tokens

-   `foreground--a` → `text-a`
-   `foreground--b` → `text-b`
-   `text-opsis-content-tetriary` → `text-c` (fix typo)
-   `foreground--c` → `text-c`
-   `foreground--disabled` → `text-disabled`
-   `text-opsis-content-placeholder` → `text-placeholder`
-   `text-opsis-content-positive` → `text-success`
-   `text-opsis-content-negative` → `text-error`
-   `text-opsis-content-warning` → `text-warning`
-   `text-opsis-content-informative` → `text-information`
-   `text-opsis-action-primary-contrast` → `text-on-accent`

#### Border Tokens

-   `border--a` → `border-a`
-   `border--b` → `border-b`
-   `border-opsis-border-tertiary` → `border-c`
-   `border-opsis-border-tetriary` → `border-c` (fix typo)
-   `border-opsis-border-focus` → `border-focus`

#### Action/Accent Tokens

-   `bg-opsis-action-primary` → `bg-accent-solid`
-   `bg-opsis-action-primary-hover` → `bg-accent-solid-hover`
-   `bg-opsis-action-primary-pressed` → `bg-accent-solid-pressed`

---

## Design Principles

### 1. Hierarchy = Letters

When the only difference is visual prominence or elevation, use letters (A/B/C/D).

**Example**: Background levels from page → tooltip use `bg-a` through `bg-f`.

### 2. Meaning = Words

When the token has special semantic meaning or behavior, use descriptive words.

**Example**: `text-disabled`, `bg-error-subtle`, `Button variant="Destructive"`.

### 3. One Canonical Way

Every level has exactly one name. No aliases, no multiple ways to express the same thing.

**Example**: The default border is `border-a`. Not "border-default", not "border-primary", just `border-a`.

### 4. Alphabetical = Ordered

A comes before B, B comes before C. This is universally understood and requires no documentation.

### 5. Interactive States Go Up One Level

When an element is hovered, pressed, or focused, it moves up one level in the hierarchy.

**Example**:

-   `bg-c` on hover → `bg-d`
-   `border-a` on focus → `border-b` (or `border-focus` for semantic meaning)

### 6. Dark Mode Inverts the Hierarchy

In dark mode, the CSS variables swap their values but the token names stay the same.

**Example**:

-   Light mode: `bg-a` = `#FFFFFF` (white page)
-   Dark mode: `bg-a` = `#000000` (black page)

The token name `bg-a` doesn't change, but its value inverts.

---

## Questions & Answers

### Why not use metaphors like "base", "raised", "elevated"?

Metaphors become synonyms and don't scale. What's the difference between "raised" and "elevated"? They mean the same thing. When you need 6-8 levels, metaphors force you to invent increasingly awkward compound words.

### Why not use numbers like "bg-1", "bg-2"?

Numbers work, but `border-1` looks like a 1px border width. Letters avoid this visual collision and feel more like "variants" than measurements.

### Why not use "primary", "secondary", "tertiary"?

1. Latin words don't scale (what comes after tertiary? quaternary? quinary?)
2. They're typo-prone (we had 11 "tetriary" typos)
3. "Primary" means different things in different contexts (lowest elevation vs highest emphasis)

### Isn't "A" ambiguous across categories?

No—it's a pattern. "A" consistently means "first/default **in this category**":

-   `bg-a` = first background level (page)
-   `text-a` = first text level (primary)
-   `border-a` = first border level (default)
-   `Button variant="A"` = first button level (primary action)

This is **intentional consistency**, not ambiguity.

### How do I know what level to use?

Start at A and work your way up. If you're nesting elements, each nested level should increase:

-   Page: `bg-a`
-   Card on page: `bg-c`
-   Code block inside card: `bg-d`
-   Tooltip: `bg-f`

### What if I need more than 6 background levels?

Use `bg-g`, `bg-h`, etc. The system scales to 26 levels (A→Z), far more than any UI needs.

### When do I use words instead of letters?

Use words when the **meaning** matters more than the hierarchy:

-   Status colors: `bg-success-subtle`, `bg-error-solid`
-   Functional states: `text-disabled`, `text-placeholder`
-   Special cases: `bg-backdrop`, `border-focus`
-   Semantic actions: `Button variant="Destructive"`

---

## Next Steps for Magda

1. **Update Figma token naming** following the mapping table above
2. **Fix all "tetriary" typos** (should be "tertiary" → `c` or `d`)
3. **Remove "opsis" prefix** from all tokens (e.g., `border--a` → `border-a`)
4. **Add new semantic tokens**: `bg-attention-subtle`, `bg-selected-subtle`, `bg-hover-subtle`, `bg-skeleton`
5. **Ensure text-on-\* tokens exist** for all solid status backgrounds

If you have any questions or need clarification, please reach out!

---

**Document Version**: 1.0
**Last Updated**: 2025-01-20
**Authors**: Kirk Ouimet, Claude Code
