'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeProperties, Notice } from '@structure/source/components/notices/Notice';

// Dependencies - Assets
import KeyIcon from '@structure/assets/icons/security/KeyIcon.svg';

// Component - NotAuthorizedNotice
export type NotAuthorizedNoticeProperties = {
    noticeProperties?: NoticeProperties;
};
export function NotAuthorizedNotice(properties: NotAuthorizedNoticeProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Notice
                variant="Negative"
                size="Large"
                icon={KeyIcon}
                title="Not Authorized"
                {...properties.noticeProperties}
            >
                <div className="space-y-2">
                    <p>Your account does not have the required role to access this page.</p>
                    <p>Please contact an administrator if you believe this is an error.</p>
                </div>
            </Notice>
        </div>
    );
}
