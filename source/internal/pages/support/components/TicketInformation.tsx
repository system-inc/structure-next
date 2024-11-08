// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';

// Component - TicketInfo
export interface TicketInformationInterface {
    email: string;
    status: string;
    createdAt: string;
}
export function TicketInfo(properties: TicketInformationInterface) {
    // Render the component
    return (
        <div className="mb-6 rounded-lg border border-light-3 p-2 text-sm dark:border-dark-3">
            <p>
                <strong>Email:</strong> {properties.email}
            </p>
            <p>
                <strong>Status:</strong> {properties.status}
            </p>
            <p>
                <strong>Created:</strong> {fullDate(new Date(properties.createdAt))}
            </p>
        </div>
    );
}

// Export - Default
export default TicketInfo;
