'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Data
import { opsDesignNavigationLinks } from './OpsDesignNavigationLinks';

// Dependencies - Main Components
import { LoadingAnimation } from '@structure/source/components/animations/LoadingAnimation';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { OpsDesignNavigationPopoverMenu } from './OpsDesignNavigationPopoverMenu';
import { OpsDesignNavigationTabs } from './OpsDesignNavigationTabs';

// Component - OpsDesignLayout
export interface OpsDesignLayoutProperties {
    children: React.ReactNode;
}

export function OpsDesignLayout(properties: OpsDesignLayoutProperties) {
    return (
        <ScrollArea containerClassName="">
            <div className="flex justify-center px-8 pb-12">
                <div className="w-full max-w-4xl">
                    <div className="mt-8 mb-4">
                        <OpsNavigationTrail />
                    </div>

                    <div className="mb-8">
                        {/* Mobile: PopoverMenu Navigation */}
                        <div className="md:hidden">
                            <OpsDesignNavigationPopoverMenu navigationLinks={opsDesignNavigationLinks} />
                        </div>

                        {/* Desktop: Horizontal Tabs */}
                        <div className="hidden md:block">
                            <OpsDesignNavigationTabs navigationLinks={opsDesignNavigationLinks} />
                        </div>
                    </div>

                    {/* Content */}
                    <React.Suspense fallback={<LoadingAnimation />}>{properties.children}</React.Suspense>
                </div>
            </div>
        </ScrollArea>
    );
}
