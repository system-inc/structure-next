'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Interface - UseLinkedFieldOptionsInterface
export interface UseLinkedFieldOptionsInterface<TFieldPath extends string = string> {
    form: { setFieldValue: (field: string, value: unknown) => void };
    sourceField: TFieldPath;
    targetField: TFieldPath;
    transform: (value: string) => string;
}

// Interface - UseLinkedFieldReturnInterface
export interface UseLinkedFieldReturnInterface {
    sourceFieldListeners: { onChange: (event: { value: unknown }) => void };
    targetFieldOnInput: (event: React.FormEvent<HTMLInputElement>) => void;
    isTargetManuallyEdited: boolean;
    resetManualEdit: () => void;
}

// Hook - useLinkedField
// Links a source field to a target field with a transform function.
// When the source field changes, the target field is updated with the transformed value.
// Manual edits to the target field disable auto-updates until the target is cleared.
export function useLinkedField<TFieldPath extends string = string>(
    options: UseLinkedFieldOptionsInterface<TFieldPath>,
): UseLinkedFieldReturnInterface {
    // State
    const [isTargetManuallyEdited, setIsTargetManuallyEdited] = React.useState(false);

    // Ref for stable listener reference
    const isTargetManuallyEditedReference = React.useRef(isTargetManuallyEdited);
    React.useEffect(
        function () {
            isTargetManuallyEditedReference.current = isTargetManuallyEdited;
        },
        [isTargetManuallyEdited],
    );

    // Source field listener - transforms and updates target
    const sourceFieldListeners = {
        onChange: function (event: { value: unknown }) {
            if(isTargetManuallyEditedReference.current) {
                return;
            }
            if(typeof event.value === 'string') {
                options.form.setFieldValue(options.targetField, options.transform(event.value));
            }
        },
    };

    // Target field input handler - tracks manual edits
    // If cleared, re-enable auto-generation
    function targetFieldOnInput(event: React.FormEvent<HTMLInputElement>) {
        const isEmpty = event.currentTarget.value.length === 0;
        setIsTargetManuallyEdited(!isEmpty);
    }

    // Reset function for programmatic control
    function resetManualEdit() {
        setIsTargetManuallyEdited(false);
    }

    return {
        sourceFieldListeners,
        targetFieldOnInput,
        isTargetManuallyEdited,
        resetManualEdit,
    };
}
