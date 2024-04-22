'use client'; // This file uses the client-side features

// Dependencies -- React
import React from 'react';

// Dependencies -- State
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET, atomWithRefresh, atomWithReset, loadable as loadableAtom } from 'jotai/utils'; // Supports async client state of atoms
import FormInputText from '@structure/source/common/forms/FormInputText';
import Button from '@structure/source/common/buttons/Button';
import ChallengeContainer from './ChallengeContainer';
import VerificationStateHeader from './VerificationStateHeader';
import { useSpring, animated } from '@react-spring/web';
import { InputTextVariants } from '@structure/source/common/forms/InputText';
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Atomic State
/**
 * The current challenge type.
 * The challenge is dynamically determined based on what the server determines is necessary.
 * This state is used to determine what UI to show.
 */
// A set of random challenges that can be selected -- TODO: Remove this once the server is implemented
const challenges = ['password', 'mfa', 'sms', 'otp', 'webauthn', 'captcha'] as const;
export type ChallengeType = (typeof challenges)[number]; // The type of challenge
export const signInChallengeTypeAtom = atomWithRefresh(
    // Function to get the challenge type
    async function (get) {
        if(get(verificationStateAtom) === 'challenging') {
            // Simulate a server request
            await new Promise((resolve) => setTimeout(resolve, 2000));
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

    const [formSpring, formSpringApi] = useSpring(() => ({
        marginTop: '0%',
        titleOpacity: 1,
    }));

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmail(emailRef.current);
        setVerificationState('challenging');
    }

    formSpringApi.start({
        marginTop: verificationState === 'unauthenticated' ? '0%' : '-100%',
        titleOpacity: verificationState === 'unauthenticated' ? 1 : 0,
    });

    // TODO: Remove this once the server is implemented. This is just for resetting the demo.
    React.useEffect(() => {
        if(verificationState === 'verified-identity') {
            setTimeout(() => {
                setVerificationState('unauthenticated');
            }, 2000);
        }
    }, [verificationState, setVerificationState]);

    return (
        <div className="w-full">
            <animated.div
                style={{
                    marginTop: formSpring.marginTop,
                }}
            >
                <animated.h4
                    style={{ opacity: formSpring.titleOpacity }}
                    className="mb-2 text-center text-3xl font-bold"
                >
                    Sign In
                </animated.h4>
                <animated.p
                    style={{ opacity: formSpring.titleOpacity }}
                    className="mb-6 text-center text-sm font-light text-muted-foreground"
                >
                    Please enter your email address to sign in
                </animated.p>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <input
                        disabled={verificationState === 'challenging' || verificationState === 'verifying-identity'}
                        id="sign-in-email"
                        placeholder="name@example.com"
                        type="email"
                        autoComplete="mobile email"
                        onChange={function (event) {
                            emailRef.current = event.target.value;
                        }}
                        className={mergeClassNames(InputTextVariants.default, 'w-full')}
                    />
                    <Button
                        disabled={verificationState === 'challenging' || verificationState === 'verifying-identity'}
                        variant="light"
                        className="w-full text-center"
                        type="submit"
                        loading={verificationState === 'verifying-identity' || verificationState === 'challenging'}
                    >
                        Sign In
                    </Button>
                </form>
            </animated.div>

            <animated.div className="relative mt-8 w-full overflow-x-clip">
                <VerificationStateHeader />
                <ChallengeContainer />
            </animated.div>
        </div>
    );
}

export default AuthenticationForm;
