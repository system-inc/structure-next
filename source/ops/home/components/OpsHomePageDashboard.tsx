'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { OpsHomePageDailyPrompt } from './OpsHomePageDailyPrompt';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { Drawer } from '@structure/source/components/drawers/Drawer';
import { Button } from '@structure/source/components/buttons/Button';
import { EngagementActivity } from '@structure/source/modules/engagement/components/activity/EngagementActivity';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useMediaQuery } from '@structure/source/utilities/react/hooks/useMediaQuery';

// Dependencies - Assets
import { CircleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { weekdayDate } from '@structure/source/utilities/time/Time';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - OpsHomePageDashboard
export interface OpsHomePageDashboardProperties {
    className?: string;
    dailyPromptQuestions: string[];
    children: React.ReactNode;
}
export function OpsHomePageDashboard(properties: OpsHomePageDashboardProperties) {
    // Hooks
    const account = useAccount();
    // xl breakpoint is 1280px - show drawer on smaller screens (when sidebar is hidden)
    const isLargeScreenMediaQuery = useMediaQuery('(min-width: 1280px)');

    // State
    const [isMounted, setIsMounted] = React.useState(false);
    const [todayFormatted, setTodayFormatted] = React.useState('');

    // Get user's first name or default to "Operator"
    const firstName = account.data?.profile?.givenName || 'Operator';

    // Whether to show the drawer (only after mounted and on small screens)
    const showDrawer = isMounted && !isLargeScreenMediaQuery;

    // Effects
    React.useEffect(function () {
        // Mark as mounted to avoid hydration mismatch with media query
        setIsMounted(true);
        // Set date on client to avoid hydration mismatch
        setTodayFormatted(weekdayDate(new Date()));
    }, []);

    // Render the component
    return (
        <ScrollArea>
            {/* Inner container - centered with max-width */}
            <div className={mergeClassNames('mx-auto max-w-[1440px] px-6 pt-6 pb-8', properties.className)}>
                {/* Header */}
                <div className="mb-10">
                    <div className="mb-2.5 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold content--0">Welcome, {firstName}.</h1>
                        {/* Sessions drawer - only rendered on smaller screens when sidebar is hidden */}
                        {showDrawer && (
                            <Drawer
                                variant="A"
                                accessibilityTitle="Sessions"
                                accessibilityDescription="View active user sessions"
                                side="Right"
                                trigger={
                                    <Button
                                        variant="Outline"
                                        icon={<CircleIcon weight="fill" className="animate-pulse content--positive" />}
                                        iconSize="IconExtraSmall"
                                    >
                                        Sessions
                                    </Button>
                                }
                                body={<EngagementActivity className="mt-6" databaseName="readonly" />}
                            />
                        )}
                    </div>
                    <OpsHomePageDailyPrompt questions={properties.dailyPromptQuestions} />
                </div>

                {/* Date divider */}
                <div className="mb-10">
                    <div className="mb-4 text-base font-medium content--0">{todayFormatted}</div>
                    <div className="border-t border--0" />
                </div>

                {/* Main content - project-specific metric cards, charts, etc. */}
                {properties.children}
            </div>
        </ScrollArea>
    );
}
