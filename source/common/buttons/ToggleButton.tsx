'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { Button, ButtonInterface } from '@structure/source/common/buttons/Button';

// Component - ToggleButton
export interface ToggleButtonProperties extends ButtonInterface {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
export function ToggleButton(properties: ToggleButtonProperties) {
    // State
    const [pressed, setPressed] = React.useState<boolean>(properties.pressed ? true : false);

    // Isolate the Button properties from the ToggleButton properties to spread onto the Button component
    const { pressed: pressedProperty, onPressedChange: onPressedChangeProperty, ...buttonProperties } = properties;

    // Render the component
    return (
        <Button
            {...buttonProperties}
            variant={pressed ? 'toggleOn' : 'toggleOff'}
            onClick={function (event) {
                setPressed(!pressed);
                if(properties.onPressedChange) {
                    properties.onPressedChange(!pressed, event);
                }
            }}
        />
    );
}

// Export - Default
export default ToggleButton;
