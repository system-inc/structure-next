'use client'; // This component uses client-only features

// Dependencies - React
import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

// Dependencies - Utilities
import { toggleVariants } from '@structure/source/common/buttons/Toggle';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Context for SegmentedControl
const SegmentedControlContext = React.createContext<VariantProps<typeof toggleVariants>>({
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

// Interface for SegmentedControlProps
interface SegmentedControlProps<T = string> extends VariantProps<typeof toggleVariants> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (value: T) => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

// Component - SegmentedControl
const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
    { value, defaultValue, onValueChange, disabled, className, variant, size, children, ...props },
    ref,
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
            ref={ref}
            type="single"
            value={value}
            defaultValue={defaultValue}
            onValueChange={handleValueChange}
            disabled={disabled}
            className={mergeClassNames(
                'inline-flex h-9 w-full items-center p-0.5',
                'bg-opsis-background-secondary rounded-lg',
                className,
            )}
            {...props}
        >
            <SegmentedControlContext.Provider value={{ variant, size }}>{children}</SegmentedControlContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
});
SegmentedControl.displayName = 'SegmentedControl';

// Interface for SegmentedControlItemProps
interface SegmentedControlItemProps<T = string> extends VariantProps<typeof toggleVariants> {
    value: T;
    className?: string;
    children: React.ReactNode;
}

// Component - SegmentedControlItem
const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
    function SegmentedControlItem({ value, className, children, variant, size, ...props }, ref) {
        const context = useSegmentedControlContext();

        return (
            <ToggleGroupPrimitive.Item
                ref={ref}
                value={value.toString()}
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
                {...props}
            >
                {children}
            </ToggleGroupPrimitive.Item>
        );
    },
);
SegmentedControlItem.displayName = 'SegmentedControlItem';

// Export components
export { SegmentedControl, SegmentedControlItem };
