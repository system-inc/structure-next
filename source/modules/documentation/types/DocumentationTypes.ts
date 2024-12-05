// Dependencies - React
import React from 'react';

// Main Documentation Specification Interface
export interface DocumentationSpecificationInterface {
    identifier: string;
    title: string;
    baseUrlPath: string;
    nodes: DocumentationNodeInterface[];
    settings?: boolean;
}

// Base Interface for Documentation Nodes
export interface DocumentationNodeBaseInterface {
    identifier: string;
    title: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    isHeader?: boolean;
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
    title: string;
    description: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    documentation?: {
        overview?: string;
        parameters?: string;
        examples?: string;
    };
    requestParameters?: {
        headers?: Record<string, ApiFieldTypeInterface>;
        query?: Record<string, ApiFieldTypeInterface>;
        path?: Record<string, ApiFieldTypeInterface>;
        body?: Record<string, ApiFieldTypeInterface>;
    };
    responses?: Record<string, ApiResponseInterface>;
    exampleResponse?: unknown;
}

// GraphQL API Endpoint Interface
export interface GraphQLApiEndpointInterface {
    title: string;
    description: string;
    query: string; // GraphQL query or mutation string
    variables?: Record<string, ApiFieldTypeInterface>;
    responseFields?: Record<string, ApiFieldTypeInterface>;
    exampleResponse?: unknown;
}

// API Response Interface
export interface ApiResponseInterface {
    statusCode: number;
    description?: string;
    headers?: Record<string, ApiFieldTypeInterface>;
    body?: Record<string, ApiFieldTypeInterface>;
}

// API Field Type Interface
export interface ApiFieldTypeInterface {
    type: 'String' | 'Number' | 'Boolean' | 'Object' | 'Array' | 'Null';
    enum?: string[];
    description?: string;
    example?: unknown;
    nullable?: boolean;
    fields?: Record<string, ApiFieldTypeInterface>; // For nested objects
    items?: ApiFieldTypeInterface; // For arrays
    formField?: FormFieldInterface;
}

// Form Field Interface for Interactive Documentation
export interface FormFieldInterface {
    component: 'Text' | 'Select' | 'Number' | 'DateTime' | 'TextArea' | 'Checkbox' | 'Radio';
    label: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
    };
}
