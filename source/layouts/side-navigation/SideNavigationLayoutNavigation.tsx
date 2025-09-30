// Dependencies - Main Components
import { SideNavigationLayoutNavigationTop } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationTop';
import { SideNavigationLayoutNavigationSide } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSide';

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
    return identifier + 'SideNavigationLayoutNavigation';
}

// Shared State - Atoms
const atomsForNavigationOpen = new Map<string, ReturnType<typeof atom<boolean>>>();
const atomsForNavigationWidth = new Map<string, ReturnType<typeof atomWithStorage<number>>>();
const atomsForNavigationManuallyClosed = new Map<string, ReturnType<typeof atomWithStorage<boolean>>>();
const atomsForNavigationIsResizing = new Map<string, ReturnType<typeof atom<boolean>>>();
const atomsForNavigationIsOpeningByDrag = new Map<string, ReturnType<typeof atom<boolean>>>();
const atomsForNavigationIsClosingByWindowResize = new Map<string, ReturnType<typeof atom<boolean>>>();

// Function to get an atom for navigation open
export function getAtomForNavigationOpen(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationOpen.has(identifier)) {
        // Check session storage to see if the navigation was manually closed
        const manuallyClosed =
            typeof sessionStorage !== 'undefined'
                ? sessionStorage.getItem(getSideNavigationLayoutLocalStorageKey(identifier) + 'ManuallyClosed') ===
                  'true'
                : false;

        // Determine the default open state
        let openInitialState = !manuallyClosed;

        // If on mobile always start closed
        if(typeof window !== 'undefined' && window.innerWidth < desktopMinimumWidth) {
            openInitialState = false;
        }

        // Create the atom
        atomsForNavigationOpen.set(identifier, atom<boolean>(openInitialState));
    }

    return atomsForNavigationOpen.get(identifier)!;
}

// Function to get an atom for navigation width
export function getAtomForNavigationWidth(identifier: string, customDefaultWidth?: number) {
    const defaultWidth = customDefaultWidth ?? defaultNavigationWidth;

    // If the atom does not exist
    if(!atomsForNavigationWidth.has(identifier)) {
        // Create the atom
        atomsForNavigationWidth.set(
            identifier,
            atomWithStorage<number>(
                getSideNavigationLayoutLocalStorageKey(identifier) + 'Width', // Key
                defaultWidth, // Default value
                // Use session storage to isolate the state to the current tab
                typeof sessionStorage !== 'undefined'
                    ? createJSONStorage(function () {
                          return sessionStorage;
                      })
                    : undefined,
                {
                    getOnInit: true, // Get the value on initialization (this is important for SSR)
                },
            ),
        );
    }

    return atomsForNavigationWidth.get(identifier)!;
}

// Function to get an atom for navigation manually closed
export function getAtomForNavigationManuallyClosed(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationManuallyClosed.has(identifier)) {
        // Create the atom
        atomsForNavigationManuallyClosed.set(
            identifier,
            atomWithStorage<boolean>(
                getSideNavigationLayoutLocalStorageKey(identifier) + 'ManuallyClosed', // Key
                false, // Default value
                // Use session storage to isolate the state to the current tab
                typeof sessionStorage !== 'undefined'
                    ? createJSONStorage(function () {
                          return sessionStorage;
                      })
                    : undefined,
                {
                    getOnInit: true, // Get the value on initialization (this is important for SSR)
                },
            ),
        );
    }

    return atomsForNavigationManuallyClosed.get(identifier)!;
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

// Function to get an atom for navigation is opening by drag
export function getAtomForNavigationIsOpeningByDrag(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationIsOpeningByDrag.has(identifier)) {
        // Create the atom
        atomsForNavigationIsOpeningByDrag.set(identifier, atom<boolean>(false));
    }

    return atomsForNavigationIsOpeningByDrag.get(identifier)!;
}

// Function to get an atom for navigation is closing by window resize
export function getAtomForNavigationIsClosingByWindowResize(identifier: string) {
    // If the atom does not exist
    if(!atomsForNavigationIsClosingByWindowResize.has(identifier)) {
        // Create the atom
        atomsForNavigationIsClosingByWindowResize.set(identifier, atom<boolean>(false));
    }

    return atomsForNavigationIsClosingByWindowResize.get(identifier)!;
}

// Spring to animate the navigation
// Shared with SideNavigationLayoutContent for consistent animation
export const sideNavigationLayoutNavigationSpringConfiguration = {
    easing: easings.easeOutExpo,
    duration: 400,
};

// Component - SideNavigationLayoutNavigation
export interface SideNavigationLayoutNavigationProperties {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    layout?: 'Fixed' | 'Flex'; // Layout mode: 'Fixed' for standalone pages, 'Flex' for nested in flex containers (default: 'Fixed')
    children: React.ReactNode;
    className?: string;
    topClassName?: string;
    showHeader?: boolean;
    showHeaderBorder?: boolean;
    topTitle?: React.ReactNode;
    defaultNavigationWidth?: number; // Default width of the navigation sidebar in pixels (default: 288)
    minimumNavigationWidth?: number; // Minimum width of the navigation sidebar in pixels (default: 244)
    maximumNavigationWidth?: number; // Maximum width of the navigation sidebar in pixels (default: 488)
    alwaysShowNavigationOnDesktop?: boolean; // When true, prevents navigation from being collapsed or hidden on desktop (mobile behavior unchanged)
}
export function SideNavigationLayoutNavigation(properties: SideNavigationLayoutNavigationProperties) {
    // Defaults
    const layout = properties.layout ?? 'Fixed';
    const showHeader = properties.showHeader ?? false;
    const showHeaderBorder = properties.showHeaderBorder ?? true;

    // Render the component
    return (
        <>
            {/* Top */}
            <SideNavigationLayoutNavigationTop
                layoutIdentifier={properties.layoutIdentifier}
                className={properties.topClassName}
                showHeader={showHeader}
                showHeaderBorder={showHeaderBorder}
                title={properties.topTitle}
            />

            {/* Side */}
            <SideNavigationLayoutNavigationSide
                layoutIdentifier={properties.layoutIdentifier}
                layout={layout}
                className={properties.className}
                showHeader={showHeader}
                defaultNavigationWidth={properties.defaultNavigationWidth}
                minimumNavigationWidth={properties.minimumNavigationWidth}
                maximumNavigationWidth={properties.maximumNavigationWidth}
                alwaysShowNavigationOnDesktop={properties.alwaysShowNavigationOnDesktop}
            >
                {properties.children}
            </SideNavigationLayoutNavigationSide>
        </>
    );
}
