'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { PopoverMenu } from '@structure/source/components/popovers/PopoverMenu';
import { PostControl } from '@structure/source/modules/post/components/controls/PostControl';
import { useNotifications } from '@structure/source/components/notifications/NotificationsProvider';

// Dependencies - Assets
import ShareIcon from '@structure/assets/icons/interface/ShareIcon.svg';
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';

// Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostShareControl
export interface PostShareControlProperties {
    className?: string;
    url: string;
}
export function PostShareControl(properties: PostShareControlProperties) {
    // Hooks
    const notifications = useNotifications();

    // Render the component
    return (
        <PopoverMenu
            trigger={
                <PostControl className="">
                    <ShareIcon className="h-4 w-4" />
                </PostControl>
            }
            items={[
                {
                    iconLeft: CopyIcon,
                    children: 'Copy Link',
                    closeMenuOnSelected: true,
                    onSelected: function () {
                        // Copy the link to the clipboard
                        navigator.clipboard.writeText(properties.url);

                        notifications.addNotification({
                            title: 'Copied Link',
                            content: (
                                <Link className="break-all" href={properties.url} target="_blank">
                                    {properties.url}
                                </Link>
                            ),
                        });
                    },
                },
            ]}
        />
    );
}
