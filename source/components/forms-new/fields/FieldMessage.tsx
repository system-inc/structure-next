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
    /**
     * Controls when success messages are displayed.
     *
     * - 'WhenChanged' (default): Only show successes when value differs from default value.
     *   Uses TanStack Form's `meta.isDefaultValue` - ideal for edit forms where you don't
     *   want to show "Valid!" on page load for existing data.
     * - 'Always': Always show successes after validation completes.
     * - 'NonEmpty': Show successes when field has a non-empty value.
     * - 'OnBlur': Show successes only after field has been blurred.
     * - 'OnBlurOrNonEmpty': Show successes on blur OR when field has a non-empty value.
     */
    showSuccesses?: 'WhenChanged' | 'Always' | 'NonEmpty' | 'OnBlur' | 'OnBlurOrNonEmpty';
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
    const storeIsDefaultValue = useStore(fieldContext.store, function (state) {
        return state.meta.isDefaultValue;
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

    // Check if value has changed from default (for 'WhenChanged' mode)
    // Uses TanStack Form's built-in isDefaultValue which compares current value to defaultValues
    const hasChangedFromDefault = storeIsDefaultValue === false;

    // Get the showSuccesses mode, defaulting to 'WhenChanged'
    const showSuccessesMode = properties.showSuccesses ?? 'WhenChanged';

    // Determine if we should show successes based on timing prop
    let shouldShowSuccesses =
        showSuccessesMode === 'Always'
            ? true
            : showSuccessesMode === 'WhenChanged'
              ? hasChangedFromDefault
              : showSuccessesMode === 'OnBlur'
                ? storeIsTouched
                : showSuccessesMode === 'NonEmpty'
                  ? typeof storeValue === 'string'
                      ? storeValue.length > 0
                      : !!storeValue
                  : showSuccessesMode === 'OnBlurOrNonEmpty'
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
