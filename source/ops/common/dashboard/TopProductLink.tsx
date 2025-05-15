// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';

// Component - TopProductLink
export type TopProductLinkProperties = {
    productName: string;
    amountOrdered: number;
    totalRevenue: number;
    image?: string;
    href: string;
};
export function TopProductLink(properties: TopProductLinkProperties) {
    // Render the component
    return (
        <Link
            href={properties.href}
            className="flex items-center justify-between p-4 font-light hover:bg-light-4/30 dark:hover:bg-light-4/5"
        >
            {/* Image and identifier info */}
            <div className="flex items-center">
                {!properties.image ? (
                    <div className="aspect-square w-16 animate-pulse rounded bg-light-4" />
                ) : (
                    <Image src={properties.image} alt={properties.productName} width={32} height={32} className="" />
                )}
                <div className="ml-4">
                    <p className="">{properties.productName}</p>
                    {/* <p className="text-dark-4-tertiary text-xs text-dark-4/70">
            {properties.amountOrdered} ordered
          </p> */}
                </div>
            </div>

            {/* Total Revenue */}
            <p className="text-sm">
                {properties.amountOrdered.toLocaleString()} orders ($
                {properties.totalRevenue.toLocaleString()})
            </p>
        </Link>
    );
}

// Export - Default
export default TopProductLink;
