import React from 'react';
import AuthenticationForm from '../authentication/AuthenticationForm';
import AccountMenuButton from '../AccountMenuButton';

type Props = {};

const NewSignInPage = (props: Props) => {
    return (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
            <div className="absolute right-4 top-4">
                <AccountMenuButton />
            </div>

            <div className="relative w-full max-w-md px-12 py-16">
                <AuthenticationForm />
            </div>
        </div>
    );
};

export default NewSignInPage;
