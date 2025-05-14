// Dependencies - Utilities
import { CountryInterface, Countries, getCountryByCode } from '@structure/source/utilities/geo/Countries';

// Function to calculate the Haversine distance between two geographical points
export function haversineDistanceInKilometers(
    latitudeA: number,
    longitudeA: number,
    latitudeB: number,
    longitudeB: number,
): number {
    const earthRadiusInKilometers = 6371;

    // Get the differences in latitude and longitude
    const latitudeDelta = degreesToRadians(latitudeB - latitudeA);
    const longitudeDelta = degreesToRadians(longitudeB - longitudeA);

    // Haversine formula
    const a =
        Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
        Math.cos(degreesToRadians(latitudeA)) *
            Math.cos(degreesToRadians(latitudeB)) *
            Math.sin(longitudeDelta / 2) *
            Math.sin(longitudeDelta / 2);

    const angularDistanceInRadians = 2 * Math.asin(Math.sqrt(a));

    return earthRadiusInKilometers * angularDistanceInRadians;
}

// Function to convert degrees to radians
export function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

// Function to convert radians to degrees
export function radiansToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
}

// Function to get the nearest country, returning a CountryInterface object
export function getClosestAvailableCountryUsingCountryCode(
    availableCountries: CountryInterface[], // Array of available countries, with at least one country
    countryCodeInput?: string, // Country code to find the closest available country (can be unsanitized)
    defaultCountryCode: keyof typeof Countries = 'US', // Default country code to use if countryCode is not found
): CountryInterface {
    // Determine the reference country based on countryCodeInput or default to 'US'
    const referenceCountry: CountryInterface =
        (countryCodeInput && getCountryByCode(countryCodeInput)) || getCountryByCode(defaultCountryCode)!;

    if(availableCountries.length === 0) {
        // If no available countries, return the reference country
        return referenceCountry;
    }

    // Find the closest country from the availableCountries list
    let nearestCountry: CountryInterface = availableCountries[0]!;

    // Calculate initial minimum distance using the first available country
    let minimumDistance = haversineDistanceInKilometers(
        referenceCountry.latitude,
        referenceCountry.longitude,
        nearestCountry.latitude,
        nearestCountry.longitude,
    );
    // console.log('minimumDistance', minimumDistance);

    // Iterate through the rest of the available countries (starting from the second if available)
    for(let i = 1; i < availableCountries.length; i++) {
        const currentAvailableCountry = availableCountries[i]!;
        const distance = haversineDistanceInKilometers(
            referenceCountry.latitude,
            referenceCountry.longitude,
            currentAvailableCountry.latitude,
            currentAvailableCountry.longitude,
        );

        // If the current country is closer than the previously found nearest country
        if(distance < minimumDistance) {
            // console.log('New minimum distance found:', distance, currentAvailableCountry.name);

            // Update the minimum distance and set the current country as the nearest country
            minimumDistance = distance;
            nearestCountry = currentAvailableCountry;
        }

        // If the distance is zero, break the loop as we found an exact match
        if(distance === 0) {
            break;
        }
    }

    // Return the nearest country
    return nearestCountry;
}
