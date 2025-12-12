// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    PostsPrivilegedDocument,
    PostsPrivilegedQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostsPrivilegedRequest
// Returns paginated posts with privileged access (includes all fields and topics)
export function usePostsPrivilegedRequest(
    variables: PostsPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostsPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostsPrivileged($pagination: PaginationInput!) {
                postsPrivileged(pagination: $pagination) {
                    items {
                        id
                        identifier
                        title
                        slug
                        description
                        content
                        contentType
                        status
                        type
                        metadata
                        createdAt
                        updatedAt
                        topics {
                            id
                            title
                            slug
                            parentId
                        }
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
        `),
        variables,
        options,
    );
}
