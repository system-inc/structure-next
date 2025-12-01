// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

export interface UsePostRequestInterface {
    id?: string;
    identifier?: string;
    slug?: string;
}
export function usePostRequest(
    variables: UsePostRequestInterface,
    options?: InferUseGraphQlQueryOptions<typeof PostDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query Post($id: String, $slug: String, $identifier: String) {
                post(id: $id, slug: $slug, identifier: $identifier) {
                    id
                    identifier
                    slug
                    status
                    title
                    createdByProfileId
                    createdByProfile {
                        displayName
                        username
                        images {
                            url
                            type
                            variant
                        }
                    }
                    topics {
                        id
                        title
                        slug
                    }
                    content
                    reactions {
                        content
                        count
                        reacted
                    }
                    upvoteCount
                    downvoteCount
                    voteType
                    reportedCount
                    reportStatus
                    metadata
                    latestRevisionId
                    updatedAt
                    createdAt
                }
            }
        `),
        {
            id: variables.id,
            slug: variables.slug,
            identifier: variables.identifier,
        },
        options,
    );
}
