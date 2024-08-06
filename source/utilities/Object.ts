// Function to flatten an object
export function flattenObject(object: any, parentKey = '', result: any = {}): any {
    for(const key in object) {
        if(object.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;

            if(typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                flattenObject(object[key], newKey, result);
            }
            else {
                result[newKey] = object[key];
            }
        }
    }
    return result;
}

// Function to merge two objects deeply
export function mergeDeep<T extends Record<string, any>>(original: T, updates: Partial<T> | Record<string, any>): T {
    const result: any = { ...original };

    for(const key in updates) {
        if(typeof updates[key] === 'object' && original[key]) {
            result[key] = mergeDeep(original[key], updates[key] ?? {});
        }
        else {
            result[key] = updates[key];
        }
    }

    return result;
}

// Function to get a key value from an object recursively
export function getValueForKeyRecursively(object: Record<string, unknown>, key: string): unknown {
    if(object.hasOwnProperty(key)) {
        return object[key];
    }

    for(const currentKey in object) {
        const currentValue = object[currentKey];

        if(typeof currentValue === 'object' && currentValue !== null) {
            const result = getValueForKeyRecursively(currentValue as Record<string, unknown>, key);
            if(result !== undefined) {
                return result;
            }
        }
    }

    return undefined;
}
