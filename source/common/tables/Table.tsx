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
import { uniqueIdentifier } from '@structure/source/utilities/String';

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

    // References
    const filtersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);
    const previousFiltersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);

    // State
    const [searchTerm, setSearchTerm] = React.useState<string>(properties.searchTerm || '');
    const [filtersEnabled, setFiltersEnabled] = React.useState<boolean>(filtersReference.current !== undefined);
    const selectedRowsIndexesSet = React.useMemo<Set<number>>(
        function () {
            const initialSelectedRowsIndexesSet = new Set<number>();

            // Loop over the rows and add the selected ones to the set
            properties.rows.forEach(function (row, rowIndex) {
                if(row.selected) {
                    initialSelectedRowsIndexesSet.add(rowIndex);
                    // Emit the updateCheckboxes event
                }
            });
            window.dispatchEvent(new CustomEvent('updateCheckboxes'));

            return initialSelectedRowsIndexesSet;
        },
        [properties.rows],
    );

    // Sync the selected rows with the default selected rows
    React.useEffect(
        function () {
            properties.rows.forEach(function (row, rowIndex) {
                if(row.selected) {
                    selectedRowsIndexesSet.add(rowIndex);
                }
            });
            // Emit the updateCheckboxes event
            window.dispatchEvent(new CustomEvent('updateCheckboxes'));
        },
        [properties.rows, selectedRowsIndexesSet],
    );

    const [visibleColumnsIndexesSet, setVisibleColumnsIndexesSet] = React.useState<Set<number>>(function () {
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

        return initialVisibleColumnIndexesSet;
    });

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
    const [columns, setColumns] = React.useState(function () {
        return propertiesColumns.map(function (column, columnIndex) {
            // If the column is not hidden already and not excluded from the default visible columns
            // add it to the visibleColumnsIndexesSet
            return {
                ...column,
                sortable: propertiesSortable,
            };
        });
    });

    // Update the columns when the properties change
    React.useEffect(
        function () {
            setColumns((previousColumns) => {
                if(properties.loading || properties.error) {
                    return previousColumns;
                }

                return propertiesColumns.map(function (column, columnIndex) {
                    return {
                        ...column,
                        sortable: propertiesSortable,
                    };
                });
            });
        },
        [propertiesColumns, propertiesSortable, properties.loading, properties.error],
    );

    // Rows
    const propertiesRows = properties.rows;
    const propertiesRowSelection = properties.rowSelection;
    const rows = React.useMemo(
        function () {
            return propertiesRows.map(function (row, rowIndex) {
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
                    selection: propertiesRowSelection,
                    selected: selectedRowsIndexesSet.has(rowIndex),
                    onSelectChange: function (row: TableRowInterface, rowSelected: boolean) {
                        // If the row is selected
                        if(rowSelected) {
                            selectedRowsIndexesSet.add(rowIndex);
                        }
                        // If the row is unselected
                        else {
                            selectedRowsIndexesSet.delete(rowIndex);
                        }
                        // Emit the updateCheckboxes event
                        window.dispatchEvent(new CustomEvent('updateCheckboxes'));
                        console.log('selectedRowsIndexesSet', selectedRowsIndexesSet);
                    },
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
        },
        [columns, propertiesRows, propertiesRowSelection, selectedRowsIndexesSet, visibleColumnsIndexesSet, searchTerm],
    );

    // Column TableRow properties
    const columnTableRowProperties = React.useMemo(
        function () {
            // Determine if the header row is selected
            let selected = false;
            let thereAreVisibleRows = false;
            let allVisibleRowsAreSelected = true;

            // Loop through all of the rows and check if they are all visible and selected
            rows.forEach(function (row, rowIndex) {
                // If the row is visible
                if(row.visible) {
                    // Increment the visible rows count
                    thereAreVisibleRows = true;

                    // If the row is not selected
                    if(!selectedRowsIndexesSet.has(rowIndex)) {
                        // Not all visible rows are selected
                        allVisibleRowsAreSelected = false;

                        // Break out of the loop
                        return;
                    }
                }
            });

            // If there are visible rows and all visible rows are selected
            if(thereAreVisibleRows && allVisibleRowsAreSelected) {
                selected = true;
            }

            const cells = columns
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
                selection: propertiesRowSelection,
                selected: selected,
                onSelectChange: function (row: TableRowInterface, rowSelected: boolean) {
                    // If the header row is selected, select all visible rows
                    if(rowSelected) {
                        rows.forEach(function (row, rowIndex) {
                            if(row.visible) {
                                selectedRowsIndexesSet.add(rowIndex);
                                // Emit the updateCheckboxes event
                                window.dispatchEvent(new CustomEvent('updateCheckboxes'));
                            }
                        });
                    }
                    // If the header row is unselected, unselect all
                    else {
                        selectedRowsIndexesSet.clear();
                        // Emit the updateCheckboxes event
                        window.dispatchEvent(new CustomEvent('updateCheckboxes'));
                    }
                    console.log('selectedRowsIndexesSet', selectedRowsIndexesSet);
                },
            };
        },
        [rows, columns, propertiesRowSelection, selectedRowsIndexesSet, visibleColumnsIndexesSet],
    );

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
                            if(!properties.columnVisibility || visibleColumnsIndexesSet.size === columns.length) {
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
                                    return selectedRowsIndexesSet.has(rowIndex);
                                });

                                // Execute the action function
                                await tableRowsAction.actionFunction(selectedRows, columns);

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
            selectedRowsIndexesSet,
            columns,
            properties.columnVisibility,
            visibleColumnsIndexesSet.size,
            addNotice,
        ],
    );

    // Function to handle visible columns change
    const onColumnVisibilityChange = React.useCallback(async function (visibleColumnsIndexes?: string[]) {
        // console.log('onVisibleColumnsChange', visibleColumnsIndexes);
        if(visibleColumnsIndexes) {
            setVisibleColumnsIndexesSet(new Set<number>(visibleColumnsIndexes.map(Number)));
        }
    }, []);

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

    // Reset selection when pagination changes
    React.useEffect(
        function () {
            selectedRowsIndexesSet.clear();
            // Emit the updateCheckboxes event
            window.dispatchEvent(new CustomEvent('updateCheckboxes'));
        },
        [properties.pagination, selectedRowsIndexesSet],
    );

    // console.log('Table', {
    //     columns,
    //     rows,
    //     selectedRowsIndexesSet,
    //     visibleColumnsIndexesSet,
    //     searchTerm,
    //     filtersReference,
    //     filtersEnabled,
    //     columnTableRowProperties,
    // });

    // Render the component
    return (
        <>
            {/* Only render this section if options are enabled */}
            {properties.search || properties.filter || properties.columnVisibility || properties.rowSelection ? (
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
                                    onChange={function (value, event) {
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
                                    columns={columns}
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
                                        data-show={selectedRowsIndexesSet.size > 0}
                                        className="duration-75 data-[show=true]:flex data-[show=false]:hidden data-[show=true]:animate-in data-[show=false]:animate-out data-[show=false]:fade-out data-[show=true]:fade-in"
                                        icon={CheckCircledIcon}
                                        iconPosition="left"
                                    >
                                        {selectedRowsIndexesSet.size} of {rows.length} selected
                                    </Button>
                                </PopoverMenu>
                            )}

                            {/* Column Visibility */}
                            {properties.columnVisibility && (
                                <InputMultipleSelect
                                    key={columns.length}
                                    title="Columns"
                                    items={columns.map(function (column, columnIndex) {
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
            ) : null}

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
                        {columns && columns.length > 0 && (
                            <thead className="border-b border-light-6 dark:border-dark-4">
                                <TableRow
                                    rowsLength={rows.length}
                                    selectedRowsIndexesSet={selectedRowsIndexesSet}
                                    {...columnTableRowProperties}
                                />
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
                        ) : rows && rows.length > 0 ? (
                            <tbody>
                                {rows
                                    .filter(function (row, rowIndex) {
                                        return row.visible;
                                    })
                                    .map(function (row, rowIndex) {
                                        return (
                                            <TableRow
                                                key={rowIndex}
                                                {...row}
                                                selectedRowsIndexesSet={selectedRowsIndexesSet}
                                                rowsLength={rows.length}
                                                rowIndex={rowIndex}
                                            />
                                        );
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
