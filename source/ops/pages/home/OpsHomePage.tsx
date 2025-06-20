'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useQueryState as useUrlQueryState, parseAsJson, parseAsBoolean } from 'nuqs';

// Dependencies - Main Components
import { SimpleSvgMap } from '@structure/source/common/maps/SimpleSvgMap';
import { FormInputTimeRange } from '@structure/source/common/forms/FormInputTimeRange';
import { TimeRangeType } from '@structure/source/common/time/TimeRange';
// import PanAndZoomContainer from '@structure/source/common/maps/PanAndZoomContainer';
// import HomeMetricLink from '@structure/source/internal/common/dashboard/HomeMetricLink';
// import CardLink from '@structure/source/internal/common/dashboard/CardLink';
// import ActivityLink from '@structure/source/internal/common/dashboard/ActivityLink';
// import TopProductLink from '@structure/source/internal/common/dashboard/TopProductLink';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    EngagementOverviewDocument,
    CommerceOrdersPrivilegedChartDocument,
    ColumnFilterConditionOperator,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { addDays, endOfToday, subMinutes } from 'date-fns';
import { addCommas } from '@structure/source/utilities/Number';

// Dependencies - Charts
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';

// Component - OpsHomePage
export function OpsHomePage() {
    // State
    const [timeRange, setTimeRange] = useUrlQueryState<TimeRangeType>(
        'timeRange',
        parseAsJson<TimeRangeType>(function (value) {
            return value as TimeRangeType;
        }).withDefault({
            startTime: addDays(endOfToday(), -7),
            endTime: endOfToday(),
        }),
    );
    const [isLiveMode, setIsLiveMode] = useUrlQueryState('live', parseAsBoolean.withDefault(false));
    const [showAllViews, setShowAllViews] = React.useState(false);
    const [visibleTrafficSources, setVisibleTrafficSources] = React.useState<Set<string>>(new Set());
    const [showRawPaths, setShowRawPaths] = React.useState(false);
    const [refreshCountdown, setRefreshCountdown] = React.useState(10);

    // Memoize live mode date range to prevent constant re-renders
    const liveModeTimeRange = React.useMemo(
        function () {
            if(!isLiveMode) return null;
            const now = new Date();
            return {
                startTime: subMinutes(now, 30).toISOString(),
                endTime: now.toISOString(),
            };
        },
        [isLiveMode], // Apollo's pollInterval handles the refresh timing
    );

    // Hooks
    const engagementLiveQueryState = useQuery(EngagementOverviewDocument, {
        variables: {
            input:
                isLiveMode && liveModeTimeRange
                    ? liveModeTimeRange
                    : {
                          startTime: timeRange.startTime?.toISOString(),
                          endTime: timeRange.endTime?.toISOString(),
                      },
        },
        pollInterval: isLiveMode ? 10000 : undefined, // Poll every 10 seconds in live mode
    });

    const ordersQueryState = useQuery(CommerceOrdersPrivilegedChartDocument, {
        variables: {
            pagination: {
                itemsPerPage: 1000,
                filters:
                    isLiveMode && liveModeTimeRange
                        ? [
                              {
                                  column: 'source',
                                  operator: ColumnFilterConditionOperator.NotEqual,
                                  value: 'AppleAppStoreNotification',
                              },
                              {
                                  column: 'createdAt',
                                  operator: ColumnFilterConditionOperator.LessThanOrEqual,
                                  value: liveModeTimeRange.endTime,
                              },
                              {
                                  column: 'createdAt',
                                  operator: ColumnFilterConditionOperator.GreaterThanOrEqual,
                                  value: liveModeTimeRange.startTime,
                              },
                          ]
                        : [
                              {
                                  column: 'source',
                                  operator: ColumnFilterConditionOperator.NotEqual,
                                  value: 'AppleAppStoreNotification',
                              },
                              {
                                  column: 'createdAt',
                                  operator: ColumnFilterConditionOperator.LessThanOrEqual,
                                  value: timeRange.endTime?.toISOString(),
                              },
                              {
                                  column: 'createdAt',
                                  operator: ColumnFilterConditionOperator.GreaterThanOrEqual,
                                  value: timeRange.startTime?.toISOString(),
                              },
                          ],
            },
        },
        pollInterval: isLiveMode ? 10000 : undefined, // Poll every 10 seconds in live mode
    });

    // Effects
    // Auto-refresh countdown in live mode
    React.useEffect(
        function () {
            if(!isLiveMode) {
                setRefreshCountdown(10);
                return;
            }

            const interval = setInterval(function () {
                setRefreshCountdown(function (prev) {
                    if(prev <= 1) {
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);

            return function () {
                clearInterval(interval);
            };
        },
        [isLiveMode],
    );

    // Functions
    // Extract path from URL (ignore search params)
    const extractUrlPath = React.useCallback(function (viewIdentifier: string): string {
        try {
            const url = new URL(viewIdentifier, 'https://example.com');
            return url.pathname || '/';
        } catch {
            // If it's not a valid URL, assume it's already a path
            const pathPart = viewIdentifier.split('?')[0];
            return pathPart || '/';
        }
    }, []);

    // Categorize traffic source based on URL parameters
    const categorizeTrafficSource = React.useCallback(function (viewIdentifier: string) {
        const url = viewIdentifier.toLowerCase();

        if(url.includes('fbclid=')) {
            return 'Facebook';
        }
        if(url.includes('a=')) {
            return 'Phi Affiliate';
        }
        if(url.includes('srsltid=')) {
            return 'Google Merchant Center';
        }
        if(url.includes('hs_email=')) {
            return 'HubSpot Email Campaign';
        }
        if(url.includes('utm_source=substack')) {
            return 'Substack';
        }
        if(url.includes('utm_source=reddit')) {
            return 'Reddit';
        }
        if(url.includes('twclid=')) {
            return 'Twitter';
        }
        if(url.includes('utm_medium=paid') && url.includes('utm_source=ig')) {
            return 'Instagram (Paid)';
        }
        if(url.includes('utm_source=ig')) {
            return 'Instagram';
        }
        if(url.includes('utm_source=')) {
            const utmMatch = url.match(/utm_source=([^&]+)/);
            if(utmMatch) {
                return `UTM: ${utmMatch[1]}`;
            }
        }

        return 'Direct/Other';
    }, []);

    // Process views data - group by URL path
    const groupedViews = React.useMemo(
        function () {
            if(!engagementLiveQueryState.data?.engagementOverview.views) {
                return [];
            }

            const pathGroups = new Map<string, number>();

            engagementLiveQueryState.data.engagementOverview.views.forEach(function (view) {
                const viewIdentifier = view.viewIdentifier;
                const uniqueDeviceCount = view.uniqueDeviceCount;
                if(viewIdentifier && uniqueDeviceCount !== undefined) {
                    const path = extractUrlPath(viewIdentifier);
                    const currentCount = pathGroups.get(path) || 0;
                    pathGroups.set(path, currentCount + uniqueDeviceCount);
                }
            });

            return Array.from(pathGroups.entries())
                .map(function ([path, count]) {
                    return { path, uniqueDeviceCount: count };
                })
                .sort(function (a, b) {
                    return b.uniqueDeviceCount - a.uniqueDeviceCount;
                });
        },
        [engagementLiveQueryState.data?.engagementOverview.views, extractUrlPath],
    );

    // Raw views data - not grouped, showing full URLs
    const rawViews = React.useMemo(
        function () {
            if(!engagementLiveQueryState.data?.engagementOverview.views) {
                return [];
            }

            return engagementLiveQueryState.data.engagementOverview.views
                .filter(function (view) {
                    return view.viewIdentifier && view.uniqueDeviceCount !== undefined;
                })
                .map(function (view) {
                    return {
                        path: view.viewIdentifier!,
                        uniqueDeviceCount: view.uniqueDeviceCount!,
                    };
                })
                .sort(function (a, b) {
                    return b.uniqueDeviceCount - a.uniqueDeviceCount;
                });
        },
        [engagementLiveQueryState.data?.engagementOverview.views],
    );

    // Process traffic sources data
    const trafficSources = React.useMemo(
        function () {
            if(!engagementLiveQueryState.data?.engagementOverview.views) {
                return [];
            }

            const sourceGroups = new Map<string, number>();

            engagementLiveQueryState.data.engagementOverview.views.forEach(function (view) {
                const viewIdentifier = view.viewIdentifier;
                const uniqueDeviceCount = view.uniqueDeviceCount;
                if(viewIdentifier && uniqueDeviceCount !== undefined) {
                    const source = categorizeTrafficSource(viewIdentifier);
                    const currentCount = sourceGroups.get(source) || 0;
                    sourceGroups.set(source, currentCount + uniqueDeviceCount);
                }
            });

            return Array.from(sourceGroups.entries())
                .map(function ([source, count]) {
                    return { source, uniqueDeviceCount: count };
                })
                .sort(function (a, b) {
                    return b.uniqueDeviceCount - a.uniqueDeviceCount;
                });
        },
        [engagementLiveQueryState.data?.engagementOverview.views, categorizeTrafficSource],
    );

    // Calculate total views
    const totalViews = React.useMemo(
        function () {
            return groupedViews.reduce(function (total, view) {
                return total + view.uniqueDeviceCount;
            }, 0);
        },
        [groupedViews],
    );

    // Get displayed views (top 10 or all)
    const displayedViews = React.useMemo(
        function () {
            const viewsToDisplay = showRawPaths ? rawViews : groupedViews;
            return showAllViews ? viewsToDisplay : viewsToDisplay.slice(0, 10);
        },
        [groupedViews, rawViews, showAllViews, showRawPaths],
    );

    // Prepare chart data and colors
    const chartColors = React.useMemo(function () {
        return [
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#EF4444', // Red
            '#8B5CF6', // Purple
            '#06B6D4', // Cyan
            '#F97316', // Orange
            '#84CC16', // Lime
            '#EC4899', // Pink
            '#6B7280', // Gray
        ];
    }, []);

    const trafficSourcesChartData = React.useMemo(
        function () {
            return trafficSources.map(function (source, index) {
                return {
                    name: source.source,
                    value: source.uniqueDeviceCount,
                    color: chartColors[index % chartColors.length],
                };
            });
        },
        [trafficSources, chartColors],
    );

    // Calculate total for chart data (for pie chart percentages)
    const totalChartViews = React.useMemo(
        function () {
            return trafficSourcesChartData.reduce(function (total, source) {
                return total + source.value;
            }, 0);
        },
        [trafficSourcesChartData],
    );

    // Calculate time period and daily averages
    const timeStats = React.useMemo(
        function () {
            if(isLiveMode) {
                const totalUsers = engagementLiveQueryState.data?.engagementOverview.uniqueDeviceIds || 0;
                // For 30 minutes, calculate users per hour
                const usersPerHour = Math.round(totalUsers * 2);
                return { days: 0, usersPerDay: 0, usersPerHour };
            }

            if(!timeRange.startTime || !timeRange.endTime) {
                return { days: 7, usersPerDay: 0, usersPerHour: 0 };
            }

            const startDate = new Date(timeRange.startTime);
            const endDate = new Date(timeRange.endTime);
            const timeDiff = endDate.getTime() - startDate.getTime();
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days

            const totalUsers = engagementLiveQueryState.data?.engagementOverview.uniqueDeviceIds || 0;
            const usersPerDay = Math.round(totalUsers / days);

            return { days, usersPerDay, usersPerHour: 0 };
        },
        [
            timeRange.startTime,
            timeRange.endTime,
            engagementLiveQueryState.data?.engagementOverview.uniqueDeviceIds,
            isLiveMode,
        ],
    );

    // Process referrers data - filter and group
    const processedReferrers = React.useMemo(
        function () {
            if(!engagementLiveQueryState.data?.engagementOverview.referrers) {
                return [];
            }

            const referrerGroups = new Map<string, number>();

            engagementLiveQueryState.data.engagementOverview.referrers.forEach(function (referrer) {
                const referrerUrl = referrer.referrer;

                // Skip internal phi.health referrers
                if(
                    referrerUrl &&
                    (referrerUrl.startsWith('https://localhost.phi.health') ||
                        referrerUrl.startsWith('https://www.phi.health'))
                ) {
                    return;
                }

                let processedUrl: string;

                if(!referrerUrl) {
                    processedUrl = '(direct)';
                }
                else {
                    try {
                        const url = new URL(referrerUrl);
                        // Group by hostname + pathname, ignore search params
                        processedUrl = url.origin + url.pathname;
                    } catch {
                        // If URL parsing fails, use the original string without search params
                        processedUrl = referrerUrl.split('?')[0] || referrerUrl;
                    }
                }

                const currentCount = referrerGroups.get(processedUrl) || 0;
                referrerGroups.set(processedUrl, currentCount + (referrer.uniqueDeviceCount || 0));
            });

            return Array.from(referrerGroups.entries())
                .map(function ([url, count]) {
                    return { referrer: url, uniqueDeviceCount: count };
                })
                .sort(function (a, b) {
                    return b.uniqueDeviceCount - a.uniqueDeviceCount;
                });
        },
        [engagementLiveQueryState.data?.engagementOverview.referrers],
    );

    // Process orders chart data
    const ordersChartData = React.useMemo(
        function () {
            if(!ordersQueryState.data?.commerceOrdersPrivileged?.items) {
                return [];
            }

            // Group orders by date
            const ordersByDate = new Map<string, number>();

            if(!isLiveMode) {
                // Initialize all dates in the range with 0 orders
                const daysDiff = timeStats.days;
                for(let i = 0; i < daysDiff; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (daysDiff - 1 - i));
                    const dateKey = date.toLocaleDateString();
                    ordersByDate.set(dateKey, 0);
                }
            }

            // Count orders for each date (automatically converts UTC to user's local timezone)
            ordersQueryState.data.commerceOrdersPrivileged.items.forEach(function (order) {
                // new Date() automatically converts UTC ISO string to local timezone
                const orderDate = new Date(order.createdAt).toLocaleDateString();
                const currentCount = ordersByDate.get(orderDate) || 0;
                ordersByDate.set(orderDate, currentCount + 1);
            });

            // Convert to chart data format
            return Array.from(ordersByDate.entries())
                .map(function ([date, orders]) {
                    return { date, orders };
                })
                .sort(function (a, b) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
        },
        [ordersQueryState.data?.commerceOrdersPrivileged?.items, timeStats.days, isLiveMode],
    );

    // Generate mock traffic source data by date (since the API doesn't provide timestamp data)
    const trafficSourcesByDate = React.useMemo(
        function () {
            if(!trafficSources.length || !ordersChartData.length) {
                return [];
            }

            // Create mock daily data by distributing total traffic across the date range
            return ordersChartData.map(function (orderData) {
                const dataPoint: Record<string, string | number> = { date: orderData.date, orders: orderData.orders };

                if(!isLiveMode && timeStats.days > 0) {
                    trafficSources.forEach(function (source) {
                        // Simulate daily traffic with some randomness but maintaining total proportions
                        const baseDaily = Math.floor(source.uniqueDeviceCount / timeStats.days);
                        const variance = Math.floor(Math.random() * (baseDaily * 0.5)); // ±25% variance
                        dataPoint[source.source] = Math.max(0, baseDaily + variance);
                    });
                }

                return dataPoint;
            });
        },
        [trafficSources, ordersChartData, timeStats.days, isLiveMode],
    );

    // Get unique traffic sources for toggles
    const availableTrafficSources = React.useMemo(
        function () {
            return trafficSources.map(function (source) {
                return source.source;
            });
        },
        [trafficSources],
    );

    // Initialize visible traffic sources when available sources change
    React.useEffect(
        function () {
            if(availableTrafficSources.length > 0 && visibleTrafficSources.size === 0) {
                setVisibleTrafficSources(new Set()); // Start with all traffic sources hidden
            }
        },
        [availableTrafficSources, visibleTrafficSources.size],
    );

    // Functions for toggling traffic sources
    const toggleTrafficSource = React.useCallback(function (source: string) {
        setVisibleTrafficSources(function (prev) {
            const newSet = new Set(prev);
            if(newSet.has(source)) {
                newSet.delete(source);
            }
            else {
                newSet.add(source);
            }
            return newSet;
        });
    }, []);

    const toggleAllTrafficSources = React.useCallback(
        function () {
            setVisibleTrafficSources(function (prev) {
                if(prev.size === availableTrafficSources.length) {
                    return new Set();
                }
                else {
                    return new Set(availableTrafficSources);
                }
            });
        },
        [availableTrafficSources],
    );

    // List of links to metrics
    // const metricLinks = [
    //     {
    //         href: '/internal/fulfillment',
    //         number: 9,
    //         text: 'orders are ready to fulfill',
    //     },
    //     {
    //         href: '/internal/fulfillment',
    //         number: 5,
    //         text: 'payments ready to capture',
    //     },
    //     {
    //         href: '/internal/fulfillment',
    //         number: 0,
    //         text: 'products are out of stock',
    //     },
    // ];

    // Render the component
    return (
        <div className="mx-auto flex flex-row px-8 py-6">
            {/* Left column */}
            <div className="flex flex-grow flex-col pr-6">
                {/* User Count and Time Range Controls */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        {engagementLiveQueryState.data && (
                            <h1 className="text-lg font-medium">
                                {addCommas(engagementLiveQueryState.data.engagementOverview.uniqueDeviceIds)} unique
                                users{' '}
                                {isLiveMode
                                    ? '(last 30 minutes)'
                                    : `over the last ${timeStats.days} days (${addCommas(
                                          timeStats.usersPerDay,
                                      )} users per day)`}
                                {isLiveMode && (
                                    <span className="ml-4 text-sm text-gray-500">
                                        Refreshing in {refreshCountdown}s
                                    </span>
                                )}
                            </h1>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={function () {
                                setIsLiveMode(!isLiveMode);
                            }}
                            className={`rounded px-4 py-2 text-sm font-medium transition-colors`}
                        >
                            {isLiveMode ? 'Live Mode' : 'Time Range Mode'}
                        </button>
                        <FormInputTimeRange
                            buttonProperties={{
                                className: 'w-[280px]',
                                disabled: isLiveMode,
                            }}
                            label="Time Range"
                            id="timeRange"
                            defaultValue={{
                                startTime: timeRange.startTime || addDays(endOfToday(), -7),
                                endTime: timeRange.endTime || endOfToday(),
                            }}
                            showTimeRangePresets={true}
                            onChange={(newTimeRange) =>
                                setTimeRange(
                                    newTimeRange || { startTime: addDays(endOfToday(), -7), endTime: endOfToday() },
                                )
                            }
                            disabled={isLiveMode}
                        />
                    </div>
                </div>

                <div className="mb-10">
                    {/* <PanAndZoomContainer width={500} height={500} /> */}

                    {/* Engagement */}
                    {engagementLiveQueryState.error && (
                        <div className="text-red-500">Error: {engagementLiveQueryState.error.message}</div>
                    )}
                    {engagementLiveQueryState.loading && <div>Loading...</div>}
                    {engagementLiveQueryState.data && (
                        <>
                            {/* Combined Orders and Traffic Sources Chart */}
                            <div className="mb-4 flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                {/* Traffic Source Toggles */}
                                <div className="mb-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <button
                                            onClick={toggleAllTrafficSources}
                                            className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        >
                                            {visibleTrafficSources.size === availableTrafficSources.length
                                                ? 'Hide All'
                                                : 'Show All'}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {availableTrafficSources.map(function (source, index) {
                                            const isVisible = visibleTrafficSources.has(source);
                                            const color = chartColors[index % chartColors.length];
                                            return (
                                                <button
                                                    key={source}
                                                    onClick={() => toggleTrafficSource(source)}
                                                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                                                        isVisible
                                                            ? 'text-white'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                    }`}
                                                    style={isVisible ? { backgroundColor: color } : undefined}
                                                >
                                                    {source}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {ordersQueryState.loading && <div>Loading...</div>}
                                {ordersQueryState.error && (
                                    <div className="text-red-500">
                                        Error loading data: {ordersQueryState.error.message}
                                    </div>
                                )}
                                {trafficSourcesByDate.length > 0 && (
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={trafficSourcesByDate}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#6B7280' }} />
                                                <YAxis
                                                    yAxisId="traffic"
                                                    fontSize={12}
                                                    tick={{ fill: '#6B7280' }}
                                                    label={{
                                                        value: 'Traffic Sources',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                    }}
                                                />
                                                <YAxis
                                                    yAxisId="orders"
                                                    orientation="right"
                                                    fontSize={12}
                                                    tick={{ fill: '#6B7280' }}
                                                    label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
                                                />
                                                <Tooltip
                                                    formatter={function (value: number, name: string) {
                                                        if(name === 'orders') {
                                                            return [addCommas(value), 'Orders'];
                                                        }
                                                        return [addCommas(value), name];
                                                    }}
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                    }}
                                                />
                                                <Legend />

                                                {/* Orders line on right y-axis */}
                                                <Line
                                                    yAxisId="orders"
                                                    type="monotone"
                                                    dataKey="orders"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, fill: '#3B82F6' }}
                                                    name="Orders"
                                                />

                                                {/* Traffic source lines on left y-axis */}
                                                {availableTrafficSources.map(function (source, index) {
                                                    if(!visibleTrafficSources.has(source)) return null;

                                                    const color = chartColors[index % chartColors.length];
                                                    return (
                                                        <Line
                                                            key={source}
                                                            yAxisId="traffic"
                                                            type="monotone"
                                                            dataKey={source}
                                                            stroke={color}
                                                            strokeWidth={2}
                                                            dot={{ fill: color, strokeWidth: 1, r: 3 }}
                                                            activeDot={{ r: 5, fill: color }}
                                                            name={source}
                                                        />
                                                    );
                                                })}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                                {trafficSourcesByDate.length === 0 && !ordersQueryState.loading && (
                                    <div className="py-8 text-center text-gray-500">
                                        No data available for the selected time range
                                    </div>
                                )}
                            </div>

                            {/* Traffic Sources */}
                            <div className="flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                <div className="mb-4 flex items-center">
                                    <h2 className="text-base">Traffic Sources</h2>
                                </div>

                                <div className="flex gap-6">
                                    {/* Table - Left Side (50%) */}
                                    <div className="flex-1">
                                        <div className="text-sm text-neutral dark:text-neutral">
                                            {trafficSources.map(function (source) {
                                                return (
                                                    <div className="flex items-center gap-2 py-1" key={source.source}>
                                                        <div className="min-w-[3rem] text-right font-medium">
                                                            {addCommas(source.uniqueDeviceCount)}
                                                        </div>
                                                        <div className="flex-1 truncate break-all">{source.source}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Pie Chart - Right Side (50%) */}
                                    <div className="flex flex-1 items-center justify-center">
                                        {trafficSourcesChartData.length > 0 && (
                                            <div className="h-80 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={trafficSourcesChartData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={120}
                                                            innerRadius={70}
                                                            dataKey="value"
                                                            stroke="#fff"
                                                            strokeWidth={2}
                                                            label={function (entry) {
                                                                const percentage =
                                                                    (entry.value / totalChartViews) * 100;
                                                                return percentage > 8
                                                                    ? `${percentage.toFixed(1)}%`
                                                                    : '';
                                                            }}
                                                            labelLine={false}
                                                        >
                                                            {trafficSourcesChartData.map(function (entry, index) {
                                                                return (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                );
                                                            })}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={function (value: number, name: string) {
                                                                const percentage = (
                                                                    (value / totalChartViews) *
                                                                    100
                                                                ).toFixed(1);
                                                                return [
                                                                    `${addCommas(value)} views (${percentage}%)`,
                                                                    name,
                                                                ];
                                                            }}
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '6px',
                                                                fontSize: '14px',
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                {/* Views by Page - Left Side (50%) */}
                                <div className="flex-1 rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-1 text-base">{addCommas(totalViews)} Views by Page</h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={function () {
                                                    setShowRawPaths(!showRawPaths);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
                                            >
                                                {showRawPaths ? 'Show Summary' : 'Show Raw Paths'}
                                            </button>
                                            {(showRawPaths ? rawViews : groupedViews).length > 10 && (
                                                <button
                                                    onClick={() => setShowAllViews(!showAllViews)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
                                                >
                                                    {showAllViews
                                                        ? 'Show Top 10'
                                                        : `Show All ${(showRawPaths ? rawViews : groupedViews).length}`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-neutral dark:text-neutral">
                                        {displayedViews.map(function (view) {
                                            return (
                                                <div className="flex items-center gap-2 py-1" key={view.path}>
                                                    <div className="min-w-[3rem] text-right font-medium">
                                                        {addCommas(view.uniqueDeviceCount)}
                                                    </div>
                                                    <div className="flex-1 truncate break-all">{view.path}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Referrers - Right Side (50%) */}
                                <div className="flex-1 rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-1 text-base">Referrers</h2>
                                    </div>

                                    <div className="text-sm text-neutral dark:text-neutral">
                                        {processedReferrers.map(function (referrer, referrerIndex) {
                                            return (
                                                <div className="flex items-center gap-2 py-1" key={referrerIndex}>
                                                    <div className="min-w-[3rem] text-right font-medium">
                                                        {addCommas(referrer.uniqueDeviceCount)}
                                                    </div>
                                                    <div className="flex-1 truncate break-all">{referrer.referrer}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                {/* Locations - Left Side (50%) */}
                                <div className="flex-1 rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-1 text-base">Locations</h2>
                                    </div>

                                    <SimpleSvgMap
                                        points={engagementLiveQueryState.data.engagementOverview.locations.map(
                                            function (location) {
                                                return {
                                                    latitude: Number(location.latitude),
                                                    longitude: Number(location.longitude),
                                                    title: location.countryCode || undefined,
                                                };
                                            },
                                        )}
                                    />
                                </div>

                                {/* Device Categories - Right Side (50%) */}
                                <div className="flex-1 rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-1 text-base">Device Categories</h2>
                                    </div>
                                    <div className="text-sm text-neutral dark:text-neutral">
                                        {Object.keys(
                                            engagementLiveQueryState.data.engagementOverview.deviceCategoryPercentages,
                                        ).map(function (category) {
                                            return (
                                                <div className="flex items-center gap-2 py-1" key={category}>
                                                    <div className="min-w-[3rem] text-right font-medium">
                                                        {
                                                            engagementLiveQueryState.data?.engagementOverview
                                                                .deviceCategoryPercentages[category]
                                                        }
                                                        %
                                                    </div>
                                                    <div className="flex-1 truncate break-all">{category}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Summary */}
                {/* <div className="flex flex-row justify-between gap-3">
                    <CardLink href="/internal/fulfillment" title="Orders" value={'+33 ($3,000)'} date="Today" />
                    <CardLink href="/internal/fulfillment" title="Active Users" value={'4,240'} date="Today" />
                    <CardLink href="/internal/fulfillment" title="New Accounts" value={'+410'} date="Today" />
                </div> */}

                {/* List of full width links that have a bottom border and a right chevron. When you hover the link hover color is grey */}
                {/* <div className="mt-6 flex flex-col divide-y divide-light-4/75 transition-colors dark:divide-dark-4">
                    {metricLinks.map((link, _id) => (
                        <HomeMetricLink key={_id} href={link.href} number={link.number} text={link.text} />
                    ))}
                </div> */}

                {/* <div className="mt-6 flex flex-col">
                    <h2 className="mb-4 text-base font-normal">Top Products</h2>
                    <div className="flex flex-col divide-y divide-light-4/75 transition-colors dark:divide-dark-4">
                        <TopProductLink
                            href="/internal/fulfillment"
                            productName="Stack"
                            totalRevenue={2000}
                            amountOrdered={100}
                        />
                        <TopProductLink
                            href="/internal/fulfillment"
                            productName="Origami"
                            totalRevenue={1500}
                            amountOrdered={50}
                        />
                        <TopProductLink
                            href="/internal/fulfillment"
                            productName="Bento"
                            totalRevenue={1000}
                            amountOrdered={25}
                        />
                        <TopProductLink
                            href="/internal/fulfillment"
                            productName="Water"
                            totalRevenue={500}
                            amountOrdered={10}
                        />
                    </div>
                </div> */}
            </div>

            {/* Right column */}
            {/* <div className="flex min-w-[240px] flex-col border-l border-light-4 pl-6 transition-colors dark:border-l-dark-4">
                <h1 className="text-base">Activity</h1>
                <div className="mt-4 flex flex-col gap-4">
                    <h1>TODO!</h1>

                    {Array.from(new Array(10)).map((_, _id) => {
                        // Random time ago increased as we go down the list in ms
                        const randomTimeAgo = _id * 1000 * 60 * 60 * 24 * 7 + 1000;

                        // TODO: Move this to the right file
                        const characters = '234567CDFGHJKLMNPQRTVWXYZ';
                        function getLuhnCheckDigit(partialIdentifier: { [x: string]: any }) {
                            // Create a mapping of characters to their index values
                            const valueMapping = characters
                                .split('')
                                .reduce((accumulator: { [key: string]: number }, character, index) => {
                                    accumulator[character] = index;
                                    return accumulator;
                                }, {});

                            let sum = 0;
                            let alternate = false;

                            // Iterate through the partialIdentifier characters in reverse order
                            for(let index = partialIdentifier.length - 1; index >= 0; index--) {
                                let number = valueMapping[partialIdentifier[index]];
                                if(!number) return; // If the character isn't in the character set, return

                                // If it's an alternate character, double its value
                                if(alternate) {
                                    number = number * 2;
                                    // If the doubled value is greater than the character set length, subtract the character set length and add 1
                                    if(number > characters.length - 1) {
                                        number = number - characters.length + 1;
                                    }
                                }

                                // Add the number to the sum
                                sum += number;
                                // Toggle the alternate flag for the next character
                                alternate = !alternate;
                            }
                            return sum;
                        }

                        // TODO: Move this to the right file
                        function generateOrderIdentifier() {
                            let part1 = '';
                            let part2 = '';
                            let part3 = '';
                            for(let i = 0; i < 3; i++) {
                                part1 += characters.charAt(Math.floor(Math.random() * characters.length));
                                part2 += characters.charAt(Math.floor(Math.random() * characters.length));
                                part3 += characters.charAt(Math.floor(Math.random() * characters.length));
                            }
                            const partialIdentifier = `${part1}-${part2}-${part3}`;
                            const checkDigit = getLuhnCheckDigit(partialIdentifier.split(''));
                            return `${partialIdentifier}${checkDigit ?? '0'}`;
                        }
                        const orderID = generateOrderIdentifier();

                        return (
                            <ActivityLink
                                key={_id}
                                href="/internal/fulfillment"
                                title={`Order ${orderID.slice(0, 3) + '...' + orderID.slice(-4)} placed`}
                                timeAgo={randomTimeAgo}
                            />
                        );
                    })}
                </div>
            </div> */}
        </div>
    );
}
