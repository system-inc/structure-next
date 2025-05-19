'use client';

// Dependencies - React and Next.js
import React from 'react';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import { InternalNavigationLinks } from '@structure/source/internal/layouts/navigation/InternalNavigationLinks';

interface NavigationMetadata {
    title: string;
    icon: React.ComponentType<{ className?: string }> | undefined;
}
export function useInternalNavigationMetadata(): NavigationMetadata {
    const pathname = usePathname();

    function getNavigationMetadata() {
        for (const menuItem of InternalNavigationLinks) {
            const icon = menuItem.icon;
            if (menuItem.href === pathname) {
                return { title: menuItem.title, icon };
            }

            if (menuItem.links) {
                for (const subLink of menuItem.links) {
                    if (subLink.href === pathname) {
                        return { title: subLink.title, icon }; // use menuItem icon for children
                    }
                }
            }
        }

        return { title: '', icon: undefined };
    }

    return getNavigationMetadata();
}