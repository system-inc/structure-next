// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Types
import { ResponseFieldProperties } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Function to generate a table ID from field path
function getTableId(path: string): string {
    return `response-table-${path.replace(/\./g, '-')}`;
}

// Component - ResponseParameters
export interface ResponseParametersProperties {
    responseBody: ResponseFieldProperties[];
    className?: string;
}
export function ResponseParameters(properties: ResponseParametersProperties) {
    // State to track complex fields that need their own tables
    const [complexTables, setComplexTables] = React.useState<Map<string, ResponseFieldProperties[]>>(new Map());

    // Effect to collect complex fields on mount
    React.useEffect(
        function () {
            const tables = new Map<string, ResponseFieldProperties[]>();

            function processFields(fields: ResponseFieldProperties[], parentPath = '') {
                fields.forEach(function (field) {
                    if(typeof field !== 'object') return;

                    const currentPath = parentPath ? `${parentPath}.${field.name}` : field.name;

                    // If field is an array or object with fields, add to complex tables
                    if((field.type === 'Array' || field.type === 'Object') && field.fields) {
                        if(Array.isArray(field.fields)) {
                            tables.set(currentPath, field.fields);
                            // Recursively process nested fields
                            processFields(field.fields, currentPath);
                        }
                        else {
                            // Handle object fields
                            const objectFields = Object.values(field.fields);
                            tables.set(currentPath, objectFields);
                            processFields(objectFields, currentPath);
                        }
                    }
                });
            }

            processFields(properties.responseBody);
            setComplexTables(tables);
        },
        [properties.responseBody],
    );

    // Function to render a single parameter row
    function renderParameterRow(field: ResponseFieldProperties, parentPath = '', level = 0): React.ReactNode {
        if(typeof field !== 'object') return null;

        const currentPath = parentPath ? `${parentPath}.${field.name}` : field.name;
        const hasNestedTable = complexTables.has(currentPath);

        return (
            <tr key={currentPath} className="border border-opsis-border-primary">
                <td className="px-4 py-3">
                    <span className="font-mono" style={{ marginLeft: `${level * 16}px` }}>
                        {hasNestedTable ? (
                            <Link href={`#${getTableId(currentPath)}`} className="text-blue">
                                {field.name}
                            </Link>
                        ) : (
                            field.name
                        )}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="inline-block rounded px-2 py-1">{field.type}</span>
                </td>
                <td className="px-4 py-3">
                    <div>{field.description}</div>
                    {field.possibleValues && (
                        <div>
                            <span className="text-gray-500"> ({field.possibleValues.join(' | ')})</span>
                        </div>
                    )}
                </td>
                <td className="px-4 py-3 font-mono text-gray-500">
                    {field.example !== undefined && JSON.stringify(field.example)}
                </td>
            </tr>
        );
    }

    // Function to render a table
    function renderTable(fields: ResponseFieldProperties[], tablePath = ''): React.ReactNode {
        return (
            <div className="overflow-hidden rounded-medium border border-opsis-border-primary">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Field</th>
                            <th className="px-4 py-3 text-left font-medium">Type</th>
                            <th className="px-4 py-3 text-left font-medium">Description</th>
                            <th className="px-4 py-3 text-left font-medium">Example</th>
                        </tr>
                    </thead>
                    <tbody>{fields.map((field) => renderParameterRow(field, tablePath))}</tbody>
                </table>
            </div>
        );
    }

    // Render the component
    return (
        <div className={mergeClassNames('max-w-[1024px] overflow-x-auto text-sm', properties.className)}>
            <h4 className="mb-2 text-lg font-medium">Response Schema</h4>

            {/* Main Table */}
            {renderTable(properties.responseBody)}

            {/* Nested Tables */}
            {complexTables.size > 0 && (
                <div className="mt-8">
                    {Array.from(complexTables.entries()).map(([path, fields]) => (
                        <div key={path} className="mb-6">
                            <h4 id={getTableId(path)} className="mb-2 text-lg font-medium">
                                {path}
                            </h4>
                            {renderTable(fields, path)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
