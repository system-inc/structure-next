// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { PopoverMenuProperties, PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { NavigationTrailLinkInterface } from '@structure/source/components/navigation/trail/NavigationTrail';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';

// Component - NavigationTrailSeparatorPopoverMenu
export interface NavigationTrailSeparatorPopoverMenuProperties
    extends Omit<PopoverMenuProperties, 'items' | 'children'> {
    separator: React.ReactNode;
    links: NavigationTrailLinkInterface[];
}
export function NavigationTrailSeparatorPopoverMenu(properties: NavigationTrailSeparatorPopoverMenuProperties) {
    // Hooks
    const urlPath = useUrlPath() ?? '';

    // State for the PopoverMenu
    const [open, setOpen] = React.useState(false);

    // Render the component
    return (
        <PopoverMenu
            {...properties}
            items={properties.links.map(function (link) {
                // Use trailing slashes for comparison to prevent issues with comparing paths like /data and /database
                const linkWithTrailingSlash = link.href.endsWith('/') ? link.href : link.href + '/';
                const urlPathnameWithTrailingSlash = urlPath.endsWith('/') ? urlPath : urlPath + '/';
                const selected = urlPathnameWithTrailingSlash.startsWith(linkWithTrailingSlash);

                return {
                    content: link.title,
                    href: link.href,
                    className: 'cursor-pointer w-full',
                    onChange: function () {
                        // console.log('selected me!', link.href, event);
                        // Close the popover immediately for a better navigation experience
                        setOpen(false);
                    },
                    selected: selected,
                    iconLeft: selected ? CheckIcon : undefined,
                };
            })}
            search={true}
            popoverProperties={{
                ...properties.popoverProperties,
                open: open,
                onOpenChange: function (open) {
                    setOpen(open);
                },
            }}
        >
            {/* Separator */}
            <div
                tabIndex={1}
                className="mx-1 h-4 w-4 cursor-pointer rounded-extra-small select-none hover:bg-light-2 active:bg-light-4 data-[state=delayed-open]:bg-light-2 data-[state=instant-open]:bg-light-2 data-[state=open]:bg-light-2 dark:hover:bg-dark-4 dark:active:bg-dark-6 data-[state=delayed-open]:dark:bg-dark-4 data-[state=instant-open]:dark:bg-dark-4 data-[state=open]:dark:bg-dark-4"
            >
                {properties.separator}
            </div>
        </PopoverMenu>
    );
}
