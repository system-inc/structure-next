import React from 'react';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeInput from './common/ChallengeInput';

type Props = {};

const WebAuthn = (props: Props) => {
    return (
        <>
            <ChallengeInput
                id="one-time-password"
                label="One-time password"
                placeholder="Enter your one-time password"
            />
            <ChallengeSubmitButton />
        </>
    );
};

export default WebAuthn;
