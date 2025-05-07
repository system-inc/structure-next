'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useIsMobile } from '@project/source/utilities/react/useIsMobile';

// Dependencies - Main Components
import Select from '@project/source/ui/base/Select';
import { TabItem, Tabs } from '@project/source/ui/base/Tabs';
import { SupportTicketStatus } from '@project/source/api/graphql';

// Dependencies - Assets
// import { Spinner } from '@phosphor-icons/react';

const StatusOptions = [
    { value: SupportTicketStatus.Open, title: 'Open Requests' },
    { value: SupportTicketStatus.Closed, title: 'Closed Requests' },
];

// Component - AccountSupportTicketStatusTabs
interface AccountSupportTicketStatusTabsInterface {
    // openTicketsCount: number | undefined;
    // closedTicketsCount: number | undefined;
    onStatusChange: (tab: SupportTicketStatus) => void;
}
export function AccountSupportTicketStatusTabs(properties: AccountSupportTicketStatusTabsInterface) {
    const [selectedStatus, setSelectedStatus] = React.useState<SupportTicketStatus>(SupportTicketStatus.Open);

    const isMobile = useIsMobile();

    const handleStatusChange = (value: string) => {
        const status = SupportTicketStatus[value as keyof typeof SupportTicketStatus];
        setSelectedStatus(status);
        properties.onStatusChange(status);
    }

    // Render the component
    return (
        <div className="my-6 w-full md:w-fit">
            { isMobile ? (
                <Select
                    className="w-full"
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    options={StatusOptions}
                    rounded
                />
            ) : (
                <Tabs size="extra-small" value={selectedStatus} onValueChange={handleStatusChange} className="flex w-fit">
                    {StatusOptions.map((option) => (
                        <TabItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                                <span>{option.title}</span>
                            {/* { !!properties.closedTicketsCount && (
                                <TabCount count={properties.closedTicketsCount} />
                            )} */}
                            </div>
                        </TabItem>
                    ))}
                </Tabs>
            )}
        </div>
    );
}
export default AccountSupportTicketStatusTabs;

// interface TabCountInterface {
//     count: number;
// }
// function TabCount(properties: TabCountInterface) {
//     return (
//         <span className="px-2 py-0.5 ml-2 rounded-full border text-xs text-opsis-content-primary bg-opsis-background-primary">
//             {properties.count ? properties.count : <Spinner className="animate-spin" />}
//         </span>
//     );
// }
