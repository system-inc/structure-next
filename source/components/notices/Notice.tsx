// Dependencies - React
import React from 'react';

// Dependencies - Theme
import { noticeTheme as structureNoticeTheme } from '@structure/source/components/notices/NoticeTheme';
import type { NoticeVariant, NoticeSize } from '@structure/source/components/notices/NoticeTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Assets
import WarningIcon from '@structure/assets/icons/status/WarningIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Type - Icon can be either a component reference or pre-rendered JSX
export type NoticeIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Component - Notice
export interface NoticeProperties {
    variant?: NoticeVariant;
    size?: NoticeSize;
    className?: string;
    icon?: NoticeIconType; // Icon to display
    iconClassName?: string; // Custom className for the icon
    title?: React.ReactNode;
    children?: React.ReactNode;
}
export function Notice(properties: NoticeProperties) {
    // Get theme from context and merge with structure theme
    const componentTheme = useComponentTheme();
    const noticeTheme = mergeComponentTheme(structureNoticeTheme, componentTheme?.Notice);

    // Apply defaults from theme configuration
    const variant = properties.variant || noticeTheme.configuration.defaultVariant.variant;
    const size = properties.size || noticeTheme.configuration.defaultVariant.size;

    // Create variant class names from theme
    const noticeVariantClassNames = createVariantClassNames(noticeTheme.configuration.baseClasses, {
        variants: {
            variant: noticeTheme.variants,
            size: noticeTheme.sizes,
        },
        defaultVariants: noticeTheme.configuration.defaultVariant,
    });

    // Apply variant classes
    const computedClassName = mergeClassNames(
        noticeVariantClassNames({
            variant: variant,
            size: size,
        }),
        properties.className,
    );

    // Determine the icon based on the variant (if not explicitly provided)
    let icon = properties.icon;
    if(!icon) {
        if(variant === 'Negative') {
            icon = ErrorIcon;
        }
        else if(variant === 'Warning') {
            icon = WarningIcon;
        }
        else if(variant === 'Positive') {
            icon = CheckCircledIcon;
        }
    }

    // Variant icon wrapper class names
    let variantIconContainerClassNames = 'mr-3 ml-1';
    if(size === 'Large') {
        variantIconContainerClassNames = 'ml-1 mr-5';
    }

    // Build icon class names with variant colors and size
    const iconSizeClassName = noticeTheme.iconSizes?.[size!] || noticeTheme.iconSizes?.Base || 'h-[22px] w-[22px]';
    let iconClassNames = iconSizeClassName;

    if(variant === 'Positive') {
        iconClassNames = mergeClassNames('content--positive', iconClassNames);
    }
    else if(variant === 'Negative') {
        iconClassNames = mergeClassNames('content--negative', iconClassNames);
    }
    else if(variant === 'Warning') {
        iconClassNames = mergeClassNames('content--warning', iconClassNames);
    }

    // Merge with custom icon className if provided
    if(properties.iconClassName) {
        iconClassNames = mergeClassNames(iconClassNames, properties.iconClassName);
    }

    // Variant title class names
    let titleClassNames = '';
    if(size === 'Large') {
        titleClassNames = 'text-base font-medium';
    }

    // Variant text wrapper class names
    let variantTextContainerClassNames = 'pt-px pr-3 pb-0.5';
    if(size === 'Large') {
        variantTextContainerClassNames = 'pb-1.5 pr-3';
    }

    // Render the component
    return (
        <div className={computedClassName}>
            <div className="flex">
                {icon && <div className={variantIconContainerClassNames}>{themeIcon(icon, iconClassNames)}</div>}
                <div className={variantTextContainerClassNames}>
                    {properties.title && <div className={titleClassNames}>{properties.title}</div>}
                    {properties.children && <div className="mt-4">{properties.children}</div>}
                </div>
            </div>
        </div>
    );
}
