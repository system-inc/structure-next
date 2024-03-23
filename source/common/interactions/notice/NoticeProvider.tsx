'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeContainer } from '@structure/source/common/interactions/notice/NoticeContainer';
import { NoticeInterface } from '@structure/source/common/interactions/notice/Notice';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/String';

// Context - Notice
interface NoticeContextInterface {
    addNotice: (notice: Omit<NoticeInterface, 'id'>) => void;
    removeNotice: (id: string) => void;
    removeAllNotices: () => void;
    notices: NoticeInterface[];
}
const NoticeContext = React.createContext<NoticeContextInterface>({
    addNotice: (notice: Omit<NoticeInterface, 'id'>) => {
        console.error('No NoticeProvider found.');
    },
    removeNotice: (id: string) => {
        console.error('No NoticeProvider found.');
    },
    removeAllNotices: () => {
        console.error('No NoticeProvider found.');
    },
    notices: [],
});

// Component - NoticeProvider
export interface NoticeProviderInterface {
    children: React.ReactNode;
}
export function NoticeProvider({ children }: NoticeProviderInterface) {
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
            {children}
            <NoticeContainer notices={notices} />
        </NoticeContext.Provider>
    );
}

// Hook - useNotice
export function useNotice() {
    return React.useContext(NoticeContext);
}

// Export - Default
export default NoticeProvider;
