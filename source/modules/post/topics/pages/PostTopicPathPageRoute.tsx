// Dependencies - React and Next.js
import { notFound, permanentRedirect } from '@structure/source/router/Navigation';

// Dependencies - Utilities
import { parsePostUrl } from '@structure/source/modules/post/utilities/PostUrl';

// Dependencies - Main Components
import { PostTopicPage, PostTopicPageProperties } from '@structure/source/modules/post/topics/pages/PostTopicPage';
import { PostPage } from '@structure/source/modules/post/pages/PostPage';

// Dependencies - API
import { getServerSideNetworkService } from '@structure/source/services/network/NetworkServiceServerSide';
import { PostDocument, PostTopicDocument, PostTopicQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { slugToTitleCase } from '@structure/source/utilities/type/String';

// Function to sort items by linked list order (using previousSiblingId/nextSiblingId)
function sortByLinkedListOrder<
    T extends { id: string; previousSiblingId?: string | null; nextSiblingId?: string | null },
>(items: T[]): T[] {
    if(items.length === 0) return [];

    // Find the first item (one with no previousSiblingId)
    const firstItem = items.find(function (item) {
        return !item.previousSiblingId;
    });

    if(!firstItem) return items; // Fallback to original order if no head found

    // Build the sorted array by following nextSiblingId
    const sorted: T[] = [firstItem];
    const itemMap = new Map(
        items.map(function (item) {
            return [item.id, item];
        }),
    );

    let current = firstItem;
    while(current.nextSiblingId) {
        const next = itemMap.get(current.nextSiblingId);
        if(!next) break;
        sorted.push(next);
        current = next;
    }

    return sorted;
}

// Interface for route configuration
export interface PostTopicPathPageRouteConfiguration {
    topicIconMapping?: PostTopicPageProperties['topicIconMapping'];
}

// Function to get server-side properties
export async function getPostTopicPathServerSideProperties(postPath: string[], basePath: string, postType: string) {
    const serverSideNetworkService = await getServerSideNetworkService();

    // Redirect old URL format with /articles/ segment to new flat URL format
    // Old: /library/topic/articles/slug-identifier
    // New: /library/slug-identifier
    const articlesIndex = postPath.indexOf('articles');
    if(articlesIndex !== -1 && articlesIndex < postPath.length - 1) {
        const articleSlugWithIdentifier = postPath[articlesIndex + 1];
        const redirectBasePath = basePath ?? '/' + postPath.slice(0, articlesIndex).join('/');
        permanentRedirect(`${redirectBasePath}/${articleSlugWithIdentifier}`);
    }

    // Valid paths (new format):
    // Topics: /[basePath]/topic-slug or /[basePath]/topic-a/topic-b (can be nested)
    // Posts: /[basePath]/slug-identifier (always flat - single segment only)

    let post = null;
    let postTopic = null;
    let parsedPost: { slug: string; identifier: string } | null = null;
    const postTopicAndSubPostTopicsWithPosts: {
        postTopicId?: string;
        postTopicTitle: string;
        postTopicSlug: string;
        postTopicDescription?: string | null;
        posts: PostTopicQuery['postTopic']['pagedPosts']['items'];
    }[] = [];

    // Posts are always flat URLs - the postPath includes the basePath segment (e.g., 'library')
    // so a post URL like /library/slug-id has postPath = ['library', 'slug-id'] (2 segments)
    // Nested topic paths like /library/topic/subtopic have 3+ segments and are never posts
    const isFlat = postPath.length === 2;
    const lastSegment = postPath[postPath.length - 1] ?? '';

    // Only check for post if it's a flat URL that looks like a post URL
    if(isFlat) {
        parsedPost = parsePostUrl(lastSegment);

        if(parsedPost) {
            try {
                const postRequest = await serverSideNetworkService.graphQlRequest(PostDocument, {
                    identifier: parsedPost.identifier,
                });

                // If the post is found
                if(postRequest?.post) {
                    post = postRequest?.post;
                }
            } catch {
                // Post lookup failed - will fall through to topic lookup below
                console.log('[PostTopicPathPageRoute] Post lookup failed, trying topic:', parsedPost.identifier);
            }

            // If we found a post, check for slug mismatch redirect
            // NOTE: This must be outside the try/catch because permanentRedirect() throws
            // a special error that Next.js catches to perform the redirect
            if(post && parsedPost.slug !== post.slug) {
                const canonicalPath = basePath
                    ? `${basePath}/${post.slug}-${post.identifier}`
                    : `/${post.slug}-${post.identifier}`;
                permanentRedirect(canonicalPath);
            }
        }
    }

    // Topic lookup - either nested path, or single segment that wasn't a valid post
    if(!post) {
        const postTopicSlug = postPath[postPath.length - 1];
        const parentPostTopicsSlugs = postPath.slice(0, -1);
        // Build path for the topic query (handles duplicate slugs across different parents)
        const topicPath =
            parentPostTopicsSlugs.length > 0 ? parentPostTopicsSlugs.join('/') + '/' + postTopicSlug : undefined;

        let postTopicData;
        try {
            postTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
                slug: postTopicSlug!,
                path: topicPath,
                type: postType,
                pagination: {
                    itemsPerPage: 100,
                },
            });
        }
        catch(error) {
            // If the request fails (e.g., topic not found validation error), return a 404
            console.error('[PostTopicPathPageRoute] Error fetching postTopic:', postTopicSlug, error);
            return notFound();
        }

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
                // Sort sub topics by linked list order
                const sortedSubTopics = sortByLinkedListOrder(postTopicData.postTopic.subTopics);

                // Only fetch sub-topic posts if there are 5 or fewer sub-topics
                // For topics with many sub-topics, we just show them as navigation links
                const shouldFetchSubTopicPosts = sortedSubTopics.length <= 3;

                if(shouldFetchSubTopicPosts) {
                    // Build the path for sub-topic queries (parent path + current topic slug)
                    const parentPath =
                        parentPostTopicsSlugs.length > 0
                            ? parentPostTopicsSlugs.join('/') + '/' + postTopicSlug
                            : postTopicSlug;

                    // If there are sub topics, get the posts for each one
                    const subPostTopics = await Promise.all(
                        // Query for each sub topic and get the posts
                        sortedSubTopics.map(async function (subTopic) {
                            const subTopicPath = parentPath + '/' + subTopic.slug;
                            let postSubTopicData;
                            try {
                                postSubTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
                                    slug: subTopic.slug,
                                    path: subTopicPath,
                                    type: postType,
                                    pagination: {
                                        itemsPerPage: 100,
                                    },
                                });
                            }
                            catch(error) {
                                console.error(
                                    '[PostTopicPathPageRoute] Error fetching subTopic:',
                                    subTopic.slug,
                                    JSON.stringify(error, null, 2),
                                );
                                throw error;
                            }

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
                else {
                    // For many sub-topics, just add them without fetching posts
                    sortedSubTopics.forEach(function (subTopic) {
                        postTopicAndSubPostTopicsWithPosts.push({
                            postTopicId: subTopic.id,
                            postTopicTitle: subTopic.title,
                            postTopicSlug: subTopic.slug,
                            postTopicDescription: subTopic.description,
                            posts: [], // Empty posts - will render as tile navigation only
                        });
                    });
                }
            }
        }
        // If the post topic is not found, return a 404
        else {
            return notFound();
        }
    }

    // Return the properties
    return {
        postIdentifier: parsedPost?.identifier,
        postTopicSlug: post ? undefined : postPath[postPath.length - 1],
        parentPostTopicsSlugs: post ? [] : postPath.slice(0, -1),
        post: post,
        postTopic: postTopic,
        postTopicAndSubPostTopicsWithPosts: postTopicAndSubPostTopicsWithPosts,
    };
}

// Metadata generator
export async function generatePostTopicPathPageMetadata(
    postPath: string[],
    titleSuffix: string,
    basePath: string,
    postType: string,
) {
    const serverSideProperties = await getPostTopicPathServerSideProperties(postPath, basePath, postType);

    let title = '';

    // Post
    if(serverSideProperties.postIdentifier && serverSideProperties.post) {
        title = serverSideProperties.post.title;
    }
    // PostTopic
    else if(serverSideProperties.postTopicSlug && serverSideProperties.postTopic) {
        const topicTitle = serverSideProperties.postTopic.topic.title;

        // Only add topic title if it's different from the suffix (avoid "Library • Library")
        if(topicTitle !== titleSuffix) {
            title = topicTitle;
        }

        // Add the parent topic titles (excluding any that match the suffix)
        if(serverSideProperties.parentPostTopicsSlugs) {
            serverSideProperties.parentPostTopicsSlugs.forEach(function (parentPostTopicSlug) {
                const parentTitle = slugToTitleCase(parentPostTopicSlug);
                if(parentTitle !== titleSuffix) {
                    title += ' • ' + parentTitle;
                }
            });
        }
    }

    // Add suffix, handling case where title might be empty
    if(title) {
        title += ' • ' + titleSuffix;
    }
    else {
        title = titleSuffix;
    }

    return {
        title: title,
    };
}

// Route component
export interface PostTopicPathPageRouteProperties {
    className?: string;
    postPath: string[];
    postType: string; // Post type filter (e.g., "Article", "SupportArticle")
    topicIconMapping?: PostTopicPageProperties['topicIconMapping'];
    navigationTrailIconMapping?: PostTopicPageProperties['navigationTrailIconMapping'];
    basePath: string;
    title: string; // Title for the navigation trail (e.g., "Support", "Library")
    managementBasePath: string;
    showNavigationTrail?: boolean;
    showTitle?: boolean;
    showNeedMoreHelp?: boolean;
    searchPath?: string;
    searchPlaceholder?: string;
}
export async function PostTopicPathPageRoute(properties: PostTopicPathPageRouteProperties) {
    const serverSideProperties = await getPostTopicPathServerSideProperties(
        properties.postPath,
        properties.basePath,
        properties.postType,
    );

    // Post
    if(serverSideProperties.post) {
        return (
            <PostPage
                className={properties.className}
                basePath={properties.basePath}
                title={properties.title}
                searchPath={properties.searchPath}
                searchPlaceholder={properties.searchPlaceholder}
                showNeedMoreHelp={properties.showNeedMoreHelp}
                navigationTrailIconMapping={properties.navigationTrailIconMapping}
                post={serverSideProperties.post}
            />
        );
    }
    // PostTopic
    else if(serverSideProperties.postTopic) {
        return (
            <PostTopicPage
                className={properties.className}
                basePath={properties.basePath}
                title={properties.title}
                managementBasePath={properties.managementBasePath}
                showNavigationTrail={properties.showNavigationTrail}
                showTitle={properties.showTitle}
                showNeedMoreHelp={properties.showNeedMoreHelp}
                searchPath={properties.searchPath}
                searchPlaceholder={properties.searchPlaceholder}
                postTopic={serverSideProperties.postTopic}
                postTopicAndSubPostTopicsWithPosts={serverSideProperties.postTopicAndSubPostTopicsWithPosts}
                topicIconMapping={properties.topicIconMapping}
                navigationTrailIconMapping={properties.navigationTrailIconMapping}
            />
        );
    }
}
