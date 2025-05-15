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

interface PopoverProps
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
const Popover = ({
    align = 'center',
    sideOffset = 5,
    open: externalOpen,
    onOpenChange: externalSetOpen,
    content,
    trigger,
    modal = false,
    onOpenAutoFocus = undefined,
    ...props
}: PopoverProps) => {
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

    return (
        <RadixPopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
            <RadixPopoverPrimitive.Trigger asChild>{trigger}</RadixPopoverPrimitive.Trigger>
            {transition(
                (style, show) =>
                    show && (
                        <RadixPopoverPrimitive.Portal forceMount>
                            <AnimatedContent
                                {...props}
                                align={align}
                                sideOffset={sideOffset}
                                style={{ ...style, transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                                className={popoverVariants({ className: props.className })}
                                onOpenAutoFocus={(e) => {
                                    e.preventDefault(); // Prevent the default behavior of focusing the first focusable element

                                    // We want to use our own logic to focus the first focusable element (including links)
                                    focusFirstFocusableElement(`[data-popover-id="${popoverId}"]`);

                                    if(onOpenAutoFocus) {
                                        onOpenAutoFocus(e);
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
};

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

interface PopoverItemProps extends VariantProps<typeof popoverItemVariants>, React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProps>(
    ({ className, asChild, children, ...props }, ref) => {
        const Component = asChild ? Slot : 'button';

        return (
            <Component ref={ref} className={mergeClassNames(popoverItemVariants({ className }))} {...props}>
                {children}
            </Component>
        );
    },
);
PopoverItem.displayName = 'PopoverItem';

// POPOVER LINK

const PopoverLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<PopoverItemProps, 'asChild'> & {
        href: string;
        linkProps?: Omit<LinkProps, 'href' | 'passHref' | 'legacyBehavior'>;
    }
>(({ href, linkProps, className, children, ...props }, ref) => {
    return (
        <PopoverItem className={mergeClassNames(className, 'block w-full text-left')} {...props} asChild>
            <Link ref={ref} href={href} {...linkProps}>
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

interface PopoverLabelProps extends VariantProps<typeof popoverLabelVariants>, React.HTMLAttributes<HTMLDivElement> {}
const PopoverLabel = React.forwardRef<HTMLDivElement, PopoverLabelProps>(({ className, ...props }, ref) => {
    return <div ref={ref} className={popoverLabelVariants({ className })} {...props} />;
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
