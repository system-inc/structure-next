'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RequestParameterProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import {
    RequestParameterRow,
    RequestParameterSectionType,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/RequestParameterRow';

// Component - ObjectRequestParameterRow
export interface ObjectRequestParameterRowProperties extends RequestParameterProperties {
    section: RequestParameterSectionType;
    name: string;
    enabled: boolean;
    indentationLevel?: number;
    fields?: RequestParameterProperties[];
    onStateChange: (
        requestParameterSection: RequestParameterSectionType,
        requestParameterPath: string,
        requestParameterState: RequestParameterStateInterface,
    ) => void;
    onChildStateChange?: (childName: string, isEnabled: boolean) => void;
}

export function ObjectRequestParameterRow(properties: ObjectRequestParameterRowProperties) {
    // Function to handle state changes from nested fields
    function handleNestedStateChange(
        section: RequestParameterSectionType,
        fieldPath: string,
        state: RequestParameterStateInterface,
    ) {
        const fullPath = `${properties.name}.${fieldPath}`;
        properties.onStateChange(section, fullPath, state);

        // Notify parent about child state change
        if(properties.onChildStateChange) {
            properties.onChildStateChange(fieldPath, state.enabled);
        }
    }

    // Render the component
    return (
        <div className="w-full overflow-hidden rounded-medium border border-opsis-border-primary">
            {/* Object properties table */}
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
                    {properties.fields?.map((field) => (
                        <RequestParameterRow
                            key={field.name}
                            {...field}
                            section={properties.section}
                            enabled={properties.enabled}
                            onStateChange={handleNestedStateChange}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
