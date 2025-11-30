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
import { getValueForKeyRecursively } from '@structure/source/utilities/type/Object';
import { titleCase, slug } from '@structure/source/utilities/type/String';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// A minimal valid query for when defaultValuesQuery is not provided
const noOpQuery = gql(`query NoOp { __typename }`);

// Interface - SubmitButtonProperties
export interface SubmitButtonProperties {
    text?: string;
    variant?: 'A' | 'B' | 'C';
    className?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

// Interface - GraphQlOperationFormProperties
export interface GraphQlOperationFormProperties {
    // Required
    operation: GraphQLOperationMetadata<GraphQlDocument>;

    // Field Control
    hiddenFields?: Record<string, unknown>;
    excludedFields?: string[];
    fieldProperties?: Record<string, FieldPropertiesOverride>;

    // Default Values - either pass values directly or provide a query to fetch them
    defaultValues?: Record<string, unknown>;
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
export function GraphQlOperationForm(properties: GraphQlOperationFormProperties) {
    // State
    const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

    // Extract GraphQL metadata
    const graphQlFormInputMetadataArray = React.useMemo(
        function () {
            return graphQlFieldMetadataArrayFromGraphQlOperationParameterMetadata(properties.operation.parameters);
        },
        [properties.operation.parameters],
    );

    // Create schema (excluding hidden and excluded fields)
    const formSchema = React.useMemo(
        function () {
            return schemaFromGraphQlOperationMetadata(
                properties.operation,
                properties.hiddenFields,
                properties.excludedFields,
            );
        },
        [properties.operation, properties.hiddenFields, properties.excludedFields],
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
    const shouldTrackTitle =
        titleField &&
        slugField &&
        !(properties.hiddenFields && titleField.name in properties.hiddenFields) &&
        !(properties.hiddenFields && slugField.name in properties.hiddenFields) &&
        !properties.excludedFields?.includes(titleField.name) &&
        !properties.excludedFields?.includes(slugField.name);

    // Subscribe to title value changes - must be called unconditionally (Rules of Hooks)
    // Use the title field name if tracking is enabled, otherwise use a dummy key
    const titleFieldName = shouldTrackTitle && titleField ? titleField.name : '';
    const titleValueFromStore = form.useStore(function (state) {
        return titleFieldName ? (state.values as Record<string, unknown>)[titleFieldName] : null;
    });
    const titleValue = shouldTrackTitle ? titleValueFromStore : null;

    React.useEffect(
        function () {
            if(slugField && !slugManuallyEdited && titleValue && typeof titleValue === 'string') {
                form.setFieldValue(slugField.name, slug(titleValue));
            }
        },
        [titleValue, slugManuallyEdited, slugField, form],
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
    const formFields = React.useMemo(
        function () {
            return graphQlFormInputMetadataArray
                .filter(function (input) {
                    // Filter out hidden and excluded fields
                    if(properties.hiddenFields && input.name in properties.hiddenFields) return false;
                    if(properties.excludedFields?.includes(input.name)) return false;
                    return true;
                })
                .map(function (input) {
                    const Component = fieldFromGraphQlFieldMetadata(input, properties.fieldProperties);
                    const fieldConfiguration = properties.fieldProperties?.[input.name] || {};
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
        },
        [
            graphQlFormInputMetadataArray,
            properties.hiddenFields,
            properties.excludedFields,
            properties.fieldProperties,
            properties.fieldClassName,
            form,
        ],
    );

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
