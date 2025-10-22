// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputProperties } from '@structure/source/components/forms/Input';
import { PopoverProperties } from '@structure/source/components/popovers/Popover';
import { PopoverMenuProperties, PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { MenuItemInterface } from '@structure/source/components/menus/Menu';
import { NonLinkButtonProperties, Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// InputMultipleSelect - Variants
export const InputMultipleSelectVariants = {
    // Default variant
    default:
        // Layout and sizing
        ``,
};

// InputMultipleSelect - Sizes
export const InputMultipleSelectSizes = {
    default: '',
};

// Interface - InputMultipleSelectReference
export interface InputMultipleSelectReferenceProperties {
    getValue: () => string[] | undefined;
    setValue: (value?: string[], event?: unknown) => void;
    focus: () => void;
}

// Interface InputMultipleSelectItemInterface
// We use property.defaultValue and value state to manage the selected items
// Exclude asChild/href link variants since select items are always buttons
export type InputMultipleSelectItemProperties = Omit<MenuItemInterface, 'selected' | 'asChild' | 'href' | 'target'>;

// Component - InputMultipleSelect
export interface InputMultipleSelectProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: string[];

    title?: string | React.ReactNode;
    items?: InputMultipleSelectItemProperties[];
    placeholder?: string;
    closeOnItemSelected?: boolean;

    // Events
    onChange?: (value: string[] | undefined, event: React.MouseEvent | React.KeyboardEvent | unknown) => void;
    onBlur?: (value: string[] | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    variant?: keyof typeof InputMultipleSelectVariants;
    size?: keyof typeof InputMultipleSelectSizes;
    search?: boolean;

    popoverMenuProperties?: PopoverMenuProperties;
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'children' | 'content'>;
    buttonProperties?: Omit<NonLinkButtonProperties, 'onBlur' | 'onKeyDown'>;

    // Optional asynchronous loading of menu items
    loadItems?: () => Promise<MenuItemInterface[]>;
    loadingItems?: boolean;
    loadingItemsMessage?: React.ReactNode;
    loadingItemsError?: React.ReactNode;
}
export const InputMultipleSelect = React.forwardRef<
    InputMultipleSelectReferenceProperties,
    InputMultipleSelectProperties
>(function (properties: InputMultipleSelectProperties, reference: React.Ref<InputMultipleSelectReferenceProperties>) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // Defaults
    // const variant = properties.variant || 'default';
    // const size = properties.size || 'default';
    const placeholder = properties.placeholder || 'Select...';
    const closeOnItemSelected = properties.closeOnItemSelected ?? true;

    // State
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string[] | undefined>(properties.defaultValue);
    const [items, setItems] = React.useState(properties.items || []);
    const [loadingItems, setLoadingItems] = React.useState<boolean>(properties.loadingItems ? true : false);
    const [loadingItemsError, setLoadingItemsError] = React.useState<React.ReactNode>(properties.loadingItemsError);

    // selectedItems updates any time the value or items change
    const selectedItems = React.useMemo(
        function () {
            return items.filter(function (item) {
                if(item.value) {
                    return value?.includes(item.value);
                }
            });
        },
        [items, value],
    );

    // Function to load the menu items
    const propertiesLoadItems = properties.loadItems;
    const loadMenuItems = React.useCallback(
        async function () {
            // If a load function is provided, load the items
            if(propertiesLoadItems) {
                // Reset the loading state
                setLoadingItemsError(undefined);

                // Set loading to true
                setLoadingItems(true);

                // Load the items
                let items: InputMultipleSelectItemProperties[] = [];
                try {
                    items = await propertiesLoadItems();

                    // Set the items
                    setItems(items);
                }
                catch(error) {
                    console.error('Error loading menu items:', error);
                    // Set the loading error
                    const errorMessage = error instanceof Error ? error.message : 'Error Loading Items';
                    setLoadingItemsError(errorMessage);
                }

                // console.log('Loaded menu items');

                // Set loading to false
                setLoadingItems(false);
            }
        },
        [propertiesLoadItems],
    );

    // Load the menu items on mount
    React.useEffect(
        function () {
            loadMenuItems();
        },
        [loadMenuItems],
    );

    // Function to expose methods to parent components
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return value;
            },
            setValue: function (value) {
                setValue(value);
            },
            focus: function () {
                // Call the focus method on the button's DOM element
                buttonReference.current?.focus();
            },
        };
    });

    // Function to handle input value changes
    const propertiesItems = properties.items;
    const propertiesOnChange = properties.onChange;
    const onChangeIntercept = React.useCallback(
        function (
            menuItem: MenuItemInterface,
            menuItemRenderIndex?: number,
            event?: React.MouseEvent | React.KeyboardEvent | unknown,
        ) {
            let newValue: string[] = [];

            // Use functional setState to get the current value
            setValue(function (currentValue) {
                // If the value is not undefined
                if(menuItem.value !== undefined) {
                    // If the item is already selected
                    if(currentValue?.includes(menuItem.value)) {
                        // Remove the item from from the value
                        newValue = currentValue?.filter((item) => item !== menuItem.value);
                    }
                    // Otherwise, if the item is not already selected
                    else {
                        // Calculate the new value preserving the order of the items for the value
                        propertiesItems?.forEach(function (item) {
                            if(item.value) {
                                // If the item is the selected item, add it to the new value
                                if(item.value === menuItem.value) {
                                    newValue.push(item.value);
                                }
                                // If the item is not the selected item, but is already in the value, add it to the new value
                                else if(currentValue?.includes(item.value)) {
                                    newValue.push(item.value);
                                }
                            }
                        });
                    }
                }

                return newValue;
            });

            // Call the onChange callback if it exists (outside of setState)
            propertiesOnChange?.(newValue, event);

            // Close the popover
            if(closeOnItemSelected) {
                setOpen(false);
            }
        },
        [propertiesItems, propertiesOnChange, closeOnItemSelected],
    );

    // Function to handle blur events
    const propertiesOnBlur = properties.onBlur;
    const onBlurIntercept = React.useCallback(
        function (event: React.FocusEvent<HTMLButtonElement>) {
            // Run the provided form input onBlur function if provided
            if(propertiesOnBlur) {
                propertiesOnBlur(value, event);
            }
        },
        [propertiesOnBlur, value],
    );

    // Render the component
    return (
        <PopoverMenu
            key={loadingItems ? 'popoverMenuLoading' : 'popoverMenuLoaded'}
            {...properties.popoverMenuProperties}
            className={mergeClassNames('', properties.popoverMenuProperties?.className)}
            title={properties.title}
            items={items.map(function (item) {
                // Determine if the item is selected
                const selected = Boolean(item.value && value?.includes(item.value));

                return {
                    ...item,
                    children: item.children ?? item.value,
                    iconLeft: selected ? CheckIcon : undefined,
                    className: mergeClassNames('gap-2', item.className),
                    highlighted: undefined,
                    selected: selected,
                };
            })}
            // loadItems={properties.loadItems}
            loadingItems={loadingItems}
            loadingItemsMessage={properties.loadingItemsMessage}
            loadingItemsError={loadingItemsError}
            search={properties.search}
            onItemSelected={onChangeIntercept}
            closeOnItemSelected={closeOnItemSelected}
            popoverProperties={{
                ...properties.popoverProperties,
                open: open,
                onOpenChange: setOpen,
            }}
            trigger={
                <Button
                    ref={buttonReference}
                    className={mergeClassNames(properties.className)}
                    variant="FormInputSelect"
                    size="FormInputSelect"
                    isLoading={loadingItems}
                    tabIndex={properties.tabIndex}
                    onBlur={onBlurIntercept}
                    onKeyDown={function (event: React.KeyboardEvent<HTMLButtonElement>) {
                        // Open the popover when the user presses the arrow keys, spacebar, or enter
                        if(
                            open == false &&
                            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)
                        ) {
                            event.preventDefault();
                            setOpen(true);
                        }
                    }}
                    {...properties.buttonProperties}
                >
                    {properties.buttonProperties?.children !== undefined ? (
                        // If the button has a children property set, use that instead of the selected items or placeholder
                        properties.buttonProperties?.children
                    ) : // Otherwise, if there are selected items, show them
                    selectedItems && selectedItems?.length > 0 ? (
                        <div className="flex space-x-1">
                            {
                                // Multiple selections enabled, map over them
                                selectedItems.map((item, index) => (
                                    <div key={index} className="flex rounded-sm px-2 py-1.5 text-xs content--1">
                                        {item.children}
                                        <CloseIcon
                                            className="ml-1 h-4 w-4 rounded-full content--1"
                                            onClick={function (event: Event) {
                                                event.stopPropagation();
                                                onChangeIntercept(item, index, event);
                                            }}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        // If the button has no children property, and there are no selected items, show the placeholder
                        <span className="truncate content--1">{placeholder}</span>
                    )}
                </Button>
            }
        />
    );
});

// Set the display name for the component for debugging
InputMultipleSelect.displayName = 'InputMultipleSelect';
