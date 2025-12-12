// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    PostPrivilegedDocument,
    PostPrivilegedQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostPrivilegedRequest
// Returns a single post with privileged access by id or identifier
export function usePostPrivilegedRequest(
    variables: PostPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostPrivileged($id: String, $identifier: String) {
                postPrivileged(id: $id, identifier: $identifier) {
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
            }
        `),
        variables,
        options,
    );
}
