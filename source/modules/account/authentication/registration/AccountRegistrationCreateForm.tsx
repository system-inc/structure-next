// 'use client'; // This component uses client-only features

// // Dependencies - Structure
// import { StructureSettings } from '@project/StructureSettings';

// // Dependencies - React and Next.js
// import React from 'react';
// import Link from 'next/link';

// // Dependencies - Main Components
// import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
// import { FormInputText } from '@structure/source/common/forms/FormInputText';

// // Dependencies - API
// import { useMutation } from '@apollo/client';
// import { AccountRegistrationCreateDocument } from '@project/source/api/GraphQlGeneratedCode';

// // Component - AccountRegistrationCreateForm
// export interface AccountRegistrationCreateFormInterface {
//     onSuccess: (emailAddress: string) => void;
// }
// export function AccountRegistrationCreateForm(properties: AccountRegistrationCreateFormInterface) {
//     // Hooks
//     const [accountRegistrationCreateMutation, accountRegistrationCreateMutationState] = useMutation(
//         AccountRegistrationCreateDocument,
//     );

//     // Render the component
//     return (
//         <div>
//             <h1 className="text-xl">Create a {StructureSettings.title} Account</h1>
//             <p className="mt-2 text-sm text-neutral+3">
//                 Already have an account?{' '}
//                 <Link className="text-[#007AFF]" href="/sign-in">
//                     Sign in.
//                 </Link>
//             </p>

//             <Form
//                 className="mt-8"
//                 formInputs={[
//                     <FormInputText
//                         key="emailAddress"
//                         className=""
//                         id="emailAddress"
//                         label="Email Address"
//                         placeholder="email@domain.com"
//                         type="email"
//                         required={true}
//                     />,
//                 ]}
//                 buttonProperties={{
//                     variant: 'default',
//                     className: 'w-full',
//                     children: 'Create Account',
//                 }}
//                 onSubmit={async function (formValues) {
//                     console.log(formValues);

//                     // Create a variable to store the result
//                     const result: FormSubmitResponseInterface = {
//                         success: false,
//                     };

//                     // Run the mutation
//                     const currentAccountRegistrationCreateMutationState = await accountRegistrationCreateMutation({
//                         variables: {
//                             input: {
//                                 emailAddress: formValues.emailAddress,
//                             },
//                         },
//                     });

//                     // Log the mutation state
//                     console.log(
//                         'currentAccountRegistrationCreateMutationState',
//                         currentAccountRegistrationCreateMutationState,
//                     );

//                     // If there are errors
//                     if(currentAccountRegistrationCreateMutationState.errors) {
//                         result.message = currentAccountRegistrationCreateMutationState.errors[0]?.message;
//                     }
//                     // If there is data
//                     else {
//                         result.success = true;

//                         // Run the success callback
//                         properties.onSuccess(formValues.emailAddress);
//                     }

//                     return result;
//                 }}
//             />

//             <p className="mt-6 text-xs text-neutral+3">
//                 By registering, you agree to our{' '}
//                 <Link className="text-[#007AFF]" href="/legal/terms-of-service" target="_blank">
//                     terms of service
//                 </Link>{' '}
//                 and{' '}
//                 <Link className="text-[#007AFF]" href="/legal/privacy-policy" target="_blank">
//                     privacy policy
//                 </Link>
//                 .
//             </p>
//         </div>
//     );
// }

// // Export - Default
// export default AccountRegistrationCreateForm;
