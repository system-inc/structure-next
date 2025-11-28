'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Data
import { opsDesignNavigationLinks } from './OpsDesignNavigationLinks';

// Dependencies - Main Components
import { LoadingAnimation } from '@structure/source/components/animations/LoadingAnimation';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { OpsDesignNavigationPopoverMenu } from './OpsDesignNavigationPopoverMenu';
import { OpsDesignNavigationTabs } from './OpsDesignNavigationTabs';

// Component - OpsDesignLayout
export interface OpsDesignLayoutProperties {
    children: React.ReactNode;
}

export function OpsDesignLayout(properties: OpsDesignLayoutProperties) {
    return (
        <ScrollArea className="px-6 pb-6">
            {/* Non-sticky header content */}
            <div className="mt-6 flex justify-center">
                <div className="w-full max-w-7xl">
                    <OpsNavigationTrail />
                </div>
            </div>

            {/* Mobile: PopoverMenu Navigation (non-sticky) */}
            <div className="flex justify-center md:hidden">
                <div className="w-full max-w-7xl">
                    <OpsDesignNavigationPopoverMenu navigationLinks={opsDesignNavigationLinks} />
                </div>
            </div>

            {/* Desktop: Sticky Tabs */}
            <div className="sticky top-0 z-10 hidden justify-center md:flex">
                <div className="w-full max-w-7xl background--0">
                    <OpsDesignNavigationTabs navigationLinks={opsDesignNavigationLinks} />
                </div>
            </div>

            {/* Content */}
            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-7xl">
                    <React.Suspense fallback={<LoadingAnimation />}>{properties.children}</React.Suspense>
                </div>
            </div>
        </ScrollArea>
    );
}
