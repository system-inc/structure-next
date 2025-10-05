'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

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

// Component - Button
export interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof ButtonVariants;
    size?: keyof typeof ButtonSizes;
    loading?: boolean; // The button state is loading
    processing?: {
        state: 'idle' | 'processing' | 'processed' | 'error'; // The button has been pressed and is processing
        text?: string;
        icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        successIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        errorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; // TODO: implement this
    };
    showProcessedTimeTip?: boolean;
    tip?: string | React.ReactNode;
    tipProperties?: Omit<PopoverProperties, 'children' | 'content'>;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    iconClassName?: string;
    type?: 'button' | 'submit' | 'reset' | undefined; // For form buttons, type should be set to submit
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProperties>(function Button(
    {
        variant,
        size,
        disabled,
        loading,
        processing,
        showProcessedTimeTip,
        tip,
        tipProperties,
        icon,
        iconPosition,
        iconClassName,
        type,
        onClick,
        className,
        children,
        ...domProperties
    },
    reference,
) {
    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // State
    const [processingState, setProcessingState] = React.useState<'idle' | 'processing' | 'processed' | 'error'>(
        processing ? processing.state : 'idle',
    );
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(tip);

    const processingAnimationEnabled = typeof processing !== 'undefined';

    // Defaults
    const variantValue = variant || 'default';
    const sizeValue = size || 'default';
    const Icon = icon;

    // Function to start processing
    function startProcessing() {
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

        // Mark the component as processing
        setProcessingState('processing');

        // Track the start time
        const processingStartTime = new Date().getTime();

        // Save the start time in a reference so it can be referenced by the useEffect hook
        processingStartTimeReference.current = processingStartTime;

        return processingStartTime;
    }

    // Function to end processing
    function endProcessing(processingStartTime: number, hasError: boolean = false) {
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

        // Update the processing state
        if(hasError) {
            setProcessingState('error');
        }
        else {
            setProcessingState('processed');
        }

        // Reset the tip content in a little bit longer, allowing the tip animation to finish
        // If the processed time tip is enabled
        if(showProcessedTimeTip) {
            setTipContent(tip);
        }
    }

    // Function to intercept the onClick event
    async function handleClick(event: React.MouseEvent<HTMLElement>) {
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
    }

    React.useEffect(
        function () {
            let timeout: NodeJS.Timeout;

            if(processingState === 'processed') {
                timeout = setTimeout(() => setProcessingState('idle'), 1000);
            }

            return () => clearTimeout(timeout);
        },
        [processingState],
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
    const ProcessingIcon = processing?.icon || BrokenCircleIcon;
    const ProcessingSuccessIcon = processing?.successIcon || undefined;
    const ProcessingErrorIcon = processing?.errorIcon || undefined;

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
    if(typeof processing !== 'undefined') {
        const processingAnimatedDivClassName = 'absolute inset-0 flex h-full w-full items-center justify-center';
        const processingAnimatedDiv = (
            <AnimatePresence mode="popLayout" initial={false}>
                {processingState === 'error' ? (
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
                ) : processingState === 'processed' ? (
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
                        <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.35, repeat: Infinity, type: 'tween', ease: 'linear' }}
                            className="inline-block"
                        >
                            <ProcessingIcon className="h-5 w-5" />
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        );

        // If processed, revert back to the children (unless we have success/error icons to show)
        if(processingState === 'processed' && !processing.successIcon && !ProcessingErrorIcon) {
            content = children ?? undefined;
        }
        // Otherwise, show the processing animation
        else {
            // Set the content of the button to the loader
            content = processing.text ? (
                // If text is provided, the icon will be to the right of the text
                <div className="flex w-full items-center justify-between">
                    <div className="invisible h-5 w-5" />
                    <span className="flex-grow px-4 text-center">{processing.text}</span>
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
        onClick: handleClick,
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
                loading ? (
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
            loading ? (
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
    let component = (
        <button
            ref={reference as React.Ref<HTMLButtonElement>}
            disabled={disabled || processingState === 'processing'}
            type={type}
            {...componentProperties}
        >
            {componentChildren}
        </button>
    );

    // If a tip is provided, wrap the link or button in a tip
    if(tip || (showProcessedTimeTip && processing?.state === 'processed')) {
        component = (
            <Tip
                {...tipProperties}
                open={processing?.state === 'processed'}
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
