'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Dependencies - Main Components
import { TabItem, Tabs } from '@structure/source/common/navigation/tabs/Tabs';

// Component - AccountSupportTicketStatusTabs
interface AccountSupportTicketStatusTabsInterface {
    openTicketsCount: number;
    closedTicketsCount: number;
}
export function AccountSupportTicketStatusTabs(properties: AccountSupportTicketStatusTabsInterface) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTab = searchParams.get('status') || 'open';

    const handleTabChange = (value: string) => {
        const updatedParams = new URLSearchParams(searchParams ?? undefined);
        updatedParams.set('status', value);
        router.replace(`?${updatedParams.toString()}`);
    };

    // Render the component
    return (
        <div className="my-6 w-fit">
            <Tabs size="extra-small" value={activeTab} onValueChange={handleTabChange} className="hidden w-fit md:flex">
                <TabItem value="open">
                    <div className="flex items-center">
                        <span>Open Requests</span>
                        {!!properties.openTicketsCount && (
                            <span className="text-opsis-content-primary bg-opsis-background-primary ml-2 rounded-full border px-2 py-0.5 text-xs">
                                {properties.openTicketsCount}
                            </span>
                        )}
                    </div>
                </TabItem>
                <TabItem value="closed">
                    <div className="flex items-center">
                        <span>Closed Requests</span>
                        {!!properties.closedTicketsCount && (
                            <span className="text-opsis-content-primary bg-opsis-background-primary ml-2 rounded-full border px-2 py-0.5 text-xs">
                                {properties.closedTicketsCount}
                            </span>
                        )}
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
}
export default AccountSupportTicketStatusTabs;
