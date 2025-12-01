// Dependencies - API
import { GraphQlDocument } from '@structure/source/api/graphql/utilities/GraphQlUtilities';
import { GraphQLOperationMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import {
    graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata,
    GraphQlFieldMetadata,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFieldMetadataExtraction';
import { schema } from '@structure/source/utilities/schema/Schema';
import { BaseSchema } from '@structure/source/utilities/schema/schemas/BaseSchema';
import { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';

// Helper - Get field identifier from dotted path (e.g., 'input.title' -> 'title')
export function fieldIdentifierFromDottedPath(dottedPath: string): string {
    const parts = dottedPath.split('.');
    return parts[parts.length - 1] ?? dottedPath;
}

// Helper - Build schema for a single field from GraphQL metadata
export function fieldSchemaFromGraphQlFieldMetadata(graphQlFieldMetadata: GraphQlFieldMetadata): BaseSchema<unknown> {
    let fieldSchema: BaseSchema<unknown>;

    // Determine base schema type
    if(graphQlFieldMetadata.type === 'Boolean') {
        fieldSchema = schema.boolean().default(false);
    }
    else if(graphQlFieldMetadata.type === 'Int' || graphQlFieldMetadata.type === 'Float') {
        fieldSchema = schema.number().default(0);
    }
    else {
        // Default to string for all other types
        fieldSchema = schema.string();

        // Apply string-specific validation rules
        if(graphQlFieldMetadata.validation) {
            const stringSchema = fieldSchema as ReturnType<typeof schema.string>;

            // Maximum length
            if(
                graphQlFieldMetadata.validation.maxLength &&
                typeof graphQlFieldMetadata.validation.maxLength === 'number'
            ) {
                fieldSchema = stringSchema.maximumLength(graphQlFieldMetadata.validation.maxLength);
            }

            // Minimum length
            if(
                graphQlFieldMetadata.validation.minLength &&
                typeof graphQlFieldMetadata.validation.minLength === 'number'
            ) {
                fieldSchema = (fieldSchema as ReturnType<typeof schema.string>).minimumLength(
                    graphQlFieldMetadata.validation.minLength,
                );
            }

            // Email
            if(graphQlFieldMetadata.validation.isEmail) {
                fieldSchema = (fieldSchema as ReturnType<typeof schema.string>).emailAddress();
            }

            // Not empty (but only if not also optional - GraphQL can have both isNotEmpty AND isOptional)
            if(graphQlFieldMetadata.validation.isNotEmpty && !graphQlFieldMetadata.validation.isOptional) {
                fieldSchema = (fieldSchema as ReturnType<typeof schema.string>).notEmpty();
            }
        }
    }

    // Handle required/optional based on GraphQL metadata
    if(!graphQlFieldMetadata.required) {
        fieldSchema = fieldSchema.optional();
    }

    return fieldSchema;
}

// Helper - Create schema from GraphQL operation metadata
export function schemaFromGraphQlOperationMetadata(
    graphQlOperationMetadata: GraphQLOperationMetadata<GraphQlDocument>,
    hiddenFields?: Record<string, unknown>,
    excludedFields?: string[],
): ObjectSchema<Record<string, BaseSchema<unknown>>> {
    // Extract input type metadata from operation.parameters
    const graphQlFieldMetadataArray = graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata(
        graphQlOperationMetadata.parameters,
    );

    // Build schema for each visible field
    const shape: ObjectShape = {};
    for(const graphQlFieldMetadata of graphQlFieldMetadataArray) {
        // Skip hidden fields (they'll be merged on submit)
        if(hiddenFields && graphQlFieldMetadata.name in hiddenFields) {
            continue;
        }

        // Skip excluded fields entirely
        if(excludedFields?.includes(graphQlFieldMetadata.name)) {
            continue;
        }

        shape[graphQlFieldMetadata.name] = fieldSchemaFromGraphQlFieldMetadata(graphQlFieldMetadata);
    }

    return schema.object(shape) as ObjectSchema<Record<string, BaseSchema<unknown>>>;
}
