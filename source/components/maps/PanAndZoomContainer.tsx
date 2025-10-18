// Dependencies - React and Next.js
import React from 'react';
import WorldMapMercator from '@structure/source/components/maps/WorldMapMercator.svg';

// Component - PanAndZoomContainer
export interface PanAndZoomContainerProperties {
    width: number;
    height: number;
}
export function PanAndZoomContainer(properties: PanAndZoomContainerProperties) {
    const containerReference = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);
    const [translateX, setTranslateX] = React.useState(0);
    const [translateY, setTranslateY] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStartX, setDragStartX] = React.useState(0);
    const [dragStartY, setDragStartY] = React.useState(0);
    const [dragStartTranslateX, setDragStartTranslateX] = React.useState(0);
    const [dragStartTranslateY, setDragStartTranslateY] = React.useState(0);
    React.useEffect(
        function () {
            const handleWheel = (event: WheelEvent) => {
                event.preventDefault();
                const delta = event.deltaY > 0 ? 0.9 : 1.1;
                const newScale = scale * delta;
                const { offsetX, offsetY } = event;
                const offsetXRatio = offsetX / properties.width;
                const offsetYRatio = offsetY / properties.height;
                const newTranslateX = translateX - (offsetX - properties.width / 2) * (delta - 1);
                const newTranslateY = translateY - (offsetY - properties.height / 2) * (delta - 1);
                setScale(newScale);
                setTranslateX(newTranslateX);
                setTranslateY(newTranslateY);
                console.log('Wheel Event:', {
                    offsetX,
                    offsetY,
                    offsetXRatio,
                    offsetYRatio,
                    newTranslateX,
                    newTranslateY,
                    newScale,
                });
            };

            const container = containerReference.current;
            container?.addEventListener('wheel', handleWheel);

            return () => {
                container?.removeEventListener('wheel', handleWheel);
            };
        },
        [scale, translateX, translateY, properties.width, properties.height],
    );

    const handleMouseDown = (event: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartX(event.clientX);
        setDragStartY(event.clientY);
        setDragStartTranslateX(translateX);
        setDragStartTranslateY(translateY);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if(isDragging) {
            const deltaX = event.clientX - dragStartX;
            const deltaY = event.clientY - dragStartY;
            setTranslateX(dragStartTranslateX + deltaX);
            setTranslateY(dragStartTranslateY + deltaY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDoubleClick = (event: React.MouseEvent) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const rect = containerReference.current?.getBoundingClientRect();
        const clickX = offsetX + (rect?.left ?? 0); // Adjusted to relative position
        const clickY = offsetY + (rect?.top ?? 0); // Adjusted to relative position

        const newScale = scale * 2;

        // Calculate the new translations to center the zoom on the click point
        const newTranslateX = translateX - ((clickX - translateX) * (newScale - scale)) / scale;
        const newTranslateY = translateY - ((clickY - translateY) * (newScale - scale)) / scale;

        setScale(newScale);
        setTranslateX(newTranslateX);
        setTranslateY(newTranslateY);

        console.log('Double Click Event:', {
            clickX,
            clickY,
            offsetX,
            offsetY,
            translateX,
            translateY,
            newTranslateX,
            newTranslateY,
            scale,
            newScale,
        });
    };

    // Render the component
    return (
        <div
            ref={containerReference}
            style={{
                width: `${properties.width}px`,
                height: `${properties.height}px`,
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
        >
            <WorldMapMercator
                style={{
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
