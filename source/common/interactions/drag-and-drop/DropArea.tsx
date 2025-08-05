// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useDragAndDrop } from './useDragAndDrop';

// Dependencies - Main Components
import { Slot, Slottable } from '@radix-ui/react-slot';

// Component - DropArea
interface DropAreaProperties extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onItemIsHovering?: () => void;
    asChild?: boolean;
}
export function DropArea({ asChild, children, onItemIsHovering, ...componentProperties }: DropAreaProperties) {
    // Hooks
    const dragAndDrop = useDragAndDrop();

    // State
    const [isHovering, setIsHovering] = React.useState(false);

    // References
    const dropContainerReference = React.useRef<HTMLDivElement>(null);

    const Component = asChild ? Slot : 'div';

    // Effect to register the drop container
    const setDropContainers = dragAndDrop.setDropContainers;
    React.useEffect(
        function () {
            setDropContainers((previousDropContainers) => [...previousDropContainers, dropContainerReference]);

            return function () {
                setDropContainers((prev) => prev.filter((container) => container !== dropContainerReference));
            };
        },
        [setDropContainers],
    );

    // Effect to handle hover state
    const currentlyHoveredDropArea = dragAndDrop.currentlyHoveredDropArea;
    React.useEffect(
        function () {
            if(currentlyHoveredDropArea === dropContainerReference) {
                if(dropContainerReference.current && !isHovering) {
                    setIsHovering(true);
                    onItemIsHovering?.();
                }
            }
            else {
                if(dropContainerReference.current && isHovering) {
                    setIsHovering(false);
                }
            }
        },
        [currentlyHoveredDropArea, onItemIsHovering, isHovering],
    );

    // Render the component
    return (
        <Component
            ref={dropContainerReference}
            className={asChild ? '' : 'h-auto w-auto'}
            {...componentProperties}
            data-item-hovering={isHovering}
        >
            <Slottable>{children}</Slottable>
        </Component>
    );
}
