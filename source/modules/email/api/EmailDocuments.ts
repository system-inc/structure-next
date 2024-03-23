// Dependencies
import { graphql } from '@project/source/graphql/generated';

// Document - Email Campaigns Query
export const emailCampaignsQueryDocument = graphql(`
    query emailCampaignsQuery($pagination: PaginationInputWithFilters) {
        emailCampaigns(input: $pagination) {
            items {
                id
                title
                description
                fromName
                fromEmail
                status
                currentStageIndexId
                deliveryStages {
                    indexId
                    percentToSend
                    stageStatus
                    emailsSent
                    percentSent
                    startedAt
                    completedAt
                    emailTemplateId
                    emailTemplateContentId
                }
                updatedByAccountId
                updatedByProfileId
                updatedAt
                createdByAccountId
                createdByProfileId
                createdAt
            }
            pagination {
                itemIndex
                itemIndexForPreviousPage
                itemIndexForNextPage
                itemsPerPage
                itemsTotal
                pagesTotal
                page
            }
        }
    }
`);

// Document - Email Lists Query
export const emailListsQueryDocument = graphql(`
    query emailListsQuery($pagination: PaginationInput) {
        emailLists(pagination: $pagination) {
            items {
                id
                identifier
                title
                pagedEmailListEntries(pagination: { itemIndex: 0, itemsPerPage: 0 }) {
                    pagination {
                        itemsTotal
                    }
                }
                updatedAt
                updatedByAccountId
                updatedByProfileId
                createdByAccountId
                createdByProfileId
                createdAt
            }
        }
    }
`);
