import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';

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

type TextAreaProps = React.ComponentPropsWithoutRef<'textarea'> & VariantProps<typeof textAreaVariants>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, size, resize, ...props }, ref) => {
    const resizeId = React.useId();

    // Create an event handler to resize the textarea to the size of the content unless the resize value is none
    React.useEffect(() => {
        const textarea = document.querySelector(`[data-resize-id="${resizeId}"]`) as HTMLTextAreaElement | null;
        if(!textarea || resize === 'none') return;
        const inputListener = () => {
            const scrollHeightAdjustment = 2;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + scrollHeightAdjustment}px`;
        };
        textarea.addEventListener('input', inputListener);
        return () => textarea.removeEventListener('input', inputListener);
    }, [resizeId, resize]);

    return (
        <textarea
            data-resize-id={resizeId}
            ref={ref}
            className={mergeClassNames(textAreaVariants({ className, size, resize }))}
            {...props}
        />
    );
});

TextArea.displayName = 'TextArea';

export { TextArea, type TextAreaProps };
