// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { FieldInputTextArea } from '@structure/source/components/forms-new/fields/text-area/FieldInputTextArea';
import { FieldInputCheckbox } from '@structure/source/components/forms-new/fields/checkbox/FieldInputCheckbox';
import { FieldInputSelect } from '@structure/source/components/forms-new/fields/select/FieldInputSelect';

// Dependencies - Utilities
import { GraphQlFieldMetadata } from '@structure/source/api/graphql/forms/utilities/GraphQlFieldMetadataExtraction';
import { titleCase } from '@structure/source/utilities/type/String';

// Interface - FieldPropertiesOverride
export interface FieldPropertiesOverride {
    label?: string;
    placeholder?: string;
    rows?: number;
    component?: React.ComponentType;
    tip?: string;
    className?: string;
}

// Function to determine which form component to use for a field
export function fieldFromGraphQlFieldMetadata(
    graphQlFieldMetadata: GraphQlFieldMetadata,
    fieldProperties?: Record<string, FieldPropertiesOverride>,
): React.ComponentType<Record<string, unknown>> {
    const fieldConfiguration = fieldProperties?.[graphQlFieldMetadata.name];

    // Check for explicit component override
    if(fieldConfiguration?.component) {
        return fieldConfiguration.component as React.ComponentType<Record<string, unknown>>;
    }

    // Array with unique values -> Select (TODO: MultiSelect when available)
    if(graphQlFieldMetadata.validation?.arrayUnique) {
        return FieldInputSelect as React.ComponentType<Record<string, unknown>>;
    }

    // Enum -> Select
    if(graphQlFieldMetadata.kind === 'enum' || graphQlFieldMetadata.validation?.isIn) {
        return FieldInputSelect as React.ComponentType<Record<string, unknown>>;
    }

    // Boolean -> Checkbox
    if(graphQlFieldMetadata.type === 'Boolean') {
        return FieldInputCheckbox as React.ComponentType<Record<string, unknown>>;
    }

    // Long text (content, description, or maxLength > 128) -> TextArea
    if(
        graphQlFieldMetadata.name.endsWith('.content') ||
        graphQlFieldMetadata.name.endsWith('.description') ||
        (graphQlFieldMetadata.validation?.maxLength &&
            typeof graphQlFieldMetadata.validation.maxLength === 'number' &&
            graphQlFieldMetadata.validation.maxLength > 128)
    ) {
        return FieldInputTextArea as React.ComponentType<Record<string, unknown>>;
    }

    // Default -> Text
    return FieldInputText as React.ComponentType<Record<string, unknown>>;
}

// Helper - Get additional component properties based on field type and configuration
export function fieldPropertiesFromFieldConfiguration(
    graphQlFieldMetadata: GraphQlFieldMetadata,
    fieldConfiguration: FieldPropertiesOverride,
): Record<string, unknown> {
    const fieldProperties: Record<string, unknown> = {};

    // Handle password fields
    if(graphQlFieldMetadata.name.endsWith('.password')) {
        fieldProperties.type = 'password';
    }

    // Handle email fields
    if(graphQlFieldMetadata.name.endsWith('.emailAddress') || graphQlFieldMetadata.name.endsWith('.email')) {
        fieldProperties.type = 'email';
        fieldProperties.autoComplete = 'email';
    }

    // Handle textarea rows
    if(fieldConfiguration.rows) {
        fieldProperties.rows = fieldConfiguration.rows;
    }
    else if(
        graphQlFieldMetadata.name.endsWith('.content') ||
        graphQlFieldMetadata.name.endsWith('.description') ||
        (graphQlFieldMetadata.validation?.maxLength &&
            typeof graphQlFieldMetadata.validation.maxLength === 'number' &&
            graphQlFieldMetadata.validation.maxLength > 128)
    ) {
        // Calculate rows based on maxLength
        const maximumLength =
            typeof graphQlFieldMetadata.validation?.maxLength === 'number'
                ? graphQlFieldMetadata.validation.maxLength
                : 256;
        fieldProperties.rows = Math.min(Math.ceil(maximumLength / 128), 8);
    }

    // Handle select options for enums
    if(graphQlFieldMetadata.kind === 'enum' && graphQlFieldMetadata.possibleValues) {
        fieldProperties.children = graphQlFieldMetadata.possibleValues.map(function (value) {
            return React.createElement('option', { key: value, value: value }, titleCase(value));
        });
    }

    // Handle select options for isIn validation
    if(graphQlFieldMetadata.validation?.isIn && Array.isArray(graphQlFieldMetadata.validation.isIn)) {
        fieldProperties.children = (graphQlFieldMetadata.validation.isIn as string[]).map(function (value) {
            return React.createElement('option', { key: value, value: value }, titleCase(value));
        });
    }

    // Apply field className
    if(fieldConfiguration.className) {
        fieldProperties.className = fieldConfiguration.className;
    }

    return fieldProperties;
}
