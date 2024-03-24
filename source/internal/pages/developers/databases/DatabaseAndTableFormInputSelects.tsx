'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputSelectInterface, FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { dataInteractionDatabaseTablesQueryDocument } from '@structure/source/modules/data-interaction/api/DataInteractionDocuments';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - DatabaseAndTableFormInputSelects
export interface DatabaseAndTableFormInputSelectsInterface {
    className?: string;
    databaseNameFormInputSelectProperties?: Omit<FormInputSelectInterface, 'id' | 'items'>;
    tableNameFormInputSelectProperties?: Omit<FormInputSelectInterface, 'id' | 'items'>;
    onChange?: (databaseName?: string, tableName?: string) => void;
}
export function DatabaseAndTableFormInputSelects(properties: DatabaseAndTableFormInputSelectsInterface) {
    // State
    const [databaseItems, setDatabaseItems] = React.useState<MenuItemInterface[]>([]);
    const [tableItems, setTableItems] = React.useState<MenuItemInterface[]>([]);
    const [selectedDatabaseName, setSelectedDatabaseName] = React.useState<string | undefined>(undefined);
    const [selectedTableName, setSelectedTableName] = React.useState<string | undefined>(undefined);

    // Get the databases from the GraphQL API
    const dataInteractionDatabaseTablesQueryState = useQuery(dataInteractionDatabaseTablesQueryDocument, {
        variables: {
            pagination: {
                // TODO: This is probably bad and will break with lots of tables
                itemsPerPage: 1000,
            },
        },
    });

    // Extract databases and tables from the query
    const databasesAndTables = React.useMemo(
        function () {
            // Data structure for the databases and tables
            const databasesAndTablesObject: { [databaseName: string]: string[] } = {};

            // Items for the database select
            const databaseItems: MenuItemInterface[] = [];

            // Determine the selected database default value
            let databaseNameDefaultValue = properties.databaseNameFormInputSelectProperties?.defaultValue;

            // Validate the provided default value
            if(databaseNameDefaultValue) {
                // Loop over the items to see if the default value is in the list of database names
                let selectedDatabaseDefaultValueFound = false;
                dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items.forEach(
                    function (item, index) {
                        if(item.databaseName === databaseNameDefaultValue) {
                            selectedDatabaseDefaultValueFound = true;
                        }
                    },
                );

                // If the default value is not in the list of database names, set the first database name as the default value
                if(!selectedDatabaseDefaultValueFound) {
                    databaseNameDefaultValue =
                        dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items?.[0]
                            ?.databaseName;
                }
            }
            // If no default value was provided, set the first database name as the default value
            else {
                databaseNameDefaultValue =
                    dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items?.[0]
                        ?.databaseName;
            }

            // Set the selected database name
            setSelectedDatabaseName(databaseNameDefaultValue);

            // Loop over the query results with a reference to the index
            dataInteractionDatabaseTablesQueryState.data?.dataInteractionDatabaseTables?.items.forEach(
                function (item, index) {
                    // Create the entry for the database if it doesn't exist
                    if(!databasesAndTablesObject[item.databaseName]) {
                        databasesAndTablesObject[item.databaseName] = [];

                        // Add the database to the array for the database select
                        databaseItems.push({
                            value: item.databaseName,
                            content: item.databaseName,
                        });
                    }

                    // Add the table to the tables array for the database
                    databasesAndTablesObject[item.databaseName]?.push(item.tableName);
                },
            );

            // Set the database items
            setDatabaseItems(databaseItems);
            // console.log('databaseItems', databaseItems);

            return databasesAndTablesObject;
        },
        [dataInteractionDatabaseTablesQueryState.data, properties.databaseNameFormInputSelectProperties?.defaultValue],
    );

    // Listen to changes to the selected database
    const propertiesOnChange = properties.onChange;
    React.useEffect(
        function () {
            // Items for the table select
            const tableItems: MenuItemInterface[] = [];

            if(selectedDatabaseName !== undefined) {
                // Get the tables for the selected database
                const tables = databasesAndTables[selectedDatabaseName];

                // Loop over the tables with a reference to the index and add them to the array
                tables?.forEach(function (table, index) {
                    tableItems.push({
                        value: table,
                        content: table,
                    });
                });

                // Determine the selected table default value
                let tableNameDefaultValue = properties.tableNameFormInputSelectProperties?.defaultValue;

                // Validate the provided default value
                if(tableNameDefaultValue) {
                    // If the default value is not in the list of tables, set the first table as the default value
                    if(!tables?.includes(tableNameDefaultValue)) {
                        tableNameDefaultValue = tables?.[0];
                    }
                }
                else {
                    tableNameDefaultValue = tables?.[0];
                }

                setSelectedTableName(tableNameDefaultValue);

                // Run the onChange callback
                if(propertiesOnChange) {
                    propertiesOnChange(selectedDatabaseName, tableNameDefaultValue);
                }
            }

            // Set the table items
            setTableItems(tableItems);
            // console.log('tableItems', tableItems);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedDatabaseName, databasesAndTables],
    );

    // Render the component
    return (
        <>
            <FormInputSelect
                key={'database-' + selectedDatabaseName + tableItems.length}
                id="databaseName"
                items={databaseItems}
                defaultValue={selectedDatabaseName}
                loadingItems={dataInteractionDatabaseTablesQueryState.loading}
                loadingItemsMessage="Loading databases..."
                placeholder="Database"
                label="Database"
                search={true}
                onChange={(value, event) => {
                    // console.log('Setting selected database to ', value, event);
                    setSelectedDatabaseName(value);
                    if(properties.onChange) {
                        properties.onChange(value, selectedTableName);
                    }
                }}
                {...properties.databaseNameFormInputSelectProperties}
                className={mergeClassNames(
                    properties.className,
                    properties.databaseNameFormInputSelectProperties?.className,
                )}
            />
            <FormInputSelect
                key={'table-' + selectedDatabaseName + tableItems.length}
                id="tableTable"
                items={tableItems}
                defaultValue={selectedTableName}
                loadingItems={dataInteractionDatabaseTablesQueryState.loading}
                loadingItemsMessage="Loading tables..."
                placeholder="Table"
                label="Table"
                search={true}
                onChange={function (value, event) {
                    // console.log('Setting selected table to ', value, event);
                    setSelectedTableName(value);
                    if(properties.onChange) {
                        properties.onChange(selectedDatabaseName, value);
                    }
                }}
                {...properties.tableNameFormInputSelectProperties}
                className={mergeClassNames(
                    properties.className,
                    properties.tableNameFormInputSelectProperties?.className,
                )}
            />
        </>
    );
}

// Export - Default
export default DatabaseAndTableFormInputSelects;
