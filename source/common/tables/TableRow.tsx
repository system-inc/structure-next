// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableCellInterface, TableCell } from '@structure/source/common/tables/TableCell';
import { TableHeaderCellInterface, TableHeaderCell } from '@structure/source/common/tables/TableHeaderCell';
import { ButtonInterface, Button } from '@structure/source/common/interactions/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - TableRow
export interface TableRowInterface extends React.HTMLAttributes<HTMLTableRowElement> {
    cells: TableHeaderCellInterface[] | TableCellInterface[];
    type?: 'Header' | 'Body' | 'Footer';
    visible?: boolean;

    // Selection
    selection?: boolean;
    selected?: boolean;
    onSelectChange?: (row: TableRowInterface, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export function TableRow(properties: TableRowInterface) {
    let cells = properties.cells;

    // Defaults
    let type = properties.type || 'Body';
    let CellComponent = type === 'Header' || type === 'Footer' ? TableHeaderCell : TableCell;
    // console.log('cells', cells);

    // Render the component
    return (
        <tr
            className={mergeClassNames(
                'h-10 border-b border-light-6 text-sm last:border-b-0 hover:bg-light-1 dark:border-dark-4 dark:hover:bg-dark-1',
                properties.className,
            )}
        >
            {/* Selection */}
            {properties.selection && (
                <CellComponent className="w-4 px-2 py-1 text-left">
                    <input
                        type="checkbox"
                        checked={properties.selected}
                        onChange={function (event) {
                            if(properties.onSelectChange) {
                                properties.onSelectChange(properties, event);
                            }
                        }}
                    />
                </CellComponent>
            )}
            {cells.map(function (cell, cellIndex) {
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

// Export - Default
export default TableRow;
