import { useReducedMotion as useReactSpringReducedMotion } from '@react-spring/web';
import { useReducedMotion as useMotionReducedMotion } from 'framer-motion';
import React from 'react';

interface ReducedMotionProviderProps {
    children: React.ReactNode;
}
const ReducedMotionProvider = ({ children }: ReducedMotionProviderProps) => {
    // The useReducedMotion hook affects all react-spring animations. It sets immediate to true when the user prefers reduced motion for all springs.
    // It does return the preference value if you need that. But it's not necessary for most use cases.
    useReactSpringReducedMotion();

    // This is the same hook for framer-motion animations. We don't use Framer Motion all that much, but it's good to have it here just in case we do.
    useMotionReducedMotion();

    return children;
};

export default ReducedMotionProvider;
