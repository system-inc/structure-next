// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { InputText } from '@structure/source/components/forms/InputText';
import { InputSelect } from '@structure/source/components/forms/InputSelect';
import {
    InputCheckbox,
    InputCheckboxState,
    InputCheckboxReferenceInterface,
} from '@structure/source/components/forms/InputCheckbox';
import { ObjectRequestParameterRow } from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/ObjectRequestParameterRow';
import { ArrayRequestParameterRow } from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/ArrayRequestParameterRow';

// Dependencies - Types
import { RequestParameterProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Types
export type RequestParameterSectionType = 'Headers' | 'UrlPath' | 'UrlQuery' | 'Body';
export interface RequestParameterStateInterface {
    enabled: boolean;
    value?: string;
}

// Component - ParameterRow
export interface RequestParameterRowProperties extends RequestParameterProperties {
    section: RequestParameterSectionType;
    name: string;
    enabled: boolean;
    defaultValue?: string;
    onStateChange: (
        requestParameterSection: RequestParameterSectionType,
        requestParameterName: string,
        requestParameterState: RequestParameterStateInterface,
    ) => void;
}
export function RequestParameterRow(properties: RequestParameterRowProperties) {
    // References
    const inputCheckboxReference = React.useRef<InputCheckboxReferenceInterface>(null);

    // State
    const [value, setValue] = React.useState(properties.defaultValue);
    const [childStates, setChildStates] = React.useState<Map<string, boolean>>(new Map());
    const [manuallyUnchecked, setManuallyUnchecked] = React.useState(false);

    // State for expand/collapse
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Effect to update checkbox state based on child states
    React.useEffect(
        function () {
            if(properties.type === 'Object' || properties.type === 'Array') {
                // Only update based on child states if not manually unchecked
                if(!manuallyUnchecked) {
                    const hasEnabledChildren = Array.from(childStates.values()).some((state) => state);
                    const newState = hasEnabledChildren ? InputCheckboxState.Checked : InputCheckboxState.Unchecked;
                    inputCheckboxReference.current?.setValue?.(newState);
                }
            }
        },
        [childStates, manuallyUnchecked, properties.type],
    );

    // Function to handle checkbox change
    function handleCheckboxChange(newValue: InputCheckboxState | undefined) {
        // If newValue is undefined, treat it as unchecked
        const isChecked = newValue === InputCheckboxState.Checked;
        setManuallyUnchecked(!isChecked);

        properties.onStateChange(properties.section, properties.name, {
            value: value,
            enabled: isChecked,
        });
    }

    // Function to handle child state changes
    function handleChildStateChange(childName: string, isEnabled: boolean) {
        setChildStates((prevStates) => {
            const newStates = new Map(prevStates);
            newStates.set(childName, isEnabled);
            return newStates;
        });
    }

    // Function to intercept onValueChange
    function onValueChangeIntercept(newValue?: string) {
        setValue(newValue);

        // If there is no value, set the checkbox to unchecked and call onEnabledChange
        if(!newValue) {
            inputCheckboxReference.current?.setValue?.(InputCheckboxState.Unchecked);

            properties.onStateChange(properties.section, properties.name, {
                value: newValue,
                enabled: false,
            });
        }
        // If there is a value, set the checkbox to checked and call onEnabledChange
        else {
            inputCheckboxReference.current?.setValue?.(InputCheckboxState.Checked);

            properties.onStateChange(properties.section, properties.name, {
                value: newValue,
                enabled: true,
            });
        }
    }

    // Function to handle row click
    function handleRowClick(event: React.MouseEvent) {
        // If the click is on the row or cell, click the checkbox (not the text)
        if(
            event.target instanceof HTMLTableRowElement ||
            event.target instanceof HTMLTableCellElement ||
            event.target instanceof HTMLDivElement
        ) {
            inputCheckboxReference.current?.click?.();
        }
    }

    // Function to render the appropriate input based on parameter type
    function renderInput() {
        // For Array and Object types, show an expand/collapse button
        if((properties.type === 'Array' || properties.type === 'Object') && properties.fields) {
            return (
                <Button
                    onClick={function (event) {
                        event.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-sm"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </Button>
            );
        }

        // If the parameter is a boolean, render an InputCheckbox
        if(properties.type === 'Boolean') {
            return (
                <InputCheckbox
                    defaultValue={
                        properties.defaultValue === 'true' ? InputCheckboxState.Checked : InputCheckboxState.Unchecked
                    }
                    onChange={function (newValue) {
                        onValueChangeIntercept(newValue === InputCheckboxState.Checked ? 'true' : 'false');
                    }}
                />
            );
        }
        // If the parameter has a list of possible values, render an InputSelect
        else if(properties.possibleValues) {
            return (
                <InputSelect
                    className="w-full"
                    placeholder={`Select...`}
                    items={properties.possibleValues.map(function (possibleValue: string | number) {
                        return {
                            value: String(possibleValue),
                            content: possibleValue,
                        };
                    })}
                    allowNoSelection={true}
                    defaultValue={properties.defaultValue}
                    onChange={onValueChangeIntercept}
                />
            );
        }
        // Otherwise, render an InputText
        else {
            return (
                <InputText
                    id={properties.name}
                    className="w-full"
                    placeholder={typeof properties.example === 'string' ? properties.example : properties.name}
                    defaultValue={properties.defaultValue}
                    onChange={onValueChangeIntercept}
                />
            );
        }
    }

    // Render the component
    return (
        <>
            <tr className="border border-opsis-border-primary" onClick={handleRowClick}>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        {/* Checkbox to enable or disable the parameter */}
                        <InputCheckbox
                            ref={inputCheckboxReference}
                            // If the parameter is required, set the checkbox to checked no matter what
                            defaultValue={
                                properties.required
                                    ? InputCheckboxState.Checked
                                    : properties.enabled
                                      ? InputCheckboxState.Checked
                                      : InputCheckboxState.Unchecked
                            }
                            disabled={properties.required}
                            onChange={handleCheckboxChange}
                        />
                        <span
                            className="font-mono"
                            onClick={function () {
                                inputCheckboxReference.current?.click?.();
                            }}
                        >
                            {properties.name}
                        </span>
                    </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-block rounded-medium bg-light-2 px-1.5 py-0.5 text-sm dark:bg-dark-3">
                            {properties.type}
                        </span>
                    </div>
                </td>

                {/* Description */}
                <td className="px-4 py-3">
                    <span>{properties.description}</span>{' '}
                    {properties.possibleValues && (
                        <div className="text-gray-500"> ({properties.possibleValues.join(' | ')})</div>
                    )}
                </td>

                {/* Input */}
                <td className="px-4 py-3">{renderInput()}</td>
            </tr>
            {isExpanded && (properties.type === 'Array' || properties.type === 'Object') && properties.fields && (
                <tr>
                    <td colSpan={4} className="px-4 py-3">
                        {properties.type === 'Array' ? (
                            <ArrayRequestParameterRow
                                {...properties}
                                indentationLevel={0}
                                onStateChange={properties.onStateChange}
                            />
                        ) : (
                            <ObjectRequestParameterRow
                                {...properties}
                                fields={properties.fields as RequestParameterProperties[]}
                                indentationLevel={0}
                                onStateChange={properties.onStateChange}
                                onChildStateChange={handleChildStateChange}
                            />
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}
