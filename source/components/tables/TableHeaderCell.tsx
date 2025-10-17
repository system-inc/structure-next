// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableColumnProperties } from '@structure/source/components/tables/TableColumn';
import { TableCellProperties } from '@structure/source/components/tables/TableCell';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { TipIcon } from '@structure/source/components/popovers/TipIcon';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import InformationCircledFilledIcon from '@structure/assets/icons/status/InformationCircledFilledIcon.svg';
import ChevronsUpDownIcon from '@structure/assets/icons/interface/ChevronsUpDownIcon.svg';
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';
import ArrowDownIcon from '@structure/assets/icons/interface/ArrowDownIcon.svg';
import HideIcon from '@structure/assets/icons/security/HideIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TableHeaderCell
export interface TableHeaderCellProperties extends TableCellProperties {
    menu?: boolean;

    onColumnSortChange?: (sort: 'Ascending' | 'Descending' | 'None', column: TableColumnProperties) => void;
    onColumnVisibilityChange?: (visible: boolean, column?: TableColumnProperties) => void;
}
export function TableHeaderCell(properties: TableHeaderCellProperties) {
    // console.log('properties', properties);

    // Render the component
    return (
        <th
            className={mergeClassNames(
                'dark:text-neutral+5 max-w-xs truncate p-2 px-2 py-1 text-left text-xs font-normal text-neutral-2',
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
                                iconLeft: <ArrowUpIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'Descending',
                                value: 'Descending',
                                iconLeft: <ArrowDownIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'None',
                                value: 'None',
                                iconLeft: <ChevronsUpDownIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                content: 'Hide',
                                value: 'Hide',
                                iconLeft: <HideIcon />,
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
                            variant="TableHeaderCell"
                            size="TableHeaderCell"
                            iconRight={
                                <ChevronsUpDownIcon
                                    className={mergeClassNames(
                                        // Move the icon position a little closer if there is a tip icon
                                        properties.column &&
                                            (properties.column.description || properties.column.possibleValues)
                                            ? 'ml-0.5'
                                            : '',
                                        'h-3 w-3',
                                    )}
                                />
                            }
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
                                                                                'inline-flex rounded-medium border px-2.5 py-1 text-xs font-medium',
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
