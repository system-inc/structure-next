// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

export interface UsePostRequestInterface {
    id?: string;
    identifier?: string;
    slug?: string;
    enabled?: boolean;
}
export function usePostRequest(properties: UsePostRequestInterface) {
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
            id: properties.id,
            slug: properties.slug,
            identifier: properties.identifier,
        },
        {
            enabled: properties.enabled,
        },
    );
}
