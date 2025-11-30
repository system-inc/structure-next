// Dependencies - Schema
import { schema } from '../Schema';
import { BaseSchema } from '../schemas/BaseSchema';
import { StringSchema } from '../schemas/StringSchema';
import { ObjectSchema, ObjectShape } from '../schemas/ObjectSchema';

// Dependencies - GraphQL Types
import type {
    GraphQLInputObjectTypeMetadata,
    GraphQLInputObjectFieldMetadata,
    GraphQLInputObjectFieldValidationMetadata,
    GraphQLInputObjectScalarFieldMetadata,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

/**
 * Converts a GraphQL input type metadata to a forms-new ObjectSchema.
 * This ensures frontend validation matches backend validation rules defined in GraphQL.
 *
 * @typeParam TInput - The GraphQL input type (e.g., AccountProfileUpdateInput) for type-safe field names
 * @param graphQlMetadata - The GraphQL input type metadata from generated code
 * @param fieldSubset - Optional array of field names to include. If provided, only these fields will be in the schema.
 * @returns An ObjectSchema with validation rules derived from the GraphQL metadata
 *
 * @example
 * ```typescript
 * import { AccountProfileUpdateInput, AccountProfileUpdateInputMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';
 *
 * // Create schema for all fields with type-safe field names
 * const fullSchema = schemaFromGraphQl<AccountProfileUpdateInput>(AccountProfileUpdateInputMetadata);
 *
 * // Create schema for specific fields only
 * const partialSchema = schemaFromGraphQl<AccountProfileUpdateInput>(
 *     AccountProfileUpdateInputMetadata,
 *     ['givenName', 'familyName', 'displayName'],
 * );
 * ```
 */
export function schemaFromGraphQl<TInput extends object = Record<string, unknown>>(
    graphQlMetadata: GraphQLInputObjectTypeMetadata,
    fieldSubset?: Extract<keyof TInput, string>[],
): ObjectSchema<Record<Extract<keyof TInput, string>, BaseSchema<unknown>>> {
    type TField = Extract<keyof TInput, string>;
    const shape: ObjectShape = {};

    for(const field of graphQlMetadata.fields) {
        // Skip fields not in subset (if subset specified)
        if(fieldSubset && !fieldSubset.includes(field.name as TField)) {
            continue;
        }

        shape[field.name] = buildFieldSchema(field);
    }

    return schema.object(shape) as ObjectSchema<Record<Extract<keyof TInput, string>, BaseSchema<unknown>>>;
}

/**
 * Gets the type name from a GraphQL field, handling both scalar fields (where type is a string)
 * and other field types (where type is an object with a type property).
 */
function getFieldTypeName(field: GraphQLInputObjectFieldMetadata): string {
    if(field.kind === 'scalar') {
        // Scalar fields have type as a string
        return (field as GraphQLInputObjectScalarFieldMetadata).type;
    }
    else if(field.kind === 'enum' || field.kind === 'object') {
        // Enum and object fields have type as an object with a type property
        return field.type.type;
    }
    else {
        // List fields - return a generic type
        return 'list';
    }
}

// Builds a schema for a single GraphQL field based on its type and validation rules.
function buildFieldSchema(field: GraphQLInputObjectFieldMetadata): BaseSchema<unknown> {
    let fieldSchema: BaseSchema<unknown>;

    const typeName = getFieldTypeName(field);

    // Start with base type based on GraphQL scalar type
    if(field.kind === 'scalar') {
        switch(typeName) {
            case 'String':
            case 'DateTimeISO':
                fieldSchema = schema.string();
                break;
            case 'Int':
            case 'Float':
                fieldSchema = schema.number();
                break;
            case 'Boolean':
                fieldSchema = schema.boolean();
                break;
            default:
                // Default to string for unknown scalar types
                fieldSchema = schema.string();
        }
    }
    else {
        // For non-scalar types (enums, objects), default to string for now
        // This can be extended to handle nested objects and enums
        fieldSchema = schema.string();
    }

    // Apply validation rules from GraphQL metadata
    if(field.validation) {
        for(const rule of field.validation) {
            fieldSchema = applyValidationRule(fieldSchema, rule, typeName);
        }
    }

    // Handle required/optional based on GraphQL field definition
    // Note: isOptional validation rule is handled separately - we use the field.required property
    if(!field.required) {
        fieldSchema = fieldSchema.optional();
    }

    return fieldSchema;
}

/**
 * Applies a single validation rule to a schema based on the GraphQL validation metadata.
 * Maps GraphQL validation types to schema methods.
 */
function applyValidationRule(
    fieldSchema: BaseSchema<unknown>,
    rule: GraphQLInputObjectFieldValidationMetadata,
    fieldType: string,
): BaseSchema<unknown> {
    // Only apply string-specific validators to string schemas
    if(fieldType === 'String' || fieldType === 'DateTimeISO') {
        const stringSchema = fieldSchema as StringSchema;

        switch(rule.type) {
            case 'maxLength':
                // maxLength has [max] constraint
                if(rule.constraints && rule.constraints.length > 0) {
                    return stringSchema.maximumLength(rule.constraints[0] as number);
                }
                break;

            case 'minLength':
                // minLength has [min] constraint
                if(rule.constraints && rule.constraints.length > 0) {
                    return stringSchema.minimumLength(rule.constraints[0] as number);
                }
                break;

            case 'isLength':
                // isLength has [min, max] constraints
                if(rule.constraints && rule.constraints.length >= 2) {
                    const [minimum, maximum] = rule.constraints as [number, number];
                    return stringSchema.minimumLength(minimum).maximumLength(maximum);
                }
                break;

            case 'isEmail':
                return stringSchema.emailAddress();

            case 'isNotEmpty':
                return stringSchema.notEmpty();

            case 'isString':
                // Already a string schema, no additional validation needed
                break;

            case 'isOptional':
                // Handled separately via field.required
                break;

            case 'isDate':
                // Date validation - currently just validates as string
                // Could add date-specific validation in the future
                break;

            case 'isBoolean':
                // Type validation handled by schema type
                break;

            case 'isArray':
                // Array validation would need array schema
                break;

            case 'IsPhoneNumberLite':
                // Phone number validation - could add specific validator
                // For now, just treat as string
                break;

            default:
                // Unknown validation type - log for debugging in development
                if(process.env.NODE_ENV === 'development') {
                    console.warn(
                        `schemaFromGraphQl: Unknown validation type "${rule.type}" for field type "${fieldType}"`,
                    );
                }
        }
    }

    return fieldSchema;
}
