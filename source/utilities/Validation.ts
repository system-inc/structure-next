export function isEmailAddress(string: string): boolean {
    return !(string && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string));
}
