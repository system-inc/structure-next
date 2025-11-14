'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotifications } from '@structure/source/components/notifications/NotificationsProvider';
import { NotificationInterface, Notification } from '@structure/source/components/notifications/Notification';
import { NotificationsClearAllButton } from '@structure/source/components/notifications/NotificationsClearAllButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Animations
import { motion, AnimatePresence, type Variants } from 'motion/react';

// Component - NotificationsContainer
export interface NotificationsContainerProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    notifications?: NotificationInterface[];
}
export function NotificationsContainer(properties: NotificationsContainerProperties) {
    // Constants
    const collapsedOffestInPixels = 24;

    // Hooks
    const notifications = useNotifications();

    // State
    const [hovered, setHovered] = React.useState(false);
    const [isClearingAll, setIsClearingAll] = React.useState(false);

    // References
    const notificationsReferences = React.useMemo(function () {
        return new WeakMap<NotificationInterface, HTMLDivElement>();
    }, []);

    // Notifications
    const propertiesNotifications = properties.notifications;
    const notificationsState = React.useMemo(
        function () {
            return propertiesNotifications?.slice().reverse() ?? [];
        },
        [propertiesNotifications],
    );

    // Animation variants for notification items
    const notificationVariants: Variants = {
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

            notificationsState.forEach(function (notificationItem) {
                if(notificationItem.dismissTimeout === false) return;

                const delay =
                    typeof notificationItem.dismissTimeout === 'number' ? notificationItem.dismissTimeout : 3000;

                const timeout = setTimeout(function () {
                    notifications.removeNotification(notificationItem.id);
                }, delay);

                timeouts.push(timeout);
            });

            // Cleanup timeouts on unmount or when dependencies change
            return function () {
                timeouts.forEach(clearTimeout);
            };
        },
        [notificationsState, hovered, notifications],
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

    // Function to handle removal of a notification
    const handleRemoval = React.useCallback(
        function (id: string) {
            notifications.removeNotification(id);
        },
        [notifications],
    );

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'pointer-events-none fixed right-0 bottom-0 z-50 md:w-[420px]',
                hovered && 'pt-16',
                properties.className,
            )}
            // Handle mouse leave when it leaves the whole container
            onMouseLeave={handleMouseLeave}
        >
            {/* Clear All Button */}
            <div
                className={mergeClassNames(
                    'relative z-50 flex w-full justify-end pt-6 pr-4 md:pr-8',
                    notificationsState.length === 0 ? 'pointer-events-none' : 'pointer-events-auto',
                )}
            >
                <NotificationsClearAllButton
                    xSpringFunction={function (x: number, onRestFn: () => void) {
                        setIsClearingAll(true);

                        // Remove all notifications
                        notificationsState.forEach(function (notification) {
                            notifications.removeNotification(notification.id);
                        });

                        // Reset the flag after animation completes
                        setTimeout(function () {
                            setIsClearingAll(false);
                            onRestFn();
                        }, 300);
                    }}
                    show={notificationsState.length > 1 && hovered}
                />
            </div>

            <div
                className={mergeClassNames(
                    'relative z-0 flex h-auto max-h-[50vh] flex-col-reverse overflow-x-hidden overflow-y-auto pt-2 pb-2',
                    notificationsState.length === 0 ? 'pointer-events-none' : 'pointer-events-auto',
                )}
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black 100%)',
                }}
                onMouseEnter={handleMouseEnter}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
            >
                {/* Notifications */}
                <AnimatePresence mode="sync" initial={false} propagate>
                    {notificationsState.map(function (notification, index) {
                        return (
                            <motion.div
                                key={notification.id}
                                custom={{
                                    index: index,
                                    isClearingAll: isClearingAll,
                                }}
                                variants={notificationVariants}
                                initial="hidden"
                                animate={hovered ? 'expanded' : 'visible'}
                                exit={'exit'}
                                layout="position"
                                className={'relative w-full shrink-0 pr-4 pl-4 md:pr-8'}
                                style={{ zIndex: notificationsState.length - index }}
                            >
                                <div className="pt-2 pb-2">
                                    <Notification
                                        ref={function (reference) {
                                            if(reference) {
                                                notificationsReferences.set(notification, reference);
                                            }
                                        }}
                                        {...notification}
                                        closeButtonProperties={{
                                            onClick: async function () {
                                                handleRemoval(notification.id);
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
