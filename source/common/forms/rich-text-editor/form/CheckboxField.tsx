'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Checkbox } from './Checkbox';
import { cva } from 'class-variance-authority';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

const checkboxFieldVariants = cva([], {
    variants: {
        size: {
            small: 'text-sm font-',
            medium: '',
        },
    },
    defaultVariants: {
        size: 'small',
    },
});

// Component - CheckboxField
export interface CheckboxFieldProperties extends React.ComponentPropsWithoutRef<typeof Checkbox> {
    /** The label for the checkbox */
    label: string;
    /** Indicates if the field is optional */
    optional?: boolean;
    /** Additional information text below the field */
    caption?: string;
    /** Error message to display */
    error?: string;
    /** The layout direction of the checkbox and label */
    layout?: 'horizontal' | 'vertical';
}

export const CheckboxField = React.forwardRef<React.ElementRef<typeof Checkbox>, CheckboxFieldProperties>(function (
    properties: CheckboxFieldProperties,
    reference: React.Ref<React.ElementRef<typeof Checkbox>>,
) {
    const layout = properties.layout || 'horizontal';
    // Generate a unique ID for this checkbox if one isn't provided
    const internalId = React.useId();
    const checkboxId = properties.id ?? internalId;

    // Properties to spread onto the checkbox element
    const checkboxProperties = { ...properties } as Partial<CheckboxFieldProperties>;
    delete checkboxProperties.label;
    delete checkboxProperties.optional;
    delete checkboxProperties.caption;
    delete checkboxProperties.error;
    delete checkboxProperties.id;
    delete checkboxProperties.className;
    delete checkboxProperties.layout;

    return (
        <div className={mergeClassNames('flex w-full flex-col gap-2', properties.className)}>
            <div
                className={mergeClassNames(
                    'flex items-center gap-2',
                    layout === 'vertical' && 'flex-col',
                    layout === 'horizontal' && 'flex-row',
                )}
            >
                {/* Checkbox Control */}
                <Checkbox id={checkboxId} ref={reference} {...checkboxProperties} />

                {/* Label */}
                <label
                    htmlFor={checkboxId}
                    className={mergeClassNames(
                        'inline-flex items-center justify-start gap-1',
                        checkboxFieldVariants({ size: properties.size }),
                        'cursor-pointer', // Make label clickable
                    )}
                >
                    {properties.label}{' '}
                    {properties.optional && (
                        <span className="text-opsis-content-tetriary text-xs font-normal transition-colors">
                            (optional)
                        </span>
                    )}
                </label>
            </div>

            {/* Caption */}
            {(properties.caption || properties.error) && (
                <div className="text-content-secondary pl-6 text-xs">
                    {' '}
                    {/* Add left padding to align with label */}
                    {properties.caption && <p>{properties.caption}</p>}
                    {/* Error */}
                    {properties.error && <p className="whitespace-pre-line text-red-500">{properties.error}</p>}
                </div>
            )}
        </div>
    );
});

CheckboxField.displayName = 'CheckboxField';

export { checkboxFieldVariants };
