'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TabItem, Tabs } from '@project/source/ui/base/Tabs';

// Dependencies - URL State
import { useQueryState, parseAsStringEnum } from 'nuqs';

// Dependencies - API
import { SupportTicketStatus } from '@project/source/api/graphql';

// Component - AccountSupportTicketStatusTabs
interface AccountSupportTicketStatusTabsInterface {
    openTicketsCount: number;
    closedTicketsCount: number;
}
export function AccountSupportTicketStatusTabs(properties: AccountSupportTicketStatusTabsInterface) {
    const [activeTab, setActiveTab] = useQueryState<SupportTicketStatus>('status',
        parseAsStringEnum<SupportTicketStatus>(Object.values(SupportTicketStatus)).withDefault(SupportTicketStatus.Open)
    );

    const handleTabChange = (value: string) => {
        setActiveTab(value as SupportTicketStatus);
    }

    // Render the component
    return (
        <div className="my-6 w-fit">
            <Tabs size="extra-small" value={activeTab} onValueChange={handleTabChange} className="hidden w-fit md:flex">
                <TabItem value="open">
                    <div className="flex items-center">
                        <span>Open Requests</span>
                        { !!properties.openTicketsCount && (
                            <span className="px-2 py-0.5 ml-2 rounded-full border text-xs text-opsis-content-primary bg-opsis-background-primary">{properties.openTicketsCount}</span>
                        )}
                    </div>
                </TabItem>
                <TabItem value="closed">
                    <div className="flex items-center">
                        <span>Closed Requests</span>
                        { !!properties.closedTicketsCount && (
                            <span className="px-2 py-0.5 ml-2 rounded-full border text-xs text-opsis-content-primary bg-opsis-background-primary">{properties.closedTicketsCount}</span>
                        )}
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
}
export default AccountSupportTicketStatusTabs;