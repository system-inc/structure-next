'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { sessionIdHttpOnlyCookieExistsAtom } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Foundation Providers
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { CookiesProvider } from '@structure/source/utilities/cookie/CookiesProvider';
import { Cookies } from '@structure/source/utilities/cookie/Cookies';
import { NetworkServiceProvider } from '@structure/source/services/network/NetworkServiceProvider';

// Dependencies - State Providers
import { WebSocketViaSharedWorkerProvider } from '@structure/source/api/web-sockets/providers/WebSocketViaSharedWorkerProvider';
import { SharedStateProvider, globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Dependencies - Experience Providers
import { ThemeProvider } from '@structure/source/theme/ThemeProvider';
import { IconContext } from '@phosphor-icons/react';

// Dependencies - Feature Providers
import { EngagementProvider } from '@structure/source/modules/engagement/layouts/EngagementProvider';

// Dependencies - Interaction Providers
import { NotificationsProvider } from '@structure/source/components/notifications/NotificationsProvider';
import { TipProvider } from '@structure/source/components/popovers/TipProvider';

// Dependencies - Main Components
import { AuthenticationDialog } from '@structure/source/modules/account/authentication/components/dialogs/AuthenticationDialog';

// Component - Providers
export interface ProvidersProperties {
    sessionIdHttpOnlyCookieExists: boolean;
    children: React.ReactNode;
}
export function Providers(properties: ProvidersProperties) {
    // Set global state atom for sessionId HTTP-only cookie existence
    // If the sessionId cookie exists, the user is signed in
    // This is used to determine if the client should request account data from the server
    globalStore.set(sessionIdHttpOnlyCookieExistsAtom, properties.sessionIdHttpOnlyCookieExists);

    // Render the component
    return (
        <NuqsAdapter>
            <NetworkServiceProvider>
                <CookiesProvider cookies={Cookies}>
                    <WebSocketViaSharedWorkerProvider>
                        <SharedStateProvider>
                            <ThemeProvider>
                                <IconContext.Provider value={{ weight: 'bold', color: 'currentColor' }}>
                                    <EngagementProvider>
                                        <NotificationsProvider>
                                            <TipProvider delayDuration={100}>
                                                {properties.children}
                                                <AuthenticationDialog />
                                            </TipProvider>
                                        </NotificationsProvider>
                                    </EngagementProvider>
                                </IconContext.Provider>
                            </ThemeProvider>
                        </SharedStateProvider>
                    </WebSocketViaSharedWorkerProvider>
                </CookiesProvider>
            </NetworkServiceProvider>
        </NuqsAdapter>
    );
}
