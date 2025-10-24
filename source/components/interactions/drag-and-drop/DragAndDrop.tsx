// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DropContainer, DropBounds } from './DragAndDropTypes';

// Dependencies - Hooks
import { DragAndDropContext, DragAndDropContextInterface } from './useDragAndDrop';

// Function to calculate the bounds of the drop containers
export function calculateBoundsFromDropContainers(dropContainers: DropContainer[]) {
    {
        return dropContainers?.map(function (container) {
            let bounds: DropBounds = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            };

            if(typeof container === 'string') {
                const dropContainer = document.getElementById(container);
                if(dropContainer) {
                    const rect = dropContainer.getBoundingClientRect();
                    bounds = {
                        left: rect.left,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                    };
                }
            }
            else if(container instanceof HTMLDivElement) {
                const rect = container.getBoundingClientRect();
                bounds = {
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                };
            }
            else if(container instanceof Object) {
                const rect = container.current?.getBoundingClientRect();
                if(rect) {
                    bounds = {
                        left: rect.left,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                    };
                }
            }

            return { container, bounds };
        });
    }
}

// Component - DragAndDropRoot
export interface DragAndDropProperties {
    children: React.ReactNode;
    dropContainers?: DropContainer[];
    onEnterDropArea?: (dropArea: DropContainer) => void;
    onLeaveDropArea?: () => void;
    onDrop?: () => void;
    onDragItemStart?: () => void;
    onDragItemEnd?: () => void;
    resetItemsPositionOnDrop?: boolean;
}
export function DragAndDrop(properties: DragAndDropProperties) {
    const resetItemsPositionOnDrop = properties.resetItemsPositionOnDrop ?? false;

    // State
    const [dropContainers, setDropContainers] = React.useState<DropContainer[]>(properties.dropContainers ?? []);
    const [dropBounds, setDropBounds] = React.useState<DragAndDropContextInterface['dropBounds']>(function () {
        return calculateBoundsFromDropContainers(dropContainers);
    });
    const [currentlyHoveredDropArea, setCurrentlyHoveredDropArea] = React.useState<DropContainer | null>(null);

    // Effect to update the drop bounds when the drop containers change
    React.useEffect(
        function () {
            // Update drop bounds when drop containers change
            setDropBounds(calculateBoundsFromDropContainers(dropContainers));

            // Add event listeners for window resize
            window.addEventListener('resize', function () {
                setDropBounds(calculateBoundsFromDropContainers(dropContainers));
            });

            return function () {
                window.removeEventListener('resize', function () {
                    setDropBounds(calculateBoundsFromDropContainers(dropContainers));
                });
            };
        },
        [dropContainers],
    );

    // Function to handle the enter drop area event
    function onEnterDropAreaCallback(container: DropContainer) {
        properties.onEnterDropArea?.(container);

        setCurrentlyHoveredDropArea(container);
    }

    // Function to handle the leave drop area event
    function onLeaveDropAreaCallback() {
        properties.onLeaveDropArea?.();

        setCurrentlyHoveredDropArea(null);
    }

    // Function to recalculate the drop bounds
    function recalculateDropBounds() {
        setDropBounds(calculateBoundsFromDropContainers(dropContainers));
    }

    // Render the component
    return (
        <DragAndDropContext.Provider
            value={{
                dropBounds,
                recalculateDropBounds,
                dropContainers,
                setDropContainers,
                onEnterDropArea: onEnterDropAreaCallback,
                onLeaveDropArea: onLeaveDropAreaCallback,
                currentlyHoveredDropArea,
                onDrop: properties.onDrop,
                onDragItemStart: properties.onDragItemStart,
                onDragItemEnd: properties.onDragItemEnd,
                resetPositionOnDrop: resetItemsPositionOnDrop,
            }}
        >
            {properties.children}
        </DragAndDropContext.Provider>
    );
}
