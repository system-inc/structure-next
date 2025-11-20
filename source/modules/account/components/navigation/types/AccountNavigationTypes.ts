import { type Icon } from '@phosphor-icons/react';

// Interface - AccountNavigationLinkInterface
export interface AccountNavigationLinkInterface {
    role: 'Administrator' | 'Any';
    showOn: 'Popover' | 'Drawer' | 'Account' | 'All';
    href: string;
    title: string;
    icon: Icon;
}

// Type - AccountNavigationDisplayContext
export type AccountNavigationDisplayContext = 'Account' | 'Popover' | 'Drawer';

// Type - AccountNavigationFilterFunction
export type AccountNavigationFilterFunction = (
    link: AccountNavigationLinkInterface,
    displayContext: AccountNavigationDisplayContext,
    urlPath: string | null,
    isAdministrator: boolean,
    isSignedIn: boolean,
) => boolean;
