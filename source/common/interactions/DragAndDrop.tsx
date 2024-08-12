/**
 * Import required libraries.
 */
import React from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { Slot, Slottable } from '@radix-ui/react-slot';

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

    return (
        <DragAndDropContext.Provider
            value={{
                dropBounds,
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
    onRemove?: () => void;
    grabHandle?: React.ReactNode;
}
/**
 * A component for a draggable item.
 *
 * @param {DraggableItemProps} props - The props for the component.
 * @returns {JSX.Element} The JSX element for the component.
 */
const DraggableItem = ({ children, onDrop: onItemDrop, onRemove: onItemRemove, grabHandle }: DraggableItemProps) => {
    const handleRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const {
        onDragItemStart,
        onDragItemEnd,
        dropBounds,
        onEnterDropArea,
        onLeaveDropArea,
        onDrop,
        resetPositionOnDrop,
    } = useDragAndDrop();
    const [spring, api] = useSpring(() => ({
        x: 0,
        y: 0,
    }));

    useDrag(
        (state) => {
            if(state.first) {
                if(dropBounds.length === 0) {
                    console.warn(
                        'The drop area bounds are not set. Please make sure to provide a list of dropContainers to the <DragAndDrop.Root> component or add some <DragAndDrop.Area>s as descendants of the <DragAndDrop.Root> component.',
                    );
                }

                onDragItemStart?.();

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
                immediate: state.down,
            });

            // If the item is inside the drop area, handle the enter drop area event
            const currentDropArea = dropBounds.find(({ bounds }) => {
                return checkIfXyInDropBounds(state.xy, bounds);
            });

            if(currentDropArea) {
                onEnterDropArea?.(currentDropArea.container);

                // If the item is dropped inside the drop area, handle the drop event
                if(state.last) {
                    onItemDrop?.(currentDropArea.container);
                    onDrop?.();
                }
            }
            else {
                onLeaveDropArea?.();
            }

            if(state.last) {
                onDragItemEnd?.();
                onLeaveDropArea?.();

                // If the item was dropped outside the drop area, reset its position
                const inDropArea = dropBounds.some(({ bounds }) => checkIfXyInDropBounds(state.xy, bounds));
                if(!inDropArea) {
                    api.start({ x: 0, y: 0 });
                }
                else if(resetPositionOnDrop) {
                    api.set({ x: 0, y: 0 });
                }
                return;
            }
        },
        {
            from: () => [spring.x.get(), spring.y.get()],
            target: grabHandle ? handleRef : containerRef,
        },
    );

    return (
        <animated.div
            ref={containerRef}
            style={spring}
            className={
                grabHandle
                    ? 'flex items-center justify-start'
                    : 'touch-none select-none hover:cursor-grab active:cursor-grabbing'
            }
        >
            {grabHandle ? (
                <div ref={handleRef} className="mr-2 touch-none select-none hover:cursor-grab active:cursor-grabbing">
                    {grabHandle}
                </div>
            ) : null}
            {children}
        </animated.div>
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
