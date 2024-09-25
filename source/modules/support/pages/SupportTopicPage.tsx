'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { Button } from '@structure/source/common/buttons/Button';
import { NavigationTrail } from '@structure/source/common/navigation/NavigationTrail';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';
import ShippingBoxIcon from '@structure/assets/icons/commerce/ShippingBoxIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Define - Utilities
import { slug } from '@structure/source/utilities/String';

interface Article {
    title: string;
    description?: string;
    topic?: string;
}

interface GroupedArticles {
    [key: string]: Article[];
}

const articles: Article[] = [
    {
        title: 'How do I track my order?',
        description: 'Find out how to track your order and get the latest updates on your delivery.',
    },
    {
        title: 'How do I return an item?',
        description: 'Learn how to start a return and get a refund or exchange for your item.',
    },
    {
        title: 'What should I do if my order is missing?',
        // description: 'Discover what to do if your order is missing or if you received the wrong item.',
    },
    {
        title: 'How do I cancel my subscription?',
        // description: 'Find out how to cancel your subscription and stop receiving automatic orders.',
    },
    {
        title: 'How do I update my payment information?',
        // description: 'Learn how to update your payment information and avoid payment issues.',
    },
    {
        title: 'How do I change my shipping address?',
        // description: 'Discover how to change your shipping address and update your delivery details.',
        topic: 'Addresses',
    },
    {
        title: 'How do I change my billing address?',
        description: 'Find out how to change your billing address and update your payment details.',
        topic: 'Addresses',
    },
    {
        title: 'How do I change my subscription plan?',
        // description: 'Learn how to change your subscription plan and get the right products for you.',
        topic: 'Subscriptions',
    },
    {
        title: 'How do I change my subscription frequency?',
        // description: 'Discover how to change your subscription frequency and get products when you need them.',
        topic: 'Subscriptions',
    },
    {
        title: 'How do I change my subscription products?',
        // description: 'Find out how to change your subscription products and get the right items for you.',
        topic: 'Subscriptions',
    },
    {
        title: 'How do I change my subscription delivery date?',
        // description: 'Learn how to change your subscription delivery date and get products when you need them.',
        topic: 'Subscriptions',
    },
];

// Group articles by topic
const groupedArticles: GroupedArticles = articles.reduce<GroupedArticles>(function (accumulator, article) {
    // Default topic is 'General'
    const topic = article.topic || 'General';

    // Initialize the topic array if it doesn't exist
    if(!accumulator[topic]) {
        accumulator[topic] = [];
    }

    // Add the article to the topic array
    accumulator[topic].push(article);

    // Return the accumulator
    return accumulator;
}, {});

// Component - SupportPage
export function SupportPage() {
    // Hooks
    const { accountState } = useAccount();

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            {accountState.account?.isAdministator() && (
                <div className="float-end flex space-x-2">
                    <Button
                        className="pl-3"
                        icon={EditIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
                        href="/ideas/submit"
                    >
                        Edit Topic
                    </Button>
                    <Button
                        className="pl-3"
                        icon={PlusIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
                        href="/ideas/submit"
                    >
                        Create Article
                    </Button>
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" />

                <Link href={'/support'}>
                    <h1 className="mb-4 flex items-center space-x-3 text-3xl font-medium">
                        <ShippingBoxIcon className="h-8 w-8" />
                        <span>Orders and Subscriptions</span>
                    </h1>
                </Link>

                <p className="neutral">Cart issues, checkout problems, order submission errors</p>
            </div>

            <div className="flex flex-col space-y-16">
                {Object.keys(groupedArticles).map(function (topic, topicIndex) {
                    return (
                        <div key={topicIndex}>
                            <h2 className="mb-8 text-2xl font-semibold">{topic}</h2>
                            <div className="">
                                {groupedArticles[topic]?.map(function (article, articleIndex) {
                                    return (
                                        <div key={articleIndex} className="mb-4">
                                            <Link
                                                className="-mx-3.5 -my-3 flex items-center justify-between rounded-md px-3.5 py-3 transition-colors hover:bg-dark-2"
                                                href={`/support/${slug(article.title)}`}
                                            >
                                                <span>
                                                    <h3 className="text-base font-medium">{article.title}</h3>
                                                    <p className="neutral text-sm">{article.description}</p>
                                                </span>
                                                <ChevronRightIcon className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-20">
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
