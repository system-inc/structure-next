// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DropContainer, DropBounds } from './DragAndDropTypes';

// Dependencies - Hooks
import { useDragAndDrop } from './useDragAndDrop';

// Dependencies - Main Components
import { useDrag, useMove } from '@use-gesture/react';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Function to check if the coordinates are within the bounds of a drop area
function checkIfXyInDropBounds(xy: [number, number], bounds: DropBounds) {
    return xy[0] >= bounds.left && xy[0] <= bounds.right && xy[1] >= bounds.top && xy[1] <= bounds.bottom;
}

// Component - DraggableItem
interface DraggableItemProperties {
    children: React.ReactNode;
    onDrop?: (container: DropContainer) => void;
    onEnterDropArea?: (container: DropContainer) => void;
    onLeaveDropArea?: () => void;
    onRemove?: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    grabHandle?: React.ReactNode;
    leaveGhost?: boolean;
    // asChild?: boolean;
}
export function DraggableItem(properties: DraggableItemProperties) {
    const handleReference = React.useRef<HTMLDivElement>(null);
    const containerReference = React.useRef<HTMLDivElement>(null);
    const ghostSpacerReference = React.useRef<HTMLDivElement>(null);
    const isDraggingReference = React.useRef(false); // Used to prevent children from being clicked when the item is being dragged

    const dragAndDrop = useDragAndDrop();

    const [spring, api] = useSpring(() => ({
        x: 0,
        y: 0,
        opacity: 1,
    }));

    const hoverCoords = React.useRef<[number, number]>([0, 0]);
    useMove(
        function (state) {
            // Calculate the position of the cursor so it can be used to position the dragged item.
            if(!state.down) {
                // Get the current bounds of the container so that it can be positioned fixed without resizing the container
                const currentBounds = containerReference.current?.getBoundingClientRect();

                // Update the hover coords
                hoverCoords.current = [state.xy[0] - (currentBounds?.x ?? 0), state.xy[1] - (currentBounds?.y ?? 0)];
            }
        },
        {
            target: containerReference,
        },
    );

    useDrag(
        function (state) {
            if(!state.intentional) {
                return;
            }

            if(state.first) {
                // Set the dragging flag to true
                isDraggingReference.current = true;
                if(containerReference.current && ghostSpacerReference.current) {
                    containerReference.current.style.zIndex = '1000';
                    // Get the current bounds of the container so that it can be positioned fixed without resizing the container
                    const currentBounds = containerReference.current.getBoundingClientRect();

                    // Set the position of the container to fixed
                    containerReference.current.style.position = 'fixed';

                    // Set the height and width of the container to the current width (needed for updating to fixed position)
                    containerReference.current.style.width = `${currentBounds.width}px`;
                    containerReference.current.style.height = `${currentBounds.height}px`;

                    // Set the ghost spacer to the same height and width as the container (needed for the container to not resize when the position is set to fixed)
                    ghostSpacerReference.current.style.width = `${currentBounds.width}px`;
                    ghostSpacerReference.current.style.height = `${currentBounds.height}px`;
                }

                dragAndDrop.recalculateDropBounds();

                if(dragAndDrop.dropBounds.length === 0) {
                    console.warn(
                        'The drop area bounds are not set. Please make sure to provide a list of dropContainers to the <DragAndDrop.Root> component or add some <DragAndDrop.Area>s as descendants of the <DragAndDrop.Root> component.',
                    );
                }

                dragAndDrop.onDragItemStart?.();
                properties.onDragStart?.();

                // Check if the item is inside a drop area
                const inDropArea = dragAndDrop.dropBounds.some((dropBound) =>
                    checkIfXyInDropBounds(state.xy, dropBound.bounds),
                );

                if(inDropArea) {
                    properties.onRemove?.();
                }
            }

            // Move the item
            api.start({
                x: state.offset[0] + hoverCoords.current[0],
                y: state.offset[1] + hoverCoords.current[1],
                opacity: state.dragging && properties.leaveGhost ? 0.8 : 1,
                immediate: state.down,
            });

            // If the item is inside the drop area, handle the enter drop area event
            const currentDropArea = dragAndDrop.dropBounds.find((dropBound) => {
                return checkIfXyInDropBounds(state.xy, dropBound.bounds);
            });

            if(currentDropArea) {
                dragAndDrop.onEnterDropArea?.(currentDropArea.container);
                properties.onEnterDropArea?.(currentDropArea.container);

                // If the item is dropped inside the drop area, handle the drop event
                if(state.last) {
                    properties.onDrop?.(currentDropArea.container);
                    dragAndDrop.onDrop?.();
                }
            }
            else {
                dragAndDrop.onLeaveDropArea?.();
                properties.onLeaveDropArea?.();
            }

            if(state.last) {
                dragAndDrop.onDragItemEnd?.();
                properties.onDragEnd?.();
                dragAndDrop.onLeaveDropArea?.();
                properties.onLeaveDropArea?.();

                // If the item was dropped outside the drop area, reset its position
                const inDropArea = dragAndDrop.dropBounds.some((dropBound) =>
                    checkIfXyInDropBounds(state.xy, dropBound.bounds),
                );
                if(!inDropArea) {
                    api.start({
                        x: 0,
                        y: 0,
                        onRest: () => {
                            if(containerReference.current) {
                                containerReference.current.style.zIndex = '';
                                containerReference.current.style.position = '';
                                containerReference.current.style.width = '100%';
                                containerReference.current.style.height = '100%';
                            }
                            if(ghostSpacerReference.current) {
                                ghostSpacerReference.current.style.width = '100%';
                                ghostSpacerReference.current.style.height = '100%';
                            }
                        },
                    });
                }
                else if(dragAndDrop.resetPositionOnDrop) {
                    api.set({ x: 0, y: 0 });
                    if(containerReference.current) {
                        containerReference.current.style.zIndex = '';
                        containerReference.current.style.position = '';
                        containerReference.current.style.width = '100%';
                        containerReference.current.style.height = '100%';
                    }
                    if(ghostSpacerReference.current) {
                        ghostSpacerReference.current.style.width = '100%';
                        ghostSpacerReference.current.style.height = '100%';
                    }
                }

                return;
            }
        },
        {
            from: () => [spring.x.get(), spring.y.get()],
            target: properties.grabHandle ? handleReference : containerReference,

            // Prevents clicks from being treated as drags
            filterTaps: true,
        },
    );

    // Function to prevent children from being clicked when the item is being dragged
    const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if(isDraggingReference.current) {
            event.preventDefault();
            event.stopPropagation();

            // Reset the dragging flag
            isDraggingReference.current = false;
        }
    };

    // Render the component
    return (
        <div ref={ghostSpacerReference} className="relative">
            {/* Spacer */}
            {properties.leaveGhost && (
                <div
                    className={mergeClassNames(
                        properties.grabHandle
                            ? 'flex items-center justify-start'
                            : 'touch-none select-none hover:cursor-grab active:cursor-grabbing [&_*]:active:cursor-grabbing',
                        'pointer-events-none absolute -z-10 w-full opacity-50',
                    )}
                >
                    {properties.grabHandle ? (
                        <div className="mr-2 touch-none select-none hover:cursor-grab active:cursor-grabbing [&_*]:active:cursor-grabbing">
                            {properties.grabHandle}
                        </div>
                    ) : null}
                    {properties.children}
                </div>
            )}
            <animated.div
                ref={containerReference}
                style={spring}
                className={mergeClassNames(
                    properties.grabHandle
                        ? 'flex items-center justify-start'
                        : 'touch-none select-none hover:cursor-grab active:cursor-grabbing [&_*]:active:cursor-grabbing',
                    properties.leaveGhost ? 'opacity-100' : '',
                )}
                // Must be applied to the element directly rather than through `useGesture` or in the `useDrag` hook
                onClickCapture={handleClickCapture}
            >
                {properties.grabHandle ? (
                    <div
                        ref={handleReference}
                        className="mr-2 touch-none select-none hover:cursor-grab active:cursor-grabbing [&_*]:active:cursor-grabbing"
                    >
                        {properties.grabHandle}
                    </div>
                ) : null}
                {/* <Slottable> */}
                {properties.children}
                {/* </Slottable> */}
            </animated.div>
        </div>
    );
}
