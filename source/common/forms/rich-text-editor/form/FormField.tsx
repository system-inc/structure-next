import { Label } from '@radix-ui/react-label';
import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';

interface FormFieldProps<T extends HTMLElement> extends React.HTMLAttributes<T> {
    label: string;
    optional?: boolean;
    caption?: string;
    error?: string;
    htmlFor?: string;
    children?: React.ReactNode;
}
const FormField = <T extends HTMLElement>({
    label,
    optional,
    caption,
    error,
    htmlFor,
    children,
    className,
}: FormFieldProps<T>) => {
    return (
        <div className={mergeClassNames('flex w-full flex-col gap-2', className)}>
            {/* Label */}
            <Label
                // Default to the internalId if no id is provided
                htmlFor={htmlFor}
                className="inline-flex items-center justify-start gap-1 text-sm font-medium"
            >
                {label}{' '}
                {optional && (
                    <span className="text-xs font-normal text-opsis-content-tetriary transition-colors">
                        (optional)
                    </span>
                )}
            </Label>

            {/* Form Element */}
            <div className="relative">{children}</div>

            {/* Caption */}
            <div className="text-content-secondary text-xs">
                {caption && <p>{caption}</p>}
                {/* Error */}
                {error && <p className="whitespace-pre-line text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export { FormField, type FormFieldProps };
