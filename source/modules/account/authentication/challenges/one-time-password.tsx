import FormInputText from '@structure/source/common/forms/FormInputText';
import React from 'react';

type Props = {};

const OneTimePasswordChallenge = (props: Props) => {
    return (
        <FormInputText id="one-time-password" label="One-time password" placeholder="Enter your one-time password" />
    );
};

export default OneTimePasswordChallenge;
