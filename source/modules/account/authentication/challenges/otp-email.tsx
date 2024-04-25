import React from 'react';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeOtp, { OTP_PATTERNS } from './common/ChallengeOtp';

type Props = {};

const OtpEmail = (props: Props) => {
    return (
        <>
            <ChallengeOtp pattern={OTP_PATTERNS.numbers} />
            <ChallengeSubmitButton />
        </>
    );
};

export default OtpEmail;
