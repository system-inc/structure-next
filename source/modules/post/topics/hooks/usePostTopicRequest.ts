// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicDocument, PostTopicQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostTopicRequest
// Note: When consuming this hook for support articles, pass type: "SupportArticle"
export function usePostTopicRequest(
    variables: PostTopicQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostTopicDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostTopic($slug: String!, $path: String, $type: String!, $pagination: PaginationInput!) {
                postTopic(slug: $slug, path: $path, type: $type, pagination: $pagination) {
                    ancestors {
                        id
                        title
                        slug
                        description
                    }
                    topic {
                        id
                        title
                        slug
                        description
                        postCount
                        createdAt
                    }
                    subTopics {
                        id
                        previousSiblingId
                        nextSiblingId
                        title
                        slug
                        description
                        postCount
                        createdAt
                    }
                    pagedPosts {
                        items {
                            id
                            identifier
                            slug
                            status
                            title
                            description
                            content
                            metadata
                            updatedAt
                            createdAt
                        }
                        pagination {
                            itemIndex
                            itemIndexForPreviousPage
                            itemIndexForNextPage
                            itemsPerPage
                            itemsTotal
                            pagesTotal
                            page
                        }
                    }
                }
            }
        `),
        variables,
        options,
    );
}
