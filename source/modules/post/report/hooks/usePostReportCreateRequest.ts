// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostReportCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostReportCreateRequest
export function usePostReportCreateRequest(options?: InferUseGraphQlMutationOptions<typeof PostReportCreateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostReportCreate($input: PostReportInput!) {
                postReportCreate(input: $input) {
                    id
                }
            }
        `),
        options,
    );
}
