'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Table } from '@structure/source/common/tables/Table';
import { TableRowProperties } from '@structure/source/common/tables/TableRow';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Dependencies - Utilities
// import { addCommas } from '@structure/source/utilities/Number';

// Component - DatabasePage
export function DevelopersDatabasePage() {
    // Get the databases and tables from the GraphQL API
    const dataInteractionDatabaseTablesRequest = networkService.useSuspenseGraphQlQuery(
        gql(`
            query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {
                dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {
                    items {
                        databaseName
                        tableName
                        # rowCount
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
        `),
        {
            databaseName: '', // Empty string to get all databases
            pagination: {
                itemsPerPage: 1000,
            },
        },
    );

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
            dataInteractionDatabaseTablesRequest.data?.dataInteractionDatabaseTables?.items.forEach(function (item) {
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
        [dataInteractionDatabaseTablesRequest.data?.dataInteractionDatabaseTables?.items],
    );

    // console.log('databasesAndTables', databasesAndTables);

    // Render the component
    return (
        <div className="px-6 py-4">
            <React.Suspense>
                <OpsNavigationTrail />

                {Object.keys(databasesAndTables).length === 0 ? (
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
                                                        url: `/ops/developers/data?page=1&databaseName=${databaseName}&tableName=${table.tableName}`,
                                                        openUrlInNewTab: true,
                                                    },
                                                    // {
                                                    //     children: addCommas(table.rowCount),
                                                    //     value: table.rowCount,
                                                    // },
                                                ],
                                            } as TableRowProperties;
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
