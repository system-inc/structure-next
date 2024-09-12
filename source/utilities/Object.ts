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

// Function to check if two objects are equal
export function isEqual(obj1: any, obj2: any): boolean {
    // If both objects have different types or are null/undefined, they're not equal
    if(typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
        return false;
    }

    // Check for reference equality first (i.e., do the two variables point to the same object in memory?)
    if(obj1 === obj2) {
        return true; // If they are the same object, they're equal
    }

    // If one of the objects is an array and both have values in them:
    if(Array.isArray(obj1) && Array.isArray(obj2)) {
        if(obj1.length !== obj2.length) {
            return false;
        }
        for(let i = 0; i < obj1.length; i++) {
            if(!isEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }

    // If neither is an array, we can assume they are both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of properties is different, they're not equal
    if(keys1.length !== keys2.length) {
        return false;
    }

    // Check each key in the first object against the corresponding value in the second object.
    for(const key of keys1) {
        if(!(key in obj2)) {
            return false; // If a key is missing, the objects are not equal
        }
        const valueInObj1 = obj1[key];
        const valueInObj2 = obj2[key];

        // Use our isEqual function to check each property recursively.
        if(!isEqual(valueInObj1, valueInObj2)) {
            return false;
        }
    }

    // If we've reached this point, it means all the properties in both objects were equal
    return true;
}
