// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Tip from '@structure/source/common/popovers/Tip';
import { PopoverProperties, Popover } from '@structure/source/common/popovers/Popover';

// Dependencies - Assets
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { removeProperties } from '@structure/source/utilities/React';

// TODO: add icon variants like information, question, warning, error icons
// TODO: add size variants like xs, sm, base/default, lg, xl

// Variants - TipIcon
export const TipIconVariants = {
    // Default variant
    default: `select-none rounded-extra-small p-[5px] hover:bg-light-2 active:bg-light-4 data-[state=delayed-open]:bg-light-2 data-[state=instant-open]:bg-light-2 data-[state=open]:bg-light-2 dark:hover:bg-dark-4 dark:active:bg-dark-6 data-[state=delayed-open]:dark:bg-dark-4 data-[state=instant-open]:dark:bg-dark-4 data-[state=open]:dark:bg-dark-4`,
    // Unstyled variant
    unstyled: ``,
};

// Variants - TipIconContent
export const TipIconContentVariants = {
    // Default variant
    default: `max-w-xs rounded-extra-small px-4 py-3.5 text-sm shadow-04`,
    // Unstyled variant
    unstyled: `border-none`,
};

// Component - TipIcon
export interface TipIconProperties extends Omit<PopoverProperties, 'children'> {
    variant?: keyof typeof TipIconVariants;
    contentVariant?: keyof typeof TipIconContentVariants;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconClassName?: string;
    contentClassName?: string;
    openOnPress?: boolean;
    tabIndex?: number;
}
export function TipIcon(properties: TipIconProperties) {
    // Defaults
    const openOnPress = properties.openOnPress ?? false;
    const Icon = properties.icon ?? InformationCircledIcon;
    const variant = properties.variant || 'default';
    const contentVariant = properties.contentVariant || 'default';

    // If openOnPress is true, use Popover, otherwise use Tip
    const Component = openOnPress ? Popover : Tip;

    // Separate the PopoverInterface properties from the TipIconInterface properties
    // We will apply these to the Popover or Tip component
    const popoverInterfaceProperties = removeProperties(properties, ['icon', 'openOnPress', 'content', 'className']);

    // Render the component
    return (
        <Component
            {...popoverInterfaceProperties}
            content={properties.content}
            className={mergeClassNames(TipIconContentVariants[contentVariant], properties.contentClassName)}
            tabIndex={properties.tabIndex ?? 1}
        >
            <div
                // Styles for the icon
                className={mergeClassNames(TipIconVariants[variant], properties.className)}
            >
                <Icon className={mergeClassNames('h-3 w-3', properties.iconClassName)} />
            </div>
        </Component>
    );
}

// Export - Default
export default TipIcon;
