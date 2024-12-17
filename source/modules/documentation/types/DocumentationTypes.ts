// Dependencies - React
import React from 'react';

// Main Documentation Specification Interface
export interface DocumentationSpecificationInterface {
    identifier: string;
    title: string;
    baseUrlPath: string;
    nodes: DocumentationNodeInterface[];
    settingsDialogEnabled?: boolean;
}

// Base Interface for Documentation Nodes
export interface DocumentationNodeBaseInterface {
    identifier: string;
    title: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    isHeader?: boolean;
    description?: string;
}

// Discriminated Union Type for Different Node Types
export type DocumentationNodeInterface =
    | SectionNodeInterface
    | RestEndpointNodeInterface
    | GraphQlEndpointNodeInterface
    | MarkdownPageNodeInterface
    | ReactComponentNodeInterface;

// Type - DocumentationNodeWithParent
export type DocumentationNodeWithParentInterface =
    | (SectionNodeInterface & { parent: DocumentationNodeWithParentInterface | null })
    | (RestEndpointNodeInterface & { parent: DocumentationNodeWithParentInterface | null })
    | (GraphQlEndpointNodeInterface & { parent: DocumentationNodeWithParentInterface | null })
    | (MarkdownPageNodeInterface & { parent: DocumentationNodeWithParentInterface | null })
    | (ReactComponentNodeInterface & { parent: DocumentationNodeWithParentInterface | null });

// Section Node Interface
export interface SectionNodeInterface extends DocumentationNodeBaseInterface {
    type: 'Section';
    children: DocumentationNodeInterface[];
}

// REST Endpoint Node Interface
export interface RestEndpointNodeInterface extends DocumentationNodeBaseInterface {
    type: 'RestEndpoint';
    endpoint: RestApiEndpointInterface;
}

// GraphQL Endpoint Node Interface
export interface GraphQlEndpointNodeInterface extends DocumentationNodeBaseInterface {
    type: 'GraphQlEndpoint';
    endpoint: GraphQLApiEndpointInterface;
}

// Markdown Page Node Interface
export interface MarkdownPageNodeInterface extends DocumentationNodeBaseInterface {
    type: 'MarkdownPage';
    content: string; // Markdown content as string
}

// React Component Node Interface
export interface ReactComponentNodeInterface extends DocumentationNodeBaseInterface {
    type: 'ReactComponent';
    component: React.ReactNode;
}

// REST API Endpoint Interface
export interface RestApiEndpointInterface {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    documentation?: string;
    requestParameters?: {
        headers?: RequestParameterInterface[];
        urlPath?: RequestParameterInterface[];
        urlQuery?: RequestParameterInterface[];
        body?: RequestParameterInterface[];
    };
    exampleResponses?: {
        title?: string;
        description?: string;
        statusCode: number;
        headers?: ResponseFieldInterface[];
        body?: ResponseFieldInterface[];
    }[];
}

// GraphQL API Endpoint Interface
export interface GraphQLApiEndpointInterface {
    query: string; // GraphQL query or mutation string
    variables?: RequestParameterInterface[];
    responseFields?: ResponseFieldInterface[];
    exampleResponses?: {
        statusCode: number;
        description?: string;
        headers?: ResponseFieldInterface[];
        body?: ResponseFieldInterface[];
    }[];
}

// ApiResponse Interface
export interface ApiResponseInterface {
    statusCode: number;
    description?: string;
    headers?: ResponseFieldInterface[];
    body?: ResponseFieldInterface[];
}

// Response fields
export interface ResponseFieldInterface {
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'DateTime' | 'Object' | 'Array';
    description?: string;
    possibleValues?: string[] | number[];
    example?: unknown;
    nullable?: boolean;
    fields?: Record<string, ResponseFieldInterface> | ResponseFieldInterface[];
}

// Request parameters
export interface RequestParameterInterface {
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'DateTime' | 'Object' | 'Array';
    description?: string;
    possibleValues?: string[] | number[];
    example?: unknown;
    required?: boolean;
    nullable?: boolean;
    fields?: Record<string, RequestParameterInterface> | RequestParameterInterface[];
}

// Function to convert a ResponseFieldInterface[] to an example JSON object
export function responseFieldsToExampleJson(responseFields: ResponseFieldInterface[]): Record<string, unknown> {
    const exampleJson: Record<string, unknown> = {};

    responseFields.forEach(function (field) {
        if(field.fields) {
            exampleJson[field.name] =
                field.type === 'Array'
                    ? [responseFieldsToExampleJson(field.fields as ResponseFieldInterface[])]
                    : responseFieldsToExampleJson(field.fields as ResponseFieldInterface[]);
        }
        else {
            exampleJson[field.name] = field.example;
        }
    });

    return exampleJson;
}
