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
import { FieldInputMarkup } from '@structure/source/components/forms-new/fields/markup/FieldInputMarkup';
import {
    DocumentFieldPathsType,
    DocumentFieldValuesType,
    LinkedFieldConfigurationInterface,
} from '@structure/source/api/graphql/forms/utilities/GraphQlFormTypes';

// A minimal valid query for when defaultValuesGraphQlQuery is not provided
const noOpQuery = gql(`query NoOp { __typename }`);

// Function to process form values for submission (filter changed fields, apply transformations)
function processFormValuesForSubmission(
    formValues: Record<string, unknown>,
    options: {
        submitOnlyChangedFields?: boolean;
        defaultValues?: Record<string, unknown>;
        transformFormValues?: (values: Record<string, unknown>) => Record<string, unknown>;
    },
): Record<string, unknown> {
    let processedValues = { ...formValues };

    // If submitOnlyChangedFields is enabled, filter to only changed values
    if(options.submitOnlyChangedFields && options.defaultValues) {
        const changedValues: Record<string, unknown> = {};

        // Compare using dotted keys from defaultValues, but get actual values by traversing nested structure
        for(const [dottedKey, defaultValue] of Object.entries(options.defaultValues)) {
            // Traverse the dotted path to get the actual value (e.g., 'input.displayName' -> formValues['input']['displayName'])
            const pathParts = dottedKey.split('.');
            let value: unknown = processedValues;
            for(const part of pathParts) {
                value = (value as Record<string, unknown>)?.[part];
            }
            // Normalize empty strings and nullish values for comparison
            const normalizedValue = value === '' || value === null || value === undefined ? '' : value;
            const normalizedDefault =
                defaultValue === '' || defaultValue === null || defaultValue === undefined ? '' : defaultValue;
            // Include field if it differs from default value
            if(normalizedValue !== normalizedDefault) {
                changedValues[dottedKey] = value;
            }
        }

        processedValues = changedValues;
    }

    // Apply value transformation if provided
    if(options.transformFormValues) {
        processedValues = options.transformFormValues(processedValues);
    }

    return processedValues;
}

// Type - GraphQlMutationFormReferenceType
// The form instance type exposed via formReference prop
export type GraphQlMutationFormReferenceType = ReturnType<typeof useForm<ObjectSchema<ObjectShape>>> | null;

// Component - GraphQlMutationForm
export interface GraphQlMutationFormProperties<
    TDocument extends GraphQlDocument = GraphQlDocument,
    TDefaultValuesQueryDocument extends GraphQlDocument = GraphQlDocument,
> {
    showPreviewGraphQlMutationTip?: boolean; // For debugging
    // Form Reference - exposes the form instance for external control (e.g., setting values via effects)
    formReference?: React.RefObject<GraphQlMutationFormReferenceType>;
    className?: string; // Layout
    operation: GraphQLOperationMetadata<TDocument>;
    // Schema - merge additional field schemas on top of GraphQL-generated schema
    // Useful for making fields required that are optional in the GraphQL schema, or validating extra fields
    schema?: ObjectSchema<ObjectShape>;
    fieldProperties?: Partial<Record<DocumentFieldPathsType<TDocument>, FieldPropertiesOverride>>;
    hiddenFields?: DocumentFieldPathsType<TDocument>[]; // Field identifiers to hide from UI (values still in form, use defaultValues to set them)
    excludedFields?: DocumentFieldPathsType<TDocument>[]; // Field paths to exclude from the form
    linkedFields?: LinkedFieldConfigurationInterface<TDocument>[]; // Auto-update target field when source field changes
    defaultValues?: DocumentFieldValuesType<TDocument>; // Pass values directly
    // Provide a query to request default values
    defaultValuesGraphQlQuery?: {
        document: TDefaultValuesQueryDocument;
        variables?: VariablesOf<TDefaultValuesQueryDocument>;
        transform?: (data: ResultOf<TDefaultValuesQueryDocument>) => DocumentFieldValuesType<TDocument>;
    };
    // Children - render property for extra fields not in the GraphQL schema (used with transformFormValues)
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
    submitButtonProperties?: AnimatedButtonProperties;
    submitOnlyChangedFields?: boolean; // Only submit fields that differ from defaultValues (default: false)
    isLoading?: boolean; // Loading State - shows placeholder skeletons for each field while loading
    resetOnSubmitSuccess?: boolean; // Reset form after successful submission (default: false)
    // Transform values before submission - receives form values (VariablesOf + extra fields), returns transformed values
    transformFormValues?: (formValues: VariablesOf<TDocument> & Record<string, unknown>) => Record<string, unknown>;
    onSubmit?: (
        formValues: VariablesOf<TDocument>,
        mutationResponseData: ResultOf<TDocument> | null,
        mutationResponseError: BaseError | null,
    ) => void | Promise<void>;
}
export function GraphQlMutationForm<
    TDocument extends GraphQlDocument = GraphQlDocument,
    TDefaultValuesQueryDocument extends GraphQlDocument = GraphQlDocument,
>(properties: GraphQlMutationFormProperties<TDocument, TDefaultValuesQueryDocument>) {
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
            // Process form values (filter changed fields, merge hidden fields, apply transformations)
            const formValues = processFormValuesForSubmission(formState.value as Record<string, unknown>, {
                submitOnlyChangedFields: properties.submitOnlyChangedFields,
                defaultValues: properties.defaultValues as Record<string, unknown>,
                transformFormValues: properties.transformFormValues as
                    | ((values: Record<string, unknown>) => Record<string, unknown>)
                    | undefined,
            });

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
                if(properties.resetOnSubmitSuccess) {
                    form.reset();
                    form.resetLinkedFields();
                }

                if(properties.onSubmit) {
                    await properties.onSubmit(
                        formValues as VariablesOf<TDocument>,
                        graphQlMutationResult as ResultOf<TDocument>,
                        null,
                    );
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
                    await properties.onSubmit(formValues as VariablesOf<TDocument>, null, baseError);
                }
            }
        },
    });

    // Fetch default values if query provided
    const defaultValuesGraphQlQueryRequest = networkService.useGraphQlQuery(
        (properties.defaultValuesGraphQlQuery?.document || noOpQuery) as Parameters<
            typeof networkService.useGraphQlQuery
        >[0],
        properties.defaultValuesGraphQlQuery?.variables as Parameters<typeof networkService.useGraphQlQuery>[1],
        { enabled: !!properties.defaultValuesGraphQlQuery },
    );

    // Derive loading state - controlled if provided, otherwise from query
    const isLoading = properties.isLoading ?? defaultValuesGraphQlQueryRequest.isLoading;

    // Cast to string[] for internal comparison since we're checking runtime metadata against typed props
    const hiddenFieldsAsStrings = properties.hiddenFields as string[] | undefined;
    const excludedFieldsAsStrings = properties.excludedFields as string[] | undefined;

    // Track the last synced query data to avoid re-running the effect unnecessarily
    const lastSyncedQueryDataReference = React.useRef<string | null>(null);

    // Effect to set default values when provided via query
    React.useEffect(
        function () {
            if(defaultValuesGraphQlQueryRequest.data) {
                // Serialize for comparison to avoid infinite loops
                const serialized = JSON.stringify(defaultValuesGraphQlQueryRequest.data);
                if(serialized === lastSyncedQueryDataReference.current) {
                    return;
                }
                lastSyncedQueryDataReference.current = serialized;

                // If transform function is provided, use it to map response to form values
                if(properties.defaultValuesGraphQlQuery?.transform) {
                    const transformedValues = properties.defaultValuesGraphQlQuery.transform(
                        defaultValuesGraphQlQueryRequest.data as ResultOf<TDefaultValuesQueryDocument>,
                    );
                    for(const [fieldName, value] of Object.entries(transformedValues)) {
                        if(value !== undefined && value !== null) {
                            form.setFieldValue(fieldName, value);
                        }
                    }
                }
                else {
                    // Auto-map by matching field identifiers recursively
                    for(const input of graphQlFormInputMetadataArray) {
                        const value = getValueForKeyRecursively(
                            defaultValuesGraphQlQueryRequest.data as Record<string, unknown>,
                            fieldIdentifierFromDottedPath(input.name),
                        );
                        if(value !== undefined && value !== null) {
                            form.setFieldValue(input.name, value);
                        }
                    }
                }
            }
        },
        // Note: form is intentionally excluded - setFieldValue is stable and including it causes infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultValuesGraphQlQueryRequest.data, graphQlFormInputMetadataArray, properties.defaultValuesGraphQlQuery],
    );

    // Track the last synced default values to avoid re-running the effect unnecessarily
    const lastSyncedDefaultValuesReference = React.useRef<string | null>(null);

    // Effect to set default values when provided directly via properties
    React.useEffect(
        function () {
            if(properties.defaultValues) {
                // Serialize for comparison to avoid infinite loops
                const serialized = JSON.stringify(properties.defaultValues);
                if(serialized === lastSyncedDefaultValuesReference.current) {
                    return;
                }
                lastSyncedDefaultValuesReference.current = serialized;

                for(const [fieldName, value] of Object.entries(properties.defaultValues)) {
                    if(value !== undefined && value !== null) {
                        form.setFieldValue(fieldName, value);
                    }
                }
            }
        },
        // Note: form is intentionally excluded - setFieldValue is stable and including it causes infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [properties.defaultValues],
    );

    // Effect to set form reference if provided
    React.useEffect(
        function () {
            if(properties.formReference) {
                properties.formReference.current = form;
            }
        },
        [form, properties.formReference],
    );

    // Generate form fields
    // Cast fieldProperties to Record<string, ...> for internal use with runtime metadata
    const fieldPropertiesAsRecord = properties.fieldProperties as Record<string, FieldPropertiesOverride> | undefined;

    // Filter and sort fields (used for both loading placeholders and actual form fields)
    const visibleFields = graphQlFormInputMetadataArray
        .filter(function (input) {
            // Filter out hidden and excluded fields
            if(hiddenFieldsAsStrings?.includes(input.name)) return false;
            if(excludedFieldsAsStrings?.includes(input.name)) return false;
            return true;
        })
        .sort(function (a, b) {
            // Sort by order property (lower numbers appear first)
            const orderA = fieldPropertiesAsRecord?.[a.name]?.order;
            const orderB = fieldPropertiesAsRecord?.[b.name]?.order;

            // If neither has order, maintain original order
            if(orderA === undefined && orderB === undefined) return 0;
            // Fields with explicit order come before fields without
            if(orderA === undefined) return 1;
            if(orderB === undefined) return -1;
            // Sort by order value (ascending)
            return orderA - orderB;
        });

    const formFields = visibleFields.map(function (input) {
        const Component = fieldFromGraphQlFieldMetadata(input, fieldPropertiesAsRecord);
        const fieldConfiguration = fieldPropertiesAsRecord?.[input.name] || {};
        const label = fieldConfiguration.label || titleCase(fieldIdentifierFromDottedPath(input.name));

        // Check if this is a markup field (contenteditable needs aria-labelledby instead of htmlFor)
        const useAriaLabelledBy = Component === FieldInputMarkup;

        // Render the field
        return (
            <form.Field key={input.name} identifier={input.name}>
                <form.FieldLabel tip={fieldConfiguration.tip} useAriaLabelledBy={useAriaLabelledBy}>
                    {label}
                </form.FieldLabel>
                <Component
                    variant="Outline"
                    placeholder={fieldConfiguration.placeholder || label}
                    disabled={isLoading}
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
              const formValues = processFormValuesForSubmission(formValuesForPreview, {
                  submitOnlyChangedFields: properties.submitOnlyChangedFields,
                  defaultValues: properties.defaultValues as Record<string, unknown>,
                  transformFormValues: properties.transformFormValues as
                      | ((values: Record<string, unknown>) => Record<string, unknown>)
                      | undefined,
              });
              const variables = formValuesToGraphQlMutationVariables(formValues);
              return <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(variables, null, 2)}</pre>;
          })()
        : undefined;

    // Render the component
    return (
        <>
            {/* Error notice for default values query */}
            {properties.defaultValuesGraphQlQuery && defaultValuesGraphQlQueryRequest.error && (
                <Notice variant="Negative" title="Error">
                    <p>{defaultValuesGraphQlQueryRequest.error.message}</p>
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
                            {...properties.submitButtonProperties}
                        >
                            {properties.submitButtonProperties?.children ?? 'Submit'}
                        </AnimatedButton>
                    </div>
                </div>
            </form.Form>
        </>
    );
}
