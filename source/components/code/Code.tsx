'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
 * @param properties Properties for the component
 * @example <CodeEditor code={code} setCode={setCode} language="jsx" edit={true} showLineNumbers={true} />
 */
export function Code({
    code,
    setCode,
    language: languageProperty,
    edit,
    showLineNumbers,
    loadLanguages,
    className,
    ...divProperties
}: CodeProperties) {
    // Extract all necessary properties with defaults
    const language = languageProperty || 'js';

    // References
    const scrollContainerReference = React.useRef<HTMLDivElement>(null);

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
                        if(setCode) setCode(code.substring(0, start) + '    ' + code.substring(end));

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
                loadLanguages.forEach((language) =>
                    SyntaxHighlighter.registerLanguage(language.name, language.languageFunction),
                );
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
            {...divProperties}
            className={mergeClassNames(
                'border-light/10 bg-dark-3 dark:bg-dark relative h-max overflow-clip rounded border p-1.5 font-mono tracking-wide transition-all focus-within:ring focus-within:outline',
                className,
            )}
        >
            <div className="absolute top-0 right-0 w-min rounded-bl px-1.5 py-0.5 text-xs">
                <p className="content--b">{language.toUpperCase()}</p>
            </div>
            <div ref={scrollContainerReference} className="relative h-max overflow-auto">
                <div
                    className="inset-0 z-10 w-min"
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
                        className="z-0 h-full w-full resize-none overflow-visible rounded bg-transparent font-mono tracking-wide whitespace-pre text-transparent caret-slate-100 selection:bg-slate-200/20 focus:ring-0 focus:outline-none"
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
