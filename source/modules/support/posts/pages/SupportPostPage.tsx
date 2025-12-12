'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Button } from '@structure/source/components/buttons/Button';
import { Accordion } from '@structure/source/components/containers/Accordion';
import { Feedback } from '@structure/source/modules/feedback/components/Feedback';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';
import { Markdown } from '@structure/source/components/markdown/Markdown';
import { NavigationTrail } from '@structure/source/components/navigation/trail/NavigationTrail';
import { SupportNeedMoreHelp } from '@structure/source/modules/support/posts/components/SupportNeedMoreHelp';

// Dependencies - Assets
import { PencilIcon } from '@phosphor-icons/react/dist/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { timeFromNow } from '@structure/source/utilities/time/Time';

// Interface - FAQ Item
interface FaqItem {
    question: string;
    answer: string;
}

// Interface - Parsed Content
interface ParsedContent {
    mainContent: string;
    faqTitle: string | null;
    faqItems: FaqItem[];
    afterFaqContent: string | null;
}

// Function to parse FAQ section from markdown content
function parseFaqFromContent(content: string): ParsedContent {
    // Match the FAQ section header (## Frequently Asked Questions...)
    const faqHeaderRegex = /^## Frequently Asked Questions.*$/im;
    const faqHeaderMatch = content.match(faqHeaderRegex);

    // If no FAQ section found, return the content as-is
    if(!faqHeaderMatch || faqHeaderMatch.index === undefined) {
        return {
            mainContent: content,
            faqTitle: null,
            faqItems: [],
            afterFaqContent: null,
        };
    }

    // Split content into main content and FAQ section
    const mainContent = content.substring(0, faqHeaderMatch.index).trim();
    const faqSection = content.substring(faqHeaderMatch.index);

    // Extract the FAQ title
    const faqTitle = faqHeaderMatch[0].replace('## ', '');

    // Parse individual FAQ items (### Question followed by answer paragraphs)
    const faqItems: FaqItem[] = [];
    const questionRegex = /^### (.+)$/gm;
    let match: RegExpExecArray | null;
    const questionMatches: { question: string; index: number }[] = [];

    while((match = questionRegex.exec(faqSection)) !== null) {
        const question = match[1];
        if(question) {
            questionMatches.push({
                question: question,
                index: match.index,
            });
        }
    }

    // Find where the FAQ section ends (at the next ## heading or end of content)
    const faqEndRegex = /^## (?!Frequently Asked Questions)/m;
    const faqEndMatch = faqSection.substring(faqHeaderMatch[0].length).match(faqEndRegex);
    const faqEndIndex = faqEndMatch?.index ? faqHeaderMatch[0].length + faqEndMatch.index : faqSection.length;

    // Content after the FAQ section (like Sources)
    const afterFaqContent = faqSection.substring(faqEndIndex).trim();

    // Extract answers for each question
    for(let i = 0; i < questionMatches.length; i++) {
        const currentQuestion = questionMatches[i];
        const nextQuestion = questionMatches[i + 1];

        // Skip if current question is undefined (shouldn't happen due to filter above, but TypeScript needs assurance)
        if(!currentQuestion) {
            continue;
        }

        // Get the content between this question and the next (or end of FAQ section)
        const questionLineEnd = faqSection.indexOf('\n', currentQuestion.index);
        const answerStart = questionLineEnd + 1;
        // Stop at the next question, or the end of the FAQ section (not end of content)
        const answerEnd = nextQuestion ? nextQuestion.index : faqEndIndex;
        const answer = faqSection.substring(answerStart, answerEnd).trim();

        if(currentQuestion.question && answer) {
            faqItems.push({
                question: currentQuestion.question,
                answer: answer,
            });
        }
    }

    return {
        mainContent,
        faqTitle,
        faqItems,
        afterFaqContent: afterFaqContent || null,
    };
}

// Component - SupportPostPage
export interface SupportPostPageProperties {
    className?: string;
    postTopicSlug?: string;
    parentPostTopicsSlugs?: string[];
    basePath?: string;
    showNeedMoreHelp?: boolean;
    post: {
        identifier: string;
        slug: string;
        status: string;
        title: string;
        description?: string | null;
        content?: string | null;
        updatedAt: string | Date;
        createdAt: string | Date;
    };
}
export function SupportPostPage(properties: SupportPostPageProperties) {
    // console.log('SupportPostPage', properties);

    // Hooks
    const account = useAccount();

    // Defaults
    const basePath = properties.basePath ?? '/support';

    // The URL pathname for the navigation trail
    let navigationTrailUrlPathname = basePath;
    if(properties.parentPostTopicsSlugs) {
        navigationTrailUrlPathname += properties.parentPostTopicsSlugs.length
            ? '/' + properties.parentPostTopicsSlugs.join('/')
            : '';
    }
    if(properties.postTopicSlug) {
        navigationTrailUrlPathname += '/' + properties.postTopicSlug;
    }

    const postHref =
        navigationTrailUrlPathname + '/articles/' + properties.post.slug + '-' + properties.post.identifier;

    const updateAtTimeInMilliseconds = new Date(properties.post.updatedAt).getTime();
    let updatedTimeAgoString = timeFromNow(updateAtTimeInMilliseconds);

    // If it has been over a week
    if(updateAtTimeInMilliseconds < new Date().getTime() - 1000 * 60 * 60 * 24 * 7) {
        updatedTimeAgoString = 'over a week ago';
    }

    // Parse the content to extract FAQ section
    const parsedContent = properties.post.content ? parseFaqFromContent(properties.post.content) : null;

    // Render the component
    return (
        <div className={mergeClassNames('container', properties.className)}>
            {account.data?.isAdministrator() && (
                <div className="float-end">
                    <Button
                        variant="Ghost"
                        size="Icon"
                        icon={PencilIcon}
                        href={
                            basePath +
                            '/posts/' +
                            properties.post.identifier +
                            '/edit?postTopicSlug=' +
                            (properties.postTopicSlug ?? '')
                        }
                    />
                </div>
            )}

            <div className="mb-12">
                <NavigationTrail className="mb-8" urlPath={navigationTrailUrlPathname} />

                <div className="mb-4 max-w-2xl">
                    <Link href={postHref} className="">
                        <h1 className="inline text-3xl leading-10 font-medium">{properties.post.title}</h1>
                    </Link>
                </div>

                <p className="mb-8 text-sm content--1">Updated {updatedTimeAgoString}</p>

                {/* Main Post Content in Markdown (without FAQ) */}
                {parsedContent?.mainContent && (
                    <Markdown className="mb-4 max-w-2xl">{parsedContent.mainContent}</Markdown>
                )}

                {/* FAQ Section with Accordion */}
                {parsedContent && parsedContent.faqItems.length > 0 && (
                    <div className="mt-12 max-w-2xl">
                        <h2 className="mb-6 text-2xl font-medium">{parsedContent.faqTitle}</h2>
                        <Accordion
                            items={parsedContent.faqItems.map(function (faqItem, index) {
                                return {
                                    identifier: `faq-${index}`,
                                    title: faqItem.question,
                                    content: <Markdown>{faqItem.answer}</Markdown>,
                                };
                            })}
                        />
                    </div>
                )}

                {/* Content after FAQ (like Sources) */}
                {parsedContent?.afterFaqContent && (
                    <Markdown className="mt-12 max-w-2xl">{parsedContent.afterFaqContent}</Markdown>
                )}
            </div>

            <HorizontalRule className="my-16" />

            <Feedback className="flex justify-center text-center" />

            {properties.showNeedMoreHelp !== false && (
                <>
                    <HorizontalRule className="my-16" />

                    <SupportNeedMoreHelp />
                </>
            )}
        </div>
    );
}
