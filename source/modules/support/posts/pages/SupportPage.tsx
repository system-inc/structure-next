'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - API
import type { PostTopicsQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { SupportSearch } from '@structure/source/modules/support/posts/components/SupportSearch';
import { SupportTopicTile } from '@structure/source/modules/support/posts/components/SupportTopicTile';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SupportPage
export interface SupportPageProperties {
    className?: string;
    postTopics: PostTopicsQuery['postTopics'];
    topicIconMapping?: {
        [key: string]: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
    };
}
export function SupportPage(properties: SupportPageProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            <h1 className="text-2xl font-medium">
                <Link href="/support">Support</Link>
            </h1>
            <HorizontalRule className="mt-6 mb-12" />

            <h2 className="mb-4 text-center text-4xl">How can we help?</h2>
            <p className="mb-6 text-center content--4">
                Browse our articles or connect with our team—we&apos;re here to help!
            </p>

            <SupportSearch className="mx-auto mb-16" />

            {/* Post Topics */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {properties.postTopics.map(function (postTopic, postTopicIndex) {
                    const postTopicIcon =
                        properties.topicIconMapping && postTopic.id in properties.topicIconMapping
                            ? properties.topicIconMapping[postTopic.id]
                            : undefined;

                    return (
                        <SupportTopicTile
                            key={postTopicIndex}
                            href={'/support/' + postTopic.slug}
                            title={postTopic.title}
                            description={postTopic.description}
                            postCount={postTopic.postCount}
                            icon={postTopicIcon}
                            rainbowPosition={postTopicIndex / properties.postTopics.length}
                        />
                    );
                })}
            </div>

            <HorizontalRule className="mt-20 mb-14" />

            <SupportNeedMoreHelp />
        </div>
    );
}
