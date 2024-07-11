'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';

// Dependencies - Assets
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReportControl
export interface IdeaReportControlInterface {
    className?: string;
}
export function IdeaReportControl(properties: IdeaReportControlInterface) {
    // Render the component
    return (
        <PopoverMenu
            items={[
                {
                    icon: FlagIcon,
                    iconPosition: 'left',
                    content:
                        'Report - this has a popover that has a Report with flag icon which goes through a report flow - see randomseed.com',
                    onClick: function () {
                        console.log('report');
                    },
                },
            ]}
        >
            <IdeaControl className="">
                <EllipsesIcon className="h-4 w-4" />
            </IdeaControl>
        </PopoverMenu>
    );
}

// Export - Default
export default IdeaReportControl;
