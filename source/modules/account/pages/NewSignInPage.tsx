import React from 'react';
import AuthenticationForm from '../authentication/AuthenticationForm';

type Props = {};

const NewSignInPage = (props: Props) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="relative w-full max-w-md px-12 py-16">
                <AuthenticationForm />
            </div>
        </div>
    );
};

export default NewSignInPage;
