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
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

// Dependencies - Components
import ToolbarPlugin from './ToolbarPlugin';
import ResetPlugin from './ResetPlugin';
// import FloatingLinkEditor from './FloatingLinkEditor';
import Card from '@structure/source/common/containers/Card';

// Nodes
import { SlashSnippetCommandPlugin } from './SlashCommandPlugin';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'font-normal text-base first:mt-0',
    quote: 'border-l-2 border-light-6 pl-4 dark:border-neutral-4',
    heading: {
        h1: 'mb-6 text-3xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5',
        h2: 'mb-6 mt-6 text-2xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5',
        h3: 'mb-6 mt-6 text-xl font-medium before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5',
        h4: 'mb-6 mt-6 text-[18px] font-medium leading-[26px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5',
        h5: 'text-[16px] font-medium leading-[28px] before:-mt-phi-base-2.5 before:block before:h-phi-base-2.5',
        h6: 'text-[16px] font-medium leading-[28px]',
    },
    list: {
        nested: {
            listitem: 'my-2 pl-1.5 [&>ol]:my-0 [&>ul]:my-0',
        },
        ol: 'mb-6 mt-6 list-decimal pl-[26px]',
        ul: 'mb-6 mt-6 list-disc pl-[26px]',
        listitem: 'my-2 pl-1.5 text-[16px] font-light leading-[28px] [&>ol]:my-0 [&>ul]:my-0',
        listitemChecked: 'my-2 pl-1.5 text-[16px] font-light leading-[28px]',
        listitemUnchecked: 'my-2 pl-1.5 text-[16px] font-light leading-[28px]',
    },
    hashtag: 'text-blue',
    image: 'max-w-full h-auto',
    link: 'primary hover:underline',
    text: {
        bold: 'font-medium',
        code: 'mb-6 whitespace-pre-wrap rounded border border-light-4 bg-light-2 px-1 py-px font-mono text-sm dark:border-dark-4 dark:bg-dark',
        italic: 'italic',
        strikethrough: 'line-through',
        subscript: 'text-xs align-sub',
        superscript: 'text-xs align-super',
        underline: 'underline',
        underlineStrikethrough: 'underline line-through',
    },
    code: 'relative mb-6 rounded-md border border-light-4 bg-light-2 p-5 text-sm dark:border-dark-4 dark:bg-dark',
    codeHighlight: {
        atrule: 'text-blue',
        attr: 'text-blue',
        boolean: 'text-purple-600',
        builtin: 'text-green-600',
        cdata: 'text-neutral-4',
        char: 'text-green-600',
        class: 'text-yellow-500',
        'class-name': 'text-yellow-500',
        comment: 'text-neutral-4',
        constant: 'text-purple-600',
        deleted: 'text-red-600',
        doctype: 'text-neutral-4',
        entity: 'text-yellow-500',
        function: 'text-yellow-500',
        important: 'text-red-600',
        inserted: 'text-green-600',
        keyword: 'text-blue',
        namespace: 'text-red-600',
        number: 'text-purple-600',
        operator: 'text-yellow-500',
        prolog: 'text-neutral-4',
        property: 'text-purple-600',
        punctuation: 'text-neutral',
        regex: 'text-red-600',
        selector: 'text-green-600',
        string: 'text-green-600',
        symbol: 'text-purple-600',
        tag: 'text-purple-600',
        url: 'text-yellow-500',
        variable: 'text-red-600',
    },
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error);
}

// Component - RichTextEditor
interface RichTextEditorProperties {
    type: 'markdown' | 'html' | 'json';
    className?: string;
    initialContent?: string;
    onChange?: ({ markdown, json, html }: { markdown: string; html: string; json: string }) => void;
    // isEditorEmpty?: (empty: boolean) => void;
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
    isDisabled?: boolean;
    showLoading?: boolean;
    // loadingProgress?: number | null;
    shouldReset?: boolean;
    onResetComplete?: () => void;
}
export function RichTextEditor(properties: RichTextEditorProperties) {
    // const [linkUrl, setLinkUrl] = useState('');
    // const [isLinkActive, setIsLinkActive] = useState(false);

    const initialConfig: InitialConfigType = {
        namespace: 'PhiEditor',
        theme,
        onError,
        nodes: [HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, HeadingNode, QuoteNode],
        editorState: () => {
            // Handle initial content values
            if(properties.initialContent) {
                if(properties.type === 'markdown') {
                    $convertFromMarkdownString(properties.initialContent, TRANSFORMERS); // Generate the nodes from the markdown string
                }
                else if(properties.type === 'html') {
                    const editor = $getEditor();
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(properties.initialContent, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);
                    $getRoot().select();

                    $insertNodes(nodes);
                }
                else if(properties.type === 'json') {
                    $getRoot().updateFromJSON(JSON.parse(properties.initialContent));
                }

                $getRoot().selectEnd(); // Move selection to the end of the content.
                return;
            }
        },
    };

    function handleOnChange(editorState: EditorState, editor: LexicalEditor) {
        editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            const html = $generateHtmlFromNodes(
                editor,
                null, // Could be narrowed via a selection object
            );
            const json = JSON.stringify(editorState.toJSON());

            // const root = $getRoot();
            // const isEmpty = root.getChildrenSize() === 1 && root.getFirstChild()?.getTextContent() === '';
            properties.onChange?.({ markdown, html, json });
            // isEditorEmpty?.(isEmpty);
        });
    }

    // Render the component
    return (
        <Card
            className={mergeClassNames(
                'flex flex-col items-stretch gap-0 overflow-clip rounded-small p-0',
                properties.className,
            )}
        >
            <LexicalComposer initialConfig={initialConfig}>
                <div className="relative h-full w-full overflow-y-auto">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                aria-placeholder=""
                                placeholder={<span />}
                                className="relative h-full max-h-80 min-h-40 w-full p-4 focus-visible:outline-none"
                                spellCheck
                                contentEditable={!properties.isDisabled}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <ToolbarPlugin
                    attachedFiles={properties.attachedFiles}
                    onSaveFiles={properties.onSaveFiles}
                    onRemoveFile={properties.onRemoveFile}
                    isDisabled={properties.isDisabled}
                    showLoading={properties.showLoading}
                    // loadingProgress={loadingProgress}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <MarkdownShortcutPlugin />
                <OnChangePlugin onChange={handleOnChange} />
                <SlashSnippetCommandPlugin />
                <ResetPlugin shouldReset={properties.shouldReset} onResetComplete={properties.onResetComplete} />
            </LexicalComposer>
        </Card>
    );
}

// Export - Default
export default RichTextEditor;
