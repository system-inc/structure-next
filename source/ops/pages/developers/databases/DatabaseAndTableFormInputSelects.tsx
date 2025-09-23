'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputSelectProperties, FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { MenuItemProperties } from '@structure/source/common/menus/MenuItem';

// Dependencies - Hooks
import { useDataInteractionDatabasesRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabasesRequest';
import { useDataInteractionDatabaseTablesRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTablesRequest';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - DatabaseAndTableFormInputSelects
export interface DatabaseAndTableFormInputSelectsProperties {
    className?: string;
    databaseNameFormInputSelectProperties?: Omit<FormInputSelectProperties, 'id' | 'items'>;
    tableNameFormInputSelectProperties?: Omit<FormInputSelectProperties, 'id' | 'items'>;
    onChange?: (databaseName?: string, tableName?: string) => void;
}
export function DatabaseAndTableFormInputSelects(properties: DatabaseAndTableFormInputSelectsProperties) {
    // State
    const [selectedDatabaseName, setSelectedDatabaseName] = React.useState<string | undefined>(
        properties.databaseNameFormInputSelectProperties?.defaultValue,
    );
    const [selectedTableName, setSelectedTableName] = React.useState<string | undefined>(
        properties.tableNameFormInputSelectProperties?.defaultValue,
    );

    // Get the databases from the API
    const dataInteractionDatabasesRequest = useDataInteractionDatabasesRequest();

    // Get the tables for the selected database
    const dataInteractionDatabaseTablesRequest = useDataInteractionDatabaseTablesRequest(
        selectedDatabaseName || '',
        { itemsPerPage: 1000 },
        { enabled: !!selectedDatabaseName },
    );

    // Create database items from the databases query
    const databaseItems = React.useMemo(
        function () {
            const items: MenuItemProperties[] = [];

            dataInteractionDatabasesRequest.data?.dataInteractionDatabases.items?.forEach(function (database) {
                items.push({
                    value: database.databaseName,
                    content: database.databaseName,
                });
            });

            return items;
        },
        [dataInteractionDatabasesRequest.data],
    );

    // Create table items from the tables query
    const tableItems = React.useMemo(
        function () {
            const items: MenuItemProperties[] = [];

            dataInteractionDatabaseTablesRequest.data?.dataInteractionDatabaseTables?.items?.forEach(function (table) {
                items.push({
                    value: table.tableName,
                    content: table.tableName,
                });
            });

            return items;
        },
        [dataInteractionDatabaseTablesRequest.data],
    );

    // Set the selected database when databases load if no default was provided
    React.useEffect(
        function () {
            if(!selectedDatabaseName && databaseItems.length > 0) {
                const firstDatabase = databaseItems[0]?.value;
                if(firstDatabase) {
                    setSelectedDatabaseName(firstDatabase);
                }
            }
        },
        [selectedDatabaseName, databaseItems],
    );

    // Set the selected table when tables load or database changes
    React.useEffect(
        function () {
            if(selectedDatabaseName && tableItems.length > 0) {
                // Check if current selection is still valid
                const currentTableStillExists = tableItems.some((item) => item.value === selectedTableName);

                // If no table selected or current selection is invalid, select first table
                if(!selectedTableName || !currentTableStillExists) {
                    const firstTable = tableItems[0]?.value;
                    if(firstTable) {
                        setSelectedTableName(firstTable);
                        // Run the onChange callback
                        if(properties.onChange) {
                            properties.onChange(selectedDatabaseName, firstTable);
                        }
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedDatabaseName, tableItems],
    );

    // Render the component
    return (
        <>
            <FormInputSelect
                key={'database-' + selectedDatabaseName + databaseItems.length}
                id="databaseName"
                items={databaseItems}
                defaultValue={selectedDatabaseName}
                loadingItems={dataInteractionDatabasesRequest.isLoading}
                loadingItemsMessage="Loading databases..."
                placeholder="Database"
                label="Database"
                search={true}
                onChange={function (value) {
                    // console.log('Setting selected database to ', value, event);
                    setSelectedDatabaseName(value);
                    setSelectedTableName(undefined); // Clear table selection when database changes
                    if(properties.onChange) {
                        properties.onChange(value, undefined);
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
                id="tableName"
                items={tableItems}
                defaultValue={selectedTableName}
                loadingItems={dataInteractionDatabaseTablesRequest.isLoading}
                loadingItemsMessage="Loading tables..."
                placeholder="Table"
                label="Table"
                search={true}
                onChange={function (value) {
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
