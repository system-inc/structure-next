// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputInterface } from '@structure/source/common/forms/Input';
import { PopoverInterface } from '@structure/source/common/popovers/Popover';
import { PopoverMenuInterface, PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// InputSelect - Variants
export const InputSelectVariants = {
    // Default variant
    default:
        // Layout and sizing
        ``,
};

// InputSelect - Sizes
export const InputSelectSizes = {
    default: '',
};

// Interface InputSelectItemInterface
// We use property.defaultValue and value state to manage the selected items
export interface InputSelectItemInterface extends Omit<MenuItemInterface, 'selected'> {}

// Component - InputSelect
export interface InputSelectInterface extends Omit<InputInterface, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: string;

    title?: string | React.ReactNode;
    items?: InputSelectItemInterface[];
    placeholder?: string;
    allowNoSelection?: boolean;

    // Events
    onChange?: (value: string | undefined, event: any) => void;
    onBlur?: (value: string | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    variant?: keyof typeof InputSelectVariants;
    size?: keyof typeof InputSelectSizes;
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
export const InputSelect = React.forwardRef<InputReferenceInterface, InputSelectInterface>(function (
    properties: InputSelectInterface,
    reference: React.Ref<InputReferenceInterface>,
) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';
    const placeholder = properties.placeholder || 'Select...';

    // State
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string | undefined>(properties.defaultValue);
    const [items, setItems] = React.useState(properties.items ?? []);
    const [loadingItems, setLoadingItems] = React.useState<boolean>(properties.loadingItems ? true : false);
    const [loadingItemsError, setLoadingItemsError] = React.useState<React.ReactNode>(properties.loadingItemsError);

    // selectedItem updates any time the value or items change
    const selectedItem = React.useMemo(
        function () {
            const selectedItem = items.find(function (item) {
                return item.value && item.value === value;
            });

            if(selectedItem && selectedItem.content === undefined) {
                selectedItem.content = selectedItem.value;
            }

            return selectedItem;
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
                let items: InputSelectItemInterface[] = [];
                try {
                    items = await propertiesLoadItems();

                    // Set the items
                    setItems(items);
                }
                catch(error: any) {
                    console.log('Error loading menu items:', error);
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
    const propertiesOnChange = properties.onChange;
    const propertiesAllowNoSelection = properties.allowNoSelection;
    const onChangeIntercept = React.useCallback(
        function (menuItem: MenuItemInterface, menuItemRenderIndex: number, event: any) {
            // console.log('InputSelect.tsx value changed:', menuItem.value);
            let newValue = menuItem.value;

            // If the value is not undefined
            if(newValue !== undefined) {
                // If the item is already selected
                if(menuItem.value == value) {
                    // If we allow no selection, clear the value
                    if(propertiesAllowNoSelection) {
                        // console.log('Clearing value', value);
                        newValue = undefined;
                    }
                }

                // Set the new value
                setValue(newValue);
            }

            // Call the onChange callback if it exists
            if(propertiesOnChange) {
                propertiesOnChange(newValue, event);
            }
        },
        [value, propertiesAllowNoSelection, propertiesOnChange],
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
                let selected = item.value === value;

                return {
                    ...item,
                    content: item.content ?? item.value,
                    icon: selected ? CheckIcon : undefined,
                    iconPosition: 'left' as 'left' | 'right' | undefined,
                    highlighted: selected,
                    selected: selected,
                };
            })}
            // loadItems={properties.loadItems}
            loadingItems={loadingItems}
            loadingItemsMessage={properties.loadingItemsMessage}
            loadingItemsError={loadingItemsError}
            search={properties.search}
            onItemSelected={onChangeIntercept}
            closeOnItemSelect={true}
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
                    // console.log('InputSelect.tsx onKeyDown', event.code);

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
                {
                    // If there is a selected item
                    selectedItem ? (
                        typeof selectedItem!.content === 'string' ? (
                            // If the content is a string, create a container for it
                            <span className="truncate text-dark-6 dark:text-light-6">{selectedItem.content}</span>
                        ) : (
                            // If the content is not a string, use the content as the button content
                            selectedItem.content
                        )
                    ) : (
                        // No selected items, show the placeholder
                        <span className="truncate text-dark-6 dark:text-light-6">{placeholder}</span>
                    )
                }
            </Button>
        </PopoverMenu>
    );
});

// Set the display name for the component for debugging
InputSelect.displayName = 'InputSelect';

// Export - Default
export default InputSelect;
