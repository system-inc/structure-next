'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/components/tables/GraphQlQueryTable';
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { gql } from '@structure/source/services/network/NetworkService';
import { ContactListCreatePrivilegedOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// GraphQL Operations
gql(`
    mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {
        contactListCreatePrivileged(data: $data) {
            id
            identifier
            title
            description
            updatedAt
            createdAt
        }
    }
`);

// Component - UsersContactListsPage
export function UsersContactListsPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <h1 className="mb-6">Contact Lists</h1>

            <GraphQlMutationForm
                className="mb-12 flex flex-col gap-4"
                operation={ContactListCreatePrivilegedOperation}
                submitButtonProperties={{ children: 'Create Contact List' }}
            />

            <GraphQlQueryTable
                className=""
                queryDocument={gql(`
                    query ContactListsPrivileged($pagination: PaginationInput!) {
                        contactListsPrivileged(pagination: $pagination) {
                            pagination {
                                itemIndex
                                itemIndexForNextPage
                                itemIndexForPreviousPage
                                itemsPerPage
                                itemsTotal
                                page
                                pagesTotal
                            }
                            items {
                                id
                                identifier
                                title
                                description
                                updatedAt
                                createdAt
                            }
                        }
                    }
                `)}
            />
        </div>
    );
}
