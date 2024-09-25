'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useTheme } from '@structure/source/theme/ThemeProvider';
import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';
import KeyIcon from '@structure/assets/icons/security/KeyIcon.svg';
import CreditCardIcon from '@structure/assets/icons/finance/CreditCardIcon.svg';
import CommentIcon from '@structure/assets/icons/communication/CommentIcon.svg';
import ShippingBoxIcon from '@structure/assets/icons/commerce/ShippingBoxIcon.svg';
import ShippingBoxReturnIcon from '@structure/assets/icons/commerce/ShippingBoxReturnIcon.svg';
import TruckIcon from '@structure/assets/icons/transportation/TruckIcon.svg';
import StackCapsulesIcon from '@project/assets/icons/stack/StackCapsulesIcon.svg';
import HeadsetIcon from '@structure/assets/icons/communication/HeadsetIcon.svg';
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';
import BalanceScaleIcon from '@structure/assets/icons/tools/BalanceScaleIcon.svg';

// Define - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { slug } from '@structure/source/utilities/String';
import { getRainbowHexColorForTheme, lightenColor } from '@structure/source/utilities/Color';

const topics = [
    {
        icon: ShippingBoxIcon,
        title: 'Orders and Subscriptions',
        description: 'Cart issues, checkout problems, order submission errors',
        articleCount: 5,
    },
    {
        icon: CreditCardIcon,
        title: 'Payments and Billing',
        description: 'Payment failures, declined cards, billing errors, invoice requests',
        articleCount: 5,
    },
    {
        icon: TruckIcon,
        title: 'Shipping and Delivery',
        description: 'Shipping information, tracking orders, delivery delays, lost packages',
        articleCount: 5,
    },
    {
        icon: ShippingBoxReturnIcon,
        title: 'Returns, Refunds, and Exchanges',
        description: 'Return policies, starting a return, refund processing, exchanging items',
        articleCount: 5,
    },
    {
        icon: InformationCircledIcon,
        title: 'Product Information and Availability',
        description: 'Product details, stock availability, restocking dates',
        articleCount: 5,
    },
    {
        icon: StackCapsulesIcon,
        title: 'Stack',
        description: 'Ingredient details, health benefits, dietary restrictions',
        articleCount: 5,
    },
    {
        icon: UserIcon,
        title: 'Account Management',
        description: 'Sign in issues, resetting your password, managing your profile',
        articleCount: 5,
    },
    {
        icon: KeyIcon,
        title: 'Security',
        description: 'Reporting unauthorized access, vulnerabilities, best practices',
        articleCount: 5,
    },
    {
        icon: HeadsetIcon,
        title: 'Technical Support and Accessibility',
        description: 'Website glitches, app errors, accessibility support',
        articleCount: 5,
    },
    {
        icon: CommentIcon,
        title: 'Customer Feedback and Complaints',
        description: 'Report issues, give feedback, escalate complaints',
        articleCount: 5,
    },
    {
        icon: BalanceScaleIcon,
        title: 'Legal and Compliance Inquiries',
        description: 'Privacy policies, terms of service, data deletion requests',
        articleCount: 5,
    },
];

// Component - SupportPage
export function SupportPage() {
    // Hooks
    const { themeClassName } = useTheme();
    const { accountState } = useAccount();

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            {accountState.account?.isAdministator() && (
                <div className="float-end">
                    <Button
                        className="pl-3"
                        icon={PlusIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
                        href="/ideas/submit"
                    >
                        Create Topic
                    </Button>
                </div>
            )}

            <div className="">
                <Link href="/support">
                    <h1 className="mb-6 text-3xl font-medium">Support</h1>
                </Link>
                <p className="">How can we help?</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {topics.map(function (topic, index) {
                    const rainbowHexColorForTheme = getRainbowHexColorForTheme(index / topics.length, themeClassName);
                    const lightenedRainbowHexColorForTheme = lightenColor(
                        rainbowHexColorForTheme,
                        // Darken for dark theme, lighten for light theme
                        0.2 * (themeClassName === 'dark' ? -1 : 1),
                    );

                    return (
                        <Link
                            key={index}
                            href={'/support/' + slug(topic.title)}
                            className={mergeClassNames(
                                'flex flex-col rounded-lg border border-light-3 p-5 active:border-neutral+5 dark:border-dark-4 dark:active:border-neutral-5',
                                // 'hover:border-light-6 dark:hover:border-dark-6',
                            )}
                            // We have to use the event handlers to change the colors because of the way Tailwind CSS works
                            onMouseEnter={function (event) {
                                // Set the border color
                                event.currentTarget.style.borderColor = rainbowHexColorForTheme;
                            }}
                            onMouseLeave={function (event) {
                                // Unset the border color
                                event.currentTarget.style.borderColor = '';
                            }}
                            onMouseDown={function (event) {
                                event.currentTarget.style.borderColor = lightenedRainbowHexColorForTheme;
                            }}
                            onMouseUp={function (event) {
                                event.currentTarget.style.borderColor = rainbowHexColorForTheme;
                            }}
                        >
                            <topic.icon
                                className="neutral h-6 w-6"
                                style={{
                                    color: rainbowHexColorForTheme,
                                }}
                            />

                            <h2 className="mt-4 text-base">{topic.title}</h2>

                            <p className="mt-2 text-sm dark:text-light-6">{topic.description}</p>

                            <span className="flex-grow" />

                            <p className="neutral mt-5 align-bottom text-sm">{topic.articleCount} articles</p>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-12">
                <p className="mb-4">Need more help?</p>
                <Button size="lg" href="/contact">
                    Contact Us
                </Button>
            </div>
        </div>
    );
}

// Export - Default
export default SupportPage;
