// Function to flatten an object
export function flattenObject(
    object: Record<string, unknown>,
    parentKey = '',
    result: Record<string, unknown> = {},
): Record<string, unknown> {
    for(const key in object) {
        if(Object.prototype.hasOwnProperty.call(object, key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;

            if(typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                flattenObject(object[key] as Record<string, unknown>, newKey, result);
            }
            else {
                result[newKey] = object[key];
            }
        }
    }
    return result;
}

// Function to merge two objects deeply
export function mergeDeep<T extends Record<string, unknown>>(
    original: T,
    updates: Partial<T> | Record<string, unknown>,
): T {
    const result = { ...original } as T;

    for(const key in updates) {
        if(typeof updates[key] === 'object' && original[key]) {
            // Use type assertion to fix the index access issue
            const keyAsString = key as string;
            Reflect.set(
                result,
                keyAsString,
                mergeDeep(
                    original[keyAsString] as Record<string, unknown>,
                    (updates[keyAsString] ?? {}) as Record<string, unknown>,
                ),
            );
        }
        else {
            // Use type assertion to fix the index access issue
            const keyAsString = key as string;
            Reflect.set(result, keyAsString, updates[keyAsString]);
        }
    }

    return result;
}

// Function to get a key value from an object recursively
export function getValueForKeyRecursively(object: Record<string, unknown>, key: string): unknown {
    if(Object.prototype.hasOwnProperty.call(object, key)) {
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

// Sets a value at a dotted path location in an object, creating the nested structure if needed
export function setValueAtDottedPathInObject(object: Record<string, unknown>, keyPath: string[], value: unknown): void {
    const lastKeyIndex = keyPath.length - 1;
    let current = object;

    // Navigate to the right nesting level
    for(let i = 0; i < lastKeyIndex; ++i) {
        const key = keyPath[i];
        if(!key) continue; // Skip empty keys

        // Create nested object if it doesn't exist
        if(!(key in current)) {
            current[key] = {};
        }

        // Need to assert that the value is an object we can navigate into
        current = current[key] as Record<string, unknown>;
    }

    // Set the value at the final key
    const lastKey = keyPath[lastKeyIndex];
    if(lastKey) {
        current[lastKey] = value;
    }
}

// Function to check if two objects are equal
export function isEqual(objectA: unknown, objectB: unknown): boolean {
    // If both objects have different types or are null/undefined, they're not equal
    if(typeof objectA !== typeof objectB || objectA === null || objectB === null) {
        return false;
    }

    // Check for reference equality first (i.e., do the two variables point to the same object in memory?)
    if(objectA === objectB) {
        return true; // If they are the same object, they're equal
    }

    // If one of the objects is an array and both have values in them:
    if(Array.isArray(objectA) && Array.isArray(objectB)) {
        if(objectA.length !== objectB.length) {
            return false;
        }
        for(let i = 0; i < objectA.length; i++) {
            if(!isEqual(objectA[i], objectB[i])) {
                return false;
            }
        }
        return true;
    }

    // If neither is an array but both are objects (excluding null which was checked earlier)
    if(typeof objectA === 'object' && typeof objectB === 'object') {
        const objectATyped = objectA as Record<string, unknown>;
        const objectBTyped = objectB as Record<string, unknown>;

        const keys1 = Object.keys(objectATyped);
        const keys2 = Object.keys(objectBTyped);

        // If the number of properties is different, they're not equal
        if(keys1.length !== keys2.length) {
            return false;
        }

        // Check each key in the first object against the corresponding value in the second object.
        for(const key of keys1) {
            if(!(key in objectBTyped)) {
                return false; // If a key is missing, the objects are not equal
            }
            const valueInObj1 = objectATyped[key];
            const valueInObj2 = objectBTyped[key];

            // Use our isEqual function to check each property recursively.
            if(!isEqual(valueInObj1, valueInObj2)) {
                return false;
            }
        }

        // If we've reached this point, it means all the properties in both objects were equal
        return true;
    }

    // For primitive types, the strict equality check above already returned true if they were equal
    return false;
}
