'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import { inputTextAreaTheme as structureInputTextAreaTheme } from './InputTextAreaTheme';
import type { InputTextAreaVariant, InputTextAreaSize, InputTextAreaResize } from './InputTextAreaTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - InputTextArea
export interface InputTextAreaProperties extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size'> {
    variant?: InputTextAreaVariant;
    size?: InputTextAreaSize;
    resize?: InputTextAreaResize;
}

function setBothReferences<T>(outerReference: React.ForwardedRef<T>, node: T) {
    if(typeof outerReference === 'function') {
        outerReference(node);
    }
    else if(outerReference && 'current' in outerReference) {
        (outerReference as React.MutableRefObject<T | null>).current = node;
    }
}

export const InputTextArea = React.forwardRef<HTMLTextAreaElement, InputTextAreaProperties>(function InputTextArea(
    { className, variant, size, resize, ...textAreaProperties },
    reference,
) {
    // Local ref so we can bind listeners without querying the DOM
    const localReference = React.useRef<HTMLTextAreaElement | null>(null);

    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge structure theme with project overrides
    const theme = mergeComponentTheme(structureInputTextAreaTheme, componentTheme?.InputTextArea);

    // Apply default variant/size/resize if not specified
    const finalVariant = variant ?? theme.configuration.defaultVariant?.variant;
    const finalSize = size ?? theme.configuration.defaultVariant?.size;
    const finalResize = resize ?? theme.configuration.defaultVariant?.resize;

    // Build className from theme
    const themeClassName = mergeClassNames(
        finalVariant && theme.variants[finalVariant],
        finalSize && theme.sizes[finalSize],
        finalResize && theme.resize[finalResize],
        className,
    );

    // Auto-resize handler without data-resize-id
    React.useEffect(
        function () {
            const textarea = localReference.current;
            if(!textarea || finalResize === 'none') return;

            const inputListener = function () {
                const scrollHeightAdjustment = 2;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight + scrollHeightAdjustment}px`;
            };

            // Resize on mount and on input
            inputListener();
            textarea.addEventListener('input', inputListener);
            return function () {
                textarea.removeEventListener('input', inputListener);
            };
        },
        [finalResize],
    );

    // Render the component
    return (
        <textarea
            ref={function (node) {
                localReference.current = node;
                setBothReferences(reference, node);
            }}
            className={themeClassName}
            {...textAreaProperties}
        />
    );
});

InputTextArea.displayName = 'InputTextArea';
