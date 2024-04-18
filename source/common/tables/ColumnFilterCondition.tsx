'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputSelectItemInterface, InputSelect } from '@structure/source/common/forms/InputSelect';
import { TableColumnType, TableColumnInterface } from '@structure/source/common/tables/TableColumn';

// Dependencies - Assets
import MinusCircledIcon from '@structure/assets/icons/interface/MinusCircledIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';
import KeyIcon from '@structure/assets/icons/security/KeyIcon.svg';
import SingleLineTextIcon from '@structure/assets/icons/interface/SingleLineTextIcon.svg';
import MultipleLineTextIcon from '@structure/assets/icons/interface/MultipleLineTextIcon.svg';
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';
import LinkIcon from '@structure/assets/icons/interface/LinkIcon.svg';
import OptionIcon from '@structure/assets/icons/interface/OptionIcon.svg';
import ObjectIcon from '@structure/assets/icons/code/ObjectIcon.svg';
import ImageIcon from '@structure/assets/icons/content/ImageIcon.svg';

// Dependencies - API
import { ColumnFilterGroupOperator, ColumnFilterConditionOperator } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Component - ColumnFilterCondition
export interface ColumnFilterConditionInterface {
    id: string;
    columns: TableColumnInterface[];
    column: string;
    operator: ColumnFilterConditionOperator;
    value?: string;
    caseSensitive?: boolean;
}
export function ColumnFilterCondition(properties: ColumnFilterConditionInterface) {
    // Operators
    const operators = {
        Equal: {
            label: '=',
        },
        NotEqual: {
            label: '!=',
        },
        Like: {
            label: 'like',
        },
        NotLike: {
            label: 'not like',
        },
        GreaterThan: {
            label: '>',
        },
        GreaterThanOrEqual: {
            label: '>=',
        },
        LessThan: {
            label: '<',
        },
        LessThanOrEqual: {
            label: '<=',
        },
        In: {
            label: 'in',
        },
        NotIn: {
            label: 'not in',
        },
        IsNull: {
            label: 'is null',
        },
        IsNotNull: {
            label: 'is not null',
        },
    };
    // Loop over the operators
    let operatorsItems: InputSelectItemInterface[] = [];
    for(const operatorKey in operators) {
        operatorsItems.push({
            value: operatorKey,
            content: operators[operatorKey as keyof typeof operators].label,
        });
    }

    // console.log('columns', properties.columns);
    // console.log('columnFilterConditionData', columnFilterConditionData);

    // Function to get an input component for a condition
    function getInputComponentForCondition() {
        let inputComponent = null;

        let column = properties.columns.find((column) => column.identifier === properties.column);

        // If the operator is IsNull or IsNotNull, return null
        if(
            properties.operator === ColumnFilterConditionOperator.IsNull ||
            properties.operator === ColumnFilterConditionOperator.IsNotNull
        ) {
            inputComponent = null;
        }
        // If the column has possible values, return a select input
        else if(column?.possibleValues?.length) {
            inputComponent = (
                <InputSelect
                    className="w-64"
                    items={column?.possibleValues?.map((possibleValue) => ({
                        value: possibleValue.value,
                        content: possibleValue.title,
                    }))}
                    defaultValue={properties.value}
                    // onChange={(value) => {
                    //     setColumnFilterGroupData((previousColumnFilterGroupData) => ({
                    //         ...previousColumnFilterGroupData,
                    //         conditions: previousColumnFilterGroupData.conditions.map((oldCondition) =>
                    //             oldCondition.id === properties.id ? { ...oldCondition, value } : oldCondition,
                    //         ),
                    //     }));
                    // }}
                />
            );
        }
        // Otherwise, return a text input
        else {
            inputComponent = (
                <InputText
                    className="w-64"
                    placeholder="Value..."
                    defaultValue={properties.value}
                    // onChange={(value) => {
                    //     setColumnFilterGroupData((previousColumnFilterGroupData) => {
                    //         const updatedCondition = { ...condition, value };

                    //         return {
                    //             ...previousColumnFilterGroupData,
                    //             conditions: previousColumnFilterGroupData.conditions.map((oldCondition) =>
                    //                 oldCondition.id === properties.id ? updatedCondition : oldCondition,
                    //             ),
                    //         };
                    //     });
                    // }}
                />
            );
        }
        return inputComponent;
    }

    // Find the column for the given identifier
    let column = properties.columns.find((column) => column.identifier === properties.column);
    console.log('column', column);

    // Function to get the column for a given identifier
    function getColumnForIdentifier(identifier: string) {
        return properties.columns.find((column) => column.identifier === identifier);
    }

    // Function to get the column icon for a given column identifier
    function getColumnIconForIdentifier(identifier: string) {
        let column = getColumnForIdentifier(identifier);

        if(column) {
            // ID
            if(column.type === TableColumnType.Id) {
                return KeyIcon;
            }
            // DateTime
            else if(column.type === TableColumnType.DateTime) {
                return CalendarIcon;
            }
            // URL
            else if(column.type === TableColumnType.Url) {
                return LinkIcon;
            }
            // Option
            else if(column.type === TableColumnType.Option) {
                return OptionIcon;
            }
            // Object
            // else if(column.type === TableColumnType.Object) {
            //     return ObjectIcon;
            // }
            // Image URL
            else if(column.type === TableColumnType.ImageUrl) {
                return ImageIcon;
            }
        }

        // return SingleLineTextIcon;
        return MultipleLineTextIcon;
    }

    // Function to get the column content for a given column identifier
    function getColumnContentUsingIdentifier(identifier: string) {
        let column = getColumnForIdentifier(identifier);
        let ColumnIcon = getColumnIconForIdentifier(identifier);

        return (
            <>
                <ColumnIcon className="mr-2 h-4 w-4 text-neutral" /> {column?.title}
            </>
        );
    }

    // Render the component
    return (
        <>
            {/* Columns */}
            <InputSelect
                className="w-48"
                items={properties.columns.map(function (column) {
                    return {
                        value: column.identifier,
                        content: getColumnContentUsingIdentifier(column.identifier),
                    };
                })}
                placeholder="Column..."
                defaultValue={properties.column}
                search={true}
                // onChange={}
            />

            {/* Operators */}
            <InputSelect
                className="w-32"
                items={operatorsItems}
                defaultValue={properties.operator}
                // onChange={}
            />

            {/* Value */}
            {getInputComponentForCondition()}
        </>
    );
}

// Export - Default
export default ColumnFilterCondition;
