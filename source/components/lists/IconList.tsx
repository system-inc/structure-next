'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Assets
import { CheckCircleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - IconList
export interface IconListItem {
    content: React.ReactNode;
    icon?: React.ReactElement;
}

// Component - IconList
export interface IconListProperties {
    className?: string;
    iconClassName?: string;
    items: IconListItem[];
    icon?: React.ReactElement;
    size?: 'Small' | 'Base';
}
export function IconList(properties: IconListProperties) {
    const defaultIcon = properties.icon || <CheckCircleIcon weight="fill" />;
    const size = properties.size || 'Base';

    const sizeConfiguration = {
        Small: { iconSize: 16, gap: 'gap-2.5', spacing: 'space-y-2', textClass: 'text-sm' },
        Base: { iconSize: 18, gap: 'gap-3', spacing: 'space-y-3', textClass: '' },
    };

    const configuration = sizeConfiguration[size];

    // Render the component
    return (
        <ul className={mergeClassNames(configuration.spacing, properties.className)}>
            {properties.items.map(function (item, index) {
                const iconElement = item.icon || defaultIcon;
                const clonedIcon = React.cloneElement(iconElement, {
                    size: configuration.iconSize,
                    className: mergeClassNames('mt-0.5 shrink-0 content--positive', properties.iconClassName),
                });
                return (
                    <li key={index} className={mergeClassNames('flex items-start', configuration.gap)}>
                        {clonedIcon}
                        <span className={configuration.textClass}>{item.content}</span>
                    </li>
                );
            })}
        </ul>
    );
}
