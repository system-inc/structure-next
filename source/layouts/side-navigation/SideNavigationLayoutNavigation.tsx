// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - Main Components
import SideNavigationLayoutNavigationTop from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationTop';
import SideNavigationLayoutNavigationSide from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSide';

// Dependencies - Shared State
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// Dependencies - Animation
import { easings } from '@react-spring/web';

// Settings
export const desktopMinimumWidth = 768;
export const defaultNavigationWidth = 288;
export const minimumNavigationWidth = 244;
export const maximumNavigationWidth = 488;

// Settings - Customizable Local Storage Key
export function getSideNavigationLayoutLocalStorageKey(identifier: string) {
    return StructureSettings.identifier + identifier + 'SideNavigationLayoutNavigation';
}

// Shared State - Atoms
const atomsForNavigationOpen = new Map<string, ReturnType<typeof atomWithStorage<boolean>>>();
const atomsForNavigationWidth = new Map<string, ReturnType<typeof atomWithStorage<number>>>();
const atomsForNavigationIsResizing = new Map<string, ReturnType<typeof atom<boolean>>>();

// Function to get an atom for navigation open
export function getAtomForNavigationOpen(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationOpen.has(identifier)) {
        // Create the atom
        atomsForNavigationOpen.set(
            identifier,
            atomWithStorage<boolean>(
                getSideNavigationLayoutLocalStorageKey(identifier) + 'Open', // Key
                true, // Default value
                // Use session storage to isolate the state to the current tab
                createJSONStorage(function () {
                    return sessionStorage;
                }),
                {
                    getOnInit: true, // Get the value on initialization (this is important for SSR)
                },
            ),
        );
    }

    return atomsForNavigationOpen.get(identifier)!;
}

// Function to get an atom for navigation width
export function getAtomForNavigationWidth(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationWidth.has(identifier)) {
        // Create the atom
        atomsForNavigationWidth.set(
            identifier,
            atomWithStorage<number>(
                getSideNavigationLayoutLocalStorageKey(identifier) + 'Width', // Key
                defaultNavigationWidth, // Default value
                // Use session storage to isolate the state to the current tab
                createJSONStorage(function () {
                    return sessionStorage;
                }),
                {
                    getOnInit: true, // Get the value on initialization (this is important for SSR)
                },
            ),
        );
    }

    return atomsForNavigationWidth.get(identifier)!;
}

// Function to get an atom for navigation is resizing
export function getAtomForNavigationIsResizing(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationIsResizing.has(identifier)) {
        // Create the atom
        atomsForNavigationIsResizing.set(identifier, atom<boolean>(false));
    }

    return atomsForNavigationIsResizing.get(identifier)!;
}

// Spring to animate the navigation
// Shared with SideNavigationLayoutContent for consistent animation
export const sideNavigationLayoutNavigationSpringConfiguration = {
    easing: easings.easeOutExpo,
    duration: 400,
};

// Component - SideNavigationLayoutNavigation
export interface SideNavigationLayoutNavigationInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    children: React.ReactNode;
    className?: string;
    topClassName?: string;
    topBar?: boolean;
}
export function SideNavigationLayoutNavigation(properties: SideNavigationLayoutNavigationInterface) {
    // Defaults
    const topBar = properties.topBar ?? false;

    // Render the component
    return (
        <>
            {/* Top */}
            <SideNavigationLayoutNavigationTop
                layoutIdentifier={properties.layoutIdentifier}
                className={properties.topClassName}
                topBar={topBar}
            />

            {/* Side */}
            <SideNavigationLayoutNavigationSide
                layoutIdentifier={properties.layoutIdentifier}
                className={properties.className}
                topBar={topBar}
            >
                {properties.children}
            </SideNavigationLayoutNavigationSide>
        </>
    );
}

// Export - Default
export default SideNavigationLayoutNavigation;
