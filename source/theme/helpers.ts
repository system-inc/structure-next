export function deepMerge<T extends Record<string, any>>(original: T, updates: Partial<T> | Record<string, any>): T {
    const result: any = { ...original };

    for(const key in updates) {
        if(typeof updates[key] === 'object' && original[key]) {
            result[key] = deepMerge(original[key], updates[key] ?? {});
        }
        else {
            result[key] = updates[key];
        }
    }

    return result;
}
