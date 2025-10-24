'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RequestParameterProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import {
    RequestParameterRow,
    RequestParameterSectionType,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/RequestParameterRow';

// Component - ArrayRequestParameterRow
export interface ArrayRequestParameterRowProperties extends RequestParameterProperties {
    section: RequestParameterSectionType;
    name: string;
    enabled: boolean;
    indentationLevel?: number;
    onStateChange: (
        requestParameterSection: RequestParameterSectionType,
        requestParameterPath: string,
        requestParameterState: RequestParameterStateInterface,
    ) => void;
    onChildStateChange?: (childName: string, isEnabled: boolean) => void;
}

export function ArrayRequestParameterRow(properties: ArrayRequestParameterRowProperties) {
    // State
    const [items, setItems] = React.useState<number[]>([0]);

    // Function to add a new item
    function handleAddItem() {
        setItems((prevItems) => [...prevItems, prevItems.length]);
    }

    // Function to remove an item
    function handleRemoveItem(index: number) {
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));

        // Clear state for removed item
        if(properties.fields) {
            (properties.fields as RequestParameterProperties[]).forEach(function (field) {
                const path = `${properties.name}[${index}].${field.name}`;
                properties.onStateChange(properties.section, path, {
                    enabled: false,
                    value: undefined,
                });
            });
        }
    }

    // Function to handle state changes from array items
    function handleArrayItemStateChange(
        section: RequestParameterSectionType,
        fieldPath: string,
        state: RequestParameterStateInterface,
        index: number,
    ) {
        // If the field path contains array notation, it's a nested array
        if(fieldPath.includes('[')) {
            // Extract the array name and nested field path
            const matches = fieldPath.match(/(.+?)\[(\d+)\]\.(.+)/);
            if(matches && matches.length === 4) {
                const [, arrayName, arrayIndex, nestedFieldPath] = matches;
                // Create the new path preserving the array notation for nested arrays
                const fullPath = `${properties.name}[${index}].${arrayName}[${arrayIndex}].${nestedFieldPath}`;
                properties.onStateChange(section, fullPath, state);
                return;
            }
        }

        // For regular fields, use the standard array notation
        const fullPath = `${properties.name}[${index}].${fieldPath}`;
        properties.onStateChange(section, fullPath, state);

        // Notify parent about child state change
        properties.onChildStateChange?.(`${index}.${fieldPath}`, state.enabled);
    }

    // Render the component
    return (
        <div className="w-full overflow-hidden rounded-md border border--0">
            {/* Header with description and add button */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Array Items</span>
                        <span className="inline-block rounded-md px-1.5 py-0.5 text-xs">{properties.type}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{properties.description}</p>
                </div>
                <Button onClick={handleAddItem}>+ Add Item</Button>
            </div>

            {items.map((index) => (
                <div key={index} className="border-b last:border-b-0">
                    {/* Item header */}
                    <div className="flex items-center justify-between border-b px-4 py-2">
                        <span className="font-medium">Item {index + 1}</span>
                        <Button
                            className="text-red-500"
                            onClick={function () {
                                handleRemoveItem(index);
                            }}
                        >
                            Remove
                        </Button>
                    </div>

                    {/* Item fields table */}
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left font-medium">Parameter</th>
                                <th className="px-4 py-2 text-left font-medium">Type</th>
                                <th className="px-4 py-2 text-left font-medium">Description</th>
                                <th className="px-4 py-2 text-left font-medium">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(properties.fields as RequestParameterProperties[]).map((field) => (
                                <RequestParameterRow
                                    key={field.name}
                                    {...field}
                                    section={properties.section}
                                    enabled={properties.enabled}
                                    onStateChange={(section, path, state) =>
                                        handleArrayItemStateChange(section, path, state, index)
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
