import React from 'react';
import { TextArea } from './TextArea';

import { textFieldVariants } from './TextField';
import { VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { FormField } from './FormField';

type TextAreaFieldProps = VariantProps<typeof textFieldVariants> &
    React.ComponentPropsWithoutRef<typeof TextArea> & {
        label: string;
        optional?: boolean;
        info?: string;
        caption?: string;
        error?: string;
        placeholder: string; // Enforce placeholder
    };

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
    ({ label, optional, info, caption, error, id, size, className, ...props }: TextAreaFieldProps, ref) => {
        const internalId = React.useId();

        return (
            <FormField label={label} optional={optional} caption={caption} error={error}>
                <TextArea
                    id={id ?? internalId}
                    size={size}
                    className={mergeClassNames(textFieldVariants({ size, className }))}
                    {...props}
                    ref={ref}
                />

                {/* InfoIcon */}
                {info && <div className="pointer-events-none absolute right-0 top-2 flex items-start pr-3">{info}</div>}
            </FormField>
        );
    },
);

TextAreaField.displayName = 'TextAreaField';

export { TextAreaField, type TextAreaFieldProps };
