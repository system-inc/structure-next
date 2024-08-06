'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/common/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/controls/PostControl';
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';

// Dependencies - Assets
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentShareControl
export interface PostCommentShareControlInterface {
    className?: string;
    ideaUrl: string;
}
export function PostCommentShareControl(properties: PostCommentShareControlInterface) {
    // Hooks
    const { addNotice } = useNotice();

    // Render the component
    return (
        <PopoverMenu
            items={[
                {
                    icon: CopyIcon,
                    iconPosition: 'left',
                    content: 'Copy Link',
                    closeMenuOnSelected: true,
                    onSelected: function () {
                        // Copy the link to the clipboard
                        navigator.clipboard.writeText(properties.ideaUrl);

                        addNotice({
                            title: 'Copied Link',
                            content: properties.ideaUrl,
                        });
                    },
                },
            ]}
        >
            <PostControl className="">
                <ShareIcon className="h-4 w-4" />
            </PostControl>
        </PopoverMenu>
    );
}

// Export - Default
export default PostCommentShareControl;
