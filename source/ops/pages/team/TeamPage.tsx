'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Button } from '@structure/source/common/buttons/Button';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { DialogCloseControl } from '@structure/source/common/dialogs/DialogCloseControl';
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';

// Component - TeamPage
export function TeamPage() {
    // Hooks
    const { addNotice } = useNotice();

    // Render the component
    return (
        <div className="px-8 py-6">
            <OpsNavigationTrail />
            <h1>Team</h1>

            <h2 className="mb-6 mt-6">Members</h2>

            <Button
                onClick={async function () {
                    addNotice({
                        title: 'Hello!',
                        content: 'This is a notice. ' + new Date().toLocaleTimeString('en-US', {}),
                    });
                }}
            >
                Show Notice
            </Button>

            <Dialog
                header="How are you doing?"
                content="I'm doing great!"
                footer={
                    <DialogCloseControl>
                        <Button>Dismiss</Button>
                    </DialogCloseControl>
                }
            >
                <Button>Launch Dialog</Button>
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
