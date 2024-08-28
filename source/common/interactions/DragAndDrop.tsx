/**
 * Import required libraries.
 */
import React, { MouseEventHandler } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { Slot, Slottable } from '@radix-ui/react-slot';
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
    recalcDropBounds: () => void;
}

/**
 * Create a context for the drag and drop functionality.
 */
const DragAndDropContext = React.createContext<DragAndDropContextInterface | undefined>(undefined);

/**
 * A hook to use the drag and drop context.
 *
 * @returns {DragAndDropContextInterface} The drag and drop context.
 */
const useDragAndDrop = () => {
    const context = React.useContext(DragAndDropContext);
    if(!context) {
        throw new Error('useDragAndDrop must be used within a DragAndDropProvider');
    }
    return context;
};

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

type DropContainer = HTMLDivElement | string | React.RefObject<HTMLDivElement>;
interface DragAndDropRootProps {
    children: React.ReactNode;
    dropContainers?: DropContainer[];
    onEnterDropArea?: (dropArea: DropContainer) => void;
    onLeaveDropArea?: () => void;
    onDrop?: () => void;
    onDragItemStart?: () => void;
    onDragItemEnd?: () => void;
    resetItemsPositionOnDrop?: boolean;
}

/**
 * The root component for the drag and drop functionality.
 *
 * @param {DragAndDropRootProps} props - The props for the component.
 * @returns {JSX.Element} The JSX element for the component.
 */
const DragAndDropRoot = ({
    children,
    onEnterDropArea,
    onLeaveDropArea,
    onDrop,
    onDragItemStart,
    onDragItemEnd,
    dropContainers: initialDropContainers,
    resetItemsPositionOnDrop = false,
}: DragAndDropRootProps) => {
    const [dropContainers, setDropContainers] = React.useState<DropContainer[]>(initialDropContainers ?? []);
    const [dropBounds, setDropBounds] = React.useState<DragAndDropContextInterface['dropBounds']>(() =>
        calculateBoundsFromDropContainers(dropContainers),
    );
    const [currentlyHoveredDropArea, setCurrentlyHoveredDropArea] = React.useState<DropContainer | null>(null);

    React.useEffect(() => {
        // Update drop bounds when drop containers change
        setDropBounds(calculateBoundsFromDropContainers(dropContainers));

        // Add event listeners for window resize
        window.addEventListener('resize', () => {
            setDropBounds(calculateBoundsFromDropContainers(dropContainers));
        });

        return () => {
            window.removeEventListener('resize', () => {
                setDropBounds(calculateBoundsFromDropContainers(dropContainers));
            });
        };
    }, [dropContainers]);

    function onEnterDropAreaCallback(container: DropContainer) {
        onEnterDropArea?.(container);

        setCurrentlyHoveredDropArea(container);
    }

    function onLeaveDropAreaCallback() {
        onLeaveDropArea?.();

        setCurrentlyHoveredDropArea(null);
    }

    function recalcDropBounds() {
        setDropBounds(calculateBoundsFromDropContainers(dropContainers));
    }

    return (
        <DragAndDropContext.Provider
            value={{
                dropBounds,
                recalcDropBounds,
                dropContainers,
                setDropContainers,
                onEnterDropArea: onEnterDropAreaCallback,
                onLeaveDropArea: onLeaveDropAreaCallback,
                currentlyHoveredDropArea,
                onDrop,
                onDragItemStart,
                onDragItemEnd,
                resetPositionOnDrop: resetItemsPositionOnDrop,
            }}
        >
            {children}
        </DragAndDropContext.Provider>
    );
};

function checkIfXyInDropBounds(xy: [number, number], bounds: DropBounds) {
    return xy[0] >= bounds.left && xy[0] <= bounds.right && xy[1] >= bounds.top && xy[1] <= bounds.bottom;
}

interface DraggableItemProps {
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
/**
 * A component for a draggable item.
 *
 * @param {DraggableItemProps} props - The props for the component.
 * @returns {JSX.Element} The JSX element for the component.
 */
const DraggableItem = ({
    children,
    onDrop: onItemDrop,
    onRemove: onItemRemove,
    onDragStart,
    onDragEnd,
    onEnterDropArea,
    onLeaveDropArea,
    grabHandle,
    leaveGhost,
    // asChild,
}: DraggableItemProps) => {
    // const Component = asChild ? Slot : 'div';
    // const AnimatedComponent = animated(Component);

    const handleRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const ghostSpacerRef = React.useRef<HTMLDivElement>(null);

    const isDragging = React.useRef(false); // Used to prevent children from being clicked when the item is being dragged

    const {
        onDragItemStart,
        onDragItemEnd,
        dropBounds,
        onEnterDropArea: onItemEnterDropArea,
        onLeaveDropArea: onItemLeaveDropArea,
        onDrop,
        resetPositionOnDrop,
        recalcDropBounds,
    } = useDragAndDrop();
    const [spring, api] = useSpring(() => ({
        x: 0,
        y: 0,
        opacity: 1,
    }));

    useDrag(
        (state) => {
            if(state.first) {
                // Set the dragging flag to true
                isDragging.current = true;
                if(containerRef.current && ghostSpacerRef.current) {
                    containerRef.current.style.zIndex = '1000';
                    // Get the current bounds of the container so that it can be positioned fixed without resizing the container
                    const currentBounds = containerRef.current.getBoundingClientRect();

                    // Set the position of the container to fixed
                    containerRef.current.style.position = 'fixed';

                    // Set the height and width of the container to the current width (needed for updating to fixed position)
                    containerRef.current.style.width = `${currentBounds.width}px`;
                    containerRef.current.style.height = `${currentBounds.height}px`;

                    // Set the ghost spacer to the same height and width as the container (needed for the container to not resize when the position is set to fixed)
                    ghostSpacerRef.current.style.width = `${currentBounds.width}px`;
                    ghostSpacerRef.current.style.height = `${currentBounds.height}px`;
                }

                recalcDropBounds();

                if(dropBounds.length === 0) {
                    console.warn(
                        'The drop area bounds are not set. Please make sure to provide a list of dropContainers to the <DragAndDrop.Root> component or add some <DragAndDrop.Area>s as descendants of the <DragAndDrop.Root> component.',
                    );
                }

                onDragItemStart?.();
                onDragStart?.();

                // Check if the item is inside a drop area
                const inDropArea = dropBounds.some(({ bounds }) => checkIfXyInDropBounds(state.xy, bounds));

                if(inDropArea) {
                    onItemRemove?.();
                }
            }

            // Move the item
            api.start({
                x: state.offset[0],
                y: state.offset[1],
                opacity: state.dragging && leaveGhost ? 0.8 : 1,
                immediate: state.down,
            });

            // If the item is inside the drop area, handle the enter drop area event
            const currentDropArea = dropBounds.find(({ bounds }) => {
                return checkIfXyInDropBounds(state.xy, bounds);
            });

            if(currentDropArea) {
                onItemEnterDropArea?.(currentDropArea.container);
                onEnterDropArea?.(currentDropArea.container);

                // If the item is dropped inside the drop area, handle the drop event
                if(state.last) {
                    onItemDrop?.(currentDropArea.container);
                    onDrop?.();
                }
            }
            else {
                onItemLeaveDropArea?.();
                onLeaveDropArea?.();
            }

            if(state.last) {
                onDragItemEnd?.();
                onDragEnd?.();
                onItemLeaveDropArea?.();
                onLeaveDropArea?.();

                // If the item was dropped outside the drop area, reset its position
                const inDropArea = dropBounds.some(({ bounds }) => checkIfXyInDropBounds(state.xy, bounds));
                if(!inDropArea) {
                    api.start({
                        x: 0,
                        y: 0,
                        onRest: () => {
                            if(containerRef.current) {
                                containerRef.current.style.zIndex = '';
                                containerRef.current.style.position = '';
                                containerRef.current.style.width = '100%';
                                containerRef.current.style.height = '100%';
                            }
                            if(ghostSpacerRef.current) {
                                ghostSpacerRef.current.style.width = '100%';
                                ghostSpacerRef.current.style.height = '100%';
                            }
                        },
                    });
                }
                else if(resetPositionOnDrop) {
                    api.set({ x: 0, y: 0 });
                    if(containerRef.current) {
                        containerRef.current.style.zIndex = '';
                        containerRef.current.style.position = '';
                        containerRef.current.style.width = '100%';
                        containerRef.current.style.height = '100%';
                    }
                    if(ghostSpacerRef.current) {
                        ghostSpacerRef.current.style.width = '100%';
                        ghostSpacerRef.current.style.height = '100%';
                    }
                }

                return;
            }
        },
        {
            from: () => [spring.x.get(), spring.y.get()],
            target: grabHandle ? handleRef : containerRef,

            // Prevents clicks from being treated as drags
            filterTaps: true,
        },
    );

    // Function to prevent children from being clicked when the item is being dragged
    const handleClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
        if(isDragging.current) {
            event.preventDefault();
            event.stopPropagation();

            // Reset the dragging flag
            isDragging.current = false;
        }
    };

    return (
        <div ref={ghostSpacerRef} className="relative">
            {/* Spacer */}
            {leaveGhost && (
                <div
                    className={mergeClassNames(
                        grabHandle
                            ? 'flex items-center justify-start'
                            : 'touch-none select-none hover:cursor-grab active:cursor-grabbing',
                        'pointer-events-none absolute -z-10 w-full opacity-50',
                    )}
                >
                    {grabHandle ? (
                        <div className="mr-2 touch-none select-none hover:cursor-grab active:cursor-grabbing">
                            {grabHandle}
                        </div>
                    ) : null}
                    {children}
                </div>
            )}
            <animated.div
                ref={containerRef}
                style={spring}
                className={mergeClassNames(
                    grabHandle
                        ? 'flex items-center justify-start'
                        : 'touch-none select-none hover:cursor-grab active:cursor-grabbing',
                    leaveGhost ? 'opacity-100' : '',
                )}
                // Must be applied to the element directly rather than through `useGesture` or in the `useDrag` hook
                onClickCapture={handleClickCapture}
            >
                {grabHandle ? (
                    <div
                        ref={handleRef}
                        className="mr-2 touch-none select-none hover:cursor-grab active:cursor-grabbing"
                    >
                        {grabHandle}
                    </div>
                ) : null}
                {/* <Slottable> */}
                {children}
                {/* </Slottable> */}
            </animated.div>
        </div>
    );
};

interface DropAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onItemIsHovering?: () => void;
    asChild?: boolean;
}

/**
 * A component for the drop area.
 *
 * @param {DropAreaProps} props - The props for the component.
 * @returns {JSX.Element} The JSX element for the component.
 */
const DropArea = ({ asChild, children, onItemIsHovering, ...props }: DropAreaProps) => {
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
