// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableProperties, Table } from '@structure/source/common/tables/Table';
import { TableColumnProperties } from '@structure/source/common/tables/TableColumn';
import { TableRowProperties } from '@structure/source/common/tables/TableRow';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/type/String';

// Component - Table
export interface ObjectTableProperties extends Omit<TableProperties, 'columns' | 'rows'> {
    object: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}
export function ObjectTable(properties: ObjectTableProperties) {
    // Columns
    let columns: TableColumnProperties[] = [];

    // Determine if the object is an array of objects and every item has the same keys
    let isArrayOfSimilarObjects = false;

    // Store the keys of all the objects
    const arrayOfSimilarObjectsKeys: { [key: string]: boolean } = {};

    // Check if the object is an array of objects
    if(Array.isArray(properties.object) && properties.object.length > 0) {
        // If the first item is an object
        if(typeof properties.object[0] === 'object') {
            // Get the keys of the first object
            const keys = Object.keys(properties.object[0]);

            // Check if every object has the same keys
            isArrayOfSimilarObjects = properties.object.every(function (item) {
                return Object.keys(item).every(function (key) {
                    // Store the keys
                    arrayOfSimilarObjectsKeys[key] = true;
                    return keys.includes(key);
                });
            });
        }
    }

    // If the object is an array of objects
    if(isArrayOfSimilarObjects) {
        columns.push({
            identifier: 'index',
            title: 'Index',
        });

        // Columns is the arrayOfSimilarObjectsKeys sorted
        Object.keys(arrayOfSimilarObjectsKeys)
            .sort()
            .map(function (key) {
                columns.push({
                    identifier: key,
                    title: titleCase(key),
                });
            });
    }
    else {
        // Variables to store our rows and columns
        columns = [
            {
                identifier: 'key',
                title: 'Key',
            },
            {
                identifier: 'value',
                title: 'Value',
            },
        ];
    }

    const rows: TableRowProperties[] = [];

    // If the object is an array of objects
    if(isArrayOfSimilarObjects) {
        // Add a row for each object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties.object.forEach(function (item: any, itemIndex: number) {
            const row: TableRowProperties = {
                cells: [],
            };

            columns.forEach(function (column) {
                let value = item[column.identifier];
                if(column.identifier === 'index') {
                    value = String(itemIndex);
                }
                else if(value && typeof value === 'object') {
                    // value = JSON.stringify(value);
                    value = <ObjectTable object={value} />;
                }

                row.cells.push({
                    column: column,
                    value: value,
                });
            });

            rows.push(row);
        });
    }
    else {
        // Add a row for each key in the object
        Object.keys(properties.object)
            .sort()
            .forEach(function (key) {
                let value = properties.object[key];
                if(value && typeof value === 'object') {
                    // value = JSON.stringify(value);
                    value = <ObjectTable object={value} />;
                }
                else if(value === true) {
                    value = 'true';
                }
                else if(value === false) {
                    value = 'false';
                }

                const row = {
                    cells: [
                        {
                            column: columns[0],
                            value: key,
                        },
                        {
                            column: columns[1],
                            value: value,
                        },
                    ],
                };

                rows.push(row);
            });
    }

    // Render the component
    return <Table columns={columns} rows={rows} {...properties} />;
}
