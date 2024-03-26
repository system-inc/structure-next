// Dependencies
import { graphql } from '@project/source/api/GraphQlGeneratedCode';

// Document - Wait List Entries Query
// export const waitListEntriesQueryDocument = graphql(`
//     query waitListEntriesQuery($input: PaginationInput, $orderBy: OrderBy) {
//         principles(input: $input, orderBy: $orderBy) {
//             pagination {
//                 itemsTotal
//                 itemIndexForNextPage
//                 itemIndexForPreviousPage
//                 itemsPerPage
//                 page
//                 pagesTotal
//             }
//             items {
//                 id
//                 createdAt
//                 principleNumber
//                 lastReviewedAt
//                 author
//                 principleContent {
//                     title
//                     description
//                 }
//             }
//         }
//     }
// `);

// Document - Wait List Entry Create
export const waitListEntryCreateMutationDocument = graphql(`
    mutation waitListEntryCreate($emailAddress: String!) {
        waitListEntryCreate(emailAddress: $emailAddress, waitListIdentifier: "earlyAccess") {
            id
            emailAddress
        }
    }
`);
