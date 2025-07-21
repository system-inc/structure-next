'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Wrapper } from '@structure/source/utilities/Wrapper';

// Dependencies - Foundation Providers
import { CookiesProvider } from '@structure/source/utilities/cookies/CookiesProvider';
import { Cookies } from '@structure/source/utilities/cookies/Cookies';
import { NetworkServiceProvider } from '@structure/source/services/network/NetworkServiceProvider';

// Dependencies - State Providers
import { WebSocketViaSharedWorkerProvider } from '@structure/source/api/web-sockets/providers/WebSocketViaSharedWorkerProvider';
import { AccountProvider } from '@structure/source/modules/account/providers/AccountProvider';
import { SharedStateProvider } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Dependencies - Experience Providers
import { ThemeProvider } from '@structure/source/theme/ThemeProvider';

// Dependencies - Feature Providers
import { EngagementProvider } from '@structure/source/modules/engagement/EngagementProvider';

// Dependencies - Interaction Providers
import { NoticeProvider } from '@structure/source/common/notifications/NoticeProvider';
import { TipProvider } from '@structure/source/common/popovers/TipProvider';

// Component - Providers
export interface ProvidersProperties {
    accountSignedIn: boolean;
    foundationProviders?: React.ComponentType<{
        children: React.ReactNode;
    }>;
    stateProviders?: React.ComponentType<{
        children: React.ReactNode;
    }>;
    themeProviders?: React.ComponentType<{
        children: React.ReactNode;
    }>;
    featureProviders?: React.ComponentType<{
        children: React.ReactNode;
    }>;
    interactionProviders?: React.ComponentType<{
        children: React.ReactNode;
    }>;
    children: React.ReactNode;
}
export function Providers(properties: ProvidersProperties) {
    const FoundationProviders = properties.foundationProviders || Wrapper;
    const StateProviders = properties.stateProviders || Wrapper;
    const ThemeProviders = properties.themeProviders || Wrapper;
    const FeatureProviders = properties.featureProviders || Wrapper;
    const InteractionProviders = properties.interactionProviders || Wrapper;

    // Render the component
    return (
        // Foundation Providers
        <FoundationProviders>
            <NetworkServiceProvider>
                <CookiesProvider cookies={Cookies}>
                    {/* State Providers */}
                    <StateProviders>
                        <WebSocketViaSharedWorkerProvider>
                            <SharedStateProvider>
                                <AccountProvider signedIn={properties.accountSignedIn}>
                                    {/* Theme Providers */}
                                    <ThemeProviders>
                                        <ThemeProvider>
                                            {/* Feature Providers */}
                                            <FeatureProviders>
                                                <EngagementProvider>
                                                    {/* Interaction Providers */}
                                                    <InteractionProviders>
                                                        <NoticeProvider>
                                                            <TipProvider delayDuration={100}>
                                                                {properties.children}
                                                            </TipProvider>
                                                        </NoticeProvider>
                                                    </InteractionProviders>
                                                </EngagementProvider>
                                            </FeatureProviders>
                                        </ThemeProvider>
                                    </ThemeProviders>
                                </AccountProvider>
                            </SharedStateProvider>
                        </WebSocketViaSharedWorkerProvider>
                    </StateProviders>
                </CookiesProvider>
            </NetworkServiceProvider>
        </FoundationProviders>
    );
}
