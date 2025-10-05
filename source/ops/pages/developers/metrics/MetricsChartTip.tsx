'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Styles
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Utilities
import { addCommas } from '@structure/source/utilities/Number';
import { lightenColor, darkenColor } from '@structure/source/utilities/Color';

// Dependencies - Types
import { tooltipHeaderColumn, tooltipColumn } from './Chart';

// Component - MetricsChartTip
export interface MetricsChartTipProperties {
    active?: boolean;
    label?: string | number;
    payload?: Array<{
        dataKey?: string;
        name?: string;
        value?: number | string;
        color?: string;
        strokeDasharray?: string;
        payload?: Record<string, unknown>;
    }>;
    timeInterval: string;
}

export function MetricsChartTip(properties: MetricsChartTipProperties) {
    const themeSettings = useThemeSettings();

    // Use props directly (recharts passes these to custom tooltip components)
    if(!properties.active || !properties.label || !properties.payload || properties.payload.length === 0) {
        return null;
    }

    return (
        <div className="rounded-extra-small border border-light-4 bg-light dark:border-dark-4 dark:bg-dark">
            <div className="border-b p-2 text-xs text-dark/60 dark:text-light-4/60">
                {tooltipHeaderColumn(properties.timeInterval, properties.label.toString())}
            </div>
            <table className="">
                <tbody className="">
                    {properties.payload.map((payload, index) => (
                        <tr
                            key={index}
                            className={
                                index === properties.payload!.length - 1
                                    ? 'text-xs' // If this is the last row, don't show the border
                                    : 'border-b text-xs'
                            }
                        >
                            <td className="p-2 text-center text-xs">
                                <b>{addCommas(payload.value as number)}</b>
                            </td>
                            <td className="border-l p-2">
                                <div
                                    style={{
                                        borderColor: payload.color,
                                        borderStyle: payload.strokeDasharray == '5 5' ? 'dashed' : 'solid',
                                        backgroundColor:
                                            themeSettings.themeClassName === 'light'
                                                ? lightenColor(payload.color || '', 0.2)
                                                : darkenColor(payload.color || '', 0.2),
                                    }}
                                    className="h-4 w-4 rounded-extra-small border"
                                />
                            </td>
                            {tooltipColumn(properties.timeInterval, {
                                dataKey: payload.dataKey?.toString(),
                                color: payload.color,
                                value: payload.value as number | undefined,
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
