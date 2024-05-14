// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies
import { type CookieSetOptions } from 'universal-cookie';
import cookies from '@structure/source/utilities/Cookies';

// Class - Session
export class Session {
    static sessionTokenKey = StructureSettings.identifier + 'SessionToken';

    static cookieConfiguration: CookieSetOptions = {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: 'strict',
        secure: true,
        // partitioned: true, // https://developer.mozilla.org/en-US/docs/Web/Privacy/Privacy_sandbox/Partitioned_cookies
    };

    // Gets the session token from the browser cookies
    static getToken() {
        return cookies.get(Session.sessionTokenKey) as string | null;
    }

    // Sets the session token in local storage and the browser cookies
    static setToken(sessionToken: string) {
        // Set the session token in local storage
        localStorage.setItem(Session.sessionTokenKey, sessionToken);

        return cookies.set(Session.sessionTokenKey, sessionToken, Session.cookieConfiguration);
    }

    // Deletes the session token from local storage and the browser cookies
    static deleteToken() {
        // Delete the session token from local storage
        localStorage.removeItem(Session.sessionTokenKey);

        return cookies.remove(Session.sessionTokenKey, Session.cookieConfiguration);
    }
}

// Export - Default
export default Session;
