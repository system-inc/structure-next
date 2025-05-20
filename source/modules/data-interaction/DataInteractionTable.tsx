// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableInterface, Table } from '@structure/source/common/tables/Table';
import { TableColumnType, TableColumnInterface } from '@structure/source/common/tables/TableColumn';
// import { TableRowInterface } from '@structure/source/common/tables/TableRow';
import DatabaseAndTableFormInputSelects from '@structure/source/ops/pages/developers/databases/DatabaseAndTableFormInputSelects';
import Button from '@structure/source/common/buttons/Button';
import RefreshButton from '@structure/source/common/buttons/RefreshButton';
import { ColumnFilterGroupDataInterface } from '@structure/source/common/tables/ColumnFilterGroup';

// Dependencies - Assets
import BarGraphIcon from '@structure/assets/icons/analytics/BarGraphIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - API
import { useApolloClient, useQuery, ApolloError } from '@apollo/client';
import {
    DataInteractionDatabaseTableRowsDocument,
    OrderByDirection,
    ColumnFilterGroupInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { titleCase, uppercaseFirstCharacter } from '@structure/source/utilities/String';

// Component - DataInteractionTable
export interface DataInteractionTableInterface extends Omit<TableInterface, 'columns' | 'rows' | 'pagination'> {
    databaseName?: string;
    onDatabaseNameChange?: (databaseName?: string) => void;

    tableName?: string;
    onTableNameChange?: (tableName?: string) => void;

    filters?: ColumnFilterGroupDataInterface;
    onFiltersChange?: (filters?: ColumnFilterGroupDataInterface) => void;

    pagination?: {
        itemsPerPage?: number;
        page?: number;
        onChange: (itemsPerPage: number, page: number) => Promise<void>;
    };
}
export function DataInteractionTable(properties: DataInteractionTableInterface) {
    // Use the Apollo Client for refetching queries with the refresh button
    const apolloClient = useApolloClient();

    // State
    const [databaseName, setDatabaseName] = React.useState<string | undefined>(properties.databaseName);
    const [tableName, setTableName] = React.useState<string | undefined>(properties.tableName);
    const [queryPagination] = React.useState({
        page: properties.pagination?.page || 1,
        itemsPerPage: properties.pagination?.itemsPerPage || 10,
    });

    // Sanitized the filters so they are valid for the query
    let filters = undefined;
    if(properties.filters?.conditions[0]?.value) {
        filters = {
            ...properties.filters,
            conditions: properties.filters.conditions.map(function (condition) {
                return {
                    ...condition,
                    // Remove the ID
                    id: undefined,
                };
            }),
        } as ColumnFilterGroupInput; // use the GraphQL definition of ColumnFilterGroup here
    }

    // Hooks
    const queryState = useQuery(DataInteractionDatabaseTableRowsDocument, {
        skip: !databaseName || !tableName,
        variables: {
            databaseName: databaseName!,
            tableName: tableName!,
            pagination: {
                itemsPerPage: queryPagination.itemsPerPage,
                itemIndex: queryPagination.itemsPerPage * (queryPagination.page - 1),
                // By default, order by createdAt descending
                orderBy: [
                    {
                        key: 'createdAt',
                        direction: OrderByDirection.Descending,
                    },
                ],
            },
            filters,
        },
    });

    // Memoize the columns
    const columns = React.useMemo<TableColumnInterface[]>(
        function () {
            const columns: TableColumnInterface[] = [];
            queryState.data?.dataInteractionDatabaseTableRows?.columns?.forEach(function (column) {
                // Determine the column type
                let columnType: TableColumnType = TableColumnType.String;
                if(column.isKey) {
                    columnType = TableColumnType.Id;
                }
                else if(column.type === 'datetime') {
                    columnType = TableColumnType.DateTime;
                }
                else if(column.type === 'enum') {
                    columnType = TableColumnType.Option;
                }
                else if(column.type === 'int') {
                    columnType = TableColumnType.Number;
                }

                // Meta object to store additional information
                const meta: {
                    databaseName?: string;
                    tableName?: string;
                    url?: string;
                } = {
                    databaseName: databaseName,
                };

                // If the column is an ID
                if(columnType === TableColumnType.Id) {
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
                        meta['url'] = `/ops/developers/databases/${databaseName}/tables/${keyTableName}/rows/`;
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
        [databaseName, queryState.data?.dataInteractionDatabaseTableRows?.columns],
    );

    // Create the rows from the data
    const rows =
        queryState.data?.dataInteractionDatabaseTableRows.items?.map(function (item) {
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
    const pagination = queryState.data?.dataInteractionDatabaseTableRows.pagination
        ? {
              ...queryState.data?.dataInteractionDatabaseTableRows.pagination,
              // Add an onChange function
              onChange: async function (itemsPerPage: number, page: number) {
                  // Invoke the provided onChange function
                  if(properties.pagination?.onChange) {
                      await properties.pagination.onChange(itemsPerPage, page);
                  }

                  // console.log('onChange called with', { itemsPerPage, page });
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
                      //   console.log('fetchMore resolved', queryStateData.data);
                  } catch {
                      //   console.error('fetchMore failed', error);
                  }
              },
          }
        : undefined;
    // console.log('pagination', pagination);

    // Determine if there is a relations table as well
    const relations = queryState.data?.dataInteractionDatabaseTableRows?.relations;
    let relationsColumns: TableColumnInterface[] = [];
    // let relationsRows: TableRowInterface[] = [];
    if(relations && relations[0]) {
        // Create the columns from the data
        relationsColumns = Object.keys(relations[0])
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
        // relationsRows =
        //     queryState.data?.dataInteractionDatabaseTableRows?.relations?.map(function (item: any) {
        //         return {
        //             // Map over the columns
        //             cells: relationsColumns?.map(function (column, columnIndex) {
        //                 // Get the value for the cell
        //                 const value = item[column.identifier];

        //                 // Create a URL if the column is a table name
        //                 let url = undefined;
        //                 if(value && (column.identifier === 'tableName' || column.identifier === 'inverseTableName')) {
        //                     url = '/ops/developers/databases/' + databaseName + '/tables/' + value;
        //                 }

        //                 // Return the cell
        //                 return {
        //                     value: value,
        //                     url,
        //                 };
        //             }),
        //         };
        //     }) ?? [];
    }

    // console.log('queryState', queryState);

    // Render the component
    return (
        <>
            <div className="flex">
                <div className="flex flex-grow space-x-2">
                    <DatabaseAndTableFormInputSelects
                        className="mb-4"
                        databaseNameFormInputSelectProperties={{
                            className: 'w-48',
                            defaultValue: databaseName ?? undefined,
                        }}
                        tableNameFormInputSelectProperties={{
                            className: 'w-80',
                            defaultValue: tableName ?? undefined,
                        }}
                        onChange={function (databaseName?: string, tableName?: string) {
                            // console.log('onChange', databaseName, tableName);

                            // Set the pagination to the first page
                            if(properties.pagination?.onChange) {
                                properties.pagination.onChange(properties.pagination?.itemsPerPage ?? 10, 1);
                            }

                            // Set the database name
                            setDatabaseName(databaseName);
                            if(properties.onDatabaseNameChange) {
                                properties.onDatabaseNameChange(databaseName);
                            }

                            // Set the table name
                            setTableName(tableName);
                            if(properties.onTableNameChange) {
                                properties.onTableNameChange(tableName);
                            }
                        }}
                    />
                </div>
                <div className="flex space-x-2">
                    <Button
                        className="mt-[22px]"
                        icon={PlusIcon}
                        iconPosition="left"
                        iconClassName="h-3 w-3"
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
                            `/ops/developers/metrics/?dataSources={"databaseName":"` +
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

            <Table
                {...properties}
                columns={columns}
                rows={rows}
                rowSelection={true}
                columnVisibility={true}
                // defaultVisibleColumnsIdentifiers={defaultVisibleColumnsIdentifiers}
                search={true}
                filter={true}
                sortable={true}
                // filters={properties.filters}
                pagination={pagination}
                loading={queryState.loading || (!queryState.error && !queryState.data)}
                error={queryState.error as ApolloError}
            />

            {/* FIXME: Uncomment after fixing above table rendering issues. */}
            {/* {relations && relationsRows.length > 0 && (
                <>
                    <h3 className="mt-8">{tableName} Relations</h3>
                    <Table
                        key={queryState.loading ? 'relationsLoading' : 'relationsLoaded'}
                        columns={relationsColumns}
                        rows={relationsRows}
                        loading={queryState.loading}
                    />
                </>
            )} */}
        </>
    );
}

// Export - Default
export default DataInteractionTable;
