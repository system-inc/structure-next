// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { ButtonVariants } from '@structure/source/common/buttons/ButtonVariants';
import { ButtonSizes } from '@structure/source/common/buttons/ButtonSizes';
import { Tip } from '@structure/source/common/popovers/Tip';
import { PopoverProperties } from '@structure/source/common/popovers/Popover';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Types
export type ButtonElementType = HTMLButtonElement | HTMLAnchorElement;

// Component - Button
export interface ButtonProperties extends React.HTMLAttributes<ButtonElementType> {
    variant?: keyof typeof ButtonVariants;
    size?: keyof typeof ButtonSizes;
    disabled?: boolean;
    loading?: boolean;
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

    // Defaults
    const variantValue = variant || 'default';
    const sizeValue = size || 'default';
    const Icon = icon;

    let content;
    // Set the content of the button to the children
    if(children) {
        content = children;
    }
    // If the children are not provided, and an Icon is provided, use the icon
    else if(Icon) {
        content = <Icon className={mergeClassNames('h-5 w-5', iconClassName)} />;
    }
    // Otherwise, use nothing
    else {
        content = undefined;
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
        onClick: onClick,
    };

    // Determine the component children
    const componentChildren = (
        <>
            {Icon && iconPosition == 'left' && <Icon className={mergeClassNames('mr-2 h-4 w-4', iconClassName)} />}

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

            {Icon && iconPosition == 'right' && <Icon className={mergeClassNames('ml-2 h-4 w-4', iconClassName)} />}
        </>
    );

    // If the button is a link, render an anchor element, otherwise render a button element
    let component = href ? (
        <Link
            ref={reference as React.Ref<HTMLAnchorElement>}
            href={href}
            target={target}
            aria-disabled={disabledValue ? 'true' : undefined}
            {...componentProperties}
            onClick={disabledValue ? (event) => event.preventDefault() : onClick}
        >
            {componentChildren}
        </Link>
    ) : (
        <button
            ref={reference as React.Ref<HTMLButtonElement>}
            disabled={disabledValue}
            type={type}
            {...componentProperties}
        >
            {componentChildren}
        </button>
    );

    // If a tip is provided, wrap the link or button in a tip
    if(tip) {
        component = (
            <Tip {...tipProperties} content={tip} className={tipProperties?.className}>
                {component}
            </Tip>
        );
    }

    // Render the component
    return component;
});

// Set the display name for the component for debugging
Button.displayName = 'Button';
