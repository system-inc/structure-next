import React from 'react';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeOtp, { OTP_PATTERNS } from './common/ChallengeOtp';

type Props = {};

const OtpEmail = (props: Props) => {
    return (
        <>
            <p>Please enter the code you received from your email:</p>
            <ChallengeOtp pattern={OTP_PATTERNS.numbers} />
            <ChallengeSubmitButton />
        </>
    );
};

export default OtpEmail;
