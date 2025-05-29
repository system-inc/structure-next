// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useDrag } from '@use-gesture/react';

// Dependencies - Animation
import { useSprings, animated } from '@react-spring/web';

// Function to swap two items in an array
function swap<T>(array: T[], from: number, to: number) {
    // console.log({ array });
    // console.log('Swapping ', array[from], ' with ', array[to], ' from index ', from, ' to index ', to);

    if(from === to) {
        return array;
    }

    const newArray = [...array];
    const item = newArray.splice(from, 1)[0];
    if(item !== undefined) {
        newArray.splice(to, 0, item);
    }
    else {
        throw new Error('Item not found');
    }
    return newArray;
}

// Function to clamp a value between a minimum and maximum value
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

// Component - DraggableList
type DraggableListProperties = {
    items: React.ReactNode[];
    icon?: React.ReactNode;
    iconAlignment?: 'top' | 'bottom' | 'center';
    iconPosition?: 'left' | 'right';
    onReorder?: (originalOrder: React.ReactNode[], newOrder: React.ReactNode[]) => void;
    onDrag?: (activeIndex: number, currentRow: number) => void;
} & Omit<React.HTMLAttributes<HTMLUListElement>, 'children' | 'onDrag'>;
export function DraggableList({
    className,
    items,
    icon,
    iconPosition = 'left',
    iconAlignment = 'center',
    onReorder,
    onDrag,
    ...ulProperties
}: DraggableListProperties) {
    // Remember the original order of the items
    const originalItemOrder = React.useRef<number[]>(items.map((_, i) => i));

    // Store the height of each item in a map
    const heightMap = React.useMemo(
        function () {
            return new Map<React.ReactNode, number>(items.map((item) => [item, 50]));
        },
        [items],
    );

    // Create a spring for each item in the list
    const [springs, springsApi] = useSprings(items.length, function (index: number) {
        const itemHeight = heightMap.get(items[index])!;

        return {
            y: originalItemOrder.current.indexOf(index) * itemHeight,
            scale: 1,
            zIndex: 0,
            shadow: 1,
            immediate: false,
        };
    });

    // This is a custom hook that is used to bind the drag event to the items
    const bindDrag = useDrag(function (state) {
        const originalIndex = state.args[0];
        const active = state.active;
        const y = state.movement[1];
        // Calculate the new order of the items based on the current drag position
        // The current index of the item being dragged
        const curIndex = originalItemOrder.current.indexOf(originalIndex);

        // The row where the item is being dragged to
        const curRow = clamp(
            // Round the row to the nearest integer
            Math.round(
                (curIndex * 40 + // Current index * height of the item
                    y) / // plus the drag position of the item
                    40, // divided by the height of the item
            ),
            0, // Clamp the row to be at least 0
            items.length - 1, // Clamp the row to be at most the length of the items
        );

        // Call the onDrag callback when an item is dragged
        onDrag?.(originalIndex, curRow);

        // Calculate the new order of the items
        const newOrder = swap(originalItemOrder.current, curIndex, curRow);
        // [0, 1, 2] -> [1, 0, 2]

        // Update the springs based on the new order
        springsApi.start((index: number) => {
            const startingYForDraggingItem = originalItemOrder.current
                .slice(0, originalIndex)
                .reduce((sum, index) => sum + heightMap.get(items[index])!, 0);

            // Calculate the sum of the heights of the items before the current item
            const sumOfPreviousItemsHeights = newOrder
                .slice(0, newOrder.indexOf(index))
                .reduce((sum, index) => sum + heightMap.get(items[index])!, 0);

            // If the item is being dragged, apply the drag effect
            if(active && index === originalIndex) {
                return {
                    y: startingYForDraggingItem + y,
                    scale: 1.1,
                    zIndex: 1,
                    shadow: 15,
                    immediate: (key: string) => key === 'y' || key === 'zIndex',
                };
            }
            // Otherwise, apply the default effect
            else {
                return {
                    y: sumOfPreviousItemsHeights,
                    scale: 1,
                    zIndex: 0,
                    shadow: 1,
                    immediate: false,
                    onRest: () => {
                        if(!active) {
                            // Update the items based on the new order if the animation is complete
                            // console.log("Updating items");
                            onReorder?.(
                                items,
                                newOrder.map((index) => items[index]),
                            );
                        }
                    },
                };
            }
        });

        // Commit the new order if the drag is not active
        if(!active) {
            originalItemOrder.current = newOrder;
        }
    });

    // Keep the original order of the items in sync with the items prop
    React.useEffect(
        function () {
            originalItemOrder.current = items.map((_, i) => i);
            springsApi.start((index: number) => {
                const sumOfPreviousItemsHeights = originalItemOrder.current
                    .slice(0, index)
                    .reduce((sum, index) => sum + heightMap.get(items[index])!, 0);

                return {
                    y: sumOfPreviousItemsHeights,
                    scale: 1,
                    zIndex: 0,
                    shadow: 1,
                    immediate: true,
                };
            });
        },
        [items, springsApi, heightMap],
    );

    // If there is an icon, render the icon and the items
    if(icon) {
        return (
            <ul
                className={'relative ' + (className || '')}
                {...(ulProperties as React.HTMLAttributes<HTMLUListElement>)}
            >
                {springs.map((springProperties, index) => {
                    const y = springProperties.y;
                    const scale = springProperties.scale;
                    const zIndex = springProperties.zIndex;
                    return (
                        <animated.li
                            key={index}
                            ref={(el) => {
                                if(el) {
                                    heightMap.set(items[index], el.clientHeight);
                                }
                            }}
                            style={{
                                zIndex,
                                // boxShadow: shadow.to(
                                //   (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
                                // ),
                                y,
                                scale,
                            }}
                            className={`absolute flex justify-start ${
                                iconAlignment === 'top'
                                    ? 'items-start'
                                    : iconAlignment === 'bottom'
                                      ? 'items-end'
                                      : 'items-center'
                            }`}
                        >
                            {iconPosition === 'left' && (
                                <div
                                    className="touch-none select-none hover:cursor-grab active:cursor-grabbing"
                                    {...bindDrag(index)}
                                >
                                    {icon}
                                </div>
                            )}
                            {items[index]}
                            {iconPosition === 'right' && (
                                <div
                                    className="touch-none select-none hover:cursor-grab active:cursor-grabbing"
                                    {...bindDrag(index)}
                                >
                                    {icon}
                                </div>
                            )}
                        </animated.li>
                    );
                })}
            </ul>
        );
    }

    // Render the component
    return (
        <ul className={'relative ' + (className || '')} {...(ulProperties as React.HTMLAttributes<HTMLUListElement>)}>
            {springs.map(function (springProperties, index) {
                const y = springProperties.y;
                const scale = springProperties.scale;
                const zIndex = springProperties.zIndex;
                return (
                    <animated.li
                        key={index}
                        ref={(element) => {
                            if(element) {
                                heightMap.set(items[index], element.clientHeight);
                            }
                        }}
                        style={{
                            zIndex,
                            // boxShadow: shadow.to(
                            //   (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
                            // ),
                            y,
                            scale,
                        }}
                        className={'absolute touch-none select-none hover:cursor-grab active:cursor-grabbing '}
                        {...bindDrag(index)}
                    >
                        {items[index]}
                    </animated.li>
                );
            })}
        </ul>
    );
}
