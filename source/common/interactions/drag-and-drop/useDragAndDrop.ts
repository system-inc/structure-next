// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DropContainer, DropBounds } from './DragAndDropTypes';

export interface DragAndDropContextInterface {
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
export const DragAndDropContext = React.createContext<DragAndDropContextInterface | undefined>(undefined);

// A hook to use the drag and drop context.
export const useDragAndDrop = function () {
    const context = React.useContext(DragAndDropContext);
    if(!context) {
        throw new Error('useDragAndDrop must be used within a DragAndDropProvider');
    }
    return context;
};
