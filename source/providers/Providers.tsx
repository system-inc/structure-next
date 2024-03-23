'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CookiesProvider } from './CookiesProvider';
import cookies from '@structure/source/utilities/Cookies';
import SessionProvider from './SessionProvider';
import ThemeProvider from './ThemeProvider';
import ApolloProvider from './ApolloProvider';
import TipProvider from './TipProvider';
import NoticeProvider from '@structure/source/common/interactions/notice/NoticeProvider';

export type ProvidersProperties = {
    children: React.ReactNode;
};
export function Providers(properties: ProvidersProperties) {
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
