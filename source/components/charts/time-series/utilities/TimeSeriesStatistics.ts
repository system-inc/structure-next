// Type - TimeSeriesStatistics
export interface TimeSeriesStatistics {
    count: number;
    sum: number;
    minimum: number;
    maximum: number;
    range: number;
    average: number;
    median: number;
    mode: number;
    standardDeviation: number;
    standardDeviationMessage: string;
    percentiles: Map<number, number>; // A map of percentile to value
}

// Function to calculate statistics for a time series dataset
export function calculateStatistics(dataPoints: number[]): TimeSeriesStatistics {
    // Sort the data points from smallest to largest
    const sortedData = [...dataPoints].sort((a, b) => a - b);

    // The count is the length of the sorted array
    const count = sortedData.length;

    // The sum is the sum of all the elements in the sorted array
    const sum = sortedData.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    // The minimum is the first element in the sorted array
    const minimum = sortedData[0] ?? 0;

    // The maximum is the last element in the sorted array
    const maximum = sortedData[sortedData.length - 1] ?? 0;

    // The range is the difference between the maximum and minimum
    const range = maximum - minimum;

    // The average is the sum divided by the count, rounded to the first decimal place
    const average = Math.round((sum / count) * 100) / 100;

    // The median is the middle element of the sorted array
    let median: number | 0;
    // If the length of the sorted array is even, the median is the average of the two middle elements
    if(sortedData.length % 2 === 0) {
        const middleIndex1 = sortedData.length / 2 - 1;
        const middleIndex2 = sortedData.length / 2;
        const middle1 = sortedData[middleIndex1] ?? 0;
        const middle2 = sortedData[middleIndex2] ?? 0;
        median = middle1 !== null && middle2 !== null ? (middle1 + middle2) / 2 : 0;
    }
    // If the length of the sorted array is odd, the median is the middle element
    else {
        median = sortedData[Math.floor(sortedData.length / 2)] ?? 0;
    }

    // The mode is the most common element in the sorted array
    let mode: number = 0;

    // Initialize a Map to count occurrences
    const frequencyMap = new Map<number, number>();
    sortedData.forEach(function (number) {
        const count = frequencyMap.get(number) || 0;
        frequencyMap.set(number, count + 1);
    });

    // Find the mode
    let maxFrequency = 0;
    frequencyMap.forEach(function (count, number) {
        if(count > maxFrequency) {
            maxFrequency = count;
            mode = number;
        }
    });

    // Calculate the variance, which is the average of the squared differences from the mean
    const variance =
        dataPoints.reduce((previousValue, currentValue) => previousValue + Math.pow(currentValue - average, 2), 0) /
        count;

    // Calculate the standard deviation
    const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

    // Calculate the standard deviation message
    let standardDeviationMessage = '';
    const ratio = standardDeviation / average;
    if(ratio < 0.05) {
        standardDeviationMessage = 'High Precision, Minimal Spread';
    }
    else if(ratio < 0.2) {
        standardDeviationMessage = 'Consistent Data, Limited Spread';
    }
    else if(ratio < 0.3) {
        standardDeviationMessage = 'Balanced Spread, Moderate Variation';
    }
    else if(ratio < 0.5) {
        standardDeviationMessage = 'Diverse Values, Noticeable Spread';
    }
    else {
        standardDeviationMessage = 'Wide Range, High Variability';
    }

    // Function to calculate a specific percentile
    const getPercentile = function (sortedData: number[], p: number): number {
        if(sortedData.length === 0) return 0;

        const position = (sortedData.length - 1) * p;
        const base = Math.floor(position);
        const rest = position - base;

        const baseNumber = sortedData[base] as number;
        if(base < sortedData.length - 1) {
            const nextValue = sortedData[base + 1] as number;
            return Math.round(baseNumber + rest * (nextValue - baseNumber));
        }
        else {
            return Math.round(baseNumber);
        }
    };

    // Calculate specific percentiles (e.g., 25th, 50th, 75th, 95th)
    const percentiles = new Map<number, number>();
    [0.05, 0.25, 0.5, 0.75, 0.95].forEach(function (percentage) {
        percentiles.set(percentage * 100, getPercentile(sortedData, percentage));
    });

    return {
        count,
        sum,
        minimum,
        maximum,
        range,
        median,
        average,
        mode,
        standardDeviation,
        standardDeviationMessage,
        percentiles,
    };
}
