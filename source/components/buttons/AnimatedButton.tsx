'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { type ButtonElementType, Button, ButtonProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Animation
import { motion, animate, AnimatePresence, useMotionValue } from 'motion/react';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
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
export interface AnimatedButtonProperties extends ButtonProperties {
    isProcessing?: boolean;
    processingText?: string;
    processingIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingSuccessIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingErrorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    showResultIconAnimation?: boolean;
    showProcessedTimeTip?: boolean;
}
export const AnimatedButton = React.forwardRef<ButtonElementType, AnimatedButtonProperties>(function AnimatedButton(
    {
        variant,
        size,
        disabled,
        loading,
        isProcessing,
        processingText,
        processingIcon,
        processingSuccessIcon,
        processingErrorIcon,
        showResultIconAnimation,
        showProcessedTimeTip,
        tip,
        tipProperties,
        icon,
        iconPosition,
        iconClassName,
        href,
        target,
        type,
        onClick,
        className,
        children,
        ...domProperties
    }: AnimatedButtonProperties,
    reference: React.Ref<ButtonElementType>,
) {
    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // State
    const [isProcessingState, setIsProcessingState] = React.useState<boolean>(isProcessing ?? false);
    const [processingAnimationRunning, setProcessingAnimationRunning] = React.useState<boolean>(false);
    const [processingIconRotation, setProcessingIconRotation] = React.useState<number>(0);
    const [processed, setProcessed] = React.useState<boolean>(false);
    const [processingError, setProcessingError] = React.useState<boolean>(false);
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(tip);

    // Animation - Processing Icon Rotation (plain motion value without spring physics)
    const rotationMotionValue = useMotionValue(0);

    // Memoized
    const disabledValue = React.useMemo(
        function () {
            return disabled ?? false;
        },
        [disabled],
    );
    // Determine if we should show processing spinner animation
    const processingAnimationEnabled = React.useMemo(
        function () {
            return showResultIconAnimation || processingIcon || processingText || isProcessing !== undefined || false;
        },
        [showResultIconAnimation, processingIcon, processingText, isProcessing],
    );

    // Determine if we should show result icons (success/error) after processing
    const resultIconAnimationEnabled = React.useMemo(
        function () {
            return showResultIconAnimation || showProcessedTimeTip || false;
        },
        [showResultIconAnimation, showProcessedTimeTip],
    );

    // Defaults
    const Icon = icon;

    // Function to start processing
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
    const endProcessing = React.useCallback(
        function (processingStartTime: number, hasError: boolean = false) {
            // Calculate the processing time
            const processingEndTime = new Date().getTime();
            const processedTimeInMilliseconds = processingEndTime - processingStartTime;

            // Update tip content if enabled
            if(showProcessedTimeTip) {
                if(hasError) {
                    setTipContent('Error (' + addCommas(processedTimeInMilliseconds) + ' ms' + ')');
                }
                else {
                    setTipContent(addCommas(processedTimeInMilliseconds) + ' ms');
                }
            }

            // Update states
            setIsProcessingState(false);
            setProcessingError(hasError);

            // If result icon animation is enabled, show success/error icon sequence
            if(resultIconAnimationEnabled) {
                setProcessed(true);

                // Wait for success display duration, then start the exit sequence
                processingAnimationTimeoutReference.current = setTimeout(function () {
                    // Trigger check circle scale OUT animation
                    setProcessed(false);

                    // After icon transitions complete, reset animation state
                    processingAnimationRunningTimeoutReference.current = setTimeout(function () {
                        setProcessingAnimationRunning(false);
                    }, animationTimings.iconExitDuration);
                }, animationTimings.successDisplayDuration);

                // Reset the tip content after everything completes
                tipResetTimeoutReference.current = setTimeout(function () {
                    if(showProcessedTimeTip) {
                        setTipContent(tip);
                    }
                }, animationTimings.tipResetDelay);
            }
            else {
                // No result icon animation - just stop immediately
                setProcessed(false);
                setProcessingAnimationRunning(false);
            }
        },
        [showProcessedTimeTip, tip, resultIconAnimationEnabled],
    );

    // Function to intercept the onClick event
    const onClickIntercept = React.useCallback(
        async function (event: React.MouseEvent<HTMLElement>) {
            // If we are showing the processed time tip or the processing animation is enabled
            if(showProcessedTimeTip || processingAnimationEnabled) {
                // Start processing
                const processingStartTime = startProcessing();

                try {
                    // If a click handler is provided, call it
                    if(onClick !== undefined) {
                        await onClick(event);
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
            else if(onClick !== undefined) {
                onClick(event);
            }
        },
        [showProcessedTimeTip, onClick, startProcessing, endProcessing, processingAnimationEnabled],
    );

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
            const processingAnimationRunningTimeout = processingAnimationRunningTimeoutReference.current;
            const processingAnimationTimeout = processingAnimationTimeoutReference.current;
            const tipResetTimeout = tipResetTimeoutReference.current;

            // Listen to changes in the processing property
            if(isProcessing !== undefined) {
                // If the processing state changed
                if(isProcessingState !== isProcessing) {
                    // If processing started
                    if(isProcessing) {
                        startProcessing();
                    }
                    // If processing ended
                    else {
                        endProcessing(processingStartTimeReference.current);
                    }
                }
            }

            // Clear timeouts on unmount
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
        [isProcessing, isProcessingState, startProcessing, endProcessing, disabled],
    );

    // Use the provided icons, or the default icons
    const ProcessingIcon = processingIcon ?? BrokenCircleIcon;
    const ProcessingSuccessIcon = processingSuccessIcon ?? CheckCircleIcon;
    const ProcessingErrorIcon = processingErrorIcon ?? XCircleIcon;

    let content;
    // Set the content of the button to the children
    if(children) {
        content = children;
    }
    // If the children are not provided, and an Icon is provided, use the icon
    else if(Icon) {
        content = <Icon className={mergeClassNames('h-5 w-5', iconClassName)} />;
    }
    // If the children are not provided, and an icon is not provided, and the processing animation is enabled, use the processing icon
    else if(ProcessingIcon && processingAnimationEnabled) {
        content = <ProcessingIcon className="h-5 w-5" />;
    }
    // Otherwise, use nothing
    else {
        content = undefined;
    }

    // If the processing animation is enabled and running
    if(processingAnimationEnabled && processingAnimationRunning) {
        const iconAnimationTransition = {
            duration: animationTimings.iconTransitionDuration,
            ease: animationTimings.iconTransitionEase,
        };

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
            content = children ?? undefined;
        }
        // Otherwise, show the icon
        else {
            content = processingText ? (
                // If text is provided, the icon will be to the right of the text
                <div className="flex w-full items-center justify-between">
                    <div className="invisible h-5 w-5" />
                    <span className="flex-grow px-4 text-center">{processingText}</span>
                    <div className="relative h-5 w-5">{displayIcon}</div>
                </div>
            ) : (
                // If processing text is not provided, just render the icon in the center
                <div className="relative flex h-5 w-5 items-center justify-center">{displayIcon}</div>
            );
        }
    }

    // Prepare button properties to pass to the Button component
    const buttonProperties: ButtonProperties = {
        ...domProperties,
        variant: variant,
        size: size,
        disabled: disabledValue || isProcessingState,
        loading: loading,
        tip: showProcessedTimeTip ? tipContent : tip,
        tipProperties:
            processed && processingAnimationRunning
                ? {
                      ...tipProperties,
                      open: true, // Force tooltip open during success/error display
                  }
                : tipProperties, // Allow normal hover behavior otherwise
        icon: isProcessingState ? undefined : icon,
        iconPosition: iconPosition,
        iconClassName: iconClassName,
        href: href,
        target: target,
        type: type,
        onClick: onClickIntercept,
        className: className,
    };

    // Render the component using the Button component
    return (
        <Button ref={reference} {...buttonProperties}>
            {content}
        </Button>
    );
});

// Set the display name for the component for debugging
AnimatedButton.displayName = 'AnimatedButton';
