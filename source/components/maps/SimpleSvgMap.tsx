// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/components/popovers/Tip';

// Dependencies - Assets
import WorldMapMercator from '@structure/source/components/maps/WorldMapMercator.svg';
import CircleFilledIcon from '@structure/assets/icons/shapes/CircleFilledIcon.svg';

// Component - SimpleSvgMap
export interface SimpleSvgMapProperties {
    points: {
        latitude: number;
        longitude: number;
        title?: string;
    }[];
}

export function SimpleSvgMap(properties: SimpleSvgMapProperties) {
    const mapWidth = 2000; // Width of the map image in pixels
    const mapHeight = 1280; // Height of the map image in pixels

    // Calculate the aspect ratio based on the map image dimensions
    const aspectRatio = (mapHeight / mapWidth) * 100;

    // Calculate the x and y coordinates based on the latitude and longitude
    const getCoordinates = function (latitude: number, longitude: number) {
        // Define different offsets and scales for top, bottom, left, and right sides of the map
        const topLatitudeOffset = 335;
        const bottomLatitudeOffset = 320;
        const leftLongitudeOffset = 10;
        const rightLongitudeOffset = 45;
        const scale = 0.94;

        let x, y;

        if(longitude < 0) {
            // Left side of the map
            x = ((((longitude + 180) / 360) * mapWidth * scale + leftLongitudeOffset) / mapWidth) * 100;
        }
        else {
            // Right side of the map
            x = ((((longitude + 180) / 360) * mapWidth * scale + rightLongitudeOffset) / mapWidth) * 100;
        }

        if(latitude < 0) {
            // Bottom side of the map
            y = ((((90 - latitude) / 180) * mapHeight * scale + bottomLatitudeOffset) / mapHeight) * 100;
        }
        else {
            // Top side of the map
            y = ((((90 - latitude) / 180) * mapHeight * scale + topLatitudeOffset) / mapHeight) * 100;
        }

        return { x, y };
    };

    // Render the component
    return (
        <div className="relative h-0 w-full" style={{ paddingBottom: `${aspectRatio}%` }}>
            <WorldMapMercator className="text-neutral+3 absolute top-0 left-0 h-full w-full dark:text-neutral-6" />
            {properties.points.map(function (point, index) {
                // Adjusted and clamped Mercator Projection
                const { x, y } = getCoordinates(point.latitude, point.longitude);
                // console.log(x, y, point.title);

                return (
                    <Tip
                        key={index}
                        content={
                            <div className="p-1 text-xs">
                                {point.latitude}, {point.longitude}, {point.title}
                            </div>
                        }
                        trigger={
                            <div
                                className="absolute h-4 w-4 cursor-pointer text-blue opacity-75"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <CircleFilledIcon className="h-4 w-4" />
                            </div>
                        }
                    />
                );
            })}
        </div>
    );
}
