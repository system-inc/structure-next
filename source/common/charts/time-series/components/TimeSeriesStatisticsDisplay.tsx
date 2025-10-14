// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { TimeSeriesStatistics } from '../utilities/TimeSeriesStatistics';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/type/Number';

// Component - TimeSeriesStatisticsDisplay
export interface TimeSeriesStatisticsDisplayProperties {
    statistics: TimeSeriesStatistics;
    isLoading?: boolean;
    className?: string;
}
export function TimeSeriesStatisticsDisplay(properties: TimeSeriesStatisticsDisplayProperties) {
    // If loading, show loading message
    if(properties.isLoading) {
        return (
            <div className={properties.className}>
                <p className="text-sm text-dark/60 dark:text-light-4/60">Loading statistics...</p>
            </div>
        );
    }

    // Render the component
    return (
        <div className={properties.className}>
            <table>
                <tbody>
                    <tr>
                        <td className="">Count</td>
                        <td className="pl-4">{properties.statistics.count}</td>
                    </tr>
                    <tr>
                        <td className="">Sum</td>
                        <td className="pl-4">{addCommas(properties.statistics.sum)}</td>
                    </tr>
                    <tr>
                        <td className="">Minimum</td>
                        <td className="pl-4">{addCommas(properties.statistics.minimum)}</td>
                    </tr>
                    <tr>
                        <td className="">Maximum</td>
                        <td className="pl-4">{addCommas(properties.statistics.maximum)}</td>
                    </tr>
                    <tr>
                        <td className="">Range</td>
                        <td className="pl-4">{addCommas(properties.statistics.range)}</td>
                    </tr>
                    <tr>
                        <td className="">Average</td>
                        <td className="pl-4">{addCommas(properties.statistics.average)}</td>
                    </tr>
                    <tr>
                        <td className="">Median</td>
                        <td className="pl-4">{addCommas(properties.statistics.median)}</td>
                    </tr>
                    <tr>
                        <td className="">Mode</td>
                        <td className="pl-4">{addCommas(properties.statistics.mode)}</td>
                    </tr>
                    <tr>
                        <td className="">Standard Deviation</td>
                        <td className="pl-4">
                            {addCommas(properties.statistics.standardDeviation)} (
                            {properties.statistics.standardDeviationMessage})
                        </td>
                    </tr>
                    {Array.from(properties.statistics.percentiles.entries()).map(([key, value]) => (
                        <tr key={key}>
                            <td className="">{key}th Percentile</td>
                            <td className="pl-4">{addCommas(value ?? 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
