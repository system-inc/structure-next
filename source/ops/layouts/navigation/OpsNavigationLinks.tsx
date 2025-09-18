// Dependencies - Main Components
import { OpsNavigationLinkProperties } from './OpsNavigationLink';

// Dependencies - Assets
import HomeIcon from '@structure/assets/icons/structures/HomeIcon.svg';
import TeamIcon from '@structure/assets/icons/people/TeamIcon.svg';
import MailIcon from '@structure/assets/icons/communication/MailIcon.svg';
import BagIcon from '@structure/assets/icons/commerce/BagIcon.svg';
import ShippingBoxIcon from '@structure/assets/icons/commerce/ShippingBoxIcon.svg';
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
export const OpsNavigationLinks: OpsNavigationLinkProperties[] = [
    // Home
    {
        title: 'Home',
        href: '/ops',
        icon: HomeIcon,
    },
    // Team Group
    {
        title: 'Team',
        href: '/ops/team',
        icon: TeamIcon,
        links: [
            {
                title: 'Employees',
                href: '/ops/team/employees',
            },
            {
                title: 'Investors',
                href: '/ops/team/investors',
            },
        ],
    },
    // Communication Group
    {
        title: 'Communication',
        href: '/ops/communication',
        icon: MailIcon,
        links: [
            {
                title: 'Email Campaigns',
                href: '/ops/communication/email-campaigns',
            },
            {
                title: 'Email Lists',
                href: '/ops/communication/email-lists',
            },
        ],
    },
    // Orders Group
    {
        title: 'Orders',
        href: '/ops/orders',
        icon: BagIcon,
        links: [
            {
                title: 'Drafts',
                href: '/ops/orders/drafts',
            },
            {
                title: 'Abandoned Checkouts',
                href: '/ops/orders/abandoned-checkouts',
            },
        ],
    },
    // Fulfillment Group
    {
        title: 'Fulfillment',
        href: '/ops/fulfillment',
        icon: TruckIcon,
        links: [
            {
                title: 'Held Orders',
                href: '/ops/fulfillment/held-orders',
            },
            {
                title: 'Shipping Labels',
                href: '/ops/fulfillment/shipping-labels',
            },
            {
                title: 'Ship Orders',
                href: '/ops/fulfillment/ship-orders',
            },
        ],
    },
    // Products Group
    {
        title: 'Products',
        href: '/ops/products',
        icon: TagIcon,
        links: [
            {
                title: 'Reviews',
                href: '/ops/products/reviews',
            },
            {
                title: 'Categories',
                href: '/ops/products/categories',
            },
            {
                title: 'Collections',
                href: '/ops/products/collections',
            },
            {
                title: 'Gift Cards',
                href: '/ops/products/gift-cards',
            },
        ],
    },
    // Inventory Group
    {
        title: 'Inventory',
        href: '/ops/inventory',
        icon: ShippingBoxIcon,
        links: [
            // Transfers Page
            {
                title: 'Transfers',
                href: '/ops/inventory/transfers',
            },
        ],
    },
    // Users Group
    {
        title: 'Users',
        href: '/ops/users',
        icon: UsersIcon,
        links: [
            // Roles Page
            {
                title: 'Roles',
                href: '/ops/users/roles',
            },
            // Segments Page
            {
                title: 'Segments',
                href: '/ops/users/segments',
            },
            // Contact Lists
            {
                title: 'Contact Lists',
                href: '/ops/users/contact-lists',
            },
        ],
    },
    // Support Page
    {
        title: 'Support',
        href: '/ops/support',
        icon: SupportIcon,
    },
    // Content Group
    {
        title: 'Content',
        href: '/ops/content',
        icon: TextAlignLeftIcon,
        links: [
            // Files Page
            {
                title: 'Files',
                href: '/ops/content/files',
            },
        ],
    },
    // Finances Group
    {
        title: 'Finances',
        href: '/ops/finances',
        icon: BankIcon,
        links: [
            // Payout Page
            {
                title: 'Payout',
                href: '/ops/finances/payout',
            },
        ],
    },
    // Analytics Group
    {
        title: 'Analytics',
        href: '/ops/analytics',
        icon: LineGraphIcon,
        links: [
            // Live Page
            {
                title: 'Live',
                href: '/ops/analytics/live',
            },
            // Reports Page
            {
                title: 'Reports',
                href: '/ops/analytics/reports',
            },
        ],
    },
    // Marketing Group
    {
        title: 'Marketing',
        href: '/ops/marketing',
        icon: NewsIcon,
        links: [
            // Campaigns Page
            {
                title: 'Campaigns',
                href: '/ops/marketing/campaigns',
            },
            // Automations Page
            {
                title: 'Automations',
                href: '/ops/marketing/automations',
            },
            // Social Media Page
            {
                title: 'Social Media',
                href: '/ops/marketing/social-media',
            },
        ],
    },
    // Discounts Group
    {
        title: 'Discounts',
        href: '/ops/discounts',
        icon: CoinsIcon,
        links: [
            {
                title: 'Vouchers',
                href: '/ops/discounts/vouchers',
            },
        ],
    },
    // Developers Group
    {
        title: 'Developers',
        href: '/ops/developers',
        icon: CodeIcon,
        links: [
            {
                title: 'Data',
                href: '/ops/developers/data',
            },
            {
                title: 'Metrics',
                href: '/ops/developers/metrics',
            },
            {
                title: 'Databases',
                href: '/ops/developers/databases',
            },
            {
                title: 'Object Storage',
                href: '/ops/developers/object-storage',
            },
            {
                title: 'Logs',
                href: '/ops/developers/logs',
            },
            {
                title: 'Web Sockets',
                href: '/ops/developers/web-sockets',
            },
        ],
    },
    // Settings Page
    {
        title: 'Settings',
        href: '/ops/settings',
        icon: GearIcon,
    },
];
