// This function returns an array of classes that match the given modifier with the modifier removed.
//
// Example usage:
// getClassNamesByModifier('hover', 'hover:bg-blue-500 hover:text-white')
// => ['bg-blue-500', 'text-white']
//
// Then you might use this function to dynamically apply classes based on user interactions or state changes.
// Example usage:
// const classNames = getClassNamesByModifier('hover', 'hover:bg-blue-500 hover:text-white');
// const hoverClassesModifiedToGroupHover = classNames.map(cn => `group-hover:${cn}`);

export function getClassNamesByModifier(modifier: string, classNames: string): string[] {
    return classNames
        .split(' ')
        .filter((cn) => cn.includes(modifier))
        .map((cn) => cn.replace(modifier + ':', ''));
}
