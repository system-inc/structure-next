// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostDetailedDocument, PostDetailedQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostDetailedRequest
// Returns full post data including author profile, topics, reactions, votes, and moderation fields
export function usePostDetailedRequest(
    variables: PostDetailedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostDetailedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostDetailed($id: String, $slug: String, $identifier: String) {
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
                    updatedAt
                    createdAt
                }
            }
        `),
        variables,
        options,
    );
}
