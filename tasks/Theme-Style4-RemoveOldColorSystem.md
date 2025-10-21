# Style Cleanup Phase 4: Remove Old Color System

**Priority:** Medium
**Estimated Time:** Multiple sessions (large scope)
**Risk:** High (564 occurrences to migrate)

## Overview

Migrate from old color system (light-1 through light-6, dark-1 through dark-6, neutral) to **new semantic token system** built on top of the 0-1000 scales. This creates a clean, themeable, semantic foundation for structure library that all future projects can use.

## 🚨 IMPORTANT: Token Naming Discussion Required

**Before starting migration, we need to finalize semantic token names.** These names will be used across all future projects and structure library components, so they must be:

-   Clear and intuitive
-   Consistent with industry standards
-   Future-proof
-   Easy to remember and type
-   Semantically meaningful

**This is a design decision, not just a technical migration.** Schedule dedicated time to debate and finalize naming conventions before proceeding.

## Architecture Philosophy

### Three-Layer System

```
┌─────────────────────────────────────────────────────┐
│  PROJECT LAYER (Opsis Tokens - Project-Specific)   │
│  Uses: opsis-* prefix when custom theming needed    │
│  Example: opsis-background-hero                     │
│  Purpose: Project-specific branded colors           │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STRUCTURE LAYER (Semantic Tokens - NO PREFIX)     │
│  Default tokens that "just work"                    │
│  Example: background-primary, content-primary       │
│  Purpose: Framework-agnostic semantic foundation    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  FOUNDATION LAYER (0-1000 Scales)                   │
│  Raw color values - rarely used directly            │
│  Example: white-900, black-600, gray-500            │
│  Purpose: Granular color values for token mapping   │
└─────────────────────────────────────────────────────┘
```

### Key Principles

**1. No prefix = Default semantic tokens**

-   Most code uses unprefixed tokens: `background--a`
-   These "come for free" with structure library
-   Themeable via light/dark mode automatically

**2. Opsis prefix = Project customization**

-   Only use when you need project-specific branded colors
-   Clear signal: "this is custom, not default"
-   Example: `bg-opsis-background-hero` for custom hero section

**3. 0-1000 scales = Implementation detail**

-   Rarely used directly in components
-   Used to define semantic tokens
-   Provides granular foundation

## Background

### What We're Removing (Old System)

-   `light-1` to `light-6` - Opaque light grays
-   `dark-1` to `dark-6` - Opaque dark grays
-   `neutral-6` to `neutral+6` - Opaque middle grays
-   **564 occurrences** across structure library (225 light, 239 dark, 100 neutral)

### What We're Keeping (Foundation - 0-1000 Scales)

The new system has **5 core scales** (0-1000, every 50) plus blue accents:

#### Transparent Scales (Alpha Channel)

1. **light-0 to light-1000** - Transparent whites (rgba)

    - `light-0` = fully transparent white (0% opacity)
    - `light-500` = 50% transparent white (for overlays, glass effects)
    - `light-1000` = solid white (#ffffff)
    - **Use for:** Overlays, glass morphism, subtle highlights

2. **dark-0 to dark-1000** - Transparent blacks (rgba)
    - `dark-0` = fully transparent black (0% opacity)
    - `dark-500` = 50% transparent black (for shadows, overlays)
    - `dark-1000` = solid black (links to black-1000)
    - **Use for:** Shadows, overlays, darkening effects

#### Opaque Scales (Solid Colors)

3. **black-0 to black-1000** - Opaque grays to pure black

    - `black-0` = #505050 (medium gray)
    - `black-500` = #282828 (dark gray)
    - `black-1000` = #000000 (pure black)
    - **Use for:** Dark backgrounds, dark text, dark UI elements

4. **white-0 to white-1000** - Opaque grays to pure white

    - `white-0` = #afafaf (medium gray)
    - `white-500` = #d7d7d7 (light gray)
    - `white-1000` = #ffffff (pure white)
    - **Use for:** Light backgrounds, light UI elements

5. **gray-0 to gray-1000** - Opaque middle grays
    - `gray-0` = #a7a7a7 (lighter gray)
    - `gray-500` = #808080 (middle gray)
    - `gray-1000` = #585858 (darker gray)
    - **Use for:** Neutral elements, disabled states, subtle borders

#### What About Accent Colors (blue, etc.)?

**Accent colors belong in the PROJECT layer, not structure.** Structure library should remain achromatic (grays only) and framework-agnostic. Projects define their own accent colors using the opsis prefix.

Example:

```css
/* ❌ Don't put in structure */
--accent-primary: var(--blue-600);

/* ✅ Put in project theme */
--opsis-accent-primary: var(--blue-600);
--opsis-accent-secondary: var(--purple-600);
```

**Note:** The blue-0 to blue-1000 scale exists in variables.css currently but should be moved to project layer or marked as example/deprecated in structure.

### What We're Creating (Semantic Token Layer)

**Unprefixed semantic tokens** built on top of the 5 achromatic scales. These will be the default way to use colors in structure library - neutral, themeable, and framework-agnostic.

## 🎯 Semantic Token Naming Debate

**This section requires deep discussion before implementation.** These names will be used across all future projects and will be very difficult to change later.

### Design Goals for Token Names

1. **Intuitive** - Developers should guess the right token 80% of the time
2. **Unambiguous** - Clear what each token is for (no confusion)
3. **Scalable** - Easy to add new tokens without breaking the pattern
4. **Industry-aligned** - Familiar to developers from other systems (Tailwind, Material, etc.)
5. **Future-proof** - Won't feel dated or need renaming in 5 years
6. **Concise** - Short enough to type frequently without fatigue

### Key Questions to Answer

#### 1. Background Naming Pattern

What do we call different background layers?

**Option A: Numerical (primary/secondary/tertiary)**

```css
--background-primary    /* Main background */
--background-secondary  /* Elevated panels */
--background-tertiary   /* Even more elevated */
```

✅ Clear hierarchy
❌ What comes after tertiary? Quaternary feels awkward

**Option B: Elevation-based (base/raised/elevated/floating)**

```css
--background-base      /* Main background */
--background-raised    /* Cards, panels */
--background-elevated  /* Modals, popovers */
--background-floating  /* Tooltips, highest layer */
```

✅ Visually descriptive
✅ Scales naturally
❌ Longer names

**Option C: Z-index inspired (surface-0/surface-1/surface-2)**

```css
--surface-0  /* Main background */
--surface-1  /* Elevated */
--surface-2  /* More elevated */
--surface-3  /* Highest */
```

✅ Scalable infinitely
✅ Short
❌ "Surface" is Material Design terminology (might not feel right)
❌ Numbers less semantic

**Option D: Canvas/Layer metaphor (canvas/layer/overlay/float)**

```css
--background-canvas   /* Main background */
--background-layer    /* Cards, panels */
--background-overlay  /* Modals, dialogs */
--background-float    /* Tooltips, dropdowns */
```

✅ Strong visual metaphor
❌ "Canvas" might imply drawing surface

#### 2. Content/Text Naming Pattern

What do we call different text colors?

**Option A: Emphasis-based (primary/secondary/tertiary/muted)**

```css
--content-primary    /* Main text */
--content-secondary  /* Less important */
--content-tertiary   /* Even less important */
--content-muted      /* Least important */
```

✅ Common pattern (similar to Tailwind foreground)
❌ "Content" vs "text" vs "foreground"?

**Option B: Descriptive opacity (strong/medium/subtle/faint)**

```css
--text-strong   /* High contrast */
--text-medium   /* Medium contrast */
--text-subtle   /* Low contrast */
--text-faint    /* Very low contrast */
```

✅ Describes visual weight
❌ Implies opacity when it might be different colors

**Option C: Semantic purpose (body/heading/label/caption/disabled)**

```css
--text-heading   /* For h1-h6 */
--text-body      /* Paragraph text */
--text-label     /* Form labels */
--text-caption   /* Small text */
--text-disabled  /* Disabled state */
```

✅ Purpose-driven
❌ Mixes hierarchy with state (disabled)
❌ What if you want heading color on non-heading?

#### 3. Border Naming Pattern

How do we differentiate border strengths/purposes?

**Option A: Emphasis (primary/secondary/subtle)**

```css
--border-primary   /* Standard borders */
--border-secondary /* Lighter borders */
--border-subtle    /* Very light borders */
```

**Option B: Weight-based (strong/medium/light/faint)**

```css
--border-strong  /* High contrast */
--border-medium  /* Medium contrast */
--border-light   /* Low contrast */
--border-faint   /* Barely visible */
```

**Option C: Purpose-based (default/divider/focus/emphasis)**

```css
--border-default  /* Standard border */
--border-divider  /* For separating sections */
--border-focus    /* For focused states */
--border-emphasis /* For highlighting */
```

#### 4. Interactive State Naming

How do we name hover/active/disabled states?

**Option A: State as modifier (background-interactive-hover)**

```css
--background-interactive-default
--background-interactive-hover
--background-interactive-active
--background-interactive-disabled
```

✅ Grouped by category
❌ Very long names

**Option B: Element with state (button-background-hover)**

```css
--button-background-default
--button-background-hover
--button-background-active
--input-background-default
--input-background-hover
```

✅ Component-specific
❌ Less reusable, very long

**Option C: Separate tokens (hover/active)**

```css
--background-hover   /* Any hoverable background */
--background-active  /* Any active background */
--border-hover       /* Any hoverable border */
--border-focus       /* Any focused border */
```

✅ Short, reusable
❌ Less specific, might not fit all use cases

#### 5. Inverse/Contrast Naming

How do we handle light-on-dark or dark-on-light scenarios?

**Option A: "inverse" suffix**

```css
--background-primary
--background-inverse   /* Opposite of primary */
--content-primary
--content-inverse      /* Opposite of primary */
```

**Option B: "contrast" suffix**

```css
--background-primary
--background-contrast
--content-primary
--content-contrast
```

**Option C: "on-X" pattern (Material Design style)**

```css
--background-primary
--on-primary           /* Text/icons on primary background */
--background-secondary
--on-secondary         /* Text/icons on secondary background */
```

#### 6. Overlay/Transparency Naming

How do we name transparent overlays?

**Option A: "overlay" with strength**

```css
--overlay-light    /* 10-20% opacity */
--overlay-medium   /* 40-60% opacity */
--overlay-strong   /* 80-90% opacity */
```

**Option B: "scrim" (Material Design term)**

```css
--scrim-light
--scrim-medium
--scrim-dark
```

**Option C: "backdrop" with opacity**

```css
--backdrop-10   /* 10% opacity */
--backdrop-50   /* 50% opacity */
--backdrop-90   /* 90% opacity */
```

### Example Token Set Proposals

**Proposal 1: Primary/Secondary Pattern**

```css
/* Backgrounds */
--background-primary
--background-secondary
--background-tertiary
--background-inverse

/* Content */
--content-primary
--content-secondary
--content-tertiary
--content-disabled
--content-inverse

/* Borders */
--border-primary
--border-secondary
--border-subtle

/* Interactive */
--interactive-hover
--interactive-active
--interactive-disabled

/* Overlays */
--overlay-light
--overlay-medium
--overlay-strong
```

**Proposal 2: Elevation/Emphasis Pattern**

```css
/* Backgrounds */
--background-base
--background-raised
--background-elevated
--background-inverse

/* Content */
--text-strong
--text-medium
--text-subtle
--text-faint
--text-inverse

/* Borders */
--border-strong
--border-medium
--border-subtle
--border-focus

/* Interactive */
--state-hover
--state-active
--state-disabled
--state-focus

/* Overlays */
--scrim-light
--scrim-medium
--scrim-dark
```

**Proposal 3: Hybrid Descriptive**

```css
/* Backgrounds (elevation metaphor) */
--background-canvas
--background-layer
--background-overlay
--background-inverse

/* Content (emphasis) */
--content-primary
--content-secondary
--content-muted
--content-disabled
--content-inverse

/* Borders (weight) */
--border-default
--border-light
--border-subtle
--border-emphasis

/* Interactive (component + state) */
--button-default
--button-hover
--button-active
--input-default
--input-hover
--input-focus

/* Overlays */
--backdrop-light
--backdrop-medium
--backdrop-dark
```

### Decision Criteria

When debating, consider:

1. **How often will this be typed?** (favor shorter for frequently-used tokens)
2. **Is the meaning immediately clear?** (favor descriptive for ambiguous cases)
3. **Does it scale?** (can we add --background-quaternary or should we redesign?)
4. **Does it match developer expectations?** (align with Tailwind, Material, or other systems)
5. **Will it age well?** (avoid trendy terms that might feel dated)

### Next Steps

1. **Schedule naming discussion session**
2. **Review industry examples** (Tailwind, Material Design, Chakra UI, Radix, etc.)
3. **Create test cases** - Try naming tokens for real components
4. **Finalize token list** - Document complete token set
5. **Implement** - Create CSS variables
6. **Migrate** - Update components to use new tokens

## Color Migration Mapping

### Light Colors → White Scale

```
light (#FFFFFF)   → white-1000
light-1 (#F6F6F6) → white-950
light-2 (#EEEEEE) → white-850
light-3 (#E5E5E5) → white-700
light-4 (#DDDDDD) → white-550
light-5 (#D4D4D4) → white-500
light-6 (#CCCCCC) → white-350
```

### Dark Colors → Black Scale

```
dark (#111111)    → black-900
dark-1 (#191919)  → black-800
dark-2 (#222222)  → black-700
dark-3 (#2A2A2A)  → black-600
dark-4 (#333333)  → black-500
dark-5 (#3B3B3B)  → black-400
dark-6 (#444444)  → black-300
```

### Neutral Colors → Gray Scale

```
neutral-6 (#4C4C4C) → gray-950
neutral-5 (#565656) → gray-900
neutral-4 (#606060) → gray-850
neutral-3 (#6A6A6A) → gray-800
neutral-2 (#747474) → gray-650
neutral-1 (#7E7E7E) → gray-550
neutral (#888888)   → gray-500
neutral+1 (#929292) → gray-450
neutral+2 (#9C9C9C) → gray-400
neutral+3 (#A6A6A6) → gray-300
neutral+4 (#B0B0B0) → gray-200
neutral+5 (#BABAAB) → gray-100
neutral+6 (#C4C4C4) → gray-50
```

## Migration Strategy

### Phase 4A: Component-by-Component Migration

Migrate one component category at a time:

1. **Buttons** (ButtonTheme.ts, CopyButton, DownloadButton) - ~50 occurrences
2. **Forms** (InputText, InputSelect, InputTextArea, etc.) - ~80 occurrences
3. **Tables** (Table, TableRow, TableHeaderCell) - ~60 occurrences
4. **Other components** (remaining ~370 occurrences)

### Phase 4B: Test After Each Category

-   [ ] Run full test suite
-   [ ] Visual regression testing
-   [ ] Check light and dark modes
-   [ ] Verify no broken styles

### Phase 4C: Remove Old Color Definitions

-   Remove from `/app/tailwind.config.mts` (lines 174-232)
-   Remove from `/libraries/structure/source/theme/styles/variables.css` if present

## Files Most Affected (Top 20)

```
ButtonTheme.ts
TableHeaderCell.tsx
TableRow.tsx
Table.tsx
InputText.tsx
InputSelect.tsx
InputTextArea.tsx
InputMultipleSelect.tsx
Accordion.tsx
ScrollArea.tsx
SimpleSvgMap.tsx
Markdown.tsx
Code.tsx
JsonNode.tsx
ImageUploader.tsx
ImageSelector.tsx
ImageEditor.tsx
DownloadButton.tsx
CopyButton.tsx
ButtonVariants.ts
```

## Testing Checklist

-   [ ] All buttons render correctly
-   [ ] All form inputs styled properly
-   [ ] Tables display correctly
-   [ ] Dark mode works
-   [ ] Light mode works
-   [ ] No console errors
-   [ ] No TypeScript errors
-   [ ] Build succeeds

## Success Criteria

-   ✅ Zero occurrences of old color classes in codebase
-   ✅ All components using 0-1000 scale
-   ✅ Old color definitions removed from configs
-   ✅ Visual parity maintained
-   ✅ All tests passing

## Notes

-   This is the LARGEST phase - may take multiple work sessions
-   Can pause between component categories
-   Keep old definitions until ALL migration complete
-   Consider pair programming or code review for each category

Need to visit each instance of these below and see if we can apply a new token system bg-a/b/c/etc. and text-a/b/c/etc

// OLD COLORS -- Try not to use these (will be phased out)
white: '#FFFFFF',
light: '#FFFFFF',
'light-1': '#F6F6F6',
'light-2': '#EEEEEE',
'light-3': '#E5E5E5',
'light-4': '#DDDDDD',
'light-5': '#D4D4D4',
'light-6': '#CCCCCC',

                black: '#000000',
                'dark+6': '#000000',
                'dark+5': '#090909',
                'dark+4': '#0B0B0B',
                'dark+3': '#0D0D0D',
                'dark+2': '#0F0F0F',
                'dark+1': '#101010',
                dark: '#111111',
                'dark-1': '#191919',
                'dark-2': '#222222',
                'dark-3': '#2A2A2A',
                'dark-4': '#333333',
                'dark-5': '#3B3B3B',
                'dark-6': '#444444',

                'neutral-6': '#4C4C4C',
                'neutral-5': '#565656',
                'neutral-4': '#606060',
                'neutral-3': '#6A6A6A',
                'neutral-2': '#747474',
                'neutral-1': '#7E7E7E',
                neutral: '#888888',
                'neutral+1': '#929292',
                'neutral+2': '#9C9C9C',
                'neutral+3': '#A6A6A6',
                'neutral+4': '#B0B0B0',
                'neutral+5': '#BABAAB',
                'neutral+6': '#C4C4C4',
