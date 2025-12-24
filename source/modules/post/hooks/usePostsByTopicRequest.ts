// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostsByTopicDocument, PostsByTopicQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostsByTopicRequest
// Returns posts within a specific topic
export function usePostsByTopicRequest(
    variables: PostsByTopicQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostsByTopicDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostsByTopic($id: String!, $pagination: PaginationInput!) {
                postsByTopic(id: $id, pagination: $pagination) {
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
                        id
                        identifier
                        slug
                        status
                        title
                        description
                        createdAt
                        updatedAt
                        previousSiblingId
                        nextSiblingId
                    }
                }
            }
        `),
        variables,
        options,
    );
}
