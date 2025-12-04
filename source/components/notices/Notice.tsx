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

    // Determine if notice has children (content below title)
    const hasChildren = Boolean(properties.children);

    // Create variant class names from theme
    const noticeVariantClassNames = createVariantClassNames(noticeTheme.configuration.baseClassNames, {
        variants: {
            variant: noticeTheme.variants,
            size: noticeTheme.sizes,
        },
        defaultVariants: noticeTheme.configuration.defaultVariant,
    });

    // Determine the icon based on the variant (if not explicitly provided)
    let icon = properties.icon;
    if(!icon) {
        if(variant === 'Positive') {
            icon = CheckCircleIcon;
        }
        else if(variant === 'Negative') {
            icon = WarningCircleIcon;
        }
        else if(variant === 'Warning') {
            icon = WarningIcon;
        }
        else if(variant === 'Informative') {
            icon = InfoIcon;
        }
    }

    // Get icon container class names from theme based on whether notice has children
    const iconContainerClassNames = hasChildren
        ? noticeTheme.iconContainerWithChildrenSizes?.[size!] || noticeTheme.configuration.iconContainerClassNames
        : noticeTheme.configuration.iconContainerClassNames;

    // Build icon class names from theme (size + variant color)
    const iconClassNames = mergeClassNames(
        noticeTheme.iconSizes?.[size!],
        noticeTheme.iconVariants?.[variant!],
        properties.iconClassName,
    );

    // Build title class names from theme (size + variant color)
    const titleClassNames = mergeClassNames(noticeTheme.titleSizes?.[size!], noticeTheme.titleVariants?.[variant!]);

    // Build content class names from theme (size + variant color)
    const contentClassNames = mergeClassNames(
        noticeTheme.contentSizes?.[size!],
        noticeTheme.contentVariants?.[variant!],
    );

    // Get layout class names from theme based on size and whether notice has children
    const layoutClassNames = hasChildren
        ? noticeTheme.layoutWithChildrenSizes?.[size!]
        : noticeTheme.layoutSizes?.[size!];

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
            <div className={layoutClassNames}>
                {icon && <div className={iconContainerClassNames}>{themeIcon(icon, iconClassNames)}</div>}
                <div>
                    {properties.title && <div className={titleClassNames}>{properties.title}</div>}
                    {properties.children && (
                        <div
                            className={mergeClassNames(
                                noticeTheme.configuration.contentSpacingClassNames,
                                contentClassNames,
                            )}
                        >
                            {properties.children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
// Set display name for debugging purposes
Notice.displayName = 'Notice';
