# Migrate App Utilities to Structure

**Priority:** Medium
**Status:** Not Started

## Overview

The `app/_utilities` folder contains utility functions that should either be:

1. Migrated to `@structure/source/utilities` for reusability across projects
2. Deleted if duplicates of existing structure utilities exist
3. Kept in app if they're truly project-specific (rare)

This task involves auditing each utility, determining its proper home, and migrating or removing as appropriate.

## Current State

### Files in `app/_utilities`:

```
app/_utilities/
├── AccountEntitlement.ts
├── react/
│   ├── ClientOnly.tsx
│   ├── focusFirstFocusableElement.ts
│   ├── getClassNamesByModifier.ts
│   ├── mergeRefs.ts
│   ├── useInView.ts
│   ├── useIsMobile.tsx
│   ├── useMediaQuery.ts
│   └── useSessionStorageState.ts
├── strings/
│   └── stringToEnum.ts
└── time/
    └── dateFromUnixTime.ts
```

## Migration Plan

### Step 1: Audit Each Utility

For each file, determine:

1. **Is it a duplicate?** Check if equivalent exists in `@structure/source/utilities`
2. **Is it project-specific?** Does it reference project-only concepts (AccountEntitlement, Connected-specific logic)?
3. **Is it reusable?** Would other projects benefit from this utility?

### Step 2: React Utilities

**Files to Review:**

-   `ClientOnly.tsx` - Check against `@structure/source/utilities/react/React.tsx`
-   `focusFirstFocusableElement.ts` - DOM utility, likely belongs in structure
-   `getClassNamesByModifier.ts` - Styling utility, check if needed vs `mergeClassNames`
-   `mergeRefs.ts` - React utility, check if duplicate of structure version
-   `useInView.ts` - Hook for intersection observer, likely belongs in structure
-   `useIsMobile.tsx` - Responsive hook, likely belongs in structure
-   `useMediaQuery.ts` - Responsive hook, likely belongs in structure
-   `useSessionStorageState.ts` - Storage hook, belongs in structure

**Action Items:**

-   [ ] Compare each React utility against `@structure/source/utilities/react/React.tsx`
-   [ ] Migrate unique utilities to structure
-   [ ] Update all imports across codebase to use structure versions
-   [ ] Delete app versions after migration

### Step 3: String Utilities

**Files to Review:**

-   `stringToEnum.ts` - Generic string utility

**Action Items:**

-   [ ] Check if `@structure/source/utilities/string/String.ts` exists
-   [ ] If not, create it and migrate `stringToEnum`
-   [ ] Update imports across codebase
-   [ ] Delete app version

### Step 4: Time Utilities

**Files to Review:**

-   `dateFromUnixTime.ts` - Generic time utility

**Action Items:**

-   [ ] Check against `@structure/source/utilities/time/Time.ts`
-   [ ] Migrate if unique, or update references to use existing structure version
-   [ ] Delete app version

### Step 5: Project-Specific Utilities

**Files to Review:**

-   `AccountEntitlement.ts` - Project-specific business logic

**Action Items:**

-   [ ] Determine if this is truly project-specific or if it should be generalized
-   [ ] If project-specific, move to `app/_logic` or appropriate domain folder
-   [ ] If generalizable, refactor and migrate to structure with generic naming

### Step 6: Update All Imports

After migration, update all imports across the codebase:

```bash
# Example migration pattern:
# FROM: import { useInView } from '@project/app/_utilities/react/useInView';
# TO:   import { useInView } from '@structure/source/utilities/react/React';
```

**Action Items:**

-   [ ] Search for all imports from `@project/app/_utilities`
-   [ ] Update to use structure or new locations
-   [ ] Run `npm run compile` to verify no broken imports

### Step 7: Clean Up

**Action Items:**

-   [ ] Delete `app/_utilities` folder entirely
-   [ ] Verify no broken imports with `npm run compile`
-   [ ] Run full test suite to verify functionality unchanged

## Other Utility Folders to Review

The following project-specific utility folders were also found and may need similar review:

-   `app/(main-layout)/tools/_utilities`
-   `app/(main-layout)/tools/subnet-calculator/_utilities`
-   `app/(main-layout)/agents/_utilities`
-   `app/(main-layout)/agents/[agentId]/_dialogs/execution-details/utilities`
-   `app/ops/home/_utilities`
-   `app/_modules/durable-task/services/utilities`

These should be reviewed after the main `app/_utilities` migration to determine if they contain reusable utilities that belong in structure.

## Success Criteria

-   [ ] No `app/_utilities` folder exists
-   [ ] All utilities are either in structure or deleted
-   [ ] No broken imports (`npm run compile` passes)
-   [ ] All tests pass
-   [ ] No functionality changed from user perspective

## Notes

-   Follow the established pattern in `@structure/source/utilities`
-   Maintain alphabetical organization of exports
-   Add proper TypeScript types for all utilities
-   Include JSDoc comments for complex utilities
-   Consider adding tests for critical utilities

## Related Files

-   `/libraries/structure/source/utilities/react/React.tsx` - Main React utilities
-   `/libraries/structure/source/utilities/style/ClassName.ts` - Style utilities
-   `/libraries/structure/source/utilities/time/Time.ts` - Time utilities (if exists)
-   `/libraries/structure/source/utilities/string/String.ts` - String utilities (if exists)
