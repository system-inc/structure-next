// Dependencies - React
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

/**
 * Utilities for merging component themes between structure defaults and project overrides.
 *
 * This file provides functions to deep-merge theme configurations, allowing projects to
 * selectively override or extend structure's default component themes.
 */

// Generic deep partial type for ANY theme configuration - automatically handles all properties
// Works with standard properties (variants, sizes, sides, positions, iconSizes) and custom properties
// (variantItemClasses, overlayClasses, etc.) without manual type definitions
export type DeepPartialTheme<T> = {
    [K in keyof T]?: K extends 'configuration'
        ? Partial<T[K]> // Shallow merge configuration
        : K extends 'compoundVariants'
          ? T[K] // Special handling for Badge - replace entire array
          : T[K] extends Partial<Record<string, string>>
            ? Partial<T[K]> & Record<string, string> // Hard override + allow custom keys
            : T[K]; // Pass through other properties
};

/**
 * Generic theme merge function - works with ANY theme configuration structure.
 *
 * Automatically handles:
 * - Standard properties (variants, sizes, sides, positions, iconSizes)
 * - Custom properties (variantItemClasses, overlayClasses, etc.)
 * - Configuration object (shallow merge)
 * - Array properties like compoundVariants (replace strategy)
 *
 * Strategy:
 * - **Configuration**: Shallow merge (selectively override config properties)
 * - **All other properties**: Hard override (completely replace with spread merge)
 *
 * This prevents Tailwind class conflicts while maintaining type safety.
 *
 * @param baseTheme - The base theme (structure or already-merged theme)
 * @param overrideTheme - Optional theme overrides (project or instance level)
 * @returns Merged theme configuration
 *
 * @example
 * // Works with any theme structure
 * const buttonTheme = mergeTheme(structureButtonTheme, componentTheme?.Button);
 * const tabsTheme = mergeTheme(structureTabsTheme, instanceTheme);
 * const dialogTheme = mergeTheme(structureDialogTheme, projectTheme);
 */
export function mergeTheme<T extends object>(baseTheme: T, overrideTheme?: DeepPartialTheme<T>): T {
    // No override theme? Return base theme as-is
    if(!overrideTheme) {
        return baseTheme;
    }

    // Start with a copy of the base theme
    const merged = { ...baseTheme } as Record<string, unknown>;

    // Iterate through all override properties
    for(const key in overrideTheme) {
        const overrideValue = overrideTheme[key as keyof typeof overrideTheme];
        const baseValue = (baseTheme as Record<string, unknown>)[key];

        if(key === 'configuration') {
            // Shallow merge configuration - allows selective property overrides
            merged[key] = {
                ...(baseValue as Record<string, unknown>),
                ...(overrideValue as Record<string, unknown>),
            };
        }
        else if(
            typeof baseValue === 'object' &&
            baseValue !== null &&
            typeof overrideValue === 'object' &&
            overrideValue !== null &&
            !Array.isArray(baseValue)
        ) {
            // Hard override for object properties (variants, sizes, etc.)
            // Spread both to merge keys while allowing complete replacement
            merged[key] = {
                ...(baseValue as Record<string, unknown>),
                ...(overrideValue as Record<string, unknown>),
            };
        }
        else {
            // Direct replacement for arrays (compoundVariants) and other types
            merged[key] = overrideValue;
        }
    }

    return merged as T;
}

// Function to conditionally apply theme className to an icon
// Accepts either a component reference (applies themeClassName), pre-rendered ReactNode (user controls styling), or true for empty spacing
export function themeIcon(
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode | true | undefined,
    themeClassName?: string,
): React.ReactNode {
    if(!icon) return null;

    // If icon is true, render an empty spacing element for alignment
    if(icon === true) {
        return <span className={themeClassName} aria-hidden="true" />;
    }

    // If it's already a valid React element (pre-rendered JSX), clone and merge themeClassName
    if(React.isValidElement(icon)) {
        const existingClassName = (icon.props as { className?: string })?.className;
        return React.cloneElement(icon, {
            className: mergeClassNames(themeClassName, existingClassName),
        } as React.Attributes);
    }

    // Otherwise it's a component reference (function or forwardRef) - render it with theme className
    if(typeof icon === 'function' || typeof icon === 'object') {
        const IconComponent = icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        return <IconComponent className={themeClassName} />;
    }

    // Fallback - render as-is (shouldn't reach here)
    return icon;
}
