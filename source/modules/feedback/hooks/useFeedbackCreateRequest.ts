// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { FeedbackCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useFeedbackCreateRequest
export function useFeedbackCreateRequest(options?: InferUseGraphQlMutationOptions<typeof FeedbackCreateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation FeedbackCreate($input: CreateFeedbackInput!) {
                feedbackCreate(input: $input) {
                    identifier
                    subject
                    reaction
                    content
                    contentType
                    emailAddress
                }
            }
        `),
        options,
    );
}
