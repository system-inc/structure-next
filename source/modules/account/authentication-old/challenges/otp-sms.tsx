import FormInputText from '@structure/source/common/forms/FormInputText';
import React from 'react';
import ChallengeInput from './common/ChallengeInput';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeOtp, { OTP_PATTERNS } from './common/ChallengeOtp';

type Props = {};

const OtpSms = (props: Props) => {
    return (
        <>
            <p>Please enter the code you received via SMS:</p>
            <ChallengeOtp pattern={OTP_PATTERNS.numbers} />
            <ChallengeSubmitButton />
        </>
    );
};

export default OtpSms;
