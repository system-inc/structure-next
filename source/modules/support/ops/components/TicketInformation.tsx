// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputSelect } from '@structure/source/components/forms/InputSelect';

// Dependencies - Utilities
import { dateFull } from '@structure/source/utilities/time/Time';

// Dependencies - API
import type { SupportAllSupportProfilesQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - TicketInfo
export interface TicketInformationProperties {
    email: string;
    status: string;
    createdAt: string;
    assignedToProfileId?: string | null;
    assignedToProfile?: { username: string } | null;
    onAssign: (username: string) => void;
    ticketId: string;
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles'];
    isLoadingProfiles?: boolean;
}

export function TicketInformation(properties: TicketInformationProperties) {
    // State for selected username
    const [selectedUsername, setSelectedUsername] = React.useState<string | undefined>(
        properties.assignedToProfile?.username,
    );

    // Effect to update selected username when assignedToProfile changes
    React.useEffect(
        function () {
            setSelectedUsername(properties.assignedToProfile?.username);
        },
        [properties.assignedToProfile],
    );

    // Transform support profiles into select items
    const supportAgentItems = React.useMemo(
        function () {
            const items = [{ value: '', content: 'Unassigned' }];

            properties.supportProfiles?.forEach(function (profile) {
                items.push({
                    value: profile.username,
                    content: profile.displayName || profile.username,
                });
            });

            return items;
        },
        [properties.supportProfiles],
    );

    // Render the component
    return (
        <div className="mb-6 rounded-lg border border--3 p-2 text-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Ticket Details</h3>
                <InputSelect
                    key={properties.ticketId}
                    className="w-48"
                    placeholder={properties.isLoadingProfiles ? 'Loading...' : 'Assign ticket'}
                    items={supportAgentItems}
                    defaultValue={selectedUsername}
                    disabled={properties.isLoadingProfiles}
                    onChange={function (value) {
                        setSelectedUsername(value);
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
                    <strong>Created:</strong> {dateFull(new Date(properties.createdAt))}
                </p>
            </div>
        </div>
    );
}
