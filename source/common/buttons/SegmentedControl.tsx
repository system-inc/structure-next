'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps as VariantProperties } from 'class-variance-authority';

// Dependencies - Utilities
import { toggleVariants } from '@structure/source/common/buttons/Toggle';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Context for SegmentedControl
const SegmentedControlContext = React.createContext<VariantProperties<typeof toggleVariants>>({
    size: 'default',
    variant: 'default',
});

// Custom hook to use SegmentedControl context
const useSegmentedControlContext = () => {
    try {
        return React.useContext(SegmentedControlContext);
    } catch {
        throw new Error('useSegmentedControlContext must be used within a SegmentedControl component');
    }
};

// Component - SegmentedControl
interface SegmentedControlProperties<T = string> extends VariantProperties<typeof toggleVariants> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (value: T) => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}
const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProperties>(function SegmentedControl(
    { onValueChange, className, variant, size, children, ...toggleGroupPrimitiveRootProperties },
    reference,
) {
    // Handle value change
    function handleValueChange(value: string | undefined): void {
        if(value && onValueChange) {
            onValueChange(value);
        }
    }

    // Render the component
    return (
        <ToggleGroupPrimitive.Root
            ref={reference}
            type="single"
            onValueChange={handleValueChange}
            className={mergeClassNames(
                'inline-flex h-9 w-full items-center p-0.5',
                'bg-opsis-background-secondary rounded-lg',
                className,
            )}
            {...toggleGroupPrimitiveRootProperties}
        >
            <SegmentedControlContext.Provider value={{ variant: variant, size: size }}>
                {children}
            </SegmentedControlContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
});
SegmentedControl.displayName = 'SegmentedControl';

// Component - SegmentedControlItem
interface SegmentedControlItemProperties<T = string> extends VariantProperties<typeof toggleVariants> {
    className?: string;
    value: T;
    children: React.ReactNode;
}
const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProperties>(
    function SegmentedControlItem(
        { className, variant, size, children, ...toggleGroupPrimitiveItemProperties },
        reference,
    ) {
        const context = useSegmentedControlContext();

        return (
            <ToggleGroupPrimitive.Item
                ref={reference}
                className={mergeClassNames(
                    toggleVariants({
                        variant: context.variant || variant,
                        size: context.size || size,
                    }),
                    'h-8 flex-1',
                    'px-4 py-2 text-sm font-medium shadow-none transition',
                    'data-[state=on]:border-opsis-border-primary border',
                    'data-[state=on]:bg-white data-[state=on]:text-black',
                    'data-[state=off]:text-opsis-content-secondary data-[state=off]:bg-transparent',
                    'data-[state=off]:border-transparent',
                    className,
                )}
                {...toggleGroupPrimitiveItemProperties}
                value={toggleGroupPrimitiveItemProperties.value.toString()}
            >
                {children}
            </ToggleGroupPrimitive.Item>
        );
    },
);
SegmentedControlItem.displayName = 'SegmentedControlItem';

// Export components
export { SegmentedControl, SegmentedControlItem };
