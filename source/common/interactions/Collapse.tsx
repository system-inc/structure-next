// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import useMeasure from 'react-use-measure';

// Dependencies - Animation
import { animated, SpringConfig, useSpring } from '@react-spring/web';

// Component - Collapse
export interface CollapseInterface {
    children: React.ReactNode;
    isOpen: boolean;
    doNotUnmount?: boolean;
    animationConfig?: SpringConfig;
}
export function Collapse({ children, isOpen, doNotUnmount = false, animationConfig }: CollapseInterface) {
    // Hooks
    const [domElementReference, { height }] = useMeasure();

    // State
    const [show, setShow] = React.useState(isOpen);

    // The spring for animating the collapse
    const [style, styleApi] = useSpring(function () {
        return {
            opacity: isOpen ? 1 : 0,
            height: isOpen ? height : 0,
        };
    });

    // Update the state based on the animation
    React.useEffect(
        function () {
            styleApi.start({
                opacity: isOpen ? 1 : 0,
                height: isOpen ? height : 0,
                onStart: () => {
                    if(isOpen) setShow(true);
                },
                onRest: (state) => {
                    if(!isOpen && state.value.height === 0) setShow(false);
                },
                config: animationConfig,
            });
        },
        [isOpen, show, height, styleApi, animationConfig],
    );

    // Render the component
    return (
        <div className="w-full">
            <animated.div
                key={'collapse-' + children?.toString()}
                style={{ opacity: style.opacity, height: style.height }}
                className={'relative w-full overflow-x-auto overflow-y-hidden'}
            >
                <div className="w-full" ref={domElementReference}>
                    {(show || doNotUnmount) && children}
                </div>
            </animated.div>
        </div>
    );
}

// Export - Default
export default Collapse;
