// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import {
    RestEndpointNodeInterface,
    responseFieldsToExampleJson,
} from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Markdown } from '@structure/source/common/markdown/Markdown';
import { Json } from '@structure/source/common/code/json/Json';
import { RequestParametersTable } from '@structure/source/modules/documentation/content/nodes/RequestParametersTable';
import { ResponseParametersTable } from '@structure/source/modules/documentation/content/nodes/ResponseParametersTable';
// import { InputCheckboxState } from '@structure/source/common/forms/InputCheckbox';
// import { ObjectTable } from '@structure/source/common/tables/ObjectTable';

// Dependencies - Assets
import PlayIcon from '@structure/assets/icons/media/PlayIcon.svg';

// Types
export interface RequestParameterStateInterface {
    enabled: boolean;
    value?: string;
}
export type RequestParameterStateMapType = Record<string, RequestParameterStateInterface>;

// Component - RestEndpointNodeContent
export interface RestEndpointNodeContentInterface {
    node: RestEndpointNodeInterface;
}
export function RestEndpointNodeContent(properties: RestEndpointNodeContentInterface) {
    const { endpoint } = properties.node;

    // State
    const [runningRequest, setRunningRequest] = React.useState<boolean>(false);
    const [requestParametersStateMap, setRequestParametersStateMap] = React.useState<RequestParameterStateMapType>({});
    const [testOutputResponseHttpCode, setTestOutputResponseHttpCode] = React.useState<string | null>(null);
    const [testOutputResponseHttpHeaders, setTestOutputResponseHttpHeaders] = React.useState<
        string | React.ReactNode | null
    >(null);
    const [testOutputResponseBody, setTestOutputResponseBody] = React.useState<string | React.ReactNode | null>(null);

    // Function to handle parameter changes
    function handleRequestParameterRowStateChange(
        requestParameterName: string,
        requestParameterState: RequestParameterStateInterface,
    ) {
        // console.log(requestParameterName, requestParameterState);

        // Set the state
        setRequestParametersStateMap(function (previousRequestParametersStateMap) {
            return {
                ...previousRequestParametersStateMap,
                [requestParameterName]: requestParameterState,
            };
        });
    }

    // Function to construct URL with parameters
    function getEndpointUrlWithParameters(): string {
        const queryParameters = new URLSearchParams();
        const pathParameters: Record<string, string> = {};

        Object.entries(requestParametersStateMap).forEach(function ([
            currentRequestParameterName,
            currentRequestParameterState,
        ]) {
            if(currentRequestParameterState.enabled) {
                queryParameters.append(currentRequestParameterName, currentRequestParameterState.value ?? '');
            }

            // const [section, paramName] = currentRequestParameterName.split('.');

            // switch(section) {
            //     case 'query':
            //         queryParameters.append(paramName, state.value);
            //         break;
            //     case 'path':
            //         pathParameters[paramName] = state.value;
            //         break;
            // }
        });

        // Replace path parameters in URL
        let finalUrl = endpoint.url;
        Object.entries(pathParameters).forEach(([key, value]) => {
            finalUrl = finalUrl.replace(`{${key}}`, value);
        });

        const urlWithPath = new URL(finalUrl);

        // Add query parameters
        if(queryParameters.toString()) {
            urlWithPath.search = queryParameters.toString();
        }

        return urlWithPath.toString();
    }

    // Function to test the endpoint
    const testEndpoint = async function () {
        setRunningRequest(true);

        const requestBody: Record<string, any> = {};
        // Object.entries(parameterStates).forEach(([key, state]) => {
        //     if(state.enabled && state.value && key.startsWith('body')) {
        //         requestBody[key.split('.')[1]] = state.value;
        //     }
        // });

        // Get 'apiKey' from local storage
        let apiKey = localStorage.getItem('apiKey');

        if(apiKey) {
            apiKey = apiKey.trim().replaceAll('"', '');
        }

        // Fetch the endpoint
        const response = await fetch(getEndpointUrlWithParameters(), {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Admin-Access-Token': apiKey || 'test',
                'X-Shopify-Idempotency-Key': 'test',
            },
            ...(Object.keys(requestBody).length > 0 && {
                body: JSON.stringify(requestBody),
            }),
        });
        console.log('response', response);

        setRunningRequest(false);

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
            console.log(data);

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
            <div className="mb-5 text-sm">
                <span className="method rounded bg-purple-500 px-2 py-1 font-mono text-light">{endpoint.method}</span>
                <code className="ml-2">{getEndpointUrlWithParameters()}</code>
            </div>

            {/* Documentation */}
            {endpoint.documentation && (
                <div className="overview mb-4">
                    <Markdown>{endpoint.documentation}</Markdown>
                </div>
            )}

            {/* Request Parameters */}
            {endpoint.requestParameters && (
                <div className="">
                    <hr className="mb-4 mt-6" />
                    <h3 className="mb-2 text-lg font-semibold">Request Parameters</h3>
                    <RequestParametersTable
                        requestParameters={endpoint.requestParameters}
                        onRequestParameterRowStateChange={handleRequestParameterRowStateChange}
                    />
                </div>
            )}

            {/* Test Endpoint */}
            <div className="mt-6">
                <div className="flex space-x-3">
                    <Button loading={runningRequest} icon={PlayIcon} iconPosition="left" onClick={testEndpoint}>
                        Run
                    </Button>

                    {/* Clear Button */}
                    {testOutputResponseBody && (
                        <Button
                            className="ml-4"
                            onClick={function () {
                                setTestOutputResponseHttpCode(null);
                                setTestOutputResponseHttpHeaders(null);
                                setTestOutputResponseBody(null);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
                {runningRequest && <p className="mt-4">Running request...</p>}
                {testOutputResponseBody && !runningRequest && (
                    <div className="mt-4 rounded-md border p-4 text-sm">
                        <div className="">
                            <span className="method rounded bg-green-500 px-2 py-1 font-mono text-light">
                                {testOutputResponseHttpCode}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2 text-sm">Response Headers</h4>
                            <pre className="rounded-md border p-4">{testOutputResponseHttpHeaders}</pre>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2 text-sm">Response Body</h4>
                            <pre className="rounded-md border p-4">{testOutputResponseBody}</pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Example Responses */}
            {endpoint.exampleResponses && (
                <div className="">
                    <hr className="my-12" />
                    <h3 className="mb-4 text-lg font-semibold">Example Responses</h3>
                    {endpoint.exampleResponses.map(function (exampleResponse) {
                        return (
                            <div key={exampleResponse.statusCode} className="response mb-4">
                                {/* Title */}
                                <div className="mb-2 flex items-center">
                                    <div className="method rounded bg-green-500 px-2 py-1 text-sm font-semibold text-light">
                                        {exampleResponse.statusCode}
                                    </div>
                                    <h4 className="ml-2 text-lg font-semibold">{exampleResponse.description}</h4>
                                </div>

                                {/* Body JSON */}
                                {exampleResponse.body && (
                                    <Json
                                        className="rounded-md border p-2 text-xs"
                                        data={responseFieldsToExampleJson(exampleResponse.body)}
                                    />
                                )}

                                {/* Body Table */}
                                {exampleResponse.body && (
                                    <ResponseParametersTable responseBody={exampleResponse.body} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Export - Default
export default RestEndpointNodeContent;
