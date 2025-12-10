'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { DeviceActivityInterface } from '@structure/source/modules/engagement/components/activity/EngagementActivity';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { Link } from '@structure/source/components/navigation/Link';

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
    ArrowSquareOutIcon,
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
import {
    engagementEventRegistry,
    getEventDisplayText,
    EngagementEventName,
} from '@structure/source/modules/engagement/types/EngagementEventDefinitions';

// Component - EngagementActivityCard
export interface EngagementActivityCardProperties {
    className?: string;
    deviceActivity: DeviceActivityInterface;
    isNew?: boolean;
    wasUpdated?: boolean;
    deviceId: string; // Required for using layout animations for the components.
    truncatePaths?: boolean; // Whether to truncate long paths (default: true for sidebar, false for full-width)
    defaultExpanded?: boolean; // Whether the card should be expanded by default
}
export function EngagementActivityCard(properties: EngagementActivityCardProperties) {
    // State
    const [isExpanded, setIsExpanded] = React.useState(properties.defaultExpanded ?? false);
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

    // Extract data from device activity
    const platformIconType = getPlatformIconType(properties.deviceActivity.device?.operatingSystem);
    const deviceTypeIconType = getDeviceTypeIconType(
        properties.deviceActivity.device?.deviceCategory,
        properties.deviceActivity.device?.operatingSystem,
    );
    const referrerIconType = getReferrerIconType(properties.deviceActivity.referrer);
    const referrerName = getReferrerName(properties.deviceActivity.referrer);
    const shouldTruncate = properties.truncatePaths !== false;
    const currentPath = shouldTruncate
        ? truncatePath(properties.deviceActivity.currentPage)
        : properties.deviceActivity.currentPage || '/';
    // Calculate session duration from first event to now (not first to last event)
    // Uses currentTime state that updates every second for live ticking
    const sessionDuration = calculateSessionDuration(properties.deviceActivity.sessionStart, currentTime.toISOString());

    // Get entrance page from oldest event
    const oldestEvent = properties.deviceActivity.events[properties.deviceActivity.events.length - 1];
    const entrancePage = oldestEvent?.viewIdentifier?.split('?')[0] || '/';

    // Check if device has added to cart
    const hasAddedToCart = properties.deviceActivity.events.some(function (event) {
        return event.name === 'AddToCart';
    });

    // Determine which browser icon to show
    const browserName = properties.deviceActivity.device?.client || '';
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
        properties.deviceActivity.attribution?.includes(' Ad') &&
        (referrerIconType === 'facebook' || referrerIconType === 'instagram');

    // Determine which referrer icon to show
    let ReferrerIcon: typeof YoutubeLogoIcon | null = null;
    let referrerDisplayText: string | null = null;

    if(isMetaAd) {
        ReferrerIcon = MetaLogoIcon;
        referrerDisplayText = properties.deviceActivity.attribution || null;
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
            layoutId={properties.deviceId}
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
                'cursor-pointer rounded-lg border p-3 transition-colors',
                hasAddedToCart
                    ? 'border--positive'
                    : isExpanded
                      ? 'border--3 background--1'
                      : 'border--0 hover:border--2 active:border--4',
                properties.className,
            )}
        >
            {/* Top row: Location with browser, platform, device type icons, and link */}
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium content--1">
                    {properties.deviceActivity.location}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                    <BrowserIcon className="h-3.5 w-3.5 content--2" />
                    {PlatformIcon && <PlatformIcon className="h-3.5 w-3.5 content--2" />}
                    {DeviceTypeIcon && <DeviceTypeIcon className="h-4 w-4 content--2" />}
                    <Link
                        href={`/ops/analytics/sessions/devices/${properties.deviceId}`}
                        onClick={function (event) {
                            event.stopPropagation();
                        }}
                        className="content--2 transition-colors hover:content--0"
                    >
                        <ArrowSquareOutIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Current page + event count */}
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1 truncate font-mono text-xs content--informative">{currentPath}</div>
                <div className="shrink-0 text-xs content--2">
                    {properties.deviceActivity.pageCount}{' '}
                    {properties.deviceActivity.pageCount === 1 ? 'event' : 'events'}
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
                            <ScrollArea className={shouldTruncate ? 'max-h-64' : undefined}>
                                <div className="pr-0">
                                    {properties.deviceActivity.events.map(function (event, index) {
                                        const events = properties.deviceActivity.events;
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

                                        // Normalize event name for backward compatibility
                                        // AccordionItemExpand -> AccordionExpand, OrderScheduleSelect -> ToggleChange
                                        let normalizedEventName = event.name;
                                        if(event.name === 'AccordionItemExpand') {
                                            normalizedEventName = 'AccordionExpand';
                                        }
                                        else if(event.name === 'OrderScheduleSelect') {
                                            normalizedEventName = 'ToggleChange';
                                        }

                                        // Get event rendering info from registry
                                        const eventRegistryEntry =
                                            engagementEventRegistry[normalizedEventName as EngagementEventName];

                                        // Use registry values with fallbacks for unknown events
                                        const eventIcon = eventRegistryEntry?.icon || '→';
                                        const colorClass = eventRegistryEntry?.colorClass || 'content--informative';

                                        // Get the path for display
                                        const path = shouldTruncate
                                            ? truncatePath(event.viewIdentifier)
                                            : event.viewIdentifier || '/';

                                        // Get display text using the centralized function
                                        const eventData = event.data?.eventContext?.additionalData || {};
                                        const displayText = getEventDisplayText(
                                            normalizedEventName,
                                            eventData as Record<string, unknown>,
                                            path,
                                        );

                                        // Special case: AddToCart gets bold styling
                                        const isAddToCart = event.name === 'AddToCart';

                                        return (
                                            <div key={event.id} className="flex items-center gap-2 py-0.5 text-xs">
                                                <span className="content--2">{eventIcon}</span>
                                                <span
                                                    className={mergeClassNames(
                                                        'min-w-0 flex-1 truncate font-mono',
                                                        isAddToCart ? 'font-semibold' : '',
                                                        colorClass,
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
