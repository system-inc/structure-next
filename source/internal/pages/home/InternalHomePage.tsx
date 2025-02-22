'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import SimpleSvgMap from '@structure/source/common/maps/SimpleSvgMap';
// import PanAndZoomContainer from '@structure/source/common/maps/PanAndZoomContainer';
import HomeMetricLink from '@structure/source/internal/common/dashboard/HomeMetricLink';
import CardLink from '@structure/source/internal/common/dashboard/CardLink';
import ActivityLink from '@structure/source/internal/common/dashboard/ActivityLink';
import TopProductLink from '@structure/source/internal/common/dashboard/TopProductLink';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { EngagementOverviewDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - InternalPage
export function InternalHomePage() {
    // Hooks
    const engagementLiveQueryState = useQuery(EngagementOverviewDocument);

    // List of links to metrics
    const metricLinks = [
        {
            href: '/internal/fulfillment',
            number: 9,
            text: 'orders are ready to fulfill',
        },
        {
            href: '/internal/fulfillment',
            number: 5,
            text: 'payments ready to capture',
        },
        {
            href: '/internal/fulfillment',
            number: 0,
            text: 'products are out of stock',
        },
    ];

    // Render the component
    return (
        <div className="mx-auto flex flex-row px-8 py-6">
            {/* Left column */}
            <div className="flex grow flex-col pr-6">
                <div className="mb-10">
                    {/* <PanAndZoomContainer width={500} height={500} /> */}

                    {/* Engagement */}
                    {engagementLiveQueryState.error && (
                        <div className="text-red-500">Error: {engagementLiveQueryState.error.message}</div>
                    )}
                    {engagementLiveQueryState.loading && <div>Loading...</div>}
                    {engagementLiveQueryState.data && (
                        <>
                            <div className="grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                <div className="flex items-center justify-between">
                                    <h2 className="mb-1 text-base">Users</h2>
                                    <p className="text-base">
                                        {engagementLiveQueryState.data.engagementOverview.uniqueDeviceIds}
                                    </p>
                                </div>
                                <p className="text-xs font-light text-dark-4/75 dark:text-light-4/50">
                                    In the Last 30 Minutes
                                </p>
                            </div>

                            <div className="mt-4 grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                <div className="flex items-center justify-between">
                                    <h2 className="mb-1 text-base">Views</h2>
                                </div>
                                <div className="text-sm text-neutral dark:text-neutral">
                                    <div className="flex justify-between font-medium">
                                        <div>Page</div>
                                        <div>Views</div>
                                    </div>

                                    {engagementLiveQueryState.data.engagementOverview.views.map(function (view) {
                                        return (
                                            <div className="flex justify-between" key={view.viewIdentifier}>
                                                <div>{view.viewIdentifier}</div>
                                                <div>{view.uniqueDeviceCount}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-4 grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
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

                                <div className="text-sm text-neutral dark:text-neutral">
                                    <div className="flex justify-between font-medium">
                                        <div>Location</div>
                                        <div>Count</div>
                                    </div>

                                    {engagementLiveQueryState.data.engagementOverview.locations.map(
                                        function (location, locationIndex) {
                                            return (
                                                <div className="flex justify-between" key={locationIndex}>
                                                    <div>
                                                        {location.latitude}, {location.longitude}{' '}
                                                        <span>({location.countryCode})</span>
                                                    </div>
                                                    <div>{location.uniqueDeviceCount}</div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                                <div className="flex items-center justify-between">
                                    <h2 className="mb-1 text-base">Device Categories</h2>
                                </div>
                                <div className="text-sm text-neutral dark:text-neutral">
                                    <div className="flex justify-between font-medium">
                                        <div>Category</div>
                                        <div>%</div>
                                    </div>

                                    {Object.keys(
                                        engagementLiveQueryState.data.engagementOverview.deviceCategoryPercentages,
                                    ).map(function (category) {
                                        return (
                                            <div className="flex justify-between" key={category}>
                                                <div>{category}</div>
                                                <div>
                                                    {
                                                        engagementLiveQueryState.data?.engagementOverview
                                                            .deviceCategoryPercentages[category]
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Summary */}
                <div className="flex flex-row justify-between gap-3">
                    <CardLink href="/internal/fulfillment" title="Orders" value={'+33 ($3,000)'} date="Today" />
                    <CardLink href="/internal/fulfillment" title="Active Users" value={'4,240'} date="Today" />
                    <CardLink href="/internal/fulfillment" title="New Accounts" value={'+410'} date="Today" />
                </div>

                {/* List of full width links that have a bottom border and a right chevron. When you hover the link hover color is grey */}
                <div className="mt-6 flex flex-col divide-y divide-light-4/75 transition-colors dark:divide-dark-4">
                    {metricLinks.map((link, _id) => (
                        <HomeMetricLink key={_id} href={link.href} number={link.number} text={link.text} />
                    ))}
                </div>

                <div className="mt-6 flex flex-col">
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
                </div>
            </div>

            {/* Right column */}
            <div className="flex min-w-[240px] flex-col border-l border-light-4 pl-6 transition-colors dark:border-l-dark-4">
                <h1 className="text-base">Activity</h1>
                {/* List of activities */}

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
            </div>
        </div>
    );
}

// Export - Default
export default InternalHomePage;
