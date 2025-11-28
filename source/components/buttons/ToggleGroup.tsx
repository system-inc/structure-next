'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

// Dependencies - ToggleGroupItem
import { ToggleGroupContextProvider } from '@structure/source/components/buttons/ToggleGroupItem';

// Dependencies - Theme
import { toggleGroupTheme as structureToggleGroupTheme } from '@structure/source/components/buttons/ToggleGroupTheme';
import type { ToggleGroupVariant, ToggleGroupSize } from '@structure/source/components/buttons/ToggleGroupTheme';
import type { ToggleVariant, ToggleSize } from '@structure/source/components/buttons/ToggleTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Base ToggleGroup Properties
interface BaseToggleGroupProperties {
    className?: string;
    variant?: ToggleGroupVariant;
    size?: ToggleGroupSize;
    disabled?: boolean;
    itemVariant?: ToggleVariant; // Pass down to items via context
    itemSize?: ToggleSize; // Pass down to items via context
}

// Single selection toggle group
type ToggleGroupSingleProperties = BaseToggleGroupProperties & {
    type?: 'single';
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
} & Omit<
        React.ComponentPropsWithoutRef<'div'>,
        keyof BaseToggleGroupProperties | 'value' | 'defaultValue' | 'onValueChange'
    >;

// Multiple selection toggle group
type ToggleGroupMultipleProperties = BaseToggleGroupProperties & {
    type: 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
} & Omit<
        React.ComponentPropsWithoutRef<'div'>,
        keyof BaseToggleGroupProperties | 'value' | 'defaultValue' | 'onValueChange'
    >;

// Component - ToggleGroup (union type for single or multiple)
export type ToggleGroupProperties = ToggleGroupSingleProperties | ToggleGroupMultipleProperties;

export const ToggleGroup = React.forwardRef<
    React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
    ToggleGroupProperties
>(function ToggleGroup(properties, reference) {
    const {
        // ToggleGroup-specific properties
        variant,
        size,
        itemVariant,
        itemSize,

        // DOM properties we handle specially
        disabled,
        className,
        children,

        // All other properties spread to Radix ToggleGroup.Root (includes type, value, onValueChange, etc.)
        ...toggleGroupProperties
    } = properties;
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const toggleGroupTheme = mergeTheme(structureToggleGroupTheme, componentTheme?.ToggleGroup);

    // Create toggle group variant class names function using the merged theme
    const toggleGroupVariantClassNames = createVariantClassNames(toggleGroupTheme.configuration.baseClassNames, {
        variants: {
            variant: toggleGroupTheme.variants,
            size: toggleGroupTheme.sizes,
        },
        // Only apply default size when variant is provided
        defaultVariants: variant ? toggleGroupTheme.configuration.defaultVariant : {},
    });

    // Compute final className using the merged theme
    const computedClassName = mergeClassNames(
        toggleGroupVariantClassNames({
            variant: variant,
            size: size,
        }),
        className, // User overrides (last = highest priority)
    );

    // Prepare properties for Radix - ensure type is set correctly
    const radixProperties = {
        ...toggleGroupProperties,
        type: ('type' in toggleGroupProperties ? toggleGroupProperties.type : 'single') as 'single' | 'multiple',
    };

    // Render the component
    return (
        <ToggleGroupPrimitive.Root
            ref={reference}
            disabled={disabled}
            className={computedClassName}
            {...(radixProperties as React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>)}
        >
            <ToggleGroupContextProvider value={{ groupVariant: variant, itemVariant: itemVariant, itemSize: itemSize }}>
                {children}
            </ToggleGroupContextProvider>
        </ToggleGroupPrimitive.Root>
    );
});

// Set display name for debugging
ToggleGroup.displayName = 'ToggleGroup';
