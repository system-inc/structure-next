// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/components/popovers/Tip';
import { PopoverProperties, Popover } from '@structure/source/components/popovers/Popover';

// Dependencies - Assets
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// TODO: add icon variants like information, question, warning, error icons
// TODO: add size variants like xs, sm, base/default, lg, xl

// Variants - TipIcon
export const TipIconVariants = {
    // Default variant
    default: `cursor-pointer select-none rounded-extra-small p-[5px] hover:bg-light-2 active:bg-light-4 data-[state=delayed-open]:bg-light-2 data-[state=instant-open]:bg-light-2 data-[state=open]:bg-light-2 dark:hover:bg-dark-4 dark:active:bg-dark-6 data-[state=delayed-open]:dark:bg-dark-4 data-[state=instant-open]:dark:bg-dark-4 data-[state=open]:dark:bg-dark-4`,
    // Unstyled variant
    unstyled: ``,
};

// Variants - TipIconContent
export const TipIconContentVariants = {
    // Default variant
    default: `max-w-xs rounded-extra-small px-3 py-2 text-sm shadow-04`,
    // Unstyled variant
    unstyled: `border-none`,
};

// Component - TipIcon
export interface TipIconProperties extends Omit<PopoverProperties, 'children' | 'variant'> {
    variant?: keyof typeof TipIconVariants;
    contentVariant?: keyof typeof TipIconContentVariants;
    icon?:
        | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
        | React.ComponentType<{ size?: number | string; className?: string; weight?: string }>;
    iconClassName?: string;
    iconProperties?: { size?: number | string; weight?: string; [key: string]: unknown };
    contentClassName?: string;
    openOnPress?: boolean;
    tabIndex?: number;
}
export function TipIcon({
    openOnPress,
    icon,
    variant,
    contentVariant,
    iconProperties,
    iconClassName,
    content,
    contentClassName,
    className,
    tabIndex,
    ...componentProperties
}: TipIconProperties) {
    // Defaults
    const openOnPressValue = openOnPress ?? false;
    const Icon = icon ?? InformationCircledIcon;
    const variantValue = variant || 'default';
    const contentVariantValue = contentVariant || 'default';

    // If openOnPress is true, use Popover, otherwise use Tip
    const Component = openOnPressValue ? Popover : Tip;

    // Check if this is a Phosphor icon by looking for Phosphor-specific properties
    const isPhosphorIcon =
        Icon !== InformationCircledIcon &&
        icon &&
        (iconProperties?.weight !== undefined || iconProperties?.size !== undefined);

    // Default properties for Phosphor icons
    const defaultIconProperties = { size: 16, weight: 'regular' };
    const iconPropertiesValue = { ...defaultIconProperties, ...iconProperties };

    // Render the component
    return (
        <Component
            {...componentProperties}
            content={content}
            className={mergeClassNames(TipIconContentVariants[contentVariantValue], contentClassName)}
            tabIndex={tabIndex ?? 1}
        >
            <div
                // Styles for the icon
                className={mergeClassNames(TipIconVariants[variantValue], className)}
            >
                {isPhosphorIcon ? (
                    <Icon {...iconPropertiesValue} className={mergeClassNames('', iconClassName)} />
                ) : (
                    <Icon className={mergeClassNames('h-3 w-3', iconClassName)} />
                )}
            </div>
        </Component>
    );
}
