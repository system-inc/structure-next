'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - TanStack Form
import type { FormApi } from '@tanstack/react-form';

// Type - SimpleFormApi
// Hides TanStack's 11 generic parameters for convenience
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SimpleFormApi<TFormData> = FormApi<TFormData, any, any, any, any, any, any, any, any, any, any, any>;

// Interface - FormStateInterface
// Matches TanStack's onSubmit props shape: { value, formApi, meta }
export interface FormStateInterface<TFormData> {
    value: TFormData;
    formApi: SimpleFormApi<TFormData>;
    meta?: unknown;
}

// Interface - LinkedFieldConfigurationInterface
// Configuration for auto-updating a target field when a source field changes
export interface LinkedFieldConfigurationInterface<TFieldPath extends string = string, TFormData = unknown> {
    sourceField: TFieldPath;
    targetField: TFieldPath;
    transform: (value: string, formState: FormStateInterface<TFormData>) => string;
}

// Interface - UseLinkedFieldsOptionsInterface
export interface UseLinkedFieldsOptionsInterface<TFieldPath extends string = string, TFormData = unknown> {
    formApi: SimpleFormApi<TFormData>;
    linkedFields: LinkedFieldConfigurationInterface<NoInfer<TFieldPath>, NoInfer<TFormData>>[];
}

// Interface - UseLinkedFieldsReturnInterface
// Note: Return methods accept `string` for runtime flexibility (e.g., iterating over metadata)
// Type safety is enforced at the options level where linkedFields are configured
export interface UseLinkedFieldsReturnInterface {
    getSourceFieldListeners: (sourceField: string) => { onChange: (event: { value: unknown }) => void } | undefined;
    getTargetFieldOnInput: (targetField: string) => ((event: React.FormEvent<HTMLInputElement>) => void) | undefined;
    isSourceField: (fieldName: string) => boolean;
    isTargetField: (fieldName: string) => boolean;
    resetAll: () => void;
}

// Hook - useLinkedFields
// Manages multiple linked field pairs. Uses a Map to track manual edit state per target field.
export function useLinkedFields<TFieldPath extends string = string, TFormData = unknown>(
    options: UseLinkedFieldsOptionsInterface<TFieldPath, TFormData>,
): UseLinkedFieldsReturnInterface {
    // Type for linked field configuration
    type LinkedFieldOptionsType = LinkedFieldConfigurationInterface<TFieldPath, TFormData>;

    // State - Map of target field names to manual edit state
    const [manualEditStates, setManualEditStates] = React.useState<Map<string, boolean>>(function () {
        return new Map();
    });

    // Reference for stable listener reference
    const manualEditStatesReference = React.useRef(manualEditStates);
    React.useEffect(
        function () {
            manualEditStatesReference.current = manualEditStates;
        },
        [manualEditStates],
    );

    // Reference for formApi to avoid stale closures
    const formApiReference = React.useRef(options.formApi);
    React.useEffect(
        function () {
            formApiReference.current = options.formApi;
        },
        [options.formApi],
    );

    // Build lookup maps for quick access
    const sourceToConfiguration = new Map<string, LinkedFieldOptionsType>();
    const targetToConfiguration = new Map<string, LinkedFieldOptionsType>();
    for(const linkedField of options.linkedFields) {
        sourceToConfiguration.set(linkedField.sourceField, linkedField);
        targetToConfiguration.set(linkedField.targetField, linkedField);
    }

    // Function to get listeners for a source field
    function getSourceFieldListeners(sourceField: string) {
        const fieldConfiguration = sourceToConfiguration.get(sourceField);
        if(!fieldConfiguration) return undefined;

        return {
            onChange: function (event: { value: unknown }) {
                const isManuallyEdited = manualEditStatesReference.current.get(fieldConfiguration.targetField) ?? false;
                if(isManuallyEdited) {
                    return;
                }
                // Handle both string and number values (for number inputs)
                if(typeof event.value === 'string' || typeof event.value === 'number') {
                    const formApi = formApiReference.current;

                    // Build formState matching TanStack's onSubmit shape
                    const formState: FormStateInterface<TFormData> = {
                        value: formApi.state.values,
                        formApi: formApi,
                        meta: undefined,
                    };

                    const newValue = fieldConfiguration.transform(String(event.value), formState);
                    // Type cast needed: TanStack Form's setFieldValue uses complex Updater<DeepValue<...>> generics
                    // Our string return from transform is compatible at runtime
                    (formApi.setFieldValue as (field: string, value: unknown) => void)(
                        fieldConfiguration.targetField,
                        newValue,
                    );
                }
            },
        };
    }

    // Function to get onInput handler for a target field
    function getTargetFieldOnInput(targetField: string) {
        const targetConfiguration = targetToConfiguration.get(targetField);
        if(!targetConfiguration) return undefined;

        return function (event: React.FormEvent<HTMLInputElement>) {
            const isEmpty = event.currentTarget.value.length === 0;
            setManualEditStates(function (previous) {
                const next = new Map(previous);
                next.set(targetField, !isEmpty);
                return next;
            });
        };
    }

    // Function to check if a field is a source field
    function isSourceField(fieldName: string) {
        return sourceToConfiguration.has(fieldName);
    }

    // Function to check if a field is a target field
    function isTargetField(fieldName: string) {
        return targetToConfiguration.has(fieldName);
    }

    // Function to reset all manual edit states
    function resetAll() {
        setManualEditStates(new Map());
    }

    return {
        getSourceFieldListeners,
        getTargetFieldOnInput,
        isSourceField,
        isTargetField,
        resetAll,
    };
}
