// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Slot, Slottable } from '@radix-ui/react-slot';
import { useDrag, useMove } from '@use-gesture/react';

// Dependencies - Animation
import { useSpring, animated } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

type DropBounds = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
interface DragAndDropContextInterface {
    dropBounds: { container: DropContainer; bounds: DropBounds }[];
    dropContainers: DropContainer[];
    setDropContainers: React.Dispatch<React.SetStateAction<DropContainer[]>>;
    currentlyHoveredDropArea: DropContainer | null;
    onEnterDropArea?: (container: DropContainer) => void;
    onLeaveDropArea?: () => void;
    onDrop?: () => void;
    onDragItemStart?: () => void;
    onDragItemEnd?: () => void;
    resetPositionOnDrop?: boolean;
    recalculateDropBounds: () => void;
}

// Create a context for the drag and drop functionality.
const DragAndDropContext = React.createContext<DragAndDropContextInterface | undefined>(undefined);

// A hook to use the drag and drop context.
const useDragAndDrop = () => {
    const context = React.useContext(DragAndDropContext);
    if(!context) {
        throw new Error('useDragAndDrop must be used within a DragAndDropProvider');
    }
    return context;
};

// Function to calculate the bounds of the drop containers
function calculateBoundsFromDropContainers(dropContainers: DropContainer[]) {
    {
        return dropContainers?.map((container) => {
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

// Type for the drop container
type DropContainer = HTMLDivElement | string | React.RefObject<HTMLDivElement>;

// Type for the properties of the DragAndDropRoot component
interface DragAndDropRootProperties {
    children: React.ReactNode;
    dropContainers?: DropContainer[];
    onEnterDropArea?: (dropArea: DropContainer) => void;
    onLeaveDropArea?: () => void;
    onDrop?: () => void;
    onDragItemStart?: () => void;
    onDragItemEnd?: () => void;
    resetItemsPositionOnDrop?: boolean;
}

// Component - DragAndDropRoot
function DragAndDropRoot(properties: DragAndDropRootProperties) {
    const resetItemsPositionOnDrop = properties.resetItemsPositionOnDrop ?? false;

    // State
    const [dropContainers, setDropContainers] = React.useState<DropContainer[]>(properties.dropContainers ?? []);
    const [dropBounds, setDropBounds] = React.useState<DragAndDropContextInterface['dropBounds']>(() =>
        calculateBoundsFromDropContainers(dropContainers),
    );
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

            return () => {
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
const DraggableItem = (properties: DraggableItemProperties) => {
    const handleReference = React.useRef<HTMLDivElement>(null);
    const containerReference = React.useRef<HTMLDivElement>(null);
    const ghostSpacerReference = React.useRef<HTMLDivElement>(null);
    const isDraggingReference = React.useRef(false); // Used to prevent children from being clicked when the item is being dragged

    const {
        onDragItemStart,
        onDragItemEnd,
        dropBounds,
        onEnterDropArea: onItemEnterDropArea,
        onLeaveDropArea: onItemLeaveDropArea,
        onDrop,
        resetPositionOnDrop,
        recalculateDropBounds: recalcDropBounds,
    } = useDragAndDrop();

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

                recalcDropBounds();

                if(dropBounds.length === 0) {
                    console.warn(
                        'The drop area bounds are not set. Please make sure to provide a list of dropContainers to the <DragAndDrop.Root> component or add some <DragAndDrop.Area>s as descendants of the <DragAndDrop.Root> component.',
                    );
                }

                onDragItemStart?.();
                properties.onDragStart?.();

                // Check if the item is inside a drop area
                const inDropArea = dropBounds.some((dropBound) => checkIfXyInDropBounds(state.xy, dropBound.bounds));

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
            const currentDropArea = dropBounds.find((dropBound) => {
                return checkIfXyInDropBounds(state.xy, dropBound.bounds);
            });

            if(currentDropArea) {
                onItemEnterDropArea?.(currentDropArea.container);
                properties.onEnterDropArea?.(currentDropArea.container);

                // If the item is dropped inside the drop area, handle the drop event
                if(state.last) {
                    properties.onDrop?.(currentDropArea.container);
                    onDrop?.();
                }
            }
            else {
                onItemLeaveDropArea?.();
                properties.onLeaveDropArea?.();
            }

            if(state.last) {
                onDragItemEnd?.();
                properties.onDragEnd?.();
                onItemLeaveDropArea?.();
                properties.onLeaveDropArea?.();

                // If the item was dropped outside the drop area, reset its position
                const inDropArea = dropBounds.some((dropBound) => checkIfXyInDropBounds(state.xy, dropBound.bounds));
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
                else if(resetPositionOnDrop) {
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
};

// Component - DropArea
interface DropAreaProperties extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onItemIsHovering?: () => void;
    asChild?: boolean;
}
const DropArea = (properties: DropAreaProperties) => {
    const asChild = properties.asChild;
    const children = properties.children;
    const onItemIsHovering = properties.onItemIsHovering;
    const props = { ...properties };
    delete props.asChild;
    delete props.children;
    delete props.onItemIsHovering;
    const Component = asChild ? Slot : 'div';

    const dropContainerRef = React.useRef<HTMLDivElement>(null);
    const { setDropContainers, currentlyHoveredDropArea } = useDragAndDrop();
    const [isHovering, setIsHovering] = React.useState(false);

    React.useEffect(() => {
        setDropContainers((prev) => [...prev, dropContainerRef]);

        return () => {
            setDropContainers((prev) => prev.filter((container) => container !== dropContainerRef));
        };
    }, [setDropContainers]);

    React.useEffect(() => {
        if(currentlyHoveredDropArea === dropContainerRef) {
            onItemIsHovering?.();

            if(dropContainerRef.current) setIsHovering(true);
        }
        else {
            if(dropContainerRef.current) setIsHovering(false);
        }
    }, [currentlyHoveredDropArea, onItemIsHovering]);

    return (
        <Component
            ref={dropContainerRef}
            className={asChild ? '' : 'h-auto w-auto'}
            {...props}
            data-item-hovering={isHovering}
        >
            <Slottable>{children}</Slottable>
        </Component>
    );
};

export { DragAndDropRoot as Root, DraggableItem as Item, DropArea as Area };
