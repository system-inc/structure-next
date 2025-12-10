'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { Theme } from '@structure/source/theme/ThemeTypes';

// Dependencies - API
import type { PostTopicsQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Hooks
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { SupportSearch } from '@structure/source/modules/support/posts/components/SupportSearch';

// Dependencies - Assets
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { getRainbowHexColorForTheme, lightenColor } from '@structure/source/utilities/style/Color';

// Component - SupportPage
export interface SupportPageProperties {
    className?: string;
    postTopics: PostTopicsQuery['postTopics'];
    topicIconMapping?: {
        [key: string]: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
    };
}
export function SupportPage(properties: SupportPageProperties) {
    // Hooks
    const themeSettings = useThemeSettings();

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

                    const rainbowHexColorForTheme = getRainbowHexColorForTheme(
                        postTopicIndex / properties.postTopics.length,
                        themeSettings.theme,
                    );
                    const lightenedRainbowHexColorForTheme = lightenColor(
                        rainbowHexColorForTheme,
                        // Darken for dark theme, lighten for light theme
                        0.2 * (themeSettings.theme === Theme.Light ? -1 : 1),
                    );

                    return (
                        <Link
                            key={postTopicIndex}
                            href={'/support/' + postTopic.slug}
                            className={mergeClassNames(
                                'flex flex-col rounded-2xl border border--3 p-5 active:border--4',
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
                            {postTopicIcon &&
                                React.cloneElement(postTopicIcon, {
                                    className: 'h-6 w-6',
                                    style: { color: rainbowHexColorForTheme },
                                })}

                            <h2 className="mt-4 text-base">{postTopic.title}</h2>

                            <p className="mt-2 text-sm">{postTopic.description}</p>

                            <span className="grow" />

                            <p className="mt-5 align-bottom text-sm content--4">{postTopic.postCount} articles</p>
                        </Link>
                    );
                })}
            </div>

            <HorizontalRule className="mt-20 mb-14" />

            <SupportNeedMoreHelp />
        </div>
    );
}
