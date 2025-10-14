'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeContainer } from '@structure/source/common/notifications/NoticeContainer';
import { NoticeInterface } from '@structure/source/common/notifications/Notice';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/type/String';

// Context - Notice
interface NoticeContextInterface {
    addNotice: (notice: Omit<NoticeInterface, 'id'>) => void;
    removeNotice: (id: string) => void;
    removeAllNotices: () => void;
    notices: NoticeInterface[];
}
const NoticeContext = React.createContext<NoticeContextInterface | undefined>(undefined);

// Component - NoticeProvider
export interface NoticeProviderProperties {
    children: React.ReactNode;
}
export function NoticeProvider(properties: NoticeProviderProperties) {
    // State
    const [notices, setNotices] = React.useState<NoticeInterface[]>([]);

    // Function to add a notice
    const addNotice = React.useCallback(function (newNotice: Omit<NoticeInterface, 'id'>) {
        // Generate a unique ID.id = uniqueIdentifier();
        const notice: NoticeInterface = { ...newNotice, id: uniqueIdentifier() };

        setNotices((notices) => [...notices, notice]);
    }, []);

    // Function to remove a notice
    const removeNotice = React.useCallback(function (id: string) {
        setNotices((notices) => notices.filter((notice) => notice.id !== id));
    }, []);

    // Function to remove all notices
    const removeAllNotices = React.useCallback(function () {
        setNotices([]);
    }, []);

    // Render the component
    return (
        <NoticeContext.Provider value={{ addNotice, removeNotice, removeAllNotices, notices }}>
            {properties.children}
            <NoticeContainer notices={notices} />
        </NoticeContext.Provider>
    );
}

// Hook - useNotice
export function useNotice(): NoticeContextInterface {
    const noticeContext = React.useContext(NoticeContext);
    if(!noticeContext) {
        throw new Error('useNotice must be used within a NoticeProvider.');
    }
    return React.useContext(NoticeContext) as NoticeContextInterface;
}
