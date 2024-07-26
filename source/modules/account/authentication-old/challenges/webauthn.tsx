import React from 'react';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeInput from './common/ChallengeInput';
import Button from '@structure/source/common/buttons/Button';
import { atomWithStorage } from 'jotai/utils';
import { useAtom, useAtomValue } from 'jotai';
import { emailAtom } from '../AuthenticationForm';

type Props = {};

const WebAuthn = (props: Props) => {
    const [{ data, error, loading }, signInWithPasskey] = usePasskeySignIn();

    React.useEffect(() => {
        if(data) {
            // Submit the challenge to request a new one.
            document.getElementById('webauthn-submit')?.click();
        }
    }, [data, error]);

    return (
        <div className="flex flex-col items-center space-y-6">
            <Button type="button" onClick={signInWithPasskey} loading={loading} disabled={loading}>
                Sign In via Passkey
            </Button>

            {/* FIXME: Just submitting the challenge to request a new one, but ideally this would be a separate request in the future. */}
            <Button variant="ghost" type="submit" size="sm">
                Try another way
            </Button>

            {/* Hidden submit button */}
            <button className="hidden" type="submit" id="webauthn-submit" aria-hidden={true} />
        </div>
    );
};

export default WebAuthn;

const persistentCredentialsAtom = atomWithStorage('publicKeyCredentialsPhiHealth', [] as string[]);
function usePasskeySignIn() {
    const email = useAtomValue(emailAtom);
    const [persistentCredentials, setPersistentCredentials] = useAtom(persistentCredentialsAtom);
    const [passkeySignInState, setPasskeySignInState] = React.useState<{
        data?: any;
        error?: Error;
        loading: boolean;
    }>({
        data: undefined,
        error: undefined,
        loading: false,
    });

    async function signInWithPasskey() {
        setPasskeySignInState((prev) => ({
            ...prev,
            loading: true,
        }));

        if(!email) {
            setPasskeySignInState((prev) => ({
                ...prev,
                loading: false,
                error: new Error('Email address is required.'),
            }));
            return;
        }

        // Check if the browser supports the Web Authentication API.
        if(!window.PublicKeyCredential) {
            setPasskeySignInState((prev) => ({
                ...prev,
                loading: false,
                error: new Error('Web Authentication API is not supported.'),
            }));
            return;
        }

        // Get any existing credentials from local storage.
        const existingCredentials = persistentCredentials.map((credential) => JSON.parse(credential));

        // Create a new credential if there are no existing credentials.
        if(existingCredentials.length === 0) {
            // Create a new credential.
            try {
                const newCredential = await navigator.credentials.create({
                    publicKey: {
                        challenge: new Uint8Array(32),
                        rp: {
                            id: 'phi.health',
                            name: 'PhiHealth',
                        },
                        user: {
                            id: new Uint8Array(32),
                            name: email,
                            displayName: email,
                        },
                        pubKeyCredParams: [
                            { type: 'public-key', alg: -7 },
                            { type: 'public-key', alg: -257 },
                        ],
                        authenticatorSelection: {
                            authenticatorAttachment: 'platform',
                            userVerification: 'required',
                            residentKey: 'required',
                        },
                        timeout: 60000,
                        excludeCredentials: [],
                        extensions: {
                            credProps: true,
                        },
                    },
                });

                // Store the new credential in local storage.
                // const newCredentialString = JSON.stringify(newCredential);
                // setPersistentCredentials((prev) => [...prev, newCredentialString]);

                setPasskeySignInState((prev) => ({
                    ...prev,
                    data: newCredential,
                    loading: false,
                }));
            }
            catch(_err) {
                const error = new Error('Failed to create a new credential.');

                setPasskeySignInState((prev) => ({
                    ...prev,
                    loading: false,
                    error,
                }));
                return;
            }
        }
        else {
            // Use the existing credential to sign in.
            const existingCredential = existingCredentials[0];

            try {
                const assertion = await navigator.credentials.get({
                    publicKey: {
                        challenge: new Uint8Array(32),
                        rpId: 'phihealth.com',
                        allowCredentials: [
                            {
                                id: existingCredential.rawId,
                                type: 'public-key',
                                transports: ['internal'],
                            },
                        ],
                        userVerification: 'required',
                    },
                });

                setPasskeySignInState((prev) => ({
                    ...prev,
                    data: assertion,
                    loading: false,
                }));
            }
            catch(_err) {
                const error = new Error('Failed to sign in with the existing credential.');

                setPasskeySignInState((prev) => ({
                    ...prev,
                    loading: false,
                    error,
                }));
                return;
            }
        }
    }

    return [passkeySignInState, signInWithPasskey] as const;
}
