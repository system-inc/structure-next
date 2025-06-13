'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import { NoticeInterface, Notice } from '@structure/source/common/notifications/Notice';
import { NoticesClearAllButton } from '@structure/source/common/notifications/NoticesClearAllButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { animated, useTransition } from '@react-spring/web';

// Component - NoticeContainer
export interface NoticeContainerProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    notices?: NoticeInterface[];
}
export function NoticeContainer(properties: NoticeContainerProperties) {
    // Constants
    const NOTICES_MARGIN_PX = 16;
    const COLLAPSED_OFFSET_PX = 24;

    // Hooks
    const { removeNotice } = useNotice();

    // State
    const [hovered, setHovered] = React.useState(false);

    // References
    // Weakmap of notices and their refs to calculate the height of the notices
    const noticeReferences = React.useMemo(function () {
        return new WeakMap<NoticeInterface, HTMLDivElement>();
    }, []);
    const fadeReferencesMap = React.useMemo(function () {
        return new WeakMap<NoticeInterface, NodeJS.Timeout>();
    }, []);
    const isClearingAllReference = React.useRef(false);
    const collapseTimeoutReference: React.MutableRefObject<NodeJS.Timeout | undefined> = React.useRef(undefined);

    // Notices
    const propertiesNotices = properties.notices;
    const noticesState = React.useMemo(
        function () {
            return propertiesNotices?.slice().reverse() ?? [];
        },
        [propertiesNotices],
    );

    // Transition for the notices
    const [noticesTransition, noticesTransitionControl] = useTransition(
        noticesState,
        () => ({
            keys: (notice) => notice.id,
            // Initialize the notices animateable properties
            from: { opacity: 0, height: 0, scale: 1, x: 0 },
            // We can return a function that returns a promise with sequenced animations for the enter phase
            enter: (notice) => async (next) => {
                const noticeReference = noticeReferences.get(notice);

                // If the notice reference is not available, skip the animation
                if(!noticeReference) {
                    return;
                }

                // If the notice is the first one in the propertiesNotices array, we should keep the full height
                if(noticesState.indexOf(notice) === 0) {
                    await next({
                        opacity: 1,
                        height: noticeReference.offsetHeight + NOTICES_MARGIN_PX,
                        scale: 1,
                        phase: 'enter',
                    });

                    return;
                }

                // Calculate the height of the notice
                const height = hovered ? noticeReference.offsetHeight + NOTICES_MARGIN_PX : COLLAPSED_OFFSET_PX;

                // Animate the notice
                await next({ opacity: 1, height: height, scale: 1 });
            },
            leave: () => async (next) => {
                // If clearing all, animate out to the righ
                if(isClearingAllReference.current) {
                    await next({
                        opacity: 0,
                        x: 200,
                    });
                    // Delete the notice from the transition ref
                    isClearingAllReference.current = false;
                }
                // Otherwise animate out to the bottom
                else {
                    await next({ opacity: 0, height: 0 });
                }
            },
        }),
        [noticesState, hovered],
    );

    // Function to fade out the notice
    const fadeOutNotice = React.useCallback(
        function (springControl: (typeof noticesTransitionControl.current)[number], notice: NoticeInterface) {
            // If hovered, skip the fade out
            if(hovered) return;

            const delay =
                notice?.dismissTimeout === false
                    ? undefined
                    : typeof notice?.dismissTimeout === 'number'
                      ? notice.dismissTimeout
                      : 3000;

            const timeout = setTimeout(function () {
                // console.log('Fading out notice');

                springControl.start({
                    opacity: 0,
                    height: 0,
                });
            }, delay);

            // Clear the previous timeout if it exists
            if(fadeReferencesMap.has(notice)) {
                const timeout = fadeReferencesMap.get(notice);
                if(timeout) {
                    clearTimeout(timeout);
                }
            }

            fadeReferencesMap.set(notice, timeout);
        },
        [hovered, fadeReferencesMap],
    );

    // Function to collapse the notices
    const collapseNotices = React.useCallback(
        function () {
            // If the clearing all, skip the collapsing animation
            if(isClearingAllReference.current) {
                return;
            }

            noticesTransitionControl.current.map(function (springControl, index) {
                const indexOfNotice = noticesState.findIndex((notice) => notice.id === springControl.item.id);

                if(indexOfNotice === -1) return;

                const notice = noticesState[index];
                if(!notice) {
                    return;
                }

                const noticeReference = noticeReferences.get(notice);
                if(!noticeReference) {
                    return;
                }

                if(indexOfNotice >= 3) {
                    springControl.start({
                        opacity: 0,
                        height: 0,
                        scale: 1 - indexOfNotice * 0.03,
                    });
                }
                else if(indexOfNotice > 0 && indexOfNotice < 3) {
                    springControl.start({
                        opacity: 1,
                        height: COLLAPSED_OFFSET_PX,
                        scale: 1 - indexOfNotice * 0.03,
                    });
                }
                else if(indexOfNotice <= 0) {
                    springControl.start({
                        opacity: 1,
                        height: noticeReference.offsetHeight + NOTICES_MARGIN_PX,
                        scale: 1 - indexOfNotice * 0.03,
                    });
                }

                if(!hovered) {
                    fadeOutNotice(springControl, notice);
                }
            });
        },
        [noticesState, noticeReferences, fadeOutNotice, hovered],
    );

    // Function to expand the notices
    const expandNotices = React.useCallback(
        function () {
            // If clearing all, skip the expanding animation
            if(isClearingAllReference.current) {
                return;
            }

            // Clear the fade out timeouts
            noticesTransitionControl.current.map(function (springControl, index) {
                if(noticesState.findIndex((notice) => notice.id === springControl.item.id) === -1) return;

                const notice = noticesState[index];
                if(!notice) {
                    return;
                }
                const noticeReference = noticeReferences.get(notice);
                if(!noticeReference) {
                    return;
                }

                springControl.start({
                    opacity: 1,
                    height: noticeReference.offsetHeight + NOTICES_MARGIN_PX,
                    scale: 1,
                });
            });
        },
        [noticesState, noticeReferences, noticesTransitionControl],
    );

    // Effect to update the transition springs when the notices change
    React.useEffect(
        function () {
            // Run the transition
            noticesTransitionControl.start();

            // Clear the transition of all springs that are not in the noticesState anymore
            noticesTransitionControl.current.map(function (springControl) {
                if(!noticesState.includes(springControl.item)) {
                    noticesTransitionControl.delete(springControl);
                }
                return;
            });
        },
        [noticesState],
    );

    // Effect to update the transition springs when the hovered state changes
    React.useEffect(
        function () {
            // Update the transition springs
            if(hovered) {
                expandNotices();

                // Clear fade out timeouts
                noticesState.map(function (notice) {
                    const timeout = fadeReferencesMap.get(notice);
                    if(timeout) {
                        console.log('clearing timeout');
                        clearTimeout(timeout);
                    }

                    fadeReferencesMap.delete(notice);
                });
            }
            else {
                // Collapse the notices
                collapseNotices();
            }
        },
        [hovered, expandNotices, collapseNotices, fadeReferencesMap, noticesState],
    );

    // Function to handle mouse enter
    const handleMouseEnter = React.useCallback(
        function () {
            // If clearing all, skip the animation
            if(isClearingAllReference.current) {
                return;
            }

            // Clear the collapse timeout
            if(collapseTimeoutReference) {
                clearTimeout(collapseTimeoutReference.current);
            }

            // Spread the notices to their full height
            expandNotices();

            // Clear fade out timeouts for all notices
            noticesState.forEach(function (notice) {
                const timeout = fadeReferencesMap.get(notice);
                if(timeout) {
                    clearTimeout(timeout);
                    fadeReferencesMap.delete(notice);
                }
            });

            // Set the hovered state
            setHovered(true);
        },
        [expandNotices, fadeReferencesMap, noticesState],
    );

    // Function to handle mouse leave
    const handleMouseLeave = React.useCallback(
        function () {
            // Set the hovered state
            setHovered(false);

            // If the Clear All button is currently being pressed, skip the collapsing animation
            if(isClearingAllReference.current) {
                return;
            }

            // Set a timeout to collapse the notices
            collapseTimeoutReference.current = setTimeout(function () {
                // Collapse the notices
                collapseNotices();
            }, 500);
        },
        [collapseNotices],
    );

    // Function to handle removal of a notice
    const handleRemoval = React.useCallback(
        function (id: string) {
            removeNotice(id);
        },
        [removeNotice],
    );

    // Render the component
    return (
        <div
            tabIndex={0} // Make the menu focusable
            className={mergeClassNames(
                'pointer-events-none fixed bottom-0 right-0 z-50 md:w-[420px]',
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
                    'pointer-events-auto relative top-7 z-50 flex w-full justify-end p-1 pb-0 pr-4 md:pr-8',
                )}
            >
                <NoticesClearAllButton
                    xSpringFunction={function (x: number, onRestFn: () => void) {
                        isClearingAllReference.current = true;

                        noticesTransitionControl.start({
                            x,
                            opacity: 0,
                            onResolve: function () {
                                onRestFn();
                            },
                        });
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
                className="pointer-events-auto relative z-0 flex flex-col-reverse overflow-y-auto overflow-x-hidden border-red-500 pb-4"
                // Handle mouse enter when it enters notices
                onMouseEnter={handleMouseEnter}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                style={{
                    maxHeight: '50vh',
                    paddingTop: NOTICES_MARGIN_PX,
                }}
            >
                {/* Notices */}
                {noticesTransition(function (animation, notice, _, noticeIndex) {
                    return (
                        <animated.div
                            key={notice.id}
                            className={'relative w-full flex-shrink-0 pl-4 pr-4 pt-0 md:pr-8'}
                            style={{ ...animation, zIndex: noticesState.length - noticeIndex }}
                        >
                            <Notice
                                ref={function (reference) {
                                    if(reference) {
                                        noticeReferences.set(notice, reference);
                                    }
                                }}
                                {...notice}
                                closeButtonProperties={{
                                    onClick: async function () {
                                        handleRemoval(notice.id);
                                    },
                                }}
                                buttonProperties={{
                                    content: 'Dismiss',
                                    onClick: async function () {
                                        handleRemoval(notice.id);
                                    },
                                }}
                            />
                        </animated.div>
                    );
                })}
            </div>
        </div>
    );
}
