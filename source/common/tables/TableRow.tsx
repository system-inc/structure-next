// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableCellInterface, TableCell } from '@structure/source/common/tables/TableCell';
import { TableHeaderCellInterface, TableHeaderCell } from '@structure/source/common/tables/TableHeaderCell';
import {
    InputCheckboxState,
    InputCheckbox,
    InputCheckboxReferenceInterface,
} from '@structure/source/common/forms/InputCheckbox';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Dependencies - State Management
import { useSnapshot as useValtioState, subscribe as subscribeToValtioState } from 'valtio';
// import { subscribeKey as subscribeToValtioStateKey } from 'valtio/utils';

// Table State Management
import { tableState } from '@structure/source/common/tables/Table';

// Component - TableRow
export interface TableRowInterface extends React.HTMLAttributes<HTMLTableRowElement> {
    cells: TableHeaderCellInterface[] | TableCellInterface[];
    type?: 'Header' | 'Body' | 'Footer';
    visible?: boolean;

    // Selection
    selection?: boolean;
    selected?: boolean;
    onSelectChange?: (row: TableRowInterface, rowSelected: boolean) => void;
    rowIndex?: number;
}
export function TableRow(properties: TableRowInterface) {
    const cells = properties.cells;

    // Defaults
    const type = properties.type || 'Body';
    const CellComponent = type === 'Header' || type === 'Footer' ? TableHeaderCell : TableCell;
    // console.log('cells', cells);

    // Function to intercept the onClick event
    const onClickIntercept = React.useCallback(
        function (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) {
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
        },
        [properties],
    );

    // Render the component
    return (
        <tr
            className={mergeClassNames(
                'h-10 border-b border-light-6 text-sm last:border-b-0 hover:bg-light-1 dark:border-dark-4 dark:hover:bg-dark-1',
                properties.className,
            )}
            onClick={properties.selection ? onClickIntercept : undefined}
        >
            {/* Selection */}
            {properties.selection && (
                <CellComponent className="w-4 px-2 py-1 text-left">
                    <TableRowCheckbox row={properties} type={properties.type} />
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

/**
 * Break up the TableRow component into smaller components to avoid re-rendering the entire table row when a part is updated.
 */

// Component - TableRowCheckbox
interface TableRowCheckboxInterface {
    row: TableRowInterface;
    type?: 'Header' | 'Body' | 'Footer';
}
function TableRowCheckbox(properties: TableRowCheckboxInterface) {
    // Checkbox reference
    const checkboxRef = React.useRef<InputCheckboxReferenceInterface>(null);

    React.useEffect(
        function () {
            if(checkboxRef.current) {
                const unsubscribe = subscribeToValtioState(tableState, function (value) {
                    console.log('Updating checkbox state', value);
                    const rowIndex = properties.row.rowIndex;
                    const selected =
                        tableState.selectedRowsIndexesSet.has(rowIndex ?? -1) ||
                        (properties.type === 'Header' &&
                            (tableState.allRowsSelected ||
                                tableState.selectedRowsIndexesSet.size === tableState.formattedRowsData.length));
                    checkboxRef.current?.setValue(selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked);
                });
                return function () {
                    unsubscribe();
                };
            }
        },
        [properties.row.rowIndex, properties.type],
    );

    // Render the component
    return (
        <InputCheckbox
            ref={checkboxRef}
            tabIndex={0}
            defaultValue={properties.row.selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
            onChange={function (value, event) {
                if(properties.row.onSelectChange) {
                    properties.row.onSelectChange(properties.row, value === InputCheckboxState.Checked ? true : false);
                }
            }}
        />
    );
}
