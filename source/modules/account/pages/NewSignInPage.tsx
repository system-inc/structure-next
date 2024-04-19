'use client'; // This file uses the client-side features

// Dependencies -- React
import React from 'react';

// Dependencies -- State
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET, atomWithReset, loadable as loadableAtom } from 'jotai/utils'; // Supports async client state of atoms
import FormInput from '@structure/source/common/forms/FormInput';
import FormInputText from '@structure/source/common/forms/FormInputText';
import Button from '@structure/source/common/buttons/Button';
import OneTimePasswordChallenge from '../challenges/one-time-password';
import PasswordChallenge from '../challenges/password';
import { useTransition, animated } from '@react-spring/web';

// Atomic State
/**
 * The current challenge type.
 * The challenge is dynamically determined based on what the server determines is necessary.
 * This state is used to determine what UI to show.
 */
const challenges = ['password', 'mfa', 'sms', 'otp', 'u2f', 'webauthn', 'recovery', 'captcha'] as const;
type ChallengeType = (typeof challenges)[number]; // The type of challenge
export const signInChallengeTypeAtom = atom(
    // Function to get the challenge type
    async function (get) {
        if(get(emailAtom) === undefined) {
            return undefined;
        }
        else if(get(signInChallengeStateAtom) === 'verifying') {
            return 'loading';
        }
        else if(get(signInChallengeStateAtom) !== 'challenging') {
            return undefined;
        }
        else {
            // Simulate a server request
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return challenges[Math.floor(Math.random() * challenges.length)]; // Randomly select a challenge
        }
    },
);
export const signInChallengeTypeLoadableAtom = loadableAtom(signInChallengeTypeAtom);

type ChallengeState = 'initial' | 'challenging' | 'verifying' | 'verified' | 'error'; // The state of the challenge sequence
export const signInChallengeStateAtom = atom<ChallengeState>('initial');

const emailAtom = atomWithReset<string | undefined>(undefined);

interface NewSignInPageInterface {}
function NewSignInPage(props: NewSignInPageInterface) {
    const [email, setEmail] = useAtom(emailAtom);
    const emailRef = React.useRef<string>();
    const [challengeState, setChallengeState] = useAtom(signInChallengeStateAtom);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmail(emailRef.current);
        setChallengeState('challenging');
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="w-full max-w-md px-12 py-16">
                <h1 className="mb-2">Sign In</h1>
                <p className="mb-4">Please enter your email address</p>

                <form className="space-y-2" onSubmit={onSubmit}>
                    <FormInputText
                        disabled={email !== undefined}
                        id="sign-in-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        onChange={function (value) {
                            emailRef.current = value;
                        }}
                    />
                    <Button
                        disabled={email !== undefined}
                        variant="light"
                        className="w-full"
                        type="submit"
                        loading={challengeState === 'verifying' || challengeState === 'challenging'}
                    >
                        Sign In
                    </Button>
                </form>

                {email !== undefined && (
                    <div className="relative mt-8 h-40 overflow-clip rounded bg-light-5 p-2 animate-in fade-in-100 dark:bg-dark-5">
                        <Challenge />
                    </div>
                )}
                <Verification />
            </div>
        </div>
    );
}

export default NewSignInPage;

// Challenge component
function Challenge() {
    const setEmail = useSetAtom(emailAtom);
    const setChallengeState = useSetAtom(signInChallengeStateAtom);
    const challengeTypeState = useAtomValue(signInChallengeTypeLoadableAtom);
    const transition = useTransition(challengeTypeState.state === 'hasData' ? challengeTypeState.data : 'loading', {
        from: { opacity: 0, x: '100%' },
        enter: { opacity: 1, x: '0' },
        leave: { opacity: 0, x: '-100%' },
    });

    function renderChallenge(challengeType: ChallengeType) {
        switch(challengeType) {
            default:
                return <div>Unknown challenge type: {challengeType}</div>;
            case 'password':
                return <PasswordChallenge />;
            case 'otp':
                return <OneTimePasswordChallenge />;
        }
    }

    async function completeChallenge() {
        // Get new challenge
        setChallengeState('verifying');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const challengeDifficulty = 0.65;
        const challengeRandomness = Math.random() > 1 - challengeDifficulty ? 0 : 1;
        const newState = ['challenging', 'verified'][challengeRandomness] as ChallengeState;
        setChallengeState(newState);

        if(newState === 'verified') {
            // Reset email
            setEmail(RESET);
        }
    }

    if(challengeTypeState.state === 'hasError') {
        return <div>Error: {challengeTypeState.error as string}</div>;
    }
    return (
        <div className="relative w-full">
            {transition((style, item) => {
                return item ? (
                    <animated.div className={'absolute inset-0'} style={style}>
                        {item !== 'loading' ? (
                            <>
                                {renderChallenge(item as ChallengeType)}
                                <Button variant="contrast" className="w-full" onClick={completeChallenge}>
                                    Complete
                                </Button>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </animated.div>
                ) : null;
            })}
        </div>
    );
}

// Verification component
function Verification() {
    const challengeState = useAtomValue(signInChallengeStateAtom);

    return (
        <div className="mt-4">
            {challengeState === 'verifying' && <p>Verifying...</p>}
            {challengeState === 'verified' && <p>Identity verified!</p>}
            {challengeState === 'error' && <p>Error verifying challenge</p>}
        </div>
    );
}
