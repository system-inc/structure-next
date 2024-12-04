// Dependencies - React
import React from 'react';

// Dependencies - Types
import { SideNavigationCategoryInterface } from '@structure/source/common/navigation/side-navigation/SideNavigationCategory';

// Type - DocumentationSpecificationCategory
export interface DocumentationSpecificationCategoryInterface extends SideNavigationCategoryInterface {
    content?: React.ReactNode;
    children?: DocumentationSpecificationCategoryInterface[];
}

// Type - DocumentationSpecification
export interface DocumentationSpecificationInterface {
    identifier: string;
    title: string;
    categories: DocumentationSpecificationCategoryInterface[];
}

// ----------
// ----------
// ----------
// ----------

// Types - API Documentation
export interface ApiEndpointTracking {
    company: string;
    number: string;
    url: string;
}

export interface ApiEndpointParameter {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description?: string;
    enum?: string[];
    example?: unknown;
    fields?: Record<string, ApiEndpointParameter>;
    items?: ApiEndpointParameter;
    formField?: {
        component: 'text' | 'select' | 'number' | 'datetime' | 'textarea';
        label: string;
        placeholder?: string;
        validation?: {
            required?: boolean;
            min?: number;
            max?: number;
            pattern?: string;
        };
    };
}

export interface ApiEndpoint {
    title: string;
    description: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    documentation: {
        overview: string;
        parameters?: string;
        examples?: string;
    };
    requestParameters?: {
        query?: Record<string, ApiEndpointParameter>;
        body?: Record<string, ApiEndpointParameter>;
    };
    responseFields: Record<string, ApiEndpointParameter>;
    exampleResponse: unknown;
}

export interface ApiCategory {
    title: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    endpoints: Record<string, ApiEndpoint>;
}

export interface ApiDocumentation extends Array<DocumentationSpecificationInterface> {
    categories?: Record<string, ApiCategory>;
}
