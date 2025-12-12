'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ReactMarkdown from 'react-markdown';
import remarkCustomHeaderId from 'remark-custom-header-id';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { renderToString } from 'react-dom/server';
import { Link } from '@structure/source/components/navigation/Link';
import { CopyButton } from '@structure/source/components/buttons/CopyButton';
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';

// Dependencies - Utilities
import { rehypeCustomFootnoteIds } from '@structure/source/components/markdown/utilities/MarkdownUtilities';

// Function to get the inner text of a node
function getInnerText(reactNode: React.ReactNode): string {
    if(typeof window === 'undefined') return '';

    const htmlString = renderToString(reactNode);
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
}

// Helper to strip the `node` prop that react-markdown passes (causes [object Object] in HTML)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function elementProperties<T extends Record<string, any>>(properties: T): Omit<T, 'node'> {
    // eslint-disable-next-line
    const { node, ...remainingProperties } = properties;
    return remainingProperties;
}

const components = {
    h1: (properties: React.ComponentProps<'h1'>) => (
        <h1
            className="mb-6 text-3xl font-medium before:-mt-16 before:block before:h-16 first:before:hidden"
            {...elementProperties(properties)}
        />
    ),
    h2: (properties: React.ComponentProps<'h2'>) => (
        <h2
            className="mt-6 mb-6 text-2xl font-medium before:-mt-16 before:block before:h-16"
            {...elementProperties(properties)}
        />
    ),
    h3: (properties: React.ComponentProps<'h3'>) => (
        <h3
            className="mt-6 mb-6 text-xl font-medium before:-mt-16 before:block before:h-16"
            {...elementProperties(properties)}
        />
    ),
    h4: (properties: React.ComponentProps<'h4'>) => (
        <h4
            className="mt-6 mb-6 text-[18px] leading-[26px] font-medium before:-mt-16 before:block before:h-16"
            {...elementProperties(properties)}
        />
    ),
    h5: (properties: React.ComponentProps<'h5'>) => (
        <h5
            className="text-[16px] leading-7 font-medium before:-mt-16 before:block before:h-16"
            {...elementProperties(properties)}
        />
    ),
    p: (properties: React.ComponentProps<'p'>) => (
        <p className="mt-6 text-[16px] leading-7 first:mt-0" {...elementProperties(properties)} />
    ),
    strong: (properties: React.ComponentProps<'strong'>) => (
        <strong className="font-medium" {...elementProperties(properties)} />
    ),
    a: (properties: React.ComponentProps<'a'>) => (
        <Link href={properties.href ?? ''} className="underline" {...elementProperties(properties)} />
    ),
    pre: (properties: React.ComponentProps<'pre'>) => (
        <pre
            className="relative mt-6 mb-6 rounded-md border border--3 background--2 p-4 text-sm first:mt-0"
            {...elementProperties(properties)}
        >
            {properties.children}
            <span className="absolute top-3 right-3 font-sans">
                <CopyButton className="" value={getInnerText(properties.children)} />
            </span>
        </pre>
    ),
    code: (properties: React.ComponentProps<'code'>) => (
        // Inline code styling - the [pre_&] variant removes styles when inside a <pre>
        <code
            className="rounded border border--3 background--2 px-1 py-px font-mono text-sm in-[pre]:rounded-none in-[pre]:border-0 in-[pre]:bg-transparent in-[pre]:p-0 in-[pre]:whitespace-pre-wrap"
            {...elementProperties(properties)}
        />
    ),
    ul: (properties: React.ComponentProps<'ul'>) => (
        <ul className="mt-6 mb-6 list-disc pl-[26px]" {...elementProperties(properties)} />
    ),
    ol: (properties: React.ComponentProps<'ol'>) => (
        <ol className="mt-6 mb-6 list-decimal pl-[26px]" {...elementProperties(properties)} />
    ),
    li: (properties: React.ComponentProps<'li'>) => (
        <li className="my-2 pl-1.5 text-[16px] leading-7 [&>ol]:my-0 [&>ul]:my-0" {...elementProperties(properties)} />
    ),
    blockquote: (properties: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-2 border--3 pl-4" {...elementProperties(properties)} />
    ),
    hr: () => <HorizontalRule className="my-10" />,
    table: (properties: React.ComponentProps<'table'>) => (
        <div className="relative mt-6 mb-6 w-full overflow-hidden rounded-lg border border--0">
            <table className="w-full" {...elementProperties(properties)} />
        </div>
    ),
    thead: (properties: React.ComponentProps<'thead'>) => (
        <thead className="border-b border--0 background--1" {...elementProperties(properties)} />
    ),
    tbody: (properties: React.ComponentProps<'tbody'>) => <tbody className="" {...elementProperties(properties)} />,
    tr: (properties: React.ComponentProps<'tr'>) => (
        <tr className="border-b border--0 last:border-b-0" {...elementProperties(properties)} />
    ),
    th: (properties: React.ComponentProps<'th'>) => (
        <th
            className="border-r border--0 px-4 py-2 text-left text-base font-medium last:border-r-0"
            {...elementProperties(properties)}
        />
    ),
    td: (properties: React.ComponentProps<'td'>) => (
        <td
            className="border-r border--0 px-4 py-2 text-base font-light last:border-r-0"
            {...elementProperties(properties)}
        />
    ),
};

// Component - Markdown
export interface MarkdownProperties extends React.HTMLAttributes<HTMLDivElement> {
    children: string;
}
export function Markdown({ children, ...divProperties }: MarkdownProperties) {
    // Render the component
    return (
        <div className="max-w-3xl" {...divProperties}>
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight, rehypeCustomFootnoteIds]}
                remarkPlugins={[remarkCustomHeaderId, remarkGfm]}
                remarkRehypeOptions={{
                    clobberPrefix: 'citation-',
                    footnoteLabel: 'Sources',
                }}
                components={components}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
