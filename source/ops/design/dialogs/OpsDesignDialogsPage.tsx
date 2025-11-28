'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';

// Component - OpsDesignDialogsPage
export function OpsDesignDialogsPage() {
    // State
    const [debugDialogOpen, setDebugDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Dialogs</h1>

            <div className="space-y-4">
                <h2 className="text-lg font-medium">Debug Dialog</h2>
                <p className="text-sm content--1">
                    Dialog with colored borders to visualize the structure. Each section has an 8px border.
                </p>
                <Button variant="A" onClick={() => setDebugDialogOpen(true)}>
                    Open Debug Dialog
                </Button>
            </div>

            <Dialog
                variant="A"
                open={debugDialogOpen}
                onOpenChange={setDebugDialogOpen}
                accessibilityTitle="Debug Dialog"
                accessibilityDescription="A dialog with colored borders to debug layout"
                header={
                    <div className="border-8 border-red-500">
                        <div className="p-4">
                            <span className="font-mono text-xs text-red-500">HEADER (red border)</span>
                            <h3 className="text-lg font-medium">Debug Dialog Header</h3>
                        </div>
                    </div>
                }
                body={
                    <div className="border-8 border-blue-500">
                        <div className="h-[3000px] border-4 border-green-500" />
                    </div>
                }
                footer={
                    <div className="border-8 border-yellow-500">
                        <div className="flex justify-end gap-2 p-4">
                            <span className="font-mono text-xs text-yellow-500">FOOTER (yellow border)</span>
                            <Button variant="A" onClick={() => setDebugDialogOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
