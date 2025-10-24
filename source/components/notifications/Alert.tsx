// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Assets
import WarningIcon from '@structure/assets/icons/status/WarningIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Alert - Variants
export const AlertVariants = {
    default: '',
    success: 'border-[#2dcc2a] bg-[#edfaed] p-2 dark:border-green-800 dark:bg-green-950',
    error: 'border-[#f1cfd2] bg-[#faeded] p-2 dark:border-red-800 dark:bg-red-950',
    warning: 'border-[#e6b800] bg-[#fff9e6] p-2 dark:border-yellow-800 dark:bg-yellow-950',
    information: '',
};

// Alert - Sizes
export const AlertSizes = {
    default: 'p-2 text-sm',
    large: 'p-3 text-base',
};

// Component - Alert
export interface AlertProperties {
    variant?: keyof typeof AlertVariants;
    size?: keyof typeof AlertSizes;
    className?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    title?: React.ReactNode;
    children?: React.ReactNode;
}
export function Alert(properties: AlertProperties) {
    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';

    // Variant icon wrapper class names
    let variantIconContainerClassNames = 'mr-3 ml-1';
    if(size === 'large') {
        variantIconContainerClassNames = 'ml-1 mr-5';
    }

    // Variant icon class names
    let variantIconClassNames = 'h-[22px] w-[22px]';
    if(size === 'large') {
        variantIconClassNames = 'h-6 w-6';
    }
    if(variant === 'success') {
        variantIconClassNames = mergeClassNames('content--positive', variantIconClassNames);
    }
    else if(variant === 'error') {
        variantIconClassNames = mergeClassNames('content--negative', variantIconClassNames);
    }
    else if(variant === 'warning') {
        variantIconClassNames = mergeClassNames('content--warning', variantIconClassNames);
    }

    // Variant title class names
    let titleClassNames = '';
    if(size === 'large') {
        titleClassNames = 'text-base font-medium';
    }

    // Variant text wrapper class names
    let variantTextContainerClassNames = 'pt-[1px] pr-3 pb-0.5';
    if(size === 'large') {
        variantTextContainerClassNames = 'pb-1.5 pr-3';
    }

    // TODO: Add icons for different variants
    // Determine the icon based on the variant
    let Icon = properties.icon;
    if(!Icon) {
        if(variant === 'error') {
            Icon = ErrorIcon;
        }
        else if(variant === 'warning') {
            Icon = WarningIcon;
        }
        else if(variant === 'success') {
            Icon = CheckCircledIcon;
        }
    }

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'flex max-w-3xl flex-col rounded-md border',
                AlertVariants[variant],
                AlertSizes[size],
                properties.className,
            )}
        >
            <div className="flex">
                {Icon && (
                    <div className={variantIconContainerClassNames}>
                        <Icon className={variantIconClassNames} />
                    </div>
                )}
                <div className={variantTextContainerClassNames}>
                    {properties.title && <div className={titleClassNames}>{properties.title}</div>}
                    {properties.children && <div className="mt-4">{properties.children}</div>}
                </div>
            </div>
        </div>
    );
}
