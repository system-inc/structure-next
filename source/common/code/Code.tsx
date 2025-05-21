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
 * @param properties Properties for the component
 * @example <CodeEditor code={code} setCode={setCode} language="jsx" edit={true} showLineNumbers={true} />
 */
export function Code(properties: CodeProperties) {
    // Extract all necessary properties with defaults
    const language = properties.language || 'js';

    // References
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Function to handle code change
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        if(properties.setCode) properties.setCode(event.target.value);
    }

    // Effect to handle tab key down
    const propertiesCode = properties.code;
    const propertiesSetCode = properties.setCode;
    React.useEffect(
        function () {
            if(propertiesSetCode) {
                const handleKeyDown = function (event: KeyboardEvent) {
                    if(event.key === 'Tab') {
                        event.preventDefault();
                        const target = event.target as HTMLTextAreaElement;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        if(propertiesSetCode)
                            propertiesSetCode(
                                propertiesCode.substring(0, start) + '    ' + propertiesCode.substring(end),
                            );

                        target.selectionStart = target.selectionEnd = start + 2;
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
                return () => document.removeEventListener('keydown', handleKeyDown);
            }
        },
        [propertiesCode, propertiesSetCode],
    );

    // Effect to load additional languages
    React.useLayoutEffect(
        function () {
            // Register additional languages
            if(properties.loadLanguages) {
                properties.loadLanguages.forEach((language) =>
                    SyntaxHighlighter.registerLanguage(language.name, language.languageFunction),
                );
            }
        },
        [properties.loadLanguages],
    );

    // Effect to register languages
    React.useLayoutEffect(function () {
        SyntaxHighlighter.registerLanguage('jsx', jsx);
        SyntaxHighlighter.registerLanguage('typescript', typescript);
        SyntaxHighlighter.registerLanguage('ts', typescript);
    }, []);

    // Clone properties for remaining HTML attributes
    const htmlProperties = { ...properties } as Partial<CodeProperties>;
    delete htmlProperties.code;
    delete htmlProperties.setCode;
    delete htmlProperties.language;
    delete htmlProperties.edit;
    delete htmlProperties.showLineNumbers;
    delete htmlProperties.loadLanguages;

    // Render the component
    return (
        <div
            {...htmlProperties}
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
                        pointerEvents: properties.edit ? 'none' : 'auto',
                        position: properties.edit ? 'absolute' : 'static',
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
                            pointerEvents: properties.edit ? 'none' : 'auto',
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
                        showLineNumbers={properties.showLineNumbers ?? true}
                    >
                        {properties.showLineNumbers
                            ? properties.code.length === 0
                                ? ' '
                                : properties.code
                            : properties.code.length === 0
                              ? ' '
                              : properties.code}
                    </SyntaxHighlighter>
                </div>

                {properties.edit && (
                    <textarea
                        className="z-0 h-full w-full resize-none overflow-visible whitespace-pre rounded bg-transparent font-mono tracking-wide text-transparent caret-slate-100 selection:bg-slate-200/20 focus:outline-none focus:ring-0"
                        rows={properties.code.split('\n').length}
                        style={{
                            marginLeft: properties.showLineNumbers ?? true ? '2rem' : undefined,
                            overflow: 'hidden',
                            opacity: properties.edit ? 1 : 0,
                            pointerEvents: properties.edit ? 'auto' : 'none',
                            width:
                                properties.code.split('\n').reduce((max, line) => Math.max(max, line.length * 1.1), 0) +
                                'ch',
                            minWidth: '90%',
                        }}
                        spellCheck={false}
                        value={properties.code}
                        onChange={handleChange}
                    />
                )}
            </div>
        </div>
    );
}
