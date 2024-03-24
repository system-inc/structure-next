'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import cookies from '@structure/source/utilities/Cookies';
import CookiesProvider from '@structure/source/utilities/CookiesProvider';
import SessionProvider from '@structure/source/modules/account/SessionProvider';
import ThemeProvider from '@structure/source/theme/ThemeProvider';
import ApolloProvider from '@structure/source/api/ApolloProvider';
import TipProvider from '@structure/source/common/popovers/TipProvider';
import NoticeProvider from '@structure/source/common/notifications/NoticeProvider';

export interface ProvidersInterface {
    children: React.ReactNode;
}
export function Providers(properties: ProvidersInterface) {
    // Render the component
    return (
        <CookiesProvider cookies={cookies}>
            <ApolloProvider>
                <SessionProvider>
                    <ThemeProvider>
                        <NoticeProvider>
                            <TipProvider delayDuration={100}>{properties.children}</TipProvider>
                        </NoticeProvider>
                    </ThemeProvider>
                </SessionProvider>
            </ApolloProvider>
        </CookiesProvider>
    );
}

// Export - Default
export default Providers;
