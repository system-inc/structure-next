'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React, { useState, useRef, useEffect } from 'react';

// Dependencies - Main Components
import * as RadixAccordion from '@radix-ui/react-accordion';

// Dependencies - Assets
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Accordion
export interface AccordionInterface {
    className?: string;
    titleContainerClassName?: string;
    titleClassName?: string;
    contentClassName?: string;

    type?: 'multiple' | 'single';

    items: {
        title: React.ReactNode;
        identifier: string; // A unique identifier for the item
        content: React.ReactNode;
        expanded?: boolean;
    }[];
}
export function Accordion(properties: AccordionInterface) {
    // State
    const [items, setItems] = useState(
        properties.items.map((item) => ({
            title: item.title,
            identifier: item.identifier,
            content: item.content,
            expanded: item.expanded || false,
            height: 0,
        })),
    );

    // Defaults
    const type = properties.type || 'multiple';

    // Render the component
    return (
        <RadixAccordion.Root type={type}>
            {items.map((item, index) => {
                return (
                    <RadixAccordion.Item
                        key={index}
                        value={item.identifier}
                        className="border-b border-light-3 dark:border-dark-3"
                    >
                        {/* Trigger */}
                        <RadixAccordion.Trigger
                            className={mergeClassNames(
                                'flex w-full cursor-pointer items-center justify-between py-4 transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
                                properties.titleContainerClassName,
                            )}
                        >
                            {/* Title */}
                            <div className={mergeClassNames('pr-2 font-medium', properties.titleClassName)}>
                                {item.title}
                            </div>
                            {/* Chevron */}
                            <ChevronDownIcon
                                className={mergeClassNames('h-4 w-4 shrink-0 transition-transform duration-200')}
                            />
                        </RadixAccordion.Trigger>

                        {/* Content */}
                        <RadixAccordion.Content
                            className={mergeClassNames(
                                'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
                                properties.contentClassName,
                            )}
                        >
                            <div className="pb-6">{item.content}</div>
                        </RadixAccordion.Content>
                    </RadixAccordion.Item>
                );
            })}
        </RadixAccordion.Root>
    );
}

// Export - Default
export default Accordion;
