import FormInputText from '@structure/source/common/forms/FormInputText';
import React from 'react';

type Props = {};

const PasswordChallenge = (props: Props) => {
    return <FormInputText id="password-challenge" label="Password" type="password" />;
};

export default PasswordChallenge;
