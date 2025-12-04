'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { FeedbackDialog } from '@structure/source/modules/feedback/components/dialogs/FeedbackDialog';

// Dependencies - Hooks
import { useFeedbackCreateRequest } from '@structure/source/modules/feedback/hooks/useFeedbackCreateRequest';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Feedback
export interface FeedbackProperties {
    className?: string;
    identifier?: string; // Optional identifier override (defaults to URL path)
    prompt?: string;
}
export function Feedback(properties: FeedbackProperties) {
    // Hooks
    const urlPath = useUrlPath();
    const feedbackCreateRequest = useFeedbackCreateRequest();

    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);

    // Defaults
    const prompt = properties.prompt || 'Was this page helpful?';
    const identifier = properties.identifier || urlPath;

    // Function to get emoji classes
    function getEmojiClasses(emoji: string) {
        return mergeClassNames(
            'cursor-pointer transition-all duration-300 ease-in-out hover:scale-150', // Base classes
            selectedEmoji === emoji ? 'scale-125' : 'scale-100', // Keep the selected emoji larger
            selectedEmoji && selectedEmoji !== emoji ? 'opacity-10 grayscale' : '', // Gray out unselected emojis
        );
    }

    // Function to handle feedback selection
    async function handleFeedback(emoji: string) {
        // If already selected, deselect it
        if(selectedEmoji === emoji) {
            setSelectedEmoji(null);
            return;
        }

        // Select the new emoji
        setSelectedEmoji(emoji);

        // For positive feedback, submit immediately without dialog
        if(emoji === '😃') {
            await feedbackCreateRequest.execute({
                input: {
                    identifier: identifier,
                    subject: `Feedback: Positive - ${identifier}`,
                    reaction: emoji,
                },
            });
        }
        else {
            // For neutral or negative feedback, open the dialog for more details
            setDialogOpen(true);
        }
    }

    // Render the component
    return (
        <div className={mergeClassNames(properties.className)}>
            <div>
                <p className="mb-4 text-center">{prompt}</p>
                <div className="flex justify-center">
                    <div className="flex w-36 justify-between text-3xl select-none">
                        <div
                            className={getEmojiClasses('😔')}
                            onClick={function () {
                                handleFeedback('😔');
                            }}
                        >
                            😔
                        </div>
                        <div
                            className={getEmojiClasses('🤨')}
                            onClick={function () {
                                handleFeedback('🤨');
                            }}
                        >
                            🤨
                        </div>
                        <div
                            className={getEmojiClasses('😃')}
                            onClick={function () {
                                handleFeedback('😃');
                            }}
                        >
                            😃
                        </div>
                    </div>
                </div>

                {/* Thank them for positive feedback */}
                {selectedEmoji === '😃' && feedbackCreateRequest.data && (
                    <div className="mt-8 text-center">
                        <p>Thank you! 🙏</p>
                    </div>
                )}

                {/* Dialog for neutral/negative feedback */}
                <FeedbackDialog
                    identifier={identifier}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    selectedEmoji={selectedEmoji ?? undefined}
                />
            </div>
        </div>
    );
}
