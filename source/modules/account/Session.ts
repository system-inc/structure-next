// Dependencies
import { type CookieSetOptions } from 'universal-cookie';
import cookies from '@structure/source/utilities/Cookies';

// Class - Session
export class Session {
    static sessionTokenKey = 'sessionToken';

    static cookieConfiguration: CookieSetOptions = {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: 'strict',
        secure: true,
        // partitioned: true, // https://developer.mozilla.org/en-US/docs/Web/Privacy/Privacy_sandbox/Partitioned_cookies
    };

    // Gets the session token from the browser cookies
    static getToken() {
        return cookies.get(this.sessionTokenKey) as string | null;
    }

    // Sets the session token in local storage and the browser cookies
    static setToken(sessionToken: string) {
        // Set the session token in local storage
        localStorage.setItem(this.sessionTokenKey, sessionToken);

        return cookies.set(this.sessionTokenKey, sessionToken, this.cookieConfiguration);
    }

    // Deletes the session token from local storage and the browser cookies
    static deleteToken() {
        // Delete the session token from local storage
        localStorage.removeItem(this.sessionTokenKey);

        return cookies.remove(this.sessionTokenKey, this.cookieConfiguration);
    }
}

// Export - Default
export default Session;
