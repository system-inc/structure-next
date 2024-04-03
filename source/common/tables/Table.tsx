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
import { atom, useAtom, useSetAtom, useAtomValue, Provider as TableStateProvider } from 'jotai';

/**
 * Table state management -- Accessible globally to update and read the table state (.e.g., <TableRow />, etc.)
 * The atomized states are used to store the table state in small pieces, which can be updated and read independently
 */
// Search
export const searchTermAtom = atom('');
// Sorting
export const columnsAreSortableAtom = atom(false);
// Columns data
export const columnsAtom = atom([] as TableColumnInterface[]);
export const formattedColumnsAtom = atom([] as TableColumnInterface[]);
// Column visibility
export const visibleColumnsIndexesSetAtom = atom(
    new Set<number>(),
    function (
        get,
        set,
        args: {
            defaultVisibleColumnsIdentifiers?: string[];
        },
    ) {
        const initialVisibleColumnIndexesSet = new Set<number>();

        // If defaultVisibleColumnsIdentifiers is provided, use it
        if(args.defaultVisibleColumnsIdentifiers) {
            // Map the column identifiers to column indexes
            get(columnsAtom).forEach(function (column, columnIndex) {
                if(args.defaultVisibleColumnsIdentifiers?.includes(column.identifier)) {
                    initialVisibleColumnIndexesSet.add(columnIndex);
                }
            });
        }
        // Otherwise, use all columns
        else {
            get(columnsAtom).forEach(function (column, columnIndex) {
                if(!column.hidden) {
                    initialVisibleColumnIndexesSet.add(columnIndex);
                }
            });
        }

        return initialVisibleColumnIndexesSet;
    },
);
// Rows data
export const rowsAtom = atom([] as TableRowInterface[]);
// Computed property to get the formatted rows data
export const formattedRowsDataAtom = atom(function (get) {
    // console.log('gettting formattedRowsData');
    const visibleColumnsIndexesSet = get(visibleColumnsIndexesSetAtom);
    const columns = get(columnsAtom);

    return get(rowsAtom).map(function (row, rowIndex) {
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
        };

        return updatedRow;
    });
});
// Computed property to get the filtered formatted rows data if there is a search term
export const filteredFormattedRowsDataAtom = atom(function (get) {
    const term = get(searchTermAtom);
    if(term === '') {
        return get(formattedRowsDataAtom);
    }
    else {
        return get(formattedRowsDataAtom).filter(function (row) {
            return row.cells.some(function (cell) {
                return cell.value?.includes(term);
            });
        });
    }
});
// // Computed property to get the column table header properties
export const columnTableHeaderPropertiesAtom = atom(function (get) {
    // console.log('gettting formattedTableRows');
    const visibleColumnsIndexesSet = get(visibleColumnsIndexesSetAtom);
    const formattedColumns = get(formattedColumnsAtom);
    const showSelectColumn = get(showSelectColumnAtom);

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
    } as TableRowInterface;
});
// // Row selection
export const showSelectColumnAtom = atom(false);
export const selectedRowsIndexesSetAtom = atom(new Set<number>());
// Computed property to get the allRowsSelected state
export const allRowsSelectedAtom = atom(function (get) {
    return get(selectedRowsIndexesSetAtom).size === get(formattedRowsDataAtom).length;
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

    // References
    const filtersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);
    const previousFiltersReference = React.useRef<ColumnFilterGroupDataInterface | undefined>(properties.filters);

    // State
    const setSearchTerm = useSetAtom(searchTermAtom);
    const [filtersEnabled, setFiltersEnabled] = React.useState<boolean>(filtersReference.current !== undefined);
    const [columnsAreSortable, setColumnsAreSortable] = useAtom(columnsAreSortableAtom);
    const selectedRowsIndexesSet = useAtomValue(selectedRowsIndexesSetAtom);

    // Visible Columns
    const [visibleColumnsIndexesSet, setVisibleColumnsIndexesSet] = useAtom(visibleColumnsIndexesSetAtom);
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

    // Show Select Column
    const [showSelectColumn, setShowSelectColumn] = useAtom(showSelectColumnAtom);
    // Update the showSelectColumn state when the properties change
    React.useEffect(
        function () {
            setShowSelectColumn(properties.rowSelection || false);
        },
        [setShowSelectColumn, properties.rowSelection],
    );

    // Columns
    // Extract the dependencies
    const propertiesColumns = properties.columns;
    const propertiesSortable = properties.sortable;
    // Update the columns when the properties change
    const [columns, setColumns] = useAtom(columnsAtom);
    const [formattedColumns, setFormattedColumns] = useAtom(formattedColumnsAtom);
    React.useEffect(
        function () {
            // If the table is loading or there is an error, do not update the columns
            if(properties.loading || properties.error) {
                return;
            }
            // Otherwise, update the columns
            else {
                // Update the table state with the new columns and properties
                setColumnsAreSortable(propertiesSortable ?? false);
                setColumns(propertiesColumns);

                // Update the formatted columns
                setFormattedColumns(
                    columns.map(function (column, columnIndex) {
                        // If the column is not hidden already and not excluded from the default visible columns
                        // add it to the visibleColumnsIndexesSet
                        return {
                            ...column,
                            sortable: columnsAreSortable,
                        };
                    }),
                );
            }
        },
        [
            columns,
            columnsAreSortable,
            properties,
            setColumns,
            setFormattedColumns,
            propertiesColumns,
            propertiesSortable,
            setColumnsAreSortable,
        ],
    );

    // Rows
    const rowsData = useAtomValue(filteredFormattedRowsDataAtom);
    const setRows = useSetAtom(rowsAtom);
    // Update the rows when the properties change
    React.useEffect(
        function () {
            setRows(properties.rows);
        },
        [properties.rows, setRows],
    );

    // Column TableRow properties
    const columnTableHeaderProperties = useAtomValue(columnTableHeaderPropertiesAtom);

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
                                    return selectedRowsIndexesSet.has(rowIndex);
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
            selectedRowsIndexesSet,
        ],
    );

    // Function to handle visible columns change
    const onColumnVisibilityChange = React.useCallback(
        async function (visibleColumnsIndexes?: string[]) {
            // console.log('onVisibleColumnsChange', visibleColumnsIndexes);
            if(visibleColumnsIndexes) {
                setVisibleColumnsIndexesSet({
                    defaultVisibleColumnsIdentifiers: visibleColumnsIndexes,
                });
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
    // console.log('rendering table');

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
                {(properties.columnVisibility || showSelectColumn) && (
                    <div className="flex items-end justify-end space-x-2">
                        {/* Rows Selection Actions */}
                        {showSelectColumn && (
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
                                    {selectedRowsIndexesSet.size} of {rowsData.length} selected
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
                                {rowsData.map(function (row, rowIndex) {
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
