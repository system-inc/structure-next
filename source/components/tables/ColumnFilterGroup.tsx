'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { InputText } from '@structure/source/components/forms/InputText';
import { InputSelectItemProperties, InputSelect } from '@structure/source/components/forms/InputSelect';
import { TableColumnProperties } from '@structure/source/components/tables/TableColumn';

// Dependencies - Assets
import MinusCircledIcon from '@structure/assets/icons/interface/MinusCircledIcon.svg';
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Dependencies - API
import {
    ColumnFilterGroupOperator,
    ColumnFilterConditionOperator,
    ColumnFilterGroupInput,
    ColumnFilterInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { uniqueIdentifier } from '@structure/source/utilities/type/String';

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

// Utility - Convert ColumnFilterGroupDataInterface to ColumnFilterGroupInput
// Strips 'id' fields that are used for React keys but not needed by the API
// Filters out conditions with empty/undefined values
export function convertFiltersToGroupedInput(
    filters?: ColumnFilterGroupDataInterface,
): ColumnFilterGroupInput | undefined {
    if(!filters) return undefined;

    // Filter out conditions with empty values
    const validConditions = filters.conditions
        .filter(function (condition) {
            // For IsNull and IsNotNull operators, value is not required
            if(
                condition.operator === ColumnFilterConditionOperator.IsNull ||
                condition.operator === ColumnFilterConditionOperator.IsNotNull
            ) {
                return true;
            }
            // For other operators, require a non-empty value
            return condition.value !== undefined && condition.value !== null && condition.value !== '';
        })
        .map(function (condition) {
            return {
                column: condition.column,
                operator: condition.operator,
                value: condition.value,
                caseSensitive: condition.caseSensitive,
            };
        });

    const validNestedFilters = filters.filters
        ?.map(function (nestedFilter) {
            return convertFiltersToGroupedInput(nestedFilter);
        })
        .filter(function (filter): filter is ColumnFilterGroupInput {
            return filter !== undefined;
        });

    // Only return if there are valid conditions or nested filters
    if(validConditions.length === 0 && (!validNestedFilters || validNestedFilters.length === 0)) {
        return undefined;
    }

    return {
        operator: filters.operator,
        conditions: validConditions,
        filters: validNestedFilters,
    };
}

// Utility - Convert ColumnFilterGroupDataInterface to flat ColumnFilterInput array
// Flattens all nested groups into a single array (loses OR logic, all become AND)
// Filters out conditions with empty/undefined values
export function convertFiltersToFlatInput(filters?: ColumnFilterGroupDataInterface): ColumnFilterInput[] | undefined {
    if(!filters) return undefined;

    const flatConditions: ColumnFilterInput[] = [];

    function flatten(group: ColumnFilterGroupDataInterface) {
        // Only include conditions that have a value (not empty, null, or undefined)
        const validConditions = group.conditions
            .filter(function (condition) {
                // For IsNull and IsNotNull operators, value is not required
                if(
                    condition.operator === ColumnFilterConditionOperator.IsNull ||
                    condition.operator === ColumnFilterConditionOperator.IsNotNull
                ) {
                    return true;
                }
                // For other operators, require a non-empty value
                return condition.value !== undefined && condition.value !== null && condition.value !== '';
            })
            .map(function (condition) {
                return {
                    column: condition.column,
                    operator: condition.operator,
                    value: condition.value,
                    caseSensitive: condition.caseSensitive,
                };
            });

        flatConditions.push(...validConditions);

        group.filters?.forEach(function (nestedGroup) {
            flatten(nestedGroup);
        });
    }

    flatten(filters);
    return flatConditions.length > 0 ? flatConditions : undefined;
}

// Utility - Add IDs to filter structure coming from API/URL
export function addFilterIds(filters: ColumnFilterGroupInput): ColumnFilterGroupDataInterface {
    return {
        id: uniqueIdentifier(6),
        operator: filters.operator || ColumnFilterGroupOperator.And,
        conditions: (filters.conditions || []).map(function (condition) {
            return {
                id: uniqueIdentifier(6),
                column: condition.column,
                operator: condition.operator,
                value: condition.value,
                caseSensitive: condition.caseSensitive ?? undefined,
            };
        }),
        filters: (filters.filters || []).map(function (nestedFilter) {
            return addFilterIds(nestedFilter);
        }),
    };
}

// Component - ColumnFilterGroup
export interface ColumnFilterGroupProperties {
    className?: string;
    columns: TableColumnProperties[];
    columnFilterGroupData: ColumnFilterGroupDataInterface;
    onChange: (columnFilterGroupData: ColumnFilterGroupDataInterface) => void;
    onRemove?: () => void;
    filterMode?: 'Flat' | 'Grouped'; // Default: 'Grouped'
    synchronizeWithUrl?: boolean; // Default: false
    urlParameterName?: string; // Default: 'filters'
}
export function ColumnFilterGroup(properties: ColumnFilterGroupProperties) {
    // State
    const [columnFilterGroupData, setColumnFilterGroupData] = React.useState<ColumnFilterGroupDataInterface>(
        // If there are no conditions, create a new one
        properties.columnFilterGroupData.conditions.length === 0
            ? {
                  ...properties.columnFilterGroupData,
                  conditions: [
                      {
                          id: uniqueIdentifier(6),
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
                          id: condition.id ?? uniqueIdentifier(6),
                      };
                  }),
                  filters: properties.columnFilterGroupData.filters?.map((filter) => {
                      return {
                          ...filter,
                          id: filter.id ?? uniqueIdentifier(6),
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
        [columnFilterGroupData, propertiesOnChange],
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
    const operatorsItems: InputSelectItemProperties[] = [];
    for(const operatorKey in operators) {
        operatorsItems.push({
            value: operatorKey,
            children: operators[operatorKey as keyof typeof operators].label,
        });
    }

    // Function to add a new filter group
    function addNewFilterGroup() {
        // Create a new filter group
        const newFilterGroup: ColumnFilterGroupDataInterface = {
            id: uniqueIdentifier(6),
            operator: ColumnFilterGroupOperator.And,
            conditions: [
                // Enforce at least one condition
                {
                    id: uniqueIdentifier(6),
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
            id: uniqueIdentifier(6),
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
        <div
            className={mergeClassNames(
                'mr-4 inline-flex flex-col rounded-md border border--a p-4',
                properties.className,
            )}
        >
            <div className="flex flex-col space-y-2">
                {/* Conditions */}
                {columnFilterGroupData.conditions.map(function (condition, conditionIndex) {
                    return (
                        <div id="condition" key={condition.id} className="flex space-x-2">
                            {/* Operator */}
                            {conditionIndex === 0 ? (
                                // First condition
                                <p className="flex h-9 min-w-[96px] shrink-0 content-center items-center justify-center rounded-md text-sm content--c">
                                    Where
                                </p>
                            ) : conditionIndex === 1 ? (
                                // Second condition
                                <InputSelect
                                    className="w-24"
                                    items={[
                                        { value: ColumnFilterGroupOperator.And, children: 'and' },
                                        { value: ColumnFilterGroupOperator.Or, children: 'or' },
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
                                <p className="flex h-9 min-w-[96px] shrink-0 content-center items-center justify-center rounded-md px-4 text-sm content--b">
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
                                variant="GhostDestructive"
                                size="Icon"
                                icon={MinusCircledIcon}
                                onClick={function () {
                                    removeCondition(condition.id);
                                }}
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

            {/* Nested Filters - Only show in Grouped mode */}
            {properties.filterMode !== 'Flat' &&
                columnFilterGroupData.filters?.map((filter, filterIndex) => (
                    <div key={filter.id} className="mt-4 flex items-start space-x-2">
                        {/* Operator Indicator */}
                        {columnFilterGroupData.conditions.length === 1 && filterIndex === 0 ? (
                            // Second condition
                            <InputSelect
                                className="w-24"
                                items={[
                                    { value: ColumnFilterGroupOperator.And, children: 'and' },
                                    { value: ColumnFilterGroupOperator.Or, children: 'or' },
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
                            <p className="flex h-9 min-w-[96px] shrink-0 content-center items-center justify-center rounded-md px-4 text-sm content--b">
                                {columnFilterGroupData.operator.toLowerCase()}
                            </p>
                        )}

                        {/* Nested Filter Group */}
                        <ColumnFilterGroup
                            className="flex grow"
                            columns={properties.columns}
                            columnFilterGroupData={filter}
                            filterMode={properties.filterMode}
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
                <Button variant="A" iconLeft={PlusIcon} onClick={addNewCondition}>
                    Add Condition
                </Button>

                {/* Add Filter Group Button - Only show in Grouped mode */}
                {properties.filterMode !== 'Flat' && (
                    <Button variant="A" iconLeft={PlusIcon} onClick={addNewFilterGroup}>
                        Add Filter Group
                    </Button>
                )}

                {/* Remove Button - Only show if not the root group (every child FilterGroup has an id) */}
                {properties.columnFilterGroupData.id && (
                    <Button
                        variant="GhostDestructive"
                        iconLeft={MinusCircledIcon}
                        onClick={removeFilterGroupButtonOnClickIntercept}
                    >
                        Remove Group
                    </Button>
                )}
            </div>
        </div>
    );
}
