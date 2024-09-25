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
    const [isAnimatingEmojis, setIsAnimatingEmojis] = React.useState(false); // State to track animation status
    const [lastEmojiAnimationTime, setLastEmojiAnimationTime] = React.useState<number | null>(null); // State to track cooldown

    // Defaults
    const prompt = properties.prompt || 'Was this page helpful?';

    // Emojis array
    const emojis = ['😔', '🤨', '😃'];
    const emojiHandlers = [handleNegativeFeedback, handleNeutralFeedback, handlePositiveFeedback];

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

    // Animation configuration
    const [emojiSprings, emojiSpringsApi] = useSprings(emojis.length, function () {
        return {
            from: { scale: 1 },
            to: { scale: 1 },
        };
    });

    // Function to trigger the wave animation
    const triggerWave = React.useCallback(
        function () {
            // Get the current time
            const now = Date.now();

            // Prevent retriggering if already animating
            if(isAnimatingEmojis) {
                // console.log('Animation is in progress. Skipping wave.');
                return;
            }

            // Prevent retriggering if within cooldown period
            if(lastEmojiAnimationTime !== null && now - lastEmojiAnimationTime < 10000) {
                // console.log('Cooldown in effect. Skipping wave.');
                return;
            }

            // console.log('Triggering wave');

            // Set isAnimating and lastEmojiAnimationTime
            setIsAnimatingEmojis(true);
            setLastEmojiAnimationTime(now);

            // Start the animation
            emojiSpringsApi.start(function (index) {
                return {
                    from: { scale: 1 },
                    to: async function (next) {
                        // Delay between emojis
                        await new Promise(function (resolve) {
                            setTimeout(resolve, index * 150);
                        });

                        // Scale the emoji up
                        await next({ scale: 1.2, config: { duration: 200, easing: easings.linear } });

                        // Scale the emoji down
                        await next({ scale: 1, config: { duration: 200, easing: easings.linear } });

                        // Reset isAnimating after the last emoji animates
                        if(index === emojis.length - 1) {
                            setIsAnimatingEmojis(false);
                        }
                    },
                };
            });
        },
        [emojiSpringsApi, isAnimatingEmojis, lastEmojiAnimationTime],
    );

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
                        {/* Emojis */}
                        {emojiSprings.map(function (styles, index) {
                            return (
                                <animated.div
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={emojiHandlers[index]}
                                    style={{
                                        transform: styles.scale.to(function (scale) {
                                            return `scale(${scale})`;
                                        }),
                                    }}
                                >
                                    {emojis[index]}
                                </animated.div>
                            );
                        })}
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
