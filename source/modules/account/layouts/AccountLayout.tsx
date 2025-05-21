'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { AuthorizationLayout } from '@structure/source/layouts/AuthorizationLayout';
import { AccountNavigation, AccountNavigationMobile } from './AccountNavigation';

// Dependencies - Animation
import { LoadingAnimation } from '@structure/source/common/animations/LoadingAnimation';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: {
            template: '%s • Account • ' + ProjectSettings.title,
            default: 'Account • ' + ProjectSettings.title, // default is required when creating a template
        },
    };
}

// Component - AccountLayout
export interface AccountLayoutProperties {
    children: React.ReactNode;
}
export function AccountLayout(properties: AccountLayoutProperties) {
    // Render the component
    return (
        <AuthorizationLayout>
            <AccountNavigationMobile />
            <div className="container">
                <div className="mb-20 mt-10 md:flex md:space-x-32">
                    {/* Account Navigation */}
                    <AccountNavigation className="" />

                    {/* Content */}
                    <React.Suspense
                        fallback={
                            <div className="w-full">
                                <LoadingAnimation className="w-full" loadingText="Loading..." />
                            </div>
                        }
                    >
                        <div className="flex-grow">{properties.children}</div>
                    </React.Suspense>
                </div>
            </div>
        </AuthorizationLayout>
    );
}
