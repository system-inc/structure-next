'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { SupportFeedbackDialog } from '@structure/source/modules/support/SupportFeedbackDialog';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/AccountProvider';

// Dependencies - Animation
import { useSprings, animated, easings } from '@react-spring/web';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SupportFeedback
export interface SupportFeedbackInterface {
    className?: string;
    prompt?: string;
}
export function SupportFeedback(properties: SupportFeedbackInterface) {
    // Hooks
    const { accountState } = useAccount();
    const urlPath = useUrlPath();

    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false); // New state to track animation status

    // Defaults
    const prompt = properties.prompt || 'Was this page helpful?';

    // Emojis array
    const emojis = ['😔', '🤨', '😃'];

    // Function to handle positive feedback
    function handlePositiveFeedback() {
        console.log('Positive feedback');
        // Additional actions
    }

    // Function to handle neutral feedback
    function handleNeutralFeedback() {
        console.log('Neutral feedback');
        setDialogOpen(true);
    }

    // Function to handle negative feedback
    function handleNegativeFeedback() {
        console.log('Negative feedback');
        setDialogOpen(true);
    }

    // Handlers array
    const emojiHandlers = [handleNegativeFeedback, handleNeutralFeedback, handlePositiveFeedback];

    // Animation configurations
    const [springs, api] = useSprings(emojis.length, (index) => ({
        from: { scale: 1 },
        to: { scale: 1 },
    }));

    // Function to trigger the wave animation
    // State to track if the animation is in progress
    // Updated triggerWave function
    const triggerWave = React.useCallback(() => {
        if(isAnimating) {
            console.log('skipping wave');
            return; // Prevent retriggering if already animating
        }

        console.log('Triggering wave');

        setIsAnimating(true);

        api.start((index) => ({
            from: { scale: 1 },
            to: async (next) => {
                await new Promise((resolve) => setTimeout(resolve, index * 150)); // Delay between emojis
                await next({ scale: 1.2, config: { duration: 200, easing: easings.linear } });
                await next({ scale: 1, config: { duration: 200, easing: easings.linear } });
                if(index === emojis.length - 1) {
                    // Reset isAnimating after the last emoji animates
                    setIsAnimating(false);
                }
            },
        }));
    }, [api, isAnimating, emojis.length]);

    // Render the component
    return (
        <div
            className={mergeClassNames(properties.className)}
            onMouseEnter={triggerWave} // Trigger wave on mouse enter
        >
            <div>
                <p className="mb-4 text-center">{prompt}</p>
                <div className="flex justify-center">
                    <div className="flex w-36 justify-between text-3xl">
                        {springs.map((styles, index) => (
                            <animated.div
                                key={index}
                                className="cursor-pointer"
                                onClick={emojiHandlers[index]}
                                style={{
                                    transform: styles.scale.to((s) => `scale(${s})`),
                                }}
                            >
                                {emojis[index]}
                            </animated.div>
                        ))}
                    </div>
                </div>

                {/* Dialog */}
                <SupportFeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            </div>
        </div>
    );
}

// Export - Default
export default SupportFeedback;
