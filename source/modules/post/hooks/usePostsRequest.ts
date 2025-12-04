// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostsDocument, PostsQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostsRequest
// Returns essential post fields for cards, list items, and search results
export function usePostsRequest(
    variables: PostsQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostsDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query Posts($pagination: PaginationInput!) {
                posts(pagination: $pagination) {
                    pagination {
                        itemIndex
                        itemIndexForPreviousPage
                        itemIndexForNextPage
                        itemsPerPage
                        itemsTotal
                        pagesTotal
                        page
                    }
                    items {
                        identifier
                        slug
                        status
                        title
                        description
                        content
                        topics {
                            id
                            title
                            slug
                        }
                        updatedAt
                        createdAt
                    }
                }
            }
        `),
        variables,
        options,
    );
}
