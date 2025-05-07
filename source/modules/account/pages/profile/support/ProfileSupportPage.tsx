'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import {
    PageNumber,
    Pagination,
    PaginationButton,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@project/source/ui/base/Pagination';
import { AccountSupportTicketStatusTabs } from './components/AccountSupportTicketStatusTabs';

// Dependencies - Hooks
import { useProfileSupportTickets } from './hooks/useProfileSupportTickets';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import {
    formatDateToDayOfWeekAndDate,
    formatDateToDateAtTime,
} from '@structure/source/utilities/Time';

// Dependencies - API
import {
    SupportTicketStatus,
    ProfileSupportTicketsQuery,
    Pagination as PaginationType,
} from '@project/source/api/graphql';

// Dependencies - Assets
import {
    ArrowRight,
    Smiley,
} from '@phosphor-icons/react';

function getPaginationPages(current: number, total: number): (number | '...')[] {
    const pages: (number | '...')[] = [];

    if (total <= 4) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push('...');
    }

    pages.push(total);

    return pages;
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Account Support',
    };
}

// Component - ProfileSupportPage
export function ProfileSupportPage() {

    const [openTicketsPage, setOpenTicketsPage] = React.useState<number>(1);
    const [closedTicketsPage, setClosedTicketsPage] = React.useState<number>(1);

    const ticketPaginationParams = React.useMemo(() => ({
        openTicketsPage,
        closedTicketsPage,
    }), [openTicketsPage, closedTicketsPage]);
    
    const { ticketsQuery } = useProfileSupportTickets(ticketPaginationParams);

    const [selectedStatus, setSelectedStatus] = React.useState<SupportTicketStatus>(SupportTicketStatus.Open);
    const [supportTickets, setSupportTickets] = React.useState<{
        openTickets: ProfileSupportTicketsQuery['openTickets'] | undefined;
        closedTickets: ProfileSupportTicketsQuery['closedTickets'] | undefined;
    }>({
        openTickets: ticketsQuery.data?.openTickets,
        closedTickets: ticketsQuery.data?.closedTickets,
    });

    const selectedTicketsPagination: PaginationType | undefined =
        selectedStatus === SupportTicketStatus.Open
            ? supportTickets.openTickets?.pagination
            : supportTickets.closedTickets?.pagination;
        
    React.useEffect(() => {
        if (!ticketsQuery.data) return;
        
        const { openTickets, closedTickets } = ticketsQuery.data;

        setSupportTickets({
            openTickets,
            closedTickets,
        });
    }, [ticketsQuery.data]);

    const handlePageChange = (pageNumber: PageNumber) => {
        if (!selectedTicketsPagination) return;

        const page: number =
            pageNumber === 'first' ? 1 :
            pageNumber === 'last' ? selectedTicketsPagination.pagesTotal :
            pageNumber;

        if (selectedStatus === SupportTicketStatus.Open) {
            setOpenTicketsPage(page);
        } else if (selectedStatus === SupportTicketStatus.Closed) {
            setClosedTicketsPage(page);
        }
    };

    // Render the component
    return (
        <div className="flex flex-col h-full w-full">
            <AccountSupportTicketStatusTabs
                // openTicketsCount={supportTickets.openTickets?.pagination.itemsTotal}
                // closedTicketsCount={supportTickets.closedTickets?.pagination.itemsTotal}
                onStatusChange={(status: SupportTicketStatus) => {
                    setSelectedStatus((prev) => {
                        if (prev === status) {
                            return prev;
                        }

                        return status;
                    })
                }}
            />
            <div className="flex flex-col h-full w-full">
                { !supportTickets.openTickets && !supportTickets.closedTickets ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <p className="text-neutral-500">Loading...</p>
                    </div>
                ) : (
                    <React.Fragment>
                        {selectedStatus === SupportTicketStatus.Open && (
                            <>
                                {!!supportTickets.openTickets?.items.length ? (
                                    <div className="flex flex-col gap-4">
                                        {supportTickets.openTickets.items.map((ticket) => (
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

                        {selectedStatus === SupportTicketStatus.Closed && (
                            <>
                                {!!supportTickets.closedTickets?.items.length ? (
                                    <div className="flex flex-col gap-4">
                                        {supportTickets.closedTickets.items.map((ticket) => (
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
                    </React.Fragment>
                )}
            </div>
            { (selectedTicketsPagination && selectedTicketsPagination.pagesTotal > 1) && (
                <Pagination
                    size="extra-small"
                    page={selectedTicketsPagination.page} // Adjusted to use 1-based indexing
                    onPageChange={(pageNumber) => handlePageChange(pageNumber)} // Ensure consistency
                    numberOfPages={selectedTicketsPagination.pagesTotal}
                    className="justify-center mt-4"
                >
                    <PaginationContent>
                        <PaginationPrevious
                            pageNumber={selectedTicketsPagination.page - 1}
                            disabled={selectedTicketsPagination.page <= 1} // Adjusted to match 1-based indexing
                        />

                        {getPaginationPages(selectedTicketsPagination.page, selectedTicketsPagination.pagesTotal).map((item, index) => (
                            <PaginationItem key={index}>
                                {item === '...' ? (
                                    <span className="px-2 text-neutral-400">...</span>
                                ) : (
                                    <PaginationButton pageNumber={item}>
                                        {item}
                                    </PaginationButton>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationNext
                            pageNumber={selectedTicketsPagination.page + 1}
                            disabled={selectedTicketsPagination.page >= selectedTicketsPagination.pagesTotal} // Adjusted to match 1-based indexing
                        />
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
export default ProfileSupportPage;

interface ProfileSupportTicketCardInterface {
    status: SupportTicketStatus;
    ticket: ProfileSupportTicketsQuery['openTickets']['items'][0] | ProfileSupportTicketsQuery['closedTickets']['items'][0];
}
const ProfileSupportTicketCard = (properties: ProfileSupportTicketCardInterface) => {
    const lastComment = properties.ticket.comments[properties.ticket.comments.length - 1];
    const commentContent = extractLatestEmailContent(lastComment?.content || '');
    return (
        <Link href={`/account/support/${properties.ticket.identifier}`}>
            <div className="grid w-full overflow-hidden rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <Badge
                        variant={properties.status === SupportTicketStatus.Open ? 'success' : 'info'}
                        size="sm"
                    >
                        {properties.status}
                    </Badge>
                    <ArrowRight size={16} />
                </div>
                <div className="flex items-center justify-start gap-2 mb-2">
                    <h2 className="text-base font-medium m-0">{properties.ticket.title}</h2>
                </div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-2 mb-2">
                    <span className="text-sm text-opsis-content-secondary">
                        Placed {formatDateToDayOfWeekAndDate(new Date(properties.ticket.createdAt))}
                    </span>
                    <span className="hidden lg:block">&bull;</span>
                    <span className="text-sm text-opsis-content-secondary">
                        Id: {properties.ticket.identifier}
                    </span>
                    <span className="hidden lg:block">&bull;</span>
                    <span className="text-sm text-opsis-content-secondary">
                        Updated: {formatDateToDateAtTime(new Date(properties.ticket.updatedAt))}
                    </span>
                </div>
                <div className="max-w-full overflow-hidden">
                    <p className="truncate break-words text-sm text-opsis-content-secondary">
                        {commentContent}
                    </p>
                </div>
            </div>
        </Link>
    )
}

interface ProfileEmptySupportTicketsInterface {
    status: SupportTicketStatus;
}
const ProfileEmptySupportTickets = (properties: ProfileEmptySupportTicketsInterface) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Smiley size={24} className="text-neutral-500" />
            <h2 className="mt-4 text-xl font-medium text-neutral-500">
                No {properties.status.toLowerCase()} requests—we're here when you need us.
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
                Reach out anytime by creating a new request.
            </p>
        </div>
    );
}