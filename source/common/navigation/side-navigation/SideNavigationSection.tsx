// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { SideNavigationItemProperties } from '@structure/source/common/navigation/side-navigation/SideNavigationItem';
import { SideNavigationLink } from '@structure/source/common/navigation/side-navigation/SideNavigationLink';

// Dependencies - Animation
import { Collapse } from '@structure/source/common/interactions/Collapse';
import { cubicBezier, motion, Transition } from 'motion/react';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationSection
export interface SideNavigationSectionProperties {
    title: React.ReactNode;
    href?: string;
    children?: SideNavigationItemProperties[];
    isHeader?: boolean;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
export function SideNavigationSection(properties: SideNavigationSectionProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // State
    const [isOpen, setIsOpen] = React.useState(properties.children?.some((child) => child.href === urlPath) || false);

    // Animation
    const transition: Transition = { duration: 0.25, ease: cubicBezier(0.075, 0.82, 0.165, 1) };

    // Components

    // Determine if the item or any of its children are active
    const isActive = properties.href === urlPath || properties.children?.some((child) => child.href === urlPath);

    // Render the component
    return (
        <div>
            <div className="relative">
                {properties.isHeader ? (
                    <div className="py-2 text-sm font-medium text-gray-900 dark:text-white">{properties.title}</div>
                ) : properties.children ? (
                    <div
                        className={mergeClassNames(
                            'mb-0.5 flex cursor-pointer select-none items-center justify-between rounded py-1 pl-2 pr-1 text-[13px] hover:bg-light-2 dark:text-light dark:hover:bg-dark-3',
                            isActive ? 'bg-light-1 dark:bg-dark-2' : '',
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex items-center gap-x-2">
                            {properties.icon && (
                                <div className="relative h-4 w-4">
                                    <properties.icon className="h-full w-full" />
                                </div>
                            )}
                            {properties.title}
                        </div>
                        <button
                            className="relative flex aspect-square w-6 items-center justify-center rounded text-dark hover:bg-dark/10 dark:text-white dark:hover:bg-light/10"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <motion.span
                                animate={{
                                    transform: isOpen ? `rotate(270deg)` : `rotate(90deg)`,
                                }}
                                transition={transition}
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </motion.span>
                        </button>
                    </div>
                ) : (
                    <SideNavigationLink title={properties.title} href={properties.href} icon={properties.icon} />
                )}
            </div>

            {/* Children */}
            {properties.children && (
                <Collapse isOpen={isOpen || properties.isHeader === true} animationConfiguration={transition}>
                    <div
                        className={`space-y-0.5 ${
                            properties.isHeader ? '' : 'ml-3 border-l border-l-light-4 pl-4 dark:border-l-dark-4'
                        }`}
                    >
                        {properties.children.map(function (child, childIndex) {
                            return (
                                <div key={childIndex}>
                                    <SideNavigationSection {...child} />
                                </div>
                            );
                        })}
                    </div>
                </Collapse>
            )}
        </div>
    );
}
