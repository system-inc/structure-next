'use client'; // This file uses the client-side features

// Dependencies -- React
import React from 'react';

// Dependencies -- State
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET, atomWithRefresh, atomWithReset, loadable as loadableAtom } from 'jotai/utils'; // Supports async client state of atoms
import FormInputText from '@structure/source/common/forms/FormInputText';
import Button from '@structure/source/common/buttons/Button';
import ChallengeContainer from './ChallengeContainer';

// Atomic State
/**
 * The current challenge type.
 * The challenge is dynamically determined based on what the server determines is necessary.
 * This state is used to determine what UI to show.
 */
// A set of random challenges that can be selected -- TODO: Remove this once the server is implemented
const challenges = ['password', 'mfa', 'sms', 'otp', 'u2f', 'webauthn', 'recovery', 'captcha'] as const;
export type ChallengeType = (typeof challenges)[number]; // The type of challenge
export const signInChallengeTypeAtom = atomWithRefresh(
    // Function to get the challenge type
    async function (get) {
        if(get(verificationStateAtom) === 'challenging') {
            // Simulate a server request
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return challenges[Math.floor(Math.random() * challenges.length)]; // Randomly select a challenge
        }
        else {
            return undefined;
        }
    },
);
export const signInChallengeTypeLoadableAtom = loadableAtom(signInChallengeTypeAtom); // Loadable version of the challenge type

export type VerificationState =
    | 'unauthenticated'
    | 'challenging'
    | 'verifying-identity'
    | 'verified-identity'
    | 'error'; // The state of the challenge sequence
export const verificationStateAtom = atom<VerificationState>('unauthenticated');

// This atom stores the email address that the user has entered, and can be reset to its initial state (undefined).
export const emailAtom = atomWithReset<string | undefined>(undefined);

// Component
interface AuthenticationFormInterface {}
function AuthenticationForm(properties: AuthenticationFormInterface) {
    const setEmail = useSetAtom(emailAtom);
    const emailRef = React.useRef<string>();
    const [verificationState, setVerificationState] = useAtom(verificationStateAtom);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmail(emailRef.current);
        setVerificationState('challenging');
    }

    return (
        <div className="w-full">
            <h1 className="mb-2">Sign In</h1>
            <p className="mb-4">Please enter your email address</p>

            <form className="space-y-2" onSubmit={onSubmit}>
                <FormInputText
                    disabled={verificationState === 'challenging' || verificationState === 'verifying-identity'}
                    id="sign-in-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    onChange={function (value) {
                        emailRef.current = value;
                    }}
                />
                <Button
                    disabled={verificationState === 'challenging' || verificationState === 'verifying-identity'}
                    variant="light"
                    className="w-full"
                    type="submit"
                    loading={verificationState === 'verifying-identity' || verificationState === 'challenging'}
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-8">
                <ChallengeContainer />
            </div>
        </div>
    );
}

export default AuthenticationForm;
