// Dependencies - React
import React from 'react';

// Dependencies - Theme
import { noticeTheme as structureNoticeTheme } from '@structure/source/components/notices/NoticeTheme';
import type { NoticeVariant, NoticeSize } from '@structure/source/components/notices/NoticeTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Assets
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react';

// Type - Icon can be either a component reference or pre-rendered JSX
export type NoticeIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Component - Notice
export interface NoticeProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    variant?: NoticeVariant;
    size?: NoticeSize;
    title?: React.ReactNode; // Override HTMLAttributes title (string) with ReactNode
    icon?: NoticeIconType; // Icon to display
    iconClassName?: string; // Custom className for the icon
}
export const Notice = React.forwardRef<HTMLDivElement, NoticeProperties>(function (properties, reference) {
    // Get theme from context and merge with structure theme
    const componentTheme = useComponentTheme();
    const noticeTheme = mergeTheme(structureNoticeTheme, componentTheme?.Notice);

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

    // Determine the icon based on the variant (if not explicitly provided)
    let icon = properties.icon;
    if(!icon) {
        if(variant === 'Negative') {
            icon = WarningCircleIcon;
        }
        else if(variant === 'Warning') {
            icon = WarningIcon;
        }
        else if(variant === 'Positive') {
            icon = CheckCircleIcon;
        }
        else if(variant === 'Informative') {
            icon = InfoIcon;
        }
    }

    // Variant icon wrapper class names - adjust spacing based on size
    const variantIconContainerClassNames = 'mr-3 ml-1';

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

    // Variant title class names - Size determines text styling, variant determines color
    let titleClassNames = '';

    // Size-based text styling
    if(size === 'Large') {
        titleClassNames = 'text-base';
    }
    else if(size === 'Base') {
        titleClassNames = 'text-sm';
    }

    // Variant-based color
    if(variant === 'Positive') {
        titleClassNames = mergeClassNames(titleClassNames, 'content--positive');
    }
    else if(variant === 'Negative') {
        titleClassNames = mergeClassNames(titleClassNames, 'content--negative');
    }
    else if(variant === 'Warning') {
        titleClassNames = mergeClassNames(titleClassNames, 'content--warning');
    }
    else if(variant === 'Informative') {
        titleClassNames = mergeClassNames(titleClassNames, 'content--informative');
    }

    // Variant text wrapper class names
    let variantTextContainerClassNames = '';
    if(size === 'Base' || size === 'Large') {
        variantTextContainerClassNames = '';
    }

    // Render the component
    return (
        <div
            ref={reference}
            className={mergeClassNames(
                noticeVariantClassNames({
                    variant: variant,
                    size: size,
                }),
                properties.className,
            )}
        >
            <div className="flex items-center">
                {icon && <div className={variantIconContainerClassNames}>{themeIcon(icon, iconClassNames)}</div>}
                <div className={variantTextContainerClassNames}>
                    {properties.title && <div className={titleClassNames}>{properties.title}</div>}
                    {properties.children && <div className="mt-4">{properties.children}</div>}
                </div>
            </div>
        </div>
    );
});
// Set display name for debugging purposes
Notice.displayName = 'Notice';
