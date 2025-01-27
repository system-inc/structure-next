'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Cookies from '@structure/source/utilities/cookies/Cookies';
import CookiesProvider from '@structure/source/utilities/cookies/CookiesProvider';
import ApolloProvider from '@structure/source/api/apollo/ApolloProvider';
import AccountProvider from '@structure/source/modules/account/providers/AccountProvider';
import SharedStateProvider from '@structure/source/utilities/shared-state/SharedStateProvider';
import EngagementProvider from '@structure/source/modules/engagement/EngagementProvider';
import NoticeProvider from '@structure/source/common/notifications/NoticeProvider';
import TipProvider from '@structure/source/common/popovers/TipProvider';
import { IconContext } from '@phosphor-icons/react';
import ThemeProvider from '@structure/source/theme/ThemeProvider';
import { ThemeMode } from '@structure/source/theme/Theme';

export interface ProvidersInterface {
    children: React.ReactNode;
    accountSignedIn: boolean;
    themeFromCookies?: ThemeMode;
}
export function Providers({ accountSignedIn, themeFromCookies, children }: ProvidersInterface) {
    // Render the component
    return (
        <CookiesProvider cookies={Cookies}>
            <ApolloProvider>
                <IconContext.Provider
                    value={{
                        weight: 'bold',
                        color: 'currentColor',
                    }}
                >
                    <SharedStateProvider>
                        <ThemeProvider themeFromCookies={themeFromCookies}>
                            <AccountProvider signedIn={accountSignedIn}>
                                <EngagementProvider>
                                    <NoticeProvider>
                                        <TipProvider delayDuration={100}>{children}</TipProvider>
                                    </NoticeProvider>
                                </EngagementProvider>
                            </AccountProvider>
                        </ThemeProvider>
                    </SharedStateProvider>
                </IconContext.Provider>
            </ApolloProvider>
        </CookiesProvider>
    );
}

// Export - Default
export default Providers;
