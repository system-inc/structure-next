'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';

// Dependencies - Assets
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostCommentShareControl
export interface PostCommentShareControlProperties {
    className?: string;
    ideaUrl: string;
}
export function PostCommentShareControl(properties: PostCommentShareControlProperties) {
    // Hooks
    const notice = useNotice();

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

                        notice.addNotice({
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
