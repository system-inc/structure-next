'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as RadixPopoverPrimitive from '@radix-ui/react-popover';
import { useTransition, animated } from '@react-spring/web';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { Slot } from '@radix-ui/react-slot';
import Link, { LinkProps } from 'next/link';
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
    extends VariantProps<typeof popoverVariants>,
        Omit<React.ComponentPropsWithoutRef<typeof RadixPopoverPrimitive.Content>, 'content'> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: 'start' | 'end' | 'center';
    sideOffset?: number;
    trigger: React.ReactNode;
    content: React.ReactNode;
    modal?: boolean;
}
function Popover(properties: PopoverProperties) {
    const align = properties.align ?? 'center';
    const sideOffset = properties.sideOffset ?? 5;
    const externalOpen = properties.open;
    const externalSetOpen = properties.onOpenChange;
    const modal = properties.modal ?? false;

    const popoverId = React.useId(); // Create a unique ID for the popover

    const [internalOpen, setInternalOpen] = React.useState(false);
    const [open, setOpen] = React.useMemo(() => {
        return externalOpen !== undefined ? [externalOpen, externalSetOpen] : [internalOpen, setInternalOpen];
    }, [externalOpen, externalSetOpen, internalOpen, setInternalOpen]);

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

    // Properties to spread on AnimatedContent
    const animatedContentProperties = { ...properties };
    delete animatedContentProperties.open;
    delete animatedContentProperties.onOpenChange;
    delete animatedContentProperties.onOpenAutoFocus;
    delete animatedContentProperties.align;
    delete animatedContentProperties.sideOffset;
    delete animatedContentProperties.trigger;
    delete animatedContentProperties.content;
    delete animatedContentProperties.modal;

    // const {
    //     open,
    //     onOpenChange,
    //     onOpenAutoFocus,
    //     align,
    //     sideOffset,
    //     trigger,
    //     content,
    //     modal,
    //     ...animatedContentProperties
    // } = properties;

    return (
        <RadixPopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
            <RadixPopoverPrimitive.Trigger asChild>{properties.trigger}</RadixPopoverPrimitive.Trigger>
            {transition(
                (style, show) =>
                    show && (
                        <RadixPopoverPrimitive.Portal forceMount>
                            <AnimatedContent
                                {...(animatedContentProperties as Omit<PopoverProperties, 'content'>)}
                                align={align}
                                sideOffset={sideOffset}
                                style={{ ...style, transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                                className={popoverVariants({ className: properties.className })}
                                onOpenAutoFocus={(event) => {
                                    event.preventDefault(); // Prevent the default behavior of focusing the first focusable element

                                    // We want to use our own logic to focus the first focusable element (including links)
                                    focusFirstFocusableElement(`[data-popover-id="${popoverId}"]`);

                                    if(properties.onOpenAutoFocus) {
                                        properties.onOpenAutoFocus(event);
                                    }
                                }}
                                data-popover-id={popoverId}
                            >
                                {properties.content}
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
    extends VariantProps<typeof popoverItemVariants>,
        React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProperties>((properties, reference) => {
    const Component = properties.asChild ? Slot : 'button';

    // Component properties to spread
    const componentProperties = { ...properties } as Partial<PopoverItemProperties>;
    delete componentProperties.asChild;
    delete componentProperties.className;
    delete componentProperties.children;

    return (
        <Component
            ref={reference}
            className={mergeClassNames(popoverItemVariants({ className: properties.className }))}
            {...componentProperties}
        >
            {properties.children}
        </Component>
    );
});
PopoverItem.displayName = 'PopoverItem';

// POPOVER LINK

interface PopoverLinkProperties extends Omit<PopoverItemProperties, 'asChild'> {
    href: string;
    linkProps?: Omit<LinkProps, 'href' | 'passHref' | 'legacyBehavior'>;
}

const PopoverLink = React.forwardRef<HTMLAnchorElement, PopoverLinkProperties>(function (properties, reference) {
    // PopoverItem properties to spread
    const popoverItemProperties = { ...properties } as Partial<PopoverLinkProperties>;
    delete popoverItemProperties.href;
    delete popoverItemProperties.linkProps;
    delete popoverItemProperties.className;
    delete popoverItemProperties.children;

    return (
        <PopoverItem
            className={mergeClassNames(properties.className, 'block w-full text-left')}
            {...popoverItemProperties}
            asChild
        >
            <Link ref={reference} href={properties.href} {...properties.linkProps}>
                {properties.children}
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
    extends VariantProps<typeof popoverLabelVariants>,
        React.HTMLAttributes<HTMLDivElement> {}
const PopoverLabel = React.forwardRef<HTMLDivElement, PopoverLabelProperties>(function (properties, reference) {
    // Properties to spread on the div
    const divProperties = { ...properties } as Partial<PopoverLabelProperties>;
    delete divProperties.className;

    return (
        <div ref={reference} className={popoverLabelVariants({ className: properties.className })} {...divProperties} />
    );
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
