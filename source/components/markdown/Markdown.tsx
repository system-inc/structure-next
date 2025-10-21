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

// Dependencies - Styles
// import '@project/app/_modules/chat/styles/night-owl.css';
// import '@project/app/_modules/chat/styles/monokai.css';
// import '@project/app/_modules/chat/styles/phi.css';

// Function to get the inner text of a node
function getInnerText(node: React.ReactNode): string {
    if(typeof window === 'undefined') return '';

    const htmlString = renderToString(node);
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
}

interface ComponentsProperties {
    [key: string]: (properties: React.HTMLAttributes<HTMLElement>) => React.JSX.Element;
}
const components: ComponentsProperties = {
    h1: (properties) => (
        <h1
            className="before:-mt-phi-base-2.5 before:h-phi-base-2.5 mb-6 text-3xl font-medium before:block first:before:hidden"
            {...properties}
        />
    ),
    h2: (properties) => (
        <h2
            className="before:-mt-phi-base-2.5 before:h-phi-base-2.5 mt-6 mb-6 text-2xl font-medium before:block"
            {...properties}
        />
    ),
    h3: (properties) => (
        <h3
            className="before:-mt-phi-base-2.5 before:h-phi-base-2.5 mt-6 mb-6 text-xl font-medium before:block"
            {...properties}
        />
    ),
    h4: (properties) => (
        <h4
            className="before:-mt-phi-base-2.5 before:h-phi-base-2.5 mt-6 mb-6 text-[18px] leading-[26px] font-medium before:block"
            {...properties}
        />
    ),
    h5: (properties) => (
        <h5
            className="before:-mt-phi-base-2.5 before:h-phi-base-2.5 text-[16px] leading-[28px] font-medium before:block"
            {...properties}
        />
    ),
    p: (properties) => <p className="mt-6 text-[16px] leading-[28px] first:mt-0" {...properties} />,
    strong: (properties) => <strong className="font-medium" {...properties} />,
    a: (properties: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Link href={properties.href ?? ''} className="underline" {...properties} />
    ),
    pre: (properties) => (
        <pre
            className="border-light-4 bg-light-2 dark:border-dark-4 dark:bg-dark relative mb-6 rounded-md border p-5 text-sm"
            {...properties}
        >
            {properties.children}
            <span className="text-sans absolute top-3 right-3">
                <CopyButton className="" value={getInnerText(properties.children)} />
            </span>
        </pre>
    ),
    code: (properties) => (
        <code
            className="border-light-4 bg-light-2 dark:border-dark-4 dark:bg-dark mb-6 rounded border px-1 py-px font-mono text-sm whitespace-pre-wrap"
            {...properties}
        />
    ),
    ul: (properties) => <ul className="mt-6 mb-6 list-disc pl-[26px]" {...properties} />,
    ol: (properties) => <ol className="mt-6 mb-6 list-decimal pl-[26px]" {...properties} />,
    li: (properties) => (
        <li className="my-2 pl-1.5 text-[16px] leading-[28px] [&>ol]:my-0 [&>ul]:my-0" {...properties} />
    ),
    blockquote: (properties) => (
        <blockquote className="border-light-6 dark:border-neutral-4 border-l-2 pl-4" {...properties} />
    ),
    hr: (properties) => <hr className="border-light-4 dark:border-dark-4 my-10" {...properties} />,
    table: (properties) => (
        <table className="relative mt-6 mb-6 w-full overflow-auto rounded border border--a" {...properties} />
    ),
    thead: (properties) => <thead className="bg-light-2 dark:bg-dark border-b" {...properties} />,
    tbody: (properties) => <tbody className="" {...properties} />,
    tr: (properties) => <tr className="border-light-4 dark:border-dark-4 border-b last:border-b-0" {...properties} />,
    th: (properties) => (
        <th
            className="border-light-4 dark:border-dark-4 border-r px-4 py-2 text-[16px] leading-[28px] font-medium last:border-r-0"
            {...properties}
        />
    ),
    td: (properties) => (
        <td
            className="border-light-4 dark:border-dark-4 border-r px-4 py-2 text-[16px] leading-[28px] font-light last:border-r-0"
            {...properties}
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
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkCustomHeaderId, remarkGfm]}
                components={components}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
