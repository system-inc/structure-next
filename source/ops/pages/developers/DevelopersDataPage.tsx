'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsInteger, parseAsJson } from 'nuqs';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { DataInteractionTable } from '@structure/source/modules/data-interaction/DataInteractionTable';
import { ColumnFilterGroupDataInterface } from '@structure/source/components/tables/ColumnFilterGroup';

// Component - DatabasePage
export function DevelopersDataPage() {
    // URL parameters
    const [databaseNameUrlParameter, setDatabaseNameUrlParameter] = useUrlQueryState('databaseName');
    const [tableNameUrlParameter, setTableNameUrlParameter] = useUrlQueryState('tableName');
    const [paginationItemsPerPageUrlParameter, setPaginationItemsPerPageUrlParameter] = useUrlQueryState<number>(
        'itemsPerPage',
        parseAsInteger,
    );
    const [paginationPageUrlParameter, setPaginationPageUrlParameter] = useUrlQueryState<number>(
        'page',
        parseAsInteger,
    );
    const [filtersUrlParameter, setFiltersUrlParameter] = useUrlQueryState<ColumnFilterGroupDataInterface>(
        'filters',
        parseAsJson<ColumnFilterGroupDataInterface>(function (value) {
            return value as ColumnFilterGroupDataInterface;
        }),
    );
    // console.log('filtersUrlParameter', filtersUrlParameter);

    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <DataInteractionTable
                databaseName={databaseNameUrlParameter ?? undefined}
                onDatabaseNameChange={function (databaseName) {
                    setDatabaseNameUrlParameter(databaseName ?? null);
                }}
                tableName={tableNameUrlParameter ?? undefined}
                onTableNameChange={function (tableName) {
                    setTableNameUrlParameter(tableName ?? null);
                }}
                filters={filtersUrlParameter ?? undefined}
                onFiltersChange={function (filters) {
                    // console.log('onFiltersChange', filters);
                    setFiltersUrlParameter(filters ?? null);
                }}
                pagination={{
                    itemsPerPage: paginationItemsPerPageUrlParameter ?? undefined,
                    page: paginationPageUrlParameter ?? undefined,
                    onChange: async function (itemsPerPage: number, page: number) {
                        // console.log('pagination onChange', itemsPerPage, page);
                        setPaginationItemsPerPageUrlParameter(itemsPerPage);
                        setPaginationPageUrlParameter(page);
                    },
                }}
            />
        </div>
    );
}
