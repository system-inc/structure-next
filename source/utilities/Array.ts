/**
 * Swaps two elements in an array
 */
export function swapArrayElements<T>(array: T[], fromIndex: number, toIndex: number) {
    // Clone the array
    const arrayClone = array.slice();

    // Reference the item that is being moved
    const data = arrayClone[fromIndex];

    // // Replace the item that is being moved with the item that is being replaced
    // arrayClone[fromIndex] = arrayClone[toIndex] as T;

    // // Replace the item that is being replaced with the item that is being moved
    // arrayClone[toIndex] = data as T;

    // Remove the item that is being moved
    arrayClone.splice(fromIndex, 1);

    // Insert the item that is being moved at the new index
    arrayClone.splice(toIndex, 0, data as T);

    // Return the new array
    return arrayClone;
}
