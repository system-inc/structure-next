'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';
import { NoticeInterface, Notice } from '@structure/source/components/notifications/Notice';
import { NoticesClearAllButton } from '@structure/source/components/notifications/NoticesClearAllButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Animations
import { motion, AnimatePresence, type Variants } from 'motion/react';

// Component - NoticeContainer
export interface NoticeContainerProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    notices?: NoticeInterface[];
}
export function NoticeContainer(properties: NoticeContainerProperties) {
    // Constants
    // const NOTICES_MARGIN_PX = 16;
    const collapsedOffestInPixels = 24;

    // Hooks
    const notice = useNotice();

    // State
    const [hovered, setHovered] = React.useState(false);
    const [isClearingAll, setIsClearingAll] = React.useState(false);

    // References
    const noticeReferences = React.useMemo(function () {
        return new WeakMap<NoticeInterface, HTMLDivElement>();
    }, []);

    // Notices
    const propertiesNotices = properties.notices;
    const noticesState = React.useMemo(
        function () {
            return propertiesNotices?.slice().reverse() ?? [];
        },
        [propertiesNotices],
    );

    // Animation variants for notice items
    const noticeVariants: Variants = {
        // Initial hidden state
        hidden: {
            opacity: 0,
            height: 0,
            scale: 1,
            x: 0,
        },

        // Visible but collapsed state (default when not hovered)
        visible: (custom: { index: number }) => ({
            opacity: custom.index >= 3 ? 0 : 1,
            height: custom.index === 0 ? 'auto' : collapsedOffestInPixels,
            scale: 1 - custom.index * 0.03,
            x: 0,
            transition: {
                height: { type: 'spring', visualDuration: 0.25, bounce: 0.1 },
                opacity: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
                scale: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
            },
        }),

        // Expanded state when hovered
        expanded: () => ({
            opacity: 1,
            height: 'auto',
            scale: 1,
            x: 0,
            transition: {
                height: { type: 'spring', visualDuration: 0.25, bounce: 0.1 },
                opacity: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
                scale: { type: 'spring', visualDuration: 0.25, bounce: 0.1 },
            },
        }),

        // Exit state for normal dismissal
        exit: (custom: { isClearingAll: boolean }) => ({
            opacity: 0,
            height: custom.isClearingAll ? 'auto' : 0,
            x: custom.isClearingAll ? undefined : 0,
            transition: {
                height: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
                opacity: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
                x: { type: 'spring', visualDuration: 0.3, bounce: 0.1 },
            },
        }),
    };

    // Auto-dismiss effect
    React.useEffect(
        function () {
            if(hovered) return; // Skip when hovered

            const timeouts: NodeJS.Timeout[] = [];

            noticesState.forEach(function (noticeItem) {
                if(noticeItem.dismissTimeout === false) return;

                const delay = typeof noticeItem.dismissTimeout === 'number' ? noticeItem.dismissTimeout : 3000;

                const timeout = setTimeout(function () {
                    notice.removeNotice(noticeItem.id);
                }, delay);

                timeouts.push(timeout);
            });

            return function () {
                timeouts.forEach(clearTimeout);
            };
        },
        [noticesState, hovered, notice],
    );

    // Function to handle mouse enter
    const handleMouseEnter = React.useCallback(function () {
        // Set the hovered state
        setHovered(true);
    }, []);

    // Function to handle mouse leave
    const handleMouseLeave = React.useCallback(function () {
        // Set the hovered state
        setHovered(false);
    }, []);

    // Function to handle removal of a notice
    const handleRemoval = React.useCallback(
        function (id: string) {
            notice.removeNotice(id);
        },
        [notice],
    );

    // Render the component
    return (
        <div
            tabIndex={0} // Make the menu focusable
            className={mergeClassNames(
                'pointer-events-none fixed right-0 bottom-0 z-50 md:w-[420px]',
                hovered && 'pt-16',
                properties.className,
            )}
            // Handle mouse leave when it leaves the whole container
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
        >
            {/* Clear All Button */}
            <div
                className={mergeClassNames(
                    'pointer-events-auto relative top-7 z-50 flex w-full justify-end p-1 pr-4 pb-2 md:pr-8',
                )}
            >
                <NoticesClearAllButton
                    xSpringFunction={function (x: number, onRestFn: () => void) {
                        setIsClearingAll(true);

                        // Remove all notices
                        noticesState.forEach(function (noticeItem) {
                            notice.removeNotice(noticeItem.id);
                        });

                        // Reset the flag after animation completes
                        setTimeout(function () {
                            setIsClearingAll(false);
                            onRestFn();
                        }, 300);
                    }}
                    show={noticesState.length > 1 && hovered}
                />
            </div>

            {/* Border fade */}
            <div
                className={mergeClassNames(
                    'pointer-events-none relative top-7 z-40 h-7 w-full',
                    // TODO: This doesn't look great on top of content, draws the shadow on top of the content
                    // 'bg-gradient-to-b from-light to-transparent dark:from-dark dark:to-transparent',
                    (!hovered || noticesState.length === 0) && 'hidden',
                )}
            />

            <div
                className="pointer-events-auto relative z-0 flex flex-col-reverse overflow-x-hidden overflow-y-auto border-red-500 pb-4"
                // Handle mouse enter when it enters notices
                onMouseEnter={handleMouseEnter}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                style={{
                    maxHeight: '50vh',
                    paddingTop: 16,
                }}
            >
                {/* Notices */}
                <AnimatePresence mode="sync" initial={false} propagate>
                    {noticesState.map(function (noticeItem, index) {
                        return (
                            <motion.div
                                key={noticeItem.id}
                                custom={{
                                    index: index,
                                    isClearingAll: isClearingAll,
                                }}
                                variants={noticeVariants}
                                initial="hidden"
                                animate={hovered ? 'expanded' : 'visible'}
                                exit={'exit'}
                                layout="position"
                                className={'relative w-full flex-shrink-0 pt-0 pr-4 pl-4 md:pr-8'}
                                style={{ zIndex: noticesState.length - index }}
                            >
                                <div className="pt-4">
                                    <Notice
                                        ref={function (reference) {
                                            if(reference) {
                                                noticeReferences.set(noticeItem, reference);
                                            }
                                        }}
                                        {...noticeItem}
                                        closeButtonProperties={{
                                            onClick: async function () {
                                                handleRemoval(noticeItem.id);
                                            },
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
