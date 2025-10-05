'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ReactMarkdown from 'react-markdown';
import remarkCustomHeaderId from 'remark-custom-header-id';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { renderToString } from 'react-dom/server';
import { Link } from '@structure/source/common/navigation/Link';
import { CopyButton } from '@structure/source/common/buttons/CopyButton';

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
            className="mb-6 text-3xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5 first:before:hidden"
            {...properties}
        />
    ),
    h2: (properties) => (
        <h2
            className="mb-6 mt-6 text-2xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h3: (properties) => (
        <h3
            className="mb-6 mt-6 text-xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h4: (properties) => (
        <h4
            className="mb-6 mt-6 text-[18px] font-medium leading-[26px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h5: (properties) => (
        <h5
            className="text-[16px] font-medium leading-[28px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    p: (properties) => <p className="mt-6 text-[16px] font-light leading-[28px] first:mt-0" {...properties} />,
    strong: (properties) => <strong className="font-medium" {...properties} />,
    a: (properties: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Link href={properties.href ?? ''} className="underline" {...properties} />
    ),
    pre: (properties) => (
        <pre
            className="relative mb-6 rounded-medium border border-light-4 bg-light-2 p-5 text-sm dark:border-dark-4 dark:bg-dark"
            {...properties}
        >
            {properties.children}
            <span className="text-sans absolute right-3 top-3">
                <CopyButton className="" iconClassName="h-3.5 w-3.5" value={getInnerText(properties.children)} />
            </span>
        </pre>
    ),
    code: (properties) => (
        <code
            className="mb-6 whitespace-pre-wrap rounded border border-light-4 bg-light-2 px-1 py-px font-mono text-sm dark:border-dark-4 dark:bg-dark"
            {...properties}
        />
    ),
    ul: (properties) => <ul className="mb-6 mt-6 list-disc pl-[26px]" {...properties} />,
    ol: (properties) => <ol className="mb-6 mt-6 list-decimal pl-[26px]" {...properties} />,
    li: (properties) => (
        <li className="my-2 pl-1.5 text-[16px] font-light leading-[28px] [&>ol]:my-0 [&>ul]:my-0" {...properties} />
    ),
    blockquote: (properties) => (
        <blockquote className="border-l-2 border-light-6 pl-4 dark:border-neutral-4" {...properties} />
    ),
    hr: (properties) => <hr className="my-10 border-light-4 dark:border-dark-4" {...properties} />,
    table: (properties) => <table className="relative mb-6 mt-6 w-full overflow-auto rounded border" {...properties} />,
    thead: (properties) => <thead className="border-b bg-light-2 dark:bg-dark" {...properties} />,
    tbody: (properties) => <tbody className="" {...properties} />,
    tr: (properties) => <tr className="border-b border-light-4 last:border-b-0 dark:border-dark-4" {...properties} />,
    th: (properties) => (
        <th
            className="border-r border-light-4 px-4 py-2 text-[16px] font-medium leading-[28px] last:border-r-0 dark:border-dark-4"
            {...properties}
        />
    ),
    td: (properties) => (
        <td
            className="border-r border-light-4 px-4 py-2 text-[16px] font-light leading-[28px] last:border-r-0 dark:border-dark-4"
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
