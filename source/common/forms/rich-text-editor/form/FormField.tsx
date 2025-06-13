import { Label } from '@radix-ui/react-label';
import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';

interface FormFieldProperties<T extends HTMLElement> extends React.HTMLAttributes<T> {
    label: string;
    optional?: boolean;
    caption?: string;
    error?: string;
    htmlFor?: string;
    children?: React.ReactNode;
}
export function FormField<T extends HTMLElement>(properties: FormFieldProperties<T>) {
    return (
        <div className={mergeClassNames('flex w-full flex-col gap-2', properties.className)}>
            {/* Label */}
            <Label
                // Default to the internalId if no id is provided
                htmlFor={properties.htmlFor}
                className="inline-flex items-center justify-start gap-1 text-sm font-medium"
            >
                {properties.label}{' '}
                {properties.optional && (
                    <span className="text-xs font-normal text-opsis-content-tetriary transition-colors">
                        (optional)
                    </span>
                )}
            </Label>

            {/* Form Element */}
            <div className="relative">{properties.children}</div>

            {/* Caption */}
            <div className="text-content-secondary text-xs">
                {properties.caption && <p>{properties.caption}</p>}
                {/* Error */}
                {properties.error && <p className="whitespace-pre-line text-red-500">{properties.error}</p>}
            </div>
        </div>
    );
}


