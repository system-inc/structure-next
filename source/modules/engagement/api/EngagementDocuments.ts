// Dependencies
import { graphql } from '@project/source/api/GraphQlGeneratedCode';

// Document - Engagement Event Create
export const engagementEventCreateMutationDocument = graphql(`
    mutation engagementEventCreate($input: CreateEngagementEventInput!) {
        engagementEventCreate(input: $input)
    }
`);

// Document - Engagement Events Create
export const engagementEventsCreateMutationDocument = graphql(`
    mutation engagementEventsCreate($input: [CreateEngagementEventInput!]!) {
        engagementEventsCreate(inputs: $input)
    }
`);
