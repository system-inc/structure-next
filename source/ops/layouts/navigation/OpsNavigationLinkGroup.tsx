'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { OpsNavigationLinkProperties, OpsNavigationLink } from './OpsNavigationLink';

// Dependencies - Assets
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Animation
import { Collapse } from '@structure/source/components/interactions/Collapse';
import { cubicBezier, motion, Transition } from 'motion/react';

// Component - NavigationGroup
export function OpsNavigationLinkGroup(properties: OpsNavigationLinkProperties) {
    // Default active to false
    const active = properties.active ?? false;

    // State to track if the group is open
    const [isOpen, setIsOpen] = React.useState(active);

    // Get the current pathname from the URL
    const urlPath = useUrlPath();

    // Open or close the group when the path, active state, or properties change
    React.useEffect(
        function () {
            setIsOpen(active);
        },
        [urlPath, active],
    ); // Listen to changes to the pathname and active state

    // Animation
    const transition: Transition = { duration: 0.35, ease: cubicBezier(0.075, 0.82, 0.165, 1) };

    // Render the component
    return (
        <div>
            <div className="relative">
                <OpsNavigationLink
                    title={properties.title}
                    href={properties.href}
                    active={active}
                    icon={properties.icon}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                        className="relative flex aspect-square w-6 cursor-pointer items-center justify-center rounded dark:text-white"
                        onClick={function () {
                            setIsOpen(!isOpen);
                        }}
                    >
                        <motion.span
                            animate={{
                                transform: isOpen ? `rotate(-180deg)` : `rotate(0deg)`,
                            }}
                            transition={transition}
                        >
                            <ChevronRightIcon className="h-4 w-4 rotate-90" />
                        </motion.span>
                    </button>
                </div>
            </div>

            <Collapse key={properties.title} isOpen={isOpen} animationConfiguration={transition}>
                <div className="ml-3 space-y-0.5 border-l pt-0.5 pb-0.5 pl-4">
                    {properties.links?.map((internalNavigationLink) => {
                        return (
                            <li key={internalNavigationLink.title}>
                                <OpsNavigationLink
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
