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
import { useAtom, useAtomValue } from 'jotai';
import {
    allRowsSelectedAtom,
    filteredFormattedRowsDataAtom,
    formattedColumnsAtom,
    selectedRowsIndexesSetAtom,
    showSelectColumnAtom,
} from './Table';

// Component - TableRow
export interface TableRowInterface extends React.HTMLAttributes<HTMLTableRowElement> {
    cells: TableHeaderCellInterface[] | TableCellInterface[];
    type?: 'Header' | 'Body' | 'Footer';

    // Selection
    rowIndex?: number;
}
export function TableRow(properties: TableRowInterface) {
    // Destructure the properties
    const cells = properties.cells;

    // State
    const [selectedRowsIndexesSet, setSelectedRowsIndexesSet] = useAtom(selectedRowsIndexesSetAtom);
    const filteredRows = useAtomValue(filteredFormattedRowsDataAtom);
    const allRowsSelected = useAtomValue(allRowsSelectedAtom);
    const showSelectColumn = useAtomValue(showSelectColumnAtom);

    // Callbacks
    const handleSelectChange = React.useCallback(
        function handleSelectChange() {
            // Handle header selection toggle
            if(properties.type === 'Header') {
                // If all rows are selected, deselect all rows
                if(allRowsSelected) {
                    setSelectedRowsIndexesSet(new Set());
                }
                // If all rows are not selected, select all rows
                else {
                    setSelectedRowsIndexesSet(new Set(filteredRows.map((row, index) => index)));
                }
            }
            // Handle row selection toggle
            else {
                if(properties.rowIndex === undefined) {
                    return;
                }
                // If the row is in the selected set, remove it
                if(selectedRowsIndexesSet.has(properties.rowIndex)) {
                    const newSet = new Set(selectedRowsIndexesSet);
                    newSet.delete(properties.rowIndex);
                    setSelectedRowsIndexesSet(newSet);
                }
                // If the row is not in the selected set, add it
                else {
                    const newSet = new Set(selectedRowsIndexesSet);
                    newSet.add(properties.rowIndex);
                    setSelectedRowsIndexesSet(newSet);
                }
            }
        },
        [
            allRowsSelected,
            filteredRows,
            properties.rowIndex,
            properties.type,
            selectedRowsIndexesSet,
            setSelectedRowsIndexesSet,
        ],
    );

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
                handleSelectChange();
            }

            // Call the onChange callback if it exists
            if(properties.onClick) {
                properties.onClick(event);
            }
        },
        [properties, handleSelectChange],
    );

    // Render the component
    return (
        <tr
            className={mergeClassNames(
                'h-10 border-b border-light-6 text-sm last:border-b-0 hover:bg-light-1 dark:border-dark-4 dark:hover:bg-dark-1',
                properties.className,
            )}
            onClick={showSelectColumn ? onClickIntercept : undefined}
        >
            {/* Selection */}
            {showSelectColumn && (
                <CellComponent className="w-4 px-2 py-1 text-left">
                    <TableRowCheckbox row={properties} type={properties.type} handleSelectChange={handleSelectChange} />
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
    handleSelectChange?: () => void;
}
function TableRowCheckbox(properties: TableRowCheckboxInterface) {
    // Checkbox reference
    const checkboxRef = React.useRef<InputCheckboxReferenceInterface>(null);

    // State
    const selectedRowsIndexesSet = useAtomValue(selectedRowsIndexesSetAtom);
    const allRowsSelected = useAtomValue(allRowsSelectedAtom);
    const formattedRowsData = useAtomValue(formattedColumnsAtom);
    const rowIndex = properties.row.rowIndex;
    const selected =
        (rowIndex !== undefined && selectedRowsIndexesSet.has(rowIndex)) ||
        (properties.type === 'Header' && (allRowsSelected || selectedRowsIndexesSet.size === formattedRowsData.length));

    React.useEffect(
        function () {
            if(checkboxRef.current) {
                // console.log('Updating checkbox state', value);
                checkboxRef.current?.setValue(selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked);
            }
        },
        [
            allRowsSelected,
            formattedRowsData,
            properties.row.rowIndex,
            properties.type,
            selectedRowsIndexesSet,
            selected,
        ],
    );

    // Render the component
    return (
        <InputCheckbox
            ref={checkboxRef}
            tabIndex={0}
            defaultValue={selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
            onChange={function (value, event) {
                if(properties.handleSelectChange) {
                    properties.handleSelectChange();
                }
                console.log(rowIndex, properties.row.rowIndex, selectedRowsIndexesSet);
            }}
        />
    );
}
