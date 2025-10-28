'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Label } from '@radix-ui/react-label';

// Dependencies - Form Context
import { useFieldContext, useStore, selectSuccesses } from '../useForm';

// Dependencies - ID Utilities
import { useFieldId } from '../providers/FormIdProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
    const needsValueSubscription = showTiming === 'NonEmpty' || showTiming === 'OnBlurOrNonEmpty';

    // Hooks
    const fieldContext = useFieldContext<unknown>();
    const fieldId = useFieldId(fieldContext.name);
    const fieldStore = useStore(fieldContext.store, function (state) {
        return {
            errors: state.meta.errors,
            isValidating: state.meta.isValidating,
            isTouched: state.meta.isTouched,
            successes: selectSuccesses(state),
            value: needsValueSubscription ? state.value : undefined,
        };
    });

    // Filter out undefined errors
    const validErrors = fieldStore.errors?.filter((error): error is string => error !== undefined);

    // Determine if we should show successes based on timing prop
    const shouldShowSuccesses =
        showTiming === 'Always'
            ? true
            : showTiming === 'OnBlur'
              ? fieldStore.isTouched
              : showTiming === 'NonEmpty'
                ? typeof fieldStore.value === 'string'
                    ? fieldStore.value.length > 0
                    : !!fieldStore.value
                : showTiming === 'OnBlurOrNonEmpty'
                  ? fieldStore.isTouched ||
                    (typeof fieldStore.value === 'string' ? fieldStore.value.length > 0 : !!fieldStore.value)
                  : false;

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
                {validErrors && validErrors.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {validErrors.map(function (error, index) {
                            return (
                                <p key={index} className="whitespace-pre-line text-red-500">
                                    {error}
                                </p>
                            );
                        })}
                    </div>
                )}

                {/* Successes (only show if no errors and interaction criteria met) */}
                {shouldShowSuccesses &&
                    (!validErrors || validErrors.length === 0) &&
                    fieldStore.successes.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {fieldStore.successes.map(function (success, index) {
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
