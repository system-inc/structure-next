import React from 'react';
import ChallengeInput from './common/ChallengeInput';
import ChallengeSubmitButton from './common/ChallengeSubmitButton';

type Props = {};

const Password = (props: Props) => {
    return (
        <>
            <ChallengeInput
                id="password-challenge"
                type="password"
                label="Password"
                labelTip="This is the password you set on sign-up"
                className="w-full"
            />
            <ChallengeSubmitButton />
        </>
    );
};

export default Password;
