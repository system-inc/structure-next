// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { type Transition, motion, AnimatePresence } from 'motion/react';

// Component - Collapse
export interface CollapseProperties {
    children: React.ReactNode;
    isOpen: boolean;
    doNotUnmount?: boolean;
    animationConfiguration?: Transition;
}
export function Collapse(properties: CollapseProperties) {
    // Render the component
    return (
        <div className="w-full">
            <AnimatePresence initial={false}>
                {(properties.isOpen || properties.doNotUnmount) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        transition={{ ...properties.animationConfiguration }}
                        className={'relative w-full overflow-x-auto overflow-y-hidden'}
                    >
                        {properties.children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
