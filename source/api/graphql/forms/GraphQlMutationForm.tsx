'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Notice } from '@structure/source/components/notices/Notice';
import { AnimatedButton, AnimatedButtonProperties } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { GraphQlDocument } from '@structure/source/api/graphql/utilities/GraphQlUtilities';
import { GraphQLOperationMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { BaseError } from '@structure/source/api/errors/BaseError';
import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { titleCase } from '@structure/source/utilities/type/String';
import { getValueForKeyRecursively } from '@structure/source/utilities/type/Object';
import { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';
import {
    graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata,
    formValuesToGraphQlMutationVariables,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFieldMetadataExtraction';
import {
    fieldIdentifierFromDottedPath,
    schemaFromGraphQlOperationMetadata,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFormSchemaGeneration';
import {
    FieldPropertiesOverride,
    fieldFromGraphQlFieldMetadata,
    fieldPropertiesFromFieldConfiguration,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFormFieldMapping';
import {
    DocumentFieldPathsType,
    DocumentFieldValuesType,
    LinkedFieldConfigurationInterface,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFormTypes';

// A minimal valid query for when defaultValuesQuery is not provided
const noOpQuery = gql(`query NoOp { __typename }`);

// Component - GraphQlMutationForm
export interface GraphQlMutationFormProperties<TDocument extends GraphQlDocument = GraphQlDocument> {
    // Layout
    className?: string;

    // Required
    operation: GraphQLOperationMetadata<TDocument>;

    // Schema - merge additional field schemas on top of GraphQL-generated schema
    // Useful for making fields required that are optional in the GraphQL schema, or validating extra fields
    schema?: ObjectSchema<ObjectShape>;

    // Field Control - Type-safe field names and values when TDocument is specific
    fieldProperties?: Partial<Record<DocumentFieldPathsType<TDocument>, FieldPropertiesOverride>>;

    // Hidden Fields - field paths to hide from the form (values still submitted)
    hiddenFields?: DocumentFieldValuesType<TDocument>;

    // Excluded Fields - field paths to exclude from the form
    excludedFields?: DocumentFieldPathsType<TDocument>[];

    // Linked Fields - auto-update target field when source field changes
    linkedFields?: LinkedFieldConfigurationInterface<TDocument>[];

    // Default Values - either pass values directly or provide a query to fetch them
    defaultValues?: DocumentFieldValuesType<TDocument>;
    defaultValuesQuery?: {
        document: GraphQlDocument;
        variables: Record<string, unknown>;
    };

    // Debug
    showPreviewGraphQlMutationTip?: boolean;

    // Children - render prop for extra fields not in the GraphQL schema (used with transformFormValues)
    // Receives the form instance for full control over field rendering and validation
    children?: (form: ReturnType<typeof useForm<ObjectSchema<ObjectShape>>>) => React.ReactNode;

    // Notice Messages - customize success/error messages shown after mutation
    notice?: {
        success?: {
            title?: React.ReactNode | ((graphQlMutationResult: ResultOf<TDocument>) => React.ReactNode);
            content?: React.ReactNode | ((graphQlMutationResult: ResultOf<TDocument>) => React.ReactNode);
        };
        error?: {
            title?: React.ReactNode | ((error: BaseError) => React.ReactNode);
            content?: React.ReactNode | ((error: BaseError) => React.ReactNode);
        };
    };

    // Submit Button
    submitButton?: AnimatedButtonProperties;

    // Transform values before submission - receives form values (VariablesOf + extra fields), returns transformed values
    transformFormValues?: (formValues: VariablesOf<TDocument> & Record<string, unknown>) => Record<string, unknown>;

    // Submit Handling
    onSubmit?: (
        formValues: Record<string, unknown>,
        mutationResponseData: unknown,
        mutationResponseError: BaseError | null,
    ) => void | Promise<void>;
    resetOnSuccess?: boolean; // Reset form after successful submission (default: false)
}
export function GraphQlMutationForm<TDocument extends GraphQlDocument = GraphQlDocument>(
    properties: GraphQlMutationFormProperties<TDocument>,
) {
    // Extract GraphQL metadata
    const graphQlFormInputMetadataArray = graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata(
        properties.operation.parameters,
    );

    // Create schema (excluding hidden and excluded fields)
    let formSchema = schemaFromGraphQlOperationMetadata(
        properties.operation,
        properties.hiddenFields,
        properties.excludedFields,
    );

    // Merge extra schema on top (overrides GraphQL-generated schema)
    if(properties.schema) {
        formSchema = formSchema.merge(properties.schema);
    }

    // Hooks
    const graphQlMutation = networkService.useGraphQlMutation(
        properties.operation.document as Parameters<typeof networkService.useGraphQlMutation>[0],
    );
    const form = useForm({
        schema: formSchema,
        // Cast to string-based configuration since GraphQL field paths are runtime strings
        linkedFields: properties.linkedFields as {
            sourceField: string;
            targetField: string;
            transform: (value: string) => string;
        }[],
        onSubmit: async function (formState) {
            // Merge form values with hidden field values
            let formValues = { ...formState.value, ...properties.hiddenFields } as VariablesOf<TDocument> &
                Record<string, unknown>;

            // Apply value transformation if provided
            if(properties.transformFormValues) {
                formValues = properties.transformFormValues(formValues) as VariablesOf<TDocument> &
                    Record<string, unknown>;
            }

            // Convert to GraphQL mutation variables
            const variables = formValuesToGraphQlMutationVariables(formValues);

            try {
                const graphQlMutationResult = await graphQlMutation.execute(variables);

                // Cast result to the expected type for type-safe callback functions
                const typedResult = graphQlMutationResult as ResultOf<TDocument>;

                // Resolve success notice title and content (support static or function)
                const successTitle =
                    typeof properties.notice?.success?.title === 'function'
                        ? properties.notice.success.title(typedResult)
                        : properties.notice?.success?.title ?? 'Saved.';
                const successContent =
                    typeof properties.notice?.success?.content === 'function'
                        ? properties.notice.success.content(typedResult)
                        : properties.notice?.success?.content;

                form.notice.showSuccess(successTitle, successContent);

                // Only reset form if explicitly requested (default: false)
                if(properties.resetOnSuccess) {
                    form.reset();
                    form.resetLinkedFields();
                }

                if(properties.onSubmit) {
                    await properties.onSubmit(formValues as Record<string, unknown>, graphQlMutationResult, null);
                }
            }
            catch(error) {
                const baseError =
                    error instanceof BaseError
                        ? error
                        : new BaseError({
                              name: 'FormSubmissionError',
                              message: error instanceof Error ? error.message : String(error),
                              statusCode: 500,
                          });

                // Resolve error notice title and content (support static or function)
                const errorTitle =
                    typeof properties.notice?.error?.title === 'function'
                        ? properties.notice.error.title(baseError)
                        : properties.notice?.error?.title ?? baseError.message;
                const errorContent =
                    typeof properties.notice?.error?.content === 'function'
                        ? properties.notice.error.content(baseError)
                        : properties.notice?.error?.content;

                form.notice.showError(errorTitle, errorContent);

                if(properties.onSubmit) {
                    await properties.onSubmit(formValues as Record<string, unknown>, null, baseError);
                }
            }
        },
    });

    // Cast to string[] for internal comparison since we're checking runtime metadata against typed props
    const excludedFieldsAsStrings = properties.excludedFields as string[] | undefined;

    // Fetch default values if query provided
    const defaultValuesQuery = networkService.useGraphQlQuery(
        (properties.defaultValuesQuery?.document || noOpQuery) as Parameters<typeof networkService.useGraphQlQuery>[0],
        properties.defaultValuesQuery?.variables,
        { enabled: !!properties.defaultValuesQuery },
    );

    // Set default values when query loads
    React.useEffect(
        function () {
            if(defaultValuesQuery.data) {
                for(const input of graphQlFormInputMetadataArray) {
                    const value = getValueForKeyRecursively(
                        defaultValuesQuery.data as Record<string, unknown>,
                        fieldIdentifierFromDottedPath(input.name),
                    );
                    if(value !== undefined && value !== null) {
                        form.setFieldValue(input.name, value);
                    }
                }
            }
        },
        [defaultValuesQuery.data, graphQlFormInputMetadataArray, form],
    );

    // Effect to set default values when provided directly via properties
    React.useEffect(
        function () {
            if(properties.defaultValues) {
                for(const [fieldName, value] of Object.entries(properties.defaultValues)) {
                    if(value !== undefined && value !== null) {
                        form.setFieldValue(fieldName, value);
                    }
                }
            }
        },
        [properties.defaultValues, form],
    );

    // Generate form fields
    // Cast fieldProperties to Record<string, ...> for internal use with runtime metadata
    const fieldPropertiesAsRecord = properties.fieldProperties as Record<string, FieldPropertiesOverride> | undefined;
    const formFields = graphQlFormInputMetadataArray
        .filter(function (input) {
            // Filter out hidden and excluded fields
            if(properties.hiddenFields && input.name in properties.hiddenFields) return false;
            if(excludedFieldsAsStrings?.includes(input.name)) return false;
            return true;
        })
        .map(function (input) {
            const Component = fieldFromGraphQlFieldMetadata(input, fieldPropertiesAsRecord);
            const fieldConfiguration = fieldPropertiesAsRecord?.[input.name] || {};
            const label = fieldConfiguration.label || titleCase(fieldIdentifierFromDottedPath(input.name));

            // Render the field
            return (
                <form.Field key={input.name} identifier={input.name}>
                    <form.FieldLabel tip={fieldConfiguration.tip}>{label}</form.FieldLabel>
                    <Component
                        variant="Outline"
                        placeholder={fieldConfiguration.placeholder || label}
                        {...fieldPropertiesFromFieldConfiguration(input, fieldConfiguration)}
                    />
                </form.Field>
            );
        });

    // Subscribe to form values for mutation preview (must be called unconditionally)
    const formValuesForPreview = form.useStore(function (state) {
        return state.values as Record<string, unknown>;
    });

    // Generate mutation preview tip content
    const graphQlMutationPreviewTip = properties.showPreviewGraphQlMutationTip
        ? (function () {
              let formValues = { ...formValuesForPreview, ...properties.hiddenFields } as VariablesOf<TDocument> &
                  Record<string, unknown>;
              // Apply transformation if provided (same as in onSubmit)
              if(properties.transformFormValues) {
                  formValues = properties.transformFormValues(formValues) as VariablesOf<TDocument> &
                      Record<string, unknown>;
              }
              const variables = formValuesToGraphQlMutationVariables(formValues);
              return <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(variables, null, 2)}</pre>;
          })()
        : undefined;

    // Render the component
    return (
        <>
            {/* Error notice for default values query */}
            {properties.defaultValuesQuery && defaultValuesQuery.error && (
                <Notice variant="Negative" title="Error">
                    <p>{defaultValuesQuery.error.message}</p>
                </Notice>
            )}

            {/* Form */}
            <form.Form className={properties.className}>
                {/* Fields */}
                {formFields}

                {/* Children can have fields */}
                {properties.children?.(form)}

                <div className="flex flex-col">
                    <form.Notice className="mb-4" />
                    <div className="flex justify-end">
                        <AnimatedButton
                            variant="A"
                            type="submit"
                            isProcessing={graphQlMutation.isLoading}
                            processingIcon={SpinnerIcon}
                            animateIconPosition="iconRight"
                            tip={graphQlMutationPreviewTip}
                            tipProperties={
                                properties.showPreviewGraphQlMutationTip
                                    ? { contentClassName: 'max-w-none' }
                                    : undefined
                            }
                            {...properties.submitButton}
                        >
                            {properties.submitButton?.children ?? 'Submit'}
                        </AnimatedButton>
                    </div>
                </div>
            </form.Form>
        </>
    );
}
