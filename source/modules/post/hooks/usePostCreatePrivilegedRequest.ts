'use client'; // This hook uses client-only features

// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostCreatePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postsCacheKey } from './usePostCreateRequest';

// Hook - usePostCreatePrivilegedRequest
export function usePostCreatePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostCreatePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostCreatePrivileged($input: PostCreateInput!) {
                postCreatePrivileged(input: $input) {
                    id
                    status
                    title
                    contentType
                    content
                    settings
                    upvoteCount
                    downvoteCount
                    metadata
                    updatedAt
                    createdAt
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function () {
                return [[postsCacheKey]];
            },
        },
    );
}
