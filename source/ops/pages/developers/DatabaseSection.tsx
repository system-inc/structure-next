'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Table } from '@structure/source/common/tables/Table';
import { TableRowProperties } from '@structure/source/common/tables/TableRow';

// Dependencies - Hooks
import { useDataInteractionDatabaseTablesRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTablesRequest';

// Component - DatabaseSection
export interface DatabaseSectionProperties {
    databaseName: string;
}
export function DatabaseSection(properties: DatabaseSectionProperties) {
    // Get tables for this specific database
    const dataInteractionDatabaseTablesRequest = useDataInteractionDatabaseTablesRequest(properties.databaseName, {
        itemsPerPage: 1000,
    });

    return (
        <div className="mb-8 mt-6">
            <h2 className="mb-6">{properties.databaseName}</h2>

            {dataInteractionDatabaseTablesRequest.isLoading ? (
                <p className="text-gray-500">Loading tables...</p>
            ) : dataInteractionDatabaseTablesRequest.data?.dataInteractionDatabaseTables.items.length === 0 ? (
                <p className="text-gray-500">No tables in this database.</p>
            ) : (
                <Table
                    columns={[
                        {
                            title: 'Table Name',
                            identifier: 'tableName',
                        },
                    ]}
                    rows={
                        dataInteractionDatabaseTablesRequest.data?.dataInteractionDatabaseTables.items.map(
                            function (table) {
                                return {
                                    cells: [
                                        {
                                            value: table.tableName,
                                            url: `/ops/developers/data?page=1&databaseName=${properties.databaseName}&tableName=${table.tableName}`,
                                            openUrlInNewTab: true,
                                        },
                                    ],
                                } as TableRowProperties;
                            },
                        ) || []
                    }
                    search={true}
                    rowSelection={true}
                    sortable={true}
                />
            )}
        </div>
    );
}
