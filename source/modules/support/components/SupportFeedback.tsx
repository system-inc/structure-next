'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { SupportFeedbackDialog } from '@structure/source/modules/support/components/SupportFeedbackDialog';

// Dependencies - Account
// import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SupportFeedback
export interface SupportFeedbackProperties {
    className?: string;
    prompt?: string;
}
export function SupportFeedback(properties: SupportFeedbackProperties) {
    // Hooks
    // const { accountState } = useAccount();
    // const urlPath = useUrlPath();

    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);

    // Defaults
    const prompt = properties.prompt || 'Was this page helpful?';

    // Function to handle emoji selection
    function handleEmojiSelection(emoji: string) {
        if(selectedEmoji === emoji) {
            // If already selected, deselect it
            setSelectedEmoji(null);
        }
        else {
            // Otherwise, select the new emoji
            setSelectedEmoji(emoji);
        }
    }

    // Function to get emoji classes
    function getEmojiClasses(emoji: string) {
        return mergeClassNames(
            'cursor-pointer transition-all duration-300 ease-in-out hover:scale-150', // Base classes
            selectedEmoji === emoji ? 'scale-125' : 'scale-100', // Keep the selected emoji larger
            selectedEmoji && selectedEmoji !== emoji ? 'opacity-10 grayscale' : '', // Gray out unselected emojis
        );
    }

    // Function to handle dialog for neutral or negative feedback
    function handleFeedback(emoji: string) {
        handleEmojiSelection(emoji);
        if(emoji !== '😃') {
            setDialogOpen(true); // Open dialog for neutral or negative feedback
        }
    }

    // Render the component
    return (
        <div className={mergeClassNames(properties.className)}>
            <div>
                <p className="mb-4 text-center">{prompt}</p>
                <div className="flex justify-center">
                    <div className="flex w-36 justify-between text-3xl select-none">
                        {/* Add the hover classes here for each emoji */}
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

                {/* Thank them */}
                {selectedEmoji && (
                    <div className="mt-8 text-center">
                        <p>Thank you! 🙏</p>
                    </div>
                )}

                {/* Dialog */}
                <SupportFeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            </div>
        </div>
    );
}
