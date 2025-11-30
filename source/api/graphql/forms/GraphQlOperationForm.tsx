'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Notice } from '@structure/source/components/notices/Notice';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';
import { useFormNotice } from '@structure/source/components/forms-new/hooks/useFormNotice';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { GraphQlDocument } from '@structure/source/api/graphql/utilities/GraphQlUtilities';
import { BaseError } from '@structure/source/api/errors/BaseError';
import { GraphQLOperationMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
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
import { DotPathType, DotPathValuesType } from '@structure/source/utilities/type/DotPath';
import { getValueForKeyRecursively } from '@structure/source/utilities/type/Object';
import type { VariablesOf } from '@graphql-typed-document-node/core';
import { titleCase, slug } from '@structure/source/utilities/type/String';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// A minimal valid query for when defaultValuesQuery is not provided
const noOpQuery = gql(`query NoOp { __typename }`);

/**
 * Extracts field paths from a GraphQL document's variables type.
 * Used for type-safe field name references in GraphQlOperationForm.
 *
 * @example
 * // For PostUpdateDocument with variables { id: string; input: { title: string; slug: string } }
 * type Paths = FieldPathsOfType<typeof PostUpdateDocument>;
 * // Result: 'id' | 'input' | 'input.title' | 'input.slug'
 */
type FieldPathsOfType<TDocument> = DotPathType<VariablesOf<TDocument>>;

/**
 * Creates a mapped type of field paths to their corresponding value types.
 * Used for type-safe field value assignments in GraphQlOperationForm.
 *
 * @example
 * // For PostUpdateDocument with variables { id: string; input: { title: string; slug: string } }
 * type Values = FieldValuesOfType<typeof PostUpdateDocument>;
 * // Result: { 'id'?: string; 'input.title'?: string; 'input.slug'?: string; ... }
 */
type FieldValuesOfType<TDocument> = DotPathValuesType<VariablesOf<TDocument>>;

// Interface - SubmitButtonProperties
export interface SubmitButtonProperties {
    text?: string;
    variant?: 'A' | 'B' | 'C';
    className?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

// Interface - GraphQlOperationFormProperties
export interface GraphQlOperationFormProperties<TDocument extends GraphQlDocument = GraphQlDocument> {
    // Required
    operation: GraphQLOperationMetadata<TDocument>;

    // Field Control - Type-safe field names and values when TDocument is specific
    requiredFieldOverrides?: FieldPathsOfType<TDocument>[]; // Override schema to make these fields required
    hiddenFields?: FieldValuesOfType<TDocument>;
    excludedFields?: FieldPathsOfType<TDocument>[];
    fieldProperties?: Partial<Record<FieldPathsOfType<TDocument>, FieldPropertiesOverride>>;

    // Default Values - either pass values directly or provide a query to fetch them
    defaultValues?: FieldValuesOfType<TDocument>;
    defaultValuesQuery?: {
        document: GraphQlDocument;
        variables: Record<string, unknown>;
    };

    // Submit Handling
    onSubmit?: (
        formValues: Record<string, unknown>,
        mutationResponseData: unknown,
        mutationResponseError: BaseError | null,
    ) => void | Promise<void>;

    // Submit Button
    submitButton?: SubmitButtonProperties;

    // Debug
    showPreviewGraphQlMutationTip?: boolean;

    // Layout
    className?: string;
    fieldClassName?: string;
}

// Component - GraphQlOperationForm
export function GraphQlOperationForm<TDocument extends GraphQlDocument = GraphQlDocument>(
    properties: GraphQlOperationFormProperties<TDocument>,
) {
    // State
    const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

    // Extract GraphQL metadata
    const graphQlFormInputMetadataArray = graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata(
        properties.operation.parameters,
    );

    // Create schema (excluding hidden and excluded fields, with required overrides)
    const formSchema = schemaFromGraphQlOperationMetadata(
        properties.operation,
        properties.hiddenFields,
        properties.excludedFields,
        properties.requiredFieldOverrides,
    );

    // Hooks
    const mutation = networkService.useGraphQlMutation(
        properties.operation.document as Parameters<typeof networkService.useGraphQlMutation>[0],
    );
    const formNotice = useFormNotice();
    const form = useForm({
        schema: formSchema,
        onSubmit: async function (formState) {
            // Merge form values with hidden field values
            const allValues = { ...formState.value, ...properties.hiddenFields };

            // Convert to GraphQL mutation variables
            const variables = formValuesToGraphQlMutationVariables(allValues as Record<string, unknown>);

            try {
                const result = await mutation.execute(variables);
                formNotice.showSuccess('Saved successfully!');
                form.reset();
                setSlugManuallyEdited(false);

                if(properties.onSubmit) {
                    await properties.onSubmit(allValues as Record<string, unknown>, result, null);
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
                formNotice.showError(baseError.message);

                if(properties.onSubmit) {
                    await properties.onSubmit(allValues as Record<string, unknown>, null, baseError);
                }
            }
        },
    });

    // Title/Slug auto-generation
    const titleField = graphQlFormInputMetadataArray.find(function (f) {
        return f.name.endsWith('.title');
    });
    const slugField = graphQlFormInputMetadataArray.find(function (f) {
        return f.name.endsWith('.slug');
    });

    // Only track title if both title and slug fields exist and are visible
    // Cast to string[] for internal comparison since we're checking runtime metadata against typed props
    const excludedFieldsAsStrings = properties.excludedFields as string[] | undefined;
    const shouldTrackTitle =
        titleField &&
        slugField &&
        !(properties.hiddenFields && titleField.name in properties.hiddenFields) &&
        !(properties.hiddenFields && slugField.name in properties.hiddenFields) &&
        !excludedFieldsAsStrings?.includes(titleField.name) &&
        !excludedFieldsAsStrings?.includes(slugField.name);

    // Subscribe to title value changes using direct store subscription
    // This is more reliable than useStore for field value changes per TanStack Form docs
    const titleFieldName = shouldTrackTitle && titleField ? titleField.name : '';

    // Track the last title value we processed to avoid infinite loops
    const lastProcessedTitleReference = React.useRef<string | null>(null);

    React.useEffect(
        function () {
            if(!shouldTrackTitle || !titleFieldName || !slugField) {
                return;
            }

            // Subscribe to the form store for value changes
            const unsubscribe = form.store.subscribe(function () {
                // Skip if slug was manually edited
                if(slugManuallyEdited) {
                    return;
                }

                // Get the current title value using getFieldValue (which works correctly)
                const currentTitleValue = form.getFieldValue(titleFieldName as never);

                // Skip if title hasn't changed (prevents infinite loop from slug updates)
                if(currentTitleValue === lastProcessedTitleReference.current) {
                    return;
                }

                if(currentTitleValue && typeof currentTitleValue === 'string') {
                    lastProcessedTitleReference.current = currentTitleValue;
                    const newSlug = slug(currentTitleValue);
                    form.setFieldValue(slugField.name, newSlug);
                }
            });

            return unsubscribe;
        },
        [shouldTrackTitle, titleFieldName, slugField, slugManuallyEdited, form],
    );

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

    // Set default values when provided directly via props
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

            // Determine if this field needs special handling for title/slug auto-generation
            const isTitleField = input.name.endsWith('.title');
            const isSlugField = input.name.endsWith('.slug');

            return (
                <form.Field key={input.name} identifier={input.name} className={properties.fieldClassName}>
                    <form.FieldLabel tip={fieldConfiguration.tip}>{label}</form.FieldLabel>
                    <Component
                        variant="Outline"
                        placeholder={fieldConfiguration.placeholder || label}
                        {...fieldPropertiesFromFieldConfiguration(input, fieldConfiguration)}
                        // Title field: commit onChange so slug updates while typing
                        {...(isTitleField ? { commit: 'onChange' } : {})}
                        // Slug field: track manual edits to disable auto-generation
                        {...(isSlugField
                            ? {
                                  onInput: function () {
                                      setSlugManuallyEdited(true);
                                  },
                              }
                            : {})}
                    />
                </form.Field>
            );
        });

    // Submit button props
    const submitButtonText = properties.submitButton?.text || 'Submit';
    const submitButtonVariant = properties.submitButton?.variant || 'A';
    const SubmitIcon = properties.submitButton?.icon || SpinnerIcon;

    // Subscribe to form values for mutation preview (must be called unconditionally)
    const formValuesForPreview = form.useStore(function (state) {
        return state.values as Record<string, unknown>;
    });

    // Generate mutation preview tip content
    const mutationPreviewTip = properties.showPreviewGraphQlMutationTip
        ? (function () {
              const allValues = { ...formValuesForPreview, ...properties.hiddenFields };
              const variables = formValuesToGraphQlMutationVariables(allValues);
              return <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(variables, null, 2)}</pre>;
          })()
        : undefined;

    // Render
    return (
        <>
            {/* Error notice for default values query */}
            {properties.defaultValuesQuery && defaultValuesQuery.error && (
                <Notice variant="Negative" title="Error">
                    <p>{defaultValuesQuery.error.message}</p>
                </Notice>
            )}

            <form.Form className={properties.className}>
                {formFields}

                <div className="flex flex-col">
                    <formNotice.FormNotice className="mb-4" />
                    <div className="flex justify-end">
                        <AnimatedButton
                            variant={submitButtonVariant}
                            type="submit"
                            isProcessing={mutation.isLoading}
                            processingIcon={SubmitIcon}
                            className={properties.submitButton?.className}
                            tip={mutationPreviewTip}
                            tipProperties={
                                properties.showPreviewGraphQlMutationTip
                                    ? { contentClassName: 'max-w-none' }
                                    : undefined
                            }
                        >
                            {submitButtonText}
                        </AnimatedButton>
                    </div>
                </div>
            </form.Form>
        </>
    );
}
