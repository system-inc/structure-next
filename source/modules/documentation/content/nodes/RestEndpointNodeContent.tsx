// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RestEndpointNodeInterface } from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Markdown } from '@structure/source/common/markdown/Markdown';
import { Json } from '@structure/source/common/code/json/Json';

// Component - RestEndpointNodeContent
export interface RestEndpointNodeContentInterface {
    node: RestEndpointNodeInterface;
}
export function RestEndpointNodeContent(properties: RestEndpointNodeContentInterface) {
    const { endpoint } = properties.node;

    // State
    const [testOutputResponseHttpCode, setTestOutputResponseHttpCode] = React.useState<string | null>(null);
    const [testOutputResponseHttpHeaders, setTestOutputResponseHttpHeaders] = React.useState<
        string | React.ReactNode | null
    >(null);
    const [testOutputResponseBody, setTestOutputResponseBody] = React.useState<string | React.ReactNode | null>(null);

    // Function to test the endpoint
    const testEndpoint = async () => {
        // Get 'apiKey' from local storage
        let apiKey = localStorage.getItem('apiKey');

        if(apiKey) {
            apiKey = apiKey.trim().replaceAll('"', '');
        }

        // Fetch the endpoint
        const response = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Admin-Access-Token': apiKey || 'test',
                'X-Shopify-Idempotency-Key': 'test',
            },
        });
        console.log('response', response);

        // Set status code
        setTestOutputResponseHttpCode(response.status.toString());

        // Convert headers to object and stringify
        const headers: { [key: string]: string } = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        // setTestOutputResponseHttpHeaders(JSON.stringify(headers, null, 4));
        setTestOutputResponseHttpHeaders(<Json data={headers} />);

        // Get response data
        let data;
        if(response.headers.get('Content-Type')?.includes('application/json')) {
            data = await response.json();

            // Set response body
            // setTestOutputResponseBody(JSON.stringify(data, null, 4));
            setTestOutputResponseBody(<Json data={data} />);
        }
        else {
            data = await response.text();

            // Set response body
            setTestOutputResponseBody(data);
        }
    };

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

            {/* Test Endpoint */}
            <div className="mb-8">
                <div>
                    <Button onClick={testEndpoint}>Test</Button>
                </div>
                {testOutputResponseBody && (
                    <div className="mt-4 rounded-md border p-4 text-sm">
                        <h3>Test Output</h3>
                        <div className="mt-4">
                            <h4 className="mb-2">Response Code</h4>
                            <pre className="rounded-md border p-4">{testOutputResponseHttpCode}</pre>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2">Response Headers</h4>
                            <pre className="rounded-md border p-4">{testOutputResponseHttpHeaders}</pre>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2">Response Body</h4>
                            <pre className="rounded-md border p-4">{testOutputResponseBody}</pre>
                        </div>
                    </div>
                )}
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
                    <h3 className="mb-2 font-semibold">Request Parameters</h3>
                    {/* Render request parameters based on their type */}
                    {/* You can create additional components or logic to display different parameter types */}
                </div>
            )}

            {endpoint.responses && (
                <div className="mb-4">
                    <h3 className="mb-4 font-semibold">Responses</h3>
                    {Object.entries(endpoint.responses).map(([status, response]) => (
                        <div key={status} className="response mb-4">
                            <h4 className="mb-2 text-lg font-semibold">
                                {status} - {response.description}
                            </h4>
                            {response.body && <Json className="rounded-md border p-2 text-xs" data={response.body} />}
                        </div>
                    ))}
                </div>
            )}

            {endpoint.exampleResponse !== undefined && (
                <div className="mb-4">
                    <h3 className="mb-4 text-xl font-semibold">Example Response</h3>
                    <Json className="rounded-md border p-2 text-xs" data={endpoint.exampleResponse} />
                </div>
            )}
        </div>
    );
}

// Export - Default
export default RestEndpointNodeContent;
