// Dependencies - React
import React from 'react';

// Dependencies - Theme
import type { DialogThemeConfiguration } from './DialogTheme';
import type { DialogVariant, DialogPosition, DialogSize } from './DialogTheme';

// Dialog Context Interface
export interface DialogContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile: boolean;
    isResponsive: boolean;
    dialogId: string;
    dialogTheme: DialogThemeConfiguration;
    variant?: DialogVariant;
    position?: DialogPosition;
    size?: DialogSize;
    modal?: boolean;
    onOpenAutoFocus?: (event: Event) => void;
}

// Create Dialog Context
export const DialogContext = React.createContext<DialogContextValue | null>(null);

// Hook to use Dialog Context
export function useDialogContext() {
    const context = React.useContext(DialogContext);
    if(!context) {
        throw new Error('Dialog compound components must be used within a Dialog component');
    }
    return context;
}
