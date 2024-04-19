import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import OneTimePasswordChallenge from '../authentication/challenges/one-time-password';
import PasswordChallenge from '../authentication/challenges/password';
import { useTransition, animated } from '@react-spring/web';
import {
    VerificationState,
    ChallengeType,
    emailAtom,
    verificationStateAtom,
    signInChallengeTypeAtom,
    signInChallengeTypeLoadableAtom,
} from './AuthenticationForm';
import { RESET, useResetAtom } from 'jotai/utils';
import Button from '@structure/source/common/buttons/Button';

export function ChallengeContainer() {
    const setEmail = useSetAtom(emailAtom);
    const setVerificationState = useSetAtom(verificationStateAtom);
    const verificationState = useAtomValue(verificationStateAtom);
    const challengeType = useAtomValue(signInChallengeTypeLoadableAtom);
    const refreshChallengeType = useSetAtom(signInChallengeTypeAtom);

    const transition = useTransition(verificationState, {
        initial: { opacity: 1, x: '0%' },
        from: { opacity: 0, x: '100%' },
        enter: { opacity: 1, x: '0' },
        leave: { opacity: 0, x: '-100%' },
    });

    function renderChallenge() {
        if(challengeType.state === 'loading') {
            return <p>Loading...</p>;
        }
        else if(challengeType.state === 'hasError') {
            return <p>Error loading challenge</p>;
        }
        else if(challengeType.state === 'hasData') {
            switch(challengeType.data) {
                default:
                    return <div>Unknown challenge type: {challengeType.data}</div>;
                case 'password':
                    return <PasswordChallenge />;
                case 'otp':
                    return <OneTimePasswordChallenge />;
            }
        }
    }

    async function completeChallenge() {
        // Get new challenge
        setVerificationState('verifying-identity');

        // Simulate a server request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const challengeDifficulty = 0.65;
        const challengeRandomness = Math.random() > 1 - challengeDifficulty ? 0 : 1;
        const newState = ['challenging', 'verified-identity'][challengeRandomness] as VerificationState;

        // Set the new state based on the server response
        setVerificationState(newState);

        // Reset the challenge type if we are challenging
        if(newState === 'challenging') {
            refreshChallengeType();
        }

        if(newState === 'verified-identity') {
            // Reset email
            setEmail(RESET);
        }
    }

    function renderVerificationState(state: VerificationState) {
        switch(state) {
            case 'challenging':
                return (
                    <>
                        <div className="rounded bg-muted/50 p-1">{renderChallenge()}</div>
                        <Button
                            variant="contrast"
                            className="mt-2 w-full"
                            onClick={completeChallenge}
                            disabled={challengeType.state === 'loading'}
                        >
                            Complete Challenge
                        </Button>
                    </>
                );
            case 'verifying-identity':
                return <p className="text-blue">Verifying...</p>;
            case 'verified-identity':
                return <p className="text-emerald-500">Verified!</p>;
            case 'error':
                return <p className="text-red-500">There has been an error.</p>;
            case 'unauthenticated':
                return <p className="text-gray-500">You are not authenticated.</p>;
        }
    }

    return (
        <div className="relative w-full">
            {transition((style, state) => {
                return state ? (
                    <animated.div className={'absolute inset-0'} style={style}>
                        {renderVerificationState(state)}
                    </animated.div>
                ) : null;
            })}
        </div>
    );
}

export default ChallengeContainer;
