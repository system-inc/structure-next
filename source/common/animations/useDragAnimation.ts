// Dependencies
import { config as springConfiguration, UseSpringsProps as UseSpringProperties } from '@react-spring/web';

// Hook - useDragAnimation
export function useDragAnimation() {
    const getDragAnimationProperties =
        ({
            order,
            active = false,
            originalIndex = 0,
            currentIndex = 0,
            y = 0,
            height = 50,
            onRest,
            ...props
        }: {
            order: number[];
            active?: boolean;
            originalIndex?: number;
            currentIndex?: number;
            y?: number;
            height?: number;
            onRest?: () => void;
        } & UseSpringProperties) =>
        (index: number) => {
            return active && index === originalIndex
                ? {
                      y: currentIndex * height + y,
                      scale: 1.1,
                      zIndex: 1,
                      shadow: 15,
                      immediate: (key: string) => key === 'zIndex',
                      config: (key: string) => (key === 'y' ? springConfiguration.stiff : springConfiguration.default),
                      ...props,
                  }
                : {
                      y: order.indexOf(index) * height,
                      scale: 1,
                      zIndex: 0,
                      shadow: 1,
                      immediate: false,
                      onRest,
                      ...props,
                  };
        };
    return getDragAnimationProperties;
}

// Export - Default
export default useDragAnimation;
