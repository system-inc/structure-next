'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname } from 'next/navigation';

// Dependencies - Main Components
import { InternalNavigationLinkInterface, InternalNavigationLink } from './InternalNavigationLink';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Animation
import { Collapse } from '@structure/source/common/interactions/Collapse';
import { easings, useSpring, animated } from '@react-spring/web';

const AnimatedChevronRightIcon = animated(ChevronRightIcon);

// Component - NavigationGroup
export function InternalNavigationLinkGroup(properties: InternalNavigationLinkInterface) {
    // Default active to false
    const active = properties.active ?? false;

    // State to track if the group is open
    const [isOpen, setIsOpen] = React.useState(active);

    // Get the current pathname from the URL
    const urlPathname = usePathname();

    // Open or close the group when the path, active state, or properties change
    React.useEffect(() => {
        setIsOpen(active);
    }, [urlPathname, active]); // Listen to changes to the pathname and active state

    const animationConfig = { duration: 500, easing: easings.easeOutExpo };
    const rotationSpring = useSpring({
        rotate: isOpen ? 270 : 90,
        config: animationConfig,
    });

    // Render the component
    return (
        <div>
            <div className="relative">
                <InternalNavigationLink
                    title={properties.title}
                    href={properties.href}
                    active={active}
                    icon={properties.icon}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                        className="relative flex aspect-square w-6 items-center justify-center rounded text-dark transition-colors hover:bg-dark/10 dark:text-white dark:hover:bg-light/10"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <AnimatedChevronRightIcon
                            className={`h-4 w-4`}
                            style={{
                                transform: rotationSpring.rotate.to((rotate) => `rotate(${rotate}deg)`),
                            }}
                        />
                    </button>
                </div>
            </div>

            <Collapse key={properties.title} isOpen={isOpen} animationConfiguration={animationConfig}>
                <div className="ml-3 space-y-0.5 border-l border-l-light-4 pb-0.5 pl-4 pt-0.5 dark:border-l-dark-4">
                    {properties.links?.map((internalNavigationLink) => {
                        return (
                            <li key={internalNavigationLink.title}>
                                <InternalNavigationLink
                                    title={internalNavigationLink.title}
                                    href={internalNavigationLink.href}
                                    icon={internalNavigationLink.icon}
                                    active={internalNavigationLink.active}
                                />
                            </li>
                        );
                    })}
                </div>
            </Collapse>
        </div>
    );
}

// Export - Default
export default InternalNavigationLinkGroup;
