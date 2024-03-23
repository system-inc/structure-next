'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { MenuInterface, Menu } from '@structure/source/common/interactions/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - ContextMenu
export interface ContextMenuInterface extends MenuInterface {
    // Menu
    closeOnItemSelect?: boolean;

    // Radix Context Menu Root
    modal?: boolean;
    onOpenChange?: (open: boolean) => void;

    // Radix Context Menu Content
    onCloseAutoFocus?: (event: Event) => void;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionPadding?: number;
    collisionBoundary?: HTMLElement[];
}
export function ContextMenu(properties: ContextMenuInterface) {
    // Get the menu properties to spread onto the Menu component
    const {
        modal,
        onOpenChange,
        onCloseAutoFocus,
        alignOffset,
        avoidCollisions,
        collisionPadding,
        collisionBoundary,
        ...menuProperties
    } = properties;

    // Render the component
    return (
        <RadixContextMenu.Root onOpenChange={properties.onOpenChange} modal={properties.modal}>
            <RadixContextMenu.Trigger>{properties.children}</RadixContextMenu.Trigger>
            <RadixContextMenu.Portal>
                <RadixContextMenu.Content
                    onCloseAutoFocus={properties.onCloseAutoFocus}
                    alignOffset={properties.alignOffset}
                    avoidCollisions={properties.avoidCollisions}
                    collisionPadding={properties.collisionPadding}
                    collisionBoundary={properties.collisionBoundary}
                    // Use Radix variables to style the popover content size
                    style={{
                        maxWidth: 'var(--radix-context-menu-content-available-width)',
                        maxHeight: 'var(--radix-context-menu-content-available-height)',
                    }}
                >
                    <Menu {...menuProperties} className={mergeClassNames('z-40', properties.className)} />
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    );
}

// Export - Default
export default ContextMenu;
