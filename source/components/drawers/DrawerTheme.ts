// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Drawer theme types
export type DrawerSide = 'Top' | 'Bottom' | 'Left' | 'Right';

// Drawer theme configuration
export interface DrawerThemeConfiguration {
    configuration: {
        // Base classes for the drawer wrapper
        baseWrapperClasses: string;
        // Overlay classes
        overlayClasses: string;
        // Default variant
        defaultSide?: DrawerSide;
    };
    // Side variants (Top, Bottom, Left, Right)
    sides: {
        [K in DrawerSide]: {
            wrapperClasses: string;
        };
    };
}

// Default drawer theme
export const drawerTheme: DrawerThemeConfiguration = {
    configuration: {
        baseWrapperClasses: mergeClassNames('fixed inset-x-0 h-auto w-full', 'background--0', 'z-50', 'flex flex-col'),
        overlayClasses: mergeClassNames('fixed inset-0 z-40 background--backdrop'),
        defaultSide: 'Bottom',
    },
    sides: {
        Top: {
            wrapperClasses: 'max-h-screen top-12 inset-x-0',
        },
        Bottom: {
            wrapperClasses: 'bottom-0 max-h-[80vh] rounded-t-3xl border-t border--0',
        },
        Right: {
            wrapperClasses: 'right-0 inset-y-0 h-screen w-screen',
        },
        Left: {
            wrapperClasses: 'left-0 inset-y-0 h-screen w-screen',
        },
    },
};
