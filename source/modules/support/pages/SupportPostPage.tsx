'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { NavigationTrail } from '@structure/source/common/navigation/NavigationTrail';
import { SupportFeedback } from '@structure/source/modules/support/SupportFeedback';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Define - Utilities
import { slug } from '@structure/source/utilities/String';

// Component - SupportPostPage
export interface SupportPostPageInterface {
    params: {
        supportPath: string[];
    };
}
export function SupportPostPage(properties: SupportPostPageInterface) {
    // Hooks
    const { accountState } = useAccount();

    const supportPath = properties.params.supportPath.join('/');

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
                        Edit Post
                    </Button>
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" />

                <Link href={'/support/' + supportPath} className="">
                    <h1 className="mb-4 flex items-center space-x-3 text-3xl font-medium">
                        <span>How do I track my order?</span>
                    </h1>
                </Link>

                <p className="neutral mb-8 text-sm">Updated over a week ago</p>

                <p className="mb-4">This is a support post page.</p>
            </div>

            <hr className="my-16" />

            <SupportFeedback className="flex justify-center text-center" />

            <hr className="my-16" />

            <div className="flex justify-center">
                <div>
                    <p className="mb-4">Need more help?</p>
                    <Button size="lg" href="/contact">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default SupportPostPage;
