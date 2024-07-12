// 'use client'; // This component uses client-only features

// // Dependencies - Structure
// import { StructureSettings } from '@project/StructureSettings';

// // Dependencies - React and Next.js
// import React from 'react';
// import Image from 'next/image';

// // Dependencies - Main Components
// import { AccountRegistrationCreateForm } from '@structure/source/modules/account/authentication/registration/AccountRegistrationCreateForm';
// import { EmailVerificationChallenge } from '@structure/source/modules/account/authentication/challenges/email-verification/EmailVerificationChallenge';
// import { AccountCredentialVerifyForm } from '@structure/source/modules/account/authentication/challenges/account-credential/AccountCredentialVerifyForm';

// // Dependencies - API
// import { useQuery, useMutation } from '@apollo/client';
// import {
//     AuthenticationCurrentDocument,
//     AccountRegistrationCurrentDocument,
//     AccountRegistrationCompleteDocument,
//     AccountRegistrationStatus,
//     AuthenticationSessionStatus,
//     EmailVerificationSendDocument,
// } from '@project/source/api/GraphQlGeneratedCode';

// // Dependencies - Styles
// import { useTheme } from '@structure/source/theme/ThemeProvider';

// // Dependencies - Utilities
// import { mergeClassNames } from '@structure/source/utilities/Style';

// // Component - Authentication
// export interface AuthenticationInterface {}
// export function Authentication(properties: AuthenticationInterface) {
//     // State
//     const [authenticationSessionStatus, setAuthenticationSessionStatus] = React.useState<
//         AuthenticationSessionStatus | undefined
//     >(undefined);
//     const [emailAddress, setEmailAddress] = React.useState<string | undefined>(undefined);

//     // Hooks
//     const { theme } = useTheme();

//     // Hooks - API - Queries
//     const accountRegistrationCurrentQuery = useQuery(AccountRegistrationCurrentDocument, {
//         skip: false,
//     });
//     console.log('accountRegistrationCurrentQuery', accountRegistrationCurrentQuery);
//     const authenticationCurrentQuery = useQuery(AuthenticationCurrentDocument, {
//         skip:
//             // Skip if the account registration is not set or if the account registration is not authenticating
//             !accountRegistrationCurrentQuery.data ||
//             accountRegistrationCurrentQuery.data?.accountRegistrationCurrent?.status !=
//                 AccountRegistrationStatus.Authenticating,
//     });
//     console.log('authenticationCurrentQuery', authenticationCurrentQuery);

//     // Hooks - API - Mutations
//     const [accountRegistrationCompleteMutation, accountRegistrationCompleteMutationState] = useMutation(
//         AccountRegistrationCompleteDocument,
//     );
//     const [emailVerificationSendMutation, emailVerificationSendMutationState] =
//         useMutation(EmailVerificationSendDocument);

//     // The current authentication component based on the authentication state
//     let currentAuthenticationComponent = null;

//     /*
//     status can be
//   Authenticated - i have proved and can now do the thing, accountRegistrationComplete
//   AuthenticationExpired - start over
//   AuthenticationUsed - already done
//   ChallengeExpired - didn't complete in time, start over
//   ChallengeFailed - check AuthenticationCurrent query
//   Challenged - check challenge type
//     - email verification is one flow, emailVerificationSend mutation, run it, do emailVerificationConfirm
//     - accountCredentials - provide password using accountCredentialVerify
// */

//     // If the current challenge is EmailVerification
//     if(authenticationCurrentQuery.data?.authenticationCurrent?.currentChallenge?.challengeType == 'EmailVerification') {
//         currentAuthenticationComponent = (
//             <EmailVerificationChallenge
//                 emailAddress={emailAddress!}
//                 onSuccess={async function () {
//                     // Must refetch authentication current query first
//                     await authenticationCurrentQuery.refetch();
//                     // Then refetch account registration current query
//                     await accountRegistrationCurrentQuery.refetch();
//                 }}
//             />
//         );
//     }
//     // If there is no account registration, then we need to show the account registration form
//     else if(
//         accountRegistrationCurrentQuery.error ||
//         !accountRegistrationCurrentQuery.data?.accountRegistrationCurrent
//     ) {
//         currentAuthenticationComponent = (
//             <AccountRegistrationCreateForm
//                 onSuccess={function (emailAddress: string) {
//                     setEmailAddress(emailAddress);
//                     accountRegistrationCurrentQuery.refetch();
//                 }}
//             />
//         );
//     }
//     else {
//         if(1) {
//             currentAuthenticationComponent = <AccountCredentialVerifyForm />;
//         }
//     }

//     // Render the component
//     return (
//         <div>
//             {/* Project Logo */}
//             <div className="mb-8">
//                 <Image
//                     src={
//                         theme == 'dark'
//                             ? StructureSettings.assets.favicon.dark.location
//                             : StructureSettings.assets.favicon.light.location
//                     }
//                     alt="Logo"
//                     height={32}
//                     width={32}
//                     priority={true}
//                 />
//             </div>

//             {/* The current authentication based on the authentication state */}
//             {currentAuthenticationComponent}
//         </div>
//     );
// }

// // Export - Default
// export default Authentication;
