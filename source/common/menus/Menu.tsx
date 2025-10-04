'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';
import { MenuItemsList } from '@structure/source/common/menus/MenuItemsList';
import { MenuSearch } from '@structure/source/common/menus/MenuSearch';
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
// import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Class Names - Menu
export const menuClassName =
    // Layout and sizing
    `flex flex-col focus-visible:outline-none ` +
    // Border
    `rounded-small border border-light-4 dark:border-dark-4 ` +
    // Background and text
    `text-sm bg-light text-dark dark:bg-dark+2 dark:text-light`;

// Component - Menu
export interface MenuProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: string | React.ReactNode;
    items?: MenuItemProperties[];
    itemsClassName?: string;
    search?: boolean;
    highlightItemOnMount?: boolean; // Highlight the first item or first selected item on mount
    onItemSelected?: (
        item: MenuItemProperties,
        itemRenderIndex?: number,
        event?: React.MouseEvent<HTMLElement>,
    ) => void;

    // Optional asynchronous loading of menu items
    loadItems?: () => Promise<MenuItemProperties[]>;
    loadingItems?: boolean;
    loadingItemsMessage?: React.ReactNode;
    loadingItemsError?: React.ReactNode;
}
export function Menu(properties: MenuProperties) {
    // References
    const itemDomElementReferences = React.useRef<(HTMLButtonElement | null)[]>([]);
    const searchInputTextReference = React.useRef<InputReferenceInterface>(null);
    const typeaheadSearchReference = React.useRef('');
    const typeaheadTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // Defaults
    const highlightItemOnMount = properties.highlightItemOnMount ?? true;

    // Find the selected item to highlight
    let firstSelectedItemIndex = -1;

    // State
    const [items, setItems] = React.useState<MenuItemProperties[]>(
        (properties.items || []).map(function (item, itemIndex) {
            // If value is undefined, set it to the content if the content is a string
            if(item.value === undefined && typeof item.content === 'string') {
                item.value = item.content;
            }

            // If the item is selected, set the selectedMenuItemIndex
            if(item.selected && firstSelectedItemIndex === -1) {
                firstSelectedItemIndex = itemIndex;
            }

            return item;
        }),
    );
    const [itemsToRender, setItemsToRender] = React.useState<MenuItemProperties[]>(items);
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

            // Update the items to render
            setItemsToRender(
                itemsToRender.map(function (item) {
                    // For each item, update the selected state of the current itemsProperty state
                    const newItem = propertiesItems?.find(function (propertiesItem) {
                        return propertiesItem.value === item.value;
                    });
                    if(newItem) {
                        return newItem;
                    }
                    else {
                        return item;
                    }
                }),
            );
        },
        // Do not re-render whem itemsToRender changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [propertiesItems],
    );

    // Intercept the onClick events for items
    const propertiesOnItemSelected = properties.onItemSelected;
    const itemOnClickIntercept = React.useCallback(
        function (item: MenuItemProperties, itemRenderIndex: number, event: React.MouseEvent<HTMLElement, MouseEvent>) {
            // console.log('itemOnClickIntercept', itemRenderIndex, event.currentTarget);

            // Manage highlight
            setItemsToRenderHighlightIndex(itemRenderIndex);

            // Call the onSelected handler for the menu item
            if(item.onSelected !== undefined) {
                item.onSelected(item, itemRenderIndex, event);
            }

            // Call the onItemSelect handler for the menu
            if(propertiesOnItemSelected !== undefined) {
                propertiesOnItemSelected(item, itemRenderIndex, event);
            }
        },
        [propertiesOnItemSelected],
    );

    // Track the currently highlighted item reference and index for mouse hover
    const currentMouseHighlightedItemReference = React.useRef<HTMLButtonElement | null>(null);
    const currentMouseHighlightedItemIndexReference = React.useRef<number>(-1);

    // Intercept the onMouseMove events for items
    const itemOnMouseMoveIntercept = React.useCallback(function (
        item: MenuItemProperties,
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
        if(item.onMouseMove !== undefined) {
            item.onMouseMove(event);
        }
    }, []);

    // Handle keyboard events for highlight navigation
    const handleKeyDown = React.useCallback(
        function (event: React.KeyboardEvent<HTMLDivElement>) {
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

                // Press the button
                const itemDomElement = itemDomElementReferences.current[itemsToRenderHighlightIndex];
                // console.log('men uItemDomElement', itemDomElement);

                itemDomElement?.click();
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
        },
        [items, itemsToRender, itemsToRenderHighlightIndex],
    );

    // Search makes the list just display the items that match the search
    const search = React.useCallback(
        function (string: string) {
            string = string.trim(); // Trim whitespace
            // console.log('search', string);
            // console.log('items.length', items.length, items);

            // Search for the item starting with typed characters
            const searchPattern = new RegExp(string, 'i');

            // Collect all of the indexes of the items that match the search
            const foundMenuItems: MenuItemProperties[] = [];

            // Loop through the items
            for(let i = 0; i < items.length; i++) {
                // Search the value
                if(searchPattern.test(items[i]?.value ?? '')) {
                    const foundItem = items[i];
                    if(foundItem) {
                        foundMenuItems.push(foundItem);
                    }
                }
                // Search the content (if it is a string)
                else {
                    if(typeof items[i]?.content === 'string') {
                        const contentString = items[i]?.content as string;
                        if(searchPattern.test(contentString)) {
                            const foundItem = items[i];
                            if(foundItem) {
                                foundMenuItems.push(foundItem);
                            }
                        }
                    }
                }
            }

            // Update the items to render
            setItemsToRender(foundMenuItems);
        },
        [items],
    );

    // Function to scroll the highlighted menu item index into view
    const scrollHighlightedMenuItemIntoView = React.useCallback(
        function () {
            // Scroll highlighted item indexes into view
            const itemReference = itemDomElementReferences.current[itemsToRenderHighlightIndex];
            const container = itemReference?.parentNode;

            // Only scroll if the highlight source is keyboard
            if(highlightSourceReference.current == 'keyboard' && itemReference && container instanceof HTMLElement) {
                // console.log('Checking scroll position', 'item', item, 'container', container);

                // First, get the positions of the item and the container
                const itemBoundingClientRectangle = itemReference.getBoundingClientRect();
                const containerBoundingClientRectangle = container.getBoundingClientRect();
                // console.log('itemBoundingClientRectangle', itemBoundingClientRectangle);
                // console.log('containerBoundingClientRectangle', containerBoundingClientRectangle);

                // Get the distance from the top of the item to the top of the container
                const itemTopDistanceFromContainerTop =
                    itemBoundingClientRectangle.top - containerBoundingClientRectangle.top;
                // console.log('itemTopDistanceFromContainerTop', itemTopDistanceFromContainerTop);

                // Get the distance from the bottom of the item to the bottom of the container
                const itemBottomDistanceFromContainerBottom =
                    containerBoundingClientRectangle.bottom - itemBoundingClientRectangle.bottom;
                // console.log('itemBottomDistanceFromContainerBottom', itemBottomDistanceFromContainerBottom);

                // If the item is above the container, scroll up
                if(itemTopDistanceFromContainerTop < 0 || itemBottomDistanceFromContainerBottom < 0) {
                    // Scroll the item into view
                    itemReference.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                }
            }
        },
        [itemsToRenderHighlightIndex],
    );

    // Scroll the highlighted item into view when the highlighted item index changes
    React.useEffect(
        function () {
            scrollHighlightedMenuItemIntoView();
        },
        [itemsToRenderHighlightIndex, scrollHighlightedMenuItemIntoView],
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
                let items: MenuItemProperties[] = [];
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
        },
        [propertiesLoadItems],
    );

    // Load the menu items on mount or when the loadItems function changes
    React.useEffect(
        function () {
            loadMenuItems();
        },
        [loadMenuItems],
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
            {properties.title && <div className="border-b px-3 py-2.5 text-sm font-medium">{properties.title}</div>}

            {/* Menu Items */}
            {loadingItems ? (
                // Loading items
                <div className="flex flex-grow items-center justify-center p-4">
                    <div className="mr-1.5 animate-spin">
                        <BrokenCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="text-sm">{properties.loadingItemsMessage ?? 'Loading...'}</div>
                </div>
            ) : loadingItemsError ? (
                // Error loading items
                <div className="flex flex-grow items-center justify-center p-4">
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
                            itemDomElementReferences={itemDomElementReferences}
                            itemOnClickIntercept={itemOnClickIntercept}
                            itemOnMouseMoveIntercept={itemOnMouseMoveIntercept}
                        />
                    ) : (
                        // If there are no menu items
                        <div className="flex flex-grow flex-col items-center justify-center">
                            <div className="p-4 text-sm">No results found.</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
