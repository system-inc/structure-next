// Dependencies
import { graphql } from '@project/source/api/GraphQlGeneratedCode';

// Document - Contacts Query
export const contactsQueryDocument = graphql(`
    query contactsQuery($pagination: PaginationInputWithFilters!) {
        contacts(input: $pagination) {
            items {
                name
                type
                source
                metadata
                note
                fields {
                    type
                    label
                    value
                }
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

// Document - Get Single Contact by Id Query
export const contactByIdQueryDocument = graphql(`
    query contactQuery($id: String!) {
        contact(id: $id) {
            name
            type
            source
            metadata
            note
            fields {
                type
                label
                value
            }
        }
    }
`);

// Document - Create a Contact
export const contactCreateMutationDocument = graphql(`
    mutation contactCreate($input: ContactCreateInput!) {
        contactCreate(input: $input) {
            name
            type
            source
            metadata
            note
            fields {
                type
                label
                value
            }
        }
    }
`);

// Document - Update a Contact metadata
export const contactMetadataUpdateMutationDocument = graphql(`
    mutation contactUpdate($input: ContactUpdateInput!) {
        contactUpdate(input: $input) {
            name
            type
            source
            metadata
            note
            fields {
                type
                label
                value
            }
        }
    }
`);

// Document - Update a Contact metadata
export const contactFieldUpdateMutationDocument = graphql(`
    mutation contactFieldUpdate($contactId: String!, $input: ContactFieldUpdateInput!) {
        contactFieldUpdate(contactId: $contactId, input: $input) {
            name
            type
            source
            metadata
            note
            fields {
                type
                label
                value
            }
        }
    }
`);

// Document - Delete a Contact
export const contactDeleteMutationDocument = graphql(`
    mutation contactDelete($id: String!) {
        contactDelete(id: $id)
    }
`);
