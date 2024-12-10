// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RequestParameterInterface } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { InputText } from '@structure/source/common/forms/InputText';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import {
    InputCheckbox,
    InputCheckboxState,
    InputCheckboxReferenceInterface,
} from '@structure/source/common/forms/InputCheckbox';

// Types
export type RequestParameterSectionType = 'Headers' | 'UrlPath' | 'UrlQuery' | 'Body';
export interface RequestParameterStateInterface {
    enabled: boolean;
    value?: string;
}

// Component - ParameterRow
export interface RequestParameterRowInterface extends RequestParameterInterface {
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
export function RequestParameterRow(properties: RequestParameterRowInterface) {
    // References
    const inputCheckboxReference = React.useRef<InputCheckboxReferenceInterface>(null);

    // State
    const [value, setValue] = React.useState(properties.defaultValue);

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
        // If the parameter has a list of possible values, render an InputSelect
        if(properties.possibleValues) {
            return (
                <InputSelect
                    className="w-full"
                    placeholder={`Select...`}
                    items={properties.possibleValues.map(function (possibleValue: string) {
                        return {
                            value: possibleValue,
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

    // Render the component
    return (
        <tr className="border" onClick={handleRowClick}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {/* Checkbox to enable or disable the parameter */}
                    <InputCheckbox
                        ref={inputCheckboxReference}
                        // If the parameter is required, set the checkbox to checked no matter what
                        defaultValue={
                            properties.nullable === false
                                ? InputCheckboxState.Checked
                                : properties.enabled
                                  ? InputCheckboxState.Checked
                                  : InputCheckboxState.Unchecked
                        }
                        onChange={function (newValue) {
                            properties.onStateChange(properties.section, properties.name, {
                                value: value,
                                enabled: newValue === InputCheckboxState.Checked,
                            });
                        }}
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
                <span className="inline-block rounded px-2 py-1">{properties.type}</span>
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
    );
}

// Export - Default
export default RequestParameterRow;
