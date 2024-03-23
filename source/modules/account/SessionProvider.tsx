'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Dependencies - Accounts
import Session from '@structure/source/modules/account/Session';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { accountSignOutMutationDocument } from '@structure/source/modules/account/api/AccountDocuments';

// Context - Session
interface SessionContextInterface {
    sessionToken: string | null;
    setSessionToken: (newSessionToken: string | null) => void;
    signOut: () => Promise<any>;
}
const SessionContext = React.createContext<SessionContextInterface>({
    sessionToken: null,
    setSessionToken: (newSessionToken: string | null) => {
        console.error('No SessionProvider found.');
    },
    signOut: () => {
        console.error('No SessionProvider found.');
        return Promise.resolve();
    },
});

// Component - SessionProvider
export interface SessionProviderInterface {
    children: React.ReactNode;
}
export function SessionProvider({ children }: SessionProviderInterface) {
    // Next router and pathname
    const router = useRouter();
    const pathname = usePathname();

    // Session token state
    const [sessionToken, setSessionToken] = React.useState<string | null>(null);

    // Sign out mutation
    const [accountSignOutMutation, accountSignOutMutationState] = useMutation(accountSignOutMutationDocument);

    // Updated the function name to 'updateSessionToken'
    const updateSessionToken = React.useCallback(function (newSessionToken: string | null) {
        // Allow for null values
        if(newSessionToken) {
            Session.setToken(newSessionToken); // Set the new token
        }
        else {
            Session.deleteToken(); // Delete the token if null is passed
        }
        setSessionToken(newSessionToken); // Update state regardless of the new token value
        // console.log('Session token updated:', newSessionToken);
    }, []);

    // Sign out function
    const signOut = React.useCallback(
        function () {
            // Invoke the GraphQL mutation, using the current session token
            return accountSignOutMutation({
                variables: {},
                onCompleted: (data) => {
                    // Now that we are signed out on the server, we can set the local session token to null
                    // console.log('accountSignOutMutation onCompleted', data);
                    updateSessionToken(null);

                    // Redirect to root if the current path starts with /internal
                    // if(pathname.startsWith('/internal')) {
                    //     router.push('/');
                    // }
                },
                onError: (error) => {
                    // console.error('accountSignOutMutation onError', error);
                },
            });
        },
        [accountSignOutMutation, updateSessionToken],
    );

    // On mount
    React.useEffect(
        function () {
            function handleLocalStorageChange(event: StorageEvent) {
                if(event.key === Session.sessionTokenKey) {
                    updateSessionToken(event.newValue);
                }
            }

            setSessionToken(Session.getToken());

            // Listen for changes in local storage
            window.addEventListener('storage', handleLocalStorageChange);

            // Clean up event listener
            return () => {
                window.removeEventListener('storage', handleLocalStorageChange);
            };
        },
        [updateSessionToken],
    );

    // Render the component
    return (
        <SessionContext.Provider value={{ sessionToken, setSessionToken: updateSessionToken, signOut }}>
            {children}
        </SessionContext.Provider>
    );
}

// Hook - useSession
export function useSession() {
    return React.useContext(SessionContext);
}

// Export - Default
export default SessionProvider;
