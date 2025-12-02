// Dependencies - Utilities
import { mergeClassNames } from '../../../../utilities/style/ClassName';

// Base Lexical Theme - Internal styling for editor content
// Variants can override specific properties by spreading this and merging
export const inputMarkupLexicalThemeBase = {
    ltr: '',
    rtl: '',
    paragraph: mergeClassNames('text-sm font-normal first:mt-0'),
    quote: mergeClassNames('border-l-2 border--3 pl-4'),
    heading: {
        h1: mergeClassNames('mb-6 text-3xl font-medium before:-mt-16 before:block before:h-16'),
        h2: mergeClassNames('mt-6 mb-6 text-2xl font-medium before:-mt-16 before:block before:h-16'),
        h3: mergeClassNames('mt-6 mb-6 text-xl font-medium before:-mt-16 before:block before:h-16'),
        h4: mergeClassNames('mt-6 mb-6 text-[18px] leading-[26px] font-medium before:-mt-16 before:block before:h-16'),
        h5: mergeClassNames('text-[16px] leading-7 font-medium before:-mt-16 before:block before:h-16'),
        h6: mergeClassNames('text-[16px] leading-7 font-medium'),
    },
    list: {
        nested: {
            listitem: mergeClassNames('my-2 pl-1.5 [&>ol]:my-0 [&>ul]:my-0'),
        },
        ol: mergeClassNames('mt-6 mb-6 list-decimal pl-[26px]'),
        ul: mergeClassNames('mt-6 mb-6 list-disc pl-[26px]'),
        listitem: mergeClassNames('my-2 pl-1.5 text-sm font-normal [&>ol]:my-0 [&>ul]:my-0'),
        listitemChecked: mergeClassNames('my-2 pl-1.5 text-sm font-normal'),
        listitemUnchecked: mergeClassNames('my-2 pl-1.5 text-sm font-normal'),
    },
    hashtag: mergeClassNames('text-blue-500'),
    image: mergeClassNames('h-auto max-w-full'),
    link: mergeClassNames('hover:underline'),
    text: {
        bold: mergeClassNames('font-medium'),
        code: mergeClassNames(
            'mb-6 rounded border border--3 background--2 px-1 py-px font-mono text-sm whitespace-pre-wrap',
        ),
        italic: mergeClassNames('italic'),
        strikethrough: mergeClassNames('line-through'),
        subscript: mergeClassNames('align-sub text-xs'),
        superscript: mergeClassNames('align-super text-xs'),
        underline: mergeClassNames('underline'),
        underlineStrikethrough: mergeClassNames('line-through'),
    },
    code: mergeClassNames('relative mb-6 rounded-md border border--3 background--2 p-5 text-sm'),
    codeHighlight: {
        atrule: mergeClassNames('text-blue-500'),
        attr: mergeClassNames('text-blue-400'),
        boolean: mergeClassNames('text-purple-600'),
        builtin: mergeClassNames('text-green-600'),
        cdata: mergeClassNames('content--2'),
        char: mergeClassNames('text-green-600'),
        class: mergeClassNames('text-yellow-500'),
        'class-name': mergeClassNames('text-yellow-500'),
        comment: mergeClassNames('content--2'),
        constant: mergeClassNames('text-purple-600'),
        deleted: mergeClassNames('text-red-600'),
        doctype: mergeClassNames('content--2'),
        entity: mergeClassNames('text-yellow-500'),
        function: mergeClassNames('text-yellow-500'),
        important: mergeClassNames('text-red-600'),
        inserted: mergeClassNames('text-green-600'),
        keyword: mergeClassNames('text-blue-500'),
        namespace: mergeClassNames('text-red-600'),
        number: mergeClassNames('text-purple-600'),
        operator: mergeClassNames('text-yellow-500'),
        prolog: mergeClassNames('content--2'),
        property: mergeClassNames('text-purple-600'),
        punctuation: mergeClassNames('content--2'),
        regex: mergeClassNames('text-red-600'),
        selector: mergeClassNames('text-green-600'),
        string: mergeClassNames('text-green-600'),
        symbol: mergeClassNames('text-purple-600'),
        tag: mergeClassNames('text-purple-600'),
        url: mergeClassNames('text-yellow-500'),
        variable: mergeClassNames('text-red-600'),
    },
};

// InputMarkup Variants Interface
export interface InputMarkupVariants {
    A: 'A'; // Card-like with shadow, good for standalone/chat use
    Outline: 'Outline'; // Border only, matches form field styling
}

// Type - InputMarkup Variant
export type InputMarkupVariant = keyof InputMarkupVariants;

// InputMarkup Sizes Interface
export interface InputMarkupSizes {
    Base: 'Base';
}

// Type - InputMarkup Size
export type InputMarkupSize = keyof InputMarkupSizes;

// Disabled styles - applied to container when disabled
// Note: Unlike native inputs, div containers don't support :disabled pseudo-class
// so we apply these conditionally via className
export const disabledStyleClassNames = 'cursor-not-allowed opacity-50';

// Type - InputMarkup Theme Configuration
export interface InputMarkupThemeConfiguration {
    variants: Record<
        InputMarkupVariant,
        {
            container: string;
            editor: string;
            placeholder: string;
            toolbar: string;
            lexical: typeof inputMarkupLexicalThemeBase;
        }
    >;
    sizes: Record<
        InputMarkupSize,
        {
            editor: string;
        }
    >;
    configuration: {
        defaultVariant: {
            variant?: InputMarkupVariant;
            size?: InputMarkupSize;
        };
        disabledClassNames: string;
    };
}

// InputMarkup Theme - Structure Default
export const inputMarkupTheme: InputMarkupThemeConfiguration = {
    variants: {
        // Variant A - Card-like appearance with shadow
        // Use for: Standalone editors, chat/messaging interfaces
        A: {
            container: mergeClassNames('rounded-2xl border border--0 background--0 p-0 shadow--0'),
            editor: mergeClassNames('px-5 pt-5 pb-3'),
            placeholder: mergeClassNames('top-5 left-5'),
            toolbar: mergeClassNames('px-3 pt-1 pb-3'),
            lexical: inputMarkupLexicalThemeBase,
        },

        // Variant Outline - Simple border, matches form inputs
        // Use for: Form fields, inline editing
        Outline: {
            container: mergeClassNames('rounded-lg border border--1'),
            editor: mergeClassNames('px-4 py-3'),
            placeholder: mergeClassNames('top-0 left-0 px-4 py-3'),
            toolbar: mergeClassNames('border-t border--2 px-1.5 py-1'),
            lexical: inputMarkupLexicalThemeBase,
        },
    },

    sizes: {
        Base: {
            editor: mergeClassNames('max-h-[65vh] min-h-24 text-sm'),
        },
    },

    configuration: {
        defaultVariant: {
            variant: 'Outline',
            size: 'Base',
        },
        disabledClassNames: disabledStyleClassNames,
    },
};
