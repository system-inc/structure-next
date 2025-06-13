// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { SideNavigationItemProperties } from '@structure/source/common/navigation/side-navigation/SideNavigationItem';
import { SideNavigationLink } from '@structure/source/common/navigation/side-navigation/SideNavigationLink';

// Dependencies - Animation
import { Collapse } from '@structure/source/common/interactions/Collapse';
import { easings, useSpring, animated } from '@react-spring/web';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';
const AnimatedChevronRightIcon = animated(ChevronRightIcon);

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
    const animationConfiguration = { duration: 500, easing: easings.easeOutExpo };
    const rotationSpring = useSpring({
        rotate: isOpen ? 270 : 90,
        config: animationConfiguration,
    });

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
                            <AnimatedChevronRightIcon
                                className="h-4 w-4"
                                style={{
                                    transform: rotationSpring.rotate.to((rotate) => `rotate(${rotate}deg)`),
                                }}
                            />
                        </button>
                    </div>
                ) : (
                    <SideNavigationLink title={properties.title} href={properties.href} icon={properties.icon} />
                )}
            </div>

            {/* Children */}
            {properties.children && (
                <Collapse
                    isOpen={isOpen || properties.isHeader === true}
                    animationConfiguration={animationConfiguration}
                >
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
