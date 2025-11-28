// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import {
    RestEndpointNodeProperties,
    RequestParameterProperties,
} from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import {
    RequestParameterRow,
    RequestParameterSectionType,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/components/nodes/rest-endpoint/request-parameters/RequestParameterRow';

// Dependencies - Utilities
import { uppercaseFirstCharacter, titleCase } from '@structure/source/utilities/type/String';

// Component - RequestParametersTable
export interface RequestParametersTableProperties {
    requestParameters: RestEndpointNodeProperties['endpoint']['requestParameters'];
    onRequestParameterRowStateChange: (
        requestParameterSection: RequestParameterSectionType,
        requestParameterName: string,
        requestParameterState: RequestParameterStateInterface,
    ) => void;
}
export function RequestParametersTable(properties: RequestParametersTableProperties) {
    // Function to render parameter rows recursively
    function renderParameterRows(
        requestParametersSection: RequestParameterSectionType,
        requestParameters: RequestParameterProperties[],
    ) {
        return requestParameters.map(function (requestParameter) {
            // Render all parameters using RequestParameterRow, including Objects
            return (
                <RequestParameterRow
                    key={requestParameter.name}
                    {...requestParameter}
                    section={requestParametersSection}
                    enabled={requestParameter.required ? true : false}
                    onStateChange={properties.onRequestParameterRowStateChange}
                />
            );
        });
    }

    // Render the component
    return (
        <div className="max-w-[1024px] overflow-x-auto text-sm">
            <div className="overflow-hidden rounded-md border border--0">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Parameter</th>
                            <th className="px-4 py-3 text-left font-medium">Type</th>
                            <th className="px-4 py-3 text-left font-medium">Description</th>
                            <th className="px-4 py-3 text-left font-medium">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render the parameters grouped by parameter section (headers, query, path, body) */}
                        {properties.requestParameters &&
                            Object.entries(properties.requestParameters).map(function ([
                                requestParametersSection,
                                requestParameters,
                            ]) {
                                const requestParametersSectionAsType = uppercaseFirstCharacter(
                                    requestParametersSection,
                                ) as RequestParameterSectionType;

                                return (
                                    <React.Fragment key={requestParametersSection}>
                                        <tr className="">
                                            <td colSpan={4} className="px-4 py-2 font-medium">
                                                {titleCase(requestParametersSectionAsType)} Parameters
                                            </td>
                                        </tr>
                                        {renderParameterRows(requestParametersSectionAsType, requestParameters)}
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
