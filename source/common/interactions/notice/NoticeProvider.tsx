'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NoticeContainer } from '@structure/source/common/interactions/notice/NoticeContainer';
import { NoticeInterface, Notice } from '@structure/source/common/interactions/notice/Notice';
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
export type NoticeProviderProperties = {
    children: React.ReactNode;
};
export function NoticeProvider({ children }: NoticeProviderProperties) {
    // State
    const [notices, setNotices] = React.useState<NoticeInterface[]>([]);

    // Function to add a notice
    function addNotice(newNotice: Omit<NoticeInterface, 'id'>) {
        // Generate a unique ID.id = uniqueIdentifier();
        const notice: NoticeInterface = { ...newNotice, id: uniqueIdentifier() };

        setNotices((notices) => [...notices, notice]);
    }

    // Function to remove a notice
    function removeNotice(id: string) {
        setNotices((notices) => notices.filter((notice) => notice.id !== id));
    }

    // Function to remove all notices
    function removeAllNotices() {
        setNotices([]);
    }

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
