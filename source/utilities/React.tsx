// Function to wrap SVGs in a span so they can be interacted with
export function wrapSvg(children: React.ReactElement, className?: string) {
    // Determine if the child is an SVG
    let isSvg = false;
    if(children && children.type) {
        const constructorName = (children.type as React.JSXElementConstructor<any>).name;
        if(constructorName) {
            isSvg = constructorName.startsWith('Svg');
        }
    }

    return isSvg ? (
        // Wrap SVGs in a span so they can be interacted with
        <span className={className}>{children}</span>
    ) : (
        // If not an SVG, render the children as is
        children
    );
}
