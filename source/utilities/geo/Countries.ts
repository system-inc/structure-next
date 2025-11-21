// Type - Country
export interface CountryInterface {
    code: string;
    emoji: string;
    name: string;
    latitude: number;
    longitude: number;
}

// Function to get a country by name
export function getCountryByName(countryName: string): CountryInterface | undefined {
    // Use the filterCountriesByCountryNames function to get the filtered countries
    const filteredCountries = filterCountriesByCountryNames([countryName]);

    // Return the first country from the filtered countries array
    return filteredCountries.length > 0 ? filteredCountries[0] : undefined;
}

// Function to get a country by code
export function getCountryByCode(countryCode: string): CountryInterface | undefined {
    // Convert the country code to uppercase to ensure case-insensitive matching
    const upperCaseCountryCode = countryCode.toUpperCase();

    // Check if the country code exists in the Countries object
    if(Countries[upperCaseCountryCode]) {
        return Countries[upperCaseCountryCode];
    }

    // If not found, return undefined
    return undefined;
}

// Function to filter countries by country names
export function filterCountriesByCountryNames(countryNames: string[]): CountryInterface[] {
    // Initialize an empty array to store the filtered countries
    const filteredCountries: CountryInterface[] = [];

    // Convert all input country names to lowercase for case-insensitive comparison
    const lowerCaseCountryNames = countryNames.map(function (countryName) {
        return countryName.toLowerCase();
    });

    // Iterate over each country code in the Countries object
    for(const countryCode in Countries) {
        // Get the country object using the country code
        const country = Countries[countryCode];

        // Check if the country's name (converted to lowercase) is included in the lowerCaseCountryNames array
        if(country && lowerCaseCountryNames.includes(country.name.toLowerCase())) {
            // If it is, add the country object to the filteredCountries array
            filteredCountries.push(country);
        }
    }

    // Return the array of filtered countries
    return filteredCountries;
}

// Function to convert a two–letter ISO-3166 country code to its emoji
// Regional-indicator symbols start at 0x1F1E6
export function getCountryEmojiByCountryCode(countryCode: string): string {
    return [...countryCode.toUpperCase()]
        .map(function (character) {
            return String.fromCodePoint(0x1f1e6 + character.charCodeAt(0) - 0x41);
        })
        .join('');
}

// Function to get a country emoji by country name
export function getCountryEmojiByCountryName(countryName?: string | null): string {
    let countryEmoji = '🌐';

    if(countryName) {
        const country = getCountryByName(countryName);

        if(country) {
            countryEmoji = country.emoji;
        }
    }

    return countryEmoji;
}

// Country data
export const Countries: Record<string, CountryInterface> = {
    AD: { code: 'AD', emoji: getCountryEmojiByCountryCode('AD'), name: 'Andorra', latitude: 42.5, longitude: 1.6 },
    AE: {
        code: 'AE',
        emoji: getCountryEmojiByCountryCode('AE'),
        name: 'United Arab Emirates',
        latitude: 24.0,
        longitude: 54.0,
    },
    AF: { code: 'AF', emoji: getCountryEmojiByCountryCode('AF'), name: 'Afghanistan', latitude: 33.0, longitude: 65.0 },
    AG: {
        code: 'AG',
        emoji: getCountryEmojiByCountryCode('AG'),
        name: 'Antigua and Barbuda',
        latitude: 17.05,
        longitude: -61.8,
    },
    AI: {
        code: 'AI',
        emoji: getCountryEmojiByCountryCode('AI'),
        name: 'Anguilla',
        latitude: 18.25,
        longitude: -63.1667,
    },
    AL: { code: 'AL', emoji: getCountryEmojiByCountryCode('AL'), name: 'Albania', latitude: 41.0, longitude: 20.0 },
    AM: { code: 'AM', emoji: getCountryEmojiByCountryCode('AM'), name: 'Armenia', latitude: 40.0, longitude: 45.0 },
    AO: { code: 'AO', emoji: getCountryEmojiByCountryCode('AO'), name: 'Angola', latitude: -12.5, longitude: 18.5 },
    AQ: { code: 'AQ', emoji: getCountryEmojiByCountryCode('AQ'), name: 'Antarctica', latitude: -90.0, longitude: 0.0 },
    AR: { code: 'AR', emoji: getCountryEmojiByCountryCode('AR'), name: 'Argentina', latitude: -34.0, longitude: -64.0 },
    AS: {
        code: 'AS',
        emoji: getCountryEmojiByCountryCode('AS'),
        name: 'American Samoa',
        latitude: -14.3333,
        longitude: -170.0,
    },
    AT: {
        code: 'AT',
        emoji: getCountryEmojiByCountryCode('AT'),
        name: 'Austria',
        latitude: 47.3333,
        longitude: 13.3333,
    },
    AU: { code: 'AU', emoji: getCountryEmojiByCountryCode('AU'), name: 'Australia', latitude: -27.0, longitude: 133.0 },
    AW: { code: 'AW', emoji: getCountryEmojiByCountryCode('AW'), name: 'Aruba', latitude: 12.5, longitude: -69.9667 },
    AZ: { code: 'AZ', emoji: getCountryEmojiByCountryCode('AZ'), name: 'Azerbaijan', latitude: 40.5, longitude: 47.5 },
    BA: {
        code: 'BA',
        emoji: getCountryEmojiByCountryCode('BA'),
        name: 'Bosnia and Herzegovina',
        latitude: 44.0,
        longitude: 18.0,
    },
    BB: {
        code: 'BB',
        emoji: getCountryEmojiByCountryCode('BB'),
        name: 'Barbados',
        latitude: 13.1667,
        longitude: -59.5333,
    },
    BD: { code: 'BD', emoji: getCountryEmojiByCountryCode('BD'), name: 'Bangladesh', latitude: 24.0, longitude: 90.0 },
    BE: { code: 'BE', emoji: getCountryEmojiByCountryCode('BE'), name: 'Belgium', latitude: 50.8333, longitude: 4.0 },
    BF: {
        code: 'BF',
        emoji: getCountryEmojiByCountryCode('BF'),
        name: 'Burkina Faso',
        latitude: 13.0,
        longitude: -2.0,
    },
    BG: { code: 'BG', emoji: getCountryEmojiByCountryCode('BG'), name: 'Bulgaria', latitude: 43.0, longitude: 25.0 },
    BH: { code: 'BH', emoji: getCountryEmojiByCountryCode('BH'), name: 'Bahrain', latitude: 26.0, longitude: 50.55 },
    BI: { code: 'BI', emoji: getCountryEmojiByCountryCode('BI'), name: 'Burundi', latitude: -3.5, longitude: 30.0 },
    BJ: { code: 'BJ', emoji: getCountryEmojiByCountryCode('BJ'), name: 'Benin', latitude: 9.5, longitude: 2.25 },
    BM: {
        code: 'BM',
        emoji: getCountryEmojiByCountryCode('BM'),
        name: 'Bermuda',
        latitude: 32.3333,
        longitude: -64.75,
    },
    BN: {
        code: 'BN',
        emoji: getCountryEmojiByCountryCode('BN'),
        name: 'Brunei Darussalam',
        latitude: 4.5,
        longitude: 114.6667,
    },
    BO: { code: 'BO', emoji: getCountryEmojiByCountryCode('BO'), name: 'Bolivia', latitude: -17.0, longitude: -65.0 },
    BR: { code: 'BR', emoji: getCountryEmojiByCountryCode('BR'), name: 'Brazil', latitude: -10.0, longitude: -55.0 },
    BS: { code: 'BS', emoji: getCountryEmojiByCountryCode('BS'), name: 'Bahamas', latitude: 24.25, longitude: -76.0 },
    BT: { code: 'BT', emoji: getCountryEmojiByCountryCode('BT'), name: 'Bhutan', latitude: 27.5, longitude: 90.5 },
    BV: {
        code: 'BV',
        emoji: getCountryEmojiByCountryCode('BV'),
        name: 'Bouvet Island',
        latitude: -54.4333,
        longitude: 3.4,
    },
    BW: { code: 'BW', emoji: getCountryEmojiByCountryCode('BW'), name: 'Botswana', latitude: -22.0, longitude: 24.0 },
    BY: { code: 'BY', emoji: getCountryEmojiByCountryCode('BY'), name: 'Belarus', latitude: 53.0, longitude: 28.0 },
    BZ: { code: 'BZ', emoji: getCountryEmojiByCountryCode('BZ'), name: 'Belize', latitude: 17.25, longitude: -88.75 },
    CA: { code: 'CA', emoji: getCountryEmojiByCountryCode('CA'), name: 'Canada', latitude: 60.0, longitude: -95.0 },
    CC: {
        code: 'CC',
        emoji: getCountryEmojiByCountryCode('CC'),
        name: 'Cocos (Keeling) Islands',
        latitude: -12.5,
        longitude: 96.8333,
    },
    CD: {
        code: 'CD',
        emoji: getCountryEmojiByCountryCode('CD'),
        name: 'Congo, Democratic Republic of the',
        latitude: 0.0,
        longitude: 25.0,
    },
    CF: {
        code: 'CF',
        emoji: getCountryEmojiByCountryCode('CF'),
        name: 'Central African Republic',
        latitude: 7.0,
        longitude: 21.0,
    },
    CG: { code: 'CG', emoji: getCountryEmojiByCountryCode('CG'), name: 'Congo', latitude: -1.0, longitude: 15.0 },
    CH: { code: 'CH', emoji: getCountryEmojiByCountryCode('CH'), name: 'Switzerland', latitude: 47.0, longitude: 8.0 },
    CI: {
        code: 'CI',
        emoji: getCountryEmojiByCountryCode('CI'),
        name: "Côte d'Ivoire",
        latitude: 8.0,
        longitude: -5.0,
    },
    CK: {
        code: 'CK',
        emoji: getCountryEmojiByCountryCode('CK'),
        name: 'Cook Islands',
        latitude: -21.2333,
        longitude: -159.7667,
    },
    CL: { code: 'CL', emoji: getCountryEmojiByCountryCode('CL'), name: 'Chile', latitude: -30.0, longitude: -71.0 },
    CM: { code: 'CM', emoji: getCountryEmojiByCountryCode('CM'), name: 'Cameroon', latitude: 6.0, longitude: 12.0 },
    CN: { code: 'CN', emoji: getCountryEmojiByCountryCode('CN'), name: 'China', latitude: 35.0, longitude: 105.0 },
    CO: { code: 'CO', emoji: getCountryEmojiByCountryCode('CO'), name: 'Colombia', latitude: 4.0, longitude: -72.0 },
    CR: { code: 'CR', emoji: getCountryEmojiByCountryCode('CR'), name: 'Costa Rica', latitude: 10.0, longitude: -84.0 },
    CU: { code: 'CU', emoji: getCountryEmojiByCountryCode('CU'), name: 'Cuba', latitude: 21.5, longitude: -80.0 },
    CV: { code: 'CV', emoji: getCountryEmojiByCountryCode('CV'), name: 'Cape Verde', latitude: 16.0, longitude: -24.0 },
    CW: { code: 'CW', emoji: getCountryEmojiByCountryCode('CW'), name: 'Curaçao', latitude: 12.25, longitude: -68.75 }, // modern replacement for AN
    CX: {
        code: 'CX',
        emoji: getCountryEmojiByCountryCode('CX'),
        name: 'Christmas Island',
        latitude: -10.5,
        longitude: 105.6667,
    },
    CY: { code: 'CY', emoji: getCountryEmojiByCountryCode('CY'), name: 'Cyprus', latitude: 35.0, longitude: 33.0 },
    CZ: {
        code: 'CZ',
        emoji: getCountryEmojiByCountryCode('CZ'),
        name: 'Czech Republic',
        latitude: 49.75,
        longitude: 15.5,
    },
    DE: { code: 'DE', emoji: getCountryEmojiByCountryCode('DE'), name: 'Germany', latitude: 51.0, longitude: 9.0 },
    DJ: { code: 'DJ', emoji: getCountryEmojiByCountryCode('DJ'), name: 'Djibouti', latitude: 11.5, longitude: 43.0 },
    DK: { code: 'DK', emoji: getCountryEmojiByCountryCode('DK'), name: 'Denmark', latitude: 56.0, longitude: 10.0 },
    DM: {
        code: 'DM',
        emoji: getCountryEmojiByCountryCode('DM'),
        name: 'Dominica',
        latitude: 15.4167,
        longitude: -61.3333,
    },
    DO: {
        code: 'DO',
        emoji: getCountryEmojiByCountryCode('DO'),
        name: 'Dominican Republic',
        latitude: 19.0,
        longitude: -70.6667,
    },
    DZ: { code: 'DZ', emoji: getCountryEmojiByCountryCode('DZ'), name: 'Algeria', latitude: 28.0, longitude: 3.0 },
    EC: { code: 'EC', emoji: getCountryEmojiByCountryCode('EC'), name: 'Ecuador', latitude: -2.0, longitude: -77.5 },
    EE: { code: 'EE', emoji: getCountryEmojiByCountryCode('EE'), name: 'Estonia', latitude: 59.0, longitude: 26.0 },
    EG: { code: 'EG', emoji: getCountryEmojiByCountryCode('EG'), name: 'Egypt', latitude: 27.0, longitude: 30.0 },
    EH: {
        code: 'EH',
        emoji: getCountryEmojiByCountryCode('EH'),
        name: 'Western Sahara',
        latitude: 24.5,
        longitude: -13.0,
    },
    ER: { code: 'ER', emoji: getCountryEmojiByCountryCode('ER'), name: 'Eritrea', latitude: 15.0, longitude: 39.0 },
    ES: { code: 'ES', emoji: getCountryEmojiByCountryCode('ES'), name: 'Spain', latitude: 40.0, longitude: -4.0 },
    ET: { code: 'ET', emoji: getCountryEmojiByCountryCode('ET'), name: 'Ethiopia', latitude: 8.0, longitude: 38.0 },
    FI: { code: 'FI', emoji: getCountryEmojiByCountryCode('FI'), name: 'Finland', latitude: 64.0, longitude: 26.0 },
    FJ: { code: 'FJ', emoji: getCountryEmojiByCountryCode('FJ'), name: 'Fiji', latitude: -18.0, longitude: 175.0 },
    FK: {
        code: 'FK',
        emoji: getCountryEmojiByCountryCode('FK'),
        name: 'Falkland Islands',
        latitude: -51.75,
        longitude: -59.0,
    },
    FM: {
        code: 'FM',
        emoji: getCountryEmojiByCountryCode('FM'),
        name: 'Micronesia, Federated States of',
        latitude: 6.9167,
        longitude: 158.25,
    },
    FO: {
        code: 'FO',
        emoji: getCountryEmojiByCountryCode('FO'),
        name: 'Faroe Islands',
        latitude: 62.0,
        longitude: -7.0,
    },
    FR: { code: 'FR', emoji: getCountryEmojiByCountryCode('FR'), name: 'France', latitude: 46.0, longitude: 2.0 },
    GA: { code: 'GA', emoji: getCountryEmojiByCountryCode('GA'), name: 'Gabon', latitude: -1.0, longitude: 11.75 },
    GB: {
        code: 'GB',
        emoji: getCountryEmojiByCountryCode('GB'),
        name: 'United Kingdom',
        latitude: 54.0,
        longitude: -2.0,
    },
    GD: {
        code: 'GD',
        emoji: getCountryEmojiByCountryCode('GD'),
        name: 'Grenada',
        latitude: 12.1167,
        longitude: -61.6667,
    },
    GE: { code: 'GE', emoji: getCountryEmojiByCountryCode('GE'), name: 'Georgia', latitude: 42.0, longitude: 43.5 },
    GF: {
        code: 'GF',
        emoji: getCountryEmojiByCountryCode('GF'),
        name: 'French Guiana',
        latitude: 4.0,
        longitude: -53.0,
    },
    GG: { code: 'GG', emoji: getCountryEmojiByCountryCode('GG'), name: 'Guernsey', latitude: 49.5, longitude: -2.56 },
    GH: { code: 'GH', emoji: getCountryEmojiByCountryCode('GH'), name: 'Ghana', latitude: 8.0, longitude: -2.0 },
    GI: {
        code: 'GI',
        emoji: getCountryEmojiByCountryCode('GI'),
        name: 'Gibraltar',
        latitude: 36.1833,
        longitude: -5.3667,
    },
    GL: { code: 'GL', emoji: getCountryEmojiByCountryCode('GL'), name: 'Greenland', latitude: 72.0, longitude: -40.0 },
    GM: {
        code: 'GM',
        emoji: getCountryEmojiByCountryCode('GM'),
        name: 'Gambia',
        latitude: 13.4667,
        longitude: -16.5667,
    },
    GN: { code: 'GN', emoji: getCountryEmojiByCountryCode('GN'), name: 'Guinea', latitude: 11.0, longitude: -10.0 },
    GP: {
        code: 'GP',
        emoji: getCountryEmojiByCountryCode('GP'),
        name: 'Guadeloupe',
        latitude: 16.25,
        longitude: -61.5833,
    },
    GQ: {
        code: 'GQ',
        emoji: getCountryEmojiByCountryCode('GQ'),
        name: 'Equatorial Guinea',
        latitude: 2.0,
        longitude: 10.0,
    },
    GR: { code: 'GR', emoji: getCountryEmojiByCountryCode('GR'), name: 'Greece', latitude: 39.0, longitude: 22.0 },
    GS: {
        code: 'GS',
        emoji: getCountryEmojiByCountryCode('GS'),
        name: 'South Georgia and the South Sandwich Islands',
        latitude: -54.5,
        longitude: -37.0,
    },
    GT: { code: 'GT', emoji: getCountryEmojiByCountryCode('GT'), name: 'Guatemala', latitude: 15.5, longitude: -90.25 },
    GU: { code: 'GU', emoji: getCountryEmojiByCountryCode('GU'), name: 'Guam', latitude: 13.4667, longitude: 144.7833 },
    GW: {
        code: 'GW',
        emoji: getCountryEmojiByCountryCode('GW'),
        name: 'Guinea-Bissau',
        latitude: 12.0,
        longitude: -15.0,
    },
    GY: { code: 'GY', emoji: getCountryEmojiByCountryCode('GY'), name: 'Guyana', latitude: 5.0, longitude: -59.0 },
    HK: {
        code: 'HK',
        emoji: getCountryEmojiByCountryCode('HK'),
        name: 'Hong Kong',
        latitude: 22.25,
        longitude: 114.1667,
    },
    HM: {
        code: 'HM',
        emoji: getCountryEmojiByCountryCode('HM'),
        name: 'Heard Island and McDonald Islands',
        latitude: -53.1,
        longitude: 72.5167,
    },
    HN: { code: 'HN', emoji: getCountryEmojiByCountryCode('HN'), name: 'Honduras', latitude: 15.0, longitude: -86.5 },
    HR: { code: 'HR', emoji: getCountryEmojiByCountryCode('HR'), name: 'Croatia', latitude: 45.1667, longitude: 15.5 },
    HT: { code: 'HT', emoji: getCountryEmojiByCountryCode('HT'), name: 'Haiti', latitude: 19.0, longitude: -72.4167 },
    HU: { code: 'HU', emoji: getCountryEmojiByCountryCode('HU'), name: 'Hungary', latitude: 47.0, longitude: 20.0 },
    ID: { code: 'ID', emoji: getCountryEmojiByCountryCode('ID'), name: 'Indonesia', latitude: -5.0, longitude: 120.0 },
    IE: { code: 'IE', emoji: getCountryEmojiByCountryCode('IE'), name: 'Ireland', latitude: 53.0, longitude: -8.0 },
    IL: { code: 'IL', emoji: getCountryEmojiByCountryCode('IL'), name: 'Israel', latitude: 31.5, longitude: 34.75 },
    IM: {
        code: 'IM',
        emoji: getCountryEmojiByCountryCode('IM'),
        name: 'Isle of Man',
        latitude: 54.23,
        longitude: -4.55,
    },
    IN: { code: 'IN', emoji: getCountryEmojiByCountryCode('IN'), name: 'India', latitude: 20.0, longitude: 77.0 },
    IO: {
        code: 'IO',
        emoji: getCountryEmojiByCountryCode('IO'),
        name: 'British Indian Ocean Territory',
        latitude: -6.0,
        longitude: 71.5,
    },
    IQ: { code: 'IQ', emoji: getCountryEmojiByCountryCode('IQ'), name: 'Iraq', latitude: 33.0, longitude: 44.0 },
    IR: {
        code: 'IR',
        emoji: getCountryEmojiByCountryCode('IR'),
        name: 'Iran, Islamic Republic of',
        latitude: 32.0,
        longitude: 53.0,
    },
    IS: { code: 'IS', emoji: getCountryEmojiByCountryCode('IS'), name: 'Iceland', latitude: 65.0, longitude: -18.0 },
    IT: { code: 'IT', emoji: getCountryEmojiByCountryCode('IT'), name: 'Italy', latitude: 42.8333, longitude: 12.8333 },
    JE: { code: 'JE', emoji: getCountryEmojiByCountryCode('JE'), name: 'Jersey', latitude: 49.21, longitude: -2.13 },
    JM: { code: 'JM', emoji: getCountryEmojiByCountryCode('JM'), name: 'Jamaica', latitude: 18.25, longitude: -77.5 },
    JO: { code: 'JO', emoji: getCountryEmojiByCountryCode('JO'), name: 'Jordan', latitude: 31.0, longitude: 36.0 },
    JP: { code: 'JP', emoji: getCountryEmojiByCountryCode('JP'), name: 'Japan', latitude: 36.0, longitude: 138.0 },
    KE: { code: 'KE', emoji: getCountryEmojiByCountryCode('KE'), name: 'Kenya', latitude: 1.0, longitude: 38.0 },
    KG: { code: 'KG', emoji: getCountryEmojiByCountryCode('KG'), name: 'Kyrgyzstan', latitude: 41.0, longitude: 75.0 },
    KH: { code: 'KH', emoji: getCountryEmojiByCountryCode('KH'), name: 'Cambodia', latitude: 13.0, longitude: 105.0 },
    KI: { code: 'KI', emoji: getCountryEmojiByCountryCode('KI'), name: 'Kiribati', latitude: 1.4167, longitude: 173.0 },
    KM: {
        code: 'KM',
        emoji: getCountryEmojiByCountryCode('KM'),
        name: 'Comoros',
        latitude: -12.1667,
        longitude: 44.25,
    },
    KN: {
        code: 'KN',
        emoji: getCountryEmojiByCountryCode('KN'),
        name: 'Saint Kitts and Nevis',
        latitude: 17.3333,
        longitude: -62.75,
    },
    KP: {
        code: 'KP',
        emoji: getCountryEmojiByCountryCode('KP'),
        name: "Korea, Democratic People's Republic of",
        latitude: 40.0,
        longitude: 127.0,
    },
    KR: {
        code: 'KR',
        emoji: getCountryEmojiByCountryCode('KR'),
        name: 'Korea, Republic of',
        latitude: 37.0,
        longitude: 127.5,
    },
    KW: {
        code: 'KW',
        emoji: getCountryEmojiByCountryCode('KW'),
        name: 'Kuwait',
        latitude: 29.3375,
        longitude: 47.6581,
    },
    KY: {
        code: 'KY',
        emoji: getCountryEmojiByCountryCode('KY'),
        name: 'Cayman Islands',
        latitude: 19.5,
        longitude: -80.5,
    },
    KZ: { code: 'KZ', emoji: getCountryEmojiByCountryCode('KZ'), name: 'Kazakhstan', latitude: 48.0, longitude: 68.0 },
    LA: {
        code: 'LA',
        emoji: getCountryEmojiByCountryCode('LA'),
        name: "Lao People's Democratic Republic",
        latitude: 18.0,
        longitude: 105.0,
    },
    LB: {
        code: 'LB',
        emoji: getCountryEmojiByCountryCode('LB'),
        name: 'Lebanon',
        latitude: 33.8333,
        longitude: 35.8333,
    },
    LC: {
        code: 'LC',
        emoji: getCountryEmojiByCountryCode('LC'),
        name: 'Saint Lucia',
        latitude: 13.8833,
        longitude: -61.1333,
    },
    LI: {
        code: 'LI',
        emoji: getCountryEmojiByCountryCode('LI'),
        name: 'Liechtenstein',
        latitude: 47.1667,
        longitude: 9.5333,
    },
    LK: { code: 'LK', emoji: getCountryEmojiByCountryCode('LK'), name: 'Sri Lanka', latitude: 7.0, longitude: 81.0 },
    LR: { code: 'LR', emoji: getCountryEmojiByCountryCode('LR'), name: 'Liberia', latitude: 6.5, longitude: -9.5 },
    LS: { code: 'LS', emoji: getCountryEmojiByCountryCode('LS'), name: 'Lesotho', latitude: -29.5, longitude: 28.5 },
    LT: { code: 'LT', emoji: getCountryEmojiByCountryCode('LT'), name: 'Lithuania', latitude: 56.0, longitude: 24.0 },
    LU: {
        code: 'LU',
        emoji: getCountryEmojiByCountryCode('LU'),
        name: 'Luxembourg',
        latitude: 49.75,
        longitude: 6.1667,
    },
    LV: { code: 'LV', emoji: getCountryEmojiByCountryCode('LV'), name: 'Latvia', latitude: 57.0, longitude: 25.0 },
    LY: { code: 'LY', emoji: getCountryEmojiByCountryCode('LY'), name: 'Libya', latitude: 25.0, longitude: 17.0 },
    MA: { code: 'MA', emoji: getCountryEmojiByCountryCode('MA'), name: 'Morocco', latitude: 32.0, longitude: -5.0 },
    MC: { code: 'MC', emoji: getCountryEmojiByCountryCode('MC'), name: 'Monaco', latitude: 43.7333, longitude: 7.4 },
    MD: { code: 'MD', emoji: getCountryEmojiByCountryCode('MD'), name: 'Moldova', latitude: 47.0, longitude: 29.0 },
    ME: { code: 'ME', emoji: getCountryEmojiByCountryCode('ME'), name: 'Montenegro', latitude: 42.0, longitude: 19.0 },
    MF: {
        code: 'MF',
        emoji: getCountryEmojiByCountryCode('MF'),
        name: 'Saint Martin',
        latitude: 18.0701,
        longitude: -63.0501,
    },
    MG: { code: 'MG', emoji: getCountryEmojiByCountryCode('MG'), name: 'Madagascar', latitude: -20.0, longitude: 47.0 },
    MH: {
        code: 'MH',
        emoji: getCountryEmojiByCountryCode('MH'),
        name: 'Marshall Islands',
        latitude: 9.0,
        longitude: 168.0,
    },
    MK: {
        code: 'MK',
        emoji: getCountryEmojiByCountryCode('MK'),
        name: 'North Macedonia',
        latitude: 41.8333,
        longitude: 22.0,
    },
    ML: { code: 'ML', emoji: getCountryEmojiByCountryCode('ML'), name: 'Mali', latitude: 17.0, longitude: -4.0 },
    MM: { code: 'MM', emoji: getCountryEmojiByCountryCode('MM'), name: 'Myanmar', latitude: 22.0, longitude: 98.0 },
    MN: { code: 'MN', emoji: getCountryEmojiByCountryCode('MN'), name: 'Mongolia', latitude: 46.0, longitude: 105.0 },
    MO: { code: 'MO', emoji: getCountryEmojiByCountryCode('MO'), name: 'Macao', latitude: 22.1667, longitude: 113.55 },
    MP: {
        code: 'MP',
        emoji: getCountryEmojiByCountryCode('MP'),
        name: 'Northern Mariana Islands',
        latitude: 15.2,
        longitude: 145.75,
    },
    MQ: {
        code: 'MQ',
        emoji: getCountryEmojiByCountryCode('MQ'),
        name: 'Martinique',
        latitude: 14.6667,
        longitude: -61.0,
    },
    MR: { code: 'MR', emoji: getCountryEmojiByCountryCode('MR'), name: 'Mauritania', latitude: 20.0, longitude: -12.0 },
    MS: {
        code: 'MS',
        emoji: getCountryEmojiByCountryCode('MS'),
        name: 'Montserrat',
        latitude: 16.75,
        longitude: -62.2,
    },
    MT: { code: 'MT', emoji: getCountryEmojiByCountryCode('MT'), name: 'Malta', latitude: 35.8333, longitude: 14.5833 },
    MU: {
        code: 'MU',
        emoji: getCountryEmojiByCountryCode('MU'),
        name: 'Mauritius',
        latitude: -20.2833,
        longitude: 57.55,
    },
    MV: { code: 'MV', emoji: getCountryEmojiByCountryCode('MV'), name: 'Maldives', latitude: 3.25, longitude: 73.0 },
    MW: { code: 'MW', emoji: getCountryEmojiByCountryCode('MW'), name: 'Malawi', latitude: -13.5, longitude: 34.0 },
    MX: { code: 'MX', emoji: getCountryEmojiByCountryCode('MX'), name: 'Mexico', latitude: 23.0, longitude: -102.0 },
    MY: { code: 'MY', emoji: getCountryEmojiByCountryCode('MY'), name: 'Malaysia', latitude: 2.5, longitude: 112.5 },
    MZ: {
        code: 'MZ',
        emoji: getCountryEmojiByCountryCode('MZ'),
        name: 'Mozambique',
        latitude: -18.25,
        longitude: 35.0,
    },
    NA: { code: 'NA', emoji: getCountryEmojiByCountryCode('NA'), name: 'Namibia', latitude: -22.0, longitude: 17.0 },
    NC: {
        code: 'NC',
        emoji: getCountryEmojiByCountryCode('NC'),
        name: 'New Caledonia',
        latitude: -21.5,
        longitude: 165.5,
    },
    NE: { code: 'NE', emoji: getCountryEmojiByCountryCode('NE'), name: 'Niger', latitude: 16.0, longitude: 8.0 },
    NF: {
        code: 'NF',
        emoji: getCountryEmojiByCountryCode('NF'),
        name: 'Norfolk Island',
        latitude: -29.0333,
        longitude: 167.95,
    },
    NG: { code: 'NG', emoji: getCountryEmojiByCountryCode('NG'), name: 'Nigeria', latitude: 10.0, longitude: 8.0 },
    NI: { code: 'NI', emoji: getCountryEmojiByCountryCode('NI'), name: 'Nicaragua', latitude: 13.0, longitude: -85.0 },
    NL: { code: 'NL', emoji: getCountryEmojiByCountryCode('NL'), name: 'Netherlands', latitude: 52.5, longitude: 5.75 },
    NO: { code: 'NO', emoji: getCountryEmojiByCountryCode('NO'), name: 'Norway', latitude: 62.0, longitude: 10.0 },
    NP: { code: 'NP', emoji: getCountryEmojiByCountryCode('NP'), name: 'Nepal', latitude: 28.0, longitude: 84.0 },
    NR: {
        code: 'NR',
        emoji: getCountryEmojiByCountryCode('NR'),
        name: 'Nauru',
        latitude: -0.5333,
        longitude: 166.9167,
    },
    NU: {
        code: 'NU',
        emoji: getCountryEmojiByCountryCode('NU'),
        name: 'Niue',
        latitude: -19.0333,
        longitude: -169.8667,
    },
    NZ: {
        code: 'NZ',
        emoji: getCountryEmojiByCountryCode('NZ'),
        name: 'New Zealand',
        latitude: -41.0,
        longitude: 174.0,
    },
    OM: { code: 'OM', emoji: getCountryEmojiByCountryCode('OM'), name: 'Oman', latitude: 21.0, longitude: 57.0 },
    PA: { code: 'PA', emoji: getCountryEmojiByCountryCode('PA'), name: 'Panama', latitude: 9.0, longitude: -80.0 },
    PE: { code: 'PE', emoji: getCountryEmojiByCountryCode('PE'), name: 'Peru', latitude: -10.0, longitude: -76.0 },
    PF: {
        code: 'PF',
        emoji: getCountryEmojiByCountryCode('PF'),
        name: 'French Polynesia',
        latitude: -15.0,
        longitude: -140.0,
    },
    PG: {
        code: 'PG',
        emoji: getCountryEmojiByCountryCode('PG'),
        name: 'Papua New Guinea',
        latitude: -6.0,
        longitude: 147.0,
    },
    PH: {
        code: 'PH',
        emoji: getCountryEmojiByCountryCode('PH'),
        name: 'Philippines',
        latitude: 13.0,
        longitude: 122.0,
    },
    PK: { code: 'PK', emoji: getCountryEmojiByCountryCode('PK'), name: 'Pakistan', latitude: 30.0, longitude: 70.0 },
    PL: { code: 'PL', emoji: getCountryEmojiByCountryCode('PL'), name: 'Poland', latitude: 52.0, longitude: 20.0 },
    PM: {
        code: 'PM',
        emoji: getCountryEmojiByCountryCode('PM'),
        name: 'Saint Pierre and Miquelon',
        latitude: 46.8333,
        longitude: -56.3333,
    },
    PN: { code: 'PN', emoji: getCountryEmojiByCountryCode('PN'), name: 'Pitcairn', latitude: -24.7, longitude: -127.4 },
    PR: {
        code: 'PR',
        emoji: getCountryEmojiByCountryCode('PR'),
        name: 'Puerto Rico',
        latitude: 18.25,
        longitude: -66.5,
    },
    PS: {
        code: 'PS',
        emoji: getCountryEmojiByCountryCode('PS'),
        name: 'Palestine, State of',
        latitude: 32.0,
        longitude: 35.25,
    },
    PT: { code: 'PT', emoji: getCountryEmojiByCountryCode('PT'), name: 'Portugal', latitude: 39.5, longitude: -8.0 },
    PW: { code: 'PW', emoji: getCountryEmojiByCountryCode('PW'), name: 'Palau', latitude: 7.5, longitude: 134.5 },
    PY: { code: 'PY', emoji: getCountryEmojiByCountryCode('PY'), name: 'Paraguay', latitude: -23.0, longitude: -58.0 },
    QA: { code: 'QA', emoji: getCountryEmojiByCountryCode('QA'), name: 'Qatar', latitude: 25.5, longitude: 51.25 },
    RE: { code: 'RE', emoji: getCountryEmojiByCountryCode('RE'), name: 'Réunion', latitude: -21.1, longitude: 55.6 },
    RO: { code: 'RO', emoji: getCountryEmojiByCountryCode('RO'), name: 'Romania', latitude: 46.0, longitude: 25.0 },
    RS: { code: 'RS', emoji: getCountryEmojiByCountryCode('RS'), name: 'Serbia', latitude: 44.0, longitude: 21.0 },
    RU: {
        code: 'RU',
        emoji: getCountryEmojiByCountryCode('RU'),
        name: 'Russian Federation',
        latitude: 60.0,
        longitude: 100.0,
    },
    RW: { code: 'RW', emoji: getCountryEmojiByCountryCode('RW'), name: 'Rwanda', latitude: -2.0, longitude: 30.0 },
    SA: {
        code: 'SA',
        emoji: getCountryEmojiByCountryCode('SA'),
        name: 'Saudi Arabia',
        latitude: 25.0,
        longitude: 45.0,
    },
    SB: {
        code: 'SB',
        emoji: getCountryEmojiByCountryCode('SB'),
        name: 'Solomon Islands',
        latitude: -8.0,
        longitude: 159.0,
    },
    SC: {
        code: 'SC',
        emoji: getCountryEmojiByCountryCode('SC'),
        name: 'Seychelles',
        latitude: -4.5833,
        longitude: 55.6667,
    },
    SD: { code: 'SD', emoji: getCountryEmojiByCountryCode('SD'), name: 'Sudan', latitude: 15.0, longitude: 30.0 },
    SE: { code: 'SE', emoji: getCountryEmojiByCountryCode('SE'), name: 'Sweden', latitude: 62.0, longitude: 15.0 },
    SG: {
        code: 'SG',
        emoji: getCountryEmojiByCountryCode('SG'),
        name: 'Singapore',
        latitude: 1.3667,
        longitude: 103.8,
    },
    SH: {
        code: 'SH',
        emoji: getCountryEmojiByCountryCode('SH'),
        name: 'Saint Helena, Ascension and Tristan da Cunha',
        latitude: -15.9333,
        longitude: -5.7,
    },
    SI: { code: 'SI', emoji: getCountryEmojiByCountryCode('SI'), name: 'Slovenia', latitude: 46.0, longitude: 15.0 },
    SJ: {
        code: 'SJ',
        emoji: getCountryEmojiByCountryCode('SJ'),
        name: 'Svalbard and Jan Mayen',
        latitude: 78.0,
        longitude: 20.0,
    },
    SK: { code: 'SK', emoji: getCountryEmojiByCountryCode('SK'), name: 'Slovakia', latitude: 48.6667, longitude: 19.5 },
    SL: {
        code: 'SL',
        emoji: getCountryEmojiByCountryCode('SL'),
        name: 'Sierra Leone',
        latitude: 8.5,
        longitude: -11.5,
    },
    SM: {
        code: 'SM',
        emoji: getCountryEmojiByCountryCode('SM'),
        name: 'San Marino',
        latitude: 43.7667,
        longitude: 12.4167,
    },
    SN: { code: 'SN', emoji: getCountryEmojiByCountryCode('SN'), name: 'Senegal', latitude: 14.0, longitude: -14.0 },
    SO: { code: 'SO', emoji: getCountryEmojiByCountryCode('SO'), name: 'Somalia', latitude: 10.0, longitude: 49.0 },
    SR: { code: 'SR', emoji: getCountryEmojiByCountryCode('SR'), name: 'Suriname', latitude: 4.0, longitude: -56.0 },
    SS: { code: 'SS', emoji: getCountryEmojiByCountryCode('SS'), name: 'South Sudan', latitude: 8.0, longitude: 30.0 },
    ST: {
        code: 'ST',
        emoji: getCountryEmojiByCountryCode('ST'),
        name: 'Sao Tome and Principe',
        latitude: 1.0,
        longitude: 7.0,
    },
    SV: {
        code: 'SV',
        emoji: getCountryEmojiByCountryCode('SV'),
        name: 'El Salvador',
        latitude: 13.8333,
        longitude: -88.9167,
    },
    SX: {
        code: 'SX',
        emoji: getCountryEmojiByCountryCode('SX'),
        name: 'Sint Maarten',
        latitude: 18.0417,
        longitude: -63.0693,
    },
    SY: {
        code: 'SY',
        emoji: getCountryEmojiByCountryCode('SY'),
        name: 'Syrian Arab Republic',
        latitude: 35.0,
        longitude: 38.0,
    },
    SZ: { code: 'SZ', emoji: getCountryEmojiByCountryCode('SZ'), name: 'Eswatini', latitude: -26.5, longitude: 31.5 },
    TC: {
        code: 'TC',
        emoji: getCountryEmojiByCountryCode('TC'),
        name: 'Turks and Caicos Islands',
        latitude: 21.75,
        longitude: -71.5833,
    },
    TD: { code: 'TD', emoji: getCountryEmojiByCountryCode('TD'), name: 'Chad', latitude: 15.0, longitude: 19.0 },
    TF: {
        code: 'TF',
        emoji: getCountryEmojiByCountryCode('TF'),
        name: 'French Southern Territories',
        latitude: -43.0,
        longitude: 67.0,
    },
    TG: { code: 'TG', emoji: getCountryEmojiByCountryCode('TG'), name: 'Togo', latitude: 8.0, longitude: 1.1667 },
    TH: { code: 'TH', emoji: getCountryEmojiByCountryCode('TH'), name: 'Thailand', latitude: 15.0, longitude: 100.0 },
    TJ: { code: 'TJ', emoji: getCountryEmojiByCountryCode('TJ'), name: 'Tajikistan', latitude: 39.0, longitude: 71.0 },
    TK: { code: 'TK', emoji: getCountryEmojiByCountryCode('TK'), name: 'Tokelau', latitude: -9.0, longitude: -172.0 },
    TL: {
        code: 'TL',
        emoji: getCountryEmojiByCountryCode('TL'),
        name: 'Timor-Leste',
        latitude: -8.55,
        longitude: 125.5167,
    },
    TM: {
        code: 'TM',
        emoji: getCountryEmojiByCountryCode('TM'),
        name: 'Turkmenistan',
        latitude: 40.0,
        longitude: 60.0,
    },
    TN: { code: 'TN', emoji: getCountryEmojiByCountryCode('TN'), name: 'Tunisia', latitude: 34.0, longitude: 9.0 },
    TO: { code: 'TO', emoji: getCountryEmojiByCountryCode('TO'), name: 'Tonga', latitude: -20.0, longitude: -175.0 },
    TR: { code: 'TR', emoji: getCountryEmojiByCountryCode('TR'), name: 'Turkey', latitude: 39.0, longitude: 35.0 },
    TT: {
        code: 'TT',
        emoji: getCountryEmojiByCountryCode('TT'),
        name: 'Trinidad and Tobago',
        latitude: 11.0,
        longitude: -61.0,
    },
    TV: { code: 'TV', emoji: getCountryEmojiByCountryCode('TV'), name: 'Tuvalu', latitude: -8.0, longitude: 178.0 },
    TW: {
        code: 'TW',
        emoji: getCountryEmojiByCountryCode('TW'),
        name: 'Taiwan',
        latitude: 23.5,
        longitude: 121.0,
    },
    TZ: {
        code: 'TZ',
        emoji: getCountryEmojiByCountryCode('TZ'),
        name: 'Tanzania',
        latitude: -6.0,
        longitude: 35.0,
    },
    UA: { code: 'UA', emoji: getCountryEmojiByCountryCode('UA'), name: 'Ukraine', latitude: 49.0, longitude: 32.0 },
    UG: { code: 'UG', emoji: getCountryEmojiByCountryCode('UG'), name: 'Uganda', latitude: 1.0, longitude: 32.0 },
    UM: {
        code: 'UM',
        emoji: getCountryEmojiByCountryCode('UM'),
        name: 'United States Minor Outlying Islands',
        latitude: 19.2833,
        longitude: 166.6,
    },
    US: {
        code: 'US',
        emoji: getCountryEmojiByCountryCode('US'),
        name: 'United States',
        latitude: 38.0,
        longitude: -97.0,
    },
    UY: { code: 'UY', emoji: getCountryEmojiByCountryCode('UY'), name: 'Uruguay', latitude: -33.0, longitude: -56.0 },
    UZ: { code: 'UZ', emoji: getCountryEmojiByCountryCode('UZ'), name: 'Uzbekistan', latitude: 41.0, longitude: 64.0 },
    VA: {
        code: 'VA',
        emoji: getCountryEmojiByCountryCode('VA'),
        name: 'Holy See (Vatican City State)',
        latitude: 41.9,
        longitude: 12.45,
    },
    VC: {
        code: 'VC',
        emoji: getCountryEmojiByCountryCode('VC'),
        name: 'Saint Vincent and the Grenadines',
        latitude: 13.25,
        longitude: -61.2,
    },
    VE: { code: 'VE', emoji: getCountryEmojiByCountryCode('VE'), name: 'Venezuela', latitude: 8.0, longitude: -66.0 },
    VG: {
        code: 'VG',
        emoji: getCountryEmojiByCountryCode('VG'),
        name: 'Virgin Islands, British',
        latitude: 18.5,
        longitude: -64.5,
    },
    VI: {
        code: 'VI',
        emoji: getCountryEmojiByCountryCode('VI'),
        name: 'Virgin Islands, U.S.',
        latitude: 18.3333,
        longitude: -64.8333,
    },
    VN: { code: 'VN', emoji: getCountryEmojiByCountryCode('VN'), name: 'Viet Nam', latitude: 16.0, longitude: 106.0 },
    VU: { code: 'VU', emoji: getCountryEmojiByCountryCode('VU'), name: 'Vanuatu', latitude: -16.0, longitude: 167.0 },
    WF: {
        code: 'WF',
        emoji: getCountryEmojiByCountryCode('WF'),
        name: 'Wallis and Futuna',
        latitude: -13.3,
        longitude: -176.2,
    },
    WS: {
        code: 'WS',
        emoji: getCountryEmojiByCountryCode('WS'),
        name: 'Samoa',
        latitude: -13.5833,
        longitude: -172.3333,
    },
    YE: { code: 'YE', emoji: getCountryEmojiByCountryCode('YE'), name: 'Yemen', latitude: 15.0, longitude: 48.0 },
    YT: {
        code: 'YT',
        emoji: getCountryEmojiByCountryCode('YT'),
        name: 'Mayotte',
        latitude: -12.8333,
        longitude: 45.1667,
    },
    ZA: {
        code: 'ZA',
        emoji: getCountryEmojiByCountryCode('ZA'),
        name: 'South Africa',
        latitude: -29.0,
        longitude: 24.0,
    },
    ZM: { code: 'ZM', emoji: getCountryEmojiByCountryCode('ZM'), name: 'Zambia', latitude: -15.0, longitude: 30.0 },
    ZW: { code: 'ZW', emoji: getCountryEmojiByCountryCode('ZW'), name: 'Zimbabwe', latitude: -20.0, longitude: 30.0 },
};
