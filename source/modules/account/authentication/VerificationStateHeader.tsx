import { useAtomValue } from 'jotai';
import { VerificationState, verificationStateAtom } from './AuthenticationForm';
import { useSpring, useTransition, animated } from '@react-spring/web';

export function VerificationStateHeader() {
    const verificationState = useAtomValue(verificationStateAtom);

    const [containerSpring, containerSpringApi] = useSpring(() => ({
        opacity: 0,
        headerLinesOffset: 1,
        headerY: '100%',
        headerWidth: renderVerificationState(verificationState).length * 8,
    }));

    const titleTransition = useTransition(verificationState, {
        initial: { opacity: 1, y: '0%' },
        from: { opacity: 0, y: '100%' },
        enter: { opacity: 1, y: '0%' },
        leave: { opacity: 0, y: '-100%' },
    });

    function renderVerificationState(state: VerificationState) {
        switch(state) {
            case 'verifying-identity':
                return 'Verifying';
            case 'verified-identity':
                return 'Verified';
            case 'error':
                return 'There has been an error';
            case 'unauthenticated':
                return '';
            case 'challenging':
                return 'Challenging';
            default:
                return 'Unknown state';
        }
    }

    containerSpringApi.start({
        headerWidth: renderVerificationState(verificationState).length * 8,
        headerLinesOffset: verificationState !== 'unauthenticated' ? 0 : 1,
        opacity: verificationState !== 'unauthenticated' ? 1 : 0,
    });

    return (
        <animated.div
            style={{
                opacity: containerSpring.opacity,
            }}
            className="relative w-full"
        >
            <animated.div className="mb-5 flex w-full select-none items-center justify-center text-muted-foreground/50">
                <animated.div
                    style={{
                        clipPath: containerSpring.headerLinesOffset.to((offset) => `inset(0 0 0 ${offset * 100}%)`),
                    }}
                    className="mr-4 h-px flex-grow rounded-full bg-muted-foreground/50"
                ></animated.div>

                <animated.div
                    className="relative flex h-4 items-center justify-center overflow-clip"
                    style={{
                        width: containerSpring.headerWidth,
                    }}
                >
                    {titleTransition((style, state) => (
                        <animated.p style={style} className="absolute whitespace-nowrap text-xs uppercase">
                            {renderVerificationState(state)}
                        </animated.p>
                    ))}
                </animated.div>

                <animated.div
                    style={{
                        clipPath: containerSpring.headerLinesOffset.to((offset) => `inset(0 ${offset * 100}% 0 0)`),
                    }}
                    className="ml-4 h-px flex-grow rounded-full bg-muted-foreground/50"
                ></animated.div>
            </animated.div>
        </animated.div>
    );
}

export default VerificationStateHeader;
