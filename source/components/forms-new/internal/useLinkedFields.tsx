'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { UseLinkedFieldOptionsInterface } from './useLinkedField';

// Type - Form interface that works with both narrowly and broadly typed setFieldValue
type FormWithLinkedFieldSupportType<TFormState> = {
    setFieldValue: (field: string, value: unknown) => void;
    state: TFormState;
};

// Interface - UseLinkedFieldsOptionsInterface
// TFormState is the full form state from TanStack Form, giving transform access to value, formApi, etc.
export interface UseLinkedFieldsOptionsInterface<TFieldPath extends string = string, TFormState = unknown> {
    form: FormWithLinkedFieldSupportType<TFormState>;
    linkedFields: Omit<UseLinkedFieldOptionsInterface<NoInfer<TFieldPath>, NoInfer<TFormState>>, 'form'>[];
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
export function useLinkedFields<TFieldPath extends string = string, TFormState = unknown>(
    options: UseLinkedFieldsOptionsInterface<TFieldPath, TFormState>,
): UseLinkedFieldsReturnInterface {
    // Type for linked field configuration with proper field type
    type LinkedFieldOptionsType = Omit<UseLinkedFieldOptionsInterface<TFieldPath, TFormState>, 'form'>;

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
    const sourceToConfiguration = new Map<string, LinkedFieldOptionsType>();
    const targetToConfiguration = new Map<string, LinkedFieldOptionsType>();

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
                // Handle both string and number values (for number inputs)
                if(typeof event.value === 'string' || typeof event.value === 'number') {
                    options.form.setFieldValue(
                        fieldConfiguration.targetField,
                        fieldConfiguration.transform(String(event.value), options.form.state),
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
