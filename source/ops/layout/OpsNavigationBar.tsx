'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Shared State
import { atom, useAtom } from 'jotai';

// Dependencies - Hooks
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';

// Dependencies - Main Components
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@structure/source/components/buttons/Button';
import { Link } from '@structure/source/components/navigation/Link';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { Drawer } from '@structure/source/components/drawers/Drawer';
import { OpsNavigation } from './navigation/OpsNavigation';
import { AccountNavigationResponsivePopoverDrawer } from '@structure/source/modules/account/components/navigation/responsive-popover-drawer/AccountNavigationResponsivePopoverDrawer';

// Dependencies - Animation
import { AnimatePresence, motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Shared State
export const opsNavigationOpenAtom = atom(false);

// Menu Icon SVG
const menuIconSvg = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path
            d="M9.75 10.5C9.75 10.6989 9.67098 10.8897 9.53033 11.0303C9.38968 11.171 9.19891 11.25 9 11.25H2.5C2.30109 11.25 2.11032 11.171 1.96967 11.0303C1.82902 10.8897 1.75 10.6989 1.75 10.5C1.75 10.3011 1.82902 10.1103 1.96967 9.96967C2.11032 9.82902 2.30109 9.75 2.5 9.75H9C9.19891 9.75 9.38968 9.82902 9.53033 9.96967C9.67098 10.1103 9.75 10.3011 9.75 10.5ZM2.5 6.25H13.5C13.6989 6.25 13.8897 6.17098 14.0303 6.03033C14.171 5.88968 14.25 5.69891 14.25 5.5C14.25 5.30109 14.171 5.11032 14.0303 4.96967C13.8897 4.82902 13.6989 4.75 13.5 4.75H2.5C2.30109 4.75 2.11032 4.82902 1.96967 4.96967C1.82902 5.11032 1.75 5.30109 1.75 5.5C1.75 5.69891 1.82902 5.88968 1.96967 6.03033C2.11032 6.17098 2.30109 6.25 2.5 6.25Z"
            fill="currentColor"
        />
    </svg>
);

// Component - OpsNavigationBar
export interface OpsNavigationBarProperties {
    logo: React.ReactNode;
}
export function OpsNavigationBar(properties: OpsNavigationBarProperties) {
    // Hooks
    const isMobile = useIsMobile();

    // Shared State
    const [open, setOpen] = useAtom(opsNavigationOpenAtom);

    // Effect to handle the keyboard shortcut (CMD+K or CTRL+K)
    React.useEffect(
        function () {
            function handleKeyDown(event: KeyboardEvent) {
                if((event.metaKey || event.ctrlKey) && event.key === 'k') {
                    event.preventDefault();
                    setOpen(function (previous) {
                        return !previous;
                    });
                }
            }

            window.addEventListener('keydown', handleKeyDown);
            return function () {
                window.removeEventListener('keydown', handleKeyDown);
            };
        },
        [setOpen],
    );

    // Render the component
    return (
        <React.Fragment>
            {/* Top Bar */}
            <div className="relative z-30 h-12 w-full">
                {/* Top Left */}
                <div className="absolute left-2.5 z-30 flex h-12 items-center">
                    <div className={mergeClassNames('mr-4 flex shrink-0 items-center space-x-2')}>
                        {/* Logo */}
                        {properties.logo && (
                            <Link variant="C" href="/" className="relative block aspect-square h-6 shrink-0">
                                {properties.logo}
                            </Link>
                        )}

                        {/* Menu Button - Mobile: Drawer, Desktop: Dialog */}
                        {isMobile ? (
                            <Drawer
                                variant="A"
                                accessibilityTitle="Ops Menu"
                                accessibilityDescription="Navigate through various operational tools and settings"
                                side="Left"
                                open={open}
                                onOpenChange={setOpen}
                                trigger={
                                    <Button
                                        variant="A"
                                        className="h-auto gap-0 rounded-lg bg-transparent! py-1.5"
                                        iconLeft={menuIconSvg}
                                    >
                                        Ops
                                    </Button>
                                }
                                header={
                                    <Link variant="C" href="/" className="relative block h-6 w-6 shrink-0">
                                        {properties.logo}
                                    </Link>
                                }
                                headerClassName="px-2.5 pt-3"
                                bodyClassName="px-0"
                                body={<OpsNavigation />}
                            />
                        ) : (
                            <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
                                <Dialog.Trigger asChild>
                                    <Button
                                        variant="A"
                                        className="h-auto gap-0 rounded-lg bg-transparent! py-1.5"
                                        iconLeft={menuIconSvg}
                                    >
                                        Ops
                                    </Button>
                                </Dialog.Trigger>
                                <Dialog.Portal forceMount>
                                    <AnimatePresence>
                                        {open && (
                                            <Dialog.Content forceMount>
                                                <VisuallyHidden.Root>
                                                    <Dialog.Title>Ops Menu</Dialog.Title>
                                                    <Dialog.Description>
                                                        Navigate through various operational tools and settings.
                                                    </Dialog.Description>
                                                </VisuallyHidden.Root>
                                                <motion.div
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '0%' }}
                                                    exit={{ x: '-100%' }}
                                                    transition={{
                                                        type: 'tween',
                                                        duration: 0.5,
                                                        ease: [0.075, 0.82, 0.165, 1],
                                                    }}
                                                    className="fixed top-10 bottom-0 left-0 p-2"
                                                >
                                                    <ScrollArea containerClassName="w-56 rounded-lg border border--0 background--2">
                                                        <OpsNavigation />
                                                    </ScrollArea>
                                                </motion.div>
                                            </Dialog.Content>
                                        )}
                                    </AnimatePresence>
                                </Dialog.Portal>
                            </Dialog.Root>
                        )}
                    </div>
                </div>

                {/* Top Right */}
                <div className="absolute right-3 z-30 flex h-12 items-center">
                    <AccountNavigationResponsivePopoverDrawer variant="B" triggerVariant="B" />
                </div>
            </div>
        </React.Fragment>
    );
}
