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
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'font-normal text-base first:mt-0',
    quote: 'border-l-2 border--3 pl-4 dark:border-neutral-4',
    heading: {
        h1: 'mb-6 text-3xl font-medium before:-mt-16 before:block before:h-16',
        h2: 'mb-6 mt-6 text-2xl font-medium before:-mt-16 before:block before:h-16',
        h3: 'mb-6 mt-6 text-xl font-medium before:-mt-16 before:block before:h-16',
        h4: 'mb-6 mt-6 text-[18px] font-medium leading-[26px] before:-mt-16 before:block before:h-16',
        h5: 'text-[16px] font-medium leading-[28px] before:-mt-16 before:block before:h-16',
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
        code: 'mb-6 whitespace-pre-wrap rounded border border--3 bg-light-2 px-1 py-px font-mono text-sm dark:border-dark-4 dark:bg-dark',
        italic: 'italic',
        strikethrough: 'line-through',
        subscript: 'text-xs align-sub',
        superscript: 'text-xs align-super',
        underline: 'underline',
        underlineStrikethrough: 'underline line-through',
    },
    code: 'relative mb-6 rounded-md border border--3 bg-light-2 p-5 text-sm dark:border-dark-4 dark:bg-dark',
    codeHighlight: {
        atrule: 'text-blue',
        attr: 'text-blue',
        boolean: 'text-purple-600',
        builtin: 'text-green-600',
        cdata: 'content--2',
        char: 'text-green-600',
        class: 'text-yellow-500',
        'class-name': 'text-yellow-500',
        comment: 'content--2',
        constant: 'text-purple-600',
        deleted: 'text-red-600',
        doctype: 'content--2',
        entity: 'text-yellow-500',
        function: 'text-yellow-500',
        important: 'text-red-600',
        inserted: 'text-green-600',
        keyword: 'text-blue',
        namespace: 'text-red-600',
        number: 'text-purple-600',
        operator: 'text-yellow-500',
        prolog: 'content--2',
        property: 'text-purple-600',
        punctuation: 'content--2',
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
