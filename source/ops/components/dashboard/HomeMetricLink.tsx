// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Component - HomeMetricLink
export type HomeMetricLinkProperties = {
    number?: number;
    text: string;
    href: string;
};
export function HomeMetricLink(properties: HomeMetricLinkProperties) {
    // Render the component
    return (
        <Link href={properties.href} className="flex items-center justify-between p-4 text-sm font-light">
            <div>
                {properties.number !== undefined && (
                    <>
                        <span className={`${properties.number === 0 ? '' : 'font-medium'}`}>
                            {properties.number === 0 ? 'No' : properties.number}
                        </span>{' '}
                    </>
                )}
                {properties.text}
            </div>

            {/* Chevron */}
            <ChevronRightIcon className="h-4 w-4" />
        </Link>
    );
}
