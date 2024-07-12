// 'use client'; // This component uses client-only features

// // Dependencies - React and Next.js
// import React from 'react';
// import Image from 'next/image';

// // Dependencies - Main Components
// import { EmailVerificationVerifyForm } from '@structure/source/modules/account/authentication/challenges/email-verification/EmailVerificationVerifyForm';

// // Dependencies - API
// import { useQuery, useMutation } from '@apollo/client';
// import {
//     EmailVerificationDocument,
//     EmailVerificationSendDocument,
//     EmailVerificationVerifyDocument,
// } from '@project/source/api/GraphQlGeneratedCode';

// // Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// // Component - EmailVerificationChallenge
// export interface EmailVerificationChallengeInterface {
//     emailAddress: string;
//     onSuccess: () => void;
// }
// export function EmailVerificationChallenge(properties: EmailVerificationChallengeInterface) {
//     // State
//     const [emailVerificationSendStatus, setEmailVerificationSendStatus] = React.useState<
//         'notSent' | 'sent' | 'failedToSend'
//     >('notSent');

//     // Hooks - API - Queries
//     const emailVerificationQuery = useQuery(EmailVerificationDocument, {
//         skip: false,
//     });
//     console.log('emailVerificationQuery', emailVerificationQuery);

//     // Hooks - API - Mutations
//     const [emailVerificationSendMutation, emailVerificationSendMutationState] =
//         useMutation(EmailVerificationSendDocument);
//     const [emailVerificationVerifyMutation, emailVerificationVerifyMutationState] = useMutation(
//         EmailVerificationVerifyDocument,
//     );

//     // Effect to send the email
//     React.useEffect(
//         function () {
//             // Function to send the email
//             const sendEmailVerification = async function () {
//                 try {
//                     await emailVerificationSendMutation();
//                     // If the mutation is successful, update the status
//                     setEmailVerificationSendStatus('sent');
//                 }
//                 catch(error) {
//                     // If there's an error, update the status to indicate failure
//                     setEmailVerificationSendStatus('failedToSend');
//                     console.error('Failed to send email verification:', error);
//                 }
//             };

//             // Check if the email has not been sent and then call the function
//             if(emailVerificationSendStatus === 'notSent') {
//                 sendEmailVerification();
//             }
//         },
//         [emailVerificationSendStatus, emailVerificationSendMutation, properties.emailAddress],
//     );

//     // Render the component
//     return (
//         <div>
//             <div>Email Verification Challenge</div>
//             {emailVerificationSendStatus === 'notSent' && <div>Sending email to {properties.emailAddress}...</div>}
//             {emailVerificationSendStatus === 'sent' && (
//                 <EmailVerificationVerifyForm emailAddress={properties.emailAddress} onSuccess={properties.onSuccess} />
//             )}
//             {emailVerificationSendStatus === 'failedToSend' && (
//                 <div>Failed to send email to {properties.emailAddress}.</div>
//             )}
//         </div>
//     );
// }

// // Export - Default
// export default EmailVerificationChallenge;
