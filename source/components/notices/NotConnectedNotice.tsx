// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeProperties, Notice } from '@structure/source/components/notices/Notice';

// Dependencies - Assets
import CloudErrorIcon from '@structure/assets/icons/status/CloudErrorIcon.svg';

// Component - NotConnectedNotice
export type NotConnectedNoticeProperties = {
    noticeProperties?: NoticeProperties;
};
export function NotConnectedNotice(properties: NotConnectedNoticeProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Notice
                variant="Negative"
                size="Large"
                presentation="Card"
                icon={CloudErrorIcon}
                title="Not Connected"
                {...properties.noticeProperties}
            >
                <div className="space-y-2">
                    <p>Unable to connect to the {ProjectSettings.title} servers.</p>
                </div>
            </Notice>
        </div>
    );
}
