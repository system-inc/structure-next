// Dependencies - React
import React from 'react';

/**
 * Utilities for merging component themes between structure defaults and project overrides.
 *
 * This file provides functions to deep-merge theme configurations, allowing projects to
 * selectively override or extend structure's default component themes.
 */

// Theme configuration structure for components with variants and sizes.
export interface ComponentThemeConfiguration<
    TVariants extends Record<string, string> = Record<string, string>,
    TSizes extends Record<string, string> = Record<string, string>,
    TConfiguration extends Record<string, unknown> = Record<string, unknown>,
> {
    variants: TVariants;
    sizes: TSizes;
    configuration: TConfiguration;
}

// Deep partial type for component theme configurations - allows partial overrides at every level.
// Also allows adding new variants/sizes beyond what's defined in the base structure theme.
export type DeepPartialComponentTheme<T extends ComponentThemeConfiguration> = {
    variants?: Partial<T['variants']> & Record<string, string>; // Allow additional custom variants
    sizes?: Partial<T['sizes']> & Record<string, string>; // Allow additional custom sizes
    configuration?: Partial<T['configuration']>;
};

/**
 * Merges a project theme override with a structure theme base.
 *
 * Strategy:
 * - **Variants**: Hard override (project completely replaces variant classNames)
 * - **Sizes**: Hard override (project completely replaces size classNames)
 * - **Configuration**: Shallow merge (project selectively overrides config properties)
 *
 * This prevents Tailwind class conflicts (e.g., bg-blue-600 vs bg-purple-600 in same variant)
 * while allowing granular configuration overrides.
 *
 * @param structureTheme - The default theme provided by structure
 * @param projectTheme - Optional project theme overrides
 * @returns Merged theme configuration
 *
 * @example
 * const buttonTheme = mergeComponentTheme(
 *   structureButtonTheme,
 *   ProjectSettings.theme?.components?.Button
 * );
 *
 * // Structure provides:
 * // { variants: { Primary: 'bg-blue-600' }, configuration: { baseClasses: '...' } }
 *
 * // Project overrides:
 * // { variants: { Primary: 'bg-purple-600' }, configuration: { disabledClasses: '...' } }
 *
 * // Result:
 * // {
 * //   variants: { Primary: 'bg-purple-600' },  // Hard override
 * //   configuration: { baseClasses: '...', disabledClasses: '...' }  // Merged
 * // }
 */
export function mergeComponentTheme<T extends ComponentThemeConfiguration>(
    structureTheme: T,
    projectTheme?: DeepPartialComponentTheme<T>,
): T {
    // No project theme? Return structure theme as-is
    if(!projectTheme) {
        return structureTheme;
    }

    return {
        // Spread all properties from structure theme first (includes iconSizes and any other properties)
        ...structureTheme,

        // Hard override: Variants completely replace (no className merging)
        // This prevents conflicts like 'bg-blue-600 bg-purple-600' in same element
        variants: {
            ...structureTheme.variants,
            ...projectTheme.variants,
        },

        // Hard override: Sizes completely replace (no className merging)
        sizes: {
            ...structureTheme.sizes,
            ...projectTheme.sizes,
        },

        // Shallow merge: Configuration properties selectively override
        // Allows project to change just disabledClasses without redefining all config
        configuration: {
            ...structureTheme.configuration,
            ...projectTheme.configuration,
        },
    } as T;
}

// Function to conditionally apply theme className to an icon
// Accepts either a component reference (applies themeClassName) or pre-rendered ReactNode (user controls styling)
export function themeIcon(
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode | undefined,
    themeClassName?: string,
): React.ReactNode {
    if(!icon) return null;

    // If it's already a valid React element (pre-rendered JSX), render as-is
    if(React.isValidElement(icon)) {
        return icon;
    }

    // Otherwise it's a component reference (function or forwardRef) - render it with theme className
    if(typeof icon === 'function' || typeof icon === 'object') {
        const IconComponent = icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        return <IconComponent className={themeClassName} />;
    }

    // Fallback - render as-is (shouldn't reach here)
    return icon;
}
