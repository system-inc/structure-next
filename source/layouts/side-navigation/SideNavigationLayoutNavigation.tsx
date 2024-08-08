// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - Main Components
import SideNavigationLayoutNavigationTop from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationTop';
import SideNavigationLayoutNavigationSide from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSide';

// Dependencies - Shared State
import { atom } from 'jotai';
import { atomWithDefault, atomWithStorage } from 'jotai/utils';

// Dependencies - Animation
import { easings } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Settings
export const sideNavigationLayoutLocalStorageKey = StructureSettings.identifier + 'SideNavigationLayoutNavigation';
export const desktopMinimumWidth = 768;
export const defaultNavigationWidth = 288;
export const minimumNavigationWidth = 244;
export const maximumNavigationWidth = 488;

// Shared State - Side Navigation Layout Navigation Open (with storage)
export const sideNavigationLayoutNavigationOpenPreferenceAtom = atomWithStorage<boolean>(
    sideNavigationLayoutLocalStorageKey + 'Open', // Key
    true, // Default value
    undefined, // Storage type (defaults to localStorage)
    {
        getOnInit: true, // Get the value on initialization (this is important for SSR)
    },
);

// Shared State - Side Navigation Layout Navigation Open
export const sideNavigationLayoutNavigationOpenAtom = atomWithDefault<boolean>(function (get) {
    return get(sideNavigationLayoutNavigationOpenPreferenceAtom);
});

// Shared State - Set Side Navigation Layout Navigation Open
// This is a write-only atom that sets the side navigation state
// This helps with avoiding re-renders because the function will never update even when the state changes
// It also has the added benefit of being able to conditionally set local storage to remember the state (no need to do it in the component)
export const setSideNavigationLayoutNavigationOpenAtom = atom(null, function (get, set, open: boolean) {
    // Set the state
    set(sideNavigationLayoutNavigationOpenAtom, open);

    // If on desktop
    if(window.innerWidth >= desktopMinimumWidth) {
        // Set the shared state using with storage
        // We want to remember the state on desktop but on mobile we don't remember if the side is open
        set(sideNavigationLayoutNavigationOpenPreferenceAtom, open);
    }
});

// Shared State - Side Navigation Layout Navigation Width (with storage)
export const sideNavigationLayoutNavigationWidthPreferenceAtom = atomWithStorage<number>(
    sideNavigationLayoutLocalStorageKey + 'Width', // Key
    defaultNavigationWidth, // Default value
    undefined, // Storage type (defaults to localStorage)
    {
        getOnInit: true, // Get the value on initialization (this is important for SSR)
    },
);

// Shared State - Side Navigation Layout Navigation is Resizing
export const sideNavigationLayoutNavigationIsResizingAtom = atom<boolean>(false);

// Spring to animate the navigation
// Shared with SideNavigationLayoutContent for consistent animation
export const sideNavigationLayoutNavigationSpringConfiguration = {
    easing: easings.easeOutExpo,
    duration: 400,
};

// Component - SideNavigationLayoutNavigation
export interface SideNavigationLayoutNavigationInterface {
    children: React.ReactNode;
    className?: string;
}
export function SideNavigationLayoutNavigation(properties: SideNavigationLayoutNavigationInterface) {
    // Render the component
    return (
        <>
            {/* Top */}
            <SideNavigationLayoutNavigationTop className="" />

            {/* Side */}
            <SideNavigationLayoutNavigationSide className={mergeClassNames(properties.className)}>
                {properties.children}
            </SideNavigationLayoutNavigationSide>
        </>
    );
}

// Export - Default
export default SideNavigationLayoutNavigation;
