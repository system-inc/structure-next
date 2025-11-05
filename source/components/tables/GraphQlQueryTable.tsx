// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableProperties, Table } from '@structure/source/components/tables/Table';
import { TableColumnProperties, inferTableColumnType } from '@structure/source/components/tables/TableColumn';
import { TableRowProperties } from '@structure/source/components/tables/TableRow';

// Dependencies - API
import { networkService, AnyTypedDocumentString } from '@structure/source/services/network/NetworkService';
import { BaseError } from '@structure/source/api/errors/BaseError';

// Helper types for GraphQL table data
interface GraphQlTableItem {
    [key: string]: unknown;
}

interface GraphQlTableData {
    items?: GraphQlTableItem[];
    pagination?: {
        itemIndex: number;
        itemIndexForPreviousPage?: number;
        itemIndexForNextPage?: number;
        itemsPerPage: number;
        itemsTotal: number;
        pagesTotal: number;
        page: number;
    };
}

interface GraphQlVariablesWithPagination extends Record<string, unknown> {
    orderBy?: {
        direction: string;
        key: string;
    };
    pagination?: {
        itemsPerPage: number;
        itemIndex: number;
    };
}

// Dependencies - Utilities
import { flattenObject } from '@structure/source/utilities/type/Object';
import { titleCase } from '@structure/source/utilities/type/String';

// Component - GraphQlQueryTable
export interface GraphQlQueryTableProperties<TResult = unknown, TVariables = Record<string, unknown>>
    extends Omit<TableProperties, 'columns' | 'rows' | 'pagination'> {
    queryDocument: AnyTypedDocumentString<TResult, TVariables>;
    variables?: TVariables;
    skip?: boolean;
    pagination?: {
        itemsPerPage?: number;
        page?: number;
        onChange: (itemsPerPage: number, page: number) => Promise<void>;
    };

    hideTypeColumns?: boolean;
}

// Helper function to make the query with proper typing
function makeGraphQlQuery<TResult, TVariables>(
    networkService: typeof import('@structure/source/services/network/NetworkService').networkService,
    queryDocument: AnyTypedDocumentString<TResult, TVariables>,
    variables: TVariables | undefined,
    options: { enabled?: boolean; keepPreviousData?: boolean },
    hasVariables: boolean,
) {
    // Use type assertion to handle the conditional type limitation
    if(!hasVariables) {
        return (
            networkService as {
                useGraphQlQuery<R>(
                    query: unknown,
                    variables: undefined,
                    options?: unknown,
                ): ReturnType<typeof networkService.useGraphQlQuery<R, Record<string, never>>>;
            }
        ).useGraphQlQuery(queryDocument, undefined, options);
    }

    return (
        networkService as {
            useGraphQlQuery<R, V>(
                query: unknown,
                variables: V,
                options?: unknown,
            ): ReturnType<typeof networkService.useGraphQlQuery<R, V>>;
        }
    ).useGraphQlQuery(queryDocument, variables, options);
}

export function GraphQlQueryTable<TResult = unknown, TVariables = Record<string, unknown>>(
    properties: GraphQlQueryTableProperties<TResult, TVariables>,
) {
    // State
    const [queryPagination] = React.useState({
        page: properties.pagination?.page || 1,
        itemsPerPage: properties.pagination?.itemsPerPage || 10,
    });

    // Defaults
    // const hideTypeColumns = properties.hideTypeColumns ?? true;

    // Helper to determine if we have variables
    const hasVariables = !!(properties.variables && Object.keys(properties.variables).length > 0);

    // Build variables with pagination
    const buildVariablesWithPagination = function () {
        const baseVariables = properties.variables || {};
        const baseWithPagination = baseVariables as Record<string, unknown> & Partial<GraphQlVariablesWithPagination>;

        return {
            ...baseVariables,
            // By default, order by createdAt descending
            orderBy: {
                direction: 'Descending',
                key: 'createdAt',
                ...baseWithPagination.orderBy,
            },
            pagination: {
                itemsPerPage: queryPagination.itemsPerPage,
                itemIndex: queryPagination.itemsPerPage * (queryPagination.page - 1),
                ...baseWithPagination.pagination,
            },
        };
    };

    // Hooks
    const queryOptions = {
        enabled: properties.skip !== true,
        keepPreviousData: true,
    };

    // Build the query state
    const variablesWithPagination = hasVariables ? (buildVariablesWithPagination() as TVariables) : undefined;

    const queryState = makeGraphQlQuery(
        networkService,
        properties.queryDocument,
        variablesWithPagination,
        queryOptions,
        hasVariables,
    ) as ReturnType<typeof networkService.useGraphQlQuery<TResult, TVariables>>;

    // Find the data within the query
    // Our GraphQL responses are always in the form of data.$type.items and data.$type.pagination

    // First, loop through the data and see if there is a property that has an items property
    // If there is, then we will use that items property for our table, otherwise, we use nothing
    const data = Object.keys(queryState.data || {}).flatMap(function (key) {
        const dataValue = (queryState.data as Record<string, GraphQlTableData>)[key];
        return dataValue?.items?.map((item: GraphQlTableItem) => flattenObject({ ...item })) ?? [];
    });
    // console.log('data', data);

    // Memoize the columns
    const columns = React.useMemo<TableColumnProperties[]>(
        function () {
            const columns: TableColumnProperties[] = [];

            // Create the columns using the keys of the first item
            const columnIdentifiers = data.length > 0 && data[0] ? Object.keys(data[0]) : [];
            // console.log('columnIdentifiers', columnIdentifiers);

            // Loop through the column identifiers and create the columns
            columnIdentifiers.forEach(function (columnIdentifier) {
                let columnIdentifierForTitleCase = columnIdentifier;
                columnIdentifierForTitleCase = columnIdentifierForTitleCase.replaceAll('-', ' ');
                columnIdentifierForTitleCase = columnIdentifierForTitleCase.replaceAll('__typename', 'TypeName');

                const columnTitle = titleCase(columnIdentifierForTitleCase);

                columns.push({
                    identifier: columnIdentifier,
                    title: columnTitle,
                    type: inferTableColumnType(
                        columnIdentifier,
                        data[0]?.[columnIdentifier] as string | number | undefined,
                    ),
                });
            });

            // Sort the columns by their identifiers
            columns.sort(function (columnA, columnB) {
                if(columnA.identifier === 'id') return -1;
                if(columnB.identifier === 'id') return 1;
                if(columnA.identifier === 'createdAt') return 1;
                if(columnB.identifier === 'createdAt') return -1;
                if(columnA.identifier === 'updatedAt') return columnB.identifier === 'createdAt' ? -1 : 1;
                if(columnB.identifier === 'updatedAt') return columnA.identifier === 'id' ? 1 : -1;
                return 0;
            });

            return columns;
        },
        [data],
    );
    // console.log('columns', columns);

    // Create the rows from the data
    const rows: TableRowProperties[] =
        data.map(function (item) {
            // console.log('item', item);

            return {
                cells: columns.map(function (column) {
                    let cell = item[column.identifier];

                    // If the cell is not null
                    if(cell) {
                        // Objects
                        if(typeof cell === 'object') {
                            cell = JSON.stringify(cell);
                        }
                    }

                    return {
                        value: cell as string | undefined,
                    };
                }),
            };
        }) ?? [];
    // console.log('rows', rows);

    // Create the pagination object
    const queryStateDataPagination = (function () {
        const dataAsRecord = queryState.data as Record<string, GraphQlTableData> | undefined;
        if(!dataAsRecord) return undefined;

        const key = Object.keys(dataAsRecord).find(function (key) {
            return !!dataAsRecord[key]?.pagination;
        });
        return key ? dataAsRecord[key]?.pagination : undefined;
    })();
    // console.log('queryStateDataPagination', queryStateDataPagination);

    const pagination = queryStateDataPagination
        ? {
              ...queryStateDataPagination,
              onChange: async function (itemsPerPage: number, page: number) {
                  console.log('pagination onChange', { itemsPerPage, page });

                  // Invoke the provided onChange function
                  if(properties.pagination?.onChange) {
                      await properties.pagination.onChange(itemsPerPage, page);
                  }

                  // Since we're using keepPreviousData, we don't need fetchMore
                  // The parent component should update state which triggers a new query
              },
          }
        : undefined;
    // console.log('pagination', pagination);

    let key = '';
    if(queryState.isLoading) {
        key += 'loading';
    }
    else if(queryState.data) {
        key += 'loaded';
    }

    // console.log('queryState', queryState);

    // Render the component
    return (
        <>
            <Table
                key={key}
                {...properties}
                columns={columns}
                rows={rows}
                rowSelection={true}
                columnVisibility={true}
                // defaultVisibleColumnsIdentifiers={defaultVisibleColumnsIdentifiers}
                search={true}
                // filter={true}
                // filters={properties.filters}
                pagination={pagination}
                loading={queryState.isLoading || (!queryState.error && !queryState.data)}
                error={queryState.error as BaseError | undefined}
            />
        </>
    );
}
