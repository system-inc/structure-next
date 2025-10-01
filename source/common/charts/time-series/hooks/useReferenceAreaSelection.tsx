'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Hook - useReferenceAreaSelection
export interface UseReferenceAreaSelectionResult {
    referenceAreaStart: string | null;
    referenceAreaEnd: string | null;
    isSelecting: boolean;
    handleMouseDown: (event: { activeLabel?: string }) => void;
    handleMouseMove: (event: { activeLabel?: string }) => void;
    handleMouseUp: () => void;
}
export function useReferenceAreaSelection(
    onReferenceAreaSelect?: (startLabel: string, endLabel: string) => void,
): UseReferenceAreaSelectionResult {
    // State
    const [referenceAreaStart, setReferenceAreaStart] = React.useState<string | null>(null);
    const [referenceAreaEnd, setReferenceAreaEnd] = React.useState<string | null>(null);
    const [isSelecting, setIsSelecting] = React.useState(false);

    // Handle mouse down for reference area selection
    const handleMouseDown = React.useCallback(
        function (event: { activeLabel?: string }) {
            if(event && event.activeLabel && onReferenceAreaSelect) {
                setReferenceAreaStart(event.activeLabel);
                setIsSelecting(true);
            }
        },
        [onReferenceAreaSelect],
    );

    // Handle mouse move for reference area selection
    const handleMouseMove = React.useCallback(
        function (event: { activeLabel?: string }) {
            if(isSelecting && event && event.activeLabel) {
                setReferenceAreaEnd(event.activeLabel);
            }
        },
        [isSelecting],
    );

    // Handle mouse up for reference area selection
    const handleMouseUp = React.useCallback(
        function () {
            if(isSelecting && referenceAreaStart && referenceAreaEnd && onReferenceAreaSelect) {
                onReferenceAreaSelect(referenceAreaStart, referenceAreaEnd);
            }
            else if(isSelecting && referenceAreaStart && !referenceAreaEnd && onReferenceAreaSelect) {
                onReferenceAreaSelect(referenceAreaStart, referenceAreaStart);
            }
            setReferenceAreaStart(null);
            setReferenceAreaEnd(null);
            setIsSelecting(false);
        },
        [isSelecting, referenceAreaStart, referenceAreaEnd, onReferenceAreaSelect],
    );

    return {
        referenceAreaStart,
        referenceAreaEnd,
        isSelecting,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
}
