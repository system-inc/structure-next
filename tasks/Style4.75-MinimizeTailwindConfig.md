# Style Cleanup Phase 4.75: Minimize Tailwind Config

**Priority:** Medium
**Estimated Time:** 45 minutes
**Risk:** Low-Medium (requires careful analysis of what's project-specific)
**Dependencies:** Should be done after Style3 (Remove Duplicates) and Style4 (Remove Old Colors)

## Overview

Systematically audit `/app/tailwind.config.mts` and move reusable configuration to Structure layer, leaving only truly project-specific customizations. The goal is a "naked" project config that clearly shows what makes this project unique.

## Philosophy

**Structure layer should provide:**

-   Universal utilities and patterns
-   Sensible defaults that work for any project
-   Framework-agnostic foundation

**Project layer should only contain:**

-   Brand-specific design tokens (opsis-\*)
-   Project-specific utilities (phi spacing)
-   Overrides to Structure defaults
-   Temporary legacy code (marked for removal)

## Current State Analysis

### What's Currently in `/app/tailwind.config.mts`

#### Colors (lines ~22-171)

-   ✅ Keep: Opsis tokenized colors (project-specific semantic tokens)
-   ✅ Keep: Badge colors (project-specific)
-   ❌ Remove: Old color system (lines 173-232) - **Done in Style4**

#### Box Shadows (lines 234-242)

-   🤔 Evaluate: Are these universal or project-specific?
-   `focus`, `01`, `02`, `03`, `04`, `05` shadows
-   **Decision needed:** Move to Structure if universal

#### Font Sizes (lines 243-246)

-   ✅ Keep: `base: ['16px', '24px']` - Could be project-specific
-   ✅ Keep: `ss: '13px'` (semi-small) - Project-specific abbreviation

#### Spacing (lines 247-283)

-   ✅ Keep: Phi spacing system - Project-specific (golden ratio for Phi health brand)
-   This is a core part of the Phi brand identity

#### Keyframes/Animations (lines 284-289)

-   🤔 Evaluate: Already in Structure - are these duplicates?
-   Should verify no duplication with Structure's animations

## Tasks

### 1. Audit Box Shadows

**Current code (lines 234-242):**

```typescript
boxShadow: {
    focus: '0 0 0 2px #007aff, 0 0 0 1px #ffffff',
    '01': '0 1px 2px 0 var(--effects-shadow-subtle-dark)',
    '02': '0 1px 4px 0 var(--effects-shadow-default)',
    '03': '0 1px 12px 0 var(--effects-shadow-default)',
    '04': '0 6px 16px 0 var(--effects-shadow-default-dark)',
    '05': '0 2px 12px 0 var(--effects-shadow-subtle-dark)',
},
```

**Questions:**

-   Are these shadows used across Structure components?
-   Or are they project-specific design choices?

**Action:**

-   If universal → Move to Structure's TailwindConfiguration.ts
-   If project-specific → Keep in project config with comment explaining why

### 2. Check for Duplicate Keyframes/Animations

**Current code (lines 284-289):**

```typescript
keyframes: {
    ...(StructureTailwindConfiguration.theme?.extend?.keyframes || {}),
},
animation: {
    ...(StructureTailwindConfiguration.theme?.extend?.animation || {}),
},
```

**Questions:**

-   Are we just spreading Structure's animations?
-   Or are we adding project-specific ones?

**Action:**

-   If just spreading with no additions → Remove (redundant)
-   If adding project-specific animations → Keep with clear comments

### 3. Verify Font Sizes

**Current code (lines 243-246):**

```typescript
fontSize: {
    base: ['16px', '24px'],
    ss: '13px', // Semi-small
},
```

**Questions:**

-   Is `base` overriding Tailwind default or just restating it?
-   Is `ss` used throughout the project or just a few places?

**Action:**

-   If `base` matches Tailwind default → Remove
-   If `ss` is rarely used → Consider removing and using Tailwind's built-in `text-sm` or `text-xs`
-   Otherwise → Keep with better documentation

### 4. Document What Remains

Add clear comments explaining why each section exists:

```typescript
export const TailwindConfiguration = {
    ...StructureTailwindConfiguration,

    theme: {
        ...StructureTailwindConfiguration.theme,

        extend: {
            ...(StructureTailwindConfiguration.theme?.extend || {}),

            colors: {
                ...(StructureTailwindConfiguration.theme?.extend?.colors || {}),

                // Link colors - Project-specific brand colors
                link: {
                    blue: {
                        DEFAULT: 'var(--link-blue-default)',
                        hover: 'var(--link-blue-hover)',
                        pressed: 'var(--link-blue-pressed)',
                    },
                },

                // OPSIS DESIGN TOKENS - Project-specific semantic colors
                // These extend Structure's base tokens with Phi/Connected branding
                opsis: {
                    // ... opsis tokens ...
                },

                // LEGACY - Remove in Style4
                // OLD COLORS - Deprecated, will be removed
                // ... old color system ...
            },

            // CUSTOM SHADOWS - Project-specific elevation system
            boxShadow: {
                // ... if keeping ...
            },

            // PHI SPACING - Golden ratio spacing for Phi brand identity
            spacing: {
                phi: 'var(--phi)',
                // ... phi spacing ...
            },
        },
    },

    plugins: [
        // Structure plugins provide base typography and utilities
        ...(StructureTailwindConfiguration.plugins || []),
    ],
};
```

## Decision Matrix

For each config section, ask:

| Question                       | Keep in Project   | Move to Structure |
| ------------------------------ | ----------------- | ----------------- |
| Used across multiple projects? | ❌                | ✅                |
| Brand-specific?                | ✅                | ❌                |
| Overrides Structure default?   | ✅                | ❌                |
| Universal utility?             | ❌                | ✅                |
| Temporary/legacy code?         | ✅ (with comment) | ❌                |

## Expected Outcome

**Before (current):**

-   ~300 lines
-   Mix of universal and project-specific
-   Unclear what's intentional vs leftover

**After:**

-   ~150-200 lines (estimate)
-   Clear sections with explanatory comments
-   Obvious what makes this project unique
-   Easy to create new projects by copying Structure

## Testing

-   [ ] Dev server runs without errors
-   [ ] Build succeeds
-   [ ] All colors render correctly
-   [ ] All shadows work as expected
-   [ ] Phi spacing utilities work
-   [ ] No visual regressions

## Success Criteria

-   ✅ Every section in project config has a clear purpose
-   ✅ Nothing duplicates what Structure provides
-   ✅ Comments explain why each customization exists
-   ✅ Easy to identify project-specific vs universal code
-   ✅ New developers can understand the config at a glance

## Notes

-   This is an audit/cleanup task, not a major refactor
-   Conservative approach: when in doubt, keep it in project
-   Can always move to Structure later if pattern emerges across projects
-   Document decisions for future reference
