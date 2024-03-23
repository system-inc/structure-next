// Dependencies - Utilities
import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

/**
 * Merges multiple class names into a single string using the `clsx` and `twMerge`.
 *
 * `clsx` is used to concatenate class names, handling various types of input and
 * ignoring falsey values.
 *
 * `twMerge` is used to merge class names according to TailwindCSS conventions.
 *
 * This function is particularly useful in a React component where class names might
 * be conditionally applied based on component state or properties.
 *
 * @param {ClassValue[]} classNameValues - An array of class names to merge. Each `ClassValue` can be a string, or an object where keys are class names and values are booleans indicating whether the class should be included.
 * @returns {string} A single string containing all merged class names, separated by spaces.
 */
export function mergeClassNames(...classNameValues: ClassValue[]): string {
    return twMerge(clsx(classNameValues));
}
