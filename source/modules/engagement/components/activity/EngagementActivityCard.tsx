'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { VisitorActivityInterface } from '@structure/source/modules/engagement/components/activity/EngagementActivity';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';

// Dependencies - Animation
import { motion, AnimatePresence, cubicBezier } from 'motion/react';

// Dependencies - Assets
import {
    AppleLogoIcon,
    AndroidLogoIcon,
    WindowsLogoIcon,
    LinuxLogoIcon,
    DesktopIcon,
    DeviceMobileSpeakerIcon,
    DeviceTabletSpeakerIcon,
    GoogleChromeLogoIcon,
    CompassIcon,
    FireIcon,
    GlobeIcon,
    YoutubeLogoIcon,
    InstagramLogoIcon,
    XLogoIcon,
    RedditLogoIcon,
    FacebookLogoIcon,
    GoogleLogoIcon,
    LinkedinLogoIcon,
    MetaLogoIcon,
    PinterestLogoIcon,
} from '@phosphor-icons/react';

// Dependencies - Utilities
import {
    getPlatformIconType,
    getDeviceTypeIconType,
    getReferrerIconType,
    getReferrerName,
    truncatePath,
    calculateSessionDuration,
    formatTimeAgo,
} from './utilities/EngagementActivityUtilities';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - EngagementActivityCard
export interface EngagementActivityCardProperties {
    visitorActivity: VisitorActivityInterface;
    isNew?: boolean;
    wasUpdated?: boolean;
    visitorId: string; // Required for using layout animations for the components.
}
export function EngagementActivityCard(properties: EngagementActivityCardProperties) {
    // State
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    // Effects - Update current time every second for live duration updates
    React.useEffect(function () {
        const interval = setInterval(function () {
            setCurrentTime(new Date());
        }, 5000);
        return function () {
            clearInterval(interval);
        };
    }, []);

    // Extract data from visitor activity
    const platformIconType = getPlatformIconType(properties.visitorActivity.device?.operatingSystem);
    const deviceTypeIconType = getDeviceTypeIconType(
        properties.visitorActivity.device?.deviceCategory,
        properties.visitorActivity.device?.operatingSystem,
    );
    const referrerIconType = getReferrerIconType(properties.visitorActivity.referrer);
    const referrerName = getReferrerName(properties.visitorActivity.referrer);
    const currentPath = truncatePath(properties.visitorActivity.currentPage);
    // Calculate session duration from first event to now (not first to last event)
    // Uses currentTime state that updates every second for live ticking
    const sessionDuration = calculateSessionDuration(
        properties.visitorActivity.sessionStart,
        currentTime.toISOString(),
    );

    // Get entrance page from oldest event
    const oldestEvent = properties.visitorActivity.events[properties.visitorActivity.events.length - 1];
    const entrancePage = oldestEvent?.viewIdentifier?.split('?')[0] || '/';

    // Check if visitor has added to cart
    const hasAddedToCart = properties.visitorActivity.events.some(function (event) {
        return event.name === 'AddToCart';
    });

    // Determine which browser icon to show
    const browserName = properties.visitorActivity.device?.client || '';
    const browserLower = browserName.toLowerCase();
    let BrowserIcon: typeof GlobeIcon = GlobeIcon;

    if(browserLower.includes('chrome')) {
        BrowserIcon = GoogleChromeLogoIcon;
    }
    else if(browserLower.includes('safari')) {
        BrowserIcon = CompassIcon;
    }
    else if(browserLower.includes('firefox')) {
        BrowserIcon = FireIcon;
    }

    // Determine which platform icon to show
    let PlatformIcon: typeof AppleLogoIcon | null = null;
    if(platformIconType === 'apple') {
        PlatformIcon = AppleLogoIcon;
    }
    else if(platformIconType === 'android') {
        PlatformIcon = AndroidLogoIcon;
    }
    else if(platformIconType === 'windows') {
        PlatformIcon = WindowsLogoIcon;
    }
    else if(platformIconType === 'linux') {
        PlatformIcon = LinuxLogoIcon;
    }

    // Determine which device type icon to show
    let DeviceTypeIcon: typeof DesktopIcon | null = null;
    if(deviceTypeIconType === 'desktop') {
        DeviceTypeIcon = DesktopIcon;
    }
    else if(deviceTypeIconType === 'mobile') {
        DeviceTypeIcon = DeviceMobileSpeakerIcon;
    }
    else if(deviceTypeIconType === 'tablet') {
        DeviceTypeIcon = DeviceTabletSpeakerIcon;
    }

    // Check if this is a Meta ad (Facebook/Instagram ad campaign)
    const isMetaAd =
        properties.visitorActivity.attribution?.includes(' Ad') &&
        (referrerIconType === 'facebook' || referrerIconType === 'instagram');

    // Determine which referrer icon to show
    let ReferrerIcon: typeof YoutubeLogoIcon | null = null;
    let referrerDisplayText: string | null = null;

    if(isMetaAd) {
        ReferrerIcon = MetaLogoIcon;
        referrerDisplayText = properties.visitorActivity.attribution || null;
    }
    else if(referrerIconType === 'youtube') {
        ReferrerIcon = YoutubeLogoIcon;
    }
    else if(referrerIconType === 'instagram') {
        ReferrerIcon = InstagramLogoIcon;
    }
    else if(referrerIconType === 'x') {
        ReferrerIcon = XLogoIcon;
    }
    else if(referrerIconType === 'reddit') {
        ReferrerIcon = RedditLogoIcon;
    }
    else if(referrerIconType === 'facebook') {
        ReferrerIcon = FacebookLogoIcon;
    }
    else if(referrerIconType === 'google') {
        ReferrerIcon = GoogleLogoIcon;
    }
    else if(referrerIconType === 'linkedin') {
        ReferrerIcon = LinkedinLogoIcon;
    }
    else if(referrerIconType === 'pinterest') {
        ReferrerIcon = PinterestLogoIcon;
    }

    // Render the component
    return (
        <motion.div
            layout
            layoutId={properties.visitorId}
            initial={properties.isNew ? { opacity: 0, y: -20, scale: 0.95 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            }}
            onClick={function () {
                setIsExpanded(!isExpanded);
            }}
            className={mergeClassNames(
                'max-w-80 cursor-pointer rounded-lg border p-3 transition-colors',
                hasAddedToCart
                    ? 'border--positive'
                    : isExpanded
                      ? 'border--3 background--1'
                      : 'border--0 hover:border--2 active:border--4',
            )}
        >
            {/* Top row: Location with browser, platform, and device type icons */}
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium content--1">
                    {properties.visitorActivity.location}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                    <BrowserIcon className="h-3.5 w-3.5 content--2" />
                    {PlatformIcon && <PlatformIcon className="h-3.5 w-3.5 content--2" />}
                    {DeviceTypeIcon && <DeviceTypeIcon className="h-4 w-4 content--2" />}
                </div>
            </div>

            {/* Current page + event count */}
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1 truncate font-mono text-xs content--informative">{currentPath}</div>
                <div className="shrink-0 text-xs content--2">
                    {properties.visitorActivity.pageCount}{' '}
                    {properties.visitorActivity.pageCount === 1 ? 'event' : 'events'}
                </div>
            </div>

            {/* Expanded state: Journey timeline */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: cubicBezier(0.075, 0.82, 0.165, 1) }}
                    >
                        <div className="pb-2">
                            <ScrollArea className="max-h-64">
                                <div className="pr-0">
                                    {properties.visitorActivity.events.map(function (event, index) {
                                        const path = truncatePath(event.viewIdentifier);
                                        const events = properties.visitorActivity.events;
                                        const isFirstEvent = index === 0; // Most recent (events are sorted newest first)
                                        const isLastEvent = index === events.length - 1; // Oldest/entrance

                                        // Determine the time display:
                                        // - First event (most recent): time ago
                                        // - Last event (entrance): time ago
                                        // - Middle events: delta from previous event (the one after in array since sorted newest first)
                                        let timeDisplay: string;
                                        if(isFirstEvent || isLastEvent) {
                                            timeDisplay = formatTimeAgo(event.createdAt);
                                        }
                                        else {
                                            // Calculate delta from the previous event (next in array = older event)
                                            const previousEvent = events[index + 1];
                                            if(previousEvent) {
                                                timeDisplay = calculateSessionDuration(
                                                    previousEvent.createdAt,
                                                    event.createdAt,
                                                );
                                            }
                                            else {
                                                timeDisplay = formatTimeAgo(event.createdAt);
                                            }
                                        }
                                        const isAddToCart = event.name === 'AddToCart';
                                        const isPageLeave = event.name === 'PageLeave';
                                        const isSectionView = event.name === 'SectionView';
                                        const isOrderScheduleSelect = event.name === 'OrderScheduleSelect';
                                        const isAccordionItemExpand = event.name === 'AccordionItemExpand';

                                        // Get section info for SectionView events
                                        const sectionIdentifier =
                                            event.data?.eventContext?.additionalData?.sectionIdentifier;

                                        // Get order schedule for OrderScheduleSelect events
                                        const orderSchedule = event.data?.eventContext?.additionalData?.orderSchedule;

                                        // Get accordion item identifier for AccordionItemExpand events
                                        const accordionItemIdentifier =
                                            event.data?.eventContext?.additionalData?.accordionItemIdentifier;

                                        // Get page duration for PageLeave events (supports both new and old naming)
                                        const pageDurationInMilliseconds =
                                            event.data?.eventContext?.additionalData?.pageDurationInMilliseconds ??
                                            event.data?.eventContext?.additionalData?.viewDurationInMilliseconds;
                                        const viewDuration =
                                            isPageLeave && pageDurationInMilliseconds
                                                ? calculateSessionDuration(pageDurationInMilliseconds as number)
                                                : null;

                                        // Determine the icon/prefix for the event
                                        let eventIcon = '→';
                                        if(isPageLeave) {
                                            eventIcon = '←';
                                        }
                                        else if(isSectionView) {
                                            eventIcon = '◇';
                                        }
                                        else if(isOrderScheduleSelect) {
                                            eventIcon = '⏱';
                                        }
                                        else if(isAccordionItemExpand) {
                                            eventIcon = '▼';
                                        }

                                        // Determine the display text
                                        let displayText = path;
                                        if(isAddToCart) {
                                            displayText = `🛒 ${path}`;
                                        }
                                        else if(isPageLeave) {
                                            displayText = `${path}${viewDuration ? ` (${viewDuration})` : ''}`;
                                        }
                                        else if(isSectionView && sectionIdentifier) {
                                            displayText = `#${sectionIdentifier}`;
                                        }
                                        else if(isOrderScheduleSelect && orderSchedule) {
                                            displayText = `schedule: ${orderSchedule}`;
                                        }
                                        else if(isAccordionItemExpand && accordionItemIdentifier) {
                                            displayText = `faq: ${accordionItemIdentifier}`;
                                        }

                                        return (
                                            <div key={event.id} className="flex items-center gap-2 py-0.5 text-xs">
                                                <span className="content--2">{eventIcon}</span>
                                                <span
                                                    className={mergeClassNames(
                                                        'min-w-0 flex-1 truncate font-mono',
                                                        isAddToCart
                                                            ? 'font-semibold content--positive'
                                                            : isPageLeave
                                                              ? 'content--2'
                                                              : isSectionView
                                                                ? 'content--3'
                                                                : isOrderScheduleSelect
                                                                  ? 'content--warning'
                                                                  : isAccordionItemExpand
                                                                    ? 'content--3'
                                                                    : 'content--informative',
                                                    )}
                                                >
                                                    {displayText}
                                                </span>
                                                <span className="shrink-0 content--2">{timeDisplay}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom row: Referrer source + Attribution/Path on left, Session duration on right */}
            <div className="flex items-center justify-between gap-2 text-xs content--2">
                <div className="flex items-center gap-1.5 truncate content--2">
                    {ReferrerIcon ? (
                        <ReferrerIcon className="h-3.5 w-3.5 shrink-0" />
                    ) : referrerName ? (
                        <span className="shrink-0">{referrerName}</span>
                    ) : null}
                    {(ReferrerIcon || referrerName) && (referrerDisplayText || entrancePage) && (
                        <span className="shrink-0">•</span>
                    )}
                    {referrerDisplayText ? (
                        <span className="truncate">{referrerDisplayText}</span>
                    ) : entrancePage ? (
                        <span className="truncate font-mono">{entrancePage}</span>
                    ) : null}
                </div>
                <span className="shrink-0 content--2">{sessionDuration}</span>
            </div>
        </motion.div>
    );
}
