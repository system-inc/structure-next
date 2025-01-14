'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Cookies from '@structure/source/utilities/cookies/Cookies';
import CookiesProvider from '@structure/source/utilities/cookies/CookiesProvider';
import ApolloProvider from '@structure/source/api/apollo/ApolloProvider';
import ThemeProvider from '@structure/source/theme/ThemeProvider';
import AccountProvider from '@structure/source/modules/account/providers/AccountProvider';
import SharedStateProvider from '@structure/source/utilities/shared-state/SharedStateProvider';
import EngagementProvider from '@structure/source/modules/engagement/EngagementProvider';
import NoticeProvider from '@structure/source/common/notifications/NoticeProvider';
import TipProvider from '@structure/source/common/popovers/TipProvider';
import { IconContext } from '@phosphor-icons/react';

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
                <ThemeProvider themeClassName={properties.themeClassName}>
                    <IconContext.Provider
                        value={{
                            weight: 'bold',
                            color: 'currentColor',
                        }}
                    >
                        <AccountProvider signedIn={properties.accountSignedIn}>
                            <SharedStateProvider>
                                <EngagementProvider>
                                    <NoticeProvider>
                                        <TipProvider delayDuration={100}>{properties.children}</TipProvider>
                                    </NoticeProvider>
                                </EngagementProvider>
                            </SharedStateProvider>
                        </AccountProvider>
                    </IconContext.Provider>
                </ThemeProvider>
            </ApolloProvider>
        </CookiesProvider>
    );
}

// Export - Default
export default Providers;
