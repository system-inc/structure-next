'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeProperties, Notice } from '@structure/source/components/notices/Notice';
import { BaseError } from '@structure/source/api/errors/BaseError';

// Component - ApiErrorNotice
export interface ApiErrorNoticeProperties {
    error?: BaseError | Error;
    noticeProperties?: NoticeProperties;
}
export function ApiErrorNotice(properties: ApiErrorNoticeProperties) {
    console.error(properties.error);

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Notice
                variant="Negative"
                size="Large"
                title="API Error"
                {...properties.noticeProperties}
            >
                <div className="space-y-2">
                    <p>There was an error while communicating with our servers.</p>
                    {properties.error?.message && (
                        <p>
                            <i>{properties.error.message}</i>
                        </p>
                    )}
                </div>
            </Notice>
        </div>
    );
}
