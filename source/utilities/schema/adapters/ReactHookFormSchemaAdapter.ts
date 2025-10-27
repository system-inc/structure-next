// Dependencies - React Hook Form
import type { FieldValues, ResolverResult } from 'react-hook-form';

// Dependencies - Schema
import { BaseSchema } from '../schemas/BaseSchema';

// React Hook Form resolver that integrates with our schema validation system
export function reactHookFormSchemaAdapter<T extends FieldValues>(schemaInstance: BaseSchema<T>) {
    return async function resolve(values: T): Promise<ResolverResult<T>> {
        const result = await schemaInstance.validate(values);

        if(!result.valid) {
            // Convert schema errors to react-hook-form format
            const errors: Record<string, unknown> = {};

            for(const error of result.errors) {
                // Convert path array to dot notation (e.g., ['user', 'email'] => 'user.email')
                const fieldPath = error.path.join('.');

                // Only add the first error for each field (react-hook-form shows one error at a time)
                if(!errors[fieldPath]) {
                    errors[fieldPath] = {
                        type: error.identifier,
                        message: error.message,
                    };
                }
            }

            return {
                values: {},
                errors: errors as ResolverResult<T>['errors'],
            };
        }

        return {
            values: result.value,
            errors: {},
        };
    };
}
