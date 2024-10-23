// Dependencies - Next.js
import { cookies } from 'next/headers';

// Function to get all request cookies as a header string
export function getRequestCookiesHeaderString() {
    // Initialize an empty string for the cookie header
    let string = '';

    // Iterate over all cookies in the cookieStore
    cookies()
        .getAll()
        .forEach(function (cookie: { name: string; value: string }) {
            string += cookie.name + '=' + cookie.value + '; ';
        });

    return string;
}
