# Migrate Ticket System to Structure

## Context

The ticket/support system currently exists in the project code under the ops module. This system should be migrated to the Structure library to make it reusable across projects.

**Current Location:** Project code
**Target Location:** Structure library

## Current Structure

```
ops/
├── components/
│   ├── BorderContainer.tsx
│   ├── TicketInformation.tsx
│   ├── customer-and-ticket-side-panel/
│   │   ├── CustomerAndTicketSidePanel.tsx
│   │   ├── CustomerAndTicketSidePanelHeader.tsx
│   │   ├── CustomerAndTicketSidePanelTypes.ts
│   │   ├── customer/
│   │   │   └── CustomerDetails.tsx
│   │   └── ticket/
│   │       └── TicketDetails.tsx
│   ├── ticket-list/
│   │   ├── TicketList.tsx
│   │   ├── TicketListHeader.tsx
│   │   └── TicketListItem.tsx
│   └── tickets/
│       ├── Ticket.tsx
│       ├── TicketCommentAttachments.tsx
│       ├── TicketComments.tsx
│       ├── TicketHeader.tsx
│       ├── TicketMessageForm.tsx
│       └── TicketStatusAndAssignment.tsx
├── hooks/
│   └── useSupportTicketsPrivileged.tsx
├── layouts/
│   ├── OpsSupportLayout.tsx
│   └── OpsSupportNavigation.tsx
└── pages/
    └── OpsSupportPage.tsx
```

## Goal

Migrate the ticket system to Structure library with proper separation of concerns:

-   **Structure**: Reusable UI components and presentation logic
-   **Project**: Business logic, API hooks, and project-specific implementations

## Target Structure

### In Structure Library

```
libraries/structure/source/modules/support/
├── components/
│   ├── BorderContainer.tsx (if generic enough)
│   ├── TicketInformation.tsx
│   ├── customer-and-ticket-side-panel/
│   │   ├── CustomerAndTicketSidePanel.tsx
│   │   ├── CustomerAndTicketSidePanelHeader.tsx
│   │   ├── CustomerAndTicketSidePanelTypes.ts
│   │   ├── customer/
│   │   │   └── CustomerDetails.tsx
│   │   └── ticket/
│   │       └── TicketDetails.tsx
│   ├── ticket-list/
│   │   ├── TicketList.tsx
│   │   ├── TicketListHeader.tsx
│   │   └── TicketListItem.tsx
│   └── tickets/
│       ├── Ticket.tsx
│       ├── TicketCommentAttachments.tsx
│       ├── TicketComments.tsx
│       ├── TicketHeader.tsx
│       ├── TicketMessageForm.tsx
│       └── TicketStatusAndAssignment.tsx
└── layouts/
    ├── SupportLayout.tsx (renamed from OpsSupportLayout)
    └── SupportNavigation.tsx (renamed from OpsSupportNavigation)
```

### In Project Code

```
app/(ops-layout)/ops/support/
├── _hooks/
│   └── useSupportTicketsPrivileged.tsx
├── _components/
│   └── [any project-specific wrappers]
└── page.tsx (uses Structure components)
```

## Implementation Steps

### Phase 1: Analysis and Planning

1. **Audit each component** to identify:

    - Project-specific dependencies (API hooks, GraphQL queries, business logic)
    - Generic UI logic that belongs in Structure
    - Hardcoded values that should become props
    - Color/theme dependencies that need variants

2. **Identify shared types and interfaces**:

    - Ticket data structures
    - Customer data structures
    - Comment/attachment structures
    - Status and assignment types

3. **Document API contracts** between components

### Phase 2: Create Structure Foundation

1. **Create type definitions** in Structure:

    ```typescript
    // libraries/structure/source/modules/support/types/
    // - TicketTypes.ts
    // - CustomerTypes.ts
    // - CommentTypes.ts
    ```

2. **Create base components** (most generic first):

    - BorderContainer (if generic enough, otherwise keep in project)
    - TicketInformation
    - Customer/Ticket side panel components
    - Ticket list components
    - Ticket detail components

3. **Extract presentation logic**:
    - Convert API hooks to props
    - Move data fetching to parent components
    - Make components controlled where appropriate

### Phase 3: Migrate Components

For each component group:

1. **Create Structure version**:

    ```typescript
    // Remove project-specific imports
    // Accept data and callbacks as props
    // Use generic types from Structure
    // Update imports to use @structure paths
    ```

2. **Create project wrapper** (if needed):

    ```typescript
    // Handle API calls
    // Manage state
    // Pass data to Structure component
    ```

3. **Update prop interfaces**:
    ```typescript
    interface TicketProperties {
        ticket: TicketInterface;
        customer?: CustomerInterface;
        comments?: CommentInterface[];
        onStatusChange?: (status: string) => Promise<void>;
        onAssignmentChange?: (userId: string) => Promise<void>;
        onCommentSubmit?: (comment: string, attachments?: File[]) => Promise<void>;
        isLoading?: boolean;
        error?: Error | null;
    }
    ```

### Phase 4: Migrate Layouts

1. **SupportLayout.tsx**:

    - Move to Structure
    - Accept navigation items as props
    - Remove project-specific navigation logic

2. **SupportNavigation.tsx**:
    - Move to Structure
    - Accept navigation configuration as props

### Phase 5: Create Project Integration

1. **Create support page** in project:

    ```typescript
    // app/(ops-layout)/ops/support/page.tsx
    import { SupportLayout } from '@structure/source/modules/support/layouts/SupportLayout';
    import { useSupportTicketsPrivileged } from './_hooks/useSupportTicketsPrivileged';

    export default function OpsSupportPage() {
        const tickets = useSupportTicketsPrivileged();

        return (
            <SupportLayout
                tickets={tickets.data}
                isLoading={tickets.isLoading}
                error={tickets.error}
                onTicketSelect={handleTicketSelect}
                // ... other props
            />
        );
    }
    ```

2. **Keep API hooks in project**:
    - useSupportTicketsPrivileged
    - Any other GraphQL/API hooks

### Phase 6: Handle Styling and Theming

1. **Identify color dependencies**:

    - Border colors
    - Status indicator colors
    - Priority colors
    - Any opsis-specific colors

2. **Create theme variants** if needed:

    - Add to project's component themes
    - Follow ButtonTheme pattern

3. **Ensure components are theme-agnostic**:
    - Use semantic color names
    - Accept className overrides
    - Support dark/light modes

### Phase 7: Testing and Migration

1. **Test Structure components in isolation**
2. **Migrate one route at a time**
3. **Verify functionality matches original**
4. **Update all imports throughout project**
5. **Remove old ops components after verification**

## Refactoring Patterns

### Pattern 1: Extract API Logic to Parent

```tsx
// ❌ Before - Component handles API
function TicketList() {
    const tickets = useSupportTicketsPrivileged();
    return <div>{tickets.data.map(...)}</div>;
}

// ✅ After - Structure component receives data
function TicketList(properties: TicketListProperties) {
    return <div>{properties.tickets.map(...)}</div>;
}

// ✅ Project wrapper handles API
function TicketListWrapper() {
    const tickets = useSupportTicketsPrivileged();
    return <TicketList tickets={tickets.data} isLoading={tickets.isLoading} />;
}
```

### Pattern 2: Convert to Controlled Components

```tsx
// ❌ Before - Internal state
function TicketStatusSelector() {
    const [status, setStatus] = React.useState('open');
    return <Select value={status} onChange={setStatus} />;
}

// ✅ After - Controlled by parent
function TicketStatusSelector(properties: TicketStatusSelectorProperties) {
    return <Select value={properties.status} onChange={properties.onStatusChange} />;
}
```

### Pattern 3: Generic Type Interfaces

```tsx
// ❌ Before - Project-specific GraphQL types
import { SupportTicketFragment } from '@project/graphql/generated';

function Ticket(properties: { ticket: SupportTicketFragment }) {
    // ...
}

// ✅ After - Generic Structure interface
import { TicketInterface } from '@structure/source/modules/support/types/TicketTypes';

function Ticket(properties: { ticket: TicketInterface }) {
    // ...
}

// ✅ Project maps GraphQL to Structure interface
const structureTicket: TicketInterface = mapGraphQLTicketToStructureTicket(graphqlTicket);
```

## Considerations

### Keep in Project

-   All API hooks (GraphQL queries, mutations)
-   Business logic specific to Connected
-   Project-specific navigation items
-   Customer data fetching logic
-   Permission/authorization logic

### Move to Structure

-   All UI components
-   Layout components (generic versions)
-   Type interfaces for data structures
-   Presentation logic
-   Form validation (generic)
-   Formatting utilities (if generic)

### Shared Between Both

-   Some utilities might need to be duplicated
-   Project may extend Structure interfaces
-   Project themes augment Structure themes

## Benefits After Completion

-   ✅ Reusable ticket/support system across projects
-   ✅ Clear separation of UI and business logic
-   ✅ Easier to test components in isolation
-   ✅ Can use support module in Phi or future projects
-   ✅ Better component organization
-   ✅ Consistent with other Structure modules

## Related Files

-   Current: `/app/(ops-layout)/ops/` - All current ops components
-   Target: `/libraries/structure/source/modules/support/` - New home in Structure
-   Examples: `/libraries/structure/source/modules/marketing/` - Similar module structure
-   Reference: `MigrateEmailCollectionForm.md` - Similar migration pattern

## Priority

Medium - This is a significant refactoring that will improve code organization and reusability. Not blocking current functionality, but valuable for long-term maintainability and potential reuse in Phi project.

## Notes

-   This is a large migration - consider doing it incrementally
-   Start with the most generic/isolated components first
-   BorderContainer might stay in project if it's too specific
-   Maintain backward compatibility during migration
-   Consider creating mapper functions to convert GraphQL types to Structure types
-   Document the mapping between project data structures and Structure interfaces
-   May discover opportunities for additional Structure components during migration
