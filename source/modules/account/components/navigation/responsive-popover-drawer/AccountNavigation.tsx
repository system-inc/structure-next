'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useResponsivePopoverDrawerContext } from '@structure/source/components/popovers/responsive/ResponsivePopoverDrawer';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { AccountNavigationBannerButton } from './AccountNavigationBannerButton';
import { ThemeToggle } from '@structure/source/theme/components/ThemeToggle';
import { AccountNavigationLink } from '@structure/source/modules/account/components/navigation/responsive-popover-drawer/AccountNavigationLink';

// Dependencies - Assets
import { ArrowRightIcon, CircleHalfIcon } from '@phosphor-icons/react/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Types
import {
    AccountNavigationLinkInterface,
    AccountNavigationFilterFunction,
} from '@structure/source/modules/account/components/navigation/types/AccountNavigationTypes';

// Component - AccountNavigation
export interface AccountNavigationProperties {
    signedOutHeader?: React.ReactNode;
    navigationLinks: AccountNavigationLinkInterface[];
    shouldShowNavigationLink: AccountNavigationFilterFunction;
    close: () => void;
}
export function AccountNavigation(properties: AccountNavigationProperties) {
    // Hooks
    const account = useAccount();
    const responsivePopoverDrawerContext = useResponsivePopoverDrawerContext();

    // Determine display context based on isMobile
    const displayContext = responsivePopoverDrawerContext.isMobile ? 'Drawer' : 'Popover';

    // Filter administrator links
    const administratorLinks = properties.navigationLinks.filter(function (link) {
        return (
            link.role === 'Administrator' &&
            properties.shouldShowNavigationLink(
                link,
                displayContext,
                null,
                account.data?.isAdministrator() ?? false,
                account.signedIn,
            )
        );
    });

    // Filter regular account links
    const regularLinks = properties.navigationLinks.filter(function (link) {
        return (
            link.role === 'Any' &&
            properties.shouldShowNavigationLink(
                link,
                displayContext,
                null,
                account.data?.isAdministrator() ?? false,
                account.signedIn,
            )
        );
    });

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'flex h-full flex-col px-2 py-2',
                // Desktop
                'md:max-h-[calc(100vh-8rem)]',
                // Mobile
                '',
            )}
        >
            {/* Fixed Profile Section at Top */}
            <div className="flex w-full shrink-0 flex-col">
                {account.signedIn ? (
                    <AccountNavigationBannerButton onClick={properties.close} />
                ) : (
                    properties.signedOutHeader
                )}

                {/* Administrator Links */}
                {administratorLinks.length > 0 && (
                    <>
                        <HorizontalRule className="mt-2" />
                        <div className="mt-2 flex flex-col space-y-0.5">
                            {administratorLinks.map(function (link) {
                                return (
                                    <AccountNavigationLink
                                        key={link.title}
                                        onClick={function () {
                                            properties.close();
                                        }}
                                        href={link.href}
                                        icon={link.icon}
                                    >
                                        {link.title} {<ArrowRightIcon weight="bold" className="size-4" />}
                                    </AccountNavigationLink>
                                );
                            })}
                        </div>
                        <HorizontalRule className="mt-2" />
                    </>
                )}
            </div>

            {/* Scrollable Middle Section */}
            <ScrollArea
                containerClassName={mergeClassNames(
                    // Layout
                    'flex flex-1 flex-col',
                )}
            >
                {regularLinks.length > 0 && (
                    <div className="flex flex-col space-y-0.5 py-2">
                        {/* Regular Account Links */}
                        {regularLinks.map(function (link) {
                            return (
                                <AccountNavigationLink
                                    key={link.title}
                                    onClick={function () {
                                        properties.close();
                                    }}
                                    href={link.href}
                                    icon={link.icon}
                                >
                                    {link.title}
                                </AccountNavigationLink>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Fixed Bottom Section */}
            <div className="shrink-0">
                {!account.signedIn && (
                    <>
                        <HorizontalRule className="mb-3" />
                        <div className="px-1">
                            <Button variant="A" href="/sign-in" className="mb-4 w-full" iconRight={ArrowRightIcon}>
                                Sign In
                            </Button>
                        </div>
                    </>
                )}

                <HorizontalRule />

                <div className="flex items-center justify-between gap-3 pt-3 pr-2 pb-2">
                    <div className="flex items-center gap-2.5 pl-3">
                        <CircleHalfIcon className="size-4" />
                        <p className="text-sm font-medium">Appearance</p>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
