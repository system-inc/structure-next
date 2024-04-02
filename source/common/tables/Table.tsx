// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableRowInterface, TableRow } from '@structure/source/common/tables/TableRow';
import { defaultTableRowsActions } from '@structure/source/common/tables/TableRowsActions';
import { Button } from '@structure/source/common/buttons/Button';
import { ToggleButton } from '@structure/source/common/buttons/ToggleButton';
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputMultipleSelect } from '@structure/source/common/forms/InputMultipleSelect';
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';
import { PaginationInterface, Pagination } from '@structure/source/common/navigation/Pagination';
import { ColumnFilterGroup, ColumnFilterGroupDataInterface } from '@structure/source/common/tables/ColumnFilterGroup';
import { ColumnFilterGroupOperator, ColumnFilterConditionOperator } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import FilterIcon from '@structure/assets/icons/interface/FilterIcon.svg';
import FunnelIcon from '@structure/assets/icons/analytics/FunnelIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Dependencies - State Management
import { proxy as createState, useSnapshot as useValtioState } from 'valtio';

// Table state management
export const tableState = createState({
    // Search
    searchTerm: '',

    // Sorting
    columnsAreSortable: false,

    // Columns data
    columns: [] as TableColumnInterface[],
    formattedColumns: [] as TableColumnInterface[],

    // Column visibility
    visibleColumnsIndexesSet: new Set<number>(),

    // Rows data
    rows: [] as TableRowInterface[],
    formattedRowsData: [] as TableRowInterface[],
    get columnTableHeaderProperties() {
        console.log('gettting formattedTableRows');
        const rowsData = this.formattedRowsData;
        const visibleColumnsIndexesSet = this.visibleColumnsIndexesSet;
        const formattedColumns = this.formattedColumns;

        const cells = formattedColumns
            // Filter out the hidden columns
            .filter((column, columnIndex) => visibleColumnsIndexesSet.has(columnIndex))
            .map(function (column) {
                return {
                    value: column.title,
                    column: column,
                };
            });

        return {
            type: 'Header' as 'Body' | 'Header' | 'Footer' | undefined,
            cells: cells,
            selection: this.showSelectColumn,
            selected: false,
            onSelectChange: function (row: TableRowInterface, rowSelected: boolean) {
                // If the header row is selected, select all visible rows
                if(rowSelected) {
                    Array.from(rowsData).map(function (_row, rowIndex) {
                        const setCopy = new Set<number>(tableState.selectedRowsIndexesSet);
                        setCopy.add(rowIndex);
                        tableState.selectedRowsIndexesSet = setCopy;
                    });
                }
                // If the header row is unselected, unselect all
                else {
                    const setCopy = new Set<number>(tableState.selectedRowsIndexesSet);
                    setCopy.clear();
                    tableState.selectedRowsIndexesSet = setCopy;
                }
                console.log('selectedRowsIndexesSet', tableState.selectedRowsIndexesSet);
            },
        } as TableRowInterface;
    },

    // Row selection
    showSelectColumn: false,
    selectedRowsIndexesSet: new Set<number>(),
    get allRowsSelected() {
        return this.selectedRowsIndexesSet.size === this.formattedRowsData.length;
    },

    // set allRowsSelected(value: boolean | 'indeterminate') {
    //     if(value === true) {
    //         this.selectedRowsIndexesSet = new Set(this.formattedRowsData.map((row, rowIndex) => rowIndex));
    //     }
    //     else if(value === false) {
    //         this.selectedRowsIndexesSet.clear();
    //     }
    //     else if(value === 'indeterminate') {
    //         // If the value is indeterminate, do nothing
    //     }
    // },
    // get allRowsSelected() {
    //     return this.selectedRowsIndexesSet.size === this.formattedRowsData.length;
    // },
});

// Component - Table
export interface TableInterface extends React.HTMLAttributes<HTMLTableElement> {
    containerClassName?: string;

    // Data
    columns: TableColumnInterface[];
    rows: TableRowInterface[];

    // Sorting
    sortable?: boolean;

    // Row selection
    rowSelection?: boolean;
    rowSelectionActions?: MenuItemInterface[];
    rowsSelectionActions?: MenuItemInterface[];

    // Search
    search?: boolean;
    searchTerm?: string;

    // Filters
    filter?: boolean;
    filters?: ColumnFilterGroupDataInterface;
    onFiltersChange?: (columnFilterGroupData?: ColumnFilterGroupDataInterface) => void;

    // Column visibility
    columnVisibility?: boolean;
    defaultVisibleColumnsIdentifiers?: string[]; // Array of column identifiers

    // Pagination
    pagination?: PaginationInterface;

    // States
    loading?: boolean;
    error?: {
        code?: string;
        message?: string;
        url?: string;
    };
}
export function Table(properties: TableInterface) {
    // Hooks
    const { addNotice } = useNotice();
    const tableSnapshot = useValtioState(tableState);

    // References
    const filtersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);
    const previousFiltersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);

    // State
    const setSearchTerm = function (value: string) {
        tableState.searchTerm = value;
    };
    const [filtersEnabled, setFiltersEnabled] = React.useState<boolean>(filtersReference.current !== undefined);

    // Visible Columns
    const [visibleColumnsIndexesSet, setVisibleColumnsIndexesSet] = [
        tableState.visibleColumnsIndexesSet,
        function (visibleColumnsIndexesSet: Set<number>) {
            const initialVisibleColumnIndexesSet = new Set<number>();

            // If defaultVisibleColumnsIdentifiers is provided, use it
            if(properties.defaultVisibleColumnsIdentifiers) {
                // Map the column identifiers to column indexes
                properties.columns.forEach(function (column, columnIndex) {
                    if(properties.defaultVisibleColumnsIdentifiers?.includes(column.identifier)) {
                        initialVisibleColumnIndexesSet.add(columnIndex);
                    }
                });
            }
            // Otherwise, use all columns
            else {
                properties.columns.forEach(function (column, columnIndex) {
                    if(!column.hidden) {
                        initialVisibleColumnIndexesSet.add(columnIndex);
                    }
                });
            }

            tableState.visibleColumnsIndexesSet = initialVisibleColumnIndexesSet;
        },
    ];
    // Sync the visible columns with the default visible columns and available columns
    React.useEffect(
        function () {
            // If the defaultVisibleColumnsIdentifiers is provided
            if(properties.defaultVisibleColumnsIdentifiers) {
                // Loop over the columns and add the default visible columns to the set
                properties.columns.forEach(function (column, columnIndex) {
                    if(properties.defaultVisibleColumnsIdentifiers?.includes(column.identifier)) {
                        visibleColumnsIndexesSet.add(columnIndex);
                    }
                });
            }
            // Otherwise, use all columns
            else {
                properties.columns.forEach(function (column, columnIndex) {
                    if(!column.hidden) {
                        visibleColumnsIndexesSet.add(columnIndex);
                    }
                });
            }
        },
        [properties.columns, properties.defaultVisibleColumnsIdentifiers, visibleColumnsIndexesSet],
    );

    // Columns
    // Extract the dependencies
    const propertiesColumns = properties.columns;
    const propertiesSortable = properties.sortable;
    const formattedColumns = tableState.formattedColumns as TableColumnInterface[];
    // Update the columns when the properties change
    React.useEffect(
        function () {
            // If the table is loading or there is an error, do not update the columns
            if(properties.loading || properties.error) {
                return;
            }
            // Otherwise, update the columns
            else {
                tableState.columnsAreSortable = propertiesSortable ?? false;
                tableState.columns = propertiesColumns;

                // Set the formatted columns
                const getFormattedColumns = () => {
                    console.log('gettting formattedColumns');
                    const columnsAreSortable = tableState.columnsAreSortable;

                    return tableState.columns.map(function (column, columnIndex) {
                        // If the column is not hidden already and not excluded from the default visible columns
                        // add it to the visibleColumnsIndexesSet
                        return {
                            ...column,
                            sortable: columnsAreSortable,
                        };
                    });
                };
                tableState.formattedColumns = getFormattedColumns();
            }
        },
        [properties.columns, properties.loading, propertiesSortable, properties.error, propertiesColumns],
    );

    // Rows
    const rowsData = tableState.formattedRowsData as TableRowInterface[];
    // Update the rows when the properties change
    React.useEffect(
        function () {
            tableState.rows = properties.rows;

            const getFormattedRowsData = () => {
                console.log('gettting formattedRowsData');
                const rows = tableState.rows;
                const columns = tableState.columns;
                const visibleColumnsIndexesSet = tableState.visibleColumnsIndexesSet;
                const searchTerm = tableState.searchTerm;

                return rows.map(function (row, rowIndex) {
                    const updatedRow = {
                        ...row,
                        type: 'Body' as 'Body' | 'Header' | 'Footer' | undefined,
                        cells: row.cells
                            .map(function (cell, columnIndex) {
                                return {
                                    ...cell,
                                    column: columns[columnIndex],
                                };
                            })
                            .filter(function (cell, columnIndex) {
                                return visibleColumnsIndexesSet.has(columnIndex);
                            }),
                        onSelectChange: function (row: TableRowInterface, rowSelected: boolean) {
                            // If the row is selected
                            if(rowSelected) {
                                const setCopy = new Set<number>(tableState.selectedRowsIndexesSet);
                                setCopy.add(rowIndex);
                                tableState.selectedRowsIndexesSet = setCopy;
                            }
                            // If the row is unselected
                            else {
                                const setCopy = new Set<number>(tableState.selectedRowsIndexesSet);
                                setCopy.delete(rowIndex);
                                tableState.selectedRowsIndexesSet = setCopy;
                            }
                            console.log('selectedRowsIndexesSet', tableState.selectedRowsIndexesSet);
                        },
                        selected: tableSnapshot.selectedRowsIndexesSet.has(rowIndex),
                        selection: tableSnapshot.showSelectColumn,
                    };

                    let rowVisible = true;

                    // If there is a search term
                    if(searchTerm !== '') {
                        // Start out with the row hidden
                        rowVisible = false;

                        // Loop over each cell
                        updatedRow.cells.forEach(function (cell) {
                            // If the cell not hidden and the cell value includes the search term
                            if(
                                visibleColumnsIndexesSet.has(columns.findIndex((column) => column === cell.column)) &&
                                cell.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                            ) {
                                // Show the row
                                rowVisible = true;

                                // Break out of the loop
                                return;
                            }
                        });
                    }

                    // Set the row visibility
                    updatedRow.visible = rowVisible;

                    return updatedRow;
                });
            };
            tableState.formattedRowsData = getFormattedRowsData();
        },
        [properties.rows, properties.rowSelection],
    );
    tableState.showSelectColumn = properties.rowSelection || false;

    // Column TableRow properties
    const columnTableHeaderProperties = tableSnapshot.columnTableHeaderProperties as TableRowInterface;

    // Defaults
    const rowsSelectionActions: MenuItemInterface[] = React.useMemo(
        function () {
            return (
                properties.rowsSelectionActions ||
                // Use the default table rows actions if no actions are provided
                defaultTableRowsActions
                    // Filter out the actions that are for visible columns only
                    .filter(function (tableRowsAction) {
                        let showTableRowsAction = true;

                        // If the action is for visible columns only
                        if(tableRowsAction.action.includes('(Visible Columns Only)')) {
                            // If column visibility is disabled or if all columns are visible already
                            if(
                                !properties.columnVisibility ||
                                visibleColumnsIndexesSet.size === formattedColumns.length
                            ) {
                                // Do not show Visible Columns actions
                                showTableRowsAction = false;
                            }
                        }

                        return showTableRowsAction;
                    })
                    .map(function (tableRowsAction) {
                        return {
                            content: tableRowsAction.action,
                            onSelected: async function () {
                                // Get the selected rows, must use properties.rows here to get the original rows
                                // If we use rows, they will have filtered cells
                                const selectedRows = properties.rows.filter(function (row, rowIndex) {
                                    return tableState.selectedRowsIndexesSet.has(rowIndex);
                                });

                                // Execute the action function
                                await tableRowsAction.actionFunction(selectedRows, formattedColumns);

                                // Show a notice
                                addNotice({
                                    title: tableRowsAction.notice.title,
                                    content: tableRowsAction.notice.content,
                                });
                            },
                            closeMenuOnSelect: true,
                        };
                    })
            );
        },
        [
            properties.rows,
            properties.rowsSelectionActions,
            formattedColumns,
            properties.columnVisibility,
            visibleColumnsIndexesSet.size,
            addNotice,
        ],
    );

    // Function to handle visible columns change
    const onColumnVisibilityChange = React.useCallback(
        async function (visibleColumnsIndexes?: string[]) {
            // console.log('onVisibleColumnsChange', visibleColumnsIndexes);
            if(visibleColumnsIndexes) {
                setVisibleColumnsIndexesSet(new Set<number>(visibleColumnsIndexes.map(Number)));
            }
        },
        [setVisibleColumnsIndexesSet],
    );

    // Function to handle filters change
    const propertiesOnFiltersChange = properties.onFiltersChange;
    const onFiltersChange = React.useCallback(
        async function (columnFilterGroupData?: ColumnFilterGroupDataInterface) {
            // console.log('onFiltersChange', filtersReference.current);

            previousFiltersReference.current = filtersReference.current;
            filtersReference.current = columnFilterGroupData;

            if(propertiesOnFiltersChange) {
                propertiesOnFiltersChange(columnFilterGroupData);
            }
        },
        [propertiesOnFiltersChange],
    );

    // Function to handle filters toggle
    const onFiltersToggle = React.useCallback(
        function (filtersOn: boolean) {
            // console.log('pressed', filtersOn, filtersReference.current);

            // If the filters are enabled and the previous filters exist, restore them
            if(filtersOn && previousFiltersReference.current) {
                filtersReference.current = previousFiltersReference.current;
            }
            // If the filters are enabled and the previous filters don't exist, create a blank filter
            else if(filtersOn && !filtersReference.current) {
                filtersReference.current = {
                    operator: ColumnFilterGroupOperator.And,
                    conditions: [],
                };
            }
            // If the filters are disabled, remove them
            else if(!filtersOn) {
                onFiltersChange(undefined);
            }

            // Set the state
            setFiltersEnabled(filtersOn);
        },
        [onFiltersChange],
    );

    // console.log('Table', {
    //     columns: formattedColumns,
    //     rows: rowsData,
    //     selectedRowsIndexesSet,
    //     visibleColumnsIndexesSet,
    //     searchTerm,
    //     filtersReference,
    //     filtersEnabled,
    //     columnTableRowProperties,
    // });
    console.log('rendering table');

    // Render the component
    return (
        <>
            <div className="mb-4 flex">
                <div className="flex flex-grow flex-col">
                    <div className="flex space-x-2">
                        {/* Search */}
                        {properties.search && (
                            <InputText
                                className="w-80"
                                variant="search"
                                placeholder="Filter visible rows..."
                                autoComplete="off"
                                defaultValue={properties.searchTerm}
                                onChange={function (
                                    value: string | undefined,
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) {
                                    setSearchTerm(value || '');
                                }}
                            />
                        )}

                        {/* Filters Toggle */}
                        {properties.filter && (
                            <ToggleButton
                                size="icon"
                                icon={FunnelIcon}
                                tip="Toggle filters"
                                tipProperties={{ side: 'right' }}
                                pressed={filtersEnabled}
                                onPressedChange={onFiltersToggle}
                            />
                        )}
                    </div>

                    {/* Filters - Column Filter Group */}
                    {filtersEnabled && filtersReference.current && (
                        <div className="mt-4 flex">
                            <ColumnFilterGroup
                                columns={formattedColumns}
                                columnFilterGroupData={filtersReference.current}
                                onChange={onFiltersChange}
                            />
                        </div>
                    )}
                </div>

                {/* Table Controls */}
                {(properties.columnVisibility || properties.rowSelection) && (
                    <div className="flex items-end justify-end space-x-2">
                        {/* Rows Selection Actions */}
                        {properties.rowSelection && (
                            <PopoverMenu
                                items={rowsSelectionActions}
                                popoverProperties={{
                                    align: 'end',
                                }}
                            >
                                <Button
                                    // Fade in and out when appearing and disappearing
                                    data-show={tableState.selectedRowsIndexesSet.size > 0}
                                    className="duration-75 data-[show=true]:flex data-[show=false]:hidden data-[show=true]:animate-in data-[show=false]:animate-out data-[show=false]:fade-out data-[show=true]:fade-in"
                                    icon={CheckCircledIcon}
                                    iconPosition="left"
                                >
                                    {tableState.selectedRowsIndexesSet.size} of {rowsData.length} selected
                                </Button>
                            </PopoverMenu>
                        )}

                        {/* Column Visibility */}
                        {properties.columnVisibility && (
                            <InputMultipleSelect
                                key={formattedColumns.length}
                                title="Columns"
                                items={formattedColumns.map(function (column, columnIndex) {
                                    return {
                                        value: columnIndex.toString(),
                                        content: column.title,
                                    };
                                })}
                                defaultValue={Array.from(visibleColumnsIndexesSet).map(String)}
                                search={true}
                                popoverProperties={{
                                    align: 'end',
                                }}
                                buttonProperties={{
                                    variant: 'default',
                                    size: 'icon',
                                    children: <FilterIcon className="h-5 w-5" />,
                                }}
                                onChange={onColumnVisibilityChange}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div
                className={mergeClassNames(
                    'overflow-scroll rounded-md border border-light-6 dark:border-dark-4',
                    properties.containerClassName,
                )}
            >
                {/* Table */}
                {properties.loading && !properties.columns ? (
                    // Loading
                    <div className="flex items-center justify-center">
                        <div className="p-8 text-sm">Loading...</div>
                    </div>
                ) : properties.error ? (
                    // Error
                    <div className="flex items-center justify-center">
                        <div className="p-8 text-sm">Error: {properties.error.message}</div>
                    </div>
                ) : (
                    // Loaded
                    <table className={mergeClassNames('w-full', properties.className)}>
                        {/* Column Header Row */}
                        {formattedColumns && formattedColumns.length > 0 && (
                            <thead className="border-b border-light-6 dark:border-dark-4">
                                <TableRow {...columnTableHeaderProperties} />
                            </thead>
                        )}

                        {/* Rows */}
                        {properties.loading ? (
                            // Loading but have the table headers
                            <tbody>
                                <tr>
                                    <td colSpan={visibleColumnsIndexesSet.size + 1}>
                                        <div className="flex items-center justify-center">
                                            <div className="p-8 text-sm">Loading...</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : rowsData && rowsData.length > 0 ? (
                            <tbody>
                                {rowsData
                                    .filter(function (row, rowIndex) {
                                        return row.visible;
                                    })
                                    .map(function (row, rowIndex) {
                                        return <TableRow key={rowIndex} rowIndex={rowIndex} {...row} />;
                                    })}
                            </tbody>
                        ) : (
                            // No rows
                            <tbody>
                                <tr>
                                    <td colSpan={visibleColumnsIndexesSet.size + 1}>
                                        <div className="flex items-center justify-center">
                                            <div className="p-8 text-sm">No data.</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                )}
            </div>

            {/* Pagination */}
            {properties.pagination && (
                <Pagination
                    {...properties.pagination}
                    className={mergeClassNames('mt-4', properties.pagination.className)}
                />
            )}
        </>
    );
}

// Export - Default
export default Table;
