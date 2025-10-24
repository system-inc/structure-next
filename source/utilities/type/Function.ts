// Function to create a sleep delay that can be awaited
export function pause(timeToSleepInMilliseconds: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeToSleepInMilliseconds);
    });
}

// Wraps a function to create a function which delays the invocation of the original function
// until enough time has passed since the last invocation
export function createDelayedUntilIdleFunction(
    functionToInvoke: (...functionToInvokeArguments: any[]) => void,
    timeToWaitInMilliseconds: number,
): (...functionToInvokeArguments: any[]) => void {
    // Store the timeout
    let timeout: NodeJS.Timeout;

    // Return the debounced function
    return function (...executedFunctionArguments: any[]) {
        // The function to invoke when the time has elapsed
        const functionToInvokeWhenTimeHasElapsed = function () {
            // Clear the existing timeout
            clearTimeout(timeout);

            // Invoke the original function
            functionToInvoke(...executedFunctionArguments);
        };

        // console.log('Function called, resetting timer');
        clearTimeout(timeout); // Clear and restart the timeout
        timeout = setTimeout(functionToInvokeWhenTimeHasElapsed, timeToWaitInMilliseconds);
    };
}

// Wraps a function to create a function which delays the invocation of the original function
export function createDelayedFunction(
    functionToInvoke: (...functionToInvokeArguments: any[]) => void,
    timeToWaitInMilliseconds: number,
): (...functionToInvokeArguments: any[]) => void {
    // Return the delayed function
    return function (...executedFunctionArguments: any[]) {
        setTimeout(function () {
            functionToInvoke(...executedFunctionArguments);
        }, timeToWaitInMilliseconds);
    };
}

// Wraps a function to create a function which throttles the invocation of the original function
export function createdThrottledFunction(
    functionToInvoke: (...functionToInvokeArguments: any[]) => void,
    limit: number,
): (...functionToInvokeArguments: any[]) => void {
    let throttled: boolean;

    // Return the throttled function
    return function (...executedFunctionArguments: any[]) {
        if(!throttled) {
            functionToInvoke(...executedFunctionArguments);
            throttled = true;
            setTimeout(function () {
                throttled = false;
            }, limit);
        }
    };
}
