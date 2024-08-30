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
import '@structure/source/common/markdown/styles/markdown.css';

// Function to get the inner text of a node
function getInnerText(node: React.ReactNode): string {
    const htmlString = renderToString(node);
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
}

interface ComponentsInterface {
    [key: string]: (properties: React.HTMLAttributes<HTMLElement>) => JSX.Element;
}
const components: ComponentsInterface = {
    h1: (properties) => <h1 className="mb-4 text-2xl font-medium" {...properties} />,
    h2: (properties) => <h2 className="mb-3 mt-4 text-xl font-medium" {...properties} />,
    h3: (properties) => <h3 className="mb-4 mt-4 text-[1.1rem] font-medium" {...properties} />,
    h4: (properties) => <h4 className="mb-4 mt-4 text-[1.1rem] font-medium" {...properties} />,
    h5: (properties) => <h5 className="text-base font-medium" {...properties} />,
    p: (properties) => <p className="mt-4 text-[14px]" {...properties} />,
    strong: (properties) => <strong className="font-semibold" {...properties} />,
    a: (properties) => <a className="primary hover:underline" {...properties} />,
    pre: (properties) => (
        <pre className="relative mb-4 rounded-md p-4 text-sm dark:bg-dark" {...properties}>
            {properties.children}
            <span className="text-sans absolute right-3 top-3">
                <CopyButton className="" iconClassName="h-3.5 w-3.5" value={getInnerText(properties.children)} />
            </span>
        </pre>
    ),
    code: (properties) => (
        <code className="mb-4 whitespace-pre-wrap rounded px-1 py-px font-mono dark:bg-dark" {...properties} />
    ),
    ul: (properties) => <ul className="mb-4 ml-4 mt-4 list-disc pl-4" {...properties} />,
    ol: (properties) => <ol className="mb-4 mt-4 list-decimal pl-7" {...properties} />,
    li: (properties) => <li className="text-[14px]" {...properties} />,
    blockquote: (properties) => (
        <blockquote className="border-l-2 border-light-6 pl-4 dark:border-neutral-4" {...properties} />
    ),
    hr: (properties) => <hr className="my-8 border-light-4 dark:border-dark-4" {...properties} />,
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
