// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RestEndpointNodeInterface } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components

// Component - RequestParametersTable
export interface RequestParametersTableInterface {
    requestParameters: RestEndpointNodeInterface['endpoint']['requestParameters'];
}
export function RequestParametersTable(properties: RequestParametersTableInterface) {
    if(!properties.requestParameters) return null;

    // Function to render parameter rows recursively
    function renderParameterRows(parameters: any, parentKey = '') {
        return Object.entries(parameters).map(([key, value]: [string, any]) => {
            if(key === 'formField') return null;
            if(typeof value !== 'object') return null;

            return (
                <tr key={parentKey + key} className="border">
                    <td className="px-4 py-3 font-mono">{key}</td>
                    <td className="px-4 py-3">
                        <span className="inline-block rounded px-2 py-1">
                            {value.type}
                            {value.enum && <span className="text-gray-500"> ({value.enum.join(' | ')})</span>}
                        </span>
                    </td>
                    <td className="px-4 py-3">{value.description}</td>
                </tr>
            );
        });
    }

    // Render the component
    return (
        <div className="max-w-[1024px] overflow-x-auto text-sm">
            <div className="overflow-hidden rounded-md border">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-semibold">Parameter</th>
                            <th className="px-4 py-3 text-left font-semibold">Type</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(properties.requestParameters).map(([section, parameters]) => (
                            <React.Fragment key={section}>
                                <tr className="">
                                    <td colSpan={3} className="px-4 py-2 font-semibold">
                                        {section.charAt(0).toUpperCase() + section.slice(1)} Parameters
                                    </td>
                                </tr>
                                {renderParameterRows(parameters)}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Export - Default
export default RequestParametersTable;
