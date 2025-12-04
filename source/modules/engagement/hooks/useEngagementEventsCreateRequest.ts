// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { EngagementEventsCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useEngagementEventsCreateRequest
export function useEngagementEventsCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof EngagementEventsCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {
                engagementEventsCreate(inputs: $inputs) {
                    success
                }
            }
        `),
        options,
    );
}
