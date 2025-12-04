'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/components/tables/GraphQlQueryTable';
import { GraphQlMutationForm } from '@structure/source/api/graphql/forms/GraphQlMutationForm';

// Dependencies - API
import { ContactListCreatePrivilegedOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { ContactListsPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

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

            <GraphQlQueryTable className="" queryDocument={ContactListsPrivilegedDocument} />
        </div>
    );
}
