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
import {
    RequestParameterSectionType,
    RequestParameterStateInterface,
} from '@structure/source/modules/documentation/content/nodes/RequestParameterRow';
// import { InputCheckboxState } from '@structure/source/common/forms/InputCheckbox';
// import { ObjectTable } from '@structure/source/common/tables/ObjectTable';

// Dependencies - Assets
import PlayIcon from '@structure/assets/icons/media/PlayIcon.svg';

// Component - RestEndpointNodeContent
export interface RestEndpointNodeContentInterface {
    node: RestEndpointNodeInterface;
}
export function RestEndpointNodeContent(properties: RestEndpointNodeContentInterface) {
    const { endpoint } = properties.node;

    // State
    const [runningRequest, setRunningRequest] = React.useState<boolean>(false);
    const [requestParametersStateMap, setRequestParametersStateMap] = React.useState<
        // requestParameterSection (e.g., UrlQuery) -> requestParameterName (e.g., orderId) -> requestParameterState
        Record<string, Record<string, RequestParameterStateInterface>>
    >({});
    const [testOutputResponseHttpCode, setTestOutputResponseHttpCode] = React.useState<string | null>(null);
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
        // console.log(requestParameterSection, requestParameterName, requestParameterState);

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
            'text-red-500',
            'text-yellow-500',
            'text-green-500',
            'text-cyan-500',
            'text-blue-500',
            'text-purple-500',
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
                            <span key={baseUrlPathPartIndex} className="font-bold text-purple-500">
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
                                        <span className="font-bold">{urlQueryParameterValue}</span>
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

    // Function to test the endpoint
    const testEndpoint = async function () {
        setRunningRequest(true);

        const requestBody: Record<string, unknown> = {};

        Object.entries(requestParametersStateMap).forEach(([section, parameters]) => {
            Object.entries(parameters).forEach(([name, state]) => {
                if(state.enabled && state.value) {
                    if(section === 'body') {
                        requestBody[name] = state.value;
                    }
                }
            });
        });

        // Get 'apiKey' from local storage
        let apiKey = localStorage.getItem('apiKey');

        if(apiKey) {
            apiKey = apiKey.trim().replaceAll('"', '');
        }

        // Fetch the endpoint
        const response = await fetch(getEndpointUrlString(), {
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
            <h2 className="mb-4 text-2xl font-bold">{endpoint.title}</h2>
            <p className="mb-4">{endpoint.description}</p>
            <div className="mb-5 text-sm">
                <span className="method rounded bg-purple-500 px-2 py-1 font-mono text-light">{endpoint.method}</span>
                {/* <div>
                    <code className="ml-2">{getEndpointUrlString()}</code>
                </div> */}
                <code className="ml-2">{getEndpointUrlElement()}</code>
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
