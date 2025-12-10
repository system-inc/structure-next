// Dependencies - React and Next.js
import { notFound } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import {
    SupportPostTopicPage,
    SupportPostTopicPageProperties,
} from '@structure/source/modules/support/posts/pages/SupportPostTopicPage';
import { SupportPostPage } from '@structure/source/modules/support/posts/pages/SupportPostPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { PostDocument, PostTopicDocument, PostTopicQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { slugToTitleCase } from '@structure/source/utilities/type/String';

// Interface for route configuration
export interface SupportPathPageRouteConfiguration {
    topicIconMapping?: SupportPostTopicPageProperties['topicIconMapping'];
}

// Function to get server-side properties
export async function getSupportPathServerSideProperties(supportPath: string[]) {
    const serverSideNetworkService = await getServerSideNetworkService();

    // Valid paths:
    // Topics
    // /support/topic-slug
    // Posts (new format: slug-identifier combined)
    // /support/topic-slug-a/topic-slug-b/articles/post-slug-identifier
    // /support/articles/post-slug-identifier

    // The path is a post if it has 'articles' as second to last part or first part
    const isPost =
        (supportPath.length > 2 && supportPath[supportPath.length - 2] === 'articles') || supportPath[0] === 'articles';

    // Extract identifier from the end of the last path segment (e.g., "my-article-slug-abc123" -> "abc123")
    const lastSegment = supportPath[supportPath.length - 1] ?? '';
    const lastDashIndex = lastSegment.lastIndexOf('-');
    const postIdentifier = isPost && lastDashIndex > 0 ? lastSegment.substring(lastDashIndex + 1) : undefined;

    const postTopicSlug = isPost
        ? // If post, the topic is the third to last part of the path (before 'articles' and 'slug-identifier')
          supportPath[supportPath.length - 3]
        : // If not a post, the topic is the last part of the path
          supportPath[supportPath.length - 1];

    const parentPostTopicsSlugs = isPost
        ? // If post, the parent topics are the path minus the last 3 parts
          supportPath.slice(0, -3)
        : // If not a post, the parent topics are the path minus the last part
          supportPath.slice(0, -1);

    let post = null;
    let postTopic = null;
    const postTopicAndSubPostTopicsWithPosts: {
        postTopicTitle: string;
        postTopicSlug: string;
        posts: PostTopicQuery['postTopic']['pagedPosts']['items'];
    }[] = [];

    // Post
    if(postIdentifier) {
        const postRequest = await serverSideNetworkService.graphQlRequest(PostDocument, {
            identifier: postIdentifier,
        });

        // If the post is found
        if(postRequest?.post) {
            post = postRequest?.post;
        }
        // If the post is not found, return a 404
        else {
            return notFound();
        }
    }
    // PostTopic
    else {
        const postTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
            slug: postTopicSlug!,
            type: 'SupportArticle',
            pagination: {
                itemsPerPage: 100,
            },
        });

        // If the post topic is found
        if(postTopicData?.postTopic) {
            postTopic = postTopicData?.postTopic;

            // Add the general topic and its posts
            postTopicAndSubPostTopicsWithPosts.push({
                postTopicTitle: 'General',
                postTopicSlug: 'general',
                // Sort items by createdAt
                posts: postTopicData?.postTopic.pagedPosts.items.slice().sort(function (a, b) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }),
            });

            // Check if there are sub topics
            if(postTopicData?.postTopic?.subTopics?.length) {
                // If there are sub topics, get the posts for each one
                const subPostTopics = await Promise.all(
                    // Query for each sub topic and get the posts
                    postTopicData?.postTopic?.subTopics.map(async function (subTopic) {
                        const postSubTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
                            slug: subTopic.slug,
                            type: 'SupportArticle',
                            pagination: {
                                itemsPerPage: 100,
                            },
                        });

                        // If the sub topic is found
                        if(postSubTopicData) {
                            return postSubTopicData.postTopic;
                        }
                    }),
                );

                // Add the sub topics and their posts
                subPostTopics.forEach(function (subPostTopic) {
                    if(subPostTopic) {
                        postTopicAndSubPostTopicsWithPosts.push({
                            postTopicTitle: subPostTopic.topic.title,
                            postTopicSlug: subPostTopic.topic.slug,
                            posts: subPostTopic.pagedPosts.items.slice().sort(function (a, b) {
                                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                            }),
                        });
                    }
                });
            }
        }
        // If the post topic is not found, return a 404
        else {
            return notFound();
        }
    }

    // Return the properties
    return {
        postIdentifier: postIdentifier,
        postTopicSlug: postTopicSlug,
        parentPostTopicsSlugs: parentPostTopicsSlugs,
        post: post,
        postTopic: postTopic,
        postTopicAndSubPostTopicsWithPosts: postTopicAndSubPostTopicsWithPosts,
    };
}

// Metadata generator
export async function generateSupportPathPageMetadata(supportPath: string[]) {
    const serverSideProperties = await getSupportPathServerSideProperties(supportPath);

    let title = '';

    // Post
    if(serverSideProperties.postIdentifier && serverSideProperties.post) {
        title = serverSideProperties.post.title;
    }
    // PostTopic
    else if(serverSideProperties.postTopicSlug && serverSideProperties.postTopic) {
        title = serverSideProperties.postTopic.topic.title;

        // Add the parent topic titles
        if(serverSideProperties.parentPostTopicsSlugs) {
            serverSideProperties.parentPostTopicsSlugs.forEach(function (parentPostTopicSlug) {
                title += ' • ' + slugToTitleCase(parentPostTopicSlug);
            });
        }
    }

    title += ' • Support';

    return {
        title: title,
    };
}

// Route component
export interface SupportPathPageRouteProperties {
    className?: string;
    supportPath: string[];
    topicIconMapping?: SupportPostTopicPageProperties['topicIconMapping'];
}
export async function SupportPathPageRoute(properties: SupportPathPageRouteProperties) {
    const serverSideProperties = await getSupportPathServerSideProperties(properties.supportPath);

    // Post
    if(serverSideProperties.post) {
        return (
            <SupportPostPage
                className={properties.className}
                postTopicSlug={serverSideProperties.postTopicSlug}
                parentPostTopicsSlugs={serverSideProperties.parentPostTopicsSlugs}
                post={serverSideProperties.post}
            />
        );
    }
    // PostTopic
    else if(
        serverSideProperties.postTopic &&
        serverSideProperties.postTopicSlug &&
        serverSideProperties.parentPostTopicsSlugs
    ) {
        return (
            <SupportPostTopicPage
                className={properties.className}
                postTopicSlug={serverSideProperties.postTopicSlug}
                parentPostTopicsSlugs={serverSideProperties.parentPostTopicsSlugs}
                postTopic={serverSideProperties.postTopic}
                postTopicAndSubPostTopicsWithPosts={serverSideProperties.postTopicAndSubPostTopicsWithPosts}
                topicIconMapping={properties.topicIconMapping}
            />
        );
    }
}
