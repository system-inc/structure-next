# Prose Component Proposal

**Date:** 2025-01-21
**Status:** Proposal
**Author:** Claude & Kirk

!!! Note - delete prose tailwind utility out of utilities.css?

---

## Overview

Proposal to create a `Prose` component using the existing Button/Badge variant pattern to provide a DRY, type-safe solution for typography-heavy content areas.

---

## Problem Statement

Currently, to add prose styling to content, we would need to either:

1. **Use duplicate CSS utilities** - Each size variant duplicates all element styles (50+ lines × 4 sizes = 200+ lines)
2. **Use double classes** - `<article className="prose prose-lg">` (awkward DX)
3. **No type safety** - Easy to use invalid size values
4. **Hard to maintain** - Adding new element styles requires updating multiple utilities

---

## Proposed Solution

Use the existing Button/Badge variant system pattern with CSS variables for sizing, providing a single source of truth for element styles.

### File Structure

```
libraries/structure/source/common/prose/
├── Prose.tsx              # Component
├── ProseTheme.ts          # Theme variants
└── Prose.css              # Utility definitions (or in utilities.css)
```

---

## Implementation

### 1. ProseTheme.ts

```typescript
// libraries/structure/source/common/prose/ProseTheme.ts

export const ProseTheme = {
    size: {
        sm: 'prose-size--sm',
        base: 'prose-size--base',
        lg: 'prose-size--lg',
        xl: 'prose-size--xl',
        '2xl': 'prose-size--2xl',
    },
    variant: {
        default: '',
        blog: 'prose-variant--blog',
        docs: 'prose-variant--docs',
        compact: 'prose-variant--compact',
    },
};

export type ProseSize = keyof typeof ProseTheme.size;
export type ProseVariant = keyof typeof ProseTheme.variant;

export interface ProseProperties {
    size?: ProseSize;
    variant?: ProseVariant;
    className?: string;
    children: React.ReactNode;
}
```

### 2. Prose.tsx

```typescript
// libraries/structure/source/common/prose/Prose.tsx

'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Theme
import { ProseTheme, type ProseProperties } from './ProseTheme';

// Component - Prose
export function Prose(properties: ProseProperties) {
    const size = properties.size || 'base';
    const variant = properties.variant || 'default';

    return (
        <article
            className={mergeClassNames(
                'prose',
                ProseTheme.size[size],
                ProseTheme.variant[variant],
                properties.className,
            )}
        >
            {properties.children}
        </article>
    );
}
```

### 3. CSS Utilities

```css
/* libraries/structure/source/theme/styles/utilities.css */

/* Prose - Size Variants (CSS Variables Only) */
@utility prose-size--sm {
    --prose-font-size: 0.875rem; /* 14px */
    --prose-line-height: 1.7142857;
    --prose-spacing: 0.75rem; /* 12px */
    --prose-hr-spacing: 1.25rem; /* 20px */
    --prose-heading-spacing: 1.5rem; /* 24px */
}

@utility prose-size--base {
    --prose-font-size: 1rem; /* 16px */
    --prose-line-height: 1.75;
    --prose-spacing: 1rem; /* 16px */
    --prose-hr-spacing: 1.75rem; /* 28px */
    --prose-heading-spacing: 2rem; /* 32px */
}

@utility prose-size--lg {
    --prose-font-size: 1.125rem; /* 18px */
    --prose-line-height: 1.7777778;
    --prose-spacing: 1.25rem; /* 20px */
    --prose-hr-spacing: 2.25rem; /* 36px */
    --prose-heading-spacing: 2.5rem; /* 40px */
}

@utility prose-size--xl {
    --prose-font-size: 1.25rem; /* 20px */
    --prose-line-height: 1.8;
    --prose-spacing: 1.5rem; /* 24px */
    --prose-hr-spacing: 2.75rem; /* 44px */
    --prose-heading-spacing: 3rem; /* 48px */
}

@utility prose-size--2xl {
    --prose-font-size: 1.5rem; /* 24px */
    --prose-line-height: 1.6666667;
    --prose-spacing: 1.75rem; /* 28px */
    --prose-hr-spacing: 3.5rem; /* 56px */
    --prose-heading-spacing: 4rem; /* 64px */
}

/* Prose - Variant Modifiers */
@utility prose-variant--blog {
    max-width: 65ch;
    margin-left: auto;
    margin-right: auto;
}

@utility prose-variant--docs {
    max-width: 80ch;
}

@utility prose-variant--compact {
    --prose-spacing: 0.5rem;
    --prose-hr-spacing: 1rem;
    --prose-heading-spacing: 1rem;
}

/* Prose - Base Styles (Applied Once, Uses CSS Variables) */
@utility prose {
    /* Base Typography */
    font-size: var(--prose-font-size);
    line-height: var(--prose-line-height);
    color: var(--foreground--a);

    /* Paragraphs */
    & p {
        margin-top: var(--prose-spacing);
        margin-bottom: var(--prose-spacing);
    }

    & p:first-child {
        margin-top: 0;
    }

    & p:last-child {
        margin-bottom: 0;
    }

    /* Horizontal Rules */
    & hr {
        margin-top: var(--prose-hr-spacing);
        margin-bottom: var(--prose-hr-spacing);
        border-color: var(--border--0);
        border-top-width: 1px;
        border-bottom-width: 0;
    }

    /* Headings */
    & h1 {
        font-size: 2em;
        font-weight: 600;
        line-height: 1.2;
        margin-top: var(--prose-heading-spacing);
        margin-bottom: calc(var(--prose-spacing) * 0.75);
    }

    & h2 {
        font-size: 1.75em;
        font-weight: 600;
        line-height: 1.3;
        margin-top: calc(var(--prose-heading-spacing) * 0.85);
        margin-bottom: calc(var(--prose-spacing) * 0.5);
    }

    & h3 {
        font-size: 1.5em;
        font-weight: 600;
        line-height: 1.4;
        margin-top: calc(var(--prose-heading-spacing) * 0.75);
        margin-bottom: calc(var(--prose-spacing) * 0.5);
    }

    & h4 {
        font-size: 1.25em;
        font-weight: 600;
        line-height: 1.5;
        margin-top: calc(var(--prose-heading-spacing) * 0.65);
        margin-bottom: calc(var(--prose-spacing) * 0.25);
    }

    & h5 {
        font-size: 1.125em;
        font-weight: 500;
        line-height: 1.5;
        margin-top: calc(var(--prose-heading-spacing) * 0.5);
        margin-bottom: calc(var(--prose-spacing) * 0.25);
    }

    & h6 {
        font-size: 1em;
        font-weight: 500;
        line-height: 1.5;
        margin-top: calc(var(--prose-heading-spacing) * 0.5);
        margin-bottom: calc(var(--prose-spacing) * 0.25);
    }

    & h1:first-child,
    & h2:first-child,
    & h3:first-child,
    & h4:first-child,
    & h5:first-child,
    & h6:first-child {
        margin-top: 0;
    }

    /* Lists */
    & ul,
    & ol {
        margin-top: var(--prose-spacing);
        margin-bottom: var(--prose-spacing);
        padding-left: 1.5em;
    }

    & li {
        margin-top: calc(var(--prose-spacing) * 0.5);
        margin-bottom: calc(var(--prose-spacing) * 0.5);
    }

    & li:first-child {
        margin-top: 0;
    }

    & li:last-child {
        margin-bottom: 0;
    }

    /* Nested lists */
    & ul ul,
    & ul ol,
    & ol ul,
    & ol ol {
        margin-top: calc(var(--prose-spacing) * 0.5);
        margin-bottom: calc(var(--prose-spacing) * 0.5);
    }

    /* Links */
    & a {
        color: var(--link--a);
        text-decoration: underline;

        &:hover {
            color: var(--link--a-hover);
        }

        &:active {
            color: var(--link--a-pressed);
        }
    }

    /* Code */
    & code {
        font-size: 0.875em;
        background-color: var(--background--3);
        padding: 0.2em 0.4em;
        border-radius: 0.25rem;
    }

    & pre {
        margin-top: var(--prose-spacing);
        margin-bottom: var(--prose-spacing);
        background-color: var(--background--3);
        padding: 1em;
        border-radius: 0.5rem;
        overflow-x: auto;
    }

    & pre code {
        background-color: transparent;
        padding: 0;
    }

    /* Blockquotes */
    & blockquote {
        margin-top: var(--prose-spacing);
        margin-bottom: var(--prose-spacing);
        padding-left: 1em;
        border-left: 4px solid var(--border--0);
        color: var(--foreground--b);
    }

    & blockquote p {
        margin-top: 0;
        margin-bottom: 0;
    }

    /* Strong and Emphasis */
    & strong {
        font-weight: 600;
        color: var(--foreground--a);
    }

    & em {
        font-style: italic;
    }
}
```

---

## Usage Examples

### Basic Usage

```tsx
import { Prose } from '@structure/source/common/prose/Prose';

// Default size (base)
<Prose>
    <h1>Article Title</h1>
    <p>First paragraph...</p>
    <p>Second paragraph...</p>
</Prose>

// Small size
<Prose size="sm">
    <p>Compact content...</p>
</Prose>

// Large size
<Prose size="lg">
    <h1>Blog Post</h1>
    <p>Content...</p>
</Prose>

// Extra large
<Prose size="xl">
    <h1>Landing Page</h1>
    <p>Hero content...</p>
</Prose>
```

### With Variants

```tsx
// Blog layout (centered, 65ch width)
<Prose size="lg" variant="blog">
    <h1>Blog Post Title</h1>
    <p>Article content...</p>
</Prose>

// Documentation layout (wider, 80ch width)
<Prose size="base" variant="docs">
    <h1>API Documentation</h1>
    <p>Technical details...</p>
</Prose>

// Compact spacing
<Prose size="sm" variant="compact">
    <p>Dense content...</p>
</Prose>
```

### With Custom Classes

```tsx
// Override or extend with Tailwind
<Prose size="lg" variant="blog" className="max-w-6xl px-4">
    Custom max-width and padding
</Prose>

// Combine with other utilities
<Prose size="base" className="bg-background--2 p-8 rounded-lg">
    Content in a card
</Prose>
```

### Markdown/CMS Content

```tsx
function BlogPost({ content }: { content: string }) {
    return (
        <Prose size="lg" variant="blog">
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Prose>
    );
}
```

---

## Benefits

### 1. DRY (Don't Repeat Yourself)

-   ✅ Element styles defined **once** in base `prose` utility
-   ✅ Size variants only define CSS variables (5 lines vs 50+ lines)
-   ✅ Add new element styling? Update one place, works for all sizes
-   ✅ Change spacing system? Update variables, cascades everywhere

**Before (duplicated utilities):**

```css
/* 50+ lines duplicated 4 times = 200+ lines */
@utility prose {
    /* 50 lines */
}
@utility prose-sm {
    /* same 50 lines */
}
@utility prose-lg {
    /* same 50 lines */
}
@utility prose-xl {
    /* same 50 lines */
}
```

**After (DRY with CSS variables):**

```css
/* 4 size variants × 5 lines = 20 lines */
/* + 1 base utility with all elements = ~100 lines total */
/* vs 200+ lines before! */
```

### 2. Type Safety

-   ✅ TypeScript autocomplete for `size` and `variant` props
-   ✅ Compile-time errors for invalid values
-   ✅ IntelliSense shows available options

### 3. Maintainability

-   ✅ Consistent with Button/Badge variant pattern
-   ✅ Easy to add new sizes: just add CSS variables + theme entry
-   ✅ Easy to add new variants: just add utility + theme entry
-   ✅ Centralized theme configuration in `ProseTheme.ts`

### 4. Flexibility

-   ✅ Can still override with `className` prop
-   ✅ Mix and match sizes and variants
-   ✅ Works with all Tailwind utilities
-   ✅ Can use utility classes directly if needed: `<article className="prose prose-size--lg">`

### 5. Performance

-   ✅ CSS variables are fast
-   ✅ Single component render (not a heavy abstraction)
-   ✅ Tree-shakeable utilities
-   ✅ No runtime style calculations

---

## Comparison to Alternatives

### vs. Tailwind Typography Plugin

| Feature                   | Our Prose                | @tailwindcss/typography        |
| ------------------------- | ------------------------ | ------------------------------ |
| Bundle size               | Minimal (~2-3kb)         | ~20kb with variants            |
| Customization             | Full control             | Limited without complex config |
| Design system integration | Uses our semantic tokens | Generic tokens                 |
| Dependency                | Zero                     | External package               |
| Type safety               | Full TypeScript          | Class strings only             |
| Learning curve            | Matches Button pattern   | New API to learn               |

### vs. Plain Utility Classes

| Feature      | Prose Component     | Plain Classes                          |
| ------------ | ------------------- | -------------------------------------- |
| DX           | `<Prose size="lg">` | `<article className="prose prose-lg">` |
| Type safety  | ✅ Full             | ❌ None                                |
| Autocomplete | ✅ Yes              | ❌ No                                  |
| Consistency  | ✅ Enforced         | ⚠️ Manual                              |
| Flexibility  | ✅ Can override     | ✅ Full control                        |

---

## Migration Path

### Phase 1: Add Prose Utilities (No Breaking Changes)

1. Add size variant utilities to `utilities.css`
2. Add base `prose` utility with element styles
3. Test in isolation

### Phase 2: Create Component

1. Add `ProseTheme.ts`
2. Add `Prose.tsx`
3. Export from structure index

### Phase 3: Gradual Adoption

1. Use in new content areas
2. Migrate existing prose content when touching files
3. No rush - can coexist with other approaches

### Phase 4: Remove Old Prose Styles (Optional)

1. Remove default `p`, `h1-h6` margins from `global.css`
2. Content must opt-in with `<Prose>` or manual spacing
3. More explicit, predictable system

---

## Future Enhancements

### Color Variants (Optional)

```typescript
// ProseTheme.ts
variant: {
    default: '',
    muted: 'prose-variant--muted',
    inverted: 'prose-variant--inverted',
}
```

```css
@utility prose-variant--muted {
    color: var(--foreground--b);
}

@utility prose-variant--inverted {
    color: var(--foreground--a);

    & a {
        color: var(--link--contrast);

        &:hover {
            color: var(--link--contrast-hover);
        }
    }
}
```

### Dark Mode Support

Already built-in via semantic tokens:

-   `var(--foreground--a)` automatically adapts
-   `var(--border--0)` changes with theme
-   `var(--link--a)` switches appropriately

### Responsive Sizes

```tsx
<Prose
    size="sm" // Mobile
    className="md:prose-size--base lg:prose-size--lg"
>
    Responsive sizing
</Prose>
```

---

## Open Questions

1. **Should we remove default margins from bare `<p>`, `<h1-6>` in `global.css`?**

    - Pro: Forces explicit spacing, more predictable
    - Con: Breaking change, requires migration
    - **Recommendation:** Yes, but phase it in gradually

2. **Should we include table styles?**

    - Depends on use case frequency
    - Can add later if needed

3. **Should we support `as` prop for different semantic elements?**
    ```tsx
    <Prose as="section">...</Prose>
    ```
    - Nice to have, not critical for v1

---

## Recommendation

✅ **Approve and implement** using the Button/Badge variant pattern.

**Why:**

1. Massive DRY improvement over duplicate utilities
2. Consistent with existing component patterns
3. Full TypeScript support
4. Minimal bundle size impact
5. Easy to maintain and extend
6. No external dependencies

**Implementation order:**

1. Add CSS utilities (1-2 hours)
2. Create component and theme (30 mins)
3. Test in a few places (30 mins)
4. Document usage (30 mins)
5. Gradual adoption across codebase

**Total effort:** ~3-4 hours for complete implementation and testing

---

## Decision

-   [ ] Approved - Proceed with implementation
-   [ ] Approved with modifications - See comments below
-   [ ] Rejected - Use alternative approach
-   [ ] Needs more discussion

**Notes:**
