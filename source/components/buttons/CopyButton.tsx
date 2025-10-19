// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';
import { NoticeInterface } from '@structure/source/components/notifications/Notice';
import { Button } from '@structure/source/components/buttons/Button';
import type { NonLinkButtonProperties } from '@structure/source/components/buttons/Button';
import { animationTimings, iconAnimationVariants } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Theme
import { buttonTheme as structureButtonTheme } from '@structure/source/components/buttons/ButtonTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Animation
import { motion, AnimatePresence } from 'motion/react';

// Dependencies - Assets
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CopyButton
export type CopyButtonProperties = Omit<NonLinkButtonProperties, 'onClick'> & {
    value: string;
    noticeData?: Omit<NoticeInterface, 'id'>;
};
export function CopyButton({ value, noticeData, className, ...buttonProperties }: CopyButtonProperties) {
    // Hooks
    const notice = useNotice();

    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme
    const buttonTheme = mergeComponentTheme(structureButtonTheme, componentTheme?.Button);

    // Get icon size className from theme based on button size or iconSize property
    const effectiveSize = buttonProperties.iconSize || buttonProperties.size || 'Icon';
    const iconSizeClassName = buttonTheme.iconSizes[effectiveSize];

    // State
    const [valueCopiedToClipboard, setValueCopiedToClipboard] = React.useState(false);

    // Function to copy the value to the clipboard
    const onClick = function () {
        // Copy the value to the clipboard
        navigator.clipboard.writeText(value);

        // Update the state
        setValueCopiedToClipboard(true);

        // Show a notice
        if(noticeData) {
            notice.addNotice(noticeData);
        }

        // Reset the state after a delay
        setTimeout(function () {
            setValueCopiedToClipboard(false);
        }, 1000);
    };

    // Define the transition for icon animations
    const iconAnimationTransition = {
        duration: animationTimings.iconTransitionDuration,
        ease: animationTimings.iconTransitionEase,
    };

    // Animated icon with scale in/out transitions
    const animatedIcon = (
        <AnimatePresence mode="wait" initial={false}>
            {valueCopiedToClipboard ? (
                <motion.div
                    key="check-icon"
                    variants={iconAnimationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={iconAnimationTransition}
                    className="text-emerald-500"
                >
                    {themeIcon(CheckCircledIcon, iconSizeClassName)}
                </motion.div>
            ) : (
                <motion.div
                    key="copy-icon"
                    variants={iconAnimationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={iconAnimationTransition}
                >
                    {themeIcon(CopyIcon, iconSizeClassName)}
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Render the component
    return (
        <Button
            icon={animatedIcon}
            variant="Ghost"
            size="Icon"
            {...buttonProperties}
            onClick={onClick}
            className={mergeClassNames(
                valueCopiedToClipboard && 'bg-light-2 dark:bg-dark-4',
                valueCopiedToClipboard && 'hover:text-emerald-500 dark:hover:text-emerald-500',
                className,
            )}
        />
    );
}
