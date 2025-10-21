'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemProperties, MenuItemHandle } from '@structure/source/components/menus/MenuItem';
import { MenuItemsList } from '@structure/source/components/menus/MenuItemsList';
import { MenuSearch } from '@structure/source/components/menus/MenuSearch';
import { InputReferenceInterface } from '@structure/source/components/forms/Input';
// import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { getStringFromReactNode } from '@structure/source/utilities/react/React';

// Class Names - Menu
export const menuClassName =
    // Layout and sizing
    `flex flex-col focus-visible:outline-none ` +
    // Border
    `rounded-small border border--d ` +
    // Background and text
    `text-sm background--a foreground--a`;

// Type - MenuItemInterface
// Menu-specific interface that extends MenuItemProperties
export type MenuItemInterface = MenuItemProperties & {
    value?: string; // Used for search and typeahead
    onSelected?: (menuItem: MenuItemInterface, menuItemRenderIndex: number, event: React.SyntheticEvent) => void;
    closeMenuOnSelected?: boolean; // Controls whether menu closes on selection (used in PopoverMenu)
};

// Component - Menu
export interface MenuProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: string | React.ReactNode;
    items?: MenuItemInterface[];
    itemsClassName?: string;
    search?: boolean;
    highlightItemOnMount?: boolean; // Highlight the first item or first selected item on mount
    onItemSelected?: (item: MenuItemInterface, itemRenderIndex?: number, event?: React.MouseEvent<HTMLElement>) => void;

    // Optional asynchronous loading of menu items
    loadItems?: () => Promise<MenuItemInterface[]>;
    loadingItems?: boolean;
    loadingItemsMessage?: React.ReactNode;
    loadingItemsError?: React.ReactNode;
}
export function Menu(properties: MenuProperties) {
    // References
    const itemHandleReferences = React.useRef<(MenuItemHandle | null)[]>([]);
    const itemReferenceCallbacksCache = React.useRef(new Map<number, (handle: MenuItemHandle | null) => void>());
    const searchInputTextReference = React.useRef<InputReferenceInterface>(null);
    const typeaheadSearchReference = React.useRef('');
    const typeaheadTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // Function to get a stable ref callback for a given index
    // This caches callbacks to ensure the same function reference is used across renders
    function getItemReference(index: number) {
        let callback = itemReferenceCallbacksCache.current.get(index);
        if(!callback) {
            callback = function (handle: MenuItemHandle | null) {
                itemHandleReferences.current[index] = handle;
            };
            itemReferenceCallbacksCache.current.set(index, callback);
        }
        return callback;
    }

    // Defaults
    const highlightItemOnMount = properties.highlightItemOnMount ?? true;

    // State - Initialize items with value and find first selected index
    const [items, setItems] = React.useState<MenuItemInterface[]>(function () {
        return (properties.items || []).map(function (item) {
            // If value is undefined, extract it from children
            if(item.value === undefined) {
                item.value = getStringFromReactNode(item.children);
            }

            return item;
        });
    });

    // Find the first selected item index for initial highlight
    const firstSelectedItemIndex = items.findIndex(function (item) {
        return item.selected;
    });
    const [itemsToRender, setItemsToRender] = React.useState<MenuItemInterface[]>(items);
    const [itemsToRenderHighlightIndex, setItemsToRenderHighlightIndex] = React.useState(
        highlightItemOnMount ? (firstSelectedItemIndex !== -1 ? firstSelectedItemIndex : 0) : -1,
    );
    const highlightSourceReference = React.useRef<'keyboard' | 'mouse' | null>(null);
    const [loadingItems, setLoadingItems] = React.useState<boolean>(properties.loadingItems ? true : false);
    const [loadingItemsError, setLoadingItemsError] = React.useState<React.ReactNode>(properties.loadingItemsError);

    // Update the items state when the properties change
    const propertiesItems = properties.items;
    React.useEffect(
        function () {
            setItems(propertiesItems ?? []);

            // Update the items to render based on the new properties items
            if(propertiesItems) {
                setItemsToRender(function (previousItemsToRender) {
                    return previousItemsToRender.map(function (item) {
                        // For each item, update the selected state of the current itemsProperty state
                        const newItem = propertiesItems.find(function (propertiesItem) {
                            return propertiesItem.value === item.value;
                        });
                        if(newItem) {
                            return newItem;
                        }
                        else {
                            return item;
                        }
                    });
                });
            }
        },
        [propertiesItems],
    );

    // Intercept the onClick events for items
    function itemOnClickIntercept(
        item: MenuItemInterface,
        itemRenderIndex: number,
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) {
        // console.log('itemOnClickIntercept', itemRenderIndex, event.currentTarget);

        // Manage highlight
        setItemsToRenderHighlightIndex(itemRenderIndex);

        // Call the onSelected handler for the menu item
        item.onSelected?.(item, itemRenderIndex, event);

        // Call the onItemSelect handler for the menu
        properties.onItemSelected?.(item, itemRenderIndex, event);
    }

    // Track the currently highlighted item reference and index for mouse hover
    const currentMouseHighlightedItemReference = React.useRef<HTMLButtonElement | null>(null);
    const currentMouseHighlightedItemIndexReference = React.useRef<number>(-1);

    // Intercept the onMouseMove events for items
    function itemOnMouseMoveIntercept(
        item: MenuItemInterface,
        itemIndex: number,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        // console.log('itemOnMouseMoveIntercept', itemIndex, event.currentTarget);

        // Skip if item is disabled or already highlighting this item
        if(item.disabled || currentMouseHighlightedItemIndexReference.current === itemIndex) {
            return;
        }

        // Update the highlight source to 'mouse'
        highlightSourceReference.current = 'mouse';

        // Use direct DOM manipulation for mouse hover to avoid React re-renders
        const targetElement = event.currentTarget;

        // Remove highlight from previously highlighted item
        if(
            currentMouseHighlightedItemReference.current &&
            currentMouseHighlightedItemReference.current !== targetElement
        ) {
            currentMouseHighlightedItemReference.current.removeAttribute('data-highlighted');
        }

        // Add highlight to current item
        targetElement.setAttribute('data-highlighted', 'true');
        currentMouseHighlightedItemReference.current = targetElement;
        currentMouseHighlightedItemIndexReference.current = itemIndex;

        // Call the onMouseMove handler for the menu item
        item.onMouseMove?.(event);
    }

    // Handle keyboard events for highlight navigation
    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        // console.log('handleKeyDown', event.key, highlightedRenderedMenuItemsIndex);

        let newHighlightedMenuItemIndex;

        // Arrow down
        if(event.key === 'ArrowDown') {
            newHighlightedMenuItemIndex = itemsToRenderHighlightIndex;
            do {
                newHighlightedMenuItemIndex = (newHighlightedMenuItemIndex + 1) % itemsToRender.length;
            } while(itemsToRender[newHighlightedMenuItemIndex]?.disabled);
            event.preventDefault();
        }
        // Arrow up
        else if(event.key === 'ArrowUp') {
            newHighlightedMenuItemIndex = itemsToRenderHighlightIndex;
            do {
                newHighlightedMenuItemIndex =
                    (newHighlightedMenuItemIndex - 1 + itemsToRender.length) % itemsToRender.length;
            } while(itemsToRender[newHighlightedMenuItemIndex]?.disabled);
            event.preventDefault();
        }
        // Enter or space
        else if(event.key === 'Enter') {
            // console.log('Press enter');

            event.preventDefault();

            // Get the highlighted item and trigger its click handler
            const highlightedItem = itemsToRender[itemsToRenderHighlightIndex];
            if(highlightedItem) {
                // Create a synthetic event to pass to the click handler
                const syntheticEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                itemOnClickIntercept(
                    highlightedItem,
                    itemsToRenderHighlightIndex,
                    syntheticEvent as unknown as React.MouseEvent<HTMLElement, MouseEvent>,
                );
            }
        }
        // Escape
        else if(event.key === 'Escape') {
            // console.log('Escape pressed!');
        }
        // Typeahead
        else if(!event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
            typeaheadSearchReference.current += event.key.toLowerCase();
            if(typeaheadTimeoutReference.current !== null) {
                clearTimeout(typeaheadTimeoutReference.current);
            }
            typeaheadTimeoutReference.current = setTimeout(function () {
                typeaheadSearchReference.current = '';
            }, 300); // Reset after a delay

            // Search for the item starting with typed characters
            const searchPattern = new RegExp(`^${typeaheadSearchReference.current}`, 'i');
            let foundMenuItemIndex = -1;

            // Start searching from the item after the currently focused item
            for(let i = 0; i < items.length; i++) {
                const itemIndex = (itemsToRenderHighlightIndex + 1 + i) % items.length;
                if(!items[itemIndex]?.disabled && searchPattern.test(items[itemIndex]?.value ?? '')) {
                    foundMenuItemIndex = itemIndex;
                    break;
                }
            }

            if(foundMenuItemIndex !== -1) {
                newHighlightedMenuItemIndex = foundMenuItemIndex;
            }
        }

        // Update focus
        if(newHighlightedMenuItemIndex !== undefined) {
            // Clear any mouse highlight before switching to keyboard mode
            if(currentMouseHighlightedItemReference.current) {
                currentMouseHighlightedItemReference.current.removeAttribute('data-highlighted');
                currentMouseHighlightedItemReference.current = null;
                currentMouseHighlightedItemIndexReference.current = -1;
            }

            // Update the highlight source to 'keyboard'
            highlightSourceReference.current = 'keyboard';

            // Set the new highlighted item index (this will use React state for keyboard highlighting)
            setItemsToRenderHighlightIndex(newHighlightedMenuItemIndex);
        }
    }

    // Search makes the list just display the items that match the search
    function search(string: string) {
        string = string.trim(); // Trim whitespace
        // console.log('search', string);
        // console.log('items.length', items.length, items);

        // Search for the item starting with typed characters
        const searchPattern = new RegExp(string, 'i');

        // Collect all of the indexes of the items that match the search
        const foundMenuItems: MenuItemInterface[] = [];

        // Loop through the items
        for(let i = 0; i < items.length; i++) {
            // Search the value
            if(searchPattern.test(items[i]?.value ?? '')) {
                const foundItem = items[i];
                if(foundItem) {
                    foundMenuItems.push(foundItem);
                }
            }
            // Search the children
            else {
                const childrenString = getStringFromReactNode(items[i]?.children);
                if(childrenString && searchPattern.test(childrenString)) {
                    const foundItem = items[i];
                    if(foundItem) {
                        foundMenuItems.push(foundItem);
                    }
                }
            }
        }

        // Update the items to render
        setItemsToRender(foundMenuItems);
    }

    // Scroll the highlighted item into view when the highlighted item index changes
    React.useEffect(
        function () {
            // Only scroll if the highlight source is keyboard
            if(highlightSourceReference.current === 'keyboard') {
                const itemHandle = itemHandleReferences.current[itemsToRenderHighlightIndex];
                if(itemHandle) {
                    // Get the bounding rectangle to check if scrolling is needed
                    const itemBoundingClientRectangle = itemHandle.getBoundingClientRect();
                    if(!itemBoundingClientRectangle) {
                        return;
                    }

                    // Find the scrollable container
                    // We need to get the parent of the button element for the container bounds
                    // Since we don't have direct DOM access, we'll just scroll the item into view
                    itemHandle.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                }
            }
        },
        [itemsToRenderHighlightIndex],
    );

    // Load the menu items on mount or when the loadItems function changes
    const propertiesLoadItems = properties.loadItems;
    React.useEffect(
        function () {
            async function loadMenuItems() {
                // If a load function is provided, load the items
                if(propertiesLoadItems) {
                    // Reset the loading state
                    setLoadingItemsError(undefined);

                    // Set loading to true
                    setLoadingItems(true);

                    // Load the items
                    let items: MenuItemInterface[] = [];
                    try {
                        items = await propertiesLoadItems();

                        // Set the items
                        setItems(items);
                        setItemsToRender(items);
                    }
                    catch(error: unknown) {
                        console.log('Error loading menu items:', error);
                        setLoadingItemsError(error instanceof Error ? error.message : 'Error Loading Items');
                    }

                    // Set loading to false
                    setLoadingItems(false);
                }
            }

            loadMenuItems();
        },
        [propertiesLoadItems],
    );

    // Render the component
    return (
        <div
            tabIndex={0} // Make the menu focusable
            className={mergeClassNames(menuClassName, properties.className)}
            style={properties.style}
            onKeyDown={handleKeyDown}
            // Enable keyboard navigation when hovering over the menu
            onMouseEnter={function (event) {
                // Check if the search input is not the active element
                if(document.activeElement !== searchInputTextReference.current) {
                    // Focus on the search input
                    if(searchInputTextReference.current) {
                        // console.log('Focusing on search input on menu mouse enter.');
                        searchInputTextReference.current.focus();
                    }
                    // Focus on the menu
                    else {
                        event.currentTarget.focus();
                    }
                }
            }}
        >
            {/* Menu Title */}
            {properties.title && (
                <div className="border-b border--a px-3 py-2.5 text-sm font-medium">{properties.title}</div>
            )}

            {/* Menu Items */}
            {loadingItems ? (
                // Loading items
                <div className="flex grow items-center justify-center p-4">
                    <div className="mr-1.5 animate-spin">
                        <BrokenCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="text-sm">{properties.loadingItemsMessage ?? 'Loading...'}</div>
                </div>
            ) : loadingItemsError ? (
                // Error loading items
                <div className="flex grow items-center justify-center p-4">
                    <div className="mr-1.5">
                        <ErrorIcon className="h-5 w-5" />
                    </div>
                    <div className="text-sm">{loadingItemsError ?? 'Error Loading Items'}</div>
                </div>
            ) : (
                // If there are menu items to display
                <>
                    {/* Search */}
                    {properties.search && (
                        <MenuSearch searchInputTextReference={searchInputTextReference} onSearch={search} />
                    )}

                    {/* Menu Items */}
                    {itemsToRender.length ? (
                        // If there are menu items
                        <MenuItemsList
                            itemsToRender={itemsToRender}
                            itemsToRenderHighlightIndex={itemsToRenderHighlightIndex}
                            itemsClassName={properties.itemsClassName}
                            getItemReference={getItemReference}
                            itemOnClickIntercept={itemOnClickIntercept}
                            itemOnMouseMoveIntercept={itemOnMouseMoveIntercept}
                        />
                    ) : (
                        // If there are no menu items
                        <div className="flex grow flex-col items-center justify-center">
                            <div className="p-4 text-sm">No results found.</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
