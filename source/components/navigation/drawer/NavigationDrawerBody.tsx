// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NavigationLink, NavigationLinkProperties } from './NavigationLink';

// Component - NavigationDrawerBody
export interface NavigationDrawerBodyProperties {
    navigationLinks: Pick<NavigationLinkProperties, 'href' | 'title' | 'icon'>[];
    closeDrawer?: () => void;
}
export function NavigationDrawerBody(properties: NavigationDrawerBodyProperties) {
    // Render the component
    return (
        <div className="-mx-3 flex flex-col space-y-0.5">
            {properties.navigationLinks.map(function (navigationLink, navigationLinkIndex) {
                return (
                    <NavigationLink
                        key={navigationLinkIndex}
                        href={navigationLink.href}
                        title={navigationLink.title}
                        icon={navigationLink.icon}
                        onClick={properties.closeDrawer}
                    />
                );
            })}
        </div>
    );
}
