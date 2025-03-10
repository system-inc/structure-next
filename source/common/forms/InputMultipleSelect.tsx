// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputInterface } from '@structure/source/common/forms/Input';
import { PopoverInterface } from '@structure/source/common/popovers/Popover';
import { PopoverMenuInterface, PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

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
export interface InputMultipleSelectReferenceInterface {
    getValue: () => string[] | undefined;
    setValue: (value?: string[], event?: any) => void;
    focus: () => void;
}

// Interface InputMultipleSelectItemInterface
// We use property.defaultValue and value state to manage the selected items
export interface InputMultipleSelectItemInterface extends Omit<MenuItemInterface, 'selected'> {}

// Component - InputMultipleSelect
export interface InputMultipleSelectInterface extends Omit<InputInterface, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: string[];

    title?: string | React.ReactNode;
    items?: InputMultipleSelectItemInterface[];
    placeholder?: string;
    closeOnItemSelected?: boolean;

    // Events
    onChange?: (value: string[] | undefined, event: any) => void;
    onBlur?: (value: string[] | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    variant?: keyof typeof InputMultipleSelectVariants;
    size?: keyof typeof InputMultipleSelectSizes;
    search?: boolean;

    popoverMenuProperties?: PopoverMenuInterface;
    popoverProperties?: Omit<PopoverInterface, 'children' | 'content'>;
    buttonProperties?: ButtonInterface;

    // Optional asynchronous loading of menu items
    loadItems?: () => Promise<MenuItemInterface[]>;
    loadingItems?: boolean;
    loadingItemsMessage?: React.ReactNode;
    loadingItemsError?: React.ReactNode;
}
export const InputMultipleSelect = React.forwardRef<
    InputMultipleSelectReferenceInterface,
    InputMultipleSelectInterface
>(function (properties: InputMultipleSelectInterface, reference: React.Ref<InputMultipleSelectReferenceInterface>) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';
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
                let items: InputMultipleSelectItemInterface[] = [];
                try {
                    items = await propertiesLoadItems();

                    // Set the items
                    setItems(items);
                }
                catch(error: any) {
                    console.error('Error loading menu items:', error);
                    // Set the loading error
                    setLoadingItemsError(error.message ?? 'Error Loading Items');
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

    // Update the items when the default items change
    React.useEffect(
        function () {
            setValue(properties.defaultValue);
        },
        [properties.defaultValue],
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
        function (menuItem: MenuItemInterface, menuItemRenderIndex?: number, event?: any) {
            // console.log('InputMultipleSelect.tsx value changed:', menuItem.value);

            let newValue: string[] = [];

            // If the value is not undefined
            if(menuItem.value !== undefined) {
                // If the item is already selected
                if(value?.includes(menuItem.value)) {
                    // Remove the item from from the value
                    newValue = value?.filter((item) => item !== menuItem.value);
                }
                // Otherwise, if the item is not already selected
                else {
                    // Calculate the new value preserving the order of the items for the value
                    propertiesItems?.forEach(function (item, itemIndex) {
                        if(item.value) {
                            // If the item is the selected item, add it to the new value
                            if(item.value === menuItem.value) {
                                newValue.push(item.value);
                            }
                            // If the item is not the selected item, but is already in the value, add it to the new value
                            else if(value?.includes(item.value)) {
                                newValue.push(item.value);
                            }
                        }
                    });
                }

                // Set the new value
                setValue(newValue);
            }

            // Call the onChange callback if it exists
            if(propertiesOnChange) {
                propertiesOnChange(newValue, event);
            }

            // Close the popover
            if(closeOnItemSelected) {
                // console.log('Closing popover');
                setOpen(false);
            }
            else {
                // console.log('Not closing popover');
            }
        },
        [value, propertiesItems, propertiesOnChange, closeOnItemSelected],
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
            items={items.map((item, index) => {
                // Determine if the item is selected
                const selected = Boolean(item.value && value?.includes(item.value));

                return {
                    ...item,
                    content: item.content ?? item.value,
                    icon: selected ? CheckIcon : undefined,
                    iconPosition: 'left' as 'left' | 'right' | undefined,
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
        >
            <Button
                ref={buttonReference}
                className={mergeClassNames(properties.className)}
                variant="formInputSelect"
                size="formInputSelect"
                loading={loadingItems}
                // disabled={properties.disabled || loadingItems}
                tabIndex={properties.tabIndex}
                onBlur={onBlurIntercept}
                onKeyDown={function (event) {
                    // console.log('InputMultipleSelect.tsx onKeyDown', event.code);

                    // Open the popover when the user presses the arrow keys, spacebar, or enter
                    // We need this duplicated logic (the same logic exists in the Popover class)
                    // in order to prevent the Popover from staying open when the it is opened using
                    // the keyboard
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
                {properties.buttonProperties?.children ? (
                    // If the button has a children property set, use that instead of the selected items or placeholder
                    properties.buttonProperties?.children
                ) : // Otherwise, if there are selected items, show them
                selectedItems && selectedItems?.length > 0 ? (
                    <div className="flex space-x-1">
                        {
                            // Multiple selections enabled, map over them
                            selectedItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-small flex px-2 py-1.5 text-xs text-dark-6 dark:bg-dark-4 dark:text-light-6"
                                >
                                    {item.content}
                                    <CloseIcon
                                        className="ml-1 h-4 w-4 rounded-full bg-light-6 text-dark-4"
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
                    <span className="truncate text-dark-6 dark:text-light-6">{placeholder}</span>
                )}
            </Button>
        </PopoverMenu>
    );
});

// Set the display name for the component for debugging
InputMultipleSelect.displayName = 'InputMultipleSelect';

// Export - Default
export default InputMultipleSelect;
