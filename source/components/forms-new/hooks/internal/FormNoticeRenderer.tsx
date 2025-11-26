'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Notice } from '@structure/source/components/notices/Notice';
import type { NoticeVariant } from '@structure/source/components/notices/NoticeTheme';

// Dependencies - Animation
import { AnimatePresence, motion } from 'motion/react';

// Default animation configuration
const defaultAnimationTransition = {
    type: 'spring',
    duration: 0.35,
    bounce: 0.05,
} as const;

// Interface - FormNoticeState
export interface FormNoticeState {
    key: number;
    variant: NoticeVariant;
    title: string;
    content?: React.ReactNode;
}

// Component - FormNoticeRenderer
export interface FormNoticeRendererProperties {
    noticeState: FormNoticeState | null;
    className?: string;
}
export function FormNoticeRenderer(properties: FormNoticeRendererProperties) {
    return (
        <AnimatePresence initial={false}>
            {properties.noticeState && (
                <motion.div
                    key={properties.noticeState.key}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={defaultAnimationTransition}
                    style={{ overflow: 'hidden' }}
                >
                    <Notice
                        className={properties.className}
                        variant={properties.noticeState.variant}
                        title={properties.noticeState.title}
                    >
                        {properties.noticeState.content}
                    </Notice>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
