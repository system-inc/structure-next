'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { ButtonVariants } from '@structure/source/common/buttons/ButtonVariants';
import { ButtonSizes } from '@structure/source/common/buttons/ButtonSizes';
import { Tip } from '@structure/source/common/popovers/Tip';
import { PopoverProperties } from '@structure/source/common/popovers/Popover';

// Dependencies - Animations
import { motion, AnimatePresence, type Variants, type Transition, cubicBezier } from 'motion/react';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { addCommas } from '@structure/source/utilities/Number';

// Types
export type ButtonElementType = HTMLButtonElement | HTMLAnchorElement;

// Component - Button
export interface ButtonProperties extends React.HTMLAttributes<ButtonElementType> {
    variant?: keyof typeof ButtonVariants;
    size?: keyof typeof ButtonSizes;
    disabled?: boolean;
    loading?: boolean; // The button state is loading
    processing?: boolean; // The button has been pressed and is processing
    processingText?: string;
    processingIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingSuccessIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingErrorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; // TODO: implement this
    processingAnimation?: boolean;
    showProcessedTimeTip?: boolean;
    tip?: string | React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'children' | 'content'>;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    iconClassName?: string;
    href?: string; // Buttons can optionally be rendered as links if an href is set
    target?: string;
    type?: 'button' | 'submit' | 'reset' | undefined; // For form buttons, type should be set to submit
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}
export const Button = React.forwardRef<ButtonElementType, ButtonProperties>(function Button(
    {
        variant,
        size,
        disabled,
        loading,
        processing,
        processingText,
        processingIcon,
        processingSuccessIcon,
        processingErrorIcon,
        processingAnimation,
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
    }: ButtonProperties,
    reference: React.Ref<ButtonElementType>,
) {
    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // State
    const [processingState, setProcessingState] = React.useState<boolean>(processing ?? false);
    const [processingAnimationRunning, setProcessingAnimationRunning] = React.useState<boolean>(false);
    const [processed, setProcessed] = React.useState<boolean>(false);
    const [processingError, setProcessingError] = React.useState<boolean>(false);
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(tip);

    // Memoized
    const disabledValue = React.useMemo(
        function () {
            return disabled ?? false;
        },
        [disabled],
    );
    const loadingValue = React.useMemo(
        function () {
            return loading ?? false;
        },
        [loading],
    );
    const processingAnimationEnabled = React.useMemo(
        function () {
            return processingAnimation || processingIcon || processingText || processing !== undefined || false;
        },
        [processingAnimation, processingIcon, processingText, processing],
    );

    // Defaults
    const variantValue = variant || 'default';
    const sizeValue = size || 'default';
    const Icon = icon;

    // Function to start processing
    const startProcessing = React.useCallback(function () {
        // console.log('Start processing');

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

        // Set the processed state to false
        setProcessed(false);

        // Set the error state to false
        setProcessingError(false);

        // Mark the component as processing
        setProcessingState(true);

        // Start the animation
        setProcessingAnimationRunning(true);

        // Track the time when the processing started
        const processingStartTime = new Date().getTime();

        // Save the start time in a reference so it can be referenced by the useEffect hook
        processingStartTimeReference.current = processingStartTime;

        return processingStartTime;
    }, []);

    // Function to end processing
    const endProcessing = React.useCallback(
        function (processingStartTime: number, hasError: boolean = false) {
            // console.log('End processing');

            // Calculate the processing time
            const processingEndTime = new Date().getTime();
            const processedTimeInMilliseconds = processingEndTime - processingStartTime;
            // console.log('Processing time:', processedTimeInMilliseconds, 'ms');

            // If the processed time tip is enabled
            if(showProcessedTimeTip) {
                // Update tip content to show processing time or error
                if(hasError) {
                    setTipContent('Error occurred');
                }
                else {
                    setTipContent(addCommas(processedTimeInMilliseconds) + ' ms');
                }
            }

            // Mark the component as not processing
            setProcessingState(false);

            // Update the state to processed
            setProcessed(true);

            // Update the error state
            setProcessingError(hasError);

            // Give time for the animation to finish
            processingAnimationTimeoutReference.current = setTimeout(function () {
                // console.log('Processing animation finished');
                // Reset the processed state
                // setProcessed(false);
            }, 1000);

            // Reset the tip content in a little bit longer, allowing the tip animation to finish
            tipResetTimeoutReference.current = setTimeout(function () {
                // console.log('Tip reset animation finished');

                // If the processed time tip is enabled
                if(showProcessedTimeTip) {
                    setTipContent(tip);
                }
            }, 1300);
        },
        [showProcessedTimeTip, tip],
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

    // Listen to changes in the processing property allowing the component to be controlled by the parent
    React.useEffect(
        function () {
            const processingAnimationRunningTimeout = processingAnimationRunningTimeoutReference.current;
            const processingAnimationTimeout = processingAnimationTimeoutReference.current;
            const tipResetTimeout = tipResetTimeoutReference.current;

            // Listen to changes in the processing property
            if(processing !== undefined) {
                // If the processing state changed
                if(processingState !== processing) {
                    // If processing started
                    if(processing) {
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
        [processing, processingState, startProcessing, endProcessing, disabled],
    );

    // Animation - Processing State Icon Transition
    const processingIconVariants: Variants = {
        hidden: { opacity: 0, transform: 'scale(0.5)' },
        show: { opacity: 1, transform: 'scale(1)' },
    };

    const processingIconTransition: Transition = {
        ease: cubicBezier(0.165, 0.84, 0.44, 1),
        duration: 200,
    };

    // Use the provided icon, or the default icon
    const ProcessingIcon = processingIcon || BrokenCircleIcon;
    const ProcessingSuccessIcon = processingSuccessIcon ?? undefined;
    const ProcessingErrorIcon = processingErrorIcon ?? undefined;

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
        const processingAnimatedDivClassName = 'absolute inset-0 flex h-full w-full items-center justify-center';
        const processingAnimatedDiv = (
            <AnimatePresence mode="popLayout" initial={false}>
                {processed && processingError ? (
                    <motion.div
                        key="processing-error"
                        variants={processingIconVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        transition={processingIconTransition}
                        className={mergeClassNames(processingAnimatedDivClassName, 'text-red-500')}
                    >
                        {/* If we have a processing error icon, use it, otherwise show nothing */}
                        {ProcessingErrorIcon && <ProcessingErrorIcon className="h-5 w-5" />}
                    </motion.div>
                ) : processed ? (
                    <motion.div
                        key="processed"
                        variants={processingIconVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        transition={processingIconTransition}
                        className={mergeClassNames(processingAnimatedDivClassName, 'text-emerald-500')}
                    >
                        {/* If we have a processing success icon, use it, otherwise show nothing */}
                        {ProcessingSuccessIcon && <ProcessingSuccessIcon className="h-5 w-5" />}
                    </motion.div>
                ) : (
                    <motion.div
                        key="processing"
                        variants={processingIconVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        transition={processingIconTransition}
                        className={mergeClassNames(processingAnimatedDivClassName)}
                    >
                        <ProcessingIcon className="h-5 w-5 animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>
        );

        // If processed, revert back to the children (unless we have success/error icons to show)
        if(processed && !processingSuccessIcon && !ProcessingErrorIcon) {
            content = children ?? undefined;
        }
        // Otherwise, show the processing animation
        else {
            // Set the content of the button to the loader
            content = processingText ? (
                // If text is provided, the icon will be to the right of the text
                <div className="flex w-full items-center justify-between">
                    <div className="invisible h-5 w-5" />
                    <span className="flex-grow px-4 text-center">{processingText}</span>
                    <div className="relative h-5 w-5">{processingAnimatedDiv}</div>
                </div>
            ) : (
                // If processing text is not provided, just render the icon in the center
                <div className="relative flex h-5 w-5 items-center justify-center">{processingAnimatedDiv}</div>
            );
        }
    }

    // DOM properties are already separated via destructuring

    // Determine the component properties
    const componentProperties = {
        ...domProperties,
        className: mergeClassNames(
            ButtonVariants[variantValue],
            ButtonSizes[sizeValue],
            className,
            icon && iconPosition == 'left' ? 'pl-2' : '',
            !icon && iconPosition == 'left' ? 'pl-8' : '',
            iconPosition == 'right' ? 'justify-between' : '',
            className,
        ),
        onClick: onClickIntercept,
    };

    // Determine the component children
    const componentChildren = (
        <>
            {Icon && iconPosition == 'left' && !processingState && (
                <Icon className={mergeClassNames('mr-2 h-4 w-4', iconClassName)} />
            )}

            {content}

            {variantValue === 'formInputSelect' ? (
                // The variant is form input select and the button is loading
                loadingValue ? (
                    <>
                        <div className="flex-grow" />
                        <BrokenCircleIcon className="text-neutral+2 ml-4 h-4 w-4 animate-spin dark:text-neutral-2" />
                    </>
                ) : (
                    // The variant is form input select and the button is not loading
                    <>
                        <div className="flex-grow" />
                        <ChevronDownIcon className="text-neutral+2 ml-4 h-4 w-4 dark:text-neutral-2" />
                    </>
                )
            ) : // The variant is not a form input select
            loadingValue ? (
                <>
                    <div className="flex-grow" />
                    <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin text-inherit" />
                </>
            ) : null}

            {Icon && iconPosition == 'right' && !processingState && (
                <Icon className={mergeClassNames('ml-2 h-4 w-4', iconClassName)} />
            )}
        </>
    );

    // If the button is a link, render an anchor element, otherwise render a button element
    let component = href ? (
        <Link ref={reference as React.Ref<HTMLAnchorElement>} href={href} target={target} {...componentProperties}>
            {componentChildren}
        </Link>
    ) : (
        <button
            ref={reference as React.Ref<HTMLButtonElement>}
            disabled={disabledValue || processingState}
            type={type}
            {...componentProperties}
        >
            {componentChildren}
        </button>
    );

    // If a tip is provided, wrap the link or button in a tip
    if(tip || (showProcessedTimeTip && processed && processingAnimationRunning)) {
        component = (
            <Tip
                {...tipProperties}
                open={processed && processingAnimationRunning}
                content={tipContent}
                className={tipProperties?.className}
            >
                {component}
            </Tip>
        );
    }

    // Render the component
    return component;
});

// Set the display name for the component for debugging
Button.displayName = 'Button';
