// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableInterface, Table } from '@structure/source/common/tables/Table';
import { TableColumnInterface, inferTableColumnType } from '@structure/source/common/tables/TableColumn';
import { TableRowInterface } from '@structure/source/common/tables/TableRow';

// Dependencies - API
import { useQuery, ApolloError, TypedDocumentNode } from '@apollo/client';

// Dependencies - Utilities
import { flattenObject } from '@structure/source/utilities/Object';
import { titleCase } from '@structure/source/utilities/String';

// Component - GraphQlQueryTable
export interface GraphQlQueryTableInterface<VariableType>
    extends Omit<TableInterface, 'columns' | 'rows' | 'pagination'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryDocument: TypedDocumentNode<any, VariableType>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: any;
    skip?: boolean;
    pagination?: {
        itemsPerPage?: number;
        page?: number;
        onChange: (itemsPerPage: number, page: number) => Promise<void>;
    };

    hideTypeColumns?: boolean;
}
export function GraphQlQueryTable<VariableType>(properties: GraphQlQueryTableInterface<VariableType>) {
    // State
    const [queryPagination] = React.useState({
        page: properties.pagination?.page || 1,
        itemsPerPage: properties.pagination?.itemsPerPage || 10,
    });

    // Defaults
    // const hideTypeColumns = properties.hideTypeColumns ?? true;

    // Hooks
    const queryState = useQuery(properties.queryDocument, {
        skip: properties.skip,
        variables: {
            ...properties.variables,
            // By default, order by createdAt descending
            orderBy: {
                direction: 'Descending',
                key: 'createdAt',
                ...properties.variables?.orderBy,
            },
            pagination: {
                itemsPerPage: queryPagination.itemsPerPage,
                itemIndex: queryPagination.itemsPerPage * (queryPagination.page - 1),
                ...properties.variables?.pagination,
            },
        },
    });

    // Find the data within the query
    // Our GraphQL responses are always in the form of data.$type.items and data.$type.pagination

    // First, loop through the data and see if there is a property that has an items property
    // If there is, then we will use that items property for our table, otherwise, we use nothing
    const data = Object.keys(queryState.data || {}).flatMap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key) => queryState.data[key].items?.map((item: any) => flattenObject({ ...item })) ?? [],
    );
    // console.log('data', data);

    // Memoize the columns
    const columns = React.useMemo<TableColumnInterface[]>(
        function () {
            const columns: TableColumnInterface[] = [];

            // Create the columns using the keys of the first item
            const columnIdentifiers = data.length > 0 ? Object.keys(data[0]) : [];
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
                    type: inferTableColumnType(columnIdentifier, data[0][columnIdentifier]),
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
    const rows: TableRowInterface[] =
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
                        value: cell,
                    };
                }),
            };
        }) ?? [];
    // console.log('rows', rows);

    // Create the pagination object
    const queryStateDataPagination = (function () {
        const key = Object.keys(queryState.data || {}).find(function (key) {
            return !!queryState.data[key].pagination;
        });
        return key ? queryState.data[key].pagination : undefined;
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

                  //   console.log('onChange called with', { itemsPerPage, page });
                  try {
                      await queryState.fetchMore({
                          variables: {
                              pagination: {
                                  itemIndex: (page - 1) * itemsPerPage,
                                  itemsPerPage: itemsPerPage,
                              },
                          },
                          updateQuery: function (previousResult, options) {
                              //   console.log('updateQuery called with', { previousResult, fetchMoreResult: options.fetchMoreResult });
                              return options.fetchMoreResult;
                          },
                      });
                      //   console.log('fetchMore resolved');
                  } catch {
                      //   console.error('fetchMore failed');
                  }
              },
          }
        : undefined;
    // console.log('pagination', pagination);

    let key = '';
    if(queryState.loading) {
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
                loading={queryState.loading || (!queryState.error && !queryState.data)}
                error={queryState.error as ApolloError}
            />
        </>
    );
}

// Export - Default
export default GraphQlQueryTable;
