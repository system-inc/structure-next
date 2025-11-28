'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverProperties } from '@structure/source/components/popovers/Popover';
import { PopoverMenuProperties, PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { MenuItemInterface } from '@structure/source/components/menus/Menu';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Theme
import { inputSelectTheme as structureInputSelectTheme } from './InputSelectTheme';
import type { InputSelectVariant, InputSelectSize } from './InputSelectTheme';
import type { ButtonVariant, ButtonSize } from '@structure/source/components/buttons/ButtonTheme';
import type { PopoverVariant, PopoverSize } from '@structure/source/components/popovers/PopoverTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Type - InputSelectItem
// Exclude link-specific properties since select items are always buttons
export type InputSelectItemProperties = Omit<MenuItemInterface, 'selected' | 'asChild' | 'href' | 'target'>;

// Interface - InputSelectReference
export interface InputSelectReferenceInterface {
    getValue: () => string | undefined;
    setValue: (value: string | undefined) => void;
    focus: () => void;
}

// Component - InputSelect
export interface InputSelectProperties {
    // Value management
    value?: string;
    defaultValue?: string;
    placeholder?: string;

    // Items
    items?: InputSelectItemProperties[];

    // Appearance - Preset (routes to all sub-components)
    variant?: InputSelectVariant;
    size?: InputSelectSize;

    // Appearance - Individual overrides (take precedence over preset)
    triggerButtonVariant?: ButtonVariant;
    triggerButtonSize?: ButtonSize;
    popoverVariant?: PopoverVariant;
    popoverSize?: PopoverSize;
    menuItemButtonVariant?: ButtonVariant;
    menuItemButtonSize?: ButtonSize;

    // Behavior
    allowNoSelection?: boolean;
    search?: boolean;
    disabled?: boolean;

    // Async loading
    loadItems?: () => Promise<InputSelectItemProperties[]>;
    isLoadingItems?: boolean;
    isLoadingItemsMessage?: React.ReactNode;
    isLoadingItemsError?: React.ReactNode;

    // Events
    onChange?: (value: string | undefined, event?: React.MouseEvent<HTMLElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

    // Styling
    className?: string;
    title?: string | React.ReactNode;

    // Popover customization
    popoverMenuProperties?: Omit<PopoverMenuProperties, 'trigger' | 'items' | 'onItemSelected'>;
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'content'>;

    // Accessibility
    id?: string;
    name?: string;
    tabIndex?: number;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
}
export const InputSelect = React.forwardRef<InputSelectReferenceInterface, InputSelectProperties>(
    function InputSelect(properties, reference) {
        // Get component theme from context
        const componentTheme = useComponentTheme();

        // Merge structure theme with project overrides
        const theme = mergeTheme(structureInputSelectTheme, componentTheme?.InputSelect);

        // Get preset from theme (with defaults)
        const defaultVariant = theme.configuration.defaultVariant?.variant ?? 'A';
        const defaultSize = theme.configuration.defaultVariant?.size ?? 'Base';
        const variantPreset = theme.variants[properties.variant ?? defaultVariant];
        const sizePreset = theme.sizes[properties.size ?? defaultSize];

        // Resolve final variants - individual overrides take precedence over presets
        const finalTriggerButtonVariant =
            properties.triggerButtonVariant ?? variantPreset?.triggerButtonVariant ?? 'InputSelect';
        const finalTriggerButtonSize = properties.triggerButtonSize ?? sizePreset?.triggerButtonSize ?? 'InputSelect';
        const finalPopoverVariant = properties.popoverVariant ?? variantPreset?.popoverVariant ?? 'A';
        const finalPopoverSize = properties.popoverSize ?? sizePreset?.popoverSize ?? 'Base';
        // Note: menuItemButtonVariant/Size would be passed to PopoverMenu if it supported it
        // For now, PopoverMenu handles its own menu item styling

        // References
        const buttonReference = React.useRef<HTMLButtonElement>(null);

        // State - Popover open/close
        const [open, setOpen] = React.useState<boolean>(false);

        // State - Internal value (for uncontrolled mode)
        const [internalValue, setInternalValue] = React.useState<string | undefined>(properties.defaultValue);

        // State - Items (supports both static and async loaded)
        const [items, setItems] = React.useState<InputSelectItemProperties[]>(properties.items ?? []);
        const [isLoadingItemsInternal, setIsLoadingItemsInternal] = React.useState<boolean>(false);
        const [isLoadingItemsErrorInternal, setIsLoadingItemsErrorInternal] =
            React.useState<React.ReactNode>(undefined);

        // Determine loading state - external prop takes precedence over internal state
        const isLoadingItems = properties.isLoadingItems ?? isLoadingItemsInternal;
        const isLoadingItemsError = properties.isLoadingItemsError ?? isLoadingItemsErrorInternal;

        // Determine if controlled or uncontrolled
        const isControlled = properties.value !== undefined;
        const value = isControlled ? properties.value : internalValue;

        // Find the selected item
        const selectedItem = items.find(function (item) {
            return item.value === value;
        });

        // Defaults
        const placeholder = properties.placeholder ?? 'Select...';

        // Imperative handle for parent access
        React.useImperativeHandle(reference, function () {
            return {
                getValue: function () {
                    return value;
                },
                setValue: function (newValue) {
                    if(!isControlled) {
                        setInternalValue(newValue);
                    }
                },
                focus: function () {
                    buttonReference.current?.focus();
                },
            };
        });

        // Effect to load items async if loadItems function is provided
        const propertiesLoadItems = properties.loadItems;
        React.useEffect(
            function () {
                async function loadMenuItems() {
                    if(propertiesLoadItems) {
                        setIsLoadingItemsErrorInternal(undefined);
                        setIsLoadingItemsInternal(true);

                        try {
                            const loadedItems = await propertiesLoadItems();
                            setItems(loadedItems);
                        }
                        catch(error: unknown) {
                            console.log('Error loading menu items:', error);
                            if(error instanceof Error) {
                                setIsLoadingItemsErrorInternal(error.message ?? 'Error Loading Items');
                            }
                            else {
                                setIsLoadingItemsErrorInternal('Error Loading Items');
                            }
                        }

                        setIsLoadingItemsInternal(false);
                    }
                }

                loadMenuItems();
            },
            [propertiesLoadItems],
        );

        // Effect to sync items when properties.items changes
        React.useEffect(
            function () {
                setItems(properties.items ?? []);
            },
            [properties.items],
        );

        // Function to handle item selection
        function handleItemSelected(
            menuItem: MenuItemInterface,
            menuItemRenderIndex?: number,
            event?: React.MouseEvent<HTMLElement>,
        ) {
            let newValue = menuItem.value;

            // If the item is already selected and allowNoSelection is true, clear the value
            if(newValue !== undefined && menuItem.value === value && properties.allowNoSelection) {
                newValue = undefined;
            }

            // Update internal state if uncontrolled
            if(!isControlled) {
                setInternalValue(newValue);
            }

            // Call onChange callback
            properties.onChange?.(newValue, event);
        }

        // Function to handle blur
        function handleBlur(event: React.FocusEvent<HTMLButtonElement>) {
            properties.onBlur?.(event);
        }

        // Function to handle focus
        function handleFocus(event: React.FocusEvent<HTMLButtonElement>) {
            properties.onFocus?.(event);
        }

        // Function to handle keyboard navigation
        function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
            // Open the popover when the user presses arrow keys, spacebar, or enter
            if(
                open === false &&
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)
            ) {
                event.preventDefault();
                setOpen(true);
            }
        }

        // Transform items to add selected/highlighted state and check icon
        const transformedItems = items.map(function (item) {
            const selected = item.value === value;

            return {
                ...item,
                children: item.children ?? item.value,
                iconLeft: selected ? CheckIcon : undefined,
                className: mergeClassNames('gap-2', item.className),
                highlighted: selected,
                selected: selected,
            };
        });

        // Render the component
        return (
            <PopoverMenu
                key={isLoadingItems ? 'popoverMenuLoading' : 'popoverMenuLoaded'}
                {...properties.popoverMenuProperties}
                className={mergeClassNames('', properties.popoverMenuProperties?.className)}
                title={properties.title}
                items={transformedItems}
                isLoadingItems={isLoadingItems}
                isLoadingItemsMessage={properties.isLoadingItemsMessage}
                isLoadingItemsError={isLoadingItemsError}
                search={properties.search}
                onItemSelected={handleItemSelected}
                closeOnItemSelected={true}
                popoverProperties={{
                    ...properties.popoverProperties,
                    variant: finalPopoverVariant,
                    size: finalPopoverSize,
                    open: open,
                    onOpenChange: setOpen,
                }}
                trigger={
                    <Button
                        ref={buttonReference}
                        className={mergeClassNames(properties.className)}
                        variant={finalTriggerButtonVariant}
                        size={finalTriggerButtonSize}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        id={properties.id}
                        aria-invalid={properties['aria-invalid']}
                        aria-describedby={properties['aria-describedby']}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                    >
                        {selectedItem ? (
                            typeof selectedItem.children === 'string' ? (
                                <span className="truncate content--0">{selectedItem.children}</span>
                            ) : (
                                selectedItem.children ?? (
                                    <span className="truncate content--0">{selectedItem.value}</span>
                                )
                            )
                        ) : (
                            <span className="truncate content--placeholder">{placeholder}</span>
                        )}
                        <div className="grow" />
                        <ChevronDownIcon className="ml-4 h-4 w-4 content--2" />
                    </Button>
                }
            />
        );
    },
);

// Set the display name on the component for debugging
InputSelect.displayName = 'InputSelect';
