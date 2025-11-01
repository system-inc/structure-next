'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore, selectSuccesses } from '../useForm';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import type { ValidationResult } from '@structure/source/utilities/schema/Schema';

// Component - FieldMessage
export interface FieldMessageProperties extends React.HTMLAttributes<HTMLDivElement> {
    showSuccesses?: 'Always' | 'NonEmpty' | 'OnBlur' | 'OnBlurOrNonEmpty';
    header?: React.ReactNode;
    children?: React.ReactNode;
}
export function FieldMessage(properties: FieldMessageProperties) {
    // State - Store displayed errors and successes (preserved during validation)
    const [validationResults, setValidationResults] = React.useState<{
        errors: ValidationResult[];
        successes: ValidationResult[];
    }>({
        errors: [],
        successes: [],
    });

    // Hooks
    const fieldContext = useFieldContext();

    // Subscribe to individual meta properties (only what we need for rendering logic)
    const storeIsValidating = useStore(fieldContext.store, function (state) {
        return state.meta.isValidating;
    });
    const storeIsTouched = useStore(fieldContext.store, function (state) {
        return state.meta.isTouched;
    });
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });

    // Effects - Update displayed state only when validation completes
    React.useEffect(
        function () {
            if(!storeIsValidating) {
                // Validation complete - read latest errors/successes from store
                const currentState = fieldContext.store.state;
                const newErrors = currentState.meta.errors ?? [];
                const newSuccesses = selectSuccesses(currentState) ?? [];

                // Only update if errors or successes actually changed (avoid unnecessary re-render)
                setValidationResults(function (previousValidationResults) {
                    if(
                        previousValidationResults.errors === newErrors &&
                        previousValidationResults.successes === newSuccesses
                    ) {
                        return previousValidationResults; // No change - prevent re-render
                    }
                    return {
                        errors: newErrors,
                        successes: newSuccesses,
                    };
                });
            }
            // During validation - keep showing previous errors and successes (no update)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [storeIsValidating], // Only re-run when validation state changes (intentionally omit errors/successes)
    );

    // Filter out undefined errors
    const validErrors = validationResults.errors?.filter((error): error is ValidationResult => error !== undefined);

    // Determine if we have errors to show
    const hasErrors = validErrors && validErrors.length > 0;

    // Determine if we should show successes based on timing prop
    let shouldShowSuccesses =
        properties.showSuccesses === 'Always'
            ? true
            : properties.showSuccesses === 'OnBlur'
              ? storeIsTouched
              : properties.showSuccesses === 'NonEmpty'
                ? typeof storeValue === 'string'
                    ? storeValue.length > 0
                    : !!storeValue
                : properties.showSuccesses === 'OnBlurOrNonEmpty'
                  ? storeIsTouched || (typeof storeValue === 'string' ? storeValue.length > 0 : !!storeValue)
                  : false;

    // Only show successes if there are no errors and we have successes to show
    shouldShowSuccesses = shouldShowSuccesses && !hasErrors && validationResults.successes.length > 0;

    // Render the component
    return (
        <div className={mergeClassNames('text-xs', properties.className)}>
            {/* Header */}
            {properties.header && properties.header}

            {/* Errors */}
            {hasErrors && (
                <div className="flex flex-col gap-1">
                    {validErrors.map(function (error, index) {
                        return (
                            <p key={`error-${error.identifier}-${index}`} className="content--negative">
                                {error.message}
                            </p>
                        );
                    })}
                </div>
            )}

            {/* Successes (only show if no errors and interaction criteria met) */}
            {shouldShowSuccesses && (
                <div className="flex flex-col gap-1">
                    {validationResults.successes.map(function (success, index) {
                        return (
                            <p key={`success-${success.identifier}-${index}`} className="content--positive">
                                ✓ {success.message}
                            </p>
                        );
                    })}
                </div>
            )}

            {/* Children */}
            {properties.children}
        </div>
    );
}
