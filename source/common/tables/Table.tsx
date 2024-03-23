// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/interactions/notice/NoticeProvider';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableRowInterface, TableRow } from '@structure/source/common/tables/TableRow';
import { defaultTableRowsActions } from '@structure/source/common/tables/TableRowsActions';
import { Button } from '@structure/source/common/interactions/Button';
import { ToggleButton } from '@structure/source/common/interactions/ToggleButton';
import { PopoverMenu } from '@structure/source/common/interactions/PopoverMenu';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputMultipleSelect } from '@structure/source/common/forms/InputMultipleSelect';
import { MenuItemInterface } from '@structure/source/common/interactions/MenuItem';
import { PaginationInterface, Pagination } from '@structure/source/common/interactions/Pagination';
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
    const [selectedRowsIndexesSet, setSelectedRowsIndexesSet] = React.useState<Set<number>>(function () {
        const initialSelectedRowsIndexesSet = new Set<number>();

        // Loop over the rows and add the selected ones to the set
        properties.rows.forEach(function (row, rowIndex) {
            if(row.selected) {
                initialSelectedRowsIndexesSet.add(rowIndex);
            }
        });

        return initialSelectedRowsIndexesSet;
    });
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
    const [filtersEnabled, setFiltersEnabled] = React.useState<boolean>(filtersReference.current !== undefined);

    // Columns
    const columns = React.useMemo(
        function () {
            return properties.columns.map(function (column, columnIndex) {
                return {
                    ...column,
                    // Add the hidden property using the visibleColumnsIndexesSet
                    hidden: !visibleColumnsIndexesSet.has(columnIndex),
                    sortable: properties.sortable,
                };
            });
        },
        [properties.columns, properties.sortable, visibleColumnsIndexesSet],
    );

    // Rows
    const rows = React.useMemo(
        function () {
            return properties.rows.map(function (row, rowIndex) {
                return {
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
                    selection: properties.rowSelection,
                    selected: selectedRowsIndexesSet.has(rowIndex),
                    onSelectChange: function (row: TableRowInterface, event: React.ChangeEvent<HTMLInputElement>) {
                        // If the row is selected
                        if(event.target.checked) {
                            setSelectedRowsIndexesSet(function (selectedRowsIndexes) {
                                selectedRowsIndexes.add(rowIndex);
                                return new Set(selectedRowsIndexes);
                            });
                        }
                        // If the row is unselected
                        else {
                            setSelectedRowsIndexesSet(function (selectedRowsIndexes) {
                                selectedRowsIndexes.delete(rowIndex);
                                return new Set(selectedRowsIndexes);
                            });
                        }
                    },
                };
            });
        },
        [columns, properties.rows, properties.rowSelection, selectedRowsIndexesSet, visibleColumnsIndexesSet],
    );

    // Column TableRow properties
    const columnTableRowProperties = React.useMemo(
        function () {
            return {
                type: 'Header' as 'Body' | 'Header' | 'Footer' | undefined,
                cells: columns
                    // Filter out the hidden columns
                    .filter((column, columnIndex) => !column.hidden)
                    .map(function (column) {
                        return {
                            value: column.title,
                            column: column,
                        };
                    }),
                selection: properties.rowSelection,
                selected: selectedRowsIndexesSet.size === rows.length && rows.length > 0,
                onSelectChange: function (row: TableRowInterface, event: React.ChangeEvent<HTMLInputElement>) {
                    // If the header row is selected, select all
                    if(event.target.checked) {
                        setSelectedRowsIndexesSet(function (selectedRowsIndexes) {
                            rows.forEach(function (row, rowIndex) {
                                selectedRowsIndexes.add(rowIndex);
                            });
                            return new Set(selectedRowsIndexes);
                        });
                    }
                    // If the header row is unselected, unselect all
                    else {
                        setSelectedRowsIndexesSet(function (selectedRowsIndexes) {
                            selectedRowsIndexes.clear();
                            return new Set(selectedRowsIndexes);
                        });
                    }
                },
            };
        },
        [rows, columns, , properties.rowSelection, selectedRowsIndexesSet.size],
    );

    // Defaults
    const rowsSelectionActions: MenuItemInterface[] = React.useMemo(
        function () {
            return (
                properties.rowsSelectionActions ||
                // Use the default table rows actions if no actions are provided
                defaultTableRowsActions.map(function (tableRowsAction) {
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
        [properties.rows, properties.rowsSelectionActions, columns, selectedRowsIndexesSet, addNotice],
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

    // Function to handle search
    // const search = React.useCallback(
    //     function (search: string) {
    //         // Show all rows if the search is empty
    //         if(search === '') {
    //             setVisibleRows(properties.rows);
    //         }
    //         // Otherwise, filter the rows
    //         else {
    //             // Loop over all of the rows
    //             const newVisibleRows = properties.rows.filter(function (row) {
    //                 // Loop over the visible columns
    //                 for(const visibleColumn of visibleColumns) {
    //                     const columnIndex = properties.columns?.indexOf(visibleColumn)!;
    //                     const cellValue = row[columnIndex];
    //                     if(cellValue?.toString().toLowerCase().includes(search.toLowerCase())) {
    //                         return true;
    //                     }
    //                 }
    //             });

    //             setVisibleRows(newVisibleRows);
    //         }
    //     },
    //     [properties.rows, properties.columns, visibleColumns],
    // );

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
                                onChange={function (
                                    value: string | undefined,
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) {
                                    if(value !== undefined) {
                                        // search(value);
                                    }
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

                    {filtersEnabled && filtersReference.current && (
                        <div className="mt-4 flex">
                            <ColumnFilterGroup
                                columns={columns.map(function (column) {
                                    return column.identifier;
                                })}
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

            {/* Table Container */}
            <div
                className={mergeClassNames(
                    'overflow-scroll rounded-md border border-light-6 dark:border-dark-4',
                    properties.containerClassName,
                )}
            >
                {/* Table */}
                {properties.loading ? (
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
                                <TableRow {...columnTableRowProperties} />
                            </thead>
                        )}

                        {/* Rows */}
                        {rows && rows.length > 0 ? (
                            <tbody>
                                {rows.map(function (row, rowIndex) {
                                    return <TableRow key={rowIndex} {...row} />;
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
