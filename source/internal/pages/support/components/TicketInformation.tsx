// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';

// Constants
const SUPPORT_AGENTS = [
    { value: '', content: 'Unassigned' },
    { value: 'kirk@phi.health', content: 'Kirk Ouimet', description: 'kirk@phi.health' },
    { value: 'natalie@phi.health', content: 'Natalie Main', description: 'natalie@phi.health' },
    { value: 'jp@phi.health', content: 'John-Paul Andersen', description: 'jp@phi.health' },
];

// Component - TicketInfo
export interface TicketInformationInterface {
    email: string;
    status: string;
    createdAt: string;
    assignedTo?: string | null;
    onAssign: (email: string) => void;
    ticketId: string;
}

export function TicketInformation(properties: TicketInformationInterface) {
    // Render the component
    return (
        <div className="mb-6 rounded-lg border border-light-3 p-2 text-sm dark:border-dark-3">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Ticket Details</h3>
                <InputSelect
                    className="w-48"
                    placeholder="Assign ticket"
                    items={SUPPORT_AGENTS}
                    value={properties.assignedTo || ''}
                    onChange={function (value) {
                        properties.onAssign(value || '');
                    }}
                />
            </div>
            <div className="mt-2">
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
        </div>
    );
}

// Export - Default
export default TicketInformation;
