// Dependencies - Next.js
import { cookies as NextCookies, headers as NextHeaders } from 'next/headers';

// Function to get all request cookies as a header string
export async function getRequestCookiesHeaderString() {
    // Initialize an empty string for the cookie header
    let string = '';

    // Iterate over all cookies in the cookieStore
    (await NextCookies())
        .getAll()
        .forEach(function (cookie: { name: string; value: string }) {
            string += cookie.name + '=' + cookie.value + '; ';
        });

    return string;
}

// Function to get the country code from request headers
export async function getCountryCodeFromHeaders() {
    const headers = await NextHeaders();

    // Get the country code from various possible headers
    const countryCode =
        headers.get('x-open-next-country') ||
        headers.get('x-vercel-ip-country') ||
        headers.get('cf-ipcountry') ||
        headers.get('x-country-code');

    return countryCode ?? undefined;
}

// Function to get the public IP address from request headers
export async function getPublicIpAddressFromHeaders() {
    const headers = await NextHeaders();

    // Log all headers as a string
    // console.log('All Headers:', JSON.stringify(header));

    // "x-open-next-city":"American%20Fork"
    // "x-open-next-country":"US"
    // "x-open-next-latitude":"40.37690"
    // "x-open-next-longitude":"-111.79580"
    // "x-open-next-region":"UT"
    // "x-real-ip":"123.456.789.111",
    // "x-vercel-ip-city":"American%20Fork",
    // "x-vercel-ip-country":"US",
    // "x-vercel-ip-country-region":"UT",
    // "x-vercel-ip-latitude":"40.37690",
    // "x-vercel-ip-longitude":"-111.79580",

    // Get potential IP headers (prioritizing Cloudflare and x-real-ip headers)
    const cfConnectingIp = headers.get('cf-connecting-ip');
    const realIp = headers.get('x-real-ip');
    const trueClientIp = headers.get('true-client-ip');
    const forwardedFor = headers.get('x-forwarded-for');

    // Prioritize headers that are working correctly in production
    // Use Cloudflare IPs first, then real-ip, then others
    let publicIpAddress = cfConnectingIp || realIp || trueClientIp;

    // Only use x-forwarded-for if it doesn't contain ::1 and the other headers are missing
    if(!publicIpAddress && forwardedFor && forwardedFor !== '::1') {
        // If there are multiple IPs in x-forwarded-for, take the first one
        if(forwardedFor.includes(',')) {
            const firstIp = forwardedFor.split(',')[0];
            if(firstIp) {
                publicIpAddress = firstIp.trim();
            }
            else {
                publicIpAddress = forwardedFor;
            }
        }
        else {
            publicIpAddress = forwardedFor;
        }
    }

    return publicIpAddress ?? undefined;
}
