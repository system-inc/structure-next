// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';

// Component - CardLink
export type CardLinkProperties = {
    title: string;
    value: string;
    date: string;
    href: string;
};
export function CardLink(properties: CardLinkProperties) {
    // Render the component
    return (
        <Link
            href={properties.href}
            className="flex-grow rounded-lg border border-light-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow dark:border-dark-4 dark:shadow-dark-4/30"
        >
            <div className="flex items-center justify-between">
                <h2 className="mb-1 text-base font-normal">{properties.title}</h2>
                <p className="text-base font-normal">{properties.value}</p>
            </div>
            <p className="text-xs font-light text-dark-4/75 dark:text-light-4/50">{properties.date}</p>
        </Link>
    );
}
