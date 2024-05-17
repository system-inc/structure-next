// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableInterface, Table } from '@structure/source/common/tables/Table';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableRowInterface } from '@structure/source/common/tables/TableRow';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/String';

// Component - Table
export interface ObjectTableInterface extends Omit<TableInterface, 'columns' | 'rows'> {
    object: {
        [key: string]: any;
    };
}
export function ObjectTable(properties: ObjectTableInterface) {
    // Variables to store our rows and columns
    const columns: TableColumnInterface[] = [
        {
            identifier: 'key',
            title: 'Key',
        },
        {
            identifier: 'value',
            title: 'Value',
        },
    ];
    const rows: TableRowInterface[] = [];

    // Add a row for each key in the object
    Object.keys(properties.object)
        .sort()
        .forEach(function (key) {
            let value = properties.object[key];
            if(value && typeof value === 'object') {
                // value = JSON.stringify(value);
                value = <ObjectTable object={value} />;
            }

            let row = {
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

    // Render the component
    return <Table columns={columns} rows={rows} {...properties} />;
}

// Export - Default
export default ObjectTable;
