'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore, selectSuccesses } from '../useForm';
import { useFieldId } from '../providers/FormIdProvider';

// Dependencies - Main Components
import { Label } from '@radix-ui/react-label';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import type { ValidationResult } from '@structure/source/utilities/schema/Schema';

// Component - FormLabel
export interface FormLabelProperties<T extends HTMLElement> extends React.HTMLAttributes<T> {
    label: React.ReactNode;
    optional?: boolean;
    caption?: string;
    showSuccesses?: 'Always' | 'NonEmpty' | 'OnBlur' | 'OnBlurOrNonEmpty';
    children?: React.ReactNode;
}
export function FormLabel<T extends HTMLElement>(properties: FormLabelProperties<T>) {
    // Defaults
    const showTiming = properties.showSuccesses ?? 'BlurOrNonEmpty';

    // State - Store displayed errors and successes (preserved during validation)
    const [displayState, setDisplayState] = React.useState<{
        errors: ValidationResult[];
        successes: ValidationResult[];
    }>({
        errors: [],
        successes: [],
    });

    // Hooks
    const fieldContext = useFieldContext();
    const fieldId = useFieldId(fieldContext.name);

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
                setDisplayState(function (previousDisplayState) {
                    if(previousDisplayState.errors === newErrors && previousDisplayState.successes === newSuccesses) {
                        return previousDisplayState; // No change - prevent re-render
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
    const validErrors = displayState.errors?.filter((error): error is ValidationResult => error !== undefined);

    // Determine if we have errors to show
    const hasErrors = validErrors && validErrors.length > 0;

    // Determine if we should show successes based on timing prop
    let shouldShowSuccesses =
        showTiming === 'Always'
            ? true
            : showTiming === 'OnBlur'
              ? storeIsTouched
              : showTiming === 'NonEmpty'
                ? typeof storeValue === 'string'
                    ? storeValue.length > 0
                    : !!storeValue
                : showTiming === 'OnBlurOrNonEmpty'
                  ? storeIsTouched || (typeof storeValue === 'string' ? storeValue.length > 0 : !!storeValue)
                  : false;

    // Only show successes if there are no errors and we have successes to show
    shouldShowSuccesses = shouldShowSuccesses && !hasErrors && displayState.successes.length > 0;

    // Render the component
    return (
        <div className={mergeClassNames('flex w-full flex-col gap-2', properties.className)}>
            {/* Label */}
            <Label htmlFor={fieldId} className="inline-flex items-center justify-start gap-1 text-sm font-medium">
                {properties.label}{' '}
                {properties.optional && <span className="font-normal content--2 transition-colors">(Optional)</span>}
            </Label>

            {/* Form Element */}
            <div className="relative">{properties.children}</div>

            {/* Caption, Errors, and Successes */}
            <div className="text-xs content--1">
                {properties.caption && <p>{properties.caption}</p>}

                {/* Errors */}
                {hasErrors && (
                    <div className="flex flex-col gap-1">
                        {validErrors.map(function (error, index) {
                            return (
                                <p
                                    key={`error-${error.identifier}-${index}`}
                                    className="whitespace-pre-line text-red-500"
                                >
                                    {error.message}
                                </p>
                            );
                        })}
                    </div>
                )}

                {/* Successes (only show if no errors and interaction criteria met) */}
                {shouldShowSuccesses && (
                    <div className="flex flex-col gap-1">
                        {displayState.successes.map(function (success, index) {
                            return (
                                <p
                                    key={`success-${success.identifier}-${index}`}
                                    className="whitespace-pre-line text-green-600 dark:text-green-400"
                                >
                                    ✓ {success.message}
                                </p>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
