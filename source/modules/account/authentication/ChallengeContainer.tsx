import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import OtpEmail from './challenges/otp-email';
import Password from '../authentication/challenges/password';
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

// TODO: Changed these to actual animations or remove them if they are not needed in `@structure`
import Lottie from 'react-lottie';
import SuccessLottie from './success-lottie.json';
import VerificationLottie from './verification-lottie.json';
import LoadingChallengeLottie from './loading-challenge-lottie.json';
import DeviceVerification from './challenges/device-verification';
import MfaDevice from './challenges/mfa-device';
import OtpPhoneCall from './challenges/otp-phone-call';
import WebAuthn from './challenges/webauthn';
import Captcha from './challenges/captcha';
import MfaApp from './challenges/mfa-app';
import OtpSms from './challenges/otp-sms';

function ChallengeContainer() {
    const challengeType = useAtomValue(signInChallengeTypeLoadableAtom);
    const verificationState = useAtomValue(verificationStateAtom);

    function renderChallenge(challengeState: ChallengeType) {
        switch(challengeState) {
            default:
                return <div>Unknown challenge type: {challengeState}</div>;
            case 'password':
                return <Password />;
            case 'otp-email':
                return <OtpEmail />;
            case 'otp-phone-call':
                return <OtpPhoneCall />;
            case 'otp-sms':
                return <OtpSms />;
            case 'mfa-app':
                return <MfaApp />;
            case 'mfa-device':
                return <MfaDevice />;
            case 'captcha':
                return <Captcha />;
            case 'webauthn':
                return <WebAuthn />;
            case 'device-verification':
                return <DeviceVerification />;
        }
    }

    function getChallengeTypeState() {
        if(verificationState === 'unauthenticated') {
            return null;
        }
        else if(verificationState === 'verifying-identity' || verificationState === 'verified-identity') {
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
                <animated.div
                    style={{
                        ...style,
                        // Don't animate the x position on success
                        x: 0,
                    }}
                    className="absolute flex w-full flex-col items-center"
                >
                    <div className="pointer-events-none relative aspect-square w-full">
                        <Lottie
                            options={{
                                animationData: VerificationLottie,
                                loop: true,
                                autoplay: true,
                            }}
                            style={{
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                top: '-10%',
                            }}
                        />
                    </div>
                </animated.div>
            );
        }
        else if(challengeState === 'verified-identity') {
            return (
                <animated.div
                    style={{
                        ...style,
                        // Don't animate the x position on success
                        x: 0,
                    }}
                    className="absolute flex w-full flex-col items-center"
                >
                    <div className="pointer-events-none relative aspect-square w-1/2">
                        <Lottie
                            options={{
                                animationData: SuccessLottie,
                                loop: false,
                                autoplay: true,
                            }}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </div>
                </animated.div>
            );
        }
        else if(challengeState === 'loading') {
            return (
                <animated.div
                    style={{
                        ...style,
                        // Don't animate the x position on success
                        x: 0,
                    }}
                    className="absolute flex w-full flex-col items-center"
                >
                    <div className="pointer-events-none relative h-40 w-full dark:invert">
                        <Lottie
                            options={{
                                animationData: LoadingChallengeLottie,
                                loop: true,
                                autoplay: true,
                            }}
                            style={{
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                top: '-10%',
                            }}
                        />
                    </div>
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
                </animated.div>
            );
        }
    });
}

export default ChallengeContainer;
