'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
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
    // Render the component
    return (
        <div className="container pb-32 pt-8">
            <div className="">
                <h1 className="mb-6 text-3xl font-medium">Support</h1>

                <p className="">How can we help?</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {topics.map(function (topic, index) {
                    return (
                        <Link
                            key={index}
                            href="/support/account"
                            className="flex flex-col rounded-lg border border-light-3 p-5 hover:border-light-6 active:border-neutral+5 dark:border-dark-4 dark:hover:border-dark-6 dark:active:border-neutral-5"
                        >
                            <topic.icon className="neutral h-6 w-6" />

                            <h2 className="mt-4 text-base">{topic.title}</h2>

                            <p className="mt-2 text-sm dark:text-light-6">{topic.description}</p>

                            <div className="flex-grow" />

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
