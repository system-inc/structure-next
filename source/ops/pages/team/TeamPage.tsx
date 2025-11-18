'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Button } from '@structure/source/components/buttons/Button';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { useNotifications } from '@structure/source/components/notifications/NotificationsProvider';

// Component - TeamPage
export function TeamPage() {
    // Hooks
    const notifications = useNotifications();

    // Render the component
    return (
        <div className="px-8 py-6">
            <OpsNavigationTrail />
            <h1>Team</h1>

            <h2 className="mt-6 mb-6">Members</h2>

            <Button
                onClick={async function () {
                    notifications.addNotification({
                        title: 'Hello!',
                        content: 'This is a notice. ' + new Date().toLocaleTimeString('en-US', {}),
                    });
                }}
            >
                Show Notice
            </Button>

            <Dialog
                variant="A"
                accessibilityTitle="How are you doing?"
                accessibilityDescription="For screen readers"
                trigger={<Button>Launch Dialog</Button>}
            >
                <Dialog.Header>How are you doing?</Dialog.Header>
                <Dialog.Body>I&apos;m doing great!</Dialog.Body>
                <Dialog.Footer>
                    <Dialog.Close>
                        <Button>Dismiss</Button>
                    </Dialog.Close>
                </Dialog.Footer>
            </Dialog>

            <p>Kirk Ouimet</p>
            <p>John-Paul Andersen</p>
            <p>Natalie Main</p>
            <p>Scott Paul</p>
            <p>Bill Zhao</p>
            <p>Chris Owens</p>
            <p>Tina Roh</p>
            <p>Andrew Jacobs</p>
            <p>Kam Sheffield</p>
            <p>Tyler Alvord</p>
        </div>
    );
}
