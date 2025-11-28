'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layout/navigation/OpsNavigationTrail';
import { DatabaseSection } from '@structure/source/ops/developers/data/DatabaseSection';

// Dependencies - Hooks
import { useDataInteractionDatabasesRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabasesRequest';

// Component - DatabasePage
export function DevelopersDatabasePage() {
    // Get the list of databases from the GraphQL API
    const dataInteractionDatabasesRequest = useDataInteractionDatabasesRequest({
        itemsPerPage: 100,
    });

    // Render the component
    return (
        <div className="px-6 py-4">
            <React.Suspense>
                <OpsNavigationTrail />

                {dataInteractionDatabasesRequest.isLoading ? (
                    <p>Loading databases...</p>
                ) : dataInteractionDatabasesRequest.data?.dataInteractionDatabases.items.length === 0 ? (
                    // No databases found
                    <p>No databases found.</p>
                ) : (
                    // Databases and tables
                    dataInteractionDatabasesRequest.data?.dataInteractionDatabases.items.map(function (database) {
                        return <DatabaseSection key={database.databaseName} databaseName={database.databaseName} />;
                    })
                )}
            </React.Suspense>
        </div>
    );
}
