'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import type { ButtonWrapperProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Animation
import { motion, animate, AnimatePresence, useMotionValue } from 'motion/react';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/type/Number';

// Animation configuration constants
const animationTimings = {
    iconTransitionDuration: 0.2, // 200ms for scale/fade in/out
    iconTransitionEase: [0.165, 0.84, 0.44, 1] as const, // easeOutQuart
    rotationDuration: 0.35, // 350ms per 180° rotation
    rotationIncrement: 180, // Degrees per rotation step
    successDisplayDuration: 1200, // How long to show success/error icon
    iconExitDuration: 400, // Time for icon exit + enter animations (200ms each)
    tipResetDelay: 1700, // When to reset tooltip content
    rotationResetDelay: 200, // Safety delay before resetting rotation
} as const;

// Animation variants (defined outside component for performance)
const iconAnimationVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
} as const;

// Component - AnimatedButton
// Preserves Button icon discriminated union (icon-only, iconLeft+text, iconRight+text, text-only)
// Excludes link variants (href, asChild) since animated buttons are always interactive buttons
// When processing: overrides with animated processing icon
// When not processing: renders normally with icons
export type AnimatedButtonProperties = ButtonWrapperProperties<'onClick'> & {
    isProcessing?: boolean;
    processingText?: string;
    processingIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingSuccessIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingErrorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    showResultIconAnimation?: boolean;
    showProcessedTimeTip?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
};
export const AnimatedButton = React.forwardRef<HTMLElement, AnimatedButtonProperties>(function AnimatedButton(
    properties: AnimatedButtonProperties,
    reference: React.Ref<HTMLElement>,
) {
    // State
    const [isProcessingState, setIsProcessingState] = React.useState(properties.isProcessing ?? false);
    const [processingAnimationRunning, setProcessingAnimationRunning] = React.useState(false);
    const [processingIconRotation, setProcessingIconRotation] = React.useState(0);
    const [processed, setProcessed] = React.useState(false);
    const [processingError, setProcessingError] = React.useState(false);
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(properties.tip);

    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // Animation - Processing Icon Rotation (plain motion value without spring physics)
    const rotationMotionValue = useMotionValue(0);

    // Simple computed values - React Compiler handles memoization
    const disabledValue = properties.disabled ?? false;
    const processingAnimationEnabled =
        properties.showResultIconAnimation ||
        properties.processingIcon ||
        properties.processingText ||
        properties.isProcessing !== undefined;

    // Memoize this value to ensure stable reference for useCallback dependencies
    const resultIconAnimationEnabled = React.useMemo(
        function () {
            return properties.showResultIconAnimation || properties.showProcessedTimeTip || false;
        },
        [properties.showResultIconAnimation, properties.showProcessedTimeTip],
    );

    // Function to start processing
    // Wrapped in useCallback to stabilize for effect dependency array
    const startProcessing = React.useCallback(
        function () {
            // Clear any existing timeouts
            if(processingAnimationTimeoutReference.current) {
                clearTimeout(processingAnimationTimeoutReference.current);
            }
            if(tipResetTimeoutReference.current) {
                clearTimeout(tipResetTimeoutReference.current);
            }
            if(processingAnimationRunningTimeoutReference.current) {
                clearTimeout(processingAnimationRunningTimeoutReference.current);
            }

            // Reset rotation state to start fresh
            setProcessingIconRotation(0);
            rotationMotionValue.set(0);

            // Reset states
            setProcessed(false);
            setProcessingError(false);
            setIsProcessingState(true);
            setProcessingAnimationRunning(true);

            // Track the time when the processing started
            const processingStartTime = new Date().getTime();
            processingStartTimeReference.current = processingStartTime;

            return processingStartTime;
        },
        [rotationMotionValue],
    );

    // Function to end processing
    // Wrapped in useCallback to stabilize for effect dependency array
    const endProcessing = React.useCallback(
        function (processingStartTime: number, hasError: boolean = false) {
            // Calculate the processing time
            const processingEndTime = new Date().getTime();
            const processedTimeInMilliseconds = processingEndTime - processingStartTime;

            // Update tip content if enabled
            if(properties.showProcessedTimeTip) {
                if(hasError) {
                    setTipContent(`Error (${addCommas(processedTimeInMilliseconds)} ms)`);
                }
                else {
                    setTipContent(`${addCommas(processedTimeInMilliseconds)} ms`);
                }
            }

            // Update states
            setIsProcessingState(false);
            setProcessingError(hasError);

            // If result icon animation is enabled, show success/error icon sequence
            if(resultIconAnimationEnabled) {
                console.log('[AnimatedButton] Starting success/error icon sequence');
                setProcessed(true);

                // Wait for success display duration, then start the exit sequence
                processingAnimationTimeoutReference.current = setTimeout(function () {
                    console.log('[AnimatedButton] Starting exit sequence - hiding success icon');
                    // Trigger check circle scale OUT animation
                    setProcessed(false);

                    // After icon transitions complete, reset animation state
                    processingAnimationRunningTimeoutReference.current = setTimeout(function () {
                        console.log('[AnimatedButton] Resetting processingAnimationRunning to false');
                        setProcessingAnimationRunning(false);
                    }, animationTimings.iconExitDuration);
                }, animationTimings.successDisplayDuration);

                // Reset the tip content after everything completes
                tipResetTimeoutReference.current = setTimeout(function () {
                    console.log('[AnimatedButton] Resetting tip content');
                    if(properties.showProcessedTimeTip) {
                        setTipContent(properties.tip);
                    }
                }, animationTimings.tipResetDelay);
            }
            else {
                // No result icon animation - just stop immediately
                setProcessed(false);
                setProcessingAnimationRunning(false);
            }
        },
        [properties.showProcessedTimeTip, properties.tip, resultIconAnimationEnabled],
    );

    // Function to intercept the onClick event
    async function onClickIntercept(event: React.MouseEvent<HTMLElement>) {
        // If we are showing the processed time tip or the processing animation is enabled
        if(properties.showProcessedTimeTip || processingAnimationEnabled) {
            // Start processing
            const processingStartTime = startProcessing();

            try {
                // If a click handler is provided, call it
                if(properties.onClick) {
                    await properties.onClick(event);
                }

                // End processing successfully
                endProcessing(processingStartTime, false);
            }
            catch(error) {
                // End processing with error
                endProcessing(processingStartTime, true);

                // Re-throw the error so parent components can handle it if needed
                throw error;
            }
        }
        // Otherwise, just call the click handler
        else if(properties.onClick) {
            properties.onClick(event);
        }
    }

    // Effect to handle rotation animation (only when result icon animations are enabled)
    React.useEffect(
        function () {
            if(isProcessingState && resultIconAnimationEnabled) {
                const targetRotation = processingIconRotation + animationTimings.rotationIncrement;

                const animation = animate(rotationMotionValue, targetRotation, {
                    duration: animationTimings.rotationDuration,
                    ease: 'linear',
                    onComplete: function () {
                        setProcessingIconRotation(targetRotation);
                    },
                });

                return function () {
                    animation.stop();
                };
            }
        },
        [isProcessingState, processingIconRotation, rotationMotionValue, resultIconAnimationEnabled],
    );

    // Effect to reset rotation when animation completes
    React.useEffect(
        function () {
            if(!processingAnimationRunning && !isProcessingState && processingIconRotation !== 0) {
                const resetTimeout = setTimeout(function () {
                    setProcessingIconRotation(0);
                    rotationMotionValue.set(0);
                }, animationTimings.rotationResetDelay);

                return function () {
                    clearTimeout(resetTimeout);
                };
            }
        },
        [processingAnimationRunning, isProcessingState, processingIconRotation, rotationMotionValue],
    );

    // Listen to changes in the processing property allowing the component to be controlled by the parent
    React.useEffect(
        function () {
            // Capture current timeout refs at the start of this effect
            const processingAnimationRunningTimeout = processingAnimationRunningTimeoutReference.current;
            const processingAnimationTimeout = processingAnimationTimeoutReference.current;
            const tipResetTimeout = tipResetTimeoutReference.current;

            // Listen to changes in the processing property
            if(properties.isProcessing !== undefined) {
                // If the processing state changed
                if(isProcessingState !== properties.isProcessing) {
                    // If processing started
                    if(properties.isProcessing) {
                        startProcessing();
                    }
                    // If processing ended
                    else {
                        endProcessing(processingStartTimeReference.current);
                    }
                }
            }

            // Clear timeouts on unmount (using captured values, not .current)
            return function () {
                if(processingAnimationTimeout) {
                    clearTimeout(processingAnimationTimeout);
                }
                if(tipResetTimeout) {
                    clearTimeout(tipResetTimeout);
                }
                if(processingAnimationRunningTimeout) {
                    clearTimeout(processingAnimationRunningTimeout);
                }
            };
        },
        [properties.isProcessing, isProcessingState, startProcessing, endProcessing, properties.disabled],
    );

    // Use the provided icons, or the default icons
    const ProcessingIcon = properties.processingIcon ?? BrokenCircleIcon;
    const ProcessingSuccessIcon = properties.processingSuccessIcon ?? CheckCircleIcon;
    const ProcessingErrorIcon = properties.processingErrorIcon ?? XCircleIcon;

    // Initialize content with the button's children
    let content = properties.children;

    // If the processing animation is enabled and running
    if(processingAnimationEnabled && processingAnimationRunning) {
        // Define the transition for icon animations
        const iconAnimationTransition = {
            duration: animationTimings.iconTransitionDuration,
            ease: animationTimings.iconTransitionEase,
        };

        // Render the appropriate icon based on the processing state
        const displayIcon = (
            <AnimatePresence mode="wait" initial={false}>
                {processed && processingError && resultIconAnimationEnabled && ProcessingErrorIcon ? (
                    <motion.div
                        key="error-icon"
                        variants={iconAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={iconAnimationTransition}
                        className="text-red-500"
                    >
                        <ProcessingErrorIcon className="h-5 w-5" />
                    </motion.div>
                ) : processed && resultIconAnimationEnabled && ProcessingSuccessIcon ? (
                    <motion.div
                        key="success-icon"
                        variants={iconAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={iconAnimationTransition}
                        className="text-emerald-500"
                    >
                        <ProcessingSuccessIcon className="h-5 w-5" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="processing-icon"
                        variants={iconAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={iconAnimationTransition}
                    >
                        {isProcessingState ? (
                            resultIconAnimationEnabled ? (
                                // Use controlled rotation for coordinated animations
                                <motion.div style={{ rotate: rotationMotionValue }}>
                                    <ProcessingIcon className="h-5 w-5" />
                                </motion.div>
                            ) : (
                                // Use CSS animation for simple spinner (more performant)
                                <ProcessingIcon className="h-5 w-5 animate-spin" />
                            )
                        ) : (
                            <ProcessingIcon className="h-5 w-5" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );

        // If processed, revert back to the children (unless we're showing result icons)
        if(processed && !resultIconAnimationEnabled) {
            content = properties.children;
        }
        // Otherwise, show the icon
        else {
            content = properties.processingText ? (
                // If text is provided, the icon will be to the right of the text
                <div className="flex w-full items-center justify-between">
                    <div className="invisible h-5 w-5" />
                    <span className="flex-grow px-4 text-center">{properties.processingText}</span>
                    <div className="relative h-5 w-5">{displayIcon}</div>
                </div>
            ) : (
                // If processing text is not provided, just render the icon in the center
                <div className="relative flex h-5 w-5 items-center justify-center">{displayIcon}</div>
            );
        }
    }

    // Common properties shared across all icon variants
    // These properties are the same regardless of processing state or icon configuration
    const commonButtonProperties = {
        variant: properties.variant,
        size: properties.size,
        type: properties.type,
        disabled: disabledValue || isProcessingState,
        isLoading: properties.isLoading,
        tip: properties.showProcessedTimeTip ? tipContent : properties.tip,
        tipProperties:
            processed && processingAnimationRunning
                ? { ...properties.tipProperties, open: true }
                : properties.tipProperties,
        onClick: onClickIntercept,
        className: properties.className,
    };

    // Processing or animating state: Show animation content, omit all icon props
    // During processing and animation sequence, we replace button content with our animation (spinner/success/error icons)
    if(isProcessingState || processingAnimationRunning) {
        return (
            <Button ref={reference} {...commonButtonProperties}>
                {content}
            </Button>
        );
    }
    // Not processing or animating: Pass through the original icon variant from parent
    // Button has a discriminated union for icons - only one of these will be truthy
    // Icon-only variant: No children, icon prop only (self-closing button)
    else if(properties.icon) {
        return <Button ref={reference} {...commonButtonProperties} icon={properties.icon} />;
    }
    // IconLeft variant: Icon on left side with text children
    else if(properties.iconLeft) {
        return (
            <Button ref={reference} {...commonButtonProperties} iconLeft={properties.iconLeft}>
                {content}
            </Button>
        );
    }
    // IconRight variant: Icon on right side with text children
    else if(properties.iconRight) {
        return (
            <Button ref={reference} {...commonButtonProperties} iconRight={properties.iconRight}>
                {content}
            </Button>
        );
    }
    // No icon variant: Text-only button with children
    else {
        return (
            <Button ref={reference} {...commonButtonProperties}>
                {content}
            </Button>
        );
    }
});

// Set the display name for the component for debugging
AnimatedButton.displayName = 'AnimatedButton';
