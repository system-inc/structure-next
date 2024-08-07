'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import EngagementProvider from '@structure/source/modules/engagement/EngagementProvider';
import Cookies from '@structure/source/utilities/cookies/Cookies';
import CookiesProvider from '@structure/source/utilities/cookies/CookiesProvider';
import AccountProvider from '@structure/source/modules/account/AccountProvider';
import ThemeProvider from '@structure/source/theme/ThemeProvider';
import ApolloProvider from '@structure/source/api/ApolloProvider';
import TipProvider from '@structure/source/common/popovers/TipProvider';
import NoticeProvider from '@structure/source/common/notifications/NoticeProvider';
import SharedStateProvider from '@structure/source/utilities/shared-state/SharedStateProvider';

export interface ProvidersInterface {
    children: React.ReactNode;
    accountSignedIn: boolean;
    themeClassName?: string;
}
export function Providers(properties: ProvidersInterface) {
    // Render the component
    return (
        <CookiesProvider cookies={Cookies}>
            <ApolloProvider>
                <AccountProvider signedIn={properties.accountSignedIn}>
                    <SharedStateProvider>
                        <ThemeProvider themeClassName={properties.themeClassName}>
                            <EngagementProvider>
                                <NoticeProvider>
                                    <TipProvider delayDuration={100}>{properties.children}</TipProvider>
                                </NoticeProvider>
                            </EngagementProvider>
                        </ThemeProvider>
                    </SharedStateProvider>
                </AccountProvider>
            </ApolloProvider>
        </CookiesProvider>
    );
}

// Export - Default
export default Providers;
