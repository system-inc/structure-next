'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { MenuProperties, Menu } from '@structure/source/common/menus/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ContextMenu
export interface ContextMenuProperties extends MenuProperties {
    containerClassName?: string;

    // Menu
    closeOnItemSelected?: boolean;

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
export function ContextMenu(properties: ContextMenuProperties) {
    // Create a copy of properties for Menu component, excluding Radix Context Menu specific props
    const menuProperties = { ...properties };

    // Delete Radix Context Menu specific properties
    delete menuProperties.modal;
    delete menuProperties.onOpenChange;
    delete menuProperties.onCloseAutoFocus;
    delete menuProperties.alignOffset;
    delete menuProperties.avoidCollisions;
    delete menuProperties.collisionPadding;
    delete menuProperties.collisionBoundary;

    // Render the component
    return (
        <RadixContextMenu.Root onOpenChange={properties.onOpenChange} modal={properties.modal}>
            <RadixContextMenu.Trigger>{properties.children}</RadixContextMenu.Trigger>
            <RadixContextMenu.Portal>
                <RadixContextMenu.Content
                    className={mergeClassNames('z-30', properties.containerClassName)}
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
                    <Menu {...menuProperties} className={mergeClassNames('text-xs', properties.className)} />
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    );
}
