// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { ResponseFieldInterface } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Component - ResponseParametersTable
export interface ResponseParametersTableInterface {
    responseBody: ResponseFieldInterface[];
}

export function ResponseParametersTable(properties: ResponseParametersTableInterface) {
    // Function to render parameter rows recursively
    function renderParameterRows(
        parameters: Record<string, ResponseFieldInterface> | ResponseFieldInterface[],
        parentKey = '',
        level = 0,
    ): React.ReactNode {
        return Object.entries(parameters).map(([key, value]) => {
            if(typeof value !== 'object') return null;

            const rows: React.ReactNode[] = [];
            const parameterKey = parentKey ? `${parentKey}.${key}` : key;
            const isArray = value.type === 'Array';

            rows.push(
                <tr key={parameterKey} className="border">
                    <td className="px-4 py-3">
                        <span className="font-mono" style={{ marginLeft: `${level * 16}px` }}>
                            {key}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        <span className="inline-block rounded px-2 py-1">
                            {value.type}
                            {value.possibleValues && (
                                <span className="text-gray-500"> ({value.possibleValues.join(' | ')})</span>
                            )}
                        </span>
                    </td>
                    <td className="px-4 py-3">{value.description}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                        {value.example !== undefined && JSON.stringify(value.example)}
                    </td>
                </tr>,
            );

            // Recursively render nested fields
            if(isArray && value.fields && value.fields.length) {
                rows.push(
                    ...(renderParameterRows(
                        value.fields as ResponseFieldInterface[],
                        `${parameterKey}[]`,
                        level + 1,
                    ) as React.ReactNode[]),
                );
            }
            else if(value.fields) {
                rows.push(
                    ...(renderParameterRows(
                        value.fields as Record<string, ResponseFieldInterface>,
                        parameterKey,
                        level + 1,
                    ) as React.ReactNode[]),
                );
            }

            return rows;
        });
    }

    // Render the component
    return (
        <div className="max-w-[1024px] overflow-x-auto text-sm">
            <div className="overflow-hidden rounded-md border">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Field</th>
                            <th className="px-4 py-3 text-left font-medium">Type</th>
                            <th className="px-4 py-3 text-left font-medium">Description</th>
                            <th className="px-4 py-3 text-left font-medium">Example</th>
                        </tr>
                    </thead>
                    <tbody>{renderParameterRows(properties.responseBody)}</tbody>
                </table>
            </div>
        </div>
    );
}

export default ResponseParametersTable;
