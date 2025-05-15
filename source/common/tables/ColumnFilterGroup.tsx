'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputSelectItemInterface, InputSelect } from '@structure/source/common/forms/InputSelect';
import { TableColumnInterface } from '@structure/source/common/tables/TableColumn';

// Dependencies - Assets
import MinusCircledIcon from '@structure/assets/icons/interface/MinusCircledIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - API
import {
    ColumnFilterGroupOperator,
    ColumnFilterConditionOperator,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Interface - ColumnFilterConditionDataInterface
export interface ColumnFilterConditionDataInterface {
    id: string;
    column: string;
    operator: ColumnFilterConditionOperator;
    value?: string;
    caseSensitive?: boolean;
}

// Interface - ColumnFilterGroupDataInterface
export interface ColumnFilterGroupDataInterface {
    id?: string;
    operator: ColumnFilterGroupOperator;
    conditions: ColumnFilterConditionDataInterface[];
    filters?: ColumnFilterGroupDataInterface[];
}

// Component - ColumnFilterGroup
export interface ColumnFilterGroupInterface {
    className?: string;
    columns: TableColumnInterface[];
    columnFilterGroupData: ColumnFilterGroupDataInterface;
    onChange: (columnFilterGroupData: ColumnFilterGroupDataInterface) => void;
    onRemove?: () => void;
}
export function ColumnFilterGroup(properties: ColumnFilterGroupInterface) {
    // State
    const [columnFilterGroupData, setColumnFilterGroupData] = React.useState<ColumnFilterGroupDataInterface>(
        // If there are no conditions, create a new one
        properties.columnFilterGroupData.conditions.length === 0
            ? {
                  ...properties.columnFilterGroupData,
                  conditions: [
                      {
                          id: uniqueIdentifier(),
                          column: properties.columns[0]?.identifier ?? '',
                          operator: ColumnFilterConditionOperator.Equal,
                          value: '',
                      },
                  ],
              }
            : // Otherwise, just use the data, but ensure all conditions have a unique ID
              {
                  ...properties.columnFilterGroupData,
                  conditions: properties.columnFilterGroupData.conditions.map((condition) => {
                      return {
                          ...condition,
                          id: condition.id ?? uniqueIdentifier(),
                      };
                  }),
                  filters: properties.columnFilterGroupData.filters?.map((filter) => {
                      return {
                          ...filter,
                          id: filter.id ?? uniqueIdentifier(),
                      };
                  }),
              },
    );

    // Effect to trigger onChange when the filterData changes
    const propertiesOnChange = properties.onChange;
    React.useEffect(
        function () {
            // Call the properties onChange function
            if(propertiesOnChange && columnFilterGroupData) {
                propertiesOnChange(columnFilterGroupData);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [columnFilterGroupData],
    );

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
    const operatorsItems: InputSelectItemInterface[] = [];
    for(const operatorKey in operators) {
        operatorsItems.push({
            value: operatorKey,
            content: operators[operatorKey as keyof typeof operators].label,
        });
    }

    // Function to add a new filter group
    function addNewFilterGroup() {
        // Create a new filter group
        const newFilterGroup: ColumnFilterGroupDataInterface = {
            id: uniqueIdentifier(),
            operator: ColumnFilterGroupOperator.And,
            conditions: [
                // Enforce at least one condition
                {
                    id: uniqueIdentifier(),
                    column: properties.columns[0]?.identifier ?? '',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: '',
                },
            ],
        };

        // Append the new filter group to the filters state
        setColumnFilterGroupData((prevData) => ({
            ...prevData,
            filters: [...(prevData.filters || []), newFilterGroup],
        }));
    }

    // Function to remove a filter group
    function removeFilterGroup(filterId: string) {
        // Remove the filter group from the filters state
        setColumnFilterGroupData((prevData) => ({
            ...prevData,
            filters: (prevData.filters || []).filter((f) => f.id !== filterId),
        }));
    }

    // Function to add a new condition
    function addNewCondition() {
        // Create a new condition
        const newCondition: ColumnFilterConditionDataInterface = {
            id: uniqueIdentifier(),
            column: properties.columns[0]?.identifier ?? '',
            operator: ColumnFilterConditionOperator.Equal,
            value: '',
        };

        // Append the new condition to the conditions state
        setColumnFilterGroupData((prevData) => ({
            ...prevData,
            conditions: [...prevData.conditions, newCondition],
        }));
    }

    // Function to remove a condition
    function removeCondition(conditionId: string) {
        // Remove the condition from the conditions state
        setColumnFilterGroupData((prevData) => ({
            ...prevData,
            conditions: prevData.conditions.filter((c) => c.id !== conditionId),
        }));
    }

    // Function to intercept remove button click
    function removeFilterGroupButtonOnClickIntercept(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();
        if(properties.onRemove) {
            properties.onRemove();
        }
        else if(columnFilterGroupData.id) {
            removeFilterGroup(columnFilterGroupData.id);
        }
        else {
            console.error('ColumnFilterGroup: removeFilterGroupButtonOnClickIntercept: No ID to remove');
        }
    }

    // Function to get an input component for a condition
    function getInputComponentForCondition(condition: ColumnFilterConditionDataInterface) {
        let inputComponent = null;

        const column = properties.columns.find((column) => column.identifier === condition.column);

        // If the operator is IsNull or IsNotNull, return null
        if(
            condition.operator === ColumnFilterConditionOperator.IsNull ||
            condition.operator === ColumnFilterConditionOperator.IsNotNull
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
                    defaultValue={condition.value}
                    onChange={(value) => {
                        setColumnFilterGroupData((previousColumnFilterGroupData) => ({
                            ...previousColumnFilterGroupData,
                            conditions: previousColumnFilterGroupData.conditions.map((oldCondition) =>
                                oldCondition.id === condition.id ? { ...oldCondition, value } : oldCondition,
                            ),
                        }));
                    }}
                />
            );
        }
        // Otherwise, return a text input
        else {
            inputComponent = (
                <InputText
                    id="columnFilterConditionValue"
                    className="w-64"
                    placeholder="Value..."
                    defaultValue={condition.value}
                    onChange={(value) => {
                        setColumnFilterGroupData((previousColumnFilterGroupData) => {
                            const updatedCondition = { ...condition, value };

                            return {
                                ...previousColumnFilterGroupData,
                                conditions: previousColumnFilterGroupData.conditions.map((oldCondition) =>
                                    oldCondition.id === condition.id ? updatedCondition : oldCondition,
                                ),
                            };
                        });
                    }}
                />
            );
        }
        return inputComponent;
    }

    // console.log('columns', properties.columns);
    // console.log('columnFilterGroupData', columnFilterGroupData);

    // Render the component
    return (
        <div className={mergeClassNames('mr-4 inline-flex flex-col rounded-medium border p-4', properties.className)}>
            <div className="flex flex-col space-y-2">
                {/* Conditions */}
                {columnFilterGroupData.conditions.map(function (condition, conditionIndex) {
                    return (
                        <div id="condition" key={condition.id} className="flex space-x-2">
                            {/* Operator */}
                            {conditionIndex === 0 ? (
                                // First condition
                                <p className="flex h-9 min-w-[96px] flex-shrink-0 content-center items-center justify-center rounded-medium text-sm text-neutral">
                                    Where
                                </p>
                            ) : conditionIndex === 1 ? (
                                // Second condition
                                <InputSelect
                                    className="w-24"
                                    items={[
                                        { value: ColumnFilterGroupOperator.And, content: 'and' },
                                        { value: ColumnFilterGroupOperator.Or, content: 'or' },
                                    ]}
                                    defaultValue={columnFilterGroupData.operator}
                                    onChange={function (value) {
                                        setColumnFilterGroupData(function (previousColumnFilterGroupData) {
                                            return {
                                                ...previousColumnFilterGroupData,
                                                operator: value as ColumnFilterGroupOperator,
                                            };
                                        });
                                    }}
                                />
                            ) : (
                                // Other conditions
                                <p className="text-muted-foreground flex h-9 min-w-[96px] flex-shrink-0 content-center items-center justify-center rounded-medium px-4 text-sm">
                                    {columnFilterGroupData.operator.toLowerCase()}
                                </p>
                            )}

                            {/* Columns */}

                            {/* TODO: Migrate to using this */}
                            {/* <ColumnFilterCondition
                                id={condition.id}
                                columns={properties.columns}
                                column={condition.column}
                                operator={condition.operator}
                                value={condition.value}
                            /> */}

                            <InputSelect
                                className="w-48"
                                items={properties.columns.map(function (column) {
                                    return {
                                        value: column.identifier,
                                        content: column.title,
                                    };
                                })}
                                placeholder="Column..."
                                defaultValue={condition.column}
                                search={true}
                                onChange={function (value) {
                                    setColumnFilterGroupData(function (previousColumnFilterGroupData) {
                                        const updatedConditions = previousColumnFilterGroupData.conditions.map(
                                            function (currentCondition, currentConditionIndex) {
                                                if(currentConditionIndex === conditionIndex) {
                                                    return {
                                                        ...currentCondition,
                                                        column: value || '',
                                                    };
                                                }
                                                return currentCondition;
                                            },
                                        );
                                        return {
                                            ...previousColumnFilterGroupData,
                                            conditions: updatedConditions,
                                        };
                                    });
                                }}
                            />

                            {/* Operators */}
                            <InputSelect
                                className="w-32"
                                items={operatorsItems}
                                defaultValue={condition.operator}
                                onChange={function (value) {
                                    setColumnFilterGroupData(function (previousColumnFilterGroupData) {
                                        const updatedConditions = previousColumnFilterGroupData.conditions.map(
                                            function (currentCondition, currentConditionIndex) {
                                                if(currentConditionIndex === conditionIndex) {
                                                    return {
                                                        ...currentCondition,
                                                        operator: value as ColumnFilterConditionOperator,
                                                    };
                                                }
                                                return currentCondition;
                                            },
                                        );
                                        return {
                                            ...previousColumnFilterGroupData,
                                            conditions: updatedConditions,
                                        };
                                    });
                                }}
                            />

                            {/* Value */}
                            {getInputComponentForCondition(condition)}

                            {/* Remove Condition Button */}
                            <Button
                                // Disabled if there is only one condition
                                disabled={columnFilterGroupData.conditions.length === 1}
                                variant="ghostDestructive"
                                size="icon"
                                icon={MinusCircledIcon}
                                onClick={() => removeCondition(condition.id)}
                                tip={
                                    columnFilterGroupData.conditions.length === 1 ? (
                                        <p>At least one condition is required</p>
                                    ) : undefined
                                }
                            />
                        </div>
                    );
                })}
            </div>

            {/* Nested Filters */}
            {columnFilterGroupData.filters?.map((filter, filterIndex) => (
                <div key={filter.id} className="mt-4 flex items-start space-x-2">
                    {/* Operator Indicator */}
                    {columnFilterGroupData.conditions.length === 1 && filterIndex === 0 ? (
                        // Second condition
                        <InputSelect
                            className="w-24"
                            items={[
                                { value: ColumnFilterGroupOperator.And, content: 'and' },
                                { value: ColumnFilterGroupOperator.Or, content: 'or' },
                            ]}
                            defaultValue={columnFilterGroupData.operator}
                            onChange={function (value) {
                                setColumnFilterGroupData(function (previousColumnFilterGroupData) {
                                    return {
                                        ...previousColumnFilterGroupData,
                                        operator: value as ColumnFilterGroupOperator,
                                    };
                                });
                            }}
                        />
                    ) : (
                        <p className="text-muted-foreground flex h-9 min-w-[96px] flex-shrink-0 content-center items-center justify-center rounded-medium px-4 text-sm">
                            {columnFilterGroupData.operator.toLowerCase()}
                        </p>
                    )}

                    {/* Nested Filter Group */}
                    <ColumnFilterGroup
                        className="flex flex-grow"
                        columns={properties.columns}
                        columnFilterGroupData={filter}
                        onChange={function (updatedColumnFilterGroup) {
                            setColumnFilterGroupData((previousColumnFilterGroupData) => {
                                const updatedFilters = previousColumnFilterGroupData.filters?.map(
                                    (previousColumnFilterGroupDataFilter) =>
                                        previousColumnFilterGroupDataFilter.id === updatedColumnFilterGroup.id
                                            ? updatedColumnFilterGroup
                                            : previousColumnFilterGroupDataFilter,
                                );
                                return {
                                    ...previousColumnFilterGroupData,
                                    filters: updatedFilters,
                                };
                            });
                        }}
                        onRemove={function () {
                            removeFilterGroup(filter.id ?? '');
                        }}
                    />
                </div>
            ))}

            {/* Controls */}
            <div className="mt-4 flex space-x-2">
                {/* Add Condition Button */}
                <Button icon={PlusIcon} iconPosition="left" iconClassName="h-3 w-3" onClick={addNewCondition}>
                    Add Condition
                </Button>

                {/* Add Filter Group Button */}
                <Button
                    variant="ghost"
                    icon={PlusIcon}
                    iconClassName="h-3 w-3"
                    iconPosition="left"
                    onClick={addNewFilterGroup}
                >
                    Add Filter Group
                </Button>

                {/* Remove Button - Only show if not the root group (every child FilterGroup has an id) */}
                {properties.columnFilterGroupData.id && (
                    <Button
                        variant="ghostDestructive"
                        icon={MinusCircledIcon}
                        iconPosition="left"
                        onClick={removeFilterGroupButtonOnClickIntercept}
                    >
                        Remove Group
                    </Button>
                )}
            </div>
        </div>
    );
}

// Export - Default
export default ColumnFilterGroup;
