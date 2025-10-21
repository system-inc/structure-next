// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

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
            className="grow rounded-lg border border--d p-5 transition-all hover:-translate-y-0.5 hover:shadow"
        >
            <div className="flex items-center justify-between">
                <h2 className="mb-1 text-base font-normal">{properties.title}</h2>
                <p className="text-base font-normal">{properties.value}</p>
            </div>
            <p className="text-xs">{properties.date}</p>
        </Link>
    );
}
