import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import OneTimePasswordChallenge from '../authentication/challenges/one-time-password';
import PasswordChallenge from '../authentication/challenges/password';
import { useTransition, animated, useSpring } from '@react-spring/web';
import {
    VerificationState,
    ChallengeType,
    emailAtom,
    verificationStateAtom,
    signInChallengeTypeAtom,
    signInChallengeTypeLoadableAtom,
} from './AuthenticationForm';
import { RESET } from 'jotai/utils';
import Button from '@structure/source/common/buttons/Button';

function ChallengeContainer() {
    const challengeType = useAtomValue(signInChallengeTypeLoadableAtom);
    const [verificationState, setVerificationState] = useAtom(verificationStateAtom);
    const refreshChallengeType = useSetAtom(signInChallengeTypeAtom);
    const setEmail = useSetAtom(emailAtom);

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

    function renderChallenge(challengeState: ChallengeType) {
        switch(challengeState) {
            default:
                return <div>Unknown challenge type: {challengeState}</div>;
            case 'password':
                return <PasswordChallenge />;
            case 'otp':
                return <OneTimePasswordChallenge />;
        }
    }

    function getChallengeTypeState() {
        if(verificationState === 'unauthenticated') {
            return null;
        }
        else if(verificationState === 'verifying-identity') {
            return verificationState;
        }
        else if(challengeType.state === 'hasData') {
            return challengeType.data;
        }
        else {
            return challengeType.state;
        }
    }
    const challengeTypeState = getChallengeTypeState();
    const transition = useTransition(challengeTypeState, {
        initial: { opacity: 1, x: '0%' },
        from: { opacity: 0, x: '100%' },
        enter: { opacity: 1, x: '0' },
        leave: { opacity: 0, x: '-100%' },
    });

    return transition((style, challengeState) => {
        console.log('challenge state', challengeState);
        if(challengeState === 'verifying-identity') {
            return (
                <animated.div style={style} className="absolute">
                    Sit tight while we check some things...
                </animated.div>
            );
        }
        else if(challengeState === 'loading') {
            return (
                <animated.div style={style} className="absolute">
                    Loading challenge...
                </animated.div>
            );
        }
        else if(challengeState === 'hasError') {
            return (
                <animated.p style={style} className="absolute text-red-500">
                    There&apos;s been an error. Please try again later.
                </animated.p>
            );
        }
        else if(!challengeState) {
            return null;
        }
        else {
            return (
                <animated.div style={style} className={'absolute w-full'}>
                    <div className="rounded bg-muted/50 p-1">{renderChallenge(challengeState)}</div>
                    <Button variant="contrast" className="mt-2 w-full" onClick={completeChallenge}>
                        Complete Challenge
                    </Button>
                </animated.div>
            );
        }
    });
}

export default ChallengeContainer;
