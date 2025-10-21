// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import {
    RestEndpointNodeProperties,
    responseFieldsToExampleJson,
} from '@structure/source/modules/documentation/types/DocumentationTypes';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Markdown } from '@structure/source/components/markdown/Markdown';
import { Json } from '@structure/source/components/code/json/Json';
import { RequestParametersTable } from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/RequestParametersTable';
import { ResponseParameters } from '@structure/source/modules/documentation/content/nodes/rest-endpoint/response-parameters/ResponseParameters';
import {
    RequestParameterSectionType,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/content/nodes/rest-endpoint/request-parameters/RequestParameterRow';
// import { ObjectTable } from '@structure/source/components/tables/ObjectTable';

// Dependencies - API
import { networkService } from '@structure/source/services/network/NetworkService';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Assets
import PlayIcon from '@structure/assets/icons/media/PlayIcon.svg';

// Dependencies - Utilities
import {
    getMethodColorClass,
    getStatusCodeColorClass,
} from '@structure/source/modules/documentation/utilities/DocumentationUtilities';
import { uppercaseFirstCharacter } from '@structure/source/utilities/type/String';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - RestEndpointNodeContent
export interface RestEndpointNodeContentProperties {
    node: RestEndpointNodeProperties;
    documentationIdentifier: string;
}
export function RestEndpointNodeContent(properties: RestEndpointNodeContentProperties) {
    const { endpoint } = properties.node;

    // State
    const [runningRequest, setRunningRequest] = React.useState<boolean>(false);
    const [requestParametersStateMap, setRequestParametersStateMap] = React.useState<
        // requestParameterSection (e.g., UrlQuery) -> requestParameterName (e.g., orderId) -> requestParameterState
        Record<string, Record<string, RequestParameterStateInterface>>
    >({});
    const [testOutputResponseHttpStatusCode, setTestOutputResponseHttpStatusCode] = React.useState<number | null>(null);
    const [testOutputResponseHttpHeaders, setTestOutputResponseHttpHeaders] = React.useState<
        string | React.ReactNode | null
    >(null);
    const [testOutputResponseBody, setTestOutputResponseBody] = React.useState<string | React.ReactNode | null>(null);

    // Function to handle parameter changes
    function handleRequestParameterRowStateChange(
        requestParameterSection: RequestParameterSectionType,
        requestParameterName: string,
        requestParameterState: RequestParameterStateInterface,
    ) {
        console.log(requestParameterSection, requestParameterName, requestParameterState);
        console.log(requestParametersStateMap);

        // Set the state
        setRequestParametersStateMap(function (previousRequestParametersStateMap) {
            return {
                ...previousRequestParametersStateMap,
                [requestParameterSection]: {
                    ...previousRequestParametersStateMap[requestParameterSection],
                    [requestParameterName]: requestParameterState,
                },
            };
        });
    }

    // Function to get color class by index (cycles through the palette)
    function getColorByIndex(index: number): string {
        return [
            'text-cyan-500',
            'text-green-500',
            'text-purple-500',
            'text-teal-500',
            'text-yellow-500',
            'text-red-500',
        ][index % 6]!;
    }

    // Function to parse URL parameters
    function parseUrlParameters() {
        const urlPathParameters: Record<string, string> = {};
        const urlQueryParameters = new URLSearchParams();
        const urlQueryParameterColors: Record<string, string> = {};

        // Keep track of parameter index for color assignment
        let parameterIndex = 0;

        // Loop through the request parameters state map
        Object.entries(requestParametersStateMap).forEach(function ([requestParameterSection, requestParameters]) {
            // Cast the section for safety
            const requestParameterSectionTyped = requestParameterSection as RequestParameterSectionType;

            // Loop through the request parameters
            Object.entries(requestParameters).forEach(function ([requestParameterName, requestParameterState]) {
                // If the parameter is enabled
                if(requestParameterState.enabled) {
                    // URL query parameters
                    if(requestParameterSectionTyped === 'UrlQuery') {
                        urlQueryParameters.append(requestParameterName, requestParameterState.value ?? '');
                        urlQueryParameterColors[requestParameterName] = getColorByIndex(parameterIndex);
                        parameterIndex++;
                    }
                    // URL path parameters
                    else if(requestParameterSectionTyped === 'UrlPath') {
                        urlPathParameters[requestParameterName] = requestParameterState.value ?? '';
                    }
                }
            });
        });

        return { urlPathParameters, urlQueryParameters, urlQueryParameterColors };
    }

    // Function to get the endpoint URL as a string
    function getEndpointUrlString() {
        const { urlPathParameters, urlQueryParameters } = parseUrlParameters();

        // Replace URL path parameters in the endpoint URL string
        let urlString = endpoint.url;
        Object.entries(urlPathParameters).forEach(function ([urlPathParameterName, urlPathParameterValue]) {
            urlString = urlString.replace(`{${urlPathParameterName}}`, urlPathParameterValue);
        });

        // Create URL object
        const urlObject = new URL(urlString);

        // Get the original query parameters
        const originalAndCustomUrlQueryParameters = new URLSearchParams(urlObject.search);

        // Merge the original parameters with the custom parameters, custom take precedence if same key exists
        urlQueryParameters.forEach(function (urlQueryParameterValue, urlQueryParameterKey) {
            originalAndCustomUrlQueryParameters.set(urlQueryParameterKey, urlQueryParameterValue);
        });
        urlObject.search = originalAndCustomUrlQueryParameters.toString();

        return decodeURIComponent(urlObject.toString());
    }

    // Function to get the endpoint URL as a JSX element
    function getEndpointUrlElement() {
        const { urlPathParameters, urlQueryParameters, urlQueryParameterColors } = parseUrlParameters();

        // Mark all of the URL path parameters
        let urlString = endpoint.url;
        Object.entries(urlPathParameters).forEach(function ([urlPathParameterName, urlPathParameterValue]) {
            urlString = urlString.replace(
                `{${urlPathParameterName}}`,
                `<PATH_PARAMETER>${urlPathParameterValue}</PATH_PARAMETER>`,
            );
        });

        // Create URL object
        const urlObject = new URL(urlString);

        // Remember the original query parameters
        const originalUrlQueryParameters = new URLSearchParams(urlObject.search);

        // Create an object to store the original and custom query parameters
        const originalAndCustomUrlQueryParameters = new URLSearchParams(urlObject.search);

        // Merge the original parameters with the custom parameters, custom take precedence if same key exists
        urlQueryParameters.forEach(function (urlQueryParameterValue, urlQueryParameterKey) {
            originalAndCustomUrlQueryParameters.set(urlQueryParameterKey, urlQueryParameterValue);
        });
        urlObject.search = originalAndCustomUrlQueryParameters.toString();

        // Decode the URL and get the base path and query string
        const decodedUrl = decodeURIComponent(urlObject.toString());
        const splitDecodedUrl = decodedUrl.split('?');
        const baseUrlPath = splitDecodedUrl[0] ? splitDecodedUrl[0] : '';
        const urlQueryString = splitDecodedUrl[1] ? splitDecodedUrl[1] : '';

        // Render the component
        return (
            <>
                {/* Handle URL path parameters */}
                {baseUrlPath
                    .split(/<PATH_PARAMETER>|<\/PATH_PARAMETER>/)
                    .map(function (baseUrlPathPart, baseUrlPathPartIndex) {
                        // Even indices are normal text, odd indices are path parameters
                        return baseUrlPathPartIndex % 2 === 0 ? (
                            <span key={baseUrlPathPartIndex}>{baseUrlPathPart}</span>
                        ) : (
                            <span key={baseUrlPathPartIndex} className="font-medium text-purple-500">
                                {baseUrlPathPart}
                            </span>
                        );
                    })}
                {/* Handle URL query parameters */}
                {urlQueryString && '?'}
                {urlQueryString &&
                    // Split the query string by '&' and render each query parameter
                    urlQueryString.split('&').map(function (urlQueryParameter, urlQueryParameterIndex) {
                        // Split the query parameter by '='
                        const splitUrlQueryParameter = urlQueryParameter.split('=');

                        // Parse the key and value
                        const urlQueryParameterKey = splitUrlQueryParameter[0] ?? '';
                        const urlQueryParameterValue = splitUrlQueryParameter[1] ?? '';

                        // Check if the query parameter is custom
                        const isOriginalUrlQueryParameter = originalUrlQueryParameters.has(urlQueryParameterKey);

                        // Render the query parameter
                        return (
                            <React.Fragment key={urlQueryParameterIndex}>
                                {urlQueryParameterIndex > 0 && '&'}
                                {!isOriginalUrlQueryParameter ? (
                                    <span className={urlQueryParameterColors[urlQueryParameterKey]}>
                                        <span className="italic">{urlQueryParameterKey}</span>={''}
                                        <span className="font-medium">{urlQueryParameterValue}</span>
                                    </span>
                                ) : (
                                    <span>{`${urlQueryParameterKey}=${urlQueryParameterValue}`}</span>
                                )}
                            </React.Fragment>
                        );
                    })}
            </>
        );
    }

    // Function to get body object from state map
    function getRequestBodyObjectFromRequestParametersStateMap() {
        function createNestedArrayStructure(
            parentObject: Record<string, unknown>,
            path: string[],
            value: unknown,
        ): void {
            let current = parentObject;

            path.forEach(function (part, index) {
                // Check if this part contains array notation
                const arrayMatch = part.match(/(.+?)\[(\d+)\]/);
                if(arrayMatch) {
                    const [, arrayName, indexStr] = arrayMatch;
                    if(arrayName !== undefined && indexStr !== undefined) {
                        const arrayIndex = parseInt(indexStr, 10);

                        // Initialize array if it doesn't exist
                        if(!Array.isArray(current[arrayName])) {
                            current[arrayName] = [];
                        }

                        // Ensure array has enough elements
                        while((current[arrayName] as unknown[]).length <= arrayIndex) {
                            (current[arrayName] as unknown[]).push({});
                        }

                        // Move to the array item with proper type assertions
                        const array = current[arrayName] as Record<string, unknown>[];
                        current = array[arrayIndex] as Record<string, unknown>;
                    }
                }
                else if(index === path.length - 1) {
                    // Last part - set the value
                    current[part] = value;
                }
                else {
                    // Create nested object if needed
                    current[part] = current[part] || {};
                    current = current[part] as Record<string, unknown>;
                }
            });
        }

        const requestBody: Record<string, unknown> = {};

        if(requestParametersStateMap?.Body) {
            // Sort keys to ensure parent paths are processed before children
            const sortedKeys = Object.keys(requestParametersStateMap.Body).sort();

            sortedKeys.forEach(function (key) {
                if(!requestParametersStateMap?.Body) {
                    return;
                }

                const state = requestParametersStateMap.Body[key];
                if(state?.enabled && state.value !== undefined) {
                    // Split the path and process array notation
                    const pathParts = key.split('.');
                    createNestedArrayStructure(requestBody, pathParts, state.value);
                }
            });
        }

        return requestBody;
    }

    // Function to test the endpoint
    const testEndpoint = async function () {
        setRunningRequest(true);

        // Get 'apiKey' from local storage with unique identifier
        let apiKey = localStorageService.get<string>(
            uppercaseFirstCharacter(properties.documentationIdentifier) + 'DocumentationApiKey',
        );
        if(apiKey) {
            apiKey = apiKey.trim().replaceAll('"', '');
        }

        // Get the request body object
        const requestBodyObject = getRequestBodyObjectFromRequestParametersStateMap();

        // Fetch the endpoint
        const response = await networkService.request(getEndpointUrlString(), {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Admin-Access-Token': apiKey || 'test',
                'X-Shopify-Idempotency-Key': 'test',
            },
            ...(Object.keys(requestBodyObject).length > 0 && {
                body: JSON.stringify(requestBodyObject),
            }),
        });
        console.log('response', response);

        setRunningRequest(false);

        // Set status code
        setTestOutputResponseHttpStatusCode(response.status);

        // Convert headers to object and stringify
        const headers: { [key: string]: string } = {};
        response.headers.forEach(function (value, key) {
            headers[key] = value;
        });
        setTestOutputResponseHttpHeaders(<Json data={headers} />);

        // Get response data
        let data;
        if(response.headers.get('Content-Type')?.includes('application/json')) {
            data = await response.json();
            console.log(data);

            // Set response body
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
            <h2 className="mb-4 text-2xl font-medium">{properties.node.title}</h2>
            <p className="mb-4">{properties.node.description}</p>
            <div className="mb-4 flex items-center">
                {/* HTTP Method */}
                <span
                    className={mergeClassNames(
                        'method text-light rounded-md border px-1 py-0.5 font-mono text-xs',
                        getMethodColorClass(endpoint.method),
                    )}
                >
                    {endpoint.method}
                </span>
                {/* Endpoing URL */}
                <code className="ml-1.5 text-sm">{endpoint.url}</code>
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
                    <hr className="mt-6 mb-4 border--a" />
                    <h3 className="mb-2 text-lg font-medium">Request Parameters</h3>
                    <RequestParametersTable
                        requestParameters={endpoint.requestParameters}
                        onRequestParameterRowStateChange={handleRequestParameterRowStateChange}
                    />
                </div>
            )}

            <hr className="mt-6 mb-6 border--a" />

            {/* Request Url with Parameters */}
            <div className="mb-4 flex items-center">
                {/* HTTP Method */}
                <span
                    className={mergeClassNames(
                        'method text-light rounded-md border px-1 py-0.5 font-mono text-xs',
                        getMethodColorClass(endpoint.method),
                    )}
                >
                    {endpoint.method}
                </span>
                {/* Endpoing URL */}
                <code className="ml-1.5 text-sm">{getEndpointUrlElement()}</code>
            </div>

            {/* Request Body Parameters */}
            {requestParametersStateMap?.Body && (
                <div className="">
                    <h4 className="mb-2 text-sm font-medium">Request Body</h4>
                    <pre className="text-xs text-purple-500">
                        {JSON.stringify(getRequestBodyObjectFromRequestParametersStateMap(), null, 4)}
                    </pre>
                </div>
            )}

            {/* Test Endpoint */}
            <div className="mt-6">
                <div className="flex space-x-3">
                    <Button isLoading={runningRequest} iconLeft={<PlayIcon />} onClick={testEndpoint}>
                        Run
                    </Button>

                    {/* Clear Button */}
                    {testOutputResponseBody && (
                        <Button
                            className="ml-4"
                            onClick={function () {
                                setTestOutputResponseHttpStatusCode(null);
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
                    <div className="mt-4 rounded-md border border--a p-4 text-sm">
                        <div className="">
                            <span
                                className={mergeClassNames(
                                    'method text-light rounded-md border px-1 py-0.5 font-mono text-xs',
                                    getStatusCodeColorClass(testOutputResponseHttpStatusCode),
                                )}
                            >
                                {testOutputResponseHttpStatusCode}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2 text-sm">Response Headers</h4>
                            <pre className="rounded-md border border--a p-4">{testOutputResponseHttpHeaders}</pre>
                        </div>
                        <div className="mt-4">
                            <h4 className="mb-2 text-sm">Response Body</h4>
                            <pre className="rounded-md border border--a p-4">{testOutputResponseBody}</pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Example Responses */}
            {endpoint.exampleResponses && (
                <div className="">
                    <hr className="my-12 border--a" />
                    <h3 className="mb-4 text-lg font-medium">Example Responses</h3>
                    {endpoint.exampleResponses.map(function (exampleResponse) {
                        return (
                            <div key={exampleResponse.statusCode} className="response mb-4">
                                {/* Title */}
                                <div className="mb-2 flex items-center">
                                    <span
                                        className={mergeClassNames(
                                            'text-light rounded-md border px-1 py-0.5 font-mono text-xs',
                                            getStatusCodeColorClass(exampleResponse.statusCode),
                                        )}
                                    >
                                        {exampleResponse.statusCode}
                                    </span>

                                    <h4 className="ml-1.5 text-lg font-medium">{exampleResponse.title}</h4>
                                </div>

                                {/* Body JSON */}
                                {exampleResponse.body && (
                                    <Json
                                        className="rounded-md border border--a p-2 text-xs"
                                        data={responseFieldsToExampleJson(exampleResponse.body)}
                                    />
                                )}

                                {/* Body Table */}
                                {exampleResponse.body && (
                                    <ResponseParameters className="mt-4" responseBody={exampleResponse.body} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
