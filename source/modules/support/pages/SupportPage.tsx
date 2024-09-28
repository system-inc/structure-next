'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { useTheme } from '@structure/source/theme/ThemeProvider';
// import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
// import { useQuery } from '@apollo/client';
import { PostTopicsQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
// import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
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
import { getRainbowHexColorForTheme, lightenColor } from '@structure/source/utilities/Color';

export const postTopicIdentifierToIconObject: {
    [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
    '989becc3-d0e5-4df3-ae8d-b25401a0729b': ShippingBoxIcon,
    'b58b1475-e267-4623-9728-c91dd708486a': CreditCardIcon,
    '1c02e619-bea2-494d-aa54-1cc7adcd24f1': TruckIcon,
    '23c1e599-9b6b-4290-a1e9-b0b33dde3749': ShippingBoxReturnIcon,
    'b4f66159-ab0f-440d-bfc5-bc3f1880489e': InformationCircledIcon,
    '93093206-2cce-40ef-b54f-2d7c68b44d90': StackCapsulesIcon,
    '372b47f5-5bfd-47d5-98e9-d8ebf6b1b8d4': UserIcon,
    '79ace0b4-2bd3-436f-bd3c-4c506da36beb': KeyIcon,
    '94fc5ac4-fb6c-464f-97d6-c383e8991c90': HeadsetIcon,
    '1291d978-46e0-445f-a03a-7f110029a3dd': CommentIcon,
    '27ca535c-33a3-42b1-9628-201427d1cb23': BalanceScaleIcon,
};

// Component - SupportPage
export interface SupportPageInterface {
    postTopics: PostTopicsQuery['postTopics'];
}
export function SupportPage(properties: SupportPageInterface) {
    // Hooks
    const { themeClassName } = useTheme();
    // const { accountState } = useAccount();

    // Hooks - API
    // const postTopicsQueryState = useQuery(PostTopicsDocument, {
    //     variables: {
    //         ids: postTopics.map(function (postTopic) {
    //             return postTopic.id;
    //         }),
    //     },
    // });

    const postTopics = properties.postTopics;

    // Render the component
    return (
        <div className="container pb-32 pt-8">
            {/* {accountState.account?.isAdministator() && (
                <div className="float-end">
                    <Button
                        className="pl-3"
                        icon={PlusIcon}
                        iconPosition="left"
                        iconClassName="w-3 h-3"
                        href="/support/create-topic"
                    >
                        Create Topic
                    </Button>
                </div>
            )} */}

            <div className="">
                <Link href="/support">
                    <h1 className="mb-6 text-3xl font-medium">Support</h1>
                </Link>
                <p className="">How can we help?</p>
            </div>

            {/* Post Topics */}
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Data Loaded */}
                {postTopics.map(function (postTopic, postTopicIndex) {
                    // const PostTopicIcon = postTopics.find(function (currentPostTopic) {
                    //     return currentPostTopic.id === postTopic.id;
                    // })?.icon;

                    const PostTopicIcon =
                        postTopic.id in postTopicIdentifierToIconObject
                            ? postTopicIdentifierToIconObject[postTopic.id]
                            : undefined;

                    const rainbowHexColorForTheme = getRainbowHexColorForTheme(
                        postTopicIndex / postTopics.length,
                        themeClassName,
                    );
                    const lightenedRainbowHexColorForTheme = lightenColor(
                        rainbowHexColorForTheme,
                        // Darken for dark theme, lighten for light theme
                        0.2 * (themeClassName === 'dark' ? -1 : 1),
                    );

                    return (
                        <Link
                            key={postTopicIndex}
                            href={'/support/' + postTopic.slug}
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
                            {PostTopicIcon && (
                                <PostTopicIcon
                                    className="neutral h-6 w-6"
                                    style={{
                                        color: rainbowHexColorForTheme,
                                    }}
                                />
                            )}

                            <h2 className="mt-4 text-base">{postTopic.title}</h2>

                            <p className="mt-2 text-sm dark:text-light-6">{postTopic.description}</p>

                            <span className="flex-grow" />

                            <p className="neutral mt-5 align-bottom text-sm">{postTopic.postCount} articles</p>
                        </Link>
                    );
                })}
            </div>

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
export default SupportPage;
