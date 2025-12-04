'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Notice } from '@structure/source/components/notices/Notice';
import { noticeTheme } from '@structure/source/components/notices/NoticeTheme';
import type { NoticeVariant, NoticeSize } from '@structure/source/components/notices/NoticeTheme';
import { InputCheckbox } from '@structure/source/components/forms-new/fields/checkbox/InputCheckbox';

// Dependencies - Assets
import { BellIcon } from '@phosphor-icons/react';

// Helper to convert camelCase to spaced label (e.g., "Informative" -> "Informative")
function toLabel(name: string) {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Derive all notice variants dynamically from the theme
const allNoticeVariants = Object.keys(noticeTheme.variants).map(function (variant) {
    return { variant: variant as NoticeVariant, label: toLabel(variant) };
});

// Derive all notice sizes dynamically from the theme
const allNoticeSizes = Object.keys(noticeTheme.sizes).map(function (size) {
    return { size: size as NoticeSize, label: toLabel(size) };
});

// Component - VariantShowcase (renders a single variant with all its sizes and states)
function VariantShowcase(properties: { variant: NoticeVariant; label: string }) {
    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold">{properties.label}</h3>

            {/* All sizes for this variant */}
            <div className="space-y-4">
                {allNoticeSizes.map(function (sizeConfiguration) {
                    return (
                        <div key={sizeConfiguration.size} className="space-y-3">
                            <h4 className="text-sm font-medium">{sizeConfiguration.label}</h4>
                            <div className="space-y-3">
                                {/* Title only */}
                                <Notice
                                    variant={properties.variant}
                                    size={sizeConfiguration.size}
                                    title="This is a notice title"
                                />

                                {/* Title with content */}
                                <Notice
                                    variant={properties.variant}
                                    size={sizeConfiguration.size}
                                    title="Notice with content"
                                >
                                    <p className="">
                                        This is additional content that provides more context about the notice. It can
                                        span multiple lines and include detailed information.
                                    </p>
                                </Notice>

                                {/* Custom icon */}
                                <Notice
                                    variant={properties.variant}
                                    size={sizeConfiguration.size}
                                    title="Custom icon notice"
                                    icon={BellIcon}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Component - NoticeShowcase (renders all notice variants)
function NoticeShowcase() {
    return (
        <div className="space-y-12">
            {allNoticeVariants.map(function (variantConfiguration) {
                return (
                    <VariantShowcase
                        key={variantConfiguration.variant}
                        variant={variantConfiguration.variant}
                        label={variantConfiguration.label}
                    />
                );
            })}
        </div>
    );
}

// Component - OpsDesignNoticesPage
export function OpsDesignNoticesPage() {
    // State for controlling which modes to show
    const [showLightMode, setShowLightMode] = React.useState(true);
    const [showDarkMode, setShowDarkMode] = React.useState(true);

    // Determine grid columns based on what's visible
    const visibleCount = (showLightMode ? 1 : 0) + (showDarkMode ? 1 : 0);
    const gridClassName =
        visibleCount === 2 ? 'grid grid-cols-2 gap-6' : visibleCount === 1 ? 'grid grid-cols-1 gap-6' : '';

    // Render the component
    return (
        <div className="space-y-6">
            {/* Mode toggles */}
            <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                    <InputCheckbox
                        variant="A"
                        isChecked={showLightMode}
                        onIsCheckedChange={function (isChecked) {
                            setShowLightMode(isChecked === true);
                        }}
                    />
                    <span className="text-sm">Light Mode</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                    <InputCheckbox
                        variant="A"
                        isChecked={showDarkMode}
                        onIsCheckedChange={function (isChecked) {
                            setShowDarkMode(isChecked === true);
                        }}
                    />
                    <span className="text-sm">Dark Mode</span>
                </label>
            </div>

            {/* Showcases */}
            <div className={gridClassName}>
                {/* Light Mode Column */}
                {showLightMode && (
                    <div className="rounded-lg border border--0 background--0 p-6 scheme-light">
                        <h2 className="mb-6 text-lg font-semibold">Light Mode</h2>
                        <NoticeShowcase />
                    </div>
                )}

                {/* Dark Mode Column */}
                {showDarkMode && (
                    <div className="rounded-lg border border--0 background--0 p-6 scheme-dark">
                        <h2 className="mb-6 text-lg font-semibold">Dark Mode</h2>
                        <NoticeShowcase />
                    </div>
                )}
            </div>
        </div>
    );
}
