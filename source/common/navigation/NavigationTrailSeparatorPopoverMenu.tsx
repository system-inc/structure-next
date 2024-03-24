// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Dependencies - Main Components
import { PopoverMenuInterface, PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { NavigationTrailLinkInterface } from '@structure/source/common/navigation/NavigationTrail';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - NavigationTrailSeparatorPopoverMenu
export interface NavigationTrailSeparatorPopoverMenuProperties
    extends Omit<PopoverMenuInterface, 'items' | 'children'> {
    separator: React.ReactNode;
    links: NavigationTrailLinkInterface[];
}
export function NavigationTrailSeparatorPopoverMenu(properties: NavigationTrailSeparatorPopoverMenuProperties) {
    // Hooks
    const router = useRouter();
    const urlPathname = usePathname();

    // State for the PopoverMenu
    const [open, setOpen] = React.useState(false);

    // Render the component
    return (
        <PopoverMenu
            {...properties}
            items={properties.links.map(function (link) {
                // Use trailing slashes for comparison to prevent issues with comparing paths like /data and /database
                const linkWithTrailingSlash = link.href.endsWith('/') ? link.href : link.href + '/';
                const urlPathnameWithTrailingSlash = urlPathname.endsWith('/') ? urlPathname : urlPathname + '/';
                const selected = urlPathnameWithTrailingSlash.startsWith(linkWithTrailingSlash);

                return {
                    content: link.title,
                    href: link.href,
                    className: 'cursor-pointer w-full',
                    onChange: (event) => {
                        // console.log('selected me!', link.href, event);
                        // Close the popover immediately for a better navigation experience
                        setOpen(false);
                    },
                    selected: selected,
                    icon: selected ? CheckIcon : undefined,
                    iconPosition: 'left',
                };
            })}
            search={true}
            popoverProperties={{
                ...properties.popoverProperties,
                open: open,
                onOpenChange: (open) => {
                    setOpen(open);
                },
            }}
        >
            {/* Separator */}
            <div
                tabIndex={1}
                className="mx-1 h-4 w-4 cursor-pointer select-none rounded-sm transition-colors hover:bg-light-2 active:bg-light-4 data-[state=delayed-open]:bg-light-2 data-[state=instant-open]:bg-light-2 data-[state=open]:bg-light-2 dark:hover:bg-dark-4 dark:active:bg-dark-6 data-[state=delayed-open]:dark:bg-dark-4 data-[state=instant-open]:dark:bg-dark-4 data-[state=open]:dark:bg-dark-4"
            >
                {properties.separator}
            </div>
        </PopoverMenu>
    );
}

// Export - Default
export default NavigationTrailSeparatorPopoverMenu;
