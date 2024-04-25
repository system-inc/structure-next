// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InternalNavigationLinkInterface, InternalNavigationLink } from './InternalNavigationLink';

// Dependencies - Assets
import HomeIcon from '@structure/assets/icons/structures/HomeIcon.svg';
import TeamIcon from '@structure/assets/icons/people/TeamIcon.svg';
import EmailIcon from '@structure/assets/icons/communication/EmailIcon.svg';
import BagIcon from '@structure/assets/icons/commerce/BagIcon.svg';
import ShippingBoxIcon from '@structure/assets/icons/commerce/ShippingBoxIcon.svg';
import BeakerIcon from '@structure/assets/icons/science/BeakerIcon.svg';
import TruckIcon from '@structure/assets/icons/transportation/TruckIcon.svg';
import UsersIcon from '@structure/assets/icons/people/UsersIcon.svg';
import SupportIcon from '@structure/assets/icons/communication/SupportIcon.svg';
import TextAlignLeftIcon from '@structure/assets/icons/content/TextAlignLeftIcon.svg';
import BankIcon from '@structure/assets/icons/finance/BankIcon.svg';
import LineGraphIcon from '@structure/assets/icons/analytics/LineGraphIcon.svg';
import NewsIcon from '@structure/assets/icons/content/NewsIcon.svg';
import CoinsIcon from '@structure/assets/icons/finance/CoinsIcon.svg';
import GearIcon from '@structure/assets/icons/tools/GearIcon.svg';
import TagIcon from '@structure/assets/icons/commerce/TagIcon.svg';
import CodeIcon from '@structure/assets/icons/technology/CodeIcon.svg';

// TODO: This should use access control
// Internal Navigation Links
export const InternalNavigationLinks: InternalNavigationLinkInterface[] = [
    // Home
    {
        title: 'Home',
        href: '/internal',
        icon: HomeIcon,
    },
    // Team Group
    {
        title: 'Team',
        href: '/internal/team',
        icon: TeamIcon,
        links: [
            {
                title: 'Principles',
                href: '/internal/team/principles',
            },
            {
                title: 'Employees',
                href: '/internal/team/employees',
            },
            {
                title: 'Investors',
                href: '/internal/team/investors',
            },
        ],
    },
    // Communication Group
    {
        title: 'Communication',
        href: '/internal/communication',
        icon: EmailIcon,
        links: [
            {
                title: 'Email Campaigns',
                href: '/internal/communication/email-campaigns',
            },
            {
                title: 'Email Lists',
                href: '/internal/communication/email-lists',
            },
        ],
    },
    // Orders Group
    {
        title: 'Orders',
        href: '/internal/orders',
        icon: BagIcon,
        links: [
            {
                title: 'Drafts',
                href: '/internal/orders/drafts',
            },
            {
                title: 'Abandoned Checkouts',
                href: '/internal/orders/abandoned-checkouts',
            },
        ],
    },
    // Fulfillment Group
    {
        title: 'Fulfillment',
        href: '/internal/fulfillment',
        icon: TruckIcon,
        links: [
            {
                title: 'Held Orders',
                href: '/internal/fulfillment/held-orders',
            },
            {
                title: 'Shipping Labels',
                href: '/internal/fulfillment/shipping-labels',
            },
            {
                title: 'Ship Orders',
                href: '/internal/fulfillment/ship-orders',
            },
        ],
    },
    // Products Group
    {
        title: 'Products',
        href: '/internal/products',
        icon: TagIcon,
        links: [
            {
                title: 'Categories',
                href: '/internal/products/categories',
            },
            {
                title: 'Collections',
                href: '/internal/products/collections',
            },
            {
                title: 'Gift Cards',
                href: '/internal/products/gift-cards',
            },
        ],
    },
    // Inventory Group
    {
        title: 'Inventory',
        href: '/internal/inventory',
        icon: ShippingBoxIcon,
        links: [
            // Transfers Page
            {
                title: 'Transfers',
                href: '/internal/inventory/transfers',
            },
        ],
    },
    // Customers Group
    {
        title: 'Customers',
        href: '/internal/customers',
        icon: UsersIcon,
        links: [
            // Segments Page
            {
                title: 'Segments',
                href: '/internal/customers/segments',
            },
            // Wait Lists
            {
                title: 'Wait Lists',
                href: '/internal/customers/wait-lists',
            },
        ],
    },
    // Support Page
    {
        title: 'Support',
        href: '/internal/support',
        icon: SupportIcon,
    },
    // Content Group
    {
        title: 'Content',
        href: '/internal/content',
        icon: TextAlignLeftIcon,
        links: [
            // Files Page
            {
                title: 'Files',
                href: '/internal/content/files',
            },
        ],
    },
    // Finances Group
    {
        title: 'Finances',
        href: '/internal/finances',
        icon: BankIcon,
        links: [
            // Payout Page
            {
                title: 'Payout',
                href: '/internal/finances/payout',
            },
        ],
    },
    // Analytics Group
    {
        title: 'Analytics',
        href: '/internal/analytics',
        icon: LineGraphIcon,
        links: [
            // Live Page
            {
                title: 'Live',
                href: '/internal/analytics/live',
            },
            // Reports Page
            {
                title: 'Reports',
                href: '/internal/analytics/reports',
            },
        ],
    },
    // Marketing Group
    {
        title: 'Marketing',
        href: '/internal/marketing',
        icon: NewsIcon,
        links: [
            // Campaigns Page
            {
                title: 'Campaigns',
                href: '/internal/marketing/campaigns',
            },
            // Automations Page
            {
                title: 'Automations',
                href: '/internal/marketing/automations',
            },
        ],
    },
    // Discounts Group
    {
        title: 'Discounts',
        href: '/internal/discounts',
        icon: CoinsIcon,
        links: [
            {
                title: 'Vouchers',
                href: '/internal/discounts/vouchers',
            },
        ],
    },
    // Research Group
    {
        title: 'Research',
        href: '/internal/research',
        icon: BeakerIcon,
        links: [
            // Supplements Page
            {
                title: 'Supplements',
                href: '/internal/research/supplements',
            },
        ],
    },
    // Developers Group
    {
        title: 'Developers',
        href: '/internal/developers',
        icon: CodeIcon,
        links: [
            {
                title: 'Data',
                href: '/internal/developers/data',
            },
            {
                title: 'Metrics',
                href: '/internal/developers/metrics',
            },
            {
                title: 'Databases',
                href: '/internal/developers/databases',
            },
            {
                title: 'Object Storage',
                href: '/internal/developers/object-storage',
            },
            {
                title: 'Logs',
                href: '/internal/developers/logs',
            },
        ],
    },
    // Settings Page
    {
        title: 'Settings',
        href: '/internal/settings',
        icon: GearIcon,
    },
];

// Export - Default
export default InternalNavigationLinks;
