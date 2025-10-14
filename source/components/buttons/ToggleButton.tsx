'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { Button, ButtonProperties } from '@structure/source/components/buttons/Button';

// Component - ToggleButton
export interface ToggleButtonProperties extends ButtonProperties {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export function ToggleButton({ pressed, onPressedChange, ...buttonProperties }: ToggleButtonProperties) {
    // State
    const [pressedState, setPressedState] = React.useState<boolean>(pressed ? true : false);

    // Render the component
    return (
        <Button
            {...buttonProperties}
            variant={pressedState ? 'toggleOn' : 'toggleOff'}
            onClick={function (event) {
                setPressedState(!pressedState);
                if(onPressedChange) {
                    onPressedChange(!pressedState, event);
                }
            }}
        />
    );
}
