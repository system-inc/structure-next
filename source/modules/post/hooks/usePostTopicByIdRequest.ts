// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicByIdDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostTopicByIdRequest
export interface UsePostTopicByIdRequestInterface {
    id: string;
}
export function usePostTopicByIdRequest(
    variables: UsePostTopicByIdRequestInterface,
    options?: InferUseGraphQlQueryOptions<typeof PostTopicByIdDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostTopicById($id: String!) {
                postTopicById(id: $id) {
                    id
                    title
                    slug
                    description
                    postCount
                    createdAt
                }
            }
        `),
        {
            id: variables.id,
        },
        options,
    );
}
