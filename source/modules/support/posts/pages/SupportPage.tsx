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
    basePath?: string;
    title?: string;
    heading?: string;
    description?: string;
    searchPlaceholder?: string;
    showNeedMoreHelp?: boolean;
}
export function SupportPage(properties: SupportPageProperties) {
    // Defaults
    const basePath = properties.basePath || '/support';
    const title = properties.title || 'Support';
    const heading = properties.heading || 'How can we help?';
    const description = properties.description || "Browse our articles or connect with our team—we're here to help!";
    const showNeedMoreHelp = properties.showNeedMoreHelp !== false;

    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            <h1 className="text-2xl font-medium">
                <Link href={basePath}>{title}</Link>
            </h1>
            <HorizontalRule className="mt-6 mb-12" />

            <h2 className="mb-4 text-center text-4xl">{heading}</h2>
            <p className="mb-6 text-center content--4">{description}</p>

            <SupportSearch
                className="mx-auto mb-16"
                placeholder={properties.searchPlaceholder}
                searchPath={basePath + '/search'}
            />

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
                            href={basePath + '/' + postTopic.slug}
                            title={postTopic.title}
                            description={postTopic.description}
                            postCount={postTopic.postCount}
                            icon={postTopicIcon}
                            rainbowPosition={postTopicIndex / properties.postTopics.length}
                        />
                    );
                })}
            </div>

            {showNeedMoreHelp && (
                <>
                    <HorizontalRule className="mt-20 mb-14" />
                    <SupportNeedMoreHelp />
                </>
            )}
        </div>
    );
}
