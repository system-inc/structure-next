import React from 'react';
import ChallengeInput from './common/ChallengeInput';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';

type Props = {};

const Captcha = (props: Props) => {
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

export default Captcha;
