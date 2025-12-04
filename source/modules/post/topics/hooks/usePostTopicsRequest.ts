// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicsDocument, PostTopicsQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostTopicsRequest
export function usePostTopicsRequest(
    variables: PostTopicsQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostTopicsDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostTopics($ids: [String!]) {
                postTopics(ids: $ids) {
                    id
                    title
                    slug
                    description
                    postCount
                    createdAt
                }
            }
        `),
        variables,
        options,
    );
}
