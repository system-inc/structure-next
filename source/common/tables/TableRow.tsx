// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableCellInterface, TableCell } from '@structure/source/common/tables/TableCell';
import { TableHeaderCellInterface, TableHeaderCell } from '@structure/source/common/tables/TableHeaderCell';
import { InputCheckboxState, InputCheckbox } from '@structure/source/common/forms/InputCheckbox';

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
    onSelectChange?: (row: TableRowInterface, rowSelected: boolean) => void;

    // Selected rows
    selectedRowsIndexesSet?: Set<number>;
    rowsLength: number;
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
                    <TableRowInputCheckbox {...properties} />
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
 * Extracted sub-components to prevent re-rendering the whole table row when a cell is updated.
 */

function TableRowInputCheckbox(properties: TableRowInterface) {
    const checkboxRef = React.useRef<React.ElementRef<typeof InputCheckbox> | null>(null);
    const [forceSafeRerender, setForceSafeRerender] = React.useState<number>(0);
    const propertiesRowsLength = properties.rowsLength;
    const propertiesSelectedRowsIndexesSet = properties.selectedRowsIndexesSet;

    React.useEffect(
        function () {
            console.log('TableRowInputCheckbox useEffect', propertiesRowsLength);
            if(checkboxRef.current) {
                const headerCondition =
                    properties.type === 'Header' &&
                    propertiesRowsLength === propertiesSelectedRowsIndexesSet?.size &&
                    propertiesRowsLength > 0;
                const bodyCondition = propertiesSelectedRowsIndexesSet?.has(properties.rowIndex ?? -1);

                if(properties.type === 'Header') {
                    console.log(
                        'headerCondition',
                        headerCondition,
                        propertiesRowsLength,
                        propertiesSelectedRowsIndexesSet?.size,
                    );
                }

                checkboxRef.current.setValue(
                    bodyCondition || headerCondition ? InputCheckboxState.Checked : InputCheckboxState.Unchecked,
                );
            }
        },
        [propertiesSelectedRowsIndexesSet, propertiesRowsLength, forceSafeRerender],
    );

    React.useEffect(function () {
        // Create a listener to force a safe re-render when the selected property changes
        const listener = function () {
            setForceSafeRerender((value) => value + 1);
        };

        // Add the listener
        window.addEventListener('updateCheckboxes', listener);

        // Remove the listener
        return function () {
            window.removeEventListener('updateCheckboxes', listener);
        };
    }, []);

    return (
        <InputCheckbox
            ref={checkboxRef}
            tabIndex={0}
            defaultValue={properties.selected ? InputCheckboxState.Checked : InputCheckboxState.Unchecked}
            onChange={function (value, event) {
                if(properties.onSelectChange) {
                    properties.onSelectChange(properties, value === InputCheckboxState.Checked ? true : false);
                }
            }}
        />
    );
}
