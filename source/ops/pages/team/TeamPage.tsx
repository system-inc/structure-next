'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Button } from '@structure/source/components/buttons/Button';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { DialogCloseControl } from '@structure/source/components/dialogs/DialogCloseControl';
import { useNotice } from '@structure/source/components/notifications/NoticeProvider';

// Component - TeamPage
export function TeamPage() {
    // Hooks
    const notice = useNotice();

    // Render the component
    return (
        <div className="px-8 py-6">
            <OpsNavigationTrail />
            <h1>Team</h1>

            <h2 className="mt-6 mb-6">Members</h2>

            <Button
                onClick={async function () {
                    notice.addNotice({
                        title: 'Hello!',
                        content: 'This is a notice. ' + new Date().toLocaleTimeString('en-US', {}),
                    });
                }}
            >
                Show Notice
            </Button>

            <Dialog
                trigger={<Button>Launch Dialog</Button>}
                header="How are you doing?"
                content="I'm doing great!"
                footer={
                    <DialogCloseControl>
                        <Button>Dismiss</Button>
                    </DialogCloseControl>
                }
            />

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
