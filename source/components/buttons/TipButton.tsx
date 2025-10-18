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

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TipButton
export interface TipButtonProperties extends Omit<NonLinkButtonProperties, 'children'> {
    tipClassName?: string;
    openOnPress?: boolean;
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'content' | 'contentClassName'>;
}
export function TipButton({
    tip,
    tipClassName,
    openOnPress,
    popoverProperties,
    ...buttonProperties
}: TipButtonProperties) {
    // Defaults
    const variantValue = buttonProperties.variant ?? 'GhostIcon';
    const sizeValue = buttonProperties.size ?? 'GhostIcon';
    const Icon = buttonProperties.icon ?? InformationCircledIcon;
    const openOnPressValue = openOnPress ?? false;

    // Shared trigger element
    const button = <Button variant={variantValue} size={sizeValue} icon={Icon} {...buttonProperties} />;

    // Shared content className
    const tipClassNameValue = mergeClassNames('max-w-xs rounded-extra-small px-3 py-2 text-sm shadow-04', tipClassName);

    // Render the component
    // If open on press, use a Popover
    if(openOnPressValue) {
        return (
            <Popover
                variant="Primary"
                {...popoverProperties}
                trigger={button}
                content={tip}
                contentClassName={tipClassNameValue}
            />
        );
    }
    // Otherwise, return a Tip
    else {
        return (
            <Tip
                variant="Primary"
                {...popoverProperties}
                trigger={button}
                content={tip}
                contentClassName={tipClassNameValue}
            />
        );
    }
}
