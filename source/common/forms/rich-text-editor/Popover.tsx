'use client';

import React from 'react';
import { cva, type VariantProps as VariantProperties } from 'class-variance-authority';
import * as RadixPopoverPrimitive from '@radix-ui/react-popover';
import { useTransition, animated } from '@react-spring/web';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { Slot } from '@radix-ui/react-slot';
import Link, { LinkProps as LinkProperties } from 'next/link';
import { focusFirstFocusableElement } from './utilities/focusFirstFocusableElement';

const AnimatedContent = animated(RadixPopoverPrimitive.Content);

// DROPDOWN ROOT
const popoverVariants = cva(
    [
        // Base
        'bg-opsis-background-tetriary rounded-xl w-[272px] p-2 border boder-opsis-border-primary transition-colors',
        // Shadow
        'shadow-04',
    ],
    // Defaults
    {
        variants: {},
        defaultVariants: {},
    },
);

interface PopoverProperties
    extends VariantProperties<typeof popoverVariants>,
        Omit<React.ComponentPropsWithoutRef<typeof RadixPopoverPrimitive.Content>, 'content'> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: 'start' | 'end' | 'center';
    sideOffset?: number;
    trigger: React.ReactNode;
    content: React.ReactNode;
    modal?: boolean;
}
function Popover({
    open: externalOpen,
    onOpenChange: externalSetOpen,
    onOpenAutoFocus,
    align: alignProperty,
    sideOffset: sideOffsetProperty,
    trigger,
    content,
    modal: modalProperty,
    ...animatedContentProperties
}: PopoverProperties) {
    const align = alignProperty ?? 'center';
    const sideOffset = sideOffsetProperty ?? 5;
    const modal = modalProperty ?? false;

    const popoverId = React.useId(); // Create a unique ID for the popover

    const [internalOpen, setInternalOpen] = React.useState(false);
    const [open, setOpen] = React.useMemo(
        function () {
            return externalOpen !== undefined ? [externalOpen, externalSetOpen] : [internalOpen, setInternalOpen];
        },
        [externalOpen, externalSetOpen, internalOpen, setInternalOpen],
    );

    const transition = useTransition(open, {
        initial: {
            opacity: open ? 1 : 0,
            scale: open ? 1 : 0.9,
        },
        from: {
            opacity: 0,
            scale: 0.9,
        },
        enter: {
            opacity: 1,
            scale: 1,
        },
        leave: {
            opacity: 0,
            scale: 0.9,
        },
        config: {
            tension: 400,
            friction: 25,
            mass: 0.2,
        },
    });

    return (
        <RadixPopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
            <RadixPopoverPrimitive.Trigger asChild>{trigger}</RadixPopoverPrimitive.Trigger>
            {transition(
                (style, show) =>
                    show && (
                        <RadixPopoverPrimitive.Portal forceMount>
                            <AnimatedContent
                                {...(animatedContentProperties as Omit<PopoverProperties, 'content'>)}
                                align={align}
                                sideOffset={sideOffset}
                                style={{ ...style, transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                                className={popoverVariants({ className: animatedContentProperties.className })}
                                onOpenAutoFocus={(event) => {
                                    event.preventDefault(); // Prevent the default behavior of focusing the first focusable element

                                    // We want to use our own logic to focus the first focusable element (including links)
                                    focusFirstFocusableElement(`[data-popover-id="${popoverId}"]`);

                                    if(onOpenAutoFocus) {
                                        onOpenAutoFocus(event);
                                    }
                                }}
                                data-popover-id={popoverId}
                            >
                                {content}
                            </AnimatedContent>
                        </RadixPopoverPrimitive.Portal>
                    ),
            )}
        </RadixPopoverPrimitive.Root>
    );
}

// DROPDOWN ITEM
const popoverItemVariants = cva(
    [
        // Base
        'rounded-lg cursor-pointer bg-opsis-background-tetriary transition-colors gap-2',
        // Padding
        'px-3 py-2.5',
        // Hover
        'hover:bg-opsis-background-secondary',
        // Focus
        // 'focus:outline-none focus-visible:bg-opsis-background-secondary',
        // Active
        'active:bg-opsis-action-ghost-pressed',
        // Disabled
        'disabled:opacity-50 disabled:pointer-events-none',
        // Text Defaults
        'text-sm font-medium select-none text-opsis-content-primary',
        // SVG Defaults
        '[&_svg]:size-4 [&_svg]:inline',
    ],
    // Defaults
    {
        variants: {
            // variant: {
            //     primary: ['px-3 py-2.5'],
            // },
        },
        defaultVariants: {
            // variant: 'primary',
        },
    },
);

interface PopoverItemProperties
    extends VariantProperties<typeof popoverItemVariants>,
        React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProperties>(function (
    { asChild, className, children, ...componentProperties },
    reference,
) {
    const Component = asChild ? Slot : 'button';

    return (
        <Component
            ref={reference}
            className={mergeClassNames(popoverItemVariants({ className: className }))}
            {...componentProperties}
        >
            {children}
        </Component>
    );
});
PopoverItem.displayName = 'PopoverItem';

// POPOVER LINK

interface PopoverLinkProperties extends Omit<PopoverItemProperties, 'asChild'> {
    href: string;
    linkProperties?: Omit<LinkProperties, 'href' | 'passHref' | 'legacyBehavior'>;
}

const PopoverLink = React.forwardRef<HTMLAnchorElement, PopoverLinkProperties>(function (
    { href, linkProperties, className, children, ...popoverItemProperties },
    reference,
) {
    return (
        <PopoverItem
            className={mergeClassNames(className, 'block w-full text-left')}
            {...popoverItemProperties}
            asChild
        >
            <Link ref={reference} href={href} {...linkProperties}>
                {children}
            </Link>
        </PopoverItem>
    );
});
PopoverLink.displayName = 'PopoverLink';

// DROPDOWN LABEL
const popoverLabelVariants = cva(['text-opsis-content-primary text-base font-medium px-3 py-2'], {
    variants: {},
    defaultVariants: {},
});

interface PopoverLabelProperties
    extends VariantProperties<typeof popoverLabelVariants>,
        React.HTMLAttributes<HTMLDivElement> {}
const PopoverLabel = React.forwardRef<HTMLDivElement, PopoverLabelProperties>(function (
    { className, ...divProperties },
    reference,
) {
    return <div ref={reference} className={popoverLabelVariants({ className: className })} {...divProperties} />;
});
PopoverLabel.displayName = 'PopoverLabel';

// DROPDOWN SEPARATOR
const PopoverSeparator = () => (
    <hr className="bg-opsis-border-primary my-2 h-px w-full rounded-full transition-colors" />
);

export {
    Popover,
    popoverVariants,
    PopoverItem,
    popoverItemVariants,
    PopoverSeparator,
    PopoverLabel,
    popoverLabelVariants,
    PopoverLink,
};
