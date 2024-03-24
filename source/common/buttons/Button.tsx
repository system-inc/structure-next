'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Tip } from '@structure/source/common/popovers/Tip';
import { PopoverInterface } from '@structure/source/common/popovers/Popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';
import { addCommas } from '@structure/source/utilities/Number';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Animations
import { useSpring, animated, easings, useTransition } from '@react-spring/web';

// Classes - Button

// Common button styles: flex container, interaction behavior, and focus styles
const commonButton =
    // Layout and container
    `inline-flex items-center whitespace-nowrap select-none ` +
    // Disabled states
    `disabled:cursor-not-allowed disabled:opacity-75 ` +
    // Animation
    `transition-colors`;

// Centered button styles: alignment, sizing, and shape
const centeredButton =
    // Layout and container
    `justify-center rounded-md ` +
    // Content
    `text-sm font-medium`;

// Focus styles
const focusStyle =
    // Focus
    `focus:border focus:border-light-6 dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`;

// Hover styles: background and text color changes on hover
const hoverStyle =
    // Hover
    `hover:bg-dark-5 dark:hover:bg-dark-3 ` +
    // Disabled
    `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2`;

// Active styles: background color changes when active
const activeStyle = `active:bg-dark-3 dark:active:bg-dark-4`;

// Variants - Button
export const ButtonVariants = {
    // Default variant: standard background and text color
    default:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Dark text on light background
        `border bg-light dark:bg-dark+2 hover:bg-light-1 dark:hover:bg-dark-1 disabled:hover:bg-light ` +
        // Disabled and active states
        `dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
    // Unstyled variant: no styles
    unstyled: ``,
    // Light variant: light background and border with hover and active states
    light:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Dark text on light background
        `border bg-light-1 dark:bg-light-2 text-dark dark:text-dark hover:bg-light dark:hover:bg-light ` +
        // Disabled states
        `disabled:hover:bg-light-1 dark:disabled:hover:bg-light-2 ` +
        // Active states
        `active:bg-light-2 dark:active:bg-light-3`,
    // Contrast variant: constrasted background
    contrast:
        `${commonButton} ${focusStyle} ${centeredButton} ${hoverStyle} ${activeStyle} ` +
        // Light text on dark background
        `text-white dark:text-light-2 bg-dark-2 dark:bg-dark-2 ` +
        // Border matches background
        `border border-dark-2 dark:border-dark-2`,
    // Ghost variant: transparent with accent color on hover
    ghost:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Rounded and hover
        `rounded-md hover:bg-accent hover:text-accent-foreground`,
    ghostDestructive:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Rounded and hover
        `rounded-md hover:bg-accent hover:text-accent-foreground ` +
        // Color, hover, and active states
        `text-neutral+6 hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,
    // Destructive variant: styles for negative actions like delete or remove
    destructive:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Text, background, and hover
        `bg-destructive text-destructive-foreground hover:bg-destructive/90`,
    // Toggle on
    toggleOn:
        `${commonButton} ${centeredButton} ` +
        // Toggled on
        `rounded-md border border-neutral+6 dark:border-dark-6 bg-light-2 dark:bg-dark-2`,
    // Toggle off
    toggleOff:
        `${commonButton} ${centeredButton} ` +
        // Toggled off
        `rounded-md border border-light-6 dark:border-dark-4`,
    // Menu Item variant: styles for menu items
    menuItem:
        `relative flex items-center justify-start text-sm font-normal cursor-default rounded-sm ` +
        // Focus states
        `focus-border-none focus-visible:outline-none ` +
        // Highlighted states
        `data-[highlighted=true]:bg-light-2 data-[highlighted=true]:dark:bg-dark-3 ` +
        // Active states
        `data-[highlighted=true]:active:bg-light-3 data-[highlighted=true]:dark:active:bg-dark-4 ` +
        // Disabled states
        `disabled:opacity-50`,
    formInputCheckbox:
        `${commonButton} ` +
        // Layout and sizing
        `flex items-center justify-center content-center ` +
        // Border
        `rounded-sm border border-light-6 dark:border-light ` +
        // Text and background
        `bg-light text-dark dark:bg-dark+2 dark:text-light ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-1 ` +
        // Active
        `active:bg-light-3 dark:active:bg-dark-4 ` +
        // Disabled
        `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
        // Focus
        `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`,
    // Form Input Select variant: styles for buttons which trigger a popover menu for selecting an option
    formInputSelect:
        `${commonButton} ` +
        // Text
        `text-sm ` +
        // Layout and sizing
        ` ` +
        // Border
        `rounded-md border border-light-6 dark:border-dark-3 ` +
        // Light text on dark background
        `bg-light text-dark dark:bg-dark+2 dark:text-light ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-1 ` +
        // Active
        `active:bg-light-3 dark:active:bg-dark-4 ` +
        // Disabled
        `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
        // Focus
        `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`,
    tableHeaderCell:
        `${commonButton} ` +
        // Text
        `text-xs font-normal text-neutral-2 dark:text-neutral+5 hover:-text-dark dark:hover:text-light ` +
        // Text and background
        // `hover:bg-light-1 dark:hover:bg-dark-3 disabled:hover:bg-light ` +
        // Disabled and active states
        // `dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
        ``,
};

// Button - Sizes
export const ButtonSizes = {
    default: 'max-w-[380px] h-9 px-4 py-2',
    unstyled: '',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'relative h-9 w-9',
    menuItem: 'pt-1.5 pr-3 pb-1.5 pl-3',
    formInputCheckbox: 'h-4 w-4',
    formInputSelect: 'px-4 h-9',
    formInputIcon: 'relative h-9 w-9',
    tableHeaderCell: 'h-8',
};

// Component - Button
export interface ButtonInterface extends React.HTMLAttributes<HTMLElement> {
    variant?: keyof typeof ButtonVariants;
    size?: keyof typeof ButtonSizes;
    disabled?: boolean;
    loading?: boolean;
    processing?: boolean;
    processingText?: string;
    processingIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingSuccessIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    processingErrorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; // TODO: implement this
    processingAnimation?: boolean;
    showProcessedTimeTip?: boolean;
    tip?: string | React.ReactNode;
    tipProperties?: Omit<PopoverInterface, 'children' | 'content'>;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    iconClassName?: string;
    href?: string; // Buttons can optionally be rendered as links if an href is set
    target?: string;
    type?: 'button' | 'submit' | 'reset' | undefined; // For form buttons, type should be set to submit
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}
export const Button = React.forwardRef<HTMLElement, ButtonInterface>(function (
    properties: ButtonInterface,
    reference: React.Ref<any>,
) {
    // References which persist across renders
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

    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';
    const Icon = properties.icon;

    // The processing animation is enabled directly or indirectly by setting the processing icon, processing text, or by providing the processing property
    const processingAnimationEnabled =
        properties.processingAnimation ??
        properties.processingIcon ??
        properties.processingText ??
        properties.processing !== undefined ??
        false;

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

        // Set the processed state to false
        setProcessed(false);

        // Mark the component as processing
        setProcessing(true);

        // Start the animation
        setProcessingAnimationRunning(true);

        // Track the time when the processing started
        let processingStartTime = new Date().getTime();

        // Save the start time in a reference so it can be referenced by the useEffect hook
        processingStartTimeReference.current = processingStartTime;

        return processingStartTime;
    }

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
                console.log('Processing animation finished');

                // Reset the processed state
                // setProcessed(false);
            }, 1000);

            // Reset the tip content in a little bit longer, allowing the tip animation to finish
            tipResetTimeoutReference.current = setTimeout(function () {
                console.log('Tip reset animation finished');

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
            // If we are showing the processed time tip
            if(propertiesShowProcessedTimeTip) {
                // Start processing
                let processingStartTime = startProcessing();

                // If a click handler is provided, call it
                if(propertiesOnClick !== undefined) {
                    await propertiesOnClick(event);
                }

                // End processing
                endProcessing(processingStartTime);
            }
            // Otherwise
            else {
                if(propertiesOnClick !== undefined) {
                    propertiesOnClick(event);
                }
            }
        },
        [propertiesShowProcessedTimeTip, propertiesOnClick, endProcessing],
    );

    // Listen to changes in the processing property allowing the component to be controlled by the parent
    React.useEffect(
        function () {
            if(properties.processing !== undefined) {
                // If the processing state changed
                if(properties.processing !== processing) {
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
            return () => {
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
        [properties.processing, processing, endProcessing],
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
        let processingAnimatedDivClassName = 'absolute inset-0 flex h-full w-full items-center justify-center';
        let processingAnimatedDiv = processingIconTransition(
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

        // If processed and no success icon is provided, revert back to the children
        if(!properties.disabled && processed && !properties.processingSuccessIcon) {
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

    // If asChild is true, render a slot instead of a button
    const Component = properties.href ? Link : 'button';

    // Separate the non-DOM properties from DOM properties
    const {
        loading: loadingProperty,
        processing: processingProperty,
        processingText: processingTextProperty,
        processingIcon: processingIconProperty,
        processingSuccessIcon: processingSuccessIconProperty,
        processingAnimation: processingAnimationProperty,
        showProcessedTimeTip: showProcessedTimeTipProperty,
        tip: tipProperty,
        tipProperties: tipPropertiesProperty,
        icon: iconProperty,
        iconPosition: iconPositionProperty,
        iconClassName: iconClassNameProperty,
        variant: variantProperty,
        size: sizeProperty,
        ...domProperties
    } = properties;

    // If icon is defined and size is not "icon" and iconPosition is not defined, log a warning to the console
    if(iconProperty && size !== 'icon' && !iconPositionProperty) {
        console.warn(
            'A button icon is provided, but the size is not "icon" and the iconPosition is not defined. The icon will not be rendered unless a position is defined or the size is set to "icon".',
            'Warning found in Button component: ',
            properties.id ?? properties.title ?? properties.children ?? properties,
            'Properties: ',
            properties,
            'Parent Element: ',
            properties.id ? document.getElementById(properties.id)?.parentElement : 'Not found',
        );
    }

    // Render the button
    let component = (
        <Component
            {...domProperties}
            ref={reference}
            className={mergeClassNames(
                ButtonVariants[variant],
                ButtonSizes[size],
                properties.className,
                properties.icon && properties.iconPosition == 'left' ? 'pl-2' : '',
                !properties.icon && properties.iconPosition == 'left' ? 'pl-8' : '',
                properties.iconPosition == 'right' ? 'justify-between' : '',
            )}
            // <Link> components cannot be disabled, otherwise set the disabled state
            disabled={Component == Link ? undefined : properties.disabled || processing}
            href={properties.href ?? ''} // Use an empty string if href is not provided
            onClick={onClickIntercept}
        >
            {Icon && properties.iconPosition == 'left' && (
                <Icon className={mergeClassNames('mr-2 h-4 w-4', properties.iconClassName)} />
            )}
            {content}
            {properties.loading && (
                <>
                    <div className="flex-grow" />
                    <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin text-inherit" />
                </>
            )}

            {variant === 'formInputSelect' &&
                (properties.loading ? (
                    <>
                        <div className="flex-grow" />
                        <BrokenCircleIcon className="ml-4 h-4 w-4 animate-spin text-neutral+2 dark:text-neutral-2" />
                    </>
                ) : (
                    <>
                        <div className="flex-grow" />
                        <ChevronDownIcon className="ml-4 h-4 w-4 text-neutral+2 dark:text-neutral-2" />
                    </>
                ))}
            {Icon && properties.iconPosition == 'right' && (
                <Icon className={mergeClassNames('ml-2 h-4 w-4', properties.iconClassName)} />
            )}
        </Component>
    );

    // console.log('tipContent', tipContent);

    // If a tip is provided, wrap the button in a tip
    if(properties.tip || (properties.showProcessedTimeTip && processed && processingAnimationRunning)) {
        component = (
            <Tip
                {...properties.tipProperties}
                open={processed && processingAnimationRunning}
                content={tipContent}
                className={mergeClassNames('px-2 py-1 text-xs', properties.tipProperties?.className)}
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
