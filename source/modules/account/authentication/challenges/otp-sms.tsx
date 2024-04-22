import FormInputText from '@structure/source/common/forms/FormInputText';
import React from 'react';
import ChallengeInput from './common/ChallengeInput';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';

type Props = {};

const OtpSms = (props: Props) => {
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

export default OtpSms;
