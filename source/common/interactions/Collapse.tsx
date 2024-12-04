// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import useMeasure from 'react-use-measure';

// Dependencies - Animation
import { animated, SpringConfig as SpringConfiguration, useSpring } from '@react-spring/web';

// Component - Collapse
export interface CollapseInterface {
    children: React.ReactNode;
    isOpen: boolean;
    doNotUnmount?: boolean;
    animationConfiguration?: SpringConfiguration;
}
export function Collapse(properties: CollapseInterface) {
    // Hooks
    const [domElementReference, { height }] = useMeasure();

    // State
    const [show, setShow] = React.useState(properties.isOpen);

    // The spring for animating the collapse
    const [style, styleApi] = useSpring(function () {
        return {
            opacity: properties.isOpen ? 1 : 0,
            height: properties.isOpen ? height : 0,
        };
    });

    // Effect to update the state based on the animation
    React.useEffect(
        function () {
            styleApi.start({
                opacity: properties.isOpen ? 1 : 0,
                height: properties.isOpen ? height : 0,
                onStart: () => {
                    if(properties.isOpen) setShow(true);
                },
                onRest: (state) => {
                    if(!properties.isOpen && state.value.height === 0) setShow(false);
                },
                config: properties.animationConfiguration,
            });
        },
        [properties.isOpen, properties.animationConfiguration, show, height, styleApi],
    );

    // Render the component
    return (
        <div className="w-full">
            <animated.div
                style={{ opacity: style.opacity, height: style.height }}
                className={'relative w-full overflow-x-auto overflow-y-hidden'}
            >
                <div className="w-full" ref={domElementReference}>
                    {(show || properties.doNotUnmount) && properties.children}
                </div>
            </animated.div>
        </div>
    );
}

// Export - Default
export default Collapse;
