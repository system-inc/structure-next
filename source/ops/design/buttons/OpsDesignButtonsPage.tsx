'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { buttonTheme } from '@structure/source/components/buttons/ButtonTheme';
import type { ButtonVariant, ButtonSize } from '@structure/source/components/buttons/ButtonTheme';
import { InputCheckbox } from '@structure/source/components/forms-new/fields/checkbox/InputCheckbox';

// Dependencies - Assets
import { PlusIcon, HeartIcon, StarIcon, DownloadIcon, TrashIcon } from '@phosphor-icons/react';

// Helper to convert camelCase to spaced label (e.g., "DestructiveGhost" -> "Ghost Destructive")
function toLabel(name: string, removePrefix?: string) {
    let label = name;
    if(removePrefix) {
        label = label.replace(removePrefix, '') || 'Base';
    }
    return label.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Derive all button variants dynamically from the theme
const allButtonVariants = Object.keys(buttonTheme.variants).map(function (variant) {
    return { variant: variant as ButtonVariant, label: toLabel(variant) };
});

// Derive text button sizes (non-icon sizes)
const textButtonSizes = Object.keys(buttonTheme.sizes)
    .filter(function (size) {
        return !size.startsWith('Icon');
    })
    .map(function (size) {
        return { size: size as ButtonSize, label: toLabel(size) };
    });

// Derive icon-only button sizes
const iconButtonSizes = Object.keys(buttonTheme.sizes)
    .filter(function (size) {
        return size.startsWith('Icon');
    })
    .map(function (size) {
        return { size: size as ButtonSize, label: toLabel(size, 'Icon') };
    });

// Component - VariantShowcase (renders a single variant with all its sizes and states)
function VariantShowcase(properties: { variant: ButtonVariant; label: string }) {
    const isDestructive = properties.variant.includes('Destructive');
    const icon = isDestructive ? TrashIcon : PlusIcon;

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold content--1">{properties.label}</h3>

            {/* Text button sizes */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium content--2">Text Buttons</h4>
                {textButtonSizes.map(function (sizeConfiguration) {
                    return (
                        <div key={sizeConfiguration.size} className="flex flex-wrap items-center gap-3">
                            <span className="w-28 text-xs content--3">{sizeConfiguration.label}</span>
                            {/* Text only */}
                            <Button variant={properties.variant} size={sizeConfiguration.size}>
                                Button
                            </Button>
                            {/* Icon left */}
                            <Button variant={properties.variant} size={sizeConfiguration.size} iconLeft={icon}>
                                Add
                            </Button>
                            {/* Icon right */}
                            <Button variant={properties.variant} size={sizeConfiguration.size} iconRight={DownloadIcon}>
                                Download
                            </Button>
                            {/* Both icons */}
                            <Button
                                variant={properties.variant}
                                size={sizeConfiguration.size}
                                iconLeft={HeartIcon}
                                iconRight={StarIcon}
                            >
                                Favorite
                            </Button>
                            {/* Disabled */}
                            <Button variant={properties.variant} size={sizeConfiguration.size} disabled>
                                Disabled
                            </Button>
                            {/* Loading */}
                            <Button variant={properties.variant} size={sizeConfiguration.size} isLoading>
                                Loading
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Icon-only button sizes */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium content--2">Icon-Only Buttons</h4>
                <div className="flex flex-wrap items-center gap-3">
                    {iconButtonSizes.map(function (sizeConfiguration) {
                        return (
                            <Button
                                key={sizeConfiguration.size}
                                variant={properties.variant}
                                size={sizeConfiguration.size}
                                icon={icon}
                                tip={sizeConfiguration.label}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Component - ButtonShowcase (renders all button variants)
function ButtonShowcase() {
    return (
        <div className="space-y-12">
            {allButtonVariants.map(function (variantConfiguration) {
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

// Component - OpsDesignButtonsPage
export function OpsDesignButtonsPage() {
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
                    <span className="text-sm content--1">Light Mode</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                    <InputCheckbox
                        variant="A"
                        isChecked={showDarkMode}
                        onIsCheckedChange={function (isChecked) {
                            setShowDarkMode(isChecked === true);
                        }}
                    />
                    <span className="text-sm content--1">Dark Mode</span>
                </label>
            </div>

            {/* Showcases */}
            <div className={gridClassName}>
                {/* Light Mode Column */}
                {showLightMode && (
                    <div className="rounded-lg border border--0 background--0 p-6 scheme-light">
                        <h2 className="mb-6 text-lg font-semibold content--0">Light Mode</h2>
                        <ButtonShowcase />
                    </div>
                )}

                {/* Dark Mode Column */}
                {showDarkMode && (
                    <div className="rounded-lg border border--0 background--0 p-6 scheme-dark">
                        <h2 className="mb-6 text-lg font-semibold content--0">Dark Mode</h2>
                        <ButtonShowcase />
                    </div>
                )}
            </div>
        </div>
    );
}
