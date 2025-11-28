'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Tabs } from '@structure/source/components/navigation/tabs/Tabs';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Types
import { type OpsDesignNavigationLinkInterface } from './OpsDesignNavigationLinks';

// Component - OpsDesignNavigationTabs
export interface OpsDesignNavigationTabsProperties {
    navigationLinks: OpsDesignNavigationLinkInterface[];
    className?: string;
}

export function OpsDesignNavigationTabs(properties: OpsDesignNavigationTabsProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Construct base path for navigation
    const basePath = '/ops/design';

    // Determine active tab from URL path
    const activeTab =
        properties.navigationLinks.find(function (link) {
            const fullPath = link.href === '' ? basePath : basePath + link.href;
            // Check if the URL matches exactly (with or without trailing slash)
            return urlPath === fullPath || urlPath === fullPath + '/';
        })?.href || '';

    // Render
    return (
        <Tabs variant="LineBottom" value={activeTab}>
            {properties.navigationLinks.map(function (link) {
                return (
                    <Tabs.TabItem key={link.href} value={link.href}>
                        <Button className="px-3.5 py-3.5 text-[15px]" href={basePath + link.href}>
                            {link.title}
                        </Button>
                    </Tabs.TabItem>
                );
            })}
        </Tabs>
    );
}
