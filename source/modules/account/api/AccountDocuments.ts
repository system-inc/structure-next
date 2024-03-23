// Dependencies
import { graphql } from '@project/source/graphql/generated';

// Document - Account Current
export const accountCurrentQueryDocument = graphql(`
    query accountCurrent {
        accountCurrent {
            id
            createdAt
            updatedAt
            status
            primaryEmailAddress {
                id
                createdAt
                updatedAt
                emailAddress
                status
                source
                type
                isVerified
                accountId
            }
            currentSession {
                id
                createdAt
                updatedAt
                status
                method
                token
                device
                lastIpAddress
                lastLocation
                expiresAt
                lastUsed
                currentProfileId
            }
            currentProfile {
                id
                createdAt
                updatedAt
                username
                displayName
                givenName
                familyName
                phoneNumber
                imageUrls {
                    url
                    variant
                }
            }
            roles {
                id
                createdAt
                updatedAt
                createdByAccountId
                createdByProfileId
                updatedByAccountId
                updatedByProfileId
                expiresAt
                roleType
                status
            }
        }
    }
`);

// Document - Account Sign In Using Email Address and Password
export const accountSignInUsingEmailAddressAndPasswordMutationDocument = graphql(`
    mutation accountSignIn($emailAddress: String!, $password: String!) {
        accountSignIn(data: { emailAddress: $emailAddress, password: $password }) {
            currentSession {
                id
                createdAt
                updatedAt
                status
                method
                token
                device
                lastIpAddress
                lastLocation
                expiresAt
                lastUsed
                currentProfileId
            }
        }
    }
`);

// Document - Account Sign Out
export const accountSignOutMutationDocument = graphql(`
    mutation accountSignOut {
        accountSignOut
    }
`);
