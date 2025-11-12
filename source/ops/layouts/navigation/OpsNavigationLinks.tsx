// Dependencies - Main Components
import { OpsNavigationLinkProperties } from './OpsNavigationLink';

// Dependencies - Account
import { AccountRole } from '@structure/source/modules/account/Account';

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

// Ops Navigation Links with role-based access control
// Note: Administrator role has implicit access to all links (checked in OpsNavigation.tsx)
export const OpsNavigationLinks: OpsNavigationLinkProperties[] = [
    // Home - Administrator only
    {
        title: 'Home',
        href: '/ops',
        icon: HomeIcon,
    },
    // Support - Support role
    {
        title: 'Support',
        href: '/ops/support',
        icon: SupportIcon,
        accessibleRoles: [AccountRole.Support],
    },
    // Orders - OrderViewer role
    {
        title: 'Orders',
        href: '/ops/orders',
        icon: BagIcon,
        accessibleRoles: [AccountRole.OrderViewer],
        links: [
            {
                title: 'Subscriptions',
                href: '/ops/orders/subscriptions',
                accessibleRoles: [AccountRole.OrderViewer],
                // icon: ArrowsClockwise,
            },
            {
                title: 'Drafts',
                href: '/ops/orders/drafts',
                accessibleRoles: [AccountRole.OrderViewer],
            },
            {
                title: 'Abandoned Checkouts',
                href: '/ops/orders/abandoned-checkouts',
                accessibleRoles: [AccountRole.OrderViewer],
            },
        ],
    },
    // Marketing - Marketer and SocialMediaManager roles
    {
        title: 'Marketing',
        href: '/ops/marketing',
        icon: NewsIcon,
        accessibleRoles: [AccountRole.Marketer, AccountRole.SocialMediaManager],
        links: [
            {
                title: 'Campaigns',
                href: '/ops/marketing/campaigns',
                accessibleRoles: [AccountRole.Marketer],
            },
            {
                title: 'Automations',
                href: '/ops/marketing/automations',
                accessibleRoles: [AccountRole.Marketer],
            },
            {
                title: 'Social Media',
                href: '/ops/marketing/social-media',
                accessibleRoles: [AccountRole.SocialMediaManager],
            },
        ],
    },
    // Users - Administrator only
    {
        title: 'Users',
        href: '/ops/users',
        icon: UsersIcon,
        links: [
            {
                title: 'Roles',
                href: '/ops/users/roles',
            },
            {
                title: 'Segments',
                href: '/ops/users/segments',
            },
            {
                title: 'Contact Lists',
                href: '/ops/users/contact-lists',
            },
        ],
    },
    // Communication - Marketer role
    {
        title: 'Communication',
        href: '/ops/communication',
        icon: MailIcon,
        accessibleRoles: [AccountRole.Marketer],
        links: [
            {
                title: 'Email Campaigns',
                href: '/ops/communication/email-campaigns',
                accessibleRoles: [AccountRole.Marketer],
            },
            {
                title: 'Email Lists',
                href: '/ops/communication/email-lists',
                accessibleRoles: [AccountRole.Marketer],
            },
        ],
    },

    // Fulfillment - FulfillmentManager role
    {
        title: 'Fulfillment',
        href: '/ops/fulfillment',
        icon: TruckIcon,
        accessibleRoles: [AccountRole.FulfillmentManager],
        links: [
            {
                title: 'Held Orders',
                href: '/ops/fulfillment/held-orders',
                accessibleRoles: [AccountRole.FulfillmentManager],
            },
            {
                title: 'Shipping Labels',
                href: '/ops/fulfillment/shipping-labels',
                accessibleRoles: [AccountRole.FulfillmentManager],
            },
            {
                title: 'Ship Orders',
                href: '/ops/fulfillment/ship-orders',
                accessibleRoles: [AccountRole.FulfillmentManager],
            },
        ],
    },
    // Inventory - FulfillmentManager role
    {
        title: 'Inventory',
        href: '/ops/inventory',
        icon: ShippingBoxIcon,
        accessibleRoles: [AccountRole.FulfillmentManager],
        links: [
            {
                title: 'Transfers',
                href: '/ops/inventory/transfers',
                accessibleRoles: [AccountRole.FulfillmentManager],
            },
        ],
    },
    // Products - ProductManager role
    {
        title: 'Products',
        href: '/ops/products',
        icon: TagIcon,
        accessibleRoles: [AccountRole.ProductManager],
        links: [
            {
                title: 'Reviews',
                href: '/ops/products/reviews',
                accessibleRoles: [AccountRole.Support, AccountRole.ProductManager],
            },
            {
                title: 'Categories',
                href: '/ops/products/categories',
                accessibleRoles: [AccountRole.ProductManager],
            },
            {
                title: 'Collections',
                href: '/ops/products/collections',
                accessibleRoles: [AccountRole.ProductManager],
            },
            {
                title: 'Gift Cards',
                href: '/ops/products/gift-cards',
                accessibleRoles: [AccountRole.ProductManager],
            },
        ],
    },
    // Content - Administrator only
    {
        title: 'Content',
        href: '/ops/content',
        icon: TextAlignLeftIcon,
        links: [
            {
                title: 'Files',
                href: '/ops/content/files',
            },
        ],
    },
    // Finances - Administrator only
    {
        title: 'Finances',
        href: '/ops/finances',
        icon: BankIcon,
        links: [
            {
                title: 'Payout',
                href: '/ops/finances/payout',
            },
        ],
    },
    // Analytics - Administrator only
    {
        title: 'Analytics',
        href: '/ops/analytics',
        icon: LineGraphIcon,
        links: [
            {
                title: 'Live',
                href: '/ops/analytics/live',
            },
            {
                title: 'Reports',
                href: '/ops/analytics/reports',
            },
        ],
    },
    // Discounts - Administrator only
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
    // Team - Administrator only
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
    // Developers - Administrator only
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
                title: 'Design',
                href: '/ops/developers/design',
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
    // Settings - Administrator only
    {
        title: 'Settings',
        href: '/ops/settings',
        icon: GearIcon,
    },
];
