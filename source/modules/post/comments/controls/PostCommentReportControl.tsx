'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';
import { PostReportDialog } from '@structure/source/modules/post/controls/PostReportDialog';

// Dependencies - Assets
import EllipsesIcon from '@structure/assets/icons/interface/EllipsesIcon.svg';
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentReportControl
export interface PostCommentReportControlInterface {
    className?: string;
    ideaId: string;
    ideaTitle: string;
}
export function PostCommentReportControl(properties: PostCommentReportControlInterface) {
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
                <PostControl className="">
                    <EllipsesIcon className="h-4 w-4" />
                </PostControl>
            </PopoverMenu>

            <PostReportDialog
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
                ideaId={properties.ideaId}
                ideaTitle={properties.ideaTitle}
            />
        </>
    );
}

// Export - Default
export default PostCommentReportControl;
