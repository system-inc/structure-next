'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemInterface, MenuItem } from '@structure/source/common/menus/MenuItem';
import { InputReferenceInterface } from '@structure/source/common/forms/Input';
import { InputText } from '@structure/source/common/forms/InputText';
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
    `rounded-md border border-light-4 dark:border-dark-4 ` +
    // Background and text
    `text-sm bg-light text-dark dark:bg-dark+2 dark:text-light`;

// Component - Menu
export interface MenuInterface extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
export function Menu(properties: MenuInterface) {
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
    const [items, setItems] = React.useState<MenuItemInterface[]>(
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
    const [itemsToRender, setItemsToRender] = React.useState<MenuItemInterface[]>(items);
    const [itemsToRenderHighlightIndex, setItemsToRenderHighlightIndex] = React.useState(
        highlightItemOnMount ? (firstSelectedItemIndex !== -1 ? firstSelectedItemIndex : 0) : -1,
    );
    const [highlightSource, setHighlightSource] = React.useState<'keyboard' | 'mouse' | null>(null);
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
        function (item: MenuItemInterface, itemRenderIndex: number, event: React.MouseEvent<HTMLElement, MouseEvent>) {
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

    // Intercept the onMouseMove events for items
    const itemOnMouseMoveIntercept = React.useCallback(function (
        item: MenuItemInterface,
        itemIndex: number,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        // console.log('itemOnMouseMoveIntercept', itemIndex, event.currentTarget);

        // Update the highlight source to 'mouse'
        setHighlightSource('mouse');

        // Manage highlight
        setItemsToRenderHighlightIndex(itemIndex);

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
                typeaheadTimeoutReference.current = setTimeout(() => {
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
                // Update the highlight source to 'keyboard'
                setHighlightSource('keyboard');

                // Set the new highlighted item index
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
            if(highlightSource == 'keyboard' && itemReference && container instanceof HTMLElement) {
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
        [highlightSource, itemsToRenderHighlightIndex],
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
                        <InputText
                            ref={searchInputTextReference}
                            id="menuSearch"
                            variant="menuSearch"
                            placeholder="Search..."
                            autoComplete="off"
                            onKeyDown={function (event: React.KeyboardEvent<HTMLInputElement>) {
                                // Prevent any keys except for arrow and escape keys to bubble up to the menu
                                if(
                                    event.key !== 'ArrowDown' &&
                                    event.key !== 'ArrowUp' &&
                                    event.key !== 'Escape' &&
                                    event.key !== 'Enter'
                                ) {
                                    event.stopPropagation();
                                }
                            }}
                            onChange={function (
                                value: string | undefined,
                                // event?: React.ChangeEvent<HTMLInputElement>,
                            ) {
                                // console.log('onChange', event.currentTarget.value);
                                // Search on all change events
                                search((value = value ?? ''));
                            }}
                        />
                    )}

                    {/* Menu Items */}
                    {itemsToRender.length ? (
                        // If there are menu items
                        <div className={mergeClassNames('overflow-y-auto p-1', properties.itemsClassName)}>
                            {itemsToRender.map(function (itemToRender, itemToRenderIndex) {
                                return (
                                    <MenuItem
                                        {...itemToRender}
                                        key={itemToRenderIndex}
                                        ref={function (element) {
                                            itemDomElementReferences.current[itemToRenderIndex] = element;
                                        }}
                                        tabIndex={-1}
                                        className={mergeClassNames('w-full', itemToRender.className)}
                                        onClick={async function (event: React.MouseEvent<HTMLElement, MouseEvent>) {
                                            itemOnClickIntercept(itemToRender, itemToRenderIndex, event);
                                        }}
                                        onMouseMove={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
                                            itemOnMouseMoveIntercept(itemToRender, itemToRenderIndex, event);
                                        }}
                                        highlighted={itemToRenderIndex === itemsToRenderHighlightIndex}
                                    />
                                );
                            })}
                        </div>
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

// Export - Default
export default Menu;
