'use client'; // This component uses client-only features

// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';

// Dependencies - Shared State
import { useAtomValue, useSetAtom } from 'jotai';
import {
    sideNavigationLayoutNavigationOpenAtom,
    setSideNavigationLayoutNavigationOpenAtom,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Assets
import MenuIcon from '@structure/assets/icons/navigation/MenuIcon.svg';

// Dependencies - Styles
import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { darkThemeClassName } from '@structure/source/theme/Theme';

// Component - SideNavigationLayoutNavigationSideToggle
export interface SideNavigationLayoutNavigationSideToggleInterface {
    className?: string;
}
export function SideNavigationLayoutNavigationSideToggle(
    properties: SideNavigationLayoutNavigationSideToggleInterface,
) {
    // Hooks
    const { themeClassName } = useTheme();

    // Shared State
    const sideNavigationLayoutNavigationOpen = useAtomValue(sideNavigationLayoutNavigationOpenAtom);
    const setSideNavigationLayoutNavigationOpen = useSetAtom(setSideNavigationLayoutNavigationOpenAtom);

    // Render the component
    return (
        <div className={mergeClassNames('mr-4 flex flex-shrink-0 items-center space-x-2', properties.className)}>
            {/* Menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="focus:border-0"
                icon={MenuIcon}
                onClick={async function () {
                    setSideNavigationLayoutNavigationOpen(!sideNavigationLayoutNavigationOpen);
                }}
            />

            {/* Logo */}
            <Link href="/">
                <Image
                    src={
                        themeClassName == darkThemeClassName
                            ? StructureSettings.assets.favicon.dark.location
                            : StructureSettings.assets.favicon.light.location
                    }
                    alt="Logo"
                    height={28} // h-7 = 28px
                    width={28} // h-7 = 28px
                    priority={true}
                />
            </Link>
        </div>
    );
}

// Export - Default
export default SideNavigationLayoutNavigationSideToggle;
