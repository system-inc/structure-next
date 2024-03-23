'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsInteger, parseAsJson } from 'next-usequerystate';
import { useSearchParams as useUrlSearchParameters } from 'next/navigation';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/common/navigation/InternalNavigationTrail';
import DatabaseAndTableFormInputSelects from '@structure/source/internal/pages/developers/databases/DatabaseAndTableFormInputSelects';
import Button from '@structure/source/common/interactions/Button';
import RefreshButton from '@structure/source/common/interactions/RefreshButton';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';
import { ColumnFilterGroupDataInterface, ColumnFilterGroup } from '@structure/source/common/tables/ColumnFilterGroup';

// Dependencies - API
import { useApolloClient } from '@apollo/client';
import { dataInteractionDatabaseTableRowsQueryDocument } from '@structure/source/modules/data-interaction/api/DataInteractionDocuments';

// Dependencies - Assets
import BarGraphIcon from '@structure/assets/icons/analytics/BarGraphIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Component - DatabasePage
export interface DevelopersDatabasePageInterface {}
export function DevelopersDatabasePage(properties: DevelopersDatabasePageInterface) {
    // Use the Apollo Client for refetching queries with the refresh button
    const apolloClient = useApolloClient();

    // State
    const [databaseName, setDatabaseName] = React.useState<string | undefined>(undefined);
    const [tableName, setTableName] = React.useState<string | undefined>(undefined);

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
        parseAsJson<ColumnFilterGroupDataInterface>(),
    );
    // console.log('filtersUrlParameter', filtersUrlParameter);

    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <div className="flex">
                <div className="flex flex-grow space-x-2">
                    <DatabaseAndTableFormInputSelects
                        className="mb-4"
                        databaseNameFormInputSelectProperties={{
                            className: 'w-48',
                            defaultValue: databaseNameUrlParameter ?? undefined,
                        }}
                        tableNameFormInputSelectProperties={{
                            className: 'w-80',
                            defaultValue: tableNameUrlParameter ?? undefined,
                        }}
                        onChange={function (databaseName?: string, tableName?: string) {
                            // console.log('onChange', databaseName, tableName);

                            // Reset the page
                            setPaginationPageUrlParameter(1);

                            // Set the state
                            setDatabaseName(databaseName);
                            setTableName(tableName);

                            // Set the URL parameters
                            if(databaseName) {
                                setDatabaseNameUrlParameter(databaseName);
                            }
                            if(tableName) {
                                setTableNameUrlParameter(tableName);
                            }
                        }}
                    />
                </div>
                <div className="flex space-x-2">
                    <Button
                        className="mt-[22px]"
                        icon={PlusIcon}
                        iconPosition="left"
                        // onClick={addNewCondition}
                    >
                        Create
                    </Button>

                    <Button
                        className="mt-[22px]"
                        size="icon"
                        icon={BarGraphIcon}
                        iconClassName="h-[17px] w-[17px]"
                        tip="Metrics"
                        href={
                            `/internal/developers/metrics/?dataSources={"databaseName":"` +
                            databaseName +
                            `","tableName":"` +
                            tableName +
                            `"}`
                        }
                        target="_blank"
                        // onClick={async () => {
                        //     const newPage = 1;
                        //     setPage(newPage);
                        //     await onChangeIntercept(itemsPerPage, newPage);
                        // }}
                    />

                    <RefreshButton
                        className="mt-[22px]"
                        size={'formInputIcon'}
                        onClick={async () => {
                            await apolloClient.refetchQueries({
                                include: 'active',
                            });
                        }}
                    />
                </div>
            </div>

            <GraphQlQueryTable
                key={databaseName ? databaseName : '' + tableName ? tableName : ''}
                queryDocument={dataInteractionDatabaseTableRowsQueryDocument}
                skip={!databaseName || !tableName} // Skip if we don't have a database or table
                variables={{
                    databaseName: databaseName,
                    tableName: tableName,
                    filters:
                        filtersUrlParameter &&
                        filtersUrlParameter.conditions.length > 0 &&
                        filtersUrlParameter.conditions[0]?.value
                            ? filtersUrlParameter
                            : undefined,
                }}
                filters={filtersUrlParameter ?? undefined}
                // onFiltersChange={function (filters: ColumnFilterGroupDataInterface) {
                //     // console.log('onFiltersChange', filters);
                //     setFiltersUrlParameter(filters);
                // }}
                sortable={true}
                pagination={{
                    itemsPerPage: paginationItemsPerPageUrlParameter ?? undefined,
                    page: paginationPageUrlParameter ?? undefined,
                    onChange: async function (itemsPerPage: number, page: number) {
                        console.log('pagination onChange', itemsPerPage, page);
                        setPaginationItemsPerPageUrlParameter(itemsPerPage);
                        setPaginationPageUrlParameter(page);
                    },
                }}
                hideTypeColumns={false}
            />
        </>
    );
}

// Export - Default
export default DevelopersDatabasePage;
