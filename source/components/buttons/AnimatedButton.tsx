'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';

// Dependencies - Theme
import { buttonTheme as structureButtonTheme } from '@structure/source/components/buttons/ButtonTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Animation
import { motion, animate, AnimatePresence, useMotionValue } from 'motion/react';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/type/Number';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Animation configuration constants
export const animationTimings = {
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
export const iconAnimationVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
} as const;

// Component - AnimatedButton
// Preserves Button icon discriminated union (icon-only, iconLeft+text, iconRight+text, text-only)
// Excludes link variants (href, asChild) since animated buttons are always interactive buttons
// When processing: overrides with animated processing icon
// When not processing: renders normally with icons
export type AnimatedButtonProperties = Omit<NonLinkButtonProperties, 'onClick'> & {
    isProcessing?: boolean;
    processingText?: string;
    processingIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;
    processingSuccessIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;
    processingErrorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;
    showResultIconAnimation?: boolean;
    showProcessedTimeTip?: boolean;
    animateIconPosition?: 'icon' | 'iconLeft' | 'iconRight'; // Which icon slot to animate while keeping children
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
};
export const AnimatedButton = React.forwardRef<HTMLElement, AnimatedButtonProperties>(function AnimatedButton(
    {
        isProcessing,
        processingText,
        processingIcon,
        processingSuccessIcon,
        processingErrorIcon,
        showResultIconAnimation,
        showProcessedTimeTip,
        animateIconPosition,
        onClick,
        ...buttonProperties
    }: AnimatedButtonProperties,
    reference: React.Ref<HTMLElement>,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme
    const buttonTheme = mergeTheme(structureButtonTheme, componentTheme?.Button);

    // Get icon size className from theme based on button size
    const buttonSize = buttonProperties.size || buttonTheme.configuration.defaultVariant.size || 'Base';
    const iconSizeClassName = buttonTheme.iconSizes[buttonSize];

    // State
    const [isProcessingState, setIsProcessingState] = React.useState(isProcessing ?? false);
    const [processingAnimationRunning, setProcessingAnimationRunning] = React.useState(false);
    const [processingIconRotation, setProcessingIconRotation] = React.useState(0);
    const [processed, setProcessed] = React.useState(false);
    const [processingError, setProcessingError] = React.useState(false);
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(buttonProperties.tip);

    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // Animation - Processing Icon Rotation (plain motion value without spring physics)
    const rotationMotionValue = useMotionValue(0);

    // Simple computed values - React Compiler handles memoization
    const disabledValue = buttonProperties.disabled ?? false;
    const processingAnimationEnabled =
        showResultIconAnimation || processingIcon || processingText || isProcessing !== undefined;

    // Memoize this value to ensure stable reference for useCallback dependencies
    const resultIconAnimationEnabled = React.useMemo(
        function () {
            return showResultIconAnimation || showProcessedTimeTip || false;
        },
        [showResultIconAnimation, showProcessedTimeTip],
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
            if(showProcessedTimeTip) {
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
                        setTipContent(buttonProperties.tip);
                    }
                }, animationTimings.tipResetDelay);
            }
            else {
                // No result icon animation - just stop immediately
                setProcessed(false);
                setProcessingAnimationRunning(false);
            }
        },
        [showProcessedTimeTip, buttonProperties.tip, resultIconAnimationEnabled],
    );

    // Function to intercept the onClick event
    async function onClickIntercept(event: React.MouseEvent<HTMLElement>) {
        // If we are showing the processed time tip or the processing animation is enabled
        if(showProcessedTimeTip || processingAnimationEnabled) {
            // Start processing
            const processingStartTime = startProcessing();

            try {
                // If a click handler is provided, call it
                if(onClick) {
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
        else if(onClick) {
            onClick(event);
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

            // Listen to changes in the isProcessing property
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
        [isProcessing, isProcessingState, startProcessing, endProcessing, buttonProperties.disabled],
    );

    // Use the provided icons, or the default icons
    const ProcessingIcon = processingIcon ?? BrokenCircleIcon;
    const ProcessingSuccessIcon = processingSuccessIcon ?? CheckCircleIcon;
    const ProcessingErrorIcon = processingErrorIcon ?? XCircleIcon;

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
                    {themeIcon(ProcessingErrorIcon, iconSizeClassName)}
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
                    {themeIcon(ProcessingSuccessIcon, iconSizeClassName)}
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
                                {themeIcon(ProcessingIcon, iconSizeClassName)}
                            </motion.div>
                        ) : (
                            // Use CSS animation for simple spinner (more performant)
                            <div className="animate-spin">{themeIcon(ProcessingIcon, iconSizeClassName)}</div>
                        )
                    ) : (
                        themeIcon(ProcessingIcon, iconSizeClassName)
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Determine content and icon values based on animation mode
    let content = buttonProperties.children;
    let animatedIcon: NonLinkButtonProperties['icon'] = undefined;
    let animatedIconLeft: NonLinkButtonProperties['iconLeft'] = undefined;
    let animatedIconRight: NonLinkButtonProperties['iconRight'] = undefined;

    // If the processing animation is enabled and running
    if(processingAnimationEnabled && processingAnimationRunning) {
        // If animating a specific icon position, keep children and only replace that icon
        if(animateIconPosition) {
            // Keep children unchanged
            content = buttonProperties.children;

            // Replace the specified icon slot with the animated icon
            if(animateIconPosition === 'icon') {
                animatedIcon = displayIcon;
                animatedIconLeft = buttonProperties.iconLeft;
                animatedIconRight = buttonProperties.iconRight;
            }
            else if(animateIconPosition === 'iconLeft') {
                animatedIcon = buttonProperties.icon;
                animatedIconLeft = displayIcon;
                animatedIconRight = buttonProperties.iconRight;
            }
            else if(animateIconPosition === 'iconRight') {
                animatedIcon = buttonProperties.icon;
                animatedIconLeft = buttonProperties.iconLeft;
                animatedIconRight = displayIcon;
            }
        }
        // Otherwise, use legacy behavior: replace content entirely
        else {
            // If processed, revert back to the children (unless we're showing result icons)
            if(processed && !resultIconAnimationEnabled) {
                content = buttonProperties.children;
            }
            // Otherwise, show the icon
            else {
                content = processingText ? (
                    // If text is provided, the icon will be to the right of the text
                    <div className="flex w-full items-center justify-between">
                        <div className={mergeClassNames('invisible', iconSizeClassName)} />
                        <span className="grow px-4 text-center">{processingText}</span>
                        <div className={mergeClassNames('relative', iconSizeClassName)}>{displayIcon}</div>
                    </div>
                ) : (
                    // If processing text is not provided, just render the icon in the center
                    <div className={mergeClassNames('relative flex items-center justify-center', iconSizeClassName)}>
                        {displayIcon}
                    </div>
                );
            }

            // Clear all icon slots when replacing content entirely
            animatedIcon = undefined;
            animatedIconLeft = undefined;
            animatedIconRight = undefined;
        }
    }
    else {
        // Not processing - use original icons
        animatedIcon = buttonProperties.icon;
        animatedIconLeft = buttonProperties.iconLeft;
        animatedIconRight = buttonProperties.iconRight;
    }

    // Render the component
    return (
        <Button
            ref={reference}
            {...buttonProperties}
            disabled={disabledValue || isProcessingState}
            tip={showProcessedTimeTip ? tipContent : buttonProperties.tip}
            tipProperties={
                processed && processingAnimationRunning
                    ? { ...buttonProperties.tipProperties, open: true }
                    : buttonProperties.tipProperties
            }
            onClick={onClickIntercept}
            icon={animatedIcon}
            iconLeft={animatedIconLeft}
            iconRight={animatedIconRight}
        >
            {content}
        </Button>
    );
});

// Set the display name on the component for debugging
AnimatedButton.displayName = 'AnimatedButton';
