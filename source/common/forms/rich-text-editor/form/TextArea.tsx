// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { cva, VariantProps } from 'class-variance-authority';

const textAreaVariants = cva(
    [
        // Base
        'bg-opsis-background-tetriary border border-opsis-border-primary placeholder:text-opsis-content-placeholder transition-colors w-full resize-vertical shadow-01 rounded-small',
        // Hover
        'hover:border-opsis-border-tetriary',
        // Active
        'active:border-action-secondary-pressed',
        // Focus
        'focus-visible:border-opsis-action-secondary-pressed focus-visible:outline-none',
    ], // Defaults
    {
        variants: {
            size: {
                large: ['px-3 py-2.5'],
            },
            resize: {
                none: ['resize-none'],
                vertical: ['resize-vertical'],
                horizontal: ['resize-horizontal'],
                both: ['resize'],
            },
        },
        defaultVariants: {
            size: 'large',
            resize: 'vertical',
        },
    },
);

// Component - TextArea
type TextAreaProperties = React.ComponentPropsWithoutRef<'textarea'> & VariantProps<typeof textAreaVariants>;
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProperties>(function (properties, reference) {
    const resizeId = React.useId();

    // Create an event handler to resize the textarea to the size of the content unless the resize value is none
    React.useEffect(
        function () {
            const textarea = document.querySelector(`[data-resize-id="${resizeId}"]`) as HTMLTextAreaElement | null;
            if(!textarea || properties.resize === 'none') return;
            const inputListener = () => {
                const scrollHeightAdjustment = 2;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight + scrollHeightAdjustment}px`;
            };
            textarea.addEventListener('input', inputListener);
            return () => textarea.removeEventListener('input', inputListener);
        },
        [resizeId, properties.resize],
    );

    // Get the properties to spread onto the textarea element
    const textAreaProperties = { ...properties };
    delete textAreaProperties.className;
    delete textAreaProperties.size;
    delete textAreaProperties.resize;

    // Render the component
    return (
        <textarea
            data-resize-id={resizeId}
            ref={reference}
            className={mergeClassNames(
                textAreaVariants({
                    className: properties.className,
                    size: properties.size,
                    resize: properties.resize,
                }),
            )}
            {...textAreaProperties}
        />
    );
});

TextArea.displayName = 'TextArea';

// Export
export { TextArea, type TextAreaProperties as TextAreaProps };
