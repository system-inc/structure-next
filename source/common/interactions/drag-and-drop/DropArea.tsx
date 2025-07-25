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

    React.useEffect(
        function () {
            dragAndDrop.setDropContainers((previousDropContainers) => [
                ...previousDropContainers,
                dropContainerReference,
            ]);

            return () => {
                dragAndDrop.setDropContainers((prev) =>
                    prev.filter((container) => container !== dropContainerReference),
                );
            };
        },
        [dragAndDrop],
    );

    React.useEffect(
        function () {
            if(dragAndDrop.currentlyHoveredDropArea === dropContainerReference) {
                onItemIsHovering?.();

                if(dropContainerReference.current) setIsHovering(true);
            }
            else {
                if(dropContainerReference.current) setIsHovering(false);
            }
        },
        [dragAndDrop.currentlyHoveredDropArea, onItemIsHovering],
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
