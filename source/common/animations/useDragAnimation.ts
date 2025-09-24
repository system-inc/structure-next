// Dependencies
import { config as springConfiguration, UseSpringsProps as UseSpringProperties } from '@react-spring/web';

// Type - DragAnimationProperties
export type DragAnimationProperties = UseSpringProperties & {
    order: number[];
    active?: boolean;
    originalIndex?: number;
    currentIndex?: number;
    y?: number;
    height?: number;
    onRest?: () => void;
};

// Hook - useDragAnimation
export function useDragAnimation() {
    const getDragAnimationProperties = (properties: DragAnimationProperties) => (index: number) => {
        // Get values with defaults
        const active = properties.active !== undefined ? properties.active : false;
        const originalIndex = properties.originalIndex !== undefined ? properties.originalIndex : 0;
        const currentIndex = properties.currentIndex !== undefined ? properties.currentIndex : 0;
        const y = properties.y !== undefined ? properties.y : 0;
        const height = properties.height !== undefined ? properties.height : 50;

        return active && index === originalIndex
            ? {
                  scale: 1.1,
                  zIndex: 1,
                  shadow: 15,
                  immediate: (key: string) => key === 'zIndex',
                  config: (key: string) => (key === 'y' ? springConfiguration.stiff : springConfiguration.default),
                  ...properties,
                  y: currentIndex * height + y, // Calculate y AFTER spreading to prevent override
              }
            : {
                  scale: 1,
                  zIndex: 0,
                  shadow: 1,
                  immediate: false,
                  ...properties,
                  y: properties.order.indexOf(index) * height, // Calculate y AFTER spreading to prevent override
              };
    };
    return getDragAnimationProperties;
}
