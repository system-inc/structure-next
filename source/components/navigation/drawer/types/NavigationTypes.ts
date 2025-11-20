// Dependencies - Types
import { type Icon } from '@phosphor-icons/react';

// Type - NavigationLinkType
export type NavigationLinkType = {
    type: 'link';
    href: string;
    title: string;
    icon: Icon;
};

// Type - NavigationGroupType
export type NavigationGroupType = {
    type: 'group';
    title: string;
    links: (Omit<NavigationLinkType, 'icon'> & { icon?: Icon })[];
    icon: Icon;
};

// Type - NavigationItemType
export type NavigationItemType = NavigationLinkType | NavigationGroupType;
