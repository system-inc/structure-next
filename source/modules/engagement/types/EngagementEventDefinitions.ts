// Type - EngagementEventCategory
export type EngagementEventCategory = 'Navigation' | 'Interaction' | 'Commerce';

// Interface - BaseEventData
// Base event data that all events can include
export interface BaseEventData {
    elementIdentifier?: string; // e.g., 'createMonitorButton', 'hostInput'
    elementLabel?: string; // e.g., 'Create Monitor', 'Host'
}

// ===== NAVIGATION EVENTS =====

// Interface - PageViewEventData
export interface PageViewEventData extends BaseEventData {
    pageLoadDurationInMilliseconds?: number;
    previousPageDurationInMilliseconds?: number;
    previousPageTitle?: string;
    previousPageIdentifier?: string;
}

// Interface - PageLeaveEventData
export interface PageLeaveEventData extends BaseEventData {
    pageDurationInMilliseconds?: number;
}

// Interface - SectionViewEventData
export interface SectionViewEventData extends BaseEventData {
    sectionIdentifier: string; // Required
    sectionTitle?: string;
}

// ===== INTERACTION EVENTS =====

// Interface - ButtonPressEventData
export interface ButtonPressEventData extends BaseEventData {
    buttonIdentifier: string; // Required - e.g., 'createMonitor', 'executeTools'
    buttonLabel?: string; // e.g., 'Begin Monitoring'
    context?: Record<string, unknown>; // Additional context
}

// Interface - FormSubmitEventData
export interface FormSubmitEventData extends BaseEventData {
    formIdentifier: string; // Required - e.g., 'monitorForm', 'toolConfigurationForm'
    formData?: Record<string, unknown>; // Sanitized form values (no passwords)
}

// Interface - PopoverOpenEventData
export interface PopoverOpenEventData extends BaseEventData {
    popoverIdentifier: string; // Required
    popoverTitle?: string;
}

// Interface - AccordionExpandEventData
export interface AccordionExpandEventData extends BaseEventData {
    accordionItemIdentifier: string; // Required
    accordionItemTitle?: string;
}

// Interface - SelectChangeEventData
export interface SelectChangeEventData extends BaseEventData {
    selectIdentifier: string; // Required - e.g., 'toolSelector', 'regionSelector'
    selectedValue: string; // The selected value
    previousValue?: string;
}

// Interface - ToggleChangeEventData
export interface ToggleChangeEventData extends BaseEventData {
    toggleIdentifier: string; // Required - e.g., 'manualExecutionsFilter'
    enabled: boolean;
}

// ===== COMMERCE EVENTS (Phi-specific, kept for e-commerce analytics) =====

// Interface - AddToCartEventData
export interface AddToCartEventData extends BaseEventData {
    items: Array<{
        productName: string;
        productSku: string;
        quantity: number;
        unitPrice: number; // In cents
    }>;
    amount: number; // Total in cents
}

// ===== EVENT MAP =====

// Interface - EngagementEventMap
// Maps event names to their data types for type-safe event collection
export interface EngagementEventMap {
    // Navigation
    PageView: PageViewEventData;
    PageLeave: PageLeaveEventData;
    SectionView: SectionViewEventData;

    // Interaction
    ButtonPress: ButtonPressEventData;
    FormSubmit: FormSubmitEventData;
    PopoverOpen: PopoverOpenEventData;
    AccordionExpand: AccordionExpandEventData;
    SelectChange: SelectChangeEventData;
    ToggleChange: ToggleChangeEventData;

    // Commerce (Phi-specific)
    AddToCart: AddToCartEventData;
}

// Type - EngagementEventName
export type EngagementEventName = keyof EngagementEventMap;

// ===== EVENT REGISTRY =====

// Interface - EngagementEventRegistryEntry
export interface EngagementEventRegistryEntry {
    category: EngagementEventCategory;
    icon: string;
    colorClass: string;
}

// Constant - engagementEventRegistry
// Registry containing category and rendering metadata for each event type
export const engagementEventRegistry: Record<EngagementEventName, EngagementEventRegistryEntry> = {
    // Navigation
    PageView: { category: 'Navigation', icon: '→', colorClass: 'content--informative' },
    PageLeave: { category: 'Navigation', icon: '←', colorClass: 'content--2' },
    SectionView: { category: 'Navigation', icon: '◇', colorClass: 'content--3' },

    // Interaction
    ButtonPress: { category: 'Interaction', icon: '●', colorClass: 'content--informative' },
    FormSubmit: { category: 'Interaction', icon: '✓', colorClass: 'content--positive' },
    PopoverOpen: { category: 'Interaction', icon: '◉', colorClass: 'content--3' },
    AccordionExpand: { category: 'Interaction', icon: '▼', colorClass: 'content--3' },
    SelectChange: { category: 'Interaction', icon: '◆', colorClass: 'content--informative' },
    ToggleChange: { category: 'Interaction', icon: '◐', colorClass: 'content--informative' },

    // Commerce
    AddToCart: { category: 'Commerce', icon: '🛒', colorClass: 'content--positive' },
};

// Function - getEventDisplayText
// Returns the display text for an event based on its type and data
export function getEventDisplayText(
    eventName: string,
    eventData: Record<string, unknown> | undefined,
    viewIdentifier?: string,
): string {
    const data = eventData || {};

    switch(eventName) {
        case 'PageView':
            return viewIdentifier || '/';

        case 'PageLeave': {
            const path = viewIdentifier || '/';
            const duration = data.pageDurationInMilliseconds as number | undefined;
            if(duration) {
                return `${path} (${formatDuration(duration)})`;
            }
            return path;
        }

        case 'SectionView':
            return `#${data.sectionIdentifier || 'unknown'}`;

        case 'ButtonPress':
            return (data.buttonLabel as string) || (data.buttonIdentifier as string) || 'button';

        case 'FormSubmit': {
            const formId = (data.formIdentifier as string) || 'form';
            const formData = data.formData as Record<string, unknown> | undefined;
            if(formData && Object.keys(formData).length > 0) {
                const fields = formatFormData(formData);
                return `${formId}: ${fields}`;
            }
            return `submit: ${formId}`;
        }

        case 'PopoverOpen':
            return `popover: ${data.popoverIdentifier || 'unknown'}`;

        case 'AccordionExpand':
            return `expand: ${data.accordionItemIdentifier || 'unknown'}`;

        case 'SelectChange':
            return `select: ${data.selectedValue || 'unknown'}`;

        case 'ToggleChange':
            return `toggle: ${data.toggleIdentifier || 'unknown'} → ${data.enabled ? 'on' : 'off'}`;

        case 'AddToCart':
            return viewIdentifier ? `🛒 ${viewIdentifier}` : '🛒 add to cart';

        default:
            return viewIdentifier || '/';
    }
}

// Function - formatDuration (helper)
function formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    if(seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if(remainingSeconds === 0) {
        return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
}

// Function - formatFormData (helper)
// Formats form data into a readable string for display
function formatFormData(formData: Record<string, unknown>): string {
    const parts: string[] = [];

    for(const [key, value] of Object.entries(formData)) {
        // Skip null/undefined values
        if(value === null || value === undefined) {
            continue;
        }

        // Format the value based on type
        let formattedValue: string;
        if(typeof value === 'boolean') {
            formattedValue = value ? '✓' : '✗';
        }
        else if(typeof value === 'number') {
            formattedValue = String(value);
        }
        else if(typeof value === 'string') {
            // Truncate long strings
            formattedValue = value.length > 20 ? value.substring(0, 20) + '…' : value;
        }
        else {
            // Skip complex objects
            continue;
        }

        // Format key: remove "has" prefix and convert camelCase to readable format
        let formattedKey = key;
        if(formattedKey.startsWith('has')) {
            formattedKey = formattedKey.substring(3);
            formattedKey = formattedKey.charAt(0).toLowerCase() + formattedKey.slice(1);
        }

        parts.push(`${formattedKey}=${formattedValue}`);
    }

    return parts.join(', ');
}
