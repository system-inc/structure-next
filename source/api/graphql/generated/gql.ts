/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    'query NoOp { __typename }': typeof types.NoOpDocument;
    '\n            mutation AccountAdministratorSessionCreate {\n                accountAdministratorSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.AccountAdministratorSessionCreateDocument;
    '\n            mutation AccountAuthenticationEmailVerificationSend {\n                accountAuthenticationEmailVerificationSend {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ': typeof types.AccountAuthenticationEmailVerificationSendDocument;
    '\n            mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {\n                accountAuthenticationEmailVerificationVerify(input: $input) {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ': typeof types.AccountAuthenticationEmailVerificationVerifyDocument;
    '\n            mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {\n                accountAuthenticationPasswordVerify(input: $input) {\n                    success\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ': typeof types.AccountAuthenticationPasswordVerifyDocument;
    '\n            mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {\n                accountAuthenticationRegistrationComplete(input: $input) {\n                    success\n                }\n            }\n        ': typeof types.AccountAuthenticationRegistrationCompleteDocument;
    '\n            mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {\n                accountAuthenticationRegistrationOrSignInCreate(input: $input) {\n                    emailAddress\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ': typeof types.AccountAuthenticationRegistrationOrSignInCreateDocument;
    '\n            query AccountAuthentication {\n                accountAuthentication {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.AccountAuthenticationDocument;
    '\n            mutation AccountAuthenticationSignInComplete {\n                accountAuthenticationSignInComplete {\n                    success\n                }\n            }\n        ': typeof types.AccountAuthenticationSignInCompleteDocument;
    '\n            mutation AccountMaintenanceSessionCreate {\n                accountMaintenanceSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.AccountMaintenanceSessionCreateDocument;
    '\n            mutation AccountSignOut {\n                accountSignOut {\n                    success\n                }\n            }\n        ': typeof types.AccountSignOutDocument;
    '\n            query AccountAccessRolesPrivileged {\n                accountAccessRolesPrivileged {\n                    type\n                    description\n                }\n            }\n        ': typeof types.AccountAccessRolesPrivilegedDocument;
    '\n            query AccountPrivileged($input: AccountInput!) {\n                accountPrivileged(input: $input) {\n                    profiles {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ': typeof types.AccountPrivilegedDocument;
    '\n            mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {\n                accountAccessRoleAssignmentCreatePrivileged(input: $input) {\n                    id\n                    accessRole {\n                        id\n                        type\n                        description\n                    }\n                    status\n                    profile {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                        createdAt\n                    }\n                    expiresAt\n                    createdAt\n                    updatedAt\n                }\n            }\n        ': typeof types.AccountAccessRoleAssignmentCreatePrivilegedDocument;
    '\n    mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {\n        contactListCreatePrivileged(data: $data) {\n            id\n            identifier\n            title\n            description\n            updatedAt\n            createdAt\n        }\n    }\n': typeof types.ContactListCreatePrivilegedDocument;
    '\n                    query ContactListsPrivileged($pagination: PaginationInput!) {\n                        contactListsPrivileged(pagination: $pagination) {\n                            pagination {\n                                itemIndex\n                                itemIndexForNextPage\n                                itemIndexForPreviousPage\n                                itemsPerPage\n                                itemsTotal\n                                page\n                                pagesTotal\n                            }\n                            items {\n                                id\n                                identifier\n                                title\n                                description\n                                updatedAt\n                                createdAt\n                            }\n                        }\n                    }\n                ': typeof types.ContactListsPrivilegedDocument;
    '\n            query AccountsPrivileged($pagination: PaginationInput!) {\n                accountsPrivileged(pagination: $pagination) {\n                    items {\n                        emailAddress\n                        profiles {\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            countryCode\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ': typeof types.AccountsPrivilegedDocument;
    '\n            mutation AccountDeletePrivileged($input: AccountDeleteInput!) {\n                accountDeletePrivileged(input: $input) {\n                    success\n                }\n            }\n        ': typeof types.AccountDeletePrivilegedDocument;
    '\n            query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {\n                accountAccessRoleAssignmentsPrivileged(statuses: $statuses, pagination: $pagination) {\n                    items {\n                        id\n                        accessRole {\n                            id\n                            type\n                            description\n                        }\n                        status\n                        emailAddress\n                        profile {\n                            username\n                            displayName\n                            images {\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        expiresAt\n                        createdAt\n                        updatedAt\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ': typeof types.AccountAccessRoleAssignmentsPrivilegedDocument;
    '\n            mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {\n                accountAccessRoleAssignmentRevokePrivileged(input: $input) {\n                    success\n                }\n            }\n        ': typeof types.AccountAccessRoleAssignmentRevokePrivilegedDocument;
    '\n            query AccountEmails {\n                accountEmailAddresses {\n                    emailAddresses {\n                        id\n                        emailAddress\n                        type\n                        isVerified\n                    }\n                }\n            }\n        ': typeof types.AccountEmailsDocument;
    '\n            mutation AccountProfileImageRemove {\n                accountProfileImageRemove {\n                    images {\n                        url\n                        variant\n                    }\n                }\n            }\n        ': typeof types.AccountProfileImageRemoveDocument;
    '\n            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {\n                accountProfileUpdate(input: $input) {\n                    id\n                    username\n                    displayName\n                    givenName\n                    familyName\n                    images {\n                        url\n                        variant\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.AccountProfileUpdateDocument;
    '\n            query AccountProfileUsernameValidate($username: String!) {\n                accountProfileUsernameValidate(username: $username)\n            }\n        ': typeof types.AccountProfileUsernameValidateDocument;
    '\n            mutation AccountPasswordUpdate($input: AccountPasswordUpdateInput!) {\n                accountPasswordUpdate(input: $input) {\n                    success\n                }\n            }\n        ': typeof types.AccountPasswordUpdateDocument;
    '\n            query AccountEnrolledChallenges {\n                account {\n                    enrolledChallenges\n                }\n            }\n        ': typeof types.AccountEnrolledChallengesDocument;
    '\n            mutation AccountDelete($reason: String) {\n                accountDelete(reason: $reason) {\n                    success\n                }\n            }\n        ': typeof types.AccountDeleteDocument;
    '\n            query AccountProfilePublic($username: String!) {\n                accountProfilePublic(username: $username) {\n                    username\n                    displayName\n                    images {\n                        url\n                        variant\n                    }\n                    createdAt\n                }\n            }\n        ': typeof types.AccountProfilePublicDocument;
    '\n                query Account {\n                    account {\n                        emailAddress\n                        profile {\n                            id\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                        accessRoles\n                        entitlements\n                        createdAt\n                    }\n                }\n            ': typeof types.AccountDocument;
    '\n                    mutation AccountSignOut {\n                        accountSignOut {\n                            success\n                        }\n                    }\n                ': typeof types.AccountSignOutDocument;
    '\n            mutation ContactListEntryCreate($data: ContactListEntryInput!) {\n                contactListEntryCreate(data: $data) {\n                    id\n                }\n            }\n        ': typeof types.ContactListEntryCreateDocument;
    '\n            mutation ContactListEntryUnsubscribe($contactListIdentifier: String!, $emailAddress: String!, $reason: String) {\n                contactListEntryUnsubscribe(contactListIdentifier: $contactListIdentifier, emailAddress: $emailAddress, reason: $reason) {\n                    success\n                }\n            }\n        ': typeof types.ContactListEntryUnsubscribeDocument;
    '\n            query DataInteractionDatabaseTableMetrics($input: DataInteractionDatabaseTableMetricsQueryInput!) {\n                dataInteractionDatabaseTableMetrics(input: $input) {\n                    timeInterval\n                    data\n                }\n            }\n        ': typeof types.DataInteractionDatabaseTableMetricsDocument;
    '\n            query DataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {\n                dataInteractionDatabaseTable(databaseName: $databaseName, tableName: $tableName) {\n                    databaseName\n                    tableName\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        type\n                        tableName\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                }\n            }\n        ': typeof types.DataInteractionDatabaseTableDocument;
    '\n            query DataInteractionDatabaseTableRows(\n                $databaseName: String!\n                $tableName: String!\n                $pagination: PaginationInput!\n                $filters: ColumnFilterGroupInput\n            ) {\n                dataInteractionDatabaseTableRows(\n                    databaseName: $databaseName\n                    tableName: $tableName\n                    pagination: $pagination\n                    filters: $filters\n                ) {\n                    items\n                    databaseName\n                    tableName\n                    rowCount\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        tableName\n                        type\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ': typeof types.DataInteractionDatabaseTableRowsDocument;
    '\n            query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {\n                dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {\n                    items {\n                        databaseName\n                        tableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ': typeof types.DataInteractionDatabaseTablesDocument;
    '\n            query DataInteractionDatabases($pagination: PaginationInput!) {\n                dataInteractionDatabases(pagination: $pagination) {\n                    items {\n                        databaseName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ': typeof types.DataInteractionDatabasesDocument;
    '\n                    mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {\n                        engagementEventsCreate(inputs: $inputs) {\n                            success\n                        }\n                    }\n                ': typeof types.EngagementEventsCreateDocument;
    '\n                    query PostByIdentifier($identifier: String!) {\n                        post(identifier: $identifier) {\n                            id\n                        }\n                    }\n                ': typeof types.PostByIdentifierDocument;
    '\n            mutation PostCreatePrivileged($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.PostCreatePrivilegedDocument;
    '\n            mutation PostCreate($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.PostCreateDocument;
    '\n            mutation PostDelete($id: String!) {\n                postDelete(id: $id)\n            }\n        ': typeof types.PostDeleteDocument;
    '\n            query Post($id: String, $slug: String, $identifier: String) {\n                post(id: $id, slug: $slug, identifier: $identifier) {\n                    id\n                    identifier\n                    slug\n                    status\n                    title\n                    createdByProfileId\n                    createdByProfile {\n                        displayName\n                        username\n                        images {\n                            url\n                            type\n                            variant\n                        }\n                    }\n                    topics {\n                        id\n                        title\n                        slug\n                    }\n                    content\n                    reactions {\n                        content\n                        count\n                        reacted\n                    }\n                    upvoteCount\n                    downvoteCount\n                    voteType\n                    reportedCount\n                    reportStatus\n                    metadata\n                    latestRevisionId\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.PostDocument;
    '\n            query PostTopicById($id: String!) {\n                postTopicById(id: $id) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ': typeof types.PostTopicByIdDocument;
    '\n            mutation PostTopicCreate($input: PostTopicCreateInput!) {\n                postTopicCreate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ': typeof types.PostTopicCreateDocument;
    '\n            mutation PostTopicUpdate($input: PostTopicUpdateInput!) {\n                postTopicUpdate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ': typeof types.PostTopicUpdateDocument;
    '\n            mutation PostUnvote($postId: String!) {\n                postUnvote(postId: $postId) {\n                    success\n                }\n            }\n        ': typeof types.PostUnvoteDocument;
    '\n            mutation PostUpdate($id: String!, $input: PostUpdateInput!) {\n                postUpdate(id: $id, input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ': typeof types.PostUpdateDocument;
    '\n            mutation PostVote($postId: String!, $type: PostVoteType!) {\n                postVote(postId: $postId, type: $type) {\n                    success\n                }\n            }\n        ': typeof types.PostVoteDocument;
    '\n            query Posts($pagination: PaginationInput!) {\n                posts(pagination: $pagination) {\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                    items {\n                        id\n                        identifier\n                        slug\n                        status\n                        title\n                        createdByProfileId\n                        createdByProfile {\n                            displayName\n                            username\n                            images {\n                                url\n                                type\n                                variant\n                            }\n                        }\n                        content\n                        reactions {\n                            content\n                            count\n                            reacted\n                        }\n                        upvoteCount\n                        downvoteCount\n                        voteType\n                        reportedCount\n                        reportStatus\n                        metadata\n                        latestRevisionId\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ': typeof types.PostsDocument;
    '\n            mutation PostReactionCreate($postId: String!, $content: String!) {\n                postReactionCreate(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ': typeof types.PostReactionCreateDocument;
    '\n            mutation PostReactionDelete($postId: String!, $content: String!) {\n                postReactionDelete(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ': typeof types.PostReactionDeleteDocument;
    '\n            query PostReactionProfiles($postId: String!, $content: String!, $pagination: PaginationInput!) {\n                postReactionProfiles(postId: $postId, content: $content, pagination: $pagination) {\n                    items {\n                        username\n                        displayName\n                        profileId\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ': typeof types.PostReactionProfilesDocument;
    '\n            mutation PostReportCreate($input: PostReportInput!) {\n                postReportCreate(input: $input) {\n                    id\n                }\n            }\n        ': typeof types.PostReportCreateDocument;
    '\n            mutation PostTopicDelete($id: String!) {\n                postTopicDelete(id: $id) {\n                    success\n                }\n            }\n        ': typeof types.PostTopicDeleteDocument;
    '\n            query SupportTicketsPrivileged($pagination: PaginationInput!) {\n                supportTicketsPrivileged(pagination: $pagination) {\n                    items {\n                        id\n                        identifier\n                        status\n                        type\n                        title\n                        description\n                        userEmailAddress\n                        assignedToProfileId\n                        assignedToProfile {\n                            username\n                            displayName\n                            images {\n                                type\n                                url\n                                variant\n                            }\n                        }\n                        attachments {\n                            type\n                            url\n                            variant\n                        }\n                        comments {\n                            id\n                            source\n                            visibility\n                            content\n                            contentType\n                            attachments {\n                                type\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        createdAt\n                        updatedAt\n                        lastUserCommentedAt\n                        answeredAt\n                        answered\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                        itemsPerPage\n                        itemsTotal\n                        page\n                        pagesTotal\n                    }\n                }\n            }\n        ': typeof types.SupportTicketsPrivilegedDocument;
    '\n        query SupportAllSupportProfiles {\n            supportAllSupportProfiles {\n                username\n                displayName\n                images {\n                    type\n                    url\n                    variant\n                }\n            }\n        }\n    ': typeof types.SupportAllSupportProfilesDocument;
    '\n            mutation SupportTicketCommentCreatePrivileged($input: SupportTicketCommentCreateInput!) {\n                supportTicketCommentCreatePrivileged(input: $input) {\n                    id\n                    content\n                    contentType\n                    source\n                    visibility\n                    createdAt\n                }\n            }\n        ': typeof types.SupportTicketCommentCreatePrivilegedDocument;
    '\n            mutation SupportTicketAssign($ticketId: String!, $username: String) {\n                supportTicketAssign(ticketId: $ticketId, username: $username) {\n                    id\n                    assignedToProfileId\n                    assignedToProfile {\n                        username\n                        displayName\n                        images {\n                            type\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ': typeof types.SupportTicketAssignDocument;
    '\n            mutation SupportTicketUpdateStatusPrivileged($id: String!, $status: SupportTicketStatus!) {\n                supportTicketUpdateStatusPrivileged(id: $id, status: $status) {\n                    id\n                    status\n                }\n            }\n        ': typeof types.SupportTicketUpdateStatusPrivilegedDocument;
    '\n            mutation SystemLogCreate($input: SystemLogClientInput!) {\n                systemLogCreate(input: $input) {\n                    success\n                }\n            }\n        ': typeof types.SystemLogCreateDocument;
};
const documents: Documents = {
    'query NoOp { __typename }': types.NoOpDocument,
    '\n            mutation AccountAdministratorSessionCreate {\n                accountAdministratorSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.AccountAdministratorSessionCreateDocument,
    '\n            mutation AccountAuthenticationEmailVerificationSend {\n                accountAuthenticationEmailVerificationSend {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ':
        types.AccountAuthenticationEmailVerificationSendDocument,
    '\n            mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {\n                accountAuthenticationEmailVerificationVerify(input: $input) {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ':
        types.AccountAuthenticationEmailVerificationVerifyDocument,
    '\n            mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {\n                accountAuthenticationPasswordVerify(input: $input) {\n                    success\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ':
        types.AccountAuthenticationPasswordVerifyDocument,
    '\n            mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {\n                accountAuthenticationRegistrationComplete(input: $input) {\n                    success\n                }\n            }\n        ':
        types.AccountAuthenticationRegistrationCompleteDocument,
    '\n            mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {\n                accountAuthenticationRegistrationOrSignInCreate(input: $input) {\n                    emailAddress\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ':
        types.AccountAuthenticationRegistrationOrSignInCreateDocument,
    '\n            query AccountAuthentication {\n                accountAuthentication {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.AccountAuthenticationDocument,
    '\n            mutation AccountAuthenticationSignInComplete {\n                accountAuthenticationSignInComplete {\n                    success\n                }\n            }\n        ':
        types.AccountAuthenticationSignInCompleteDocument,
    '\n            mutation AccountMaintenanceSessionCreate {\n                accountMaintenanceSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.AccountMaintenanceSessionCreateDocument,
    '\n            mutation AccountSignOut {\n                accountSignOut {\n                    success\n                }\n            }\n        ':
        types.AccountSignOutDocument,
    '\n            query AccountAccessRolesPrivileged {\n                accountAccessRolesPrivileged {\n                    type\n                    description\n                }\n            }\n        ':
        types.AccountAccessRolesPrivilegedDocument,
    '\n            query AccountPrivileged($input: AccountInput!) {\n                accountPrivileged(input: $input) {\n                    profiles {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ':
        types.AccountPrivilegedDocument,
    '\n            mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {\n                accountAccessRoleAssignmentCreatePrivileged(input: $input) {\n                    id\n                    accessRole {\n                        id\n                        type\n                        description\n                    }\n                    status\n                    profile {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                        createdAt\n                    }\n                    expiresAt\n                    createdAt\n                    updatedAt\n                }\n            }\n        ':
        types.AccountAccessRoleAssignmentCreatePrivilegedDocument,
    '\n    mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {\n        contactListCreatePrivileged(data: $data) {\n            id\n            identifier\n            title\n            description\n            updatedAt\n            createdAt\n        }\n    }\n':
        types.ContactListCreatePrivilegedDocument,
    '\n                    query ContactListsPrivileged($pagination: PaginationInput!) {\n                        contactListsPrivileged(pagination: $pagination) {\n                            pagination {\n                                itemIndex\n                                itemIndexForNextPage\n                                itemIndexForPreviousPage\n                                itemsPerPage\n                                itemsTotal\n                                page\n                                pagesTotal\n                            }\n                            items {\n                                id\n                                identifier\n                                title\n                                description\n                                updatedAt\n                                createdAt\n                            }\n                        }\n                    }\n                ':
        types.ContactListsPrivilegedDocument,
    '\n            query AccountsPrivileged($pagination: PaginationInput!) {\n                accountsPrivileged(pagination: $pagination) {\n                    items {\n                        emailAddress\n                        profiles {\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            countryCode\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ':
        types.AccountsPrivilegedDocument,
    '\n            mutation AccountDeletePrivileged($input: AccountDeleteInput!) {\n                accountDeletePrivileged(input: $input) {\n                    success\n                }\n            }\n        ':
        types.AccountDeletePrivilegedDocument,
    '\n            query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {\n                accountAccessRoleAssignmentsPrivileged(statuses: $statuses, pagination: $pagination) {\n                    items {\n                        id\n                        accessRole {\n                            id\n                            type\n                            description\n                        }\n                        status\n                        emailAddress\n                        profile {\n                            username\n                            displayName\n                            images {\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        expiresAt\n                        createdAt\n                        updatedAt\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ':
        types.AccountAccessRoleAssignmentsPrivilegedDocument,
    '\n            mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {\n                accountAccessRoleAssignmentRevokePrivileged(input: $input) {\n                    success\n                }\n            }\n        ':
        types.AccountAccessRoleAssignmentRevokePrivilegedDocument,
    '\n            query AccountEmails {\n                accountEmailAddresses {\n                    emailAddresses {\n                        id\n                        emailAddress\n                        type\n                        isVerified\n                    }\n                }\n            }\n        ':
        types.AccountEmailsDocument,
    '\n            mutation AccountProfileImageRemove {\n                accountProfileImageRemove {\n                    images {\n                        url\n                        variant\n                    }\n                }\n            }\n        ':
        types.AccountProfileImageRemoveDocument,
    '\n            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {\n                accountProfileUpdate(input: $input) {\n                    id\n                    username\n                    displayName\n                    givenName\n                    familyName\n                    images {\n                        url\n                        variant\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.AccountProfileUpdateDocument,
    '\n            query AccountProfileUsernameValidate($username: String!) {\n                accountProfileUsernameValidate(username: $username)\n            }\n        ':
        types.AccountProfileUsernameValidateDocument,
    '\n            mutation AccountPasswordUpdate($input: AccountPasswordUpdateInput!) {\n                accountPasswordUpdate(input: $input) {\n                    success\n                }\n            }\n        ':
        types.AccountPasswordUpdateDocument,
    '\n            query AccountEnrolledChallenges {\n                account {\n                    enrolledChallenges\n                }\n            }\n        ':
        types.AccountEnrolledChallengesDocument,
    '\n            mutation AccountDelete($reason: String) {\n                accountDelete(reason: $reason) {\n                    success\n                }\n            }\n        ':
        types.AccountDeleteDocument,
    '\n            query AccountProfilePublic($username: String!) {\n                accountProfilePublic(username: $username) {\n                    username\n                    displayName\n                    images {\n                        url\n                        variant\n                    }\n                    createdAt\n                }\n            }\n        ':
        types.AccountProfilePublicDocument,
    '\n                query Account {\n                    account {\n                        emailAddress\n                        profile {\n                            id\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                        accessRoles\n                        entitlements\n                        createdAt\n                    }\n                }\n            ':
        types.AccountDocument,
    '\n                    mutation AccountSignOut {\n                        accountSignOut {\n                            success\n                        }\n                    }\n                ':
        types.AccountSignOutDocument,
    '\n            mutation ContactListEntryCreate($data: ContactListEntryInput!) {\n                contactListEntryCreate(data: $data) {\n                    id\n                }\n            }\n        ':
        types.ContactListEntryCreateDocument,
    '\n            mutation ContactListEntryUnsubscribe($contactListIdentifier: String!, $emailAddress: String!, $reason: String) {\n                contactListEntryUnsubscribe(contactListIdentifier: $contactListIdentifier, emailAddress: $emailAddress, reason: $reason) {\n                    success\n                }\n            }\n        ':
        types.ContactListEntryUnsubscribeDocument,
    '\n            query DataInteractionDatabaseTableMetrics($input: DataInteractionDatabaseTableMetricsQueryInput!) {\n                dataInteractionDatabaseTableMetrics(input: $input) {\n                    timeInterval\n                    data\n                }\n            }\n        ':
        types.DataInteractionDatabaseTableMetricsDocument,
    '\n            query DataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {\n                dataInteractionDatabaseTable(databaseName: $databaseName, tableName: $tableName) {\n                    databaseName\n                    tableName\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        type\n                        tableName\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                }\n            }\n        ':
        types.DataInteractionDatabaseTableDocument,
    '\n            query DataInteractionDatabaseTableRows(\n                $databaseName: String!\n                $tableName: String!\n                $pagination: PaginationInput!\n                $filters: ColumnFilterGroupInput\n            ) {\n                dataInteractionDatabaseTableRows(\n                    databaseName: $databaseName\n                    tableName: $tableName\n                    pagination: $pagination\n                    filters: $filters\n                ) {\n                    items\n                    databaseName\n                    tableName\n                    rowCount\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        tableName\n                        type\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ':
        types.DataInteractionDatabaseTableRowsDocument,
    '\n            query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {\n                dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {\n                    items {\n                        databaseName\n                        tableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ':
        types.DataInteractionDatabaseTablesDocument,
    '\n            query DataInteractionDatabases($pagination: PaginationInput!) {\n                dataInteractionDatabases(pagination: $pagination) {\n                    items {\n                        databaseName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ':
        types.DataInteractionDatabasesDocument,
    '\n                    mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {\n                        engagementEventsCreate(inputs: $inputs) {\n                            success\n                        }\n                    }\n                ':
        types.EngagementEventsCreateDocument,
    '\n                    query PostByIdentifier($identifier: String!) {\n                        post(identifier: $identifier) {\n                            id\n                        }\n                    }\n                ':
        types.PostByIdentifierDocument,
    '\n            mutation PostCreatePrivileged($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.PostCreatePrivilegedDocument,
    '\n            mutation PostCreate($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.PostCreateDocument,
    '\n            mutation PostDelete($id: String!) {\n                postDelete(id: $id)\n            }\n        ':
        types.PostDeleteDocument,
    '\n            query Post($id: String, $slug: String, $identifier: String) {\n                post(id: $id, slug: $slug, identifier: $identifier) {\n                    id\n                    identifier\n                    slug\n                    status\n                    title\n                    createdByProfileId\n                    createdByProfile {\n                        displayName\n                        username\n                        images {\n                            url\n                            type\n                            variant\n                        }\n                    }\n                    topics {\n                        id\n                        title\n                        slug\n                    }\n                    content\n                    reactions {\n                        content\n                        count\n                        reacted\n                    }\n                    upvoteCount\n                    downvoteCount\n                    voteType\n                    reportedCount\n                    reportStatus\n                    metadata\n                    latestRevisionId\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.PostDocument,
    '\n            query PostTopicById($id: String!) {\n                postTopicById(id: $id) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ':
        types.PostTopicByIdDocument,
    '\n            mutation PostTopicCreate($input: PostTopicCreateInput!) {\n                postTopicCreate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ':
        types.PostTopicCreateDocument,
    '\n            mutation PostTopicUpdate($input: PostTopicUpdateInput!) {\n                postTopicUpdate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ':
        types.PostTopicUpdateDocument,
    '\n            mutation PostUnvote($postId: String!) {\n                postUnvote(postId: $postId) {\n                    success\n                }\n            }\n        ':
        types.PostUnvoteDocument,
    '\n            mutation PostUpdate($id: String!, $input: PostUpdateInput!) {\n                postUpdate(id: $id, input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ':
        types.PostUpdateDocument,
    '\n            mutation PostVote($postId: String!, $type: PostVoteType!) {\n                postVote(postId: $postId, type: $type) {\n                    success\n                }\n            }\n        ':
        types.PostVoteDocument,
    '\n            query Posts($pagination: PaginationInput!) {\n                posts(pagination: $pagination) {\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                    items {\n                        id\n                        identifier\n                        slug\n                        status\n                        title\n                        createdByProfileId\n                        createdByProfile {\n                            displayName\n                            username\n                            images {\n                                url\n                                type\n                                variant\n                            }\n                        }\n                        content\n                        reactions {\n                            content\n                            count\n                            reacted\n                        }\n                        upvoteCount\n                        downvoteCount\n                        voteType\n                        reportedCount\n                        reportStatus\n                        metadata\n                        latestRevisionId\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ':
        types.PostsDocument,
    '\n            mutation PostReactionCreate($postId: String!, $content: String!) {\n                postReactionCreate(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ':
        types.PostReactionCreateDocument,
    '\n            mutation PostReactionDelete($postId: String!, $content: String!) {\n                postReactionDelete(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ':
        types.PostReactionDeleteDocument,
    '\n            query PostReactionProfiles($postId: String!, $content: String!, $pagination: PaginationInput!) {\n                postReactionProfiles(postId: $postId, content: $content, pagination: $pagination) {\n                    items {\n                        username\n                        displayName\n                        profileId\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ':
        types.PostReactionProfilesDocument,
    '\n            mutation PostReportCreate($input: PostReportInput!) {\n                postReportCreate(input: $input) {\n                    id\n                }\n            }\n        ':
        types.PostReportCreateDocument,
    '\n            mutation PostTopicDelete($id: String!) {\n                postTopicDelete(id: $id) {\n                    success\n                }\n            }\n        ':
        types.PostTopicDeleteDocument,
    '\n            query SupportTicketsPrivileged($pagination: PaginationInput!) {\n                supportTicketsPrivileged(pagination: $pagination) {\n                    items {\n                        id\n                        identifier\n                        status\n                        type\n                        title\n                        description\n                        userEmailAddress\n                        assignedToProfileId\n                        assignedToProfile {\n                            username\n                            displayName\n                            images {\n                                type\n                                url\n                                variant\n                            }\n                        }\n                        attachments {\n                            type\n                            url\n                            variant\n                        }\n                        comments {\n                            id\n                            source\n                            visibility\n                            content\n                            contentType\n                            attachments {\n                                type\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        createdAt\n                        updatedAt\n                        lastUserCommentedAt\n                        answeredAt\n                        answered\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                        itemsPerPage\n                        itemsTotal\n                        page\n                        pagesTotal\n                    }\n                }\n            }\n        ':
        types.SupportTicketsPrivilegedDocument,
    '\n        query SupportAllSupportProfiles {\n            supportAllSupportProfiles {\n                username\n                displayName\n                images {\n                    type\n                    url\n                    variant\n                }\n            }\n        }\n    ':
        types.SupportAllSupportProfilesDocument,
    '\n            mutation SupportTicketCommentCreatePrivileged($input: SupportTicketCommentCreateInput!) {\n                supportTicketCommentCreatePrivileged(input: $input) {\n                    id\n                    content\n                    contentType\n                    source\n                    visibility\n                    createdAt\n                }\n            }\n        ':
        types.SupportTicketCommentCreatePrivilegedDocument,
    '\n            mutation SupportTicketAssign($ticketId: String!, $username: String) {\n                supportTicketAssign(ticketId: $ticketId, username: $username) {\n                    id\n                    assignedToProfileId\n                    assignedToProfile {\n                        username\n                        displayName\n                        images {\n                            type\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ':
        types.SupportTicketAssignDocument,
    '\n            mutation SupportTicketUpdateStatusPrivileged($id: String!, $status: SupportTicketStatus!) {\n                supportTicketUpdateStatusPrivileged(id: $id, status: $status) {\n                    id\n                    status\n                }\n            }\n        ':
        types.SupportTicketUpdateStatusPrivilegedDocument,
    '\n            mutation SystemLogCreate($input: SystemLogClientInput!) {\n                systemLogCreate(input: $input) {\n                    success\n                }\n            }\n        ':
        types.SystemLogCreateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: 'query NoOp { __typename }'): typeof import('./graphql').NoOpDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAdministratorSessionCreate {\n                accountAdministratorSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountAdministratorSessionCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationEmailVerificationSend {\n                accountAuthenticationEmailVerificationSend {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationEmailVerificationSendDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {\n                accountAuthenticationEmailVerificationVerify(input: $input) {\n                    verification {\n                        status\n                        emailAddress\n                        lastEmailSentAt\n                    }\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationEmailVerificationVerifyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {\n                accountAuthenticationPasswordVerify(input: $input) {\n                    success\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationPasswordVerifyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {\n                accountAuthenticationRegistrationComplete(input: $input) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationRegistrationCompleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {\n                accountAuthenticationRegistrationOrSignInCreate(input: $input) {\n                    emailAddress\n                    authentication {\n                        status\n                        scopeType\n                        currentChallenge {\n                            challengeType\n                            status\n                        }\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationRegistrationOrSignInCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountAuthentication {\n                accountAuthentication {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAuthenticationSignInComplete {\n                accountAuthenticationSignInComplete {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountAuthenticationSignInCompleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountMaintenanceSessionCreate {\n                accountMaintenanceSessionCreate {\n                    status\n                    scopeType\n                    currentChallenge {\n                        challengeType\n                        status\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountMaintenanceSessionCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountSignOut {\n                accountSignOut {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountSignOutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountAccessRolesPrivileged {\n                accountAccessRolesPrivileged {\n                    type\n                    description\n                }\n            }\n        ',
): typeof import('./graphql').AccountAccessRolesPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountPrivileged($input: AccountInput!) {\n                accountPrivileged(input: $input) {\n                    profiles {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {\n                accountAccessRoleAssignmentCreatePrivileged(input: $input) {\n                    id\n                    accessRole {\n                        id\n                        type\n                        description\n                    }\n                    status\n                    profile {\n                        username\n                        displayName\n                        images {\n                            url\n                            variant\n                        }\n                        createdAt\n                    }\n                    expiresAt\n                    createdAt\n                    updatedAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountAccessRoleAssignmentCreatePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {\n        contactListCreatePrivileged(data: $data) {\n            id\n            identifier\n            title\n            description\n            updatedAt\n            createdAt\n        }\n    }\n',
): typeof import('./graphql').ContactListCreatePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n                    query ContactListsPrivileged($pagination: PaginationInput!) {\n                        contactListsPrivileged(pagination: $pagination) {\n                            pagination {\n                                itemIndex\n                                itemIndexForNextPage\n                                itemIndexForPreviousPage\n                                itemsPerPage\n                                itemsTotal\n                                page\n                                pagesTotal\n                            }\n                            items {\n                                id\n                                identifier\n                                title\n                                description\n                                updatedAt\n                                createdAt\n                            }\n                        }\n                    }\n                ',
): typeof import('./graphql').ContactListsPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountsPrivileged($pagination: PaginationInput!) {\n                accountsPrivileged(pagination: $pagination) {\n                    items {\n                        emailAddress\n                        profiles {\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            countryCode\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountsPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountDeletePrivileged($input: AccountDeleteInput!) {\n                accountDeletePrivileged(input: $input) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountDeletePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {\n                accountAccessRoleAssignmentsPrivileged(statuses: $statuses, pagination: $pagination) {\n                    items {\n                        id\n                        accessRole {\n                            id\n                            type\n                            description\n                        }\n                        status\n                        emailAddress\n                        profile {\n                            username\n                            displayName\n                            images {\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        expiresAt\n                        createdAt\n                        updatedAt\n                    }\n                    pagination {\n                        itemsTotal\n                        itemsPerPage\n                        page\n                        pagesTotal\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountAccessRoleAssignmentsPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {\n                accountAccessRoleAssignmentRevokePrivileged(input: $input) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountAccessRoleAssignmentRevokePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountEmails {\n                accountEmailAddresses {\n                    emailAddresses {\n                        id\n                        emailAddress\n                        type\n                        isVerified\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountEmailsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountProfileImageRemove {\n                accountProfileImageRemove {\n                    images {\n                        url\n                        variant\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').AccountProfileImageRemoveDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {\n                accountProfileUpdate(input: $input) {\n                    id\n                    username\n                    displayName\n                    givenName\n                    familyName\n                    images {\n                        url\n                        variant\n                    }\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountProfileUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountProfileUsernameValidate($username: String!) {\n                accountProfileUsernameValidate(username: $username)\n            }\n        ',
): typeof import('./graphql').AccountProfileUsernameValidateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountPasswordUpdate($input: AccountPasswordUpdateInput!) {\n                accountPasswordUpdate(input: $input) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountPasswordUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountEnrolledChallenges {\n                account {\n                    enrolledChallenges\n                }\n            }\n        ',
): typeof import('./graphql').AccountEnrolledChallengesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation AccountDelete($reason: String) {\n                accountDelete(reason: $reason) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').AccountDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query AccountProfilePublic($username: String!) {\n                accountProfilePublic(username: $username) {\n                    username\n                    displayName\n                    images {\n                        url\n                        variant\n                    }\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').AccountProfilePublicDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n                query Account {\n                    account {\n                        emailAddress\n                        profile {\n                            id\n                            username\n                            displayName\n                            givenName\n                            familyName\n                            images {\n                                url\n                                variant\n                            }\n                            updatedAt\n                            createdAt\n                        }\n                        accessRoles\n                        entitlements\n                        createdAt\n                    }\n                }\n            ',
): typeof import('./graphql').AccountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n                    mutation AccountSignOut {\n                        accountSignOut {\n                            success\n                        }\n                    }\n                ',
): typeof import('./graphql').AccountSignOutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation ContactListEntryCreate($data: ContactListEntryInput!) {\n                contactListEntryCreate(data: $data) {\n                    id\n                }\n            }\n        ',
): typeof import('./graphql').ContactListEntryCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation ContactListEntryUnsubscribe($contactListIdentifier: String!, $emailAddress: String!, $reason: String) {\n                contactListEntryUnsubscribe(contactListIdentifier: $contactListIdentifier, emailAddress: $emailAddress, reason: $reason) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').ContactListEntryUnsubscribeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query DataInteractionDatabaseTableMetrics($input: DataInteractionDatabaseTableMetricsQueryInput!) {\n                dataInteractionDatabaseTableMetrics(input: $input) {\n                    timeInterval\n                    data\n                }\n            }\n        ',
): typeof import('./graphql').DataInteractionDatabaseTableMetricsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query DataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {\n                dataInteractionDatabaseTable(databaseName: $databaseName, tableName: $tableName) {\n                    databaseName\n                    tableName\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        type\n                        tableName\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').DataInteractionDatabaseTableDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query DataInteractionDatabaseTableRows(\n                $databaseName: String!\n                $tableName: String!\n                $pagination: PaginationInput!\n                $filters: ColumnFilterGroupInput\n            ) {\n                dataInteractionDatabaseTableRows(\n                    databaseName: $databaseName\n                    tableName: $tableName\n                    pagination: $pagination\n                    filters: $filters\n                ) {\n                    items\n                    databaseName\n                    tableName\n                    rowCount\n                    columns {\n                        name\n                        type\n                        isKey\n                        isPrimaryKey\n                        keyTableName\n                        possibleValues\n                        isNullable\n                        isGenerated\n                        length\n                    }\n                    relations {\n                        fieldName\n                        tableName\n                        type\n                        inverseFieldName\n                        inverseType\n                        inverseTableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').DataInteractionDatabaseTableRowsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {\n                dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {\n                    items {\n                        databaseName\n                        tableName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').DataInteractionDatabaseTablesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query DataInteractionDatabases($pagination: PaginationInput!) {\n                dataInteractionDatabases(pagination: $pagination) {\n                    items {\n                        databaseName\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').DataInteractionDatabasesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n                    mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {\n                        engagementEventsCreate(inputs: $inputs) {\n                            success\n                        }\n                    }\n                ',
): typeof import('./graphql').EngagementEventsCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n                    query PostByIdentifier($identifier: String!) {\n                        post(identifier: $identifier) {\n                            id\n                        }\n                    }\n                ',
): typeof import('./graphql').PostByIdentifierDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostCreatePrivileged($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostCreatePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostCreate($input: PostCreateInput!) {\n                postCreatePrivileged(input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostDelete($id: String!) {\n                postDelete(id: $id)\n            }\n        ',
): typeof import('./graphql').PostDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query Post($id: String, $slug: String, $identifier: String) {\n                post(id: $id, slug: $slug, identifier: $identifier) {\n                    id\n                    identifier\n                    slug\n                    status\n                    title\n                    createdByProfileId\n                    createdByProfile {\n                        displayName\n                        username\n                        images {\n                            url\n                            type\n                            variant\n                        }\n                    }\n                    topics {\n                        id\n                        title\n                        slug\n                    }\n                    content\n                    reactions {\n                        content\n                        count\n                        reacted\n                    }\n                    upvoteCount\n                    downvoteCount\n                    voteType\n                    reportedCount\n                    reportStatus\n                    metadata\n                    latestRevisionId\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query PostTopicById($id: String!) {\n                postTopicById(id: $id) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostTopicByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostTopicCreate($input: PostTopicCreateInput!) {\n                postTopicCreate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostTopicCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostTopicUpdate($input: PostTopicUpdateInput!) {\n                postTopicUpdate(input: $input) {\n                    id\n                    title\n                    slug\n                    description\n                    postCount\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostTopicUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostUnvote($postId: String!) {\n                postUnvote(postId: $postId) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').PostUnvoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostUpdate($id: String!, $input: PostUpdateInput!) {\n                postUpdate(id: $id, input: $input) {\n                    id\n                    status\n                    title\n                    contentType\n                    content\n                    settings\n                    upvoteCount\n                    downvoteCount\n                    metadata\n                    updatedAt\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').PostUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostVote($postId: String!, $type: PostVoteType!) {\n                postVote(postId: $postId, type: $type) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').PostVoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query Posts($pagination: PaginationInput!) {\n                posts(pagination: $pagination) {\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                    items {\n                        id\n                        identifier\n                        slug\n                        status\n                        title\n                        createdByProfileId\n                        createdByProfile {\n                            displayName\n                            username\n                            images {\n                                url\n                                type\n                                variant\n                            }\n                        }\n                        content\n                        reactions {\n                            content\n                            count\n                            reacted\n                        }\n                        upvoteCount\n                        downvoteCount\n                        voteType\n                        reportedCount\n                        reportStatus\n                        metadata\n                        latestRevisionId\n                        updatedAt\n                        createdAt\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').PostsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostReactionCreate($postId: String!, $content: String!) {\n                postReactionCreate(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').PostReactionCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostReactionDelete($postId: String!, $content: String!) {\n                postReactionDelete(postId: $postId, content: $content) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').PostReactionDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query PostReactionProfiles($postId: String!, $content: String!, $pagination: PaginationInput!) {\n                postReactionProfiles(postId: $postId, content: $content, pagination: $pagination) {\n                    items {\n                        username\n                        displayName\n                        profileId\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForPreviousPage\n                        itemIndexForNextPage\n                        itemsPerPage\n                        itemsTotal\n                        pagesTotal\n                        page\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').PostReactionProfilesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostReportCreate($input: PostReportInput!) {\n                postReportCreate(input: $input) {\n                    id\n                }\n            }\n        ',
): typeof import('./graphql').PostReportCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation PostTopicDelete($id: String!) {\n                postTopicDelete(id: $id) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').PostTopicDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            query SupportTicketsPrivileged($pagination: PaginationInput!) {\n                supportTicketsPrivileged(pagination: $pagination) {\n                    items {\n                        id\n                        identifier\n                        status\n                        type\n                        title\n                        description\n                        userEmailAddress\n                        assignedToProfileId\n                        assignedToProfile {\n                            username\n                            displayName\n                            images {\n                                type\n                                url\n                                variant\n                            }\n                        }\n                        attachments {\n                            type\n                            url\n                            variant\n                        }\n                        comments {\n                            id\n                            source\n                            visibility\n                            content\n                            contentType\n                            attachments {\n                                type\n                                url\n                                variant\n                            }\n                            createdAt\n                        }\n                        createdAt\n                        updatedAt\n                        lastUserCommentedAt\n                        answeredAt\n                        answered\n                    }\n                    pagination {\n                        itemIndex\n                        itemIndexForNextPage\n                        itemIndexForPreviousPage\n                        itemsPerPage\n                        itemsTotal\n                        page\n                        pagesTotal\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').SupportTicketsPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n        query SupportAllSupportProfiles {\n            supportAllSupportProfiles {\n                username\n                displayName\n                images {\n                    type\n                    url\n                    variant\n                }\n            }\n        }\n    ',
): typeof import('./graphql').SupportAllSupportProfilesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation SupportTicketCommentCreatePrivileged($input: SupportTicketCommentCreateInput!) {\n                supportTicketCommentCreatePrivileged(input: $input) {\n                    id\n                    content\n                    contentType\n                    source\n                    visibility\n                    createdAt\n                }\n            }\n        ',
): typeof import('./graphql').SupportTicketCommentCreatePrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation SupportTicketAssign($ticketId: String!, $username: String) {\n                supportTicketAssign(ticketId: $ticketId, username: $username) {\n                    id\n                    assignedToProfileId\n                    assignedToProfile {\n                        username\n                        displayName\n                        images {\n                            type\n                            url\n                            variant\n                        }\n                    }\n                }\n            }\n        ',
): typeof import('./graphql').SupportTicketAssignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation SupportTicketUpdateStatusPrivileged($id: String!, $status: SupportTicketStatus!) {\n                supportTicketUpdateStatusPrivileged(id: $id, status: $status) {\n                    id\n                    status\n                }\n            }\n        ',
): typeof import('./graphql').SupportTicketUpdateStatusPrivilegedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n            mutation SystemLogCreate($input: SystemLogClientInput!) {\n                systemLogCreate(input: $input) {\n                    success\n                }\n            }\n        ',
): typeof import('./graphql').SystemLogCreateDocument;

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}
