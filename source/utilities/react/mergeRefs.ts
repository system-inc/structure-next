// Sometimes you can't use a single `useRef` hook to hold a reference to an element, because you need to pass that reference to a third-party component that also needs to hold a reference to the element. In this case, you can use the `mergeRefs` utility to combine multiple refs into a single ref callback.
//
// USAGE:
// ```tsx
// const MyComponent = () => {
//    const ref1 = React.useRef<HTMLDivElement>(null);
//    const ref2 = React.useRef<HTMLDivElement>(null);
//
//    const mergedRef = mergeRefs([ref1, ref2]);
//
//    return <div ref={mergedRef}>Hello, world!</div>;
// };
// ```

export function mergeRefs<T>(
    refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>,
): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if(typeof ref === 'function') {
                ref(value);
            }
            else if(ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}
