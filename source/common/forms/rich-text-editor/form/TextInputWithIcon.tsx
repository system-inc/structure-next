import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { Input, InputProps } from './Input';

const textInputWithIconVariants = cva(
    [''], // Defaults
    {
        variants: {
            size: {
                large: ['pl-[3.25rem]'],
            },
        },
        defaultVariants: {
            size: 'large',
        },
    },
);

type TextInputWithIconProps = React.ComponentPropsWithoutRef<'input'> &
    Omit<VariantProps<typeof textInputWithIconVariants>, 'icon'> & {
        icon: React.ReactNode;
    } & InputProps;

const TextInputWithIcon = React.forwardRef<HTMLInputElement, TextInputWithIconProps>(
    ({ className, type, size, icon, ...props }, ref) => {
        return (
            <div className={mergeClassNames('relative w-full', className)}>
                <Input
                    ref={ref}
                    type={type}
                    className={mergeClassNames(textInputWithIconVariants({ size }))}
                    size={size}
                    {...props}
                />
                <div className="text-opsis-content-tetriary pointer-events-none absolute inset-y-0 left-5 flex h-full w-5 items-center">
                    {icon}
                </div>
            </div>
        );
    },
);
TextInputWithIcon.displayName = 'TextInputWithIcon';

export { TextInputWithIcon, type TextInputWithIconProps };
