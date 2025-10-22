// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Component - DevelopersDesignPage
export function DevelopersDesignPage() {
    // Render the component
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />
            <h1>Design System</h1>

            {/* Content Test Div */}
            <div className="mt-4 space-y-1 rounded-lg border border--0 background--0 p-4">
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content---3" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content---3">content---3</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content---2" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content---2">content---2</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content---1" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content---1">content---1</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--0" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--0">content--0</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--1" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--1">content--1</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--2" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--2">content--2</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--3" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--3">content--3</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--4" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--4">content--4</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--5" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--5">content--5</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--6" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--6">content--6</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--7" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--7">content--7</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--8" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--8">content--8</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--9" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--9">content--9</p>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-8 w-8 content--10" fill="currentColor" viewBox="0 0 100 100">
                        <rect width="100" height="100" />
                    </svg>
                    <p className="text-sm content--10">content--10</p>
                </div>
            </div>

            {/* Border Style Test Divs */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="flex h-7 w-full items-center rounded-lg border border---1 background---3 px-3 text-xs content--0">
                    background---3 (white-1000 #ffffff / black-850 #0c0c0c) border---1 (white-750 #ebebeb / black-500
                    #282828)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border---2 background---2 px-3 text-xs content--0">
                    background---2 (white-1000 #ffffff / black-800 #101010) border---2 (white-700 #e7e7e7 / black-450
                    #2c2c2c)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border---1 background---1 px-3 text-xs content--0">
                    background---1 (white-1000 #ffffff / black-750 #141414) border---1 (white-650 #e3e3e3 / black-400
                    #303030)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--0 background--0 px-3 text-xs content--0">
                    background--0 (white-1000 #ffffff / black-700 #181818) border--0 (white-600 #dfdfdf / black-350
                    #343434)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--1 background--1 px-3 text-xs content--0">
                    background--1 (white-950 #fbfbfb / black-650 #1c1c1c) border--1 (white-550 #dbdbdb / black-300
                    #383838)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--2 background--2 px-3 text-xs content--0">
                    background--2 (white-900 #f7f7f7 / black-600 #202020) border--2 (white-500 #d7d7d7 / black-250
                    #3c3c3c)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--3 background--3 px-3 text-xs content--0">
                    background--3 (white-850 #f3f3f3 / black-550 #242424) border--3 (white-450 #d3d3d3 / black-200
                    #404040)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--4 background--4 px-3 text-xs content--0">
                    background--4 (white-800 #efefef / black-500 #282828) border--4 (white-400 #cfcfcf / black-150
                    #444444)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--5 background--5 px-3 text-xs content--0">
                    background--5 (white-750 #ebebeb / black-450 #2c2c2c) border--5 (white-350 #cbcbcb / black-100
                    #484848)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--6 background--6 px-3 text-xs content--0">
                    background--6 (white-700 #e7e7e7 / black-400 #303030) border--6 (white-300 #c7c7c7 / black-50
                    #4c4c4c)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--7 background--7 px-3 text-xs content--0">
                    background--7 (white-650 #e3e3e3 / black-350 #343434) border--7 (white-250 #c3c3c3 / black-0
                    #505050)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--8 background--8 px-3 text-xs content--0">
                    background--8 (white-600 #dfdfdf / black-300 #383838) border--8 (white-200 #bfbfbf / gray-1000
                    #585858)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--9 background--9 px-3 text-xs content--0">
                    background--9 (white-550 #dbdbdb / black-250 #3c3c3c) border--9 (white-150 #bbbbbb / gray-950
                    #5c5c5c)
                </div>
                <div className="flex h-7 w-full items-center rounded-lg border border--10 background--10 px-3 text-xs content--0">
                    background--10 (white-500 #d7d7d7 / black-200 #404040) border--10 (white-100 #b7b7b7 / gray-900
                    #606060)
                </div>
            </div>
        </div>
    );
}
