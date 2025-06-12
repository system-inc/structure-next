'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Radix-UI
import * as RadixAccordion from '@radix-ui/react-accordion';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { AccountNavigationLinks } from '@structure/source/modules/account/layouts/AccountNavigationLinks';

// Dependencies - Animation
import { useTrail, useSpring, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';

// Dependencies - Assets
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - AccountNavigation
type AccountNavigationProperties = React.HTMLProps<HTMLElement>;
export function AccountNavigation(properties: AccountNavigationProperties) {
    // Render the component
    return (
        <nav className={mergeClassNames('hidden flex-shrink-0 flex-col space-y-4 md:flex', properties.className)}>
            {/* AccountNavigation Links */}
            {AccountNavigationLinks.map(function (accountNavigationLink, accountNavigationLinkIndex) {
                return (
                    <Link
                        key={accountNavigationLinkIndex}
                        href={accountNavigationLink.href}
                        className="flex items-center transition-opacity hover:opacity-70"
                    >
                        {accountNavigationLink.icon && <accountNavigationLink.icon className="mr-2.5 h-4 w-4" />}{' '}
                        <span className="">{accountNavigationLink.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export function AccountNavigationMobile() {
    const [navigationOpen, setNavigationOpen] = React.useState<string>();
    const [navigationContentRef, { height }] = useMeasure();

    const navigationSpring = useSpring({
        height: navigationOpen === 'menu' ? height : 0,
        arrowRotation: navigationOpen === 'menu' ? 180 : 0,
    });

    const linksTrail = useTrail(AccountNavigationLinks.length, {
        opacity: navigationOpen === 'menu' ? 1 : 0,
        y: navigationOpen === 'menu' ? 0 : 20,
        reverse: navigationOpen !== 'menu',
        config: { mass: 0.1, tension: 550, friction: 50 },
    });

    return (
        <nav
            className={mergeClassNames(
                'sticky top-phi-base-2 z-30 border-b bg-light text-sm font-light tracking-wide md:hidden dark:bg-dark',
            )}
        >
            <RadixAccordion.Root
                type="single"
                collapsible
                value={navigationOpen}
                onValueChange={function (value) {
                    setNavigationOpen(value);
                }}
            >
                <RadixAccordion.Item value="menu">
                    <RadixAccordion.Header>
                        <RadixAccordion.Trigger
                            className={mergeClassNames('container flex w-full items-center justify-between py-3')}
                        >
                            <span className="text-sm font-normal tracking-wider">Account Navigation</span>
                            <animated.span
                                style={{
                                    rotate: navigationSpring.arrowRotation,
                                }}
                                className="block aspect-square h-5 w-5"
                            >
                                <ChevronDownIcon />
                            </animated.span>
                        </RadixAccordion.Trigger>
                    </RadixAccordion.Header>
                    <RadixAccordion.Content asChild forceMount>
                        <animated.div
                            id="navigation-content-container"
                            style={{
                                height: navigationSpring.height,
                            }}
                            className="overflow-hidden"
                        >
                            <div
                                ref={navigationContentRef}
                                className={mergeClassNames('container flex flex-col items-start py-2 pb-8')}
                            >
                                {linksTrail.map(function (style, accountNavigationLinkIndex) {
                                    const accountNavigationLink = AccountNavigationLinks[accountNavigationLinkIndex];
                                    if(!accountNavigationLink) return null;

                                    return (
                                        <Link
                                            key={accountNavigationLinkIndex}
                                            href={accountNavigationLink.href}
                                            className="group w-full overflow-hidden border-b py-2 transition-opacity last:border-b-0 hover:opacity-70"
                                        >
                                            <animated.span style={style} className="white-space-nowrap block">
                                                {accountNavigationLink.title}
                                            </animated.span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </animated.div>
                    </RadixAccordion.Content>
                </RadixAccordion.Item>
            </RadixAccordion.Root>
        </nav>
    );
}
