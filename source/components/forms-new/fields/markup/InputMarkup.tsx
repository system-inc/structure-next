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
import { ToolbarPlugin } from './ToolbarPlugin';
import { ResetPlugin } from './ResetPlugin';
// import FloatingLinkEditor from './FloatingLinkEditor';
import { Card } from '@structure/source/components/containers/Card';

// Nodes
// import { SlashSnippetCommandPlugin } from './SlashCommandPlugin'; - Disabled to allow typing URLs with "/"

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

const theme = {
    ltr: mergeClassNames(''),
    rtl: mergeClassNames(''),
    paragraph: mergeClassNames('text-base font-normal first:mt-0'),
    quote: mergeClassNames('border-l-2 border--3 pl-4'),
    heading: {
        h1: mergeClassNames('mb-6 text-3xl font-medium before:-mt-16 before:block before:h-16'),
        h2: mergeClassNames('mt-6 mb-6 text-2xl font-medium before:-mt-16 before:block before:h-16'),
        h3: mergeClassNames('mt-6 mb-6 text-xl font-medium before:-mt-16 before:block before:h-16'),
        h4: mergeClassNames('mt-6 mb-6 text-[18px] leading-[26px] font-medium before:-mt-16 before:block before:h-16'),
        h5: mergeClassNames('text-[16px] leading-7 font-medium before:-mt-16 before:block before:h-16'),
        h6: mergeClassNames('text-[16px] leading-7 font-medium'),
    },
    list: {
        nested: {
            listitem: mergeClassNames('my-2 pl-1.5 [&>ol]:my-0 [&>ul]:my-0'),
        },
        ol: mergeClassNames('mt-6 mb-6 list-decimal pl-[26px]'),
        ul: mergeClassNames('mt-6 mb-6 list-disc pl-[26px]'),
        listitem: mergeClassNames('my-2 pl-1.5 text-[16px] leading-7 font-light [&>ol]:my-0 [&>ul]:my-0'),
        listitemChecked: mergeClassNames('my-2 pl-1.5 text-[16px] leading-7 font-light'),
        listitemUnchecked: mergeClassNames('my-2 pl-1.5 text-[16px] leading-7 font-light'),
    },
    hashtag: mergeClassNames('text-blue-500'),
    image: mergeClassNames('h-auto max-w-full'),
    link: mergeClassNames('hover:underline'),
    text: {
        bold: mergeClassNames('font-medium'),
        code: mergeClassNames(
            'mb-6 rounded border border--3 background--2 px-1 py-px font-mono text-sm whitespace-pre-wrap',
        ),
        italic: mergeClassNames('italic'),
        strikethrough: mergeClassNames('line-through'),
        subscript: mergeClassNames('align-sub text-xs'),
        superscript: mergeClassNames('align-super text-xs'),
        underline: mergeClassNames('underline'),
        underlineStrikethrough: mergeClassNames('line-through'),
    },
    code: mergeClassNames('relative mb-6 rounded-md border border--3 background--2 p-5 text-sm'),
    codeHighlight: {
        atrule: mergeClassNames('text-blue-500'),
        attr: mergeClassNames('text-blue-400'),
        boolean: mergeClassNames('text-purple-600'),
        builtin: mergeClassNames('text-green-600'),
        cdata: mergeClassNames('content--2'),
        char: mergeClassNames('text-green-600'),
        class: mergeClassNames('text-yellow-500'),
        'class-name': mergeClassNames('text-yellow-500'),
        comment: mergeClassNames('content--2'),
        constant: mergeClassNames('text-purple-600'),
        deleted: mergeClassNames('text-red-600'),
        doctype: mergeClassNames('content--2'),
        entity: mergeClassNames('text-yellow-500'),
        function: mergeClassNames('text-yellow-500'),
        important: mergeClassNames('text-red-600'),
        inserted: mergeClassNames('text-green-600'),
        keyword: mergeClassNames('text-blue-500'),
        namespace: mergeClassNames('text-red-600'),
        number: mergeClassNames('text-purple-600'),
        operator: mergeClassNames('text-yellow-500'),
        prolog: mergeClassNames('content--2'),
        property: mergeClassNames('text-purple-600'),
        punctuation: mergeClassNames('content--2'),
        regex: mergeClassNames('text-red-600'),
        selector: mergeClassNames('text-green-600'),
        string: mergeClassNames('text-green-600'),
        symbol: mergeClassNames('text-purple-600'),
        tag: mergeClassNames('text-purple-600'),
        url: mergeClassNames('text-yellow-500'),
        variable: mergeClassNames('text-red-600'),
    },
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error);
}

// Component - InputMarkup
interface InputMarkupProperties {
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
    textSize?: 'xs' | 'sm' | 'base' | 'lg';
}
export function InputMarkup(properties: InputMarkupProperties) {
    // const [linkUrl, setLinkUrl] = useState('');
    // const [isLinkActive, setIsLinkActive] = useState(false);

    // Create a customized theme based on textSize prop
    const textSizeClass =
        properties.textSize === 'xs'
            ? 'text-xs'
            : properties.textSize === 'sm'
              ? 'text-sm'
              : properties.textSize === 'lg'
                ? 'text-lg'
                : 'text-base';

    const customTheme = React.useMemo(
        function () {
            return {
                ...theme,
                paragraph: mergeClassNames('font-normal first:mt-0', textSizeClass),
            };
        },
        [textSizeClass],
    );

    const initialConfiguration: InitialConfigType = {
        namespace: 'PhiEditor',
        theme: customTheme,
        onError,
        nodes: [HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, HeadingNode, QuoteNode],
        editorState: function () {
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
        editorState.read(function () {
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
                'flex flex-col items-stretch gap-0 overflow-clip rounded-2xl p-0',
                properties.className,
            )}
        >
            <LexicalComposer initialConfig={initialConfiguration}>
                <div className="relative w-full overflow-y-auto">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                aria-placeholder="Reply..."
                                placeholder={
                                    <span
                                        className={mergeClassNames(
                                            'pointer-events-none absolute top-5 left-5 content--5',
                                            textSizeClass,
                                        )}
                                    >
                                        Reply...
                                    </span>
                                }
                                className={mergeClassNames(
                                    'relative max-h-80 w-full px-5 pt-5 pb-3 focus-visible:outline-none',
                                    textSizeClass,
                                )}
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
                {/* <SlashSnippetCommandPlugin /> - Disabled to allow typing URLs with "/" */}
                <ResetPlugin shouldReset={properties.shouldReset} onResetComplete={properties.onResetComplete} />
            </LexicalComposer>
        </Card>
    );
}
