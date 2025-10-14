'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { MenuProperties, Menu } from '@structure/source/components/menus/Menu';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
export function ContextMenu({
    modal,
    onOpenChange,
    onCloseAutoFocus,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    collisionBoundary,
    children,
    containerClassName,
    className,
    ...menuProperties
}: ContextMenuProperties) {
    // Render the component
    return (
        <RadixContextMenu.Root onOpenChange={onOpenChange} modal={modal}>
            <RadixContextMenu.Trigger>{children}</RadixContextMenu.Trigger>
            <RadixContextMenu.Portal>
                <RadixContextMenu.Content
                    className={mergeClassNames('z-30', containerClassName)}
                    onCloseAutoFocus={onCloseAutoFocus}
                    alignOffset={alignOffset}
                    avoidCollisions={avoidCollisions}
                    collisionPadding={collisionPadding}
                    collisionBoundary={collisionBoundary}
                    // Use Radix variables to style the popover content size
                    style={{
                        maxWidth: 'var(--radix-context-menu-content-available-width)',
                        maxHeight: 'var(--radix-context-menu-content-available-height)',
                    }}
                >
                    <Menu {...menuProperties} className={mergeClassNames('text-xs', className)} />
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    );
}
