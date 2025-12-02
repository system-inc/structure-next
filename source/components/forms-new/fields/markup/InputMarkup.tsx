'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Lexical
import { $getEditor, $getRoot, $insertNodes, EditorState, LexicalEditor } from 'lexical';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/extension';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

// Dependencies - Lexical Components
import { LexicalToolbarPlugin } from './lexical/LexicalToolbarPlugin';
import { LexicalResetPlugin } from './lexical/LexicalResetPlugin';
import { LexicalImperativeHandle, InputMarkupReferenceInterface } from './lexical/LexicalImperativeHandle';

// Dependencies - Theme
import { inputMarkupTheme, InputMarkupVariant, InputMarkupMode } from './InputMarkupTheme';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Catch any errors that occur during Lexical updates
function onError(error: Error) {
    console.error(error);
}

// Interface - InputMarkupToolbarProperties
export interface InputMarkupToolbarProperties {
    show?: boolean; // Default: true
    showFormatting?: boolean; // Default: true
    showHistory?: boolean; // Default: true
    showAttachments?: boolean; // Default: false
    showSubmit?: boolean; // Default: false
    submitLabel?: string;
    submitLoadingLabel?: string;
    onSubmit?: () => void;
}

// Interface - InputMarkupProperties
export interface InputMarkupProperties {
    // Content
    type: 'Markdown' | 'Html' | 'Json';
    defaultValue?: string;
    onChange?: ({ markdown, json, html }: { markdown: string; html: string; json: string }) => void;

    // Visual
    id?: string;
    variant?: InputMarkupVariant;
    className?: string;
    placeholder?: string;
    disabled?: boolean;

    // Mode - Source (raw markdown) vs Visual (rich text), both editable
    defaultMode?: InputMarkupMode;
    onModeChange?: (mode: InputMarkupMode) => void;

    // Accessibility - For contenteditable, use aria-labelledby instead of label's htmlFor
    ariaLabelledBy?: string;

    // Toolbar
    toolbar?: InputMarkupToolbarProperties;

    // File attachments (only relevant if toolbar.showAttachments is true)
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;

    // Loading/reset
    isLoading?: boolean;
    shouldReset?: boolean;
    onResetComplete?: () => void;
}

// Component - InputMarkup
export const InputMarkup = React.forwardRef<InputMarkupReferenceInterface, InputMarkupProperties>(
    function InputMarkup(properties, reference) {
        // Apply theme defaults
        const variant = properties.variant ?? inputMarkupTheme.configuration.defaultVariant.variant ?? 'Outline';

        // Get theme styles
        const variantStyles = inputMarkupTheme.variants[variant];
        const sizeStyles = inputMarkupTheme.sizes.Base;

        // Mode state - Source (raw markdown) vs Visual (rich text)
        const [mode, setMode] = React.useState<InputMarkupMode>(properties.defaultMode ?? 'Visual');

        // Source mode content - synced with Lexical when toggling
        const [sourceContent, setSourceContent] = React.useState<string>(properties.defaultValue ?? '');

        // Reference to the internal Lexical imperative handle
        const lexicalReference = React.useRef<InputMarkupReferenceInterface>(null);

        // Reference to the source textarea for focus
        const textareaReference = React.useRef<HTMLTextAreaElement>(null);

        // Reference to the Visual mode editor container for height sync
        const visualContainerReference = React.useRef<HTMLDivElement>(null);

        // Expose combined imperative handle that routes based on current mode
        React.useImperativeHandle(
            reference,
            function () {
                return {
                    setContent(content: string) {
                        // Update both - source state and Lexical
                        setSourceContent(content);
                        lexicalReference.current?.setContent(content);
                    },
                    getContent() {
                        // Return content from active mode
                        if(mode === 'Source') {
                            return sourceContent;
                        }
                        return lexicalReference.current?.getContent() ?? '';
                    },
                    clear() {
                        setSourceContent('');
                        lexicalReference.current?.clear();
                    },
                    focus() {
                        if(mode === 'Source') {
                            textareaReference.current?.focus();
                        }
                        else {
                            lexicalReference.current?.focus();
                        }
                    },
                };
            },
            [mode, sourceContent],
        );

        // Function to handle mode toggle
        function handleModeChange(newMode: InputMarkupMode) {
            if(newMode === mode) return;

            // Capture current height before switching
            let currentHeight: number | null = null;
            if(mode === 'Source' && textareaReference.current) {
                currentHeight = textareaReference.current.offsetHeight;
            }
            else if(mode === 'Visual' && visualContainerReference.current) {
                currentHeight = visualContainerReference.current.offsetHeight;
            }

            // Sync content between modes
            if(newMode === 'Source') {
                // Switching to Source: get markdown from Lexical
                const markdown = lexicalReference.current?.getContent() ?? '';
                setSourceContent(markdown);

                // Apply height to textarea after state update
                if(currentHeight !== null) {
                    requestAnimationFrame(function () {
                        if(textareaReference.current) {
                            textareaReference.current.style.height = `${currentHeight}px`;
                        }
                    });
                }
            }
            else {
                // Switching to Visual: set Lexical content from source
                lexicalReference.current?.setContent(sourceContent);

                // Apply height to visual container after state update
                if(currentHeight !== null) {
                    requestAnimationFrame(function () {
                        if(visualContainerReference.current) {
                            visualContainerReference.current.style.height = `${currentHeight}px`;
                        }
                    });
                }
            }

            setMode(newMode);
            properties.onModeChange?.(newMode);
        }

        // Function to handle source textarea changes
        function handleSourceChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
            const value = event.target.value;
            setSourceContent(value);

            // Auto-resize textarea to fit content (clear fixed height from mode sync)
            const textarea = event.target;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;

            // Emit change event with all formats (markdown is the source, derive others)
            properties.onChange?.({
                markdown: value,
                html: '', // Could parse markdown to HTML if needed
                json: '', // Not applicable in source mode
            });
        }

        // Clear fixed height on Visual container when Lexical content changes
        function handleOnChangeWithHeightReset(editorState: EditorState, editor: LexicalEditor) {
            // Clear any fixed height so container can grow with content
            if(visualContainerReference.current) {
                visualContainerReference.current.style.height = '';
            }

            editorState.read(function () {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                const html = $generateHtmlFromNodes(editor, null);
                const json = JSON.stringify(editorState.toJSON());
                properties.onChange?.({ markdown, html, json });
            });
        }

        // Auto-resize textarea when content changes externally (e.g., mode switch)
        React.useEffect(
            function () {
                const textarea = textareaReference.current;
                if(textarea && mode === 'Source') {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
                }
            },
            [mode, sourceContent],
        );

        // Lexical configuration
        const initialConfiguration: InitialConfigType = {
            namespace: 'InputMarkup',
            theme: variantStyles.lexical,
            onError,
            nodes: [HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, HeadingNode, QuoteNode],
            editorState: function () {
                if(properties.defaultValue) {
                    if(properties.type === 'Markdown') {
                        $convertFromMarkdownString(properties.defaultValue, TRANSFORMERS);
                    }
                    else if(properties.type === 'Html') {
                        const editor = $getEditor();
                        const parser = new DOMParser();
                        const dom = parser.parseFromString(properties.defaultValue, 'text/html');
                        const nodes = $generateNodesFromDOM(editor, dom);
                        $getRoot().select();
                        $insertNodes(nodes);
                    }
                    else if(properties.type === 'Json') {
                        $getRoot().updateFromJSON(JSON.parse(properties.defaultValue));
                    }
                    $getRoot().selectEnd();
                    return;
                }
            },
        };

        // Determine if toolbar should be shown
        const showToolbar = properties.toolbar?.show !== false;

        // Render the component
        return (
            <div
                className={mergeClassNames(
                    'flex flex-col items-stretch overflow-clip',
                    variantStyles.container,
                    properties.disabled && inputMarkupTheme.configuration.disabledClassNames,
                    properties.className,
                )}
            >
                {/* Source mode - raw markdown textarea */}
                <textarea
                    ref={textareaReference}
                    id={mode === 'Source' ? properties.id : undefined}
                    aria-labelledby={properties.ariaLabelledBy}
                    value={sourceContent}
                    onChange={handleSourceChange}
                    placeholder={properties.placeholder}
                    disabled={properties.disabled}
                    spellCheck
                    className={mergeClassNames(
                        'w-full resize-none overflow-y-auto font-mono text-sm focus-visible:outline-none',
                        'max-h-[65vh] min-h-24',
                        mode !== 'Source' && 'hidden',
                        variantStyles.editor,
                    )}
                />

                <LexicalComposer initialConfig={initialConfiguration}>
                    {/* Imperative handle for Lexical - used internally for mode sync */}
                    <LexicalImperativeHandle reference={lexicalReference} type={properties.type} />

                    {/* Visual mode - Lexical rich text editor */}
                    <div
                        ref={visualContainerReference}
                        className={mergeClassNames(
                            'relative w-full overflow-y-auto',
                            mode === 'Source' && 'hidden',
                            sizeStyles.editor,
                        )}
                    >
                        <RichTextPlugin
                            contentEditable={
                                properties.placeholder ? (
                                    <ContentEditable
                                        id={mode === 'Visual' ? properties.id : undefined}
                                        aria-labelledby={properties.ariaLabelledBy}
                                        aria-placeholder={properties.placeholder}
                                        placeholder={
                                            <span
                                                className={mergeClassNames(
                                                    'pointer-events-none absolute content--5',
                                                    variantStyles.placeholder,
                                                )}
                                            >
                                                {properties.placeholder}
                                            </span>
                                        }
                                        className={mergeClassNames(
                                            'relative h-full w-full focus-visible:outline-none',
                                            variantStyles.editor,
                                        )}
                                        spellCheck
                                        contentEditable={!properties.disabled}
                                    />
                                ) : (
                                    <ContentEditable
                                        id={mode === 'Visual' ? properties.id : undefined}
                                        aria-labelledby={properties.ariaLabelledBy}
                                        className={mergeClassNames(
                                            'relative h-full w-full focus-visible:outline-none',
                                            variantStyles.editor,
                                        )}
                                        spellCheck
                                        contentEditable={!properties.disabled}
                                    />
                                )
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                    {showToolbar && (
                        <LexicalToolbarPlugin
                            className={variantStyles.toolbar}
                            disabled={properties.disabled}
                            isLoading={properties.isLoading}
                            showFormatting={properties.toolbar?.showFormatting}
                            showHistory={properties.toolbar?.showHistory}
                            showAttachments={properties.toolbar?.showAttachments}
                            showSubmit={properties.toolbar?.showSubmit}
                            submitLabel={properties.toolbar?.submitLabel}
                            submitLoadingLabel={properties.toolbar?.submitLoadingLabel}
                            onSubmit={properties.toolbar?.onSubmit}
                            attachedFiles={properties.attachedFiles}
                            onSaveFiles={properties.onSaveFiles}
                            onRemoveFile={properties.onRemoveFile}
                            mode={mode}
                            onModeChange={handleModeChange}
                        />
                    )}
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <MarkdownShortcutPlugin />
                    <OnChangePlugin onChange={handleOnChangeWithHeightReset} />
                    <LexicalResetPlugin
                        shouldReset={properties.shouldReset}
                        onResetComplete={properties.onResetComplete}
                    />
                </LexicalComposer>
            </div>
        );
    },
);
