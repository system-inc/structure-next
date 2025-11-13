'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Internal Components
import { Ticket } from '@structure/source/modules/support/ops/components/ticket/Ticket';
import { CustomerAndTicketSidePanel } from '@structure/source/modules/support/ops/components/customer-and-ticket-side-panel/CustomerAndTicketSidePanel';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { SidebarIcon } from '@phosphor-icons/react';

// Dependencies - Hooks
import { useSupportTickets } from '@structure/source/modules/support/ops/hooks/useSupportTickets';

// Dependencies - API
import {
    SupportTicketStatus,
    SupportTicketCommentCreateInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - OpsSupportPage
export function OpsSupportPage() {
    // URL Parameters
    const urlSearchParameters = useUrlSearchParameters();

    // State & Refs
    const [isSidebarVisible, setIsSidebarVisible] = React.useState<boolean>(false);
    const commentsContainerReference = React.useRef<HTMLDivElement>(null);

    const selectedStatus = (urlSearchParameters?.get('status') as SupportTicketStatus) || SupportTicketStatus.Open;
    const selectedTicketIdentifier = urlSearchParameters?.get('ticket') ?? null;
    const pageParameters = urlSearchParameters.get('page') ? parseInt(urlSearchParameters?.get('page') as string) : 1;
    const showMyTickets = false;

    // Hooks
    const supportTickets = useSupportTickets(
        pageParameters,
        20, // itemsPerPage
        selectedStatus,
        showMyTickets,
    );

    // Selected Ticket
    const selectedTicket = supportTickets.ticketsQuery.data?.supportTicketsPrivileged?.items?.find(
        (ticket) => ticket.identifier === selectedTicketIdentifier,
    );

    // Scroll to bottom when selecting ticket or when new comments appear
    React.useEffect(
        function () {
            if(commentsContainerReference.current && selectedTicket?.comments) {
                commentsContainerReference.current.scrollTop = commentsContainerReference.current.scrollHeight;
            }
        },
        [selectedTicket],
    );

    const handleTicketStatusChange = React.useCallback(
        async function (ticketId: string, status: SupportTicketStatus) {
            await supportTickets.updateTicketStatus({
                id: ticketId,
                status,
            });
        },
        [supportTickets],
    );

    const handleTicketCommentCreate = React.useCallback(
        async function (input: SupportTicketCommentCreateInput) {
            await supportTickets.createComment({
                input,
            });
        },
        [supportTickets],
    );

    // Render the component
    return (
        <div className="relative flex h-full flex-col overflow-hidden">
            <div
                className={`relative grid flex-1 overflow-hidden transition-all duration-300 ease-out-expo ${
                    isSidebarVisible ? 'grid-cols-[1fr_1.5fr]' : 'grid-cols-[1fr_0fr]'
                }`}
            >
                {/* Center - Ticket Details */}
                <div className="relative h-full overflow-hidden">
                    <Ticket
                        ticket={selectedTicket}
                        supportProfiles={supportTickets.supportProfilesQuery.data?.supportAllSupportProfiles}
                        isLoadingProfiles={supportTickets.supportProfilesQuery.loading}
                        onTicketStatusChange={handleTicketStatusChange}
                        onTicketCommentCreate={handleTicketCommentCreate}
                        refetchTickets={supportTickets.refetchTickets}
                    />
                </div>

                {/* Right Sidebar */}
                {isSidebarVisible && <CustomerAndTicketSidePanel ticket={selectedTicket} />}
            </div>

            <Button
                className="absolute top-1.5 right-2 z-10 flex h-8 w-8 items-center justify-center overflow-visible rounded-lg background--2 p-1 transition-all"
                onClick={function () {
                    setIsSidebarVisible((previous) => !previous);
                }}
                aria-label="Show sidebar"
            >
                <SidebarIcon className="h-4 w-4" weight="bold" />
            </Button>
        </div>
    );
}
