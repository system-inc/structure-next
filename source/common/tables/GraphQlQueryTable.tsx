// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableInterface, Table } from '@structure/source/common/tables/Table';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableRowInterface } from '@structure/source/common/tables/TableRow';

// Dependencies - API
import { useQuery, ApolloError, TypedDocumentNode } from '@apollo/client';

// Dependencies - Utilities
import { flattenObject } from '@structure/source/utilities/Object';
import { titleCase, uppercaseFirstCharacter } from '@structure/source/utilities/String';

// Component - GraphQlMutationForm
export interface GraphQlQueryTableInterface<VariableType>
    extends Omit<TableInterface, 'columns' | 'rows' | 'pagination'> {
    queryDocument: TypedDocumentNode<any, VariableType>;
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
    const [queryPagination, setQueryPaginationState] = React.useState({
        page: properties.pagination?.page || 1,
        itemsPerPage: properties.pagination?.itemsPerPage || 10,
    });

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

    // Defaults
    const hideTypeColumns = properties.hideTypeColumns ?? true;

    // Find the data within the query
    // Our GraphQL responses are always in the form of data.$type.items and data.$type.pagination

    // First, loop through the data and see if there is a property that has an items property
    // If there is, then we will use that items property for our table, otherwise, we use nothing
    const data = Object.keys(queryState.data || {}).flatMap(
        (key) => queryState.data[key].items?.map((item: any) => flattenObject({ ...item })) ?? [],
    );
    // console.log('data', data);

    // Create the columns from the data
    let columns: TableColumnInterface[] = [];

    // Prefer to use the columns property if it is provided
    if(
        queryState.data &&
        queryState.data.dataInteractionDatabaseTableRows &&
        queryState.data.dataInteractionDatabaseTableRows.columns
    ) {
        queryState.data.dataInteractionDatabaseTableRows.columns.forEach(function (column: any) {
            // Determine the column type
            let columnType = column.type;
            if(column.isKey) {
                columnType = 'id';
            }
            else if(columnType === 'datetime') {
                columnType = 'dateTime';
            }
            else if(columnType === 'enum') {
                columnType = 'option';
            }
            else if(columnType === 'int') {
                columnType = 'number';
            }

            // Meta object to store additional information
            let meta: any = {
                databaseName: properties.variables.databaseName,
            };

            // If the column is an ID
            if(columnType === 'id') {
                let keyTableName = column.keyTableName;

                // If the column is an ID column, and there is no key table name
                if(!keyTableName) {
                    // Guess the key table name from the column name
                    keyTableName = uppercaseFirstCharacter(column.name).replace('Id', '');
                }

                if(keyTableName) {
                    // Add the table name to the meta object
                    meta['tableName'] = keyTableName;

                    // Add the URL to the meta object
                    meta['url'] =
                        `/internal/developers/databases/${properties.variables.databaseName}/tables/${keyTableName}/rows/`;
                }
            }

            // Get the possible values
            const possibleValues = column.possibleValues
                ? column.possibleValues.map(function (possibleValue: string) {
                      return {
                          value: possibleValue,
                          title: possibleValue,
                      };
                  })
                : undefined;

            // Add the column
            columns.push({
                identifier: column.name,
                title: titleCase(column.name),
                type: columnType,
                possibleValues,
                meta,
            });
        });
    }
    // Otherwise, create the columns using the keys of the first item
    else {
        // Get the column identifiers from the first item
        const columnIdentifiers = data.length > 0 ? Object.keys(data[0]) : [];
        // console.log('columnIdentifiers', columnIdentifiers);

        // Loop through the column identifiers and create the columns
        columnIdentifiers.forEach(function (columnIdentifier, columnIdentifierIndex) {
            columns.push({
                identifier: columnIdentifier,
                title: titleCase(columnIdentifier),
            });
        });
    }

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
    // console.log('columns', columns);

    // Create the rows from the data
    const rows = data.map(function (item) {
        // console.log('item', item);

        return {
            cells: columns.map(function (column, columnIndex) {
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
    });
    // console.log('rows', rows);

    // By default, hide the Type columns (only if defaultVisibleColumnsIdentifiers is not provided in the properties)
    let defaultVisibleColumnsIdentifiers = properties.defaultVisibleColumnsIdentifiers;
    // if(!defaultVisibleColumnsIdentifiers && hideTypeColumns) {
    //     defaultVisibleColumnsIdentifiers = columnIdentifiers.filter(function (column) {
    //         return !column.includes('Type') && !column.includes('- Type');
    //     });
    // }

    // Create the pagination object
    const queryStateDataPagination = (function () {
        const key = Object.keys(queryState.data || {}).find(function (key) {
            return !!queryState.data[key].pagination;
        });
        return key ? queryState.data[key].pagination : undefined;
    })();
    const pagination = queryStateDataPagination
        ? {
              itemsTotal: queryStateDataPagination.itemsTotal,
              itemsPerPage: queryStateDataPagination.itemsPerPage,
              pagesTotal: queryStateDataPagination.pagesTotal,
              page: queryStateDataPagination.page,
              onChange: async function (itemsPerPage: number, page: number) {
                  // Invoke the provided onChange function
                  if(properties.pagination?.onChange) {
                      await properties.pagination.onChange(itemsPerPage, page);
                  }

                  //   console.log('onChange called with', { itemsPerPage, page });
                  try {
                      const queryStateData = await queryState.fetchMore({
                          variables: {
                              pagination: {
                                  itemIndex: (page - 1) * itemsPerPage,
                                  itemsPerPage: itemsPerPage,
                              },
                          },
                          updateQuery: function (previousResult, { fetchMoreResult }) {
                              //   console.log('updateQuery called with', { previousResult, fetchMoreResult });
                              return fetchMoreResult;
                          },
                      });
                      //   console.log('fetchMore resolved', queryStateData.data);
                  }
                  catch(error) {
                      //   console.error('fetchMore failed', error);
                  }
              },
          }
        : undefined;
    // console.log('pagination', pagination);

    // Determine if there is a relations table as well
    let relations =
        queryState.data &&
        queryState.data.dataInteractionDatabaseTableRows &&
        queryState.data.dataInteractionDatabaseTableRows.relations;
    let relationsColumns: TableColumnInterface[] = [];
    let relationsRows: TableRowInterface[] = [];
    if(relations && queryState.data.dataInteractionDatabaseTableRows.relations.length > 0) {
        // Create the columns from the data
        relationsColumns = Object.keys(queryState.data.dataInteractionDatabaseTableRows.relations[0])
            // Remove the __typename column
            .filter(function (columnIdentifier) {
                return !columnIdentifier.includes('__typename');
            })
            .map(function (columnIdentifier) {
                return {
                    identifier: columnIdentifier,
                    title: titleCase(columnIdentifier),
                };
            });

        // Relation columns order
        const relationsColumnsOrder = [
            'tableName',
            'type',
            'fieldName',
            'inverseTableName',
            'inverseType',
            'inverseFieldName',
        ];

        // Sort the relations columns using the relationsColumnsOrder
        relationsColumns.sort(function (columnA, columnB) {
            return (
                relationsColumnsOrder.indexOf(columnA.identifier) - relationsColumnsOrder.indexOf(columnB.identifier)
            );
        });

        // Create the rows from the data
        relationsRows = queryState.data.dataInteractionDatabaseTableRows.relations.map(function (item: any) {
            return {
                // Map over the columns
                cells: relationsColumns?.map(function (column, columnIndex) {
                    // Get the value for the cell
                    let value = item[column.identifier];

                    // Create a URL if the column is a table name
                    let url = undefined;
                    if(value && (column.identifier === 'tableName' || column.identifier === 'inverseTableName')) {
                        url =
                            '/internal/developers/databases/' + properties.variables.databaseName + '/tables/' + value;
                    }

                    return {
                        value: value,
                        url,
                    };
                }),
            };
        });
    }

    // console.log('queryState', queryState);

    // Render the component
    return (
        <>
            <Table
                key={queryState.loading ? 'loading' : 'loaded'}
                {...properties}
                columns={columns}
                rows={rows}
                rowSelection={true}
                columnVisibility={true}
                // defaultVisibleColumnsIdentifiers={defaultVisibleColumnsIdentifiers}
                search={true}
                filter={true}
                // filters={properties.filters}
                pagination={pagination}
                loading={queryState.loading || !queryState.data}
            />

            {relations && relationsRows.length > 0 && (
                <>
                    <h3 className="mt-8">{properties.variables.tableName} Relations</h3>
                    <Table
                        key={queryState.loading ? 'relationsLoading' : 'relationsLoaded'}
                        columns={relationsColumns}
                        rows={relationsRows}
                        loading={queryState.loading}
                    />
                </>
            )}
        </>
    );
}

// Export - Default
export default GraphQlQueryTable;
