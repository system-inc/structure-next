'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';
import { IdeaReportDialog } from '@structure/source/modules/idea/common/idea/controls/IdeaReportDialog';

// Dependencies - Assets
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaReportControl
export interface IdeaReportControlInterface {
    className?: string;
    ideaId: string;
    ideaTitle: string;
}
export function IdeaReportControl(properties: IdeaReportControlInterface) {
    // State
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);

    // Render the component
    return (
        <>
            <PopoverMenu
                items={[
                    {
                        icon: FlagIcon,
                        iconPosition: 'left',
                        content: 'Report',
                        onSelected: function () {
                            setReportDialogOpen(true);
                        },
                    },
                ]}
            >
                <IdeaControl className="">
                    <EllipsesIcon className="h-4 w-4" />
                </IdeaControl>
            </PopoverMenu>

            <IdeaReportDialog
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
                ideaId={properties.ideaId}
                ideaTitle={properties.ideaTitle}
            />
        </>
    );
}

// Export - Default
export default IdeaReportControl;
