# Unified Icon System - Modernization Plan

**Priority:** High
**Status:** In Planning
**Last Updated:** 2025-10-18

## Vision

Create a unified `@icon` import system that wraps Phosphor Icons (SSR), supports Structure custom icons, and provides a consistent API across all icon sources with perfect tree-shaking and excellent developer experience.

## Goals

-   **Unified Import Pattern**: Single `@icon` import for ALL icons (Phosphor, Structure custom, Project-specific)
-   **Phosphor Compatibility**: Match Phosphor's SSR patterns and ergonomics exactly
-   **Override System**: Structure/Project icons can override Phosphor icons by name
-   **Future-Proof**: Ability to swap icon libraries or gradually replace Phosphor icons with custom designs
-   **SSR-Safe**: All icons work in Next.js Server Components
-   **Tree-Shaking**: Maintain perfect tree-shaking with barrel exports
-   **Type-Safe**: Full TypeScript autocomplete for all available icons

## Research Summary

### Phosphor Icons Architecture (v2.1.10)

**Component Structure:**

-   **IconBase** (CSR): Uses React Context for default props propagation
-   **SSRBase** (SSR): Pure component with hard-coded defaults, no Context
-   Individual icon components wrap either base with pre-built weight Maps

**Props Interface:**

```typescript
interface IconProps {
    alt?: string;           // Accessibility
    color?: string;         // currentColor default
    size?: string | number; // Flexible units (px, em, rem, %, etc.)
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    mirrored?: boolean;     // RTL support
    className?: string;
    // ... extends all SVG element props
}
```

**Weight System:**

-   Map-based: `Map<IconWeight, ReactElement>` per icon
-   6 weights: thin, light, regular, bold, fill, duotone
-   Runtime selection with fallback to 'regular'

**SSR Strategy:**

-   Two export paths: `@phosphor-icons/react` (CSR) and `@phosphor-icons/react/ssr` (SSR)
-   SSR version has no Context dependency
-   Both versions support same props API

**Export Pattern:**

-   Barrel exports: `export { Chart, Chart as ChartIcon }`
-   `"sideEffects": false` enables tree-shaking
-   Modern bundlers (Webpack 5+, Vite, Next.js) handle barrel imports correctly
-   Each icon is separate ES module

**Key Insights:**

-   ViewBox standardized: `0 0 256 256`
-   Transform for mirroring: `scale(-1, 1)`
-   Composability: Icons accept SVG children
-   ForwardRef pattern for DOM access
-   No runtime overhead, build-time optimized

### Current Icon System Analysis

**Icon Sources:**

1. **Structure SVG Icons** (~120 icons)

    - Located: `@structure/assets/icons/[category]/`
    - 26 categorical subdirectories
    - Imported via SVGR: `import Icon from '@structure/assets/icons/interface/ArchiveIcon.svg'`
    - ~50% marked as `valid: false` in registry
    - No weight/variant system

2. **Phosphor Icons** (~9000 icons)

    - Imported: `import { CheckCircleIcon } from '@phosphor-icons/react'`
    - Full weight support
    - Used for tools, status, general UI

3. **Project Custom Icons** (~20 icons)
    - Located: `@project/app/_assets/icons/[category]/`
    - TypeScript components with inline SVG
    - Examples: ConnectedOutlineIcon, flag icons

**Current Props Patterns:**

```typescript
// Structure SVGs - minimal props
<ArchiveIcon className="h-4 w-4" />

// Phosphor - rich props
<WarningCircleIcon size={14} weight="bold" className="text-white" />

// Project custom - className only
interface CustomIconProperties { className?: string; }
```

**Pain Points:**

-   Three separate icon systems with different APIs
-   Manual Icons.ts registry (error-prone)
-   No unified weight/variant system
-   Mixed import patterns across codebase
-   TipIcon component detects icon type at runtime
-   No icon discoverability/documentation
-   Categorical folders create organizational overhead

## Design Decisions

### ✅ Architectural Choices

1. **Unified `@icon` Import System**

    - Wrap ALL icons under single namespace
    - Resolution priority: Project → Structure → Phosphor
    - Consistent API regardless of source

2. **Flat Structure** (No Categories)

    - All icons in `@structure/source/icons/`
    - Simpler organization, easier to find
    - Matches Phosphor's pattern

3. **Single SSR-Safe Approach**

    - No dual CSR/SSR exports (simpler than Phosphor)
    - All icons SSR-compatible by default
    - No React Context (explicit props always)
    - Works everywhere: Server Components, Client Components

4. **Single Weight Initially**

    - Start with 'regular' weight only
    - Infrastructure ready for future variants
    - Can add weights incrementally

5. **Barrel Exports for Maximum DX**

    - `import { ChartIcon, UserIcon } from '@icon'` (recommended)
    - `import { ChartIcon } from '@icon/ChartIcon'` (also supported)
    - Modern bundlers handle tree-shaking correctly
    - Matches Phosphor's documented pattern

6. **Migrate Valid + Audit Invalid**
    - Convert ~60 valid icons immediately
    - Create audit task for ~60 invalid icons
    - Clean slate for quality standards

### Tree-Shaking Strategy

**✅ GOOD - Named imports from barrel:**

```typescript
import { ChartIcon, UserIcon, ArchiveIcon } from '@icon';
// Result: Only 3 icons in bundle (perfectly tree-shaken)
// Modern bundlers (Webpack 5, Vite, Next.js) handle this correctly
```

**✅ GOOD - Individual imports:**

```typescript
import { ChartIcon } from '@icon/ChartIcon';
// Result: Only ChartIcon in bundle
```

**❌ BAD - Namespace import:**

```typescript
import * as Icons from '@icon';
const Icon = Icons[iconName];
// Result: ALL icons in bundle (no tree-shaking)
```

**Key Insight:** Phosphor successfully uses barrel exports with tree-shaking. Modern bundlers perform deep scope analysis and eliminate unused exports. Only namespace imports (`import *`) break tree-shaking.

## Implementation Plan

### Phase 1: Core Infrastructure

**1.1 Create Icon Base Components**

-   `@structure/source/icons/internal/IconBase.tsx`
    -   SSR-safe base component (no Context)
    -   Unified props interface matching Phosphor
    -   Support: className, size, weight, color, mirrored, all SVG props
    -   ForwardRef pattern for DOM access

**1.2 Directory Structure**

```
@structure/source/icons/
├── internal/
│   ├── IconBase.tsx           # Base component
│   ├── IconProperties.ts      # Shared types
│   └── utilities/             # Helper functions
├── ChartIcon.tsx              # Re-exported from Phosphor
├── UserIcon.tsx               # Re-exported from Phosphor
├── ArchiveIcon.tsx            # Custom Structure icon
├── CustomIcon.tsx             # Custom Structure icon
└── index.ts                   # Barrel export (auto-generated)
```

**1.3 TypeScript Configuration**

```json
// tsconfig.json
{
    "compilerOptions": {
        "paths": {
            "@icon": ["./libraries/structure/source/icons/index.ts"],
            "@icon/*": ["./libraries/structure/source/icons/*"]
        }
    }
}
```

### Phase 2: Auto-Generation System

**2.1 Icon Generator Script**

-   Create `scripts/generate-icon-wrappers.ts`
-   Read Phosphor SSR icon list from node_modules
-   Generate re-exports for each Phosphor icon:
    ```typescript
    // Auto-generated: ChartIcon.tsx
    export { Chart as ChartIcon } from '@phosphor-icons/react/ssr';
    ```
-   Check for Structure/Project overrides (skip re-export if custom version exists)
-   Track source in dev mode: `data-icon-source="phosphor"`

**2.2 Generate Barrel Export**

-   Auto-generate `@structure/source/icons/index.ts`
-   Export ALL icons (Structure custom + Phosphor wrapped)
-   TypeScript types for autocomplete
-   Naming convention: `*Icon` suffix (e.g., Chart → ChartIcon)

**2.3 Build Integration**

```json
// package.json scripts
{
    "icons:generate": "tsx scripts/generate-icon-wrappers.ts",
    "postinstall": "npm run icons:generate",
    "build": "npm run icons:generate && next build"
}
```

### Phase 3: Migrate Valid Structure Icons

**3.1 Convert ~60 Valid Icons**

-   Icons marked `valid: true` in current registry
-   Convert SVG to IconBase pattern
-   Move to flat structure: `@structure/source/icons/[IconName].tsx`
-   Single weight (regular), infrastructure ready for variants
-   Examples:
    -   ArchiveIcon
    -   ArrowUpIcon
    -   ArrowDownIcon
    -   CheckIcon
    -   ChevronDownIcon
    -   DownloadIcon
    -   (... ~54 more)

**3.2 Icon Override Strategy**

```typescript
// If @structure/source/icons/ChartIcon.tsx exists:
// - Use Structure custom version
// - Don't generate Phosphor re-export
// - Auto-detected by generator script

// Developer workflow:
// 1. Want custom Chart icon? Create ChartIcon.tsx
// 2. Run icons:generate (skips Phosphor re-export)
// 3. Consumers unchanged: import { ChartIcon } from '@icon'
```

**3.3 Audit Invalid Icons**

-   Create `/libraries/structure/tasks/IconAudit.md`
-   Document ~60 invalid icons:
    -   List each icon name
    -   Note current issues
    -   Mark for: redesign, deprecation, or migrate as-is
-   Separate initiative from main migration

### Phase 4: Codebase Migration

**4.1 Create Codemod Script**

-   `scripts/migrate-icon-imports.ts`
-   Find all icon imports:
    -   `@phosphor-icons/react` → `@icon`
    -   `@structure/assets/icons/*` → `@icon`
    -   `@project/app/_assets/icons/*` → `@icon`
-   Handle naming transformations:
    -   Phosphor: `Chart` → `ChartIcon`
    -   Structure: Already suffixed with Icon
-   Dry-run mode for safety
-   Batch processing with file backups

**4.2 Update Components**

-   Remove `@structure/assets/icons/Icons.ts` registry
-   Update `TipIcon` to use unified system (remove type detection)
-   Update `ToolUtilities.ts` icon mapping
-   Fix dynamic icon creation (add React.memo for stability)
-   Update flag icons to new pattern

**4.3 Clean Up**

-   Remove `@structure/assets/icons/` directory
-   Remove `@project/app/_assets/icons/` (if fully migrated)
-   Remove icon-related webpack config (SVGR no longer needed for icons)
-   Update CLAUDE.md import guidelines
-   Remove old ESLint import rules for icons

### Phase 5: Documentation & Polish

**5.1 ESLint Rules**

```typescript
// Add rule to prevent namespace imports
// ❌ Forbidden
import * as Icons from '@icon';

// ✅ Allowed - barrel imports (tree-shaken)
import { ChartIcon, UserIcon } from '@icon';

// ✅ Allowed - individual imports
import { ChartIcon } from '@icon/ChartIcon';
```

**5.2 Documentation**
Create `@structure/source/icons/README.md`:

-   Icon system overview
-   Import patterns and examples
-   How to add custom icons
-   Override priority explanation
-   Weight system (current + future)
-   SSR compatibility notes
-   Contributing guidelines

**5.3 Developer Tools**

-   Add `data-icon-source` attribute in dev mode
-   Type generation for autocomplete
-   Future: Icon preview/browser component
-   Future: Icon search CLI tool

## Example Usage

### Before (Current System)

```typescript
// Three different import patterns
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { ConnectedOutlineIcon } from '@project/app/_assets/icons/connected/ConnectedOutlineIcon';

// Different prop interfaces
<ArrowUpIcon className="h-3 w-3" />
<WarningCircleIcon size={14} weight="bold" className="text-white" />
<ConnectedOutlineIcon className="cursor-pointer" />
```

### After (Unified System)

```typescript
// Single import pattern for ALL icons
import { ArrowUpIcon, CheckCircleIcon, WarningCircleIcon, ConnectedOutlineIcon } from '@icon';

// Consistent props interface
<ArrowUpIcon className="h-4 w-4" />
<ArrowUpIcon size={16} />  // Also supports size prop now
<WarningCircleIcon size={14} weight="bold" className="text-white" />
<CheckCircleIcon size={24} weight="regular" />
<ConnectedOutlineIcon className="cursor-pointer" size={20} />
```

### Adding Custom Icon

```typescript
// File: @structure/source/icons/MyCustomIcon.tsx
import React from 'react';
import { IconBase } from '@structure/source/icons/internal/IconBase';
import type { IconProperties } from '@structure/source/icons/internal/IconProperties';

export function MyCustomIcon(properties: IconProperties) {
    return (
        <IconBase {...properties}>
            <path d="M..." />  {/* Your SVG path */}
        </IconBase>
    );
}

// Auto-included in barrel export (index.ts)
// Usage: import { MyCustomIcon } from '@icon';
```

### Overriding Phosphor Icon

```typescript
// Phosphor has ChartIcon, but you want custom version
// 1. Create @structure/source/icons/ChartIcon.tsx (custom design)
// 2. Run npm run icons:generate
// 3. Generator skips Phosphor re-export (Structure version takes priority)
// 4. All imports automatically use your custom version
// 5. No code changes needed in consumers
```

## Technical Considerations

### SSR Compatibility

-   All icons use SSR-safe base (no Context, no client-only code)
-   Works in Next.js Server Components
-   No hydration mismatches
-   Pure React components

### Performance

-   Tree-shaking verified with modern bundlers
-   Each icon is separate module
-   `"sideEffects": false` in package.json
-   Lazy loading possible with dynamic imports
-   No runtime overhead

### Type Safety

```typescript
// Auto-generated types
export type IconName =
  | 'ArrowUp'
  | 'Chart'
  | 'User'
  | 'Archive'
  // ... all available icons

// Usage
import type { IconName } from '@icon';
const iconName: IconName = 'Chart';  // Type-safe
```

### Migration Strategy

1. Run icon generator (creates @icon exports)
2. Both old and new imports work temporarily
3. Run codemod to migrate imports
4. Test thoroughly
5. Remove old icon directories
6. No breaking changes for end users

## Success Metrics

-   ✅ Single import path for all icons (`@icon`)
-   ✅ Consistent API (IconProperties interface)
-   ✅ Perfect tree-shaking maintained
-   ✅ SSR-compatible (works in Server Components)
-   ✅ Type-safe (autocomplete for all icons)
-   ✅ ~60 valid Structure icons migrated
-   ✅ All Phosphor icons wrapped and accessible
-   ✅ Zero breaking changes (old imports work during transition)
-   ✅ Documentation complete
-   ✅ Codebase fully migrated

## Future Enhancements

### Weight System

-   Add support for multiple weights (thin, light, bold, fill, duotone)
-   Generate variants from base SVG
-   Tooling to create weight variations

### Icon Browser

-   Web UI to preview all icons
-   Search and filter
-   Copy import statements
-   View icon source (Phosphor vs Structure vs Project)

### Optimization

-   Sprite sheets for repeated icons
-   SVG optimization pipeline
-   Size analysis tool

### Ecosystem

-   CLI tool for icon search
-   VSCode extension for icon preview
-   Figma plugin for icon export

## Related Files

-   Current registry: `@structure/assets/icons/Icons.ts` (to be removed)
-   Tool icons: `@structure/source/modules/connected/utilities/ToolUtilities.ts`
-   Icon component: `@structure/source/common/tips/TipIcon.tsx`
-   Project icons: `@project/app/_assets/icons/`
-   Webpack config: `NextConfiguration.mjs` (SVGR setup)

## References

-   Phosphor Icons: https://phosphoricons.com
-   Phosphor React Package: `node_modules/@phosphor-icons/react`
-   Tree-shaking docs: https://webpack.js.org/guides/tree-shaking/
-   Next.js App Router: https://nextjs.org/docs/app
