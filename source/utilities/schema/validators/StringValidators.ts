// Function - isValidEmailAddress
// Validates if a string is a valid email address format
export function isValidEmailAddress(value: string): boolean {
    if(!value) {
        return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Function - isValidUsername
// Validates username: 3-32 characters, letters, numbers, underscores, single internal period
export function isValidUsername(value: string): boolean {
    if(!value) {
        return false;
    }

    // Must be 3-32 characters long
    if(value.length < 3 || value.length > 32) {
        return false;
    }

    // Cannot start or end with period or underscore
    if(/^[._]|[._]$/.test(value)) {
        return false;
    }

    // Cannot have more than one period
    if((value.match(/\./g) || []).length > 1) {
        return false;
    }

    // Must only contain letters, numbers, underscores, and single period
    if(!/^[a-zA-Z0-9_.]+$/.test(value)) {
        return false;
    }

    return true;
}
