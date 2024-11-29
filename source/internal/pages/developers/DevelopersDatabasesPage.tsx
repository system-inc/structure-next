'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import Table from '@structure/source/common/tables/Table';
import { TableRowInterface } from '@structure/source/common/tables/TableRow';

// Dependencies - API
import { useSuspenseQuery } from '@apollo/client';
import { DataInteractionDatabaseTablesDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
// import { addCommas } from '@structure/source/utilities/Number';

// Component - DatabasePage
export function DevelopersDatabasePage() {
    // Get the databases and tables from the GraphQL API
    const dataInteractionDatabaseTablesQueryState = useSuspenseQuery(DataInteractionDatabaseTablesDocument, {
        variables: {
            pagination: {
                itemsPerPage: 1000,
            },
        },
    });

    // Extract databases and tables from the query
    const databasesAndTables = React.useMemo(
        function () {
            // Data structure for the databases and tables
            const databasesAndTablesObject: {
                [databaseName: string]: {
                    tableName: string;
                    // rowCount: number; // This is expensive to compute
                }[];
            } = {};

            // Loop over the query results with a reference to the index
            dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items.forEach(function (item) {
                // Create the entry for the database if it doesn't exist
                if(!databasesAndTablesObject[item.databaseName]) {
                    databasesAndTablesObject[item.databaseName] = [];
                }

                databasesAndTablesObject[item.databaseName]?.push({
                    tableName: item.tableName,
                    // rowCount: item.rowCount,
                });
            });

            return databasesAndTablesObject;
        },
        [dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items],
    );

    // console.log('databasesAndTables', databasesAndTables);

    // Render the component
    return (
        <div className="px-6 py-4">
            <React.Suspense>
                <InternalNavigationTrail />

                {dataInteractionDatabaseTablesQueryState.error ? (
                    // Error
                    <p>Error: {dataInteractionDatabaseTablesQueryState.error.message}</p>
                ) : Object.keys(databasesAndTables).length === 0 ? (
                    // No databases found
                    <p>No databases found.</p>
                ) : (
                    // Databases and tables
                    Object.keys(databasesAndTables).map(function (databaseName) {
                        return (
                            <div key={databaseName} className="mb-8 mt-6">
                                <h2 className="mb-6">{databaseName}</h2>

                                <Table
                                    columns={[
                                        {
                                            title: 'Table Name',
                                            identifier: 'tableName',
                                        },
                                        // {
                                        //     title: 'Row Count',
                                        //     identifier: 'rowCount',
                                        // },
                                    ]}
                                    rows={
                                        databasesAndTables[databaseName]?.map(function (table) {
                                            return {
                                                cells: [
                                                    {
                                                        value: table.tableName,
                                                        url: `/internal/developers/data?page=1&databaseName=${databaseName}&tableName=${table.tableName}`,
                                                        openUrlInNewTab: true,
                                                    },
                                                    // {
                                                    //     children: addCommas(table.rowCount),
                                                    //     value: table.rowCount,
                                                    // },
                                                ],
                                            } as TableRowInterface;
                                        }) || []
                                    }
                                    search={true}
                                    rowSelection={true}
                                    sortable={true}
                                />
                            </div>
                        );
                    })
                )}
            </React.Suspense>
        </div>
    );
}

// Export - Default
export default DevelopersDatabasePage;
