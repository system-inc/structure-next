// Function to convert a given string to title case while handling special words like "of", "and", "or", etc.
export function titleCase(input: string): string {
    // Words to ignore while performing title casing
    const wordsToLowercase = ['of', 'the', 'and', 'or', 'a', 'an'];
    const wordsToUppercase = ['id', 'api', 'url', 'ip'];

    // Helper function to perform the title casing, ignoring specific words.
    const toTitleCase = (string: string): string => {
        return string.replace(/\w\S*/g, (word) => {
            const lowerWord = word.toLowerCase();
            if(wordsToLowercase.includes(lowerWord)) {
                return lowerWord;
            }
            if(wordsToUppercase.includes(lowerWord)) {
                return lowerWord.toUpperCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
    };

    // Convert the input string to lowercase for uniformity
    let string = input.toLowerCase();

    // Replace - with spaces
    // string = string.replace(/-/g, ' ');
    string = string.replaceAll('-', ' - ');

    // Check if the input is in CONSTANT_CASE
    if(isConstantCase(input)) {
        // Replace underscores with spaces
        string = string.replace(/_/g, ' ');
        return toTitleCase(string);
    }

    // Check if the input is in camelCase
    if(isCamelCase(input)) {
        // Insert a space before all caps
        string = input.replace(/([A-Z])/g, ' $1');
        return toTitleCase(string);
    }

    // Fallback to handle other cases
    return toTitleCase(string);
}

// Function to convert a given string to camel case
export function camelCase(input: string): string {
    // Convert the input string to title case
    let string = titleCase(input);

    // Replace spaces with empty string
    string = string.replace(/ /g, '');

    // Lowercase the first character
    string = string.charAt(0).toLowerCase() + string.slice(1);

    return string;
}

// Function to determine if a given string is in camelCase
export function isCamelCase(str: string): boolean {
    // A string is considered camelCase if it has at least one lowercase
    // letter followed by an uppercase letter.
    return /[a-z][A-Z]/.test(str);
}

// Function to determine if a given string is in CONSTANT_CASE
export function isConstantCase(str: string): boolean {
    // A string is considered CONSTANT_CASE if it is entirely in uppercase
    // and potentially has underscores.
    return /^[A-Z_]+$/.test(str);
}

// Function to create a unique identifier
export function uniqueIdentifier(length = 16) {
    let uniqueIdentifier = '';

    const fourHexCharacters = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    for(let i = 0; i < length; i = i + 4) {
        uniqueIdentifier += fourHexCharacters();
    }

    uniqueIdentifier = uniqueIdentifier.substring(0, length);

    return uniqueIdentifier;
}

// Function to determine if the string is a unique identifier
export function isUniqueIdentifier(string: string): boolean {
    let isUniqueIdentifier = false;

    // First, check the length
    if(string.length === 36) {
        // Then, check the format
        isUniqueIdentifier = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(string);
    }

    return isUniqueIdentifier;
}

// Function to truncate a unique identifier
export function truncateUniqueIdentifier(string: string): string {
    return string.substring(0, 4) + '...' + string.substring(32);
}

// Function to uppercase the first character of a string
export function uppercaseFirstCharacter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to create a slug from a string
// Default max length of 160 characters
export function slug(string: string | undefined, maximumLength = 160): string {
    if(!string) {
        return '';
    }

    // Remove all apostrophes
    let slug = string.replace(/'/g, '');

    // Replace all non-word characters with a space
    slug = string.replace(/\W/g, ' ');

    // Replace multiple spaces with a single space
    slug = slug.replace(/\s+/g, ' ');

    // Trim leading and trailing spaces
    slug = slug.trim();

    // Lowercase the slug
    slug = slug.toLowerCase();

    // Replace spaces with hyphens
    slug = slug.replace(/\s/g, '-');

    // Truncate the slug
    slug = slug.substring(0, maximumLength);

    return slug;
}

// Function to conver a slug to title case
export function slugToTitleCase(slug: string): string {
    return titleCase(slug.replaceAll('-', ' '));
}
