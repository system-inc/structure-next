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
    label: string;
    optional?: boolean;
    caption?: string;
    showSuccessesWhen?: 'Always' | 'Blur' | 'NonEmpty' | 'BlurOrNonEmpty';
    children?: React.ReactNode;
}
export function FormLabel<T extends HTMLElement>(properties: FormLabelProperties<T>) {
    // Get field context and subscribe to errors reactively
    const fieldContext = useFieldContext<unknown>();

    // Get field ID for htmlFor
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to errors reactively from field store
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // Subscribe to value for interaction detection
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });

    // Subscribe to touched state for interaction detection
    const storeTouched = useStore(fieldContext.store, function (state) {
        return state.meta.isTouched;
    });

    // Subscribe to successes reactively from field store
    const storeSuccesses = useStore(fieldContext.store, selectSuccesses);

    // Filter out undefined errors
    const validErrors = storeErrors?.filter((error): error is string => error !== undefined);

    // Determine if we should show successes based on timing prop
    const showTiming = properties.showSuccessesWhen ?? 'BlurOrNonEmpty';
    const shouldShowSuccesses =
        showTiming === 'Always'
            ? true
            : showTiming === 'Blur'
              ? storeTouched
              : showTiming === 'NonEmpty'
                ? typeof storeValue === 'string'
                    ? storeValue.length > 0
                    : !!storeValue
                : showTiming === 'BlurOrNonEmpty'
                  ? storeTouched || (typeof storeValue === 'string' ? storeValue.length > 0 : !!storeValue)
                  : false;

    return (
        <div className={mergeClassNames('flex w-full flex-col gap-2', properties.className)}>
            {/* Label */}
            <Label htmlFor={fieldId} className="inline-flex items-center justify-start gap-1 text-sm font-medium">
                {properties.label}{' '}
                {properties.optional && (
                    <span className="text-xs font-normal content--2 transition-colors">(Optional)</span>
                )}
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
                    storeSuccesses.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {storeSuccesses.map(function (success, index) {
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
