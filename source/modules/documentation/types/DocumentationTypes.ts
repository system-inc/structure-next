// Dependencies - React
import React from 'react';

// Main Documentation Specification Interface
export interface DocumentationSpecificationProperties {
    identifier: string;
    title: string;
    baseUrlPath: string;
    nodes: DocumentationNodeProperties[];
    settingsDialogEnabled?: boolean;
}

// Base Interface for Documentation Nodes
export interface DocumentationNodeBaseProperties {
    identifier: string;
    title: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    isHeader?: boolean;
    description?: string;
}

// Discriminated Union Type for Different Node Types
export type DocumentationNodeProperties =
    | SectionNodeProperties
    | RestEndpointNodeProperties
    | GraphQlEndpointNodeProperties
    | MarkdownPageNodeProperties
    | ReactComponentNodeProperties;

// Type - DocumentationNodeWithParent
export type DocumentationNodeWithParentProperties =
    | (SectionNodeProperties & { parent: DocumentationNodeWithParentProperties | null })
    | (RestEndpointNodeProperties & { parent: DocumentationNodeWithParentProperties | null })
    | (GraphQlEndpointNodeProperties & { parent: DocumentationNodeWithParentProperties | null })
    | (MarkdownPageNodeProperties & { parent: DocumentationNodeWithParentProperties | null })
    | (ReactComponentNodeProperties & { parent: DocumentationNodeWithParentProperties | null });

// Section Node Interface
export interface SectionNodeProperties extends DocumentationNodeBaseProperties {
    type: 'Section';
    children: DocumentationNodeProperties[];
}

// REST Endpoint Node Interface
export interface RestEndpointNodeProperties extends DocumentationNodeBaseProperties {
    type: 'RestEndpoint';
    endpoint: RestApiEndpointProperties;
}

// GraphQL Endpoint Node Interface
export interface GraphQlEndpointNodeProperties extends DocumentationNodeBaseProperties {
    type: 'GraphQlEndpoint';
    endpoint: GraphQLApiEndpointProperties;
}

// Markdown Page Node Interface
export interface MarkdownPageNodeProperties extends DocumentationNodeBaseProperties {
    type: 'MarkdownPage';
    content: string; // Markdown content as string
}

// React Component Node Interface
export interface ReactComponentNodeProperties extends DocumentationNodeBaseProperties {
    type: 'ReactComponent';
    component: React.ReactNode;
}

// REST API Endpoint Interface
export interface RestApiEndpointProperties {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    documentation?: string;
    requestParameters?: {
        headers?: RequestParameterProperties[];
        urlPath?: RequestParameterProperties[];
        urlQuery?: RequestParameterProperties[];
        body?: RequestParameterProperties[];
    };
    exampleResponses?: {
        title?: string;
        description?: string;
        statusCode: number;
        headers?: ResponseFieldProperties[];
        body?: ResponseFieldProperties[];
    }[];
}

// GraphQL API Endpoint Interface
export interface GraphQLApiEndpointProperties {
    query: string; // GraphQL query or mutation string
    variables?: RequestParameterProperties[];
    responseFields?: ResponseFieldProperties[];
    exampleResponses?: {
        statusCode: number;
        description?: string;
        headers?: ResponseFieldProperties[];
        body?: ResponseFieldProperties[];
    }[];
}

// ApiResponse Interface
export interface ApiResponseProperties {
    statusCode: number;
    description?: string;
    headers?: ResponseFieldProperties[];
    body?: ResponseFieldProperties[];
}

// Response fields
export interface ResponseFieldProperties {
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'DateTime' | 'Object' | 'Array';
    description?: string;
    possibleValues?: string[] | number[];
    example?: unknown;
    nullable?: boolean;
    fields?: Record<string, ResponseFieldProperties> | ResponseFieldProperties[];
}

// Request parameters
export interface RequestParameterProperties {
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'DateTime' | 'Object' | 'Array';
    description?: string;
    possibleValues?: string[] | number[];
    example?: unknown;
    required?: boolean;
    nullable?: boolean;
    fields?: Record<string, RequestParameterProperties> | RequestParameterProperties[];
}

// Function to convert a ResponseFieldInterface[] to an example JSON object
export function responseFieldsToExampleJson(responseFields: ResponseFieldProperties[]): Record<string, unknown> {
    const exampleJson: Record<string, unknown> = {};

    responseFields.forEach(function (field) {
        if(field.fields) {
            exampleJson[field.name] =
                field.type === 'Array'
                    ? [responseFieldsToExampleJson(field.fields as ResponseFieldProperties[])]
                    : responseFieldsToExampleJson(field.fields as ResponseFieldProperties[]);
        }
        else {
            exampleJson[field.name] = field.example;
        }
    });

    return exampleJson;
}
