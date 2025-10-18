'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';
import { PostReportDialog } from '@structure/source/modules/post/report/components/dialogs/PostReportDialog';

// Dependencies - Assets
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostReportControl
export interface PostReportControlProperties {
    className?: string;
    ideaId: string;
    ideaTitle: string;
}
export function PostReportControl(properties: PostReportControlProperties) {
    // State
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);

    // Render the component
    return (
        <>
            <PopoverMenu
                trigger={
                    <PostControl className="">
                        <EllipsesIcon className="h-4 w-4" />
                    </PostControl>
                }
                items={[
                    {
                        iconLeft: FlagIcon,
                        children: 'Report',
                        onSelected: function () {
                            setReportDialogOpen(true);
                        },
                    },
                ]}
            />

            <PostReportDialog
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
                ideaId={properties.ideaId}
                ideaTitle={properties.ideaTitle}
            />
        </>
    );
}
