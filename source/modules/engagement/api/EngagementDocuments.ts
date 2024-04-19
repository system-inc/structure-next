// Dependencies
import { graphql } from '@project/source/api/GraphQlGeneratedCode';

// Document - Engagement Event Create Mutation
export const engagementEventCreateMutationDocument = graphql(`
    mutation engagementEventCreate($input: CreateEngagementEventInput!) {
        engagementEventCreate(input: $input)
    }
`);

// Document - Engagement Events Create Mutation
export const engagementEventsCreateMutationDocument = graphql(`
    mutation engagementEventsCreate($input: [CreateEngagementEventInput!]!) {
        engagementEventsCreate(inputs: $input)
    }
`);

// Document - Engagement Overview Query
// export const engagementOveriewQueryDocument = graphql(`
//     query engagementOverviewQuery {
//         engagementOverview() {
//             uniqueDeviceIds
//             views {
//                 uniqueDeviceIdCount
//                 viewIdentifier
//                 viewTitle
//             }
//             locations {
//                 uniqueDeviceIdCount
//                 countryCode
//                 latitude
//                 longitude
//             }
//             deviceCategoryPercentages
//         }
//     }
// `);
