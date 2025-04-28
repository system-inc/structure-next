'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { AccountSupportTicketStatusTabs } from './components/AccountSupportTicketStatusTabs';

// Dependencies - Hooks
import { useProfileSupportTickets } from './hooks/useProfileSupportTickets';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import {
    formatDateToDayOfWeekAndDate,
    // formatDateToDateAtTime,
} from '@structure/source/utilities/Time';

// Dependencies - API
import {
    SupportTicketStatus,
    ProfileSupportTicketsQuery,
    PaginationSupportTicketResult,
} from '@project/source/api/graphql';

// Dependencies - Assets
import { ArrowRight, Smiley } from '@phosphor-icons/react';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Support',
    };
}

const emptyPaginationResult: PaginationSupportTicketResult = {
    items: [],
    pagination: {
        itemIndex: 0,
        itemIndexForNextPage: null,
        itemIndexForPreviousPage: null,
        itemsPerPage: 3,
        itemsTotal: 0,
        page: 1,
        pagesTotal: 0,
    },
};

// Component - ProfileSupportPage
export function ProfileSupportPage() {
    // Hooks
    const searchParams = useSearchParams();
    const router = useRouter();

    const { ticketsQuery } = useProfileSupportTickets(1, 1);

    const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
        searchParams.get('status') || SupportTicketStatus.Open,
    );
    const [_supportTickets, _setSupportTickets] = React.useState<{
        openTickets: ProfileSupportTicketsQuery['openTickets']['items'];
        closedTickets: ProfileSupportTicketsQuery['closedTickets']['items'];
    }>({
        openTickets: ticketsQuery.data?.openTickets?.items || [],
        closedTickets: ticketsQuery.data?.closedTickets?.items || [],
    });
    const [openTickets, setOpenTickets] = React.useState<ProfileSupportTicketsQuery['openTickets']>({
        ...emptyPaginationResult,
    });
    const [closedTickets, setClosedTickets] = React.useState<ProfileSupportTicketsQuery['closedTickets']>({
        ...emptyPaginationResult,
    });

    React.useEffect(
        function () {
            if(!ticketsQuery.data) return;

            const openTicketResult = ticketsQuery.data.openTickets;
            const closedTicketResult = ticketsQuery.data.closedTickets;
            setOpenTickets(openTicketResult);
            setClosedTickets(closedTicketResult);
        },
        [ticketsQuery.data],
    );

    React.useEffect(
        function () {
            const statusParam = searchParams.get('status');
            if(!statusParam) {
                // If no status param, set it to 'open' and update the URL
                const newSearchParams = new URLSearchParams(window.location.search);
                newSearchParams.set('status', 'open');
                router.replace(`?${newSearchParams.toString()}`);
                setSelectedStatus(SupportTicketStatus.Open);
            }
            else {
                // If status param exists, set the selectedStatus
                setSelectedStatus(statusParam);
            }
        },
        [searchParams, router],
    );

    // Loading state removed as it was causing layout shifts
    // if (ticketsQuery.loading) {
    //     return (
    //         'Loading...'
    //     );
    // }

    // Render the component
    return (
        <div className="flex h-full w-full flex-col">
            <AccountSupportTicketStatusTabs
                openTicketsCount={openTickets.pagination.itemsTotal}
                closedTicketsCount={closedTickets.pagination.itemsTotal}
            />
            <div className="flex h-full w-full flex-col">
                {selectedStatus === SupportTicketStatus.Open.toLowerCase() && (
                    <>
                        {openTickets.items.length ? (
                            <div className="flex flex-col gap-4">
                                {openTickets.items.map((ticket) => (
                                    <ProfileSupportTicketCard
                                        key={ticket.id}
                                        status={SupportTicketStatus.Open}
                                        ticket={ticket}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ProfileEmptySupportTickets status={SupportTicketStatus.Open} />
                        )}
                    </>
                )}

                {selectedStatus === SupportTicketStatus.Closed.toLowerCase() && (
                    <>
                        {closedTickets.items.length ? (
                            <div className="flex flex-col gap-4">
                                {closedTickets.items.map((ticket) => (
                                    <ProfileSupportTicketCard
                                        key={ticket.id}
                                        status={SupportTicketStatus.Closed}
                                        ticket={ticket}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ProfileEmptySupportTickets status={SupportTicketStatus.Closed} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
export default ProfileSupportPage;

interface ProfileSupportTicketCardInterface {
    status: SupportTicketStatus;
    ticket:
        | ProfileSupportTicketsQuery['openTickets']['items'][0]
        | ProfileSupportTicketsQuery['closedTickets']['items'][0];
}
const ProfileSupportTicketCard = (properties: ProfileSupportTicketCardInterface) => {
    const lastComment = properties.ticket.comments[properties.ticket.comments.length - 1];
    const commentContent = extractLatestEmailContent(lastComment?.content || '');
    return (
        <Link href={`/account/support/${properties.ticket.identifier}`}>
            <div className="rounded-xl border p-6">
                <div className="mb-4 flex items-center justify-between">
                    <Badge variant={properties.status === SupportTicketStatus.Open ? 'success' : 'info'} size="large">
                        {properties.status}
                    </Badge>
                    <ArrowRight size={16} />
                </div>
                <div className="mb-2 flex items-center justify-start gap-2">
                    <h2 className="m-0 text-base font-medium">{properties.ticket.title}</h2>
                </div>
                <div className="mb-2 flex items-center justify-start gap-2">
                    <span className="text-sm text-opsis-content-secondary">
                        Placed {formatDateToDayOfWeekAndDate(new Date(properties.ticket.createdAt))}
                    </span>
                    <span>&bull;</span>
                    <span className="text-sm text-opsis-content-secondary">ID: {properties.ticket.identifier}</span>
                    {/* <span>&bull;</span>
                    <span className="text-sm text-opsis-content-secondary">
                        Updated: {formatDateToDateAtTime(new Date(properties.ticket.updatedAt))}
                    </span> */}
                </div>
                <p className="truncate text-sm text-opsis-content-secondary">{commentContent}</p>
            </div>
        </Link>
    );
};

interface ProfileEmptySupportTicketsInterface {
    status: SupportTicketStatus;
}
const ProfileEmptySupportTickets = (properties: ProfileEmptySupportTicketsInterface) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Smiley size={24} className="text-neutral-500" />
            <h2 className="text-neutral-500 mt-4 text-xl font-medium">
                No {properties.status.toLowerCase()} requests—we're here when you need us.
            </h2>
            <p className="text-neutral-400 mt-2 text-sm">Reach out anytime by creating a new request.</p>
        </div>
    );
};