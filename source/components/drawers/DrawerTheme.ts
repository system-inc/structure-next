// Drawer theme types
export type DrawerSide = 'Top' | 'Bottom' | 'Left' | 'Right';

// Drawer theme configuration
export interface DrawerThemeConfiguration {
    configuration: {
        // Base classes for the drawer wrapper
        baseWrapperClasses: string[];
        // Base classes for the drawer content (scrollable area)
        baseContentClasses: string[];
        // Overlay classes
        overlayClasses: string[];
        // Default variant
        defaultSide?: DrawerSide;
    };
    // Side variants (Top, Bottom, Left, Right)
    sides: {
        [K in DrawerSide]: {
            wrapperClasses: string[];
            contentClasses: string[];
        };
    };
}

// Default drawer theme
export const drawerTheme: DrawerThemeConfiguration = {
    configuration: {
        baseWrapperClasses: ['w-full', 'fixed', 'inset-x-0', 'h-auto', 'background--0', 'transition-colors', 'z-50'],
        baseContentClasses: [
            'h-min',
            'relative',
            'overflow-y-auto',
            'overflow-x-clip',
            'background--0',
            'p-3',
            'transition-colors',
        ],
        overlayClasses: ['fixed', 'inset-0', 'background--backdrop', 'transition-colors', 'z-40'],
        defaultSide: 'Bottom',
    },
    sides: {
        Top: {
            wrapperClasses: ['max-h-screen', 'top-12', 'inset-x-0'],
            contentClasses: [],
        },
        Bottom: {
            wrapperClasses: ['bottom-0', 'max-h-[80vh]', 'rounded-t-3xl', 'border-t', 'border--0'],
            contentClasses: ['rounded-t-3xl', 'py-6', 'max-h-[80dvh]'],
        },
        Right: {
            wrapperClasses: ['right-0', 'inset-y-0', 'h-screen', 'w-screen'],
            contentClasses: [],
        },
        Left: {
            wrapperClasses: ['left-0', 'inset-y-0', 'h-screen', 'w-screen'],
            contentClasses: [],
        },
    },
};
