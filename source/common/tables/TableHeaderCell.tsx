// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';
import { TableCellInterface } from '@structure/source/common/tables/TableCell';
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { TipIcon } from '@structure/source/common/popovers/TipIcon';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import InformationCircledFilledIcon from '@structure/assets/icons/status/InformationCircledFilledIcon.svg';
import ChevronsUpDownIcon from '@structure/assets/icons/interface/ChevronsUpDownIcon.svg';
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import ArrowDownIcon from '@structure/assets/icons/interface/ArrowDownIcon.svg';
import HideIcon from '@structure/assets/icons/security/HideIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - TableHeaderCell
export interface TableHeaderCellInterface extends TableCellInterface {
    menu?: boolean;

    onColumnSortChange?: (sort: 'Ascending' | 'Descending' | 'None', column: TableColumnInterface) => void;
    onColumnVisibilityChange?: (visible: boolean, column?: TableColumnInterface) => void;
}
export function TableHeaderCell(properties: TableHeaderCellInterface) {
    // console.log('properties', properties);

    // Render the component
    return (
        <th
            className={mergeClassNames(
                'max-w-xs truncate p-2 px-2 py-1 text-left text-xs font-normal text-neutral-2 dark:text-neutral+5',
                properties.className,
            )}
        >
            <div className="flex items-center">
                {properties.menu ? (
                    <PopoverMenu
                        items={[
                            {
                                content: 'Ascending',
                                value: 'Ascending',
                                icon: ArrowUpIcon,
                                iconPosition: 'left',
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'Descending',
                                value: 'Descending',
                                icon: ArrowDownIcon,
                                iconPosition: 'left',
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'None',
                                value: 'None',
                                icon: ChevronsUpDownIcon,
                                iconPosition: 'left',
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'Hide',
                                value: 'Hide',
                                icon: HideIcon,
                                iconPosition: 'left',
                                closeMenuOnSelected: true,
                                onSelected: function () {
                                    if(properties.onColumnVisibilityChange) {
                                        properties.onColumnVisibilityChange(false, properties.column);
                                    }
                                },
                            },
                        ]}
                        popoverProperties={{
                            align: 'start',
                            alignOffset: -2,
                        }}
                    >
                        <Button
                            variant="tableHeaderCell"
                            size="tableHeaderCell"
                            icon={ChevronsUpDownIcon}
                            iconPosition="right"
                            iconClassName={mergeClassNames(
                                // Move the icon position a little closer if there is a tip icon
                                properties.column && (properties.column.description || properties.column.possibleValues)
                                    ? 'ml-0.5'
                                    : '',
                                'h-3 w-3',
                            )}
                        >
                            {properties.children || properties.value}
                            {properties.column &&
                                (properties.column.description || properties.column.possibleValues) && (
                                    <TipIcon
                                        className="ml-1"
                                        side="bottom"
                                        icon={InformationCircledFilledIcon}
                                        contentClassName="p-2.5"
                                        content={
                                            <div
                                                onClick={function (event) {
                                                    // Prevent the event from bubbling up
                                                    event.stopPropagation();
                                                }}
                                            >
                                                {properties.column.description && (
                                                    <p className={properties.column.possibleValues ? 'mb-2' : ''}>
                                                        {properties.column.description}
                                                    </p>
                                                )}
                                                {properties.column.possibleValues && (
                                                    <>
                                                        <p className="mb-2.5">Possible values:</p>
                                                        <div className="flex flex-col items-start space-y-2 whitespace-nowrap">
                                                            {properties.column.possibleValues.map(
                                                                function (possibleValue, possibleValueIndex) {
                                                                    return (
                                                                        <div
                                                                            key={possibleValueIndex}
                                                                            className={mergeClassNames(
                                                                                'bg-[' + possibleValue.hexColor + ']',
                                                                                'inline-flex rounded-md border px-2.5 py-1 text-xs font-medium',
                                                                            )}
                                                                        >
                                                                            {possibleValue.title || possibleValue.value}
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        }
                                    />
                                )}
                        </Button>
                    </PopoverMenu>
                ) : (
                    properties.children || properties.value
                )}
            </div>
        </th>
    );
}

// Export - Default
export default TableHeaderCell;
