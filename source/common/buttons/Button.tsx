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
import { useSpring, animated, easings, useTransition } from '@react-spring/web';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { addCommas } from '@structure/source/utilities/Number';
import { removeProperties } from '@structure/source/utilities/React';

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
    properties: ButtonProperties,
    reference: React.Ref<ButtonElementType>,
) {
    // References
    const processingStartTimeReference = React.useRef<number>(0);
    const processingAnimationTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const processingAnimationRunningTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);
    const tipResetTimeoutReference = React.useRef<NodeJS.Timeout | null>(null);

    // State
    const [processing, setProcessing] = React.useState<boolean>(properties.processing ?? false);
    const [processingAnimationRunning, setProcessingAnimationRunning] = React.useState<boolean>(false);
    const [processingIconRotation, setProcessingIconRotation] = React.useState<number>(0);
    const [processed, setProcessed] = React.useState<boolean>(false);
    const [tipContent, setTipContent] = React.useState<string | React.ReactNode>(properties.tip);

    // Memoized
    const disabled = React.useMemo(
        function () {
            return properties.disabled ?? false;
        },
        [properties.disabled],
    );
    const loading = React.useMemo(
        function () {
            return properties.loading ?? false;
        },
        [properties.loading],
    );
    const processingAnimationEnabled = React.useMemo(
        function () {
            return (
                properties.processingAnimation ||
                properties.processingIcon ||
                properties.processingText ||
                properties.processing !== undefined ||
                false
            );
        },
        [properties.processingAnimation, properties.processingIcon, properties.processingText, properties.processing],
    );

    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';
    const Icon = properties.icon;

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

        // Mark the component as processing
        setProcessing(true);

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
        function (processingStartTime: number) {
            // console.log('End processing');

            // Calculate the processing time
            const processingEndTime = new Date().getTime();
            const processedTimeInMilliseconds = processingEndTime - processingStartTime;
            // console.log('Processing time:', processedTimeInMilliseconds, 'ms');

            // If the processed time tip is enabled
            if(properties.showProcessedTimeTip) {
                // Update tip content to show processing time
                setTipContent(addCommas(processedTimeInMilliseconds) + ' ms');
            }

            // Mark the component as not processing
            setProcessing(false);

            // Update the state to processed
            setProcessed(true);

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
                if(properties.showProcessedTimeTip) {
                    setTipContent(properties.tip);
                }
            }, 1300);
        },
        [properties.showProcessedTimeTip, properties.tip],
    );

    // Function to intercept the onClick event
    const propertiesShowProcessedTimeTip = properties.showProcessedTimeTip;
    const propertiesOnClick = properties.onClick;
    const onClickIntercept = React.useCallback(
        async function (event: React.MouseEvent<HTMLElement>) {
            // If we are showing the processed time tip or the processing animation is enabled
            if(propertiesShowProcessedTimeTip || processingAnimationEnabled) {
                // Start processing
                const processingStartTime = startProcessing();

                // If a click handler is provided, call it
                if(propertiesOnClick !== undefined) {
                    await propertiesOnClick(event);
                }

                // End processing
                endProcessing(processingStartTime);
            }
            // Otherwise, just call the click handler
            else if(propertiesOnClick !== undefined) {
                propertiesOnClick(event);
            }
        },
        [propertiesShowProcessedTimeTip, propertiesOnClick, startProcessing, endProcessing, processingAnimationEnabled],
    );

    // Listen to changes in the processing property allowing the component to be controlled by the parent
    React.useEffect(
        function () {
            // Listen to changes in the processing property
            if(properties.processing !== undefined) {
                // If the processing state changed
                if(processing !== properties.processing) {
                    // If processing started
                    if(properties.processing) {
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
                if(processingAnimationTimeoutReference.current) {
                    clearTimeout(processingAnimationTimeoutReference.current);
                }
                if(tipResetTimeoutReference.current) {
                    clearTimeout(tipResetTimeoutReference.current);
                }
                if(processingAnimationRunningTimeoutReference.current) {
                    clearTimeout(processingAnimationRunningTimeoutReference.current);
                }
            };
        },
        [properties.processing, processing, startProcessing, endProcessing, properties.disabled, disabled],
    );

    // Animation - Processing State Icon Transition
    const processingIconTransition = useTransition(processed, {
        initial: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(0.5)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.5)' },
        config: {
            easing: easings.easeOutQuart,
            duration: 200,
        },
    });

    // Animation - Processing Icon Rotation
    const processingIconRotationSpring = useSpring({
        initial: { rotate: 0 },
        from: { rotate: 0 },
        to: { rotate: processing ? processingIconRotation + 180 : processingIconRotation },
        config: {
            easing: easings.linear,
            duration: 350,
        },
        onRest: () => {
            if(processing) {
                setProcessingIconRotation(processingIconRotation + 180);
            }
            else {
                setProcessingIconRotation(0);

                // Wait a little bit before ending the animation
                processingAnimationRunningTimeoutReference.current = setTimeout(function () {
                    setProcessingAnimationRunning(false);
                }, 500);
            }
        },
    });

    // Use the provided icon, or the default icon
    const ProcessingIcon = properties.processingIcon || BrokenCircleIcon;
    const ProcessingSuccessIcon = properties.processingSuccessIcon ?? undefined;

    let content;
    // Set the content of the button to the children
    if(properties.children) {
        content = properties.children;
    }
    // If the children are not provided, and an Icon is provided, use the icon
    else if(Icon) {
        content = <Icon className={mergeClassNames('h-5 w-5', properties.iconClassName)} />;
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
        const processingAnimatedDiv = processingIconTransition(
            (processingStateTransitionStyle, processingStateTransitionCompleted) =>
                processingStateTransitionCompleted ? (
                    <animated.div
                        style={processingStateTransitionStyle}
                        className={mergeClassNames(processingAnimatedDivClassName, 'text-emerald-500')}
                    >
                        {/* If we have a processing success icon, use it, otherwise show nothing */}
                        {ProcessingSuccessIcon && <ProcessingSuccessIcon className="h-5 w-5" />}
                    </animated.div>
                ) : (
                    <animated.div
                        style={{ ...processingStateTransitionStyle, ...processingIconRotationSpring }}
                        className={mergeClassNames(
                            processingAnimatedDivClassName,
                            'transition-transform duration-500 ease-out',
                        )}
                    >
                        <ProcessingIcon className="h-5 w-5" />
                    </animated.div>
                ),
        );

        // If processed, revert back to the children
        if(processed && !properties.processingSuccessIcon) {
            content = properties.children ?? undefined;
        }
        // Otherwise, show the processing animation
        else {
            // Set the content of the button to the loader
            content = properties.processingText ? (
                // If text is provided, the icon will be to the right of the text
                <div className="flex w-full items-center justify-between">
                    <div className="invisible h-5 w-5" />
                    <span className="flex-grow px-4 text-center">{properties.processingText}</span>
                    <div className="relative h-5 w-5">{processingAnimatedDiv}</div>
                </div>
            ) : (
                // If processing text is not provided, just render the icon in the center
                <div className="relative flex h-5 w-5 items-center justify-center">{processingAnimatedDiv}</div>
            );
        }
    }

    // Separate the DOM properties from the custom properties
    const domProperties = removeProperties(properties, [
        'loading',
        'processing',
        'processingText',
        'processingIcon',
        'processingSuccessIcon',
        'processingAnimation',
        'showProcessedTimeTip',
        'tip',
        'tipProperties',
        'icon',
        'iconPosition',
        'iconClassName',
        'variant',
        'size',
    ]);

    // Determine the component properties
    const componentProperties = {
        ...domProperties,
        className: mergeClassNames(
            ButtonVariants[variant],
            ButtonSizes[size],
            properties.className,
            properties.icon && properties.iconPosition == 'left' ? 'pl-2' : '',
            !properties.icon && properties.iconPosition == 'left' ? 'pl-8' : '',
            properties.iconPosition == 'right' ? 'justify-between' : '',
            properties.className,
        ),
        onClick: onClickIntercept,
    };

    // Determine the component children
    const componentChildren = (
        <>
            {Icon && properties.iconPosition == 'left' && (
                <Icon className={mergeClassNames('mr-2 h-4 w-4', properties.iconClassName)} />
            )}

            {content}

            {variant === 'formInputSelect' ? (
                // The variant is form input select and the button is loading
                loading ? (
                    <>
                        <div className="flex-grow" />
                        <BrokenCircleIcon className="ml-4 h-4 w-4 animate-spin text-neutral+2 dark:text-neutral-2" />
                    </>
                ) : (
                    // The variant is form input select and the button is not loading
                    <>
                        <div className="flex-grow" />
                        <ChevronDownIcon className="ml-4 h-4 w-4 text-neutral+2 dark:text-neutral-2" />
                    </>
                )
            ) : // The variant is not a form input select
            loading ? (
                <>
                    <div className="flex-grow" />
                    <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin text-inherit" />
                </>
            ) : null}

            {Icon && properties.iconPosition == 'right' && (
                <Icon className={mergeClassNames('ml-2 h-4 w-4', properties.iconClassName)} />
            )}
        </>
    );

    // If the button is a link, render an anchor element, otherwise render a button element
    let component = properties.href ? (
        <Link ref={reference as React.Ref<HTMLAnchorElement>} href={properties.href} {...componentProperties}>
            {componentChildren}
        </Link>
    ) : (
        <button
            ref={reference as React.Ref<HTMLButtonElement>}
            disabled={disabled || processing}
            {...componentProperties}
        >
            {componentChildren}
        </button>
    );

    // If a tip is provided, wrap the link or button in a tip
    if(properties.tip || (properties.showProcessedTimeTip && processed && processingAnimationRunning)) {
        component = (
            <Tip
                {...properties.tipProperties}
                open={processed && processingAnimationRunning}
                content={tipContent}
                className={properties.tipProperties?.className}
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

// Export - Default
export default Button;
