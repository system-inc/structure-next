'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { NotificationsContainer } from '@structure/source/components/notifications/NotificationsContainer';
import { NotificationInterface } from '@structure/source/components/notifications/Notification';

// Dependencies - Utilities
import { uniqueIdentifier } from '@structure/source/utilities/type/String';

// Context - Notifications
interface NotificationsContextInterface {
    addNotification: (notification: Omit<NotificationInterface, 'id'>) => void;
    removeNotification: (id: string) => void;
    removeAllNotifications: () => void;
    notifications: NotificationInterface[];
}
const NotificationsContext = React.createContext<NotificationsContextInterface | undefined>(undefined);

// Component - NotificationProvider
export interface NotificationProviderProperties {
    children: React.ReactNode;
}
export function NotificationsProvider(properties: NotificationProviderProperties) {
    // State
    const [notifications, setNotifications] = React.useState<NotificationInterface[]>([]);

    // Function to add a notification
    const addNotification = React.useCallback(function (newNotification: Omit<NotificationInterface, 'id'>) {
        // Generate a unique ID.id = uniqueIdentifier();
        const notification: NotificationInterface = { ...newNotification, id: uniqueIdentifier() };

        setNotifications((notifications) => [...notifications, notification]);
    }, []);

    // Function to remove a notification
    const removeNotification = React.useCallback(function (id: string) {
        setNotifications((notifications) => notifications.filter((notification) => notification.id !== id));
    }, []);

    // Function to remove all notifications
    const removeAllNotifications = React.useCallback(function () {
        setNotifications([]);
    }, []);

    // Render the component
    return (
        <NotificationsContext.Provider
            value={{
                addNotification: addNotification,
                removeNotification: removeNotification,
                removeAllNotifications: removeAllNotifications,
                notifications: notifications,
            }}
        >
            {properties.children}
            <NotificationsContainer notifications={notifications} />
        </NotificationsContext.Provider>
    );
}

// Hook - useNotifications
export function useNotifications(): NotificationsContextInterface {
    const notificationsContext = React.useContext(NotificationsContext);
    if(!notificationsContext) {
        throw new Error('useNotifications must be used within a NotificationsProvider.');
    }
    return React.useContext(NotificationsContext) as NotificationsContextInterface;
}
