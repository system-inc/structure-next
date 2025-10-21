// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableCellProperties, TableCell } from '@structure/source/components/tables/TableCell';
import { TableHeaderCellProperties, TableHeaderCell } from '@structure/source/components/tables/TableHeaderCell';
import { TableRowInputCheckbox } from '@structure/source/components/tables/TableRowInputCheckbox';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TableRow
export interface TableRowProperties extends React.HTMLAttributes<HTMLTableRowElement> {
    cells: TableHeaderCellProperties[] | TableCellProperties[];
    type?: 'Header' | 'Body' | 'Footer';
    visible?: boolean;

    // Selection
    selection?: boolean;
    selected?: boolean;
    onSelectChange?: (row: TableRowProperties, rowSelected: boolean) => void;

    // Selected rows
    selectedRowsIndexesSet?: Set<number>;
    rowsLength?: number;
    rowIndex?: number;
}
export function TableRow(properties: TableRowProperties) {
    // Defaults
    const type = properties.type || 'Body';
    const CellComponent = type === 'Header' || type === 'Footer' ? TableHeaderCell : TableCell;
    // console.log('cells', cells);

    // Function to intercept the onClick event
    const onClickIntercept = function (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) {
        // If the click originated from a td elemement
        if((event.target as HTMLElement).tagName === 'TD') {
            // Select the row
            if(properties.onSelectChange) {
                // console.log('Toggling row selection');
                properties.onSelectChange(properties, !properties.selected);
            }
        }

        // Call the onChange callback if it exists
        if(properties.onClick) {
            properties.onClick(event);
        }
    };

    // Render the component
    return (
        <tr
            className={mergeClassNames(
                'border-light-6 hover:bg-light-1 dark:border-dark-4 dark:hover:bg-dark-1 h-10 border-b text-sm last:border-b-0',
                properties.className,
            )}
            onClick={properties.selection ? onClickIntercept : undefined}
        >
            {/* Selection */}
            {properties.selection && (
                <CellComponent className="w-4 px-2 py-1 text-left">
                    <TableRowInputCheckbox {...properties} />
                </CellComponent>
            )}
            {properties.cells.map(function (cell, cellIndex) {
                return (
                    <CellComponent
                        key={cellIndex}
                        menu={cell.column?.sortable && type === 'Header' ? true : undefined}
                        {...cell}
                    />
                );
            })}
        </tr>
    );
}
