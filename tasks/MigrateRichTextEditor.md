# Migrate Rich Text Editor to Structure

## Context

The Rich Text Editor component currently exists in project code at `app/_components/rich-text-editor/`. This is a generic Lexical-based editor that should be migrated to the Structure library to make it reusable across projects.

**Current Location:** `/app/_components/rich-text-editor/`
**Target Location:** `/libraries/structure/source/components/rich-text-editor/`

**⚠️ NAMING DECISION REQUIRED:** The name "RichTextEditor" is generic and overused. Before migration, debate and choose a better name. Candidates include:

-   **ComposerEditor** - Emphasizes composing messages/content (recommended)
-   **MessageComposer** - Clear for messaging, but may be too specific
-   **ContentEditor** - Flexible but generic
-   **ProseEditor** - Clean, literary feel
-   **LexicalComposer** - Makes Lexical foundation explicit

The chosen name should be used consistently throughout the migration for the main component, folder name, and all related files.

## Current Structure

```
app/_components/rich-text-editor/
├── RichTextEditor.tsx          # Main editor component
├── ToolbarPlugin.tsx           # Toolbar with formatting buttons
├── AttachmentBar.tsx           # Display attached files
├── AttachmentModal.tsx         # Upload attachments dialog
├── FloatingLinkEditor.tsx      # Link editing UI (unused)
├── ResetPlugin.tsx             # Plugin to reset editor content
└── AutoLinkPlugin.tsx          # Auto-detect and linkify URLs/emails
```

## Current Usage

Currently used in only one location:

-   `app/ops/support/_components/ticket/TicketMessageForm.tsx` - Support ticket reply form

## Dependencies Analysis

### Project-Specific Dependencies

1. **AttachmentBar.tsx**:

    - Imports `getFileTypeIconFromType` from `@project/app/_components/form/FileDropField`
    - Uses `opsis-*` color classes (project-specific theming)

2. **AttachmentModal.tsx**:

    - Imports `FileDropField` from `@project/app/_components/form/FileDropField`
    - Uses basic styling (could be made generic)

3. **ToolbarPlugin.tsx**:

    - Uses `opsis-*` color classes for background/borders
    - Otherwise generic functionality

4. **RichTextEditor.tsx**:
    - Hardcoded namespace: `PhiEditor` (should be configurable)
    - Uses `phi-base-*` spacing classes in theme
    - Otherwise generic Lexical implementation

### Generic Components (Easy Migration)

-   **ResetPlugin.tsx** - Pure Lexical plugin, no dependencies
-   **AutoLinkPlugin.tsx** - Pure Lexical plugin, no dependencies
-   **FloatingLinkEditor.tsx** - Currently unused, pure Lexical

## Goal

Migrate the Rich Text Editor to Structure library with proper separation:

-   **Structure**: Core editor functionality, plugins, and UI components
-   **Project**: Project-specific theming, file handling utilities, and integrations

## Target Structure

### In Structure Library

```
libraries/structure/source/components/rich-text-editor/
├── RichTextEditor.tsx                  # Main editor component (generic)
├── plugins/
│   ├── ToolbarPlugin.tsx              # Toolbar (themeable)
│   ├── ResetPlugin.tsx                # Reset plugin
│   └── AutoLinkPlugin.tsx             # Auto-link plugin
├── components/
│   ├── AttachmentBar.tsx              # Attachment display (generic)
│   └── AttachmentModal.tsx            # Attachment upload (generic)
├── types/
│   └── RichTextEditorTypes.ts         # Shared types
└── utilities/
    └── RichTextEditorTheme.ts         # Default theme configuration
```

### In Project Code

```
app/_components/rich-text-editor/
├── RichTextEditorWrapper.tsx          # Project-specific wrapper with opsis theme
└── utilities/
    └── fileTypeIcons.ts               # File type icon mapping (extracted from FileDropField)
```

## Implementation Steps

### Phase 1: Prepare Utilities and Dependencies

1. **Extract file type icon utility** from FileDropField:

    ```typescript
    // app/_utilities/fileTypeIcons.ts
    export function getFileTypeIconFromType(type: string): React.FunctionComponent<...> {
        // Move from FileDropField.tsx
    }
    ```

2. **Create generic theme configuration**:

    ```typescript
    // libraries/structure/source/components/rich-text-editor/utilities/RichTextEditorTheme.ts
    export interface RichTextEditorThemeConfig {
        namespace?: string;
        textSizeClass?: string;
        colors?: {
            background?: string;
            border?: string;
            borderFocus?: string;
        };
    }

    export function createEditorTheme(config?: RichTextEditorThemeConfig) {
        // Return Lexical theme object
    }
    ```

### Phase 2: Migrate Core Components

1. **Migrate ResetPlugin.tsx** (no changes needed):

    - Copy to `libraries/structure/source/components/rich-text-editor/plugins/ResetPlugin.tsx`
    - Update exports

2. **Migrate AutoLinkPlugin.tsx** (no changes needed):

    - Copy to `libraries/structure/source/components/rich-text-editor/plugins/AutoLinkPlugin.tsx`
    - Update exports

3. **Migrate FloatingLinkEditor.tsx** (for future use):
    - Copy to `libraries/structure/source/components/rich-text-editor/components/FloatingLinkEditor.tsx`
    - Make themeable

### Phase 3: Migrate AttachmentBar

```typescript
// libraries/structure/source/components/rich-text-editor/components/AttachmentBar.tsx

export interface AttachmentBarProperties {
    files: File[];
    onRemoveFile: (index: number) => void;
    isDisabled?: boolean;
    getFileIcon?: (type: string) => React.ComponentType<any>; // Injectable icon resolver
    className?: string;
    fileItemClassName?: string;
}

export function AttachmentBar(properties: AttachmentBarProperties) {
    // Remove opsis-* classes, use generic/themeable classes
    // Accept getFileIcon as prop instead of importing project-specific utility
    // Use mergeClassNames for flexible styling
}
```

### Phase 4: Migrate AttachmentModal

```typescript
// libraries/structure/source/components/rich-text-editor/components/AttachmentModal.tsx

export interface AttachmentModalProperties {
    isOpen: boolean;
    onClose: () => void;
    onSave: (files: File[]) => void;
    accept?: string[];
    multiple?: boolean;
    renderFileInput?: (properties: FileInputRenderProperties) => React.ReactNode; // Injectable
}

export function AttachmentModal(properties: AttachmentModalProperties) {
    // Remove dependency on project FileDropField
    // Either:
    // Option A: Use basic HTML file input with drag/drop
    // Option B: Accept renderFileInput prop for custom file selection UI
    // Option C: Import Structure's FileDrop if it exists
}
```

### Phase 5: Migrate ToolbarPlugin

```typescript
// libraries/structure/source/components/rich-text-editor/plugins/ToolbarPlugin.tsx

export interface ToolbarPluginProperties {
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
    isDisabled?: boolean;
    showLoading?: boolean;
    submitButtonText?: string;
    submitButtonLoadingText?: string;
    className?: string;
    getFileIcon?: (type: string) => React.ComponentType<any>;
}

export function ToolbarPlugin(properties: ToolbarPluginProperties) {
    // Remove opsis-* color classes
    // Use CSS variables or accept className overrides
    // Make background/border themeable
    // Pass getFileIcon to AttachmentBar
}
```

### Phase 6: Migrate RichTextEditor

```typescript
// libraries/structure/source/components/rich-text-editor/RichTextEditor.tsx

export interface RichTextEditorProperties {
    type: 'markdown' | 'html' | 'json';
    className?: string;
    initialContent?: string;
    onChange?: (content: { markdown: string; html: string; json: string }) => void;
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
    isDisabled?: boolean;
    showLoading?: boolean;
    shouldReset?: boolean;
    onResetComplete?: () => void;
    textSize?: 'xs' | 'sm' | 'base' | 'lg';

    // New themeable props
    namespace?: string; // Default: 'RichTextEditor'
    theme?: RichTextEditorThemeConfig;
    toolbarClassName?: string;
    submitButtonText?: string;
    getFileIcon?: (type: string) => React.ComponentType<any>;
}

export function RichTextEditor(properties: RichTextEditorProperties) {
    // Remove hardcoded 'PhiEditor' namespace
    // Remove phi-base-* spacing classes
    // Use createEditorTheme() utility
    // Pass all theme/icon props down to children
}
```

### Phase 7: Create Project Wrapper (Optional)

If you want to maintain a project-specific wrapper with defaults:

```typescript
// app/_components/rich-text-editor/RichTextEditorWrapper.tsx

import { RichTextEditor, RichTextEditorProperties } from '@structure/source/components/rich-text-editor/RichTextEditor';
import { getFileTypeIconFromType } from '@project/app/_utilities/fileTypeIcons';

type RichTextEditorWrapperProperties = Omit<
    RichTextEditorProperties,
    'namespace' | 'getFileIcon'
>;

export function RichTextEditorWrapper(properties: RichTextEditorWrapperProperties) {
    return (
        <RichTextEditor
            {...properties}
            namespace="ConnectedEditor"
            getFileIcon={getFileTypeIconFromType}
            theme={{
                colors: {
                    background: 'var(--opsis-background-primary)',
                    border: 'var(--opsis-border-primary)',
                    borderFocus: 'var(--opsis-border-focus)',
                },
            }}
        />
    );
}
```

### Phase 8: Handle AttachmentModal Dependencies

**Decision Point**: How to handle file upload UI in AttachmentModal?

**Option A: Basic HTML Input** (Simplest)

-   Use native `<input type="file">` with basic drag/drop
-   No dependencies on project components
-   Less polished UX

**Option B: Render Prop Pattern** (Most Flexible)

-   Accept `renderFileInput` prop
-   Project passes FileDropField implementation
-   Structure provides basic fallback

**Option C: Check if FileDrop exists in Structure** (Best if available)

-   Check if `@structure/source/components/form/FileDrop` exists
-   If yes, use it; if no, use Option A or B

### Phase 9: Update TicketMessageForm

```typescript
// app/ops/support/_components/ticket/TicketMessageForm.tsx

// Before:
import { RichTextEditor } from '@project/app/_components/rich-text-editor/RichTextEditor';

// After (if using wrapper):
import { RichTextEditorWrapper } from '@project/app/_components/rich-text-editor/RichTextEditorWrapper';

// Or (if direct):
import { RichTextEditor } from '@structure/source/components/rich-text-editor/RichTextEditor';
import { getFileTypeIconFromType } from '@project/app/_utilities/fileTypeIcons';

// In component:
<RichTextEditor
    // ... existing props
    getFileIcon={getFileTypeIconFromType}
    namespace="ConnectedEditor"
/>
```

### Phase 10: Testing and Cleanup

1. Test editor in TicketMessageForm
2. Verify all formatting buttons work
3. Test file attachments
4. Test reset functionality
5. Verify markdown/HTML/JSON export
6. Test disabled state and loading state
7. Remove old project components if using wrapper

## Theming Strategy

### CSS Variable Approach (Recommended)

Instead of hardcoded `opsis-*` classes, use CSS variables:

```tsx
// In ToolbarPlugin
<div className="border-t bg-[var(--editor-toolbar-background)] border-[var(--editor-toolbar-border)]">
```

Project defines variables:

```css
/* app/_theme/styles/theme.css */
:root {
    --editor-toolbar-background: var(--opsis-background-primary);
    --editor-toolbar-border: var(--opsis-border-primary);
}
```

### Tailwind Class Override Approach

Accept className props for all major sections:

```tsx
<div
    className={mergeClassNames(
        'border-neutral-3 bg-neutral-1 border-t', // Defaults
        properties.toolbarClassName,
    )}
/>
```

## Migration Checklist

### Preparation

-   [ ] Extract `getFileTypeIconFromType` from FileDropField to standalone utility
-   [ ] Create `RichTextEditorTypes.ts` with shared interfaces
-   [ ] Create `RichTextEditorTheme.ts` utility
-   [ ] Decide on AttachmentModal file input approach

### Core Plugins (No Dependencies)

-   [ ] Migrate ResetPlugin.tsx
-   [ ] Migrate AutoLinkPlugin.tsx
-   [ ] Migrate FloatingLinkEditor.tsx (optional)

### UI Components

-   [ ] Migrate AttachmentBar with injectable icon resolver
-   [ ] Migrate AttachmentModal with file input strategy
-   [ ] Migrate ToolbarPlugin with themeable classes

### Main Component

-   [ ] Migrate RichTextEditor with configurable namespace
-   [ ] Remove hardcoded spacing classes
-   [ ] Make theme configurable
-   [ ] Add all theme/customization props

### Integration

-   [ ] Create project wrapper (optional)
-   [ ] Update TicketMessageForm imports
-   [ ] Test all functionality
-   [ ] Verify theming works correctly

### Cleanup

-   [ ] Remove old project components (if using wrapper)
-   [ ] Update any documentation
-   [ ] Add examples to Structure docs

## Considerations

### Keep in Project

-   File type icon mapping (`getFileTypeIconFromType`)
-   Opsis-specific theme configuration
-   Project-specific wrapper (optional)
-   FileDropField component (already in project)

### Move to Structure

-   RichTextEditor core component
-   All Lexical plugins
-   AttachmentBar and AttachmentModal (generic versions)
-   ToolbarPlugin
-   Theme utilities
-   Type definitions

### Shared Between Both

-   RichTextEditor can accept theme overrides from project
-   AttachmentBar can accept custom icon resolver
-   All components should accept className overrides

## Benefits After Completion

-   ✅ Reusable rich text editor across projects
-   ✅ Can use in Phi for health notes, journal entries, etc.
-   ✅ Themeable and customizable
-   ✅ Clean separation of concerns
-   ✅ Easier to maintain and test
-   ✅ Can add features once, available everywhere

## Related Files

-   Current: `/app/_components/rich-text-editor/` - All current editor components
-   Target: `/libraries/structure/source/components/rich-text-editor/` - New home
-   Usage: `/app/ops/support/_components/ticket/TicketMessageForm.tsx` - Only current usage
-   Dependency: `/app/_components/form/FileDropField.tsx` - Extract icon utility from here

## Priority

Medium - This is a valuable generic component that would benefit both Connected and Phi projects. The editor is currently only used in one location, making migration lower risk. Good candidate for incremental migration.

## Notes

-   Lexical is a generic editor library, so most of the code is already framework-agnostic
-   Main challenges are theming and file handling dependencies
-   Consider if FileDropField itself should be in Structure (separate task)
-   The editor currently has link functionality commented out - could be enabled during migration
-   Consider adding more editor features during migration:
    -   Image upload/paste
    -   Code blocks with syntax highlighting
    -   Tables
    -   Slash commands for snippets
    -   Mentions/autocomplete
-   May want to create a "minimal" and "full" version of the editor
-   Consider creating a standalone package for the editor if it becomes substantial

## Open Questions

1. Should FileDropField also be migrated to Structure? (Separate task?)
2. Which AttachmentModal approach to use (A, B, or C)?
3. Should we enable the commented-out link editing functionality?
4. Do we want different editor variants (minimal, standard, full)?
5. Should the editor support plugins from project code?
