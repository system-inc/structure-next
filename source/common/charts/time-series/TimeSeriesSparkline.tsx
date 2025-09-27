'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Types
export interface TimeSeriesSparklineDataPoint {
    value: number;
}

// Component - TimeSeriesSparkline
export interface TimeSeriesSparklineProperties {
    data: TimeSeriesSparklineDataPoint[];
    className?: string;
    height?: number;
    color?: string;
    strokeWidth?: number;
    gradient?: boolean;
    animate?: boolean;
}
export function TimeSeriesSparkline(properties: TimeSeriesSparklineProperties) {
    // Default values
    const height = properties.height || 60;
    const color = properties.color || '#10b981';
    const strokeWidth = properties.strokeWidth || 2;
    const showGradient = properties.gradient !== false;
    const animate = properties.animate !== false;

    // Generate unique ID for gradient
    const gradientId = React.useId();

    // Render the component
    return (
        <div className={properties.className}>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={properties.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    {showGradient && (
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    )}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        dot={false}
                        fill={showGradient ? `url(#${gradientId})` : 'none'}
                        animationDuration={animate ? 500 : 0}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
