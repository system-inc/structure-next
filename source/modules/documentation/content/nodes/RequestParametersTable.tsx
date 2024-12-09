// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import {
    RestEndpointNodeInterface,
    RequestParameterInterface,
} from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import {
    RequestParameterRow,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/content/nodes/RequestParameterRow';

// Dependencies - Utilities
import { uppercaseFirstCharacter } from '@structure/source/utilities/String';

// Component - RequestParametersTable
export interface RequestParametersTableInterface {
    requestParameters: RestEndpointNodeInterface['endpoint']['requestParameters'];
    onRequestParameterRowStateChange: (
        requestParameterName: string,
        requestParameterState: RequestParameterStateInterface,
    ) => void;
}
export function RequestParametersTable(properties: RequestParametersTableInterface) {
    // Function to render parameter rows recursively
    function renderParameterRows(requestParameters: RequestParameterInterface[]) {
        return requestParameters.map(function (requestParameter) {
            return (
                <RequestParameterRow
                    key={requestParameter.name}
                    name={requestParameter.name}
                    type={requestParameter.type}
                    description={requestParameter.description}
                    example={requestParameter.example}
                    nullable={requestParameter.nullable}
                    possibleValues={requestParameter.possibleValues}
                    required={requestParameter.required}
                    enabled={requestParameter.required ? true : false}
                    onStateChange={properties.onRequestParameterRowStateChange}
                />
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
                            <th className="px-4 py-3 text-left font-semibold">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render the parameters grouped by parameter section (headers, query, path, body) */}
                        {properties.requestParameters &&
                            Object.entries(properties.requestParameters).map(function ([
                                parametersSection,
                                parameters,
                            ]) {
                                return (
                                    <React.Fragment key={parametersSection}>
                                        <tr className="">
                                            <td colSpan={4} className="px-4 py-2 font-semibold">
                                                {uppercaseFirstCharacter(parametersSection)} Parameters
                                            </td>
                                        </tr>
                                        {renderParameterRows(parameters)}
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RequestParametersTable;
