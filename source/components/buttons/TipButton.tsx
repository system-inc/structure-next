'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/components/popovers/Tip';
import { PopoverProperties, Popover } from '@structure/source/components/popovers/Popover';
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';

// Depdendencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TipButton
export interface TipButtonProperties extends Omit<NonLinkButtonProperties, 'children'> {
    tipClassName?: string;
    openOnPress?: boolean;
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'content' | 'contentClassName'>;
}
export function TipButton({
    className,
    tip,
    tipClassName,
    openOnPress,
    popoverProperties,
    ...buttonProperties
}: TipButtonProperties) {
    // Defaults
    const variantValue = buttonProperties.variant ?? 'Ghost';
    const sizeValue = buttonProperties.size ?? 'IconSmall';
    const Icon = buttonProperties.icon ?? InformationCircledIcon;
    const openOnPressValue = openOnPress ?? false;

    // Shared trigger element
    const button = (
        <Button
            variant={variantValue}
            size={sizeValue}
            icon={Icon}
            // The button stays above the shadow of the popover when open
            className={mergeClassNames('p-1 data-[state=open]:z-50', className)}
            {...buttonProperties}
        />
    );

    // Render the component
    // If open on press, use a Popover
    if(openOnPressValue) {
        return (
            <Popover
                variant="Tip"
                {...popoverProperties}
                trigger={button}
                content={tip}
                contentClassName={tipClassName}
            />
        );
    }
    // Otherwise, return a Tip
    else {
        return (
            <Tip variant="Tip" {...popoverProperties} trigger={button} content={tip} contentClassName={tipClassName} />
        );
    }
}
