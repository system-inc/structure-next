'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CopyButton } from '@structure/source/common/buttons/CopyButton';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { renderToString } from 'react-dom/server';

// Dependencies - Styles
// import '@project/source/modules/chat/styles/night-owl.css';
// import '@project/source/modules/chat/styles/monokai.css';
import '@project/source/modules/chat/styles/phi.css';

// Function to get the inner text of a node
function getInnerText(node: React.ReactNode): string {
    if(typeof window === 'undefined') return '';

    const htmlString = renderToString(node);
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
}

// Function to convert text to an id anchor (e.g. "Hello World" to "hello-world")
function toAnchor(text: string): string {
    return (
        text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            // Trim - from start of text
            .replace(/^-+/, '')
            // Trim - from end of text
            .replace(/-+$/, '')
    );
}

interface ComponentsInterface {
    [key: string]: (properties: React.HTMLAttributes<HTMLElement>) => JSX.Element;
}
const components: ComponentsInterface = {
    h1: (properties) => (
        <h1
            id={toAnchor(getInnerText(properties.children))}
            className="mb-6 text-3xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h2: (properties) => (
        <h2
            id={toAnchor(getInnerText(properties.children))}
            className="mb-6 mt-6 text-2xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h3: (properties) => (
        <h3
            id={toAnchor(getInnerText(properties.children))}
            className="mb-6 mt-6 text-xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h4: (properties) => (
        <h4
            id={toAnchor(getInnerText(properties.children))}
            className="mb-6 mt-6 text-[18px] font-medium leading-[26px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    h5: (properties) => (
        <h5
            id={toAnchor(getInnerText(properties.children))}
            className="text-[16px] font-medium leading-[28px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5"
            {...properties}
        />
    ),
    p: (properties) => <p className="mt-6 text-[16px] font-light leading-[28px] first:mt-0" {...properties} />,
    strong: (properties) => <strong className="font-semibold" {...properties} />,
    a: (properties) => <a className="primary hover:underline" {...properties} />,
    pre: (properties) => (
        <pre className="relative mb-6 rounded-md p-5 text-sm dark:bg-dark" {...properties}>
            {properties.children}
            <span className="text-sans absolute right-3 top-3">
                <CopyButton className="" iconClassName="h-3.5 w-3.5" value={getInnerText(properties.children)} />
            </span>
        </pre>
    ),
    code: (properties) => (
        <code className="mb-6 whitespace-pre-wrap rounded px-1 py-px font-mono dark:bg-dark" {...properties} />
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
};

// Component - Markdown
export interface MarkdownInterface extends React.HTMLAttributes<HTMLDivElement> {
    children: string;
}
export function Markdown({ children, ...properties }: MarkdownInterface) {
    // Render the component
    return (
        <div className="max-w-3xl" {...properties}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    );
}

// Export - Default
export default Markdown;
