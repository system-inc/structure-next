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
import { inputMarkupTheme, InputMarkupVariant } from './InputMarkupTheme';

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

        // Function to handle content changes
        function handleOnChange(editorState: EditorState, editor: LexicalEditor) {
            editorState.read(function () {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                const html = $generateHtmlFromNodes(editor, null);
                const json = JSON.stringify(editorState.toJSON());
                properties.onChange?.({ markdown, html, json });
            });
        }

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
                <LexicalComposer initialConfig={initialConfiguration}>
                    {/* Imperative handle - exposes ref methods */}
                    <LexicalImperativeHandle reference={reference} type={properties.type} />

                    <div className="relative w-full overflow-y-auto">
                        <RichTextPlugin
                            contentEditable={
                                properties.placeholder ? (
                                    <ContentEditable
                                        id={properties.id}
                                        aria-labelledby={properties.ariaLabelledBy}
                                        aria-placeholder={properties.placeholder}
                                        placeholder={
                                            <span
                                                className={mergeClassNames(
                                                    'pointer-events-none absolute content--5',
                                                    sizeStyles.editor,
                                                    variantStyles.placeholder,
                                                )}
                                            >
                                                {properties.placeholder}
                                            </span>
                                        }
                                        className={mergeClassNames(
                                            'relative w-full focus-visible:outline-none',
                                            sizeStyles.editor,
                                            variantStyles.editor,
                                        )}
                                        spellCheck
                                        contentEditable={!properties.disabled}
                                    />
                                ) : (
                                    <ContentEditable
                                        id={properties.id}
                                        aria-labelledby={properties.ariaLabelledBy}
                                        className={mergeClassNames(
                                            'relative w-full focus-visible:outline-none',
                                            sizeStyles.editor,
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
                        />
                    )}
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <MarkdownShortcutPlugin />
                    <OnChangePlugin onChange={handleOnChange} />
                    <LexicalResetPlugin
                        shouldReset={properties.shouldReset}
                        onResetComplete={properties.onResetComplete}
                    />
                </LexicalComposer>
            </div>
        );
    },
);
