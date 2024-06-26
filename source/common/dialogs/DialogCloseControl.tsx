'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DialogClose as RadixDialogClose } from '@radix-ui/react-dialog';

// Component - DialogClose
export interface DialogCloseControlInterface {
    children: React.ReactNode;
}
export function DialogCloseControl(properties: DialogCloseControlInterface) {
    // Render the component
    return <RadixDialogClose asChild>{properties.children}</RadixDialogClose>;
}

// Export - Default
export default DialogCloseControl;
