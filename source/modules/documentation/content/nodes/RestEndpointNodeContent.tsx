// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RestEndpointNodeInterface } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { Markdown } from '@structure/source/common/markdown/Markdown';

// Component - RestEndpointNodeContent
export interface RestEndpointNodeContentInterface {
    node: RestEndpointNodeInterface;
}
export function RestEndpointNodeContent(properties: RestEndpointNodeContentInterface) {
    const { endpoint } = properties.node;

    // Render the component
    return (
        <div className="">
            <h2 className="mb-4 text-2xl font-bold">{endpoint.title}</h2>
            <p className="mb-4">{endpoint.description}</p>
            <div className="mb-8 text-sm">
                <span className="method rounded bg-purple-500 px-2 py-1 font-semibold text-light">
                    {endpoint.method}
                </span>
                <code className="ml-2">{endpoint.url}</code>
            </div>

            {endpoint.documentation?.overview && (
                <div className="overview mb-4">
                    <Markdown>{endpoint.documentation.overview}</Markdown>
                </div>
            )}

            {endpoint.documentation?.parameters && (
                <div className="parameters mb-4">
                    <Markdown>{endpoint.documentation.parameters}</Markdown>
                </div>
            )}

            {endpoint.requestParameters && (
                <div className="mb-4">
                    <h3 className="mb-2 text-xl font-semibold">Request Parameters</h3>
                    {/* Render request parameters based on their type */}
                    {/* You can create additional components or logic to display different parameter types */}
                </div>
            )}

            {endpoint.responses && (
                <div className="mb-4">
                    <h3 className="mb-4 text-xl font-semibold">Responses</h3>
                    {Object.entries(endpoint.responses).map(([status, response]) => (
                        <div key={status} className="response mb-4">
                            <h4 className="mb-2 text-lg font-semibold">
                                {status} - {response.description}
                            </h4>
                            {response.body && (
                                <pre className="rounded-md border p-2 text-sm">
                                    <code>{JSON.stringify(response.body, null, 4)}</code>
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {endpoint.exampleResponse !== undefined && (
                <div className="mb-4">
                    <h3 className="mb-4 text-xl font-semibold">Example Response</h3>
                    <pre className="rounded-md border p-2 text-sm">
                        <code>{JSON.stringify(endpoint.exampleResponse, null, 4)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}

// Export - Default
export default RestEndpointNodeContent;
