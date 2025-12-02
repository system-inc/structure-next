// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { SystemLogCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSystemLogCreateRequest
export function useSystemLogCreateRequest(options?: InferUseGraphQlMutationOptions<typeof SystemLogCreateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation SystemLogCreate($input: SystemLogClientInput!) {
                systemLogCreate(input: $input) {
                    success
                }
            }
        `),
        options,
    );
}
