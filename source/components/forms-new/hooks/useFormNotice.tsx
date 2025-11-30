'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import type { NoticeVariant } from '@structure/source/components/notices/NoticeTheme';

// Dependencies - Internal Components
import { FormNoticeRenderer, type FormNoticeState } from './internal/FormNoticeRenderer';

// Interface - Hook Options
export interface UseFormNoticeOptions {
    autoDismissInMilliseconds?: number | null; // Default: 5000ms, null = no auto-dismiss
}

// Interface - FormNoticeProperties
export interface FormNoticeProperties {
    className?: string;
}

// Interface - UseFormNoticeReturn
export interface UseFormNoticeReturn {
    show: (variant: NoticeVariant, title: string, content?: React.ReactNode) => void;
    showSuccess: (title: string, content?: React.ReactNode) => void;
    showError: (title: string, content?: React.ReactNode) => void;
    hide: () => void;
    FormNotice: React.ComponentType<FormNoticeProperties>;
}

// Interface - FormNoticeStore
interface FormNoticeStore {
    getSnapshot: () => FormNoticeState | null;
    subscribe: (listener: () => void) => () => void;
    show: (variant: NoticeVariant, title: string, content?: React.ReactNode) => void;
    showSuccess: (title: string, content?: React.ReactNode) => void;
    showError: (title: string, content?: React.ReactNode) => void;
    hide: () => void;
    dispose: () => void;
}

// Factory function to create the notice store
function createFormNoticeStore(autoDismissInMilliseconds: number | null): FormNoticeStore {
    let notice: FormNoticeState | null = null;
    let keyCounter = 0;
    let autoDismissTimer: ReturnType<typeof setTimeout> | null = null;
    const listeners = new Set<() => void>();

    // Function to notify all listeners of state changes
    function emit() {
        listeners.forEach(function (listener) {
            listener();
        });
    }

    // Function to clear any existing auto-dismiss timer
    function clearTimer() {
        if(autoDismissTimer) {
            clearTimeout(autoDismissTimer);
            autoDismissTimer = null;
        }
    }

    // Function to hide the current notice
    function hide() {
        clearTimer();
        notice = null;
        emit();
    }

    // Function to show a new notice
    function show(variant: NoticeVariant, title: string, content?: React.ReactNode) {
        clearTimer();
        keyCounter += 1;

        notice = {
            key: keyCounter,
            variant,
            title,
            content,
        };
        emit();

        if(autoDismissInMilliseconds !== null && autoDismissInMilliseconds > 0) {
            autoDismissTimer = setTimeout(function () {
                hide();
            }, autoDismissInMilliseconds);
        }
    }

    // Function to show a success notice
    function showSuccess(title: string, content?: React.ReactNode) {
        show('Positive', title, content);
    }

    // Function to show an error notice
    function showError(title: string, content?: React.ReactNode) {
        show('Negative', title, content);
    }

    // Subscription function for external store
    function subscribe(listener: () => void) {
        listeners.add(listener);
        return function () {
            listeners.delete(listener);
        };
    }

    // Function to get the current snapshot
    function getSnapshot() {
        return notice;
    }

    // Function to dispose the store
    function dispose() {
        clearTimer();
        listeners.clear();
    }

    return {
        getSnapshot,
        subscribe,
        show,
        showSuccess,
        showError,
        hide,
        dispose,
    };
}

// Hook - useFormNotice
export function useFormNotice(options: UseFormNoticeOptions = {}): UseFormNoticeReturn {
    const autoDismissInMilliseconds =
        options.autoDismissInMilliseconds === undefined ? 5000 : options.autoDismissInMilliseconds;

    // Create the store once per hook instance
    const [store] = React.useState(function () {
        return createFormNoticeStore(autoDismissInMilliseconds);
    });

    // Stable component that subscribes to the store using useSyncExternalStore
    // This avoids reading refs during render (which React Compiler doesn't allow)
    // useMemo ensures the component identity is stable so AnimatePresence works correctly
    const FormNotice = React.useMemo(
        function () {
            return function FormNotice(properties: FormNoticeProperties) {
                const noticeState = React.useSyncExternalStore(
                    store.subscribe,
                    store.getSnapshot,
                    function getServerSnapshot() {
                        return null; // No notice shown during SSR
                    },
                );
                return <FormNoticeRenderer noticeState={noticeState} className={properties.className} />;
            };
        },
        [store],
    );

    // Cleanup on unmount
    React.useEffect(
        function () {
            return function () {
                store.dispose();
            };
        },
        [store],
    );

    return {
        show: store.show,
        showSuccess: store.showSuccess,
        showError: store.showError,
        hide: store.hide,
        FormNotice,
    };
}
