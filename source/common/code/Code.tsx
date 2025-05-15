'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Code
export interface CodeProperties extends React.HTMLAttributes<HTMLDivElement> {
    code: string;
    setCode?: React.Dispatch<React.SetStateAction<string>>;
    language?: string;
    edit?: boolean;
    showLineNumbers?: boolean;
    loadLanguages?: { name: string; languageFunction: unknown }[];
}
/**
 * A code editor component that supports syntax highlighting and line numbers.
 * @param code The code to display.
 * @param setCode A function to set the code.
 * @param language The language of the code--supports shorthand, e.g., `js`. (default: `javascript`)
 * @param edit Whether the code is editable. (default: `false`)
 * @param showLineNumbers Whether to show line numbers. (default: `true`)
 * @param props Additional HTML attributes for the component container.
 * @example <CodeEditor code={code} setCode={setCode} language="jsx" edit={true} showLineNumbers={true} />
 */
export function Code({
    code,
    setCode,
    language = 'js',
    edit,
    showLineNumbers,
    loadLanguages,
    ...properties
}: CodeProperties) {
    // References
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Function to handle code change
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        if(setCode) setCode(event.target.value);
    }

    // Effect to handle tab key down
    React.useEffect(
        function () {
            if(setCode) {
                const handleKeyDown = function (event: KeyboardEvent) {
                    if(event.key === 'Tab') {
                        event.preventDefault();
                        const target = event.target as HTMLTextAreaElement;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;

                        const value = code;
                        if(setCode) setCode(value.substring(0, start) + '    ' + value.substring(end));

                        target.selectionStart = target.selectionEnd = start + 2;
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
                return () => document.removeEventListener('keydown', handleKeyDown);
            }
        },
        [code, setCode],
    );

    // Effect to load additional languages
    React.useLayoutEffect(
        function () {
            // Register additional languages
            if(loadLanguages) {
                loadLanguages.forEach((lang) => SyntaxHighlighter.registerLanguage(lang.name, lang.languageFunction));
            }
        },
        [loadLanguages],
    );

    // Effect to register languages
    React.useLayoutEffect(function () {
        SyntaxHighlighter.registerLanguage('jsx', jsx);
        SyntaxHighlighter.registerLanguage('typescript', typescript);
        SyntaxHighlighter.registerLanguage('ts', typescript);
    }, []);

    // Render the component
    return (
        <div
            {...properties}
            className={mergeClassNames(
                'relative h-max overflow-clip rounded border border-light/10 bg-dark-3 p-1.5 font-mono tracking-wide transition-all focus-within:outline focus-within:ring dark:bg-dark',
                properties.className,
            )}
        >
            <div className="absolute right-0 top-0 w-min rounded-bl bg-dark-6 px-1.5 py-0.5 text-xs dark:bg-dark-3">
                <p className="text-muted-foreground">{language.toUpperCase()}</p>
            </div>
            <div ref={scrollContainerRef} className="relative h-max overflow-auto">
                <div
                    className="inset-0 z-10 w-min text-light selection:bg-light/20 dark:selection:bg-light/10"
                    style={{
                        pointerEvents: edit ? 'none' : 'auto',
                        position: edit ? 'absolute' : 'static',
                    }}
                >
                    <SyntaxHighlighter
                        language={language}
                        style={nightOwl}
                        customStyle={{
                            padding: 0,
                            backgroundColor: 'transparent',
                            margin: 0,
                            fontFamily: 'inherit',
                            letterSpacing: 'inherit',
                            pointerEvents: edit ? 'none' : 'auto',
                            color: 'inherit',
                            lineHeight: 'inherit',
                            overflow: 'clip',
                        }}
                        codeTagProps={{
                            style: {
                                fontFamily: 'inherit',
                                letterSpacing: 'inherit',
                                lineHeight: 'inherit',
                            },
                        }}
                        lineNumberStyle={{
                            width: '2rem',
                            minWidth: '2rem',
                            margin: 0,
                            padding: 0,
                            textAlign: 'left',
                        }}
                        lineNumberContainerStyle={{
                            margin: 0,
                            padding: 0,
                            fontSize: 'inherit',
                            lineHeight: 'inherit',
                        }}
                        showLineNumbers={showLineNumbers ?? true}
                    >
                        {showLineNumbers ? (code.length === 0 ? ' ' : code) : code.length === 0 ? ' ' : code}
                    </SyntaxHighlighter>
                </div>

                {edit && (
                    <textarea
                        className="z-0 h-full w-full resize-none overflow-visible whitespace-pre rounded bg-transparent font-mono tracking-wide text-transparent caret-slate-100 selection:bg-slate-200/20 focus:outline-none focus:ring-0"
                        rows={code.split('\n').length}
                        style={{
                            marginLeft: showLineNumbers ?? true ? '2rem' : undefined,
                            overflow: 'hidden',
                            opacity: edit ? 1 : 0,
                            pointerEvents: edit ? 'auto' : 'none',
                            width: code.split('\n').reduce((max, line) => Math.max(max, line.length * 1.1), 0) + 'ch',
                            minWidth: '90%',
                        }}
                        spellCheck={false}
                        value={code}
                        onChange={handleChange}
                    />
                )}
            </div>
        </div>
    );
}

// Export - Default
export default Code;
