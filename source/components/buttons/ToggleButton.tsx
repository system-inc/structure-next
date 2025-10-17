'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';

// Component - ToggleButton
export type ToggleButtonProperties = Omit<NonLinkButtonProperties, 'variant'> & {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
export function ToggleButton({ pressed, onPressedChange, onClick, ...buttonProperties }: ToggleButtonProperties) {
    // State
    const [pressedState, setPressedState] = React.useState<boolean>(pressed ? true : false);

    // Function to handle click events
    function onClickIntercept(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        // Flip the pressed state
        const nextState = !pressedState;
        setPressedState(nextState);

        // Invoke callback if provided
        onPressedChange?.(nextState, event);

        // Call the original onClick handler if provided
        onClick?.(event);
    }

    // Render the component
    return (
        <Button variant={pressedState ? 'ToggleOn' : 'ToggleOff'} {...buttonProperties} onClick={onClickIntercept} />
    );
}
