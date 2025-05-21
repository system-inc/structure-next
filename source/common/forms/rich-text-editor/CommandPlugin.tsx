import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    TextNode,
    $getSelection,
    $isRangeSelection,
    $createTextNode,
    $isTextNode,
    $createParagraphNode,
    COMMAND_PRIORITY_HIGH,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_TAB_COMMAND,
    ParagraphNode,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
// import Card from '@structure/source/common/containers/Card';
import { popoverVariants } from './Popover';
import { mergeClassNames } from '@structure/source/utilities/Style';

type CommandType = {
    key: string;
    value: string;
};

// Component - CommandPlugin
type CommandPluginProperties = {
    prefix: string;
    commands: CommandType[];
    onSelect: (command: CommandType) => void;
};
export function CommandPlugin(properties: CommandPluginProperties) {
    const [editor] = useLexicalComposerContext();
    const [isShowingMenu, setIsShowingMenu] = React.useState(false);
    const [matchingCommands, setMatchingCommands] = React.useState<CommandType[]>(properties.commands);
    const [selectedCommandIndex, setSelectedCommandIndex] = React.useState(0);
    const [text, setText] = React.useState('');
    const menuRef = React.useRef<HTMLUListElement>(null);

    const closeMenu = React.useCallback(() => {
        setIsShowingMenu(false);
        setMatchingCommands(properties.commands);
        setText('');
        setSelectedCommandIndex(0);
    }, [properties.commands]);

    const memoizedCommands = React.useMemo(() => properties.commands, [properties.commands]);

    const propertiesPrefix = properties.prefix;
    const propertiesOnSelect = properties.onSelect;
    const insertCommand = React.useCallback(
        function (command: CommandType) {
            editor.update(() => {
                const selection = $getSelection();
                if(!$isRangeSelection(selection)) return;

                // Delete the current prefix + search text
                const prefixLength = propertiesPrefix.length;
                const anchorNode = selection.anchor.getNode();
                if($isTextNode(anchorNode)) {
                    anchorNode.spliceText(0, prefixLength + text.length, '', true);
                }

                // Insert the command value
                const lines = command.value.split('\n');
                const nodes: ParagraphNode[] = [];
                lines.forEach((line, index) => {
                    if(index === 0) {
                        anchorNode.insertAfter($createTextNode(line));
                        anchorNode.selectEnd();
                    }
                    else {
                        const paragraph = $createParagraphNode();
                        paragraph.append($createTextNode(line || ''));
                        nodes.push(paragraph);
                    }
                });

                // Reverse the nodes before inserting
                nodes.reverse();
                // Insert the nodes after the anchor node
                nodes.forEach((node, index) => {
                    anchorNode.getTopLevelElementOrThrow().insertAfter(node);
                    if(index === nodes.length - 1) {
                        node.selectEnd();
                    }
                });

                propertiesOnSelect(command);
            });
        },
        [editor, propertiesPrefix, text, propertiesOnSelect],
    );

    const updateMatchingCommands = React.useCallback(
        (searchText: string) => {
            if(!searchText) {
                setMatchingCommands(properties.commands);
                return;
            }

            const matches = memoizedCommands.filter((command) =>
                command.key.toLowerCase().includes(searchText.toLowerCase()),
            );

            setMatchingCommands(matches);
            setSelectedCommandIndex(0);
        },
        [memoizedCommands, properties.commands],
    );

    // Handle keyboard events
    React.useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                KEY_ARROW_DOWN_COMMAND,
                (event) => {
                    if(!isShowingMenu) return false;
                    event.preventDefault();
                    setSelectedCommandIndex((prev) => (prev < matchingCommands.length - 1 ? prev + 1 : prev));
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),

            editor.registerCommand(
                KEY_ARROW_UP_COMMAND,
                (event) => {
                    if(!isShowingMenu) return false;
                    event.preventDefault();
                    setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),

            editor.registerCommand(
                KEY_ENTER_COMMAND,
                (event) => {
                    if(!isShowingMenu) return false;
                    if(
                        matchingCommands.length > 0 &&
                        selectedCommandIndex >= 0 &&
                        selectedCommandIndex < matchingCommands.length
                    ) {
                        event?.preventDefault();
                        const selectedCommand = matchingCommands[selectedCommandIndex];
                        if(!selectedCommand) return false;
                        insertCommand(selectedCommand);
                        closeMenu();
                    }
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),

            editor.registerCommand(
                KEY_TAB_COMMAND,
                (event) => {
                    if(!isShowingMenu) return false;
                    if(
                        matchingCommands.length > 0 &&
                        selectedCommandIndex >= 0 &&
                        selectedCommandIndex < matchingCommands.length
                    ) {
                        event.preventDefault();
                        const selectedCommand = matchingCommands[selectedCommandIndex];
                        if(!selectedCommand) return false;
                        insertCommand(selectedCommand);
                        closeMenu();
                    }
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),

            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                (event) => {
                    if(!isShowingMenu) return false;
                    event.preventDefault();
                    closeMenu();
                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),
        );
    }, [editor, isShowingMenu, matchingCommands, selectedCommandIndex, insertCommand, closeMenu]);

    // Track text changes and detect command prefix
    React.useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener((updateState) => {
            const editorState = updateState.editorState;
            editorState.read(() => {
                const selection = $getSelection();
                if(!$isRangeSelection(selection)) return;

                const anchorNode = selection.anchor.getNode();
                if(!(anchorNode instanceof TextNode)) return;

                const textContent = anchorNode.getTextContent();
                const cursorPosition = selection.anchor.offset;

                // Find the last occurrence of the prefix before the cursor
                const prefixBeforeCursor = textContent.substring(0, cursorPosition).lastIndexOf(properties.prefix);

                if(prefixBeforeCursor >= 0) {
                    const searchText = textContent.substring(
                        prefixBeforeCursor + properties.prefix.length,
                        cursorPosition,
                    );

                    setIsShowingMenu(true);
                    setText(searchText);
                    updateMatchingCommands(searchText);
                }
                else {
                    setIsShowingMenu(false);
                }
            });
        });

        return removeUpdateListener;
    }, [editor, properties.prefix, updateMatchingCommands]);

    // Click outside to close menu
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);

    React.useEffect(() => {
        // Get the position of the cursor and update the menu position
        const updateMenuPosition = () => {
            if(!menuRef.current) return;
            let anchorKey;
            editor.read(() => {
                const selection = $getSelection();
                if(!selection || !$isRangeSelection(selection)) return;
                anchorKey = selection.anchor.key;
            });
            if(!anchorKey) return;
            const anchorElement = editor.getElementByKey(anchorKey);
            if(!anchorElement) return;

            const { top, left } = anchorElement.getBoundingClientRect();
            menuRef.current.style.top = `${top + anchorElement.offsetHeight}px`;
            menuRef.current.style.left = `${left}px`;
        };

        updateMenuPosition();
    }, [editor]);

    if(!isShowingMenu || matchingCommands.length === 0) {
        return null;
    }

    return (
        <ul
            ref={menuRef}
            className={mergeClassNames(popoverVariants({}), 'absolute z-10 block max-h-60 w-64 overflow-auto')}
        >
            {matchingCommands.map((command, index) => (
                <li
                    key={command.key}
                    className={mergeClassNames(
                        // Base
                        'cursor-pointer gap-2 rounded-lg',
                        // Padding
                        'px-3 py-2.5',
                        'cursor-pointer px-4 py-2',
                        'data-[selected="true"]:bg-opsis-background-secondary text-sm font-medium',
                    )}
                    onClick={() => {
                        insertCommand(command);
                        closeMenu();
                    }}
                    onMouseEnter={() => {
                        setSelectedCommandIndex(index);
                    }}
                    data-selected={index === selectedCommandIndex}
                    role="menuitem"
                >
                    {command.key}
                </li>
            ))}
        </ul>
    );
}
