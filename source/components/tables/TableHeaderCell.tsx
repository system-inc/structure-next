// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TableColumnProperties } from '@structure/source/components/tables/TableColumn';
import { TableCellProperties } from '@structure/source/components/tables/TableCell';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { TipButton } from '@structure/source/components/buttons/TipButton';
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
                'max-w-xs truncate p-2 px-2 py-1 text-left text-xs font-normal content--2',
                properties.className,
            )}
        >
            <div className="flex items-center">
                {properties.menu ? (
                    <PopoverMenu
                        trigger={
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
                                        <TipButton
                                            className="ml-1"
                                            popoverProperties={{
                                                side: 'Bottom',
                                            }}
                                            icon={InformationCircledFilledIcon}
                                            tipClassName="p-2.5"
                                            tip={
                                                (
                                                    <div
                                                        onClick={function (event) {
                                                            // Prevent the event from bubbling up
                                                            event.stopPropagation();
                                                        }}
                                                    >
                                                        {properties.column.description && (
                                                            <p
                                                                className={
                                                                    properties.column.possibleValues ? 'mb-2' : ''
                                                                }
                                                            >
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
                                                                                        'bg-[' +
                                                                                            possibleValue.hexColor +
                                                                                            ']',
                                                                                        'inline-flex rounded-md border px-2.5 py-1 text-xs font-medium',
                                                                                    )}
                                                                                >
                                                                                    {possibleValue.title ||
                                                                                        possibleValue.value}
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ) as React.ReactNode
                                            }
                                        />
                                    )}
                            </Button>
                        }
                        items={[
                            {
                                value: 'Ascending',
                                children: 'Ascending',
                                iconLeft: <ArrowUpIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                value: 'Descending',
                                children: 'Descending',
                                iconLeft: <ArrowDownIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                value: 'None',
                                children: 'None',
                                iconLeft: <ChevronsUpDownIcon />,
                                closeMenuOnSelected: true,
                            },
                            {
                                value: 'Hide',
                                children: 'Hide',
                                iconLeft: <HideIcon />,
                                closeMenuOnSelected: true,
                                onSelected: function () {
                                    properties.onColumnVisibilityChange?.(false, properties.column);
                                },
                            },
                        ]}
                        popoverProperties={{
                            align: 'Start',
                            alignOffset: -2,
                        }}
                    />
                ) : (
                    properties.children || properties.value
                )}
            </div>
        </th>
    );
}
