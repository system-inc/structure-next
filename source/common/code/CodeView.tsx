'use client';

import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Languages
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// ... other languages

// Component - CodeEditor
interface CodeEditorProperties extends React.HTMLAttributes<HTMLDivElement> {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    language: string;
    edit?: boolean;
    showLineNumbers?: boolean;
    loadLanguages?: { name: string; languageFunction: unknown }[];
}
const CodeEditor = (properties: CodeEditorProperties) => {
    // Extract properties
    const language = properties.language || 'js';

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        properties.setCode(event.target.value);
    }

    // Handle 'tab' key press
    const propertiesCode = properties.code;
    const propertiesSetCode = properties.setCode;
    React.useEffect(
        function () {
            function handleKeyDown(event: KeyboardEvent) {
                if(event.key === 'Tab') {
                    event.preventDefault();
                    const target = event.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;

                    propertiesSetCode(propertiesCode.substring(0, start) + '    ' + propertiesCode.substring(end));

                    target.selectionStart = target.selectionEnd = start + 2;
                }
            }

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        },
        [propertiesCode, propertiesSetCode],
    );

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

    // Register languages (defaults)
    React.useLayoutEffect(function () {
        SyntaxHighlighter.registerLanguage('jsx', jsx);
        SyntaxHighlighter.registerLanguage('typescript', typescript);
        SyntaxHighlighter.registerLanguage('ts', typescript);
    }, []);

    // Create a clone of properties for remaining HTML attributes
    const divElementProperties = { ...properties } as Partial<CodeEditorProperties>;
    delete divElementProperties.code;
    delete divElementProperties.setCode;
    delete divElementProperties.language;
    delete divElementProperties.edit;
    delete divElementProperties.showLineNumbers;
    delete divElementProperties.loadLanguages;

    return (
        <div
            {...divElementProperties}
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
                        style={materialDark}
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
};

export default CodeEditor;
