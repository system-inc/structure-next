'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { UseLinkedFieldOptions } from './useLinkedField';

// Interface - UseLinkedFieldsOptions
export interface UseLinkedFieldsOptions {
    form: { setFieldValue: (field: string, value: unknown) => void };
    linkedFields: Omit<UseLinkedFieldOptions, 'form'>[];
}

// Interface - UseLinkedFieldsReturn
export interface UseLinkedFieldsReturn {
    getSourceFieldListeners: (sourceField: string) => { onChange: (event: { value: unknown }) => void } | undefined;
    getTargetFieldOnInput: (targetField: string) => ((event: React.FormEvent<HTMLInputElement>) => void) | undefined;
    isSourceField: (fieldName: string) => boolean;
    isTargetField: (fieldName: string) => boolean;
    resetAll: () => void;
}

// Hook - useLinkedFields
// Manages multiple linked field pairs. Uses a Map to track manual edit state per target field.
export function useLinkedFields(options: UseLinkedFieldsOptions): UseLinkedFieldsReturn {
    // State - Map of target field names to manual edit state
    const [manualEditStates, setManualEditStates] = React.useState<Map<string, boolean>>(function () {
        return new Map();
    });

    // Ref for stable listener reference
    const manualEditStatesReference = React.useRef(manualEditStates);
    React.useEffect(
        function () {
            manualEditStatesReference.current = manualEditStates;
        },
        [manualEditStates],
    );

    // Build lookup maps for quick access
    const sourceToConfiguration = new Map<string, Omit<UseLinkedFieldOptions, 'form'>>();
    const targetToConfiguration = new Map<string, Omit<UseLinkedFieldOptions, 'form'>>();

    for(const linkedField of options.linkedFields) {
        sourceToConfiguration.set(linkedField.sourceField, linkedField);
        targetToConfiguration.set(linkedField.targetField, linkedField);
    }

    // Get listeners for a source field
    function getSourceFieldListeners(sourceField: string) {
        const fieldConfiguration = sourceToConfiguration.get(sourceField);
        if(!fieldConfiguration) return undefined;

        return {
            onChange: function (event: { value: unknown }) {
                const isManuallyEdited = manualEditStatesReference.current.get(fieldConfiguration.targetField) ?? false;
                if(isManuallyEdited) {
                    return;
                }
                if(typeof event.value === 'string') {
                    options.form.setFieldValue(
                        fieldConfiguration.targetField,
                        fieldConfiguration.transform(event.value),
                    );
                }
            },
        };
    }

    // Get onInput handler for a target field
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

    // Check if a field is a source field
    function isSourceField(fieldName: string) {
        return sourceToConfiguration.has(fieldName);
    }

    // Check if a field is a target field
    function isTargetField(fieldName: string) {
        return targetToConfiguration.has(fieldName);
    }

    // Reset all manual edit states
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
