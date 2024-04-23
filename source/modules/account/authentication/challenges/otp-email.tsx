import FormInputText from '@structure/source/common/forms/FormInputText';
import React from 'react';
import ChallengeInput from './common/ChallengeInput';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';
import ChallengeOtp from './common/ChallengeOtp';

type Props = {};

const OtpEmail = (props: Props) => {
    return (
        <>
            <ChallengeOtp />
            <ChallengeSubmitButton />
        </>
    );
};

export default OtpEmail;
