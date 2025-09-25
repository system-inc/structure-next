/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
    DateTimeISO: { input: any; output: any };
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: { input: any; output: any };
};

export type AccessRole = {
    __typename?: 'AccessRole';
    assignments: AccessRoleAssignment;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    type: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type AccessRoleAssignment = {
    __typename?: 'AccessRoleAssignment';
    accessRole?: Maybe<AccessRole>;
    accessRoleId: Scalars['String']['output'];
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    emailAddress?: Maybe<Scalars['String']['output']>;
    expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
    id: Scalars['String']['output'];
    profile: Profile;
    status: AccessRoleStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type AccessRoleAssignmentCreateInput = {
    accessRole: Scalars['String']['input'];
    emailAddress: Scalars['String']['input'];
    expiresAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
    username: Scalars['String']['input'];
};

export type AccessRoleAssignmentRevokeInput = {
    accessRole: Scalars['String']['input'];
    emailAddress: Scalars['String']['input'];
    username: Scalars['String']['input'];
};

export type AccessRoleCreateInput = {
    description: Scalars['String']['input'];
    type: Scalars['String']['input'];
};

export type AccessRoleInput = {
    id?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<Scalars['String']['input']>;
};

export type AccessRoleListInput = {
    type?: InputMaybe<Scalars['String']['input']>;
};

/** The status of an access role for an account/profile */
export enum AccessRoleStatus {
    Active = 'Active',
    Expired = 'Expired',
    Revoked = 'Revoked',
}

export type AccessRoleUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    type?: InputMaybe<Scalars['String']['input']>;
};

export type Account = {
    __typename?: 'Account';
    accessRoles: Array<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    defaultProfile: Profile;
    defaultProfileId: Scalars['String']['output'];
    emailAddress: Scalars['String']['output'];
    emails: Array<AccountEmail>;
    enrolledChallenges: Array<Scalars['String']['output']>;
    entitlements: Array<Scalars['String']['output']>;
    profile: Profile;
    profiles: Array<Profile>;
    session?: Maybe<AccountSession>;
    status: AccountStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type AccountDeleteInput = {
    emailAddress: Scalars['String']['input'];
    reason?: InputMaybe<Scalars['String']['input']>;
};

export type AccountEmail = {
    __typename?: 'AccountEmail';
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    id: Scalars['String']['output'];
    isVerified: Scalars['Boolean']['output'];
    source: Scalars['String']['output'];
    type: AccountEmailType;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type AccountEmailAddressesResult = {
    __typename?: 'AccountEmailAddressesResult';
    count: Scalars['Float']['output'];
    emailAddresses: Array<AccountEmail>;
};

/** The type of an account email */
export enum AccountEmailType {
    Primary = 'Primary',
    Secondary = 'Secondary',
}

export type AccountEmailVerificationCompleteInput = {
    code: Scalars['String']['input'];
    makePrimary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountEmailVerificationSendInput = {
    emailAddress: Scalars['String']['input'];
};

export type AccountEmailVerificationVerifyInput = {
    code: Scalars['String']['input'];
};

export type AccountEncryptionConfiguration = {
    publicKey: Scalars['String']['input'];
    transitKeyId: Scalars['String']['input'];
};

export type AccountInput = {
    emailAddress: Scalars['String']['input'];
};

export type AccountPasswordUpdateInput = {
    newPassword: Scalars['String']['input'];
};

export type AccountPasswordVerifyInput = {
    password: Scalars['String']['input'];
};

export type AccountProfileUpdateInput = {
    birthday?: InputMaybe<Scalars['DateTimeISO']['input']>;
    displayName?: InputMaybe<Scalars['String']['input']>;
    familyName?: InputMaybe<Scalars['String']['input']>;
    gender?: InputMaybe<Scalars['String']['input']>;
    givenName?: InputMaybe<Scalars['String']['input']>;
    middleName?: InputMaybe<Scalars['String']['input']>;
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    preferredName?: InputMaybe<Scalars['String']['input']>;
    username?: InputMaybe<Scalars['String']['input']>;
};

export type AccountRegistrationCompleteInput = {
    displayName?: InputMaybe<Scalars['String']['input']>;
    encryptionConfiguration?: InputMaybe<AccountEncryptionConfiguration>;
    familyName?: InputMaybe<Scalars['String']['input']>;
    givenName?: InputMaybe<Scalars['String']['input']>;
    password?: InputMaybe<Scalars['String']['input']>;
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    username?: InputMaybe<Scalars['String']['input']>;
};

export type AccountRegistrationOrSignInCreateInput = {
    emailAddress: Scalars['String']['input'];
};

export type AccountSession = {
    __typename?: 'AccountSession';
    accessRoles: Array<AccessRoleAssignment>;
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    lastUsed?: Maybe<Scalars['DateTimeISO']['output']>;
    profile: Profile;
    profileId: Scalars['String']['output'];
    status: AccountSessionStatus;
    statusChangedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type AccountSessionDeleteInput = {
    sessionIds: Array<Scalars['String']['input']>;
};

/** The status of an account session */
export enum AccountSessionStatus {
    Active = 'Active',
    Expired = 'Expired',
    Revoked = 'Revoked',
}

/** The status of an account */
export enum AccountStatus {
    Active = 'Active',
    Archived = 'Archived',
    Locked = 'Locked',
}

export type AuthenticationChallenge = {
    __typename?: 'AuthenticationChallenge';
    challengeType: Scalars['String']['output'];
    status: AuthenticationChallengeStatus;
};

/** The status of an authentication challenge. */
export enum AuthenticationChallengeStatus {
    Failed = 'Failed',
    Open = 'Open',
    Success = 'Success',
}

export type AuthenticationEmailVerification = {
    __typename?: 'AuthenticationEmailVerification';
    authentication: AuthenticationSession;
    verification: EmailVerification;
};

export type AuthenticationOperationResult = {
    __typename?: 'AuthenticationOperationResult';
    authentication: AuthenticationSession;
    success: Scalars['Boolean']['output'];
};

export type AuthenticationRegistrationOrSignIn = {
    __typename?: 'AuthenticationRegistrationOrSignIn';
    authentication: AuthenticationSession;
    emailAddress: Scalars['String']['output'];
};

export type AuthenticationSession = {
    __typename?: 'AuthenticationSession';
    createdAt: Scalars['DateTimeISO']['output'];
    currentChallenge?: Maybe<AuthenticationChallenge>;
    scopeType: Scalars['String']['output'];
    status: AuthenticationSessionStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
};

/** The status of the authentication session. */
export enum AuthenticationSessionStatus {
    Authenticated = 'Authenticated',
    AuthenticationExpired = 'AuthenticationExpired',
    AuthenticationUsed = 'AuthenticationUsed',
    ChallengeExpired = 'ChallengeExpired',
    ChallengeFailed = 'ChallengeFailed',
    Challenged = 'Challenged',
    CanTransition = 'canTransition',
    IsChallengeFailure = 'isChallengeFailure',
    IsOpen = 'isOpen',
    OpenStatuses = 'openStatuses',
}

export type ClientPropertiesInput = {
    environment?: InputMaybe<Scalars['String']['input']>;
};

/** The operator of a field filter */
export enum ColumnFilterConditionOperator {
    Equal = 'Equal',
    GreaterThan = 'GreaterThan',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
    In = 'In',
    IsNotNull = 'IsNotNull',
    IsNull = 'IsNull',
    LessThan = 'LessThan',
    LessThanOrEqual = 'LessThanOrEqual',
    Like = 'Like',
    NotEqual = 'NotEqual',
    NotIn = 'NotIn',
    NotLike = 'NotLike',
}

export type ColumnFilterGroupInput = {
    conditions?: InputMaybe<Array<ColumnFilterInput>>;
    filters?: InputMaybe<Array<ColumnFilterGroupInput>>;
    operator?: InputMaybe<ColumnFilterGroupOperator>;
};

export enum ColumnFilterGroupOperator {
    And = 'And',
    Or = 'Or',
}

export type ColumnFilterInput = {
    caseSensitive?: InputMaybe<Scalars['Boolean']['input']>;
    column: Scalars['String']['input'];
    operator: ColumnFilterConditionOperator;
    value: Scalars['JSON']['input'];
};

export type ContactList = {
    __typename?: 'ContactList';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
    userEnrolled?: Maybe<Scalars['Boolean']['output']>;
};

export type ContactListCreationInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    title: Scalars['String']['input'];
};

export type ContactListEntry = {
    __typename?: 'ContactListEntry';
    accountId?: Maybe<Scalars['String']['output']>;
    contactList?: Maybe<ContactList>;
    contactListId: Scalars['String']['output'];
    countryCode?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    id: Scalars['String']['output'];
    ipAddress?: Maybe<Scalars['String']['output']>;
    lastContactedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    profileId?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    userAgent?: Maybe<Scalars['String']['output']>;
    userUnsubscribed: Scalars['Boolean']['output'];
};

export type ContactListEntryCreatePrivilegedInput = {
    contactListId: Scalars['String']['input'];
    emailAddress: Scalars['String']['input'];
    name?: InputMaybe<Scalars['String']['input']>;
};

export type ContactListEntryInput = {
    contactListIdentifier: Scalars['String']['input'];
    emailAddress: Scalars['String']['input'];
    name?: InputMaybe<Scalars['String']['input']>;
};

export type ContactListResult = {
    __typename?: 'ContactListResult';
    items: Array<ContactList>;
    pagination: Pagination;
};

export type ContactListUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEngagementEventInput = {
    category?: InputMaybe<Scalars['String']['input']>;
    clientProperties?: InputMaybe<ClientPropertiesInput>;
    deviceProperties?: InputMaybe<DevicePropertiesInput>;
    eventContext?: InputMaybe<EngagementEventContextInput>;
    name: Scalars['String']['input'];
};

export type DataInteractionDatabaseMetrics = {
    __typename?: 'DataInteractionDatabaseMetrics';
    data: Array<Scalars['JSON']['output']>;
    timeInterval: TimeInterval;
};

export type DataInteractionDatabaseRelationInput = {
    data?: InputMaybe<Scalars['JSON']['input']>;
    fieldName: Scalars['String']['input'];
    id?: InputMaybe<Scalars['String']['input']>;
    inverseFieldName?: InputMaybe<Scalars['String']['input']>;
    inverseTableName?: InputMaybe<Scalars['String']['input']>;
    inverseType?: InputMaybe<Scalars['String']['input']>;
    tableName: Scalars['String']['input'];
    type: Scalars['String']['input'];
};

export type DataInteractionDatabaseTableMetricsQueryInput = {
    columnName: Scalars['String']['input'];
    databaseName: Scalars['String']['input'];
    endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
    startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
    tableName: Scalars['String']['input'];
    timeIntervals?: InputMaybe<Array<TimeInterval>>;
};

export type DataInteractionDatabaseTableRowCreateInput = {
    data: Scalars['JSON']['input'];
    databaseName: Scalars['String']['input'];
    relationData?: InputMaybe<Array<DataInteractionDatabaseRelationInput>>;
    tableName: Scalars['String']['input'];
};

export type DataInteractionDatabaseTableRowUpdateInput = {
    data?: InputMaybe<Scalars['JSON']['input']>;
    databaseName: Scalars['String']['input'];
    id?: InputMaybe<Scalars['String']['input']>;
    tableName: Scalars['String']['input'];
};

export type DatabaseMetadata = {
    __typename?: 'DatabaseMetadata';
    databaseName: Scalars['String']['output'];
};

export type DatabaseTableColumn = {
    __typename?: 'DatabaseTableColumn';
    isGenerated: Scalars['Boolean']['output'];
    isKey: Scalars['Boolean']['output'];
    isNullable: Scalars['Boolean']['output'];
    isPrimaryKey: Scalars['Boolean']['output'];
    keyTableName?: Maybe<Scalars['String']['output']>;
    length: Scalars['String']['output'];
    name: Scalars['String']['output'];
    possibleValues?: Maybe<Array<Scalars['String']['output']>>;
    type: Scalars['String']['output'];
};

export type DatabaseTableMetadata = {
    __typename?: 'DatabaseTableMetadata';
    columns?: Maybe<Array<DatabaseTableColumn>>;
    databaseName: Scalars['String']['output'];
    pagination: Pagination;
    relations?: Maybe<Array<DatabaseTableRelation>>;
    rowCount: Scalars['Int']['output'];
    tableName: Scalars['String']['output'];
};

export type DatabaseTableMetadataWithRows = {
    __typename?: 'DatabaseTableMetadataWithRows';
    columns?: Maybe<Array<DatabaseTableColumn>>;
    databaseName: Scalars['String']['output'];
    items: Array<Scalars['JSON']['output']>;
    pagination: Pagination;
    relations?: Maybe<Array<DatabaseTableRelation>>;
    rowCount: Scalars['Int']['output'];
    tableName: Scalars['String']['output'];
};

export type DatabaseTableRelation = {
    __typename?: 'DatabaseTableRelation';
    fieldName: Scalars['String']['output'];
    inverseFieldName?: Maybe<Scalars['String']['output']>;
    inverseTableName?: Maybe<Scalars['String']['output']>;
    inverseType?: Maybe<Scalars['String']['output']>;
    joinColumns?: Maybe<Array<Scalars['String']['output']>>;
    tableName: Scalars['String']['output'];
    type: Scalars['String']['output'];
};

export type DatabaseTableRowData = {
    __typename?: 'DatabaseTableRowData';
    columns?: Maybe<Array<DatabaseTableColumn>>;
    databaseName: Scalars['String']['output'];
    item?: Maybe<Scalars['JSON']['output']>;
    relations?: Maybe<Array<DatabaseTableRelation>>;
    tableName: Scalars['String']['output'];
};

export type DatabaseTablesResult = {
    __typename?: 'DatabaseTablesResult';
    items: Array<DatabaseTableMetadata>;
    pagination: Pagination;
};

export enum DeviceOrientation {
    Landscape = 'Landscape',
    NotAvailable = 'NotAvailable',
    Portrait = 'Portrait',
}

export type DevicePropertiesInput = {
    orientation?: InputMaybe<DeviceOrientation>;
};

export type EmailVerification = {
    __typename?: 'EmailVerification';
    emailAddress: Scalars['String']['output'];
    lastEmailSentAt?: Maybe<Scalars['DateTimeISO']['output']>;
    status: EmailVerificationStatus;
};

/** The verification status of an email address. */
export enum EmailVerificationStatus {
    Failed = 'Failed',
    Pending = 'Pending',
    Verified = 'Verified',
}

export type EngagementEvent = {
    __typename?: 'EngagementEvent';
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    loggedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    name: Scalars['String']['output'];
};

export type EngagementEventContextInput = {
    additionalData?: InputMaybe<Scalars['JSON']['input']>;
    loggedAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
    referrer?: InputMaybe<Scalars['String']['input']>;
    sessionDurationInMilliseconds?: InputMaybe<Scalars['Int']['input']>;
    traceId?: InputMaybe<Scalars['String']['input']>;
    traceSequenceNumber?: InputMaybe<Scalars['Int']['input']>;
    viewIdentifier?: InputMaybe<Scalars['String']['input']>;
    viewTitle?: InputMaybe<Scalars['String']['input']>;
};

export type EngagementLocationOverview = {
    __typename?: 'EngagementLocationOverview';
    countryCode?: Maybe<Scalars['String']['output']>;
    latitude?: Maybe<Scalars['String']['output']>;
    longitude?: Maybe<Scalars['String']['output']>;
    uniqueDeviceCount: Scalars['Int']['output'];
};

export type EngagementOverview = {
    __typename?: 'EngagementOverview';
    deviceCategoryPercentages?: Maybe<Scalars['JSON']['output']>;
    locations: Array<EngagementLocationOverview>;
    referrers?: Maybe<Array<EngagementReferrerOverview>>;
    uniqueDeviceIds: Scalars['Int']['output'];
    views?: Maybe<Array<EngagementViewOverview>>;
};

export type EngagementOverviewInput = {
    endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
    startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type EngagementReferrerOverview = {
    __typename?: 'EngagementReferrerOverview';
    referrer?: Maybe<Scalars['String']['output']>;
    uniqueDeviceCount: Scalars['Int']['output'];
};

export type EngagementViewOverview = {
    __typename?: 'EngagementViewOverview';
    uniqueDeviceCount: Scalars['Int']['output'];
    viewIdentifier?: Maybe<Scalars['String']['output']>;
};

export type Entitlement = {
    __typename?: 'Entitlement';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description: Scalars['String']['output'];
    featureKey: Scalars['String']['output'];
    id: Scalars['String']['output'];
    profiles: Array<ProfileEntitlement>;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EntitlementCreateInput = {
    description: Scalars['String']['input'];
    featureKey: Scalars['String']['input'];
};

export type EntitlementInput = {
    featureKey?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
};

export type EntitlementListInput = {
    featureKey?: InputMaybe<Scalars['String']['input']>;
};

export type EntitlementUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    featureKey?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
};

export type ImageObject = {
    __typename?: 'ImageObject';
    type: MediaObjectType;
    url: Scalars['String']['output'];
    variant?: Maybe<Scalars['String']['output']>;
};

export type MediaObject = {
    __typename?: 'MediaObject';
    type: MediaObjectType;
    url: Scalars['String']['output'];
    variant?: Maybe<Scalars['String']['output']>;
};

export enum MediaObjectType {
    File = 'File',
    Image = 'Image',
    Video = 'Video',
}

export type Mutation = {
    __typename?: 'Mutation';
    /** Grant an access role to an account. */
    accountAccessRoleAssignmentCreatePrivileged: AccessRoleAssignment;
    /** Revoke an access role from an account. */
    accountAccessRoleAssignmentRevokePrivileged: OperationResult;
    /** Create a new access role. */
    accountAccessRoleCreatePrivileged: AccessRole;
    /** Delete an access role. */
    accountAccessRoleDeletePrivileged: OperationResult;
    /** Update an access role. */
    accountAccessRoleUpdatePrivileged: AccessRole;
    accountAdministratorSessionCreate: AuthenticationSession;
    accountAuthenticationEmailVerificationSend: AuthenticationEmailVerification;
    accountAuthenticationEmailVerificationVerify: AuthenticationEmailVerification;
    accountAuthenticationPasswordVerify: AuthenticationOperationResult;
    accountAuthenticationRegistrationComplete: AuthenticationOperationResult;
    accountAuthenticationRegistrationOrSignInCreate: AuthenticationRegistrationOrSignIn;
    accountAuthenticationSignInComplete: AuthenticationOperationResult;
    accountDelete: OperationResult;
    accountDeletePrivileged: OperationResult;
    accountEmailDelete: OperationResult;
    accountEmailMakePrimary: AccountEmail;
    accountEmailVerificationComplete: AccountEmail;
    accountEmailVerificationSend: EmailVerification;
    /** Create a new entitlement. */
    accountEntitlementCreatePrivileged: Entitlement;
    /** Delete an entitlement. */
    accountEntitlementDeletePrivileged: OperationResult;
    /** Update an entitlement. */
    accountEntitlementUpdatePrivileged: Entitlement;
    accountMaintenanceSessionCreate: AuthenticationSession;
    accountPasswordUpdate: OperationResult;
    /** Manually grant an entitlement to a profile. */
    accountProfileEntitlementCreatePrivileged: ProfileEntitlement;
    /** Revoke a profile entitlement. */
    accountProfileEntitlementRevokePrivileged: OperationResult;
    accountProfileImageRemove: Profile;
    accountProfileUpdate: Profile;
    accountSessionDelete: OperationResult;
    accountSignOut: OperationResult;
    contactListCreatePrivileged: ContactList;
    contactListDeletePrivileged: OperationResult;
    contactListEntryCreate: ContactListEntry;
    contactListEntryCreatePrivileged: ContactListEntry;
    contactListEntryUnsubscribe: OperationResult;
    contactListUpdatePrivileged: ContactList;
    dataInteractionDatabaseTableRowCreate: Scalars['JSON']['output'];
    dataInteractionDatabaseTableRowDelete: OperationResult;
    dataInteractionDatabaseTableRowUpdate: Scalars['JSON']['output'];
    dataInteractionDatabaseTableRowsDelete: Scalars['Int']['output'];
    engagementEventCreate: OperationResult;
    engagementEventsCreate: OperationResult;
    postCommentCreate: PostComment;
    postCommentDelete: OperationResult;
    postCreatePrivileged: Post;
    postDelete: Scalars['String']['output'];
    postDeletePrivileged: Scalars['String']['output'];
    postDraft: Post;
    postPublish: Post;
    postPublishPrivileged: Post;
    postReactionCreate: OperationResult;
    postReactionDelete: OperationResult;
    postReportCreate: PostReport;
    postReportModerate: Post;
    postTopicAssignPost: OperationResult;
    postTopicCreate: PostTopic;
    postTopicDelete: OperationResult;
    postTopicUpdate: PostTopic;
    postTopicUpdatePosition: PostTopic;
    postUnvote: OperationResult;
    postUpdate: Post;
    postUpdatePrivileged: Post;
    postVote: OperationResult;
    supportTicketAssign: SupportTicket;
    supportTicketCommentCreate: SupportTicketComment;
    supportTicketCommentCreatePrivileged: SupportTicketComment;
    supportTicketCreate: SupportTicket;
    supportTicketCreatePrivileged: SupportTicket;
    supportTicketUpdatePrivileged: SupportTicket;
    supportTicketUpdateStatusPrivileged: SupportTicket;
};

export type MutationAccountAccessRoleAssignmentCreatePrivilegedArgs = {
    input: AccessRoleAssignmentCreateInput;
};

export type MutationAccountAccessRoleAssignmentRevokePrivilegedArgs = {
    input: AccessRoleAssignmentRevokeInput;
};

export type MutationAccountAccessRoleCreatePrivilegedArgs = {
    input: AccessRoleCreateInput;
};

export type MutationAccountAccessRoleDeletePrivilegedArgs = {
    input: AccessRoleInput;
};

export type MutationAccountAccessRoleUpdatePrivilegedArgs = {
    input: AccessRoleUpdateInput;
};

export type MutationAccountAuthenticationEmailVerificationVerifyArgs = {
    input: AccountEmailVerificationVerifyInput;
};

export type MutationAccountAuthenticationPasswordVerifyArgs = {
    input: AccountPasswordVerifyInput;
};

export type MutationAccountAuthenticationRegistrationCompleteArgs = {
    input: AccountRegistrationCompleteInput;
};

export type MutationAccountAuthenticationRegistrationOrSignInCreateArgs = {
    input: AccountRegistrationOrSignInCreateInput;
};

export type MutationAccountDeleteArgs = {
    reason?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAccountDeletePrivilegedArgs = {
    input: AccountDeleteInput;
};

export type MutationAccountEmailDeleteArgs = {
    accountEmailId: Scalars['String']['input'];
};

export type MutationAccountEmailMakePrimaryArgs = {
    accountEmailId: Scalars['String']['input'];
};

export type MutationAccountEmailVerificationCompleteArgs = {
    input: AccountEmailVerificationCompleteInput;
};

export type MutationAccountEmailVerificationSendArgs = {
    input: AccountEmailVerificationSendInput;
};

export type MutationAccountEntitlementCreatePrivilegedArgs = {
    input: EntitlementCreateInput;
};

export type MutationAccountEntitlementDeletePrivilegedArgs = {
    input: EntitlementInput;
};

export type MutationAccountEntitlementUpdatePrivilegedArgs = {
    input: EntitlementUpdateInput;
};

export type MutationAccountPasswordUpdateArgs = {
    input: AccountPasswordUpdateInput;
};

export type MutationAccountProfileEntitlementCreatePrivilegedArgs = {
    input: ProfileEntitlementCreateInput;
};

export type MutationAccountProfileEntitlementRevokePrivilegedArgs = {
    input: ProfileEntitlementInput;
};

export type MutationAccountProfileUpdateArgs = {
    input: AccountProfileUpdateInput;
};

export type MutationAccountSessionDeleteArgs = {
    input: AccountSessionDeleteInput;
};

export type MutationContactListCreatePrivilegedArgs = {
    data: ContactListCreationInput;
};

export type MutationContactListDeletePrivilegedArgs = {
    forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
    id: Scalars['String']['input'];
};

export type MutationContactListEntryCreateArgs = {
    data: ContactListEntryInput;
};

export type MutationContactListEntryCreatePrivilegedArgs = {
    data: ContactListEntryCreatePrivilegedInput;
};

export type MutationContactListEntryUnsubscribeArgs = {
    contactListIdentifier: Scalars['String']['input'];
    emailAddress: Scalars['String']['input'];
    reason?: InputMaybe<Scalars['String']['input']>;
};

export type MutationContactListUpdatePrivilegedArgs = {
    input: ContactListUpdateInput;
};

export type MutationDataInteractionDatabaseTableRowCreateArgs = {
    input: DataInteractionDatabaseTableRowCreateInput;
};

export type MutationDataInteractionDatabaseTableRowDeleteArgs = {
    databaseName: Scalars['String']['input'];
    id: Scalars['String']['input'];
    ignoreOrphantCheck?: InputMaybe<Scalars['Boolean']['input']>;
    tableName: Scalars['String']['input'];
};

export type MutationDataInteractionDatabaseTableRowUpdateArgs = {
    input: DataInteractionDatabaseTableRowUpdateInput;
};

export type MutationDataInteractionDatabaseTableRowsDeleteArgs = {
    databaseName: Scalars['String']['input'];
    ids: Array<Scalars['String']['input']>;
    ignoreOrphantCheck?: InputMaybe<Scalars['Boolean']['input']>;
    tableName: Scalars['String']['input'];
};

export type MutationEngagementEventCreateArgs = {
    input: CreateEngagementEventInput;
};

export type MutationEngagementEventsCreateArgs = {
    inputs: Array<CreateEngagementEventInput>;
};

export type MutationPostCommentCreateArgs = {
    input: PostCommentCreateInput;
};

export type MutationPostCommentDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationPostCreatePrivilegedArgs = {
    input: PostCreateInput;
};

export type MutationPostDeleteArgs = {
    id: Scalars['String']['input'];
    note?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostDeletePrivilegedArgs = {
    id: Scalars['String']['input'];
    note?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostDraftArgs = {
    id: Scalars['String']['input'];
};

export type MutationPostPublishArgs = {
    id: Scalars['String']['input'];
};

export type MutationPostPublishPrivilegedArgs = {
    id: Scalars['String']['input'];
};

export type MutationPostReactionCreateArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    content: Scalars['String']['input'];
    postId?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostReactionDeleteArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    content: Scalars['String']['input'];
    postId?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostReportCreateArgs = {
    input: PostReportInput;
};

export type MutationPostReportModerateArgs = {
    approval: Scalars['Boolean']['input'];
    id: Scalars['String']['input'];
    note?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostTopicAssignPostArgs = {
    assign: Scalars['Boolean']['input'];
    postId: Scalars['String']['input'];
    topicId: Scalars['String']['input'];
};

export type MutationPostTopicCreateArgs = {
    input: PostTopicCreateInput;
};

export type MutationPostTopicDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationPostTopicUpdateArgs = {
    input: PostTopicUpdateInput;
};

export type MutationPostTopicUpdatePositionArgs = {
    id: Scalars['String']['input'];
    input: PostTopicUpdatePositionInput;
};

export type MutationPostUnvoteArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    postId?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<PostVoteType>;
};

export type MutationPostUpdateArgs = {
    id: Scalars['String']['input'];
    input: PostUpdateInput;
};

export type MutationPostUpdatePrivilegedArgs = {
    id: Scalars['String']['input'];
    input: PostUpdateInput;
};

export type MutationPostVoteArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    postId?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<PostVoteType>;
};

export type MutationSupportTicketAssignArgs = {
    ticketId: Scalars['String']['input'];
    username?: InputMaybe<Scalars['String']['input']>;
};

export type MutationSupportTicketCommentCreateArgs = {
    input: SupportTicketCommentCreateInput;
};

export type MutationSupportTicketCommentCreatePrivilegedArgs = {
    input: SupportTicketCommentCreateInput;
};

export type MutationSupportTicketCreateArgs = {
    input: SupportTicketCreateInput;
};

export type MutationSupportTicketCreatePrivilegedArgs = {
    input: SupportTicketCreateInput;
};

export type MutationSupportTicketUpdatePrivilegedArgs = {
    input: SupportTicketUpdateInput;
};

export type MutationSupportTicketUpdateStatusPrivilegedArgs = {
    id: Scalars['String']['input'];
    status: SupportTicketStatus;
};

export type OperationResult = {
    __typename?: 'OperationResult';
    success: Scalars['Boolean']['output'];
};

/** The order direction of a query */
export enum OrderByDirection {
    Ascending = 'Ascending',
    Descending = 'Descending',
}

export type OrderByInput = {
    direction?: InputMaybe<OrderByDirection>;
    key: Scalars['String']['input'];
};

export type PagedAccessRoleAssignments = {
    __typename?: 'PagedAccessRoleAssignments';
    items: Array<AccessRoleAssignment>;
    pagination: Pagination;
};

export type PagedAccounts = {
    __typename?: 'PagedAccounts';
    items: Array<Account>;
    pagination: Pagination;
};

export type PagedDatabasesResult = {
    __typename?: 'PagedDatabasesResult';
    items: Array<DatabaseMetadata>;
    pagination: Pagination;
};

export type PagedPostComments = {
    __typename?: 'PagedPostComments';
    items: Array<PostComment>;
    pagination: Pagination;
};

export type PagedPostReactionProfile = {
    __typename?: 'PagedPostReactionProfile';
    items: Array<PostReactionProfile>;
    pagination: Pagination;
};

export type PagedPostReports = {
    __typename?: 'PagedPostReports';
    items: Array<PostReport>;
    pagination: Pagination;
};

export type PagedPostRevisions = {
    __typename?: 'PagedPostRevisions';
    items: Array<PostRevision>;
    pagination: Pagination;
};

export type PagedPosts = {
    __typename?: 'PagedPosts';
    items: Array<Post>;
    pagination: Pagination;
};

export type Pagination = {
    __typename?: 'Pagination';
    itemIndex: Scalars['Int']['output'];
    itemIndexForNextPage?: Maybe<Scalars['Int']['output']>;
    itemIndexForPreviousPage?: Maybe<Scalars['Int']['output']>;
    itemsPerPage: Scalars['Int']['output'];
    itemsTotal: Scalars['Int']['output'];
    page: Scalars['Int']['output'];
    pagesTotal: Scalars['Int']['output'];
};

export type PaginationInput = {
    filters?: InputMaybe<Array<ColumnFilterInput>>;
    itemIndex?: InputMaybe<Scalars['Int']['input']>;
    itemsPerPage: Scalars['Int']['input'];
    orderBy?: InputMaybe<Array<OrderByInput>>;
};

export type PaginationSupportTicketResult = {
    __typename?: 'PaginationSupportTicketResult';
    items: Array<SupportTicket>;
    pagination: Pagination;
};

export type Post = {
    __typename?: 'Post';
    commentsPaged?: Maybe<PagedPostComments>;
    content?: Maybe<Scalars['String']['output']>;
    contentType: RichContentFormat;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfile?: Maybe<PublicProfile>;
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    downvoteCount: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    latestRevisionId?: Maybe<Scalars['String']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    note?: Maybe<Scalars['String']['output']>;
    publishedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    reactions?: Maybe<Array<PostReaction>>;
    reportStatus?: Maybe<PostReportStatus>;
    reportedCount: Scalars['Int']['output'];
    revisionsPaged?: Maybe<PagedPostRevisions>;
    settings?: Maybe<Scalars['JSON']['output']>;
    slug: Scalars['String']['output'];
    status: PostStatus;
    title: Scalars['String']['output'];
    topics?: Maybe<Array<PostTopic>>;
    type: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
    upvoteCount: Scalars['Int']['output'];
    voteType?: Maybe<PostVoteType>;
};

export type PostRevisionsPagedArgs = {
    pagination: PaginationInput;
};

export type PostComment = {
    __typename?: 'PostComment';
    content: Scalars['String']['output'];
    contentType: RichContentFormat;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfile?: Maybe<PublicProfile>;
    createdByProfileId: Scalars['String']['output'];
    deleted: Scalars['Boolean']['output'];
    downvoteCount: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    postId: Scalars['String']['output'];
    reactions?: Maybe<Array<PostReaction>>;
    replyToCommentId?: Maybe<Scalars['String']['output']>;
    reportStatus?: Maybe<PostReportStatus>;
    reportedCount: Scalars['Int']['output'];
    threadId?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
    upvoteCount: Scalars['Int']['output'];
    voteType?: Maybe<PostVoteType>;
};

export type PostCommentCreateInput = {
    content: Scalars['String']['input'];
    contentType?: InputMaybe<RichContentFormat>;
    postId: Scalars['String']['input'];
    replyToCommentId?: InputMaybe<Scalars['String']['input']>;
};

export type PostCreateInput = {
    allowComment?: InputMaybe<Scalars['Boolean']['input']>;
    allowDownvote?: InputMaybe<Scalars['Boolean']['input']>;
    allowReaction?: InputMaybe<Scalars['Boolean']['input']>;
    allowVote?: InputMaybe<Scalars['Boolean']['input']>;
    content?: InputMaybe<Scalars['String']['input']>;
    contentType?: InputMaybe<RichContentFormat>;
    description?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    slug: Scalars['String']['input'];
    status?: InputMaybe<PostStatus>;
    title: Scalars['String']['input'];
    topicIds?: InputMaybe<Array<Scalars['String']['input']>>;
    type: Scalars['String']['input'];
};

export type PostReaction = {
    __typename?: 'PostReaction';
    content: Scalars['String']['output'];
    count: Scalars['Int']['output'];
    reacted: Scalars['Boolean']['output'];
};

export type PostReactionProfile = {
    __typename?: 'PostReactionProfile';
    displayName?: Maybe<Scalars['String']['output']>;
    profileId: Scalars['String']['output'];
    username: Scalars['String']['output'];
};

export type PostReport = {
    __typename?: 'PostReport';
    commentId?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    note?: Maybe<Scalars['String']['output']>;
    postId?: Maybe<Scalars['String']['output']>;
    reason: Scalars['String']['output'];
};

export type PostReportInput = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    note?: InputMaybe<Scalars['String']['input']>;
    postId?: InputMaybe<Scalars['String']['input']>;
    reason: Scalars['String']['input'];
};

export enum PostReportStatus {
    Approved = 'Approved',
    HoldForReview = 'HoldForReview',
    Rejected = 'Rejected',
}

export type PostRevision = {
    __typename?: 'PostRevision';
    content?: Maybe<Scalars['String']['output']>;
    contentType?: Maybe<RichContentFormat>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    note?: Maybe<Scalars['String']['output']>;
    postId: Scalars['String']['output'];
    settings?: Maybe<Scalars['JSON']['output']>;
    slug?: Maybe<Scalars['String']['output']>;
    status?: Maybe<PostStatus>;
    title?: Maybe<Scalars['String']['output']>;
    topicId?: Maybe<Scalars['String']['output']>;
    type?: Maybe<Scalars['String']['output']>;
};

export enum PostStatus {
    Deleted = 'Deleted',
    Draft = 'Draft',
    Published = 'Published',
}

export type PostTopic = {
    __typename?: 'PostTopic';
    createdAt: Scalars['DateTimeISO']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    nextSiblingId?: Maybe<Scalars['String']['output']>;
    postCount: Scalars['Int']['output'];
    previousSiblingId?: Maybe<Scalars['String']['output']>;
    slug: Scalars['String']['output'];
    title: Scalars['String']['output'];
    type: Scalars['String']['output'];
};

export type PostTopicCreateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    parentId?: InputMaybe<Scalars['String']['input']>;
    position?: InputMaybe<Scalars['Float']['input']>;
    slug: Scalars['String']['input'];
    title: Scalars['String']['input'];
    type: Scalars['String']['input'];
};

export type PostTopicQueryResult = {
    __typename?: 'PostTopicQueryResult';
    pagedPosts: PagedPosts;
    subTopics?: Maybe<Array<PostTopic>>;
    topic: PostTopic;
};

export type PostTopicUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    slug?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type PostTopicUpdatePositionInput = {
    moveToRoot?: InputMaybe<Scalars['Boolean']['input']>;
    parentId?: InputMaybe<Scalars['String']['input']>;
    position?: InputMaybe<Scalars['Float']['input']>;
};

export type PostUpdateInput = {
    allowComment?: InputMaybe<Scalars['Boolean']['input']>;
    allowDownvote?: InputMaybe<Scalars['Boolean']['input']>;
    allowReaction?: InputMaybe<Scalars['Boolean']['input']>;
    allowVote?: InputMaybe<Scalars['Boolean']['input']>;
    content?: InputMaybe<Scalars['String']['input']>;
    contentType?: InputMaybe<RichContentFormat>;
    description?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    publishedAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
    slug?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<Scalars['String']['input']>;
};

export enum PostVoteType {
    Downvote = 'Downvote',
    Upvote = 'Upvote',
}

export type Profile = {
    __typename?: 'Profile';
    birthday?: Maybe<Scalars['DateTimeISO']['output']>;
    countryCode?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    displayName?: Maybe<Scalars['String']['output']>;
    entitlements?: Maybe<Array<ProfileEntitlement>>;
    familyName?: Maybe<Scalars['String']['output']>;
    gender?: Maybe<Scalars['String']['output']>;
    givenName?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    /** Profile asset URL */
    images?: Maybe<Array<ImageObject>>;
    locale?: Maybe<Scalars['String']['output']>;
    middleName?: Maybe<Scalars['String']['output']>;
    preferredName?: Maybe<Scalars['String']['output']>;
    timezone?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    username: Scalars['String']['output'];
};

export type ProfileEntitlement = {
    __typename?: 'ProfileEntitlement';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    entitlement: Entitlement;
    entitlementId: Scalars['String']['output'];
    expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
    id: Scalars['String']['output'];
    profile: Profile;
    profileId: Scalars['String']['output'];
    status: ProfileEntitlementStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type ProfileEntitlementCreateInput = {
    entitlementId: Scalars['String']['input'];
    expiresAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
    profileId: Scalars['String']['input'];
};

export type ProfileEntitlementInput = {
    id: Scalars['String']['input'];
};

export type ProfileEntitlementListInput = {
    entitlementId?: InputMaybe<Scalars['String']['input']>;
    profileId?: InputMaybe<Scalars['String']['input']>;
};

/** The status of a ProfileEntitlement feature key for an account/profile */
export enum ProfileEntitlementStatus {
    Active = 'Active',
    Expired = 'Expired',
    Revoked = 'Revoked',
}

export type PublicProfile = {
    __typename?: 'PublicProfile';
    createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
    displayName?: Maybe<Scalars['String']['output']>;
    images?: Maybe<Array<ImageObject>>;
    username: Scalars['String']['output'];
};

export type Query = {
    __typename?: 'Query';
    account: Account;
    /** Get all access roles assigned to an account. */
    accountAccessRoleAssignmentsPrivileged: PagedAccessRoleAssignments;
    /** Get a single access role by ID or type. */
    accountAccessRolePrivileged?: Maybe<AccessRole>;
    /** Get all access roles. */
    accountAccessRolesPrivileged: Array<AccessRole>;
    accountAuthentication?: Maybe<AuthenticationSession>;
    accountAuthenticationEmailVerification?: Maybe<AuthenticationEmailVerification>;
    accountEmailAddresses: AccountEmailAddressesResult;
    accountEmailVerification: EmailVerification;
    /** Get a single entitlement by ID or featureKey. */
    accountEntitlementPrivileged?: Maybe<Entitlement>;
    /** Get all entitlements. */
    accountEntitlementsPrivileged: Array<Entitlement>;
    accountPrivileged?: Maybe<Account>;
    /** Get a single profile entitlement by ID. */
    accountProfileEntitlementPrivileged?: Maybe<ProfileEntitlement>;
    /** Get all profile entitlements. */
    accountProfileEntitlementsPrivileged: Array<ProfileEntitlement>;
    accountProfilePublic?: Maybe<PublicProfile>;
    accountProfileUsernameValidate: UniqueFieldValidationResult;
    accountSessions: Array<AccountSession>;
    accountsPrivileged: PagedAccounts;
    contactLists: ContactListResult;
    contactListsPrivileged: ContactListResult;
    dataInteractionDatabaseTable: DatabaseTableMetadata;
    dataInteractionDatabaseTableMetrics: Array<DataInteractionDatabaseMetrics>;
    dataInteractionDatabaseTableRow: DatabaseTableRowData;
    dataInteractionDatabaseTableRows: DatabaseTableMetadataWithRows;
    dataInteractionDatabaseTables: DatabaseTablesResult;
    dataInteractionDatabases: PagedDatabasesResult;
    deviceId: OperationResult;
    engagementEvents: Array<EngagementEvent>;
    engagementOverview: EngagementOverview;
    post: Post;
    postComments: PagedPostComments;
    postPrivileged: Post;
    postReactionProfiles: PagedPostReactionProfile;
    postReports: PagedPostReports;
    postTopic: PostTopicQueryResult;
    postTopicById: PostTopic;
    postTopics: Array<PostTopic>;
    posts: PagedPosts;
    postsByTopic: PagedPosts;
    postsMine: PagedPosts;
    postsPrivileged: PagedPosts;
    supportAllSupportProfiles: Array<PublicProfile>;
    supportTicket: SupportTicket;
    supportTickets: PaginationSupportTicketResult;
    supportTicketsPrivileged: PaginationSupportTicketResult;
};

export type QueryAccountAccessRoleAssignmentsPrivilegedArgs = {
    pagination: PaginationInput;
    statuses?: InputMaybe<Array<AccessRoleStatus>>;
};

export type QueryAccountAccessRolePrivilegedArgs = {
    input: AccessRoleInput;
};

export type QueryAccountAccessRolesPrivilegedArgs = {
    input?: InputMaybe<AccessRoleListInput>;
};

export type QueryAccountEntitlementPrivilegedArgs = {
    input: EntitlementInput;
};

export type QueryAccountEntitlementsPrivilegedArgs = {
    input?: InputMaybe<EntitlementListInput>;
};

export type QueryAccountPrivilegedArgs = {
    input: AccountInput;
};

export type QueryAccountProfileEntitlementPrivilegedArgs = {
    input: ProfileEntitlementInput;
};

export type QueryAccountProfileEntitlementsPrivilegedArgs = {
    input?: InputMaybe<ProfileEntitlementListInput>;
};

export type QueryAccountProfilePublicArgs = {
    username: Scalars['String']['input'];
};

export type QueryAccountProfileUsernameValidateArgs = {
    username: Scalars['String']['input'];
};

export type QueryAccountsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryContactListsArgs = {
    pagination: PaginationInput;
};

export type QueryContactListsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryDataInteractionDatabaseTableArgs = {
    databaseName: Scalars['String']['input'];
    tableName: Scalars['String']['input'];
};

export type QueryDataInteractionDatabaseTableMetricsArgs = {
    input: DataInteractionDatabaseTableMetricsQueryInput;
};

export type QueryDataInteractionDatabaseTableRowArgs = {
    databaseName: Scalars['String']['input'];
    id: Scalars['String']['input'];
    tableName: Scalars['String']['input'];
};

export type QueryDataInteractionDatabaseTableRowsArgs = {
    databaseName: Scalars['String']['input'];
    filters?: InputMaybe<ColumnFilterGroupInput>;
    pagination: PaginationInput;
    tableName: Scalars['String']['input'];
};

export type QueryDataInteractionDatabaseTablesArgs = {
    databaseName: Scalars['String']['input'];
    pagination: PaginationInput;
};

export type QueryDataInteractionDatabasesArgs = {
    pagination: PaginationInput;
};

export type QueryEngagementOverviewArgs = {
    input?: InputMaybe<EngagementOverviewInput>;
};

export type QueryPostArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    slug?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPostCommentsArgs = {
    pagination: PaginationInput;
    postId: Scalars['String']['input'];
    threadId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPostPrivilegedArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPostReactionProfilesArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    content: Scalars['String']['input'];
    pagination: PaginationInput;
    postId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPostReportsArgs = {
    commentId?: InputMaybe<Scalars['String']['input']>;
    pagination: PaginationInput;
    postId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPostTopicArgs = {
    pagination: PaginationInput;
    path?: InputMaybe<Scalars['String']['input']>;
    slug: Scalars['String']['input'];
    type: Scalars['String']['input'];
};

export type QueryPostTopicByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryPostTopicsArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QueryPostsArgs = {
    pagination: PaginationInput;
};

export type QueryPostsByTopicArgs = {
    id: Scalars['String']['input'];
    pagination: PaginationInput;
};

export type QueryPostsMineArgs = {
    pagination: PaginationInput;
};

export type QueryPostsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QuerySupportTicketArgs = {
    identifier: Scalars['String']['input'];
};

export type QuerySupportTicketsArgs = {
    pagination: PaginationInput;
};

export type QuerySupportTicketsPrivilegedArgs = {
    pagination: PaginationInput;
};

/** The format of the string rich-content */
export enum RichContentFormat {
    Html = 'Html',
    Markdown = 'Markdown',
    PlainText = 'PlainText',
}

export type SupportTicket = {
    __typename?: 'SupportTicket';
    answered: Scalars['Boolean']['output'];
    answeredAt?: Maybe<Scalars['DateTimeISO']['output']>;
    assignedToProfile?: Maybe<PublicProfile>;
    assignedToProfileId?: Maybe<Scalars['String']['output']>;
    attachments?: Maybe<Array<MediaObject>>;
    comments: Array<SupportTicketComment>;
    createdAt: Scalars['DateTimeISO']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    lastUserCommentedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    status: SupportTicketStatus;
    title: Scalars['String']['output'];
    type: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    userEmailAddress: Scalars['String']['output'];
};

export type SupportTicketComment = {
    __typename?: 'SupportTicketComment';
    attachments?: Maybe<Array<MediaObject>>;
    content: Scalars['String']['output'];
    contentType: RichContentFormat;
    createdAt: Scalars['DateTimeISO']['output'];
    emailMessageId?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    replyToCommentId?: Maybe<Scalars['String']['output']>;
    source: SupportTicketCommentSource;
    visibility: SupportTicketCommentVisibility;
};

export type SupportTicketCommentCreateInput = {
    content: Scalars['String']['input'];
    contentType?: InputMaybe<RichContentFormat>;
    replyToCommentId?: InputMaybe<Scalars['String']['input']>;
    ticketIdentifier: Scalars['String']['input'];
    visibility?: InputMaybe<SupportTicketCommentVisibility>;
};

export enum SupportTicketCommentSource {
    Agent = 'Agent',
    User = 'User',
}

export enum SupportTicketCommentVisibility {
    Internal = 'Internal',
    Public = 'Public',
}

export type SupportTicketCreateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    emailAddress: Scalars['String']['input'];
    initialComment?: InputMaybe<SupportTicketCommentCreateInput>;
    title: Scalars['String']['input'];
    type: Scalars['String']['input'];
};

/** The status of a support ticket */
export enum SupportTicketStatus {
    Closed = 'Closed',
    Deleted = 'Deleted',
    Open = 'Open',
}

export type SupportTicketUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    title?: InputMaybe<Scalars['String']['input']>;
};

/** Possible time intervals used to group time series data. */
export enum TimeInterval {
    Day = 'Day',
    DayOfMonth = 'DayOfMonth',
    DayOfWeek = 'DayOfWeek',
    Hour = 'Hour',
    HourOfDay = 'HourOfDay',
    Month = 'Month',
    MonthOfYear = 'MonthOfYear',
    Quarter = 'Quarter',
    Year = 'Year',
}

export enum UniqueFieldValidationResult {
    Available = 'Available',
    Forbidden = 'Forbidden',
    Invalid = 'Invalid',
    Taken = 'Taken',
}

export type NoOpQueryVariables = Exact<{ [key: string]: never }>;

export type NoOpQuery = { __typename: 'Query' };

export type AccountMaintenanceSessionCreateMutationVariables = Exact<{ [key: string]: never }>;

export type AccountMaintenanceSessionCreateMutation = {
    __typename?: 'Mutation';
    accountMaintenanceSessionCreate: {
        __typename?: 'AuthenticationSession';
        status: AuthenticationSessionStatus;
        scopeType: string;
        updatedAt: any;
        createdAt: any;
        currentChallenge?: {
            __typename?: 'AuthenticationChallenge';
            challengeType: string;
            status: AuthenticationChallengeStatus;
        } | null;
    };
};

export type AccountAdministratorSessionCreateMutationVariables = Exact<{ [key: string]: never }>;

export type AccountAdministratorSessionCreateMutation = {
    __typename?: 'Mutation';
    accountAdministratorSessionCreate: {
        __typename?: 'AuthenticationSession';
        status: AuthenticationSessionStatus;
        scopeType: string;
        updatedAt: any;
        createdAt: any;
        currentChallenge?: {
            __typename?: 'AuthenticationChallenge';
            challengeType: string;
            status: AuthenticationChallengeStatus;
        } | null;
    };
};

export type AccountAuthenticatedSessionCheckQueryVariables = Exact<{ [key: string]: never }>;

export type AccountAuthenticatedSessionCheckQuery = {
    __typename?: 'Query';
    accountAuthentication?: {
        __typename?: 'AuthenticationSession';
        status: AuthenticationSessionStatus;
        scopeType: string;
        currentChallenge?: {
            __typename?: 'AuthenticationChallenge';
            challengeType: string;
            status: AuthenticationChallengeStatus;
        } | null;
    } | null;
};

export type AccountMaintenanceDialogAuthenticationQueryVariables = Exact<{ [key: string]: never }>;

export type AccountMaintenanceDialogAuthenticationQuery = {
    __typename?: 'Query';
    accountAuthentication?: {
        __typename?: 'AuthenticationSession';
        status: AuthenticationSessionStatus;
        scopeType: string;
        currentChallenge?: {
            __typename?: 'AuthenticationChallenge';
            challengeType: string;
            status: AuthenticationChallengeStatus;
        } | null;
    } | null;
};

export type AccountAccessRolesPrivilegedQueryVariables = Exact<{ [key: string]: never }>;

export type AccountAccessRolesPrivilegedQuery = {
    __typename?: 'Query';
    accountAccessRolesPrivileged: Array<{ __typename?: 'AccessRole'; type: string; description?: string | null }>;
};

export type AccountPrivilegedQueryVariables = Exact<{
    input: AccountInput;
}>;

export type AccountPrivilegedQuery = {
    __typename?: 'Query';
    accountPrivileged?: {
        __typename?: 'Account';
        profiles: Array<{
            __typename?: 'Profile';
            username: string;
            displayName?: string | null;
            images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
        }>;
    } | null;
};

export type AccountAccessRoleAssignmentCreatePrivilegedMutationVariables = Exact<{
    input: AccessRoleAssignmentCreateInput;
}>;

export type AccountAccessRoleAssignmentCreatePrivilegedMutation = {
    __typename?: 'Mutation';
    accountAccessRoleAssignmentCreatePrivileged: {
        __typename?: 'AccessRoleAssignment';
        id: string;
        status: AccessRoleStatus;
        expiresAt?: any | null;
        createdAt: any;
        updatedAt: any;
        accessRole?: { __typename?: 'AccessRole'; id: string; type: string; description?: string | null } | null;
        profile: {
            __typename?: 'Profile';
            username: string;
            displayName?: string | null;
            createdAt: any;
            images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
        };
    };
};

export type AccountProfileImageRemoveMutationVariables = Exact<{ [key: string]: never }>;

export type AccountProfileImageRemoveMutation = {
    __typename?: 'Mutation';
    accountProfileImageRemove: {
        __typename?: 'Profile';
        images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
    };
};

export type AccountEmailsQueryVariables = Exact<{ [key: string]: never }>;

export type AccountEmailsQuery = {
    __typename?: 'Query';
    accountEmailAddresses: {
        __typename?: 'AccountEmailAddressesResult';
        emailAddresses: Array<{
            __typename?: 'AccountEmail';
            id: string;
            emailAddress: string;
            type: AccountEmailType;
            isVerified: boolean;
        }>;
    };
};

export type AccountAuthenticationQueryVariables = Exact<{ [key: string]: never }>;

export type AccountAuthenticationQuery = {
    __typename?: 'Query';
    accountAuthentication?: {
        __typename?: 'AuthenticationSession';
        status: AuthenticationSessionStatus;
        scopeType: string;
        updatedAt: any;
        createdAt: any;
        currentChallenge?: {
            __typename?: 'AuthenticationChallenge';
            challengeType: string;
            status: AuthenticationChallengeStatus;
        } | null;
    } | null;
};

export type AccountAuthenticationRegistrationCompleteMutationVariables = Exact<{
    input: AccountRegistrationCompleteInput;
}>;

export type AccountAuthenticationRegistrationCompleteMutation = {
    __typename?: 'Mutation';
    accountAuthenticationRegistrationComplete: { __typename?: 'AuthenticationOperationResult'; success: boolean };
};

export type AccountAuthenticationSignInCompleteMutationVariables = Exact<{ [key: string]: never }>;

export type AccountAuthenticationSignInCompleteMutation = {
    __typename?: 'Mutation';
    accountAuthenticationSignInComplete: { __typename?: 'AuthenticationOperationResult'; success: boolean };
};

export type AccountAuthenticationRegistrationOrSignInCreateMutationVariables = Exact<{
    input: AccountRegistrationOrSignInCreateInput;
}>;

export type AccountAuthenticationRegistrationOrSignInCreateMutation = {
    __typename?: 'Mutation';
    accountAuthenticationRegistrationOrSignInCreate: {
        __typename?: 'AuthenticationRegistrationOrSignIn';
        emailAddress: string;
        authentication: {
            __typename?: 'AuthenticationSession';
            status: AuthenticationSessionStatus;
            scopeType: string;
            updatedAt: any;
            createdAt: any;
            currentChallenge?: {
                __typename?: 'AuthenticationChallenge';
                challengeType: string;
                status: AuthenticationChallengeStatus;
            } | null;
        };
    };
};

export type AccountAuthenticationPasswordVerifyMutationVariables = Exact<{
    input: AccountPasswordVerifyInput;
}>;

export type AccountAuthenticationPasswordVerifyMutation = {
    __typename?: 'Mutation';
    accountAuthenticationPasswordVerify: {
        __typename?: 'AuthenticationOperationResult';
        success: boolean;
        authentication: {
            __typename?: 'AuthenticationSession';
            status: AuthenticationSessionStatus;
            scopeType: string;
            updatedAt: any;
            createdAt: any;
            currentChallenge?: {
                __typename?: 'AuthenticationChallenge';
                challengeType: string;
                status: AuthenticationChallengeStatus;
            } | null;
        };
    };
};

export type AccountAuthenticationEmailVerificationVerifyMutationVariables = Exact<{
    input: AccountEmailVerificationVerifyInput;
}>;

export type AccountAuthenticationEmailVerificationVerifyMutation = {
    __typename?: 'Mutation';
    accountAuthenticationEmailVerificationVerify: {
        __typename?: 'AuthenticationEmailVerification';
        verification: {
            __typename?: 'EmailVerification';
            status: EmailVerificationStatus;
            emailAddress: string;
            lastEmailSentAt?: any | null;
        };
        authentication: {
            __typename?: 'AuthenticationSession';
            status: AuthenticationSessionStatus;
            scopeType: string;
            updatedAt: any;
            createdAt: any;
            currentChallenge?: {
                __typename?: 'AuthenticationChallenge';
                challengeType: string;
                status: AuthenticationChallengeStatus;
            } | null;
        };
    };
};

export type AccountAuthenticationEmailVerificationSendMutationVariables = Exact<{ [key: string]: never }>;

export type AccountAuthenticationEmailVerificationSendMutation = {
    __typename?: 'Mutation';
    accountAuthenticationEmailVerificationSend: {
        __typename?: 'AuthenticationEmailVerification';
        verification: {
            __typename?: 'EmailVerification';
            status: EmailVerificationStatus;
            emailAddress: string;
            lastEmailSentAt?: any | null;
        };
        authentication: {
            __typename?: 'AuthenticationSession';
            status: AuthenticationSessionStatus;
            scopeType: string;
            updatedAt: any;
            createdAt: any;
            currentChallenge?: {
                __typename?: 'AuthenticationChallenge';
                challengeType: string;
                status: AuthenticationChallengeStatus;
            } | null;
        };
    };
};

export type ContactListCreatePrivilegedMutationVariables = Exact<{
    data: ContactListCreationInput;
}>;

export type ContactListCreatePrivilegedMutation = {
    __typename?: 'Mutation';
    contactListCreatePrivileged: {
        __typename?: 'ContactList';
        id: string;
        identifier: string;
        title: string;
        description?: string | null;
        updatedAt: any;
        createdAt: any;
    };
};

export type ContactListsPrivilegedQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type ContactListsPrivilegedQuery = {
    __typename?: 'Query';
    contactListsPrivileged: {
        __typename?: 'ContactListResult';
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForNextPage?: number | null;
            itemIndexForPreviousPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            page: number;
            pagesTotal: number;
        };
        items: Array<{
            __typename?: 'ContactList';
            id: string;
            identifier: string;
            title: string;
            description?: string | null;
            updatedAt: any;
            createdAt: any;
        }>;
    };
};

export type AccountsPrivilegedQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type AccountsPrivilegedQuery = {
    __typename?: 'Query';
    accountsPrivileged: {
        __typename?: 'PagedAccounts';
        items: Array<{
            __typename?: 'Account';
            emailAddress: string;
            profiles: Array<{
                __typename?: 'Profile';
                username: string;
                displayName?: string | null;
                givenName?: string | null;
                familyName?: string | null;
                countryCode?: string | null;
                updatedAt: any;
                createdAt: any;
                images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
            }>;
        }>;
        pagination: {
            __typename?: 'Pagination';
            itemsTotal: number;
            itemsPerPage: number;
            page: number;
            pagesTotal: number;
            itemIndex: number;
            itemIndexForNextPage?: number | null;
            itemIndexForPreviousPage?: number | null;
        };
    };
};

export type AccountDeletePrivilegedMutationVariables = Exact<{
    input: AccountDeleteInput;
}>;

export type AccountDeletePrivilegedMutation = {
    __typename?: 'Mutation';
    accountDeletePrivileged: { __typename?: 'OperationResult'; success: boolean };
};

export type AccountAccessRoleAssignmentsPrivilegedQueryVariables = Exact<{
    statuses: Array<AccessRoleStatus> | AccessRoleStatus;
    pagination: PaginationInput;
}>;

export type AccountAccessRoleAssignmentsPrivilegedQuery = {
    __typename?: 'Query';
    accountAccessRoleAssignmentsPrivileged: {
        __typename?: 'PagedAccessRoleAssignments';
        items: Array<{
            __typename?: 'AccessRoleAssignment';
            id: string;
            status: AccessRoleStatus;
            emailAddress?: string | null;
            expiresAt?: any | null;
            createdAt: any;
            updatedAt: any;
            accessRole?: { __typename?: 'AccessRole'; id: string; type: string; description?: string | null } | null;
            profile: {
                __typename?: 'Profile';
                username: string;
                displayName?: string | null;
                createdAt: any;
                images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
            };
        }>;
        pagination: {
            __typename?: 'Pagination';
            itemsTotal: number;
            itemsPerPage: number;
            page: number;
            pagesTotal: number;
            itemIndex: number;
            itemIndexForNextPage?: number | null;
            itemIndexForPreviousPage?: number | null;
        };
    };
};

export type AccountAccessRoleAssignmentRevokePrivilegedMutationVariables = Exact<{
    input: AccessRoleAssignmentRevokeInput;
}>;

export type AccountAccessRoleAssignmentRevokePrivilegedMutation = {
    __typename?: 'Mutation';
    accountAccessRoleAssignmentRevokePrivileged: { __typename?: 'OperationResult'; success: boolean };
};

export type AccountProfileUpdateMutationVariables = Exact<{
    input: AccountProfileUpdateInput;
}>;

export type AccountProfileUpdateMutation = {
    __typename?: 'Mutation';
    accountProfileUpdate: {
        __typename?: 'Profile';
        username: string;
        displayName?: string | null;
        givenName?: string | null;
        familyName?: string | null;
        updatedAt: any;
        createdAt: any;
        images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
    };
};

export type AccountProfileUsernameValidateQueryVariables = Exact<{
    username: Scalars['String']['input'];
}>;

export type AccountProfileUsernameValidateQuery = {
    __typename?: 'Query';
    accountProfileUsernameValidate: UniqueFieldValidationResult;
};

export type AccountEnrolledChallengesQueryVariables = Exact<{ [key: string]: never }>;

export type AccountEnrolledChallengesQuery = {
    __typename?: 'Query';
    account: { __typename?: 'Account'; enrolledChallenges: Array<string> };
};

export type AccountPasswordUpdateMutationVariables = Exact<{
    input: AccountPasswordUpdateInput;
}>;

export type AccountPasswordUpdateMutation = {
    __typename?: 'Mutation';
    accountPasswordUpdate: { __typename?: 'OperationResult'; success: boolean };
};

export type AccountDeleteMutationVariables = Exact<{
    reason?: InputMaybe<Scalars['String']['input']>;
}>;

export type AccountDeleteMutation = {
    __typename?: 'Mutation';
    accountDelete: { __typename?: 'OperationResult'; success: boolean };
};

export type AccountProfilePublicQueryVariables = Exact<{
    username: Scalars['String']['input'];
}>;

export type AccountProfilePublicQuery = {
    __typename?: 'Query';
    accountProfilePublic?: {
        __typename?: 'PublicProfile';
        username: string;
        displayName?: string | null;
        createdAt?: any | null;
        images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
    } | null;
};

export type AccountSignOutMutationVariables = Exact<{ [key: string]: never }>;

export type AccountSignOutMutation = {
    __typename?: 'Mutation';
    accountSignOut: { __typename?: 'OperationResult'; success: boolean };
};

export type AccountQueryVariables = Exact<{ [key: string]: never }>;

export type AccountQuery = {
    __typename?: 'Query';
    account: {
        __typename?: 'Account';
        emailAddress: string;
        accessRoles: Array<string>;
        createdAt: any;
        profile: {
            __typename?: 'Profile';
            id: string;
            username: string;
            displayName?: string | null;
            givenName?: string | null;
            familyName?: string | null;
            updatedAt: any;
            createdAt: any;
            images?: Array<{ __typename?: 'ImageObject'; url: string; variant?: string | null }> | null;
        };
    };
};

export type ContactListEntryCreateMutationVariables = Exact<{
    data: ContactListEntryInput;
}>;

export type ContactListEntryCreateMutation = {
    __typename?: 'Mutation';
    contactListEntryCreate: { __typename?: 'ContactListEntry'; id: string; emailAddress: string };
};

export type DataInteractionDatabaseTableRowsQueryVariables = Exact<{
    databaseName: Scalars['String']['input'];
    tableName: Scalars['String']['input'];
    pagination: PaginationInput;
    filters?: InputMaybe<ColumnFilterGroupInput>;
}>;

export type DataInteractionDatabaseTableRowsQuery = {
    __typename?: 'Query';
    dataInteractionDatabaseTableRows: {
        __typename?: 'DatabaseTableMetadataWithRows';
        items: Array<any>;
        databaseName: string;
        tableName: string;
        rowCount: number;
        columns?: Array<{
            __typename?: 'DatabaseTableColumn';
            name: string;
            type: string;
            isKey: boolean;
            isPrimaryKey: boolean;
            keyTableName?: string | null;
            possibleValues?: Array<string> | null;
            isNullable: boolean;
            isGenerated: boolean;
            length: string;
        }> | null;
        relations?: Array<{
            __typename?: 'DatabaseTableRelation';
            fieldName: string;
            tableName: string;
            type: string;
            inverseFieldName?: string | null;
            inverseType?: string | null;
            inverseTableName?: string | null;
        }> | null;
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            pagesTotal: number;
            page: number;
        };
    };
};

export type DataInteractionDatabaseTableMetricsQueryVariables = Exact<{
    input: DataInteractionDatabaseTableMetricsQueryInput;
}>;

export type DataInteractionDatabaseTableMetricsQuery = {
    __typename?: 'Query';
    dataInteractionDatabaseTableMetrics: Array<{
        __typename?: 'DataInteractionDatabaseMetrics';
        timeInterval: TimeInterval;
        data: Array<any>;
    }>;
};

export type DataInteractionDatabaseTableQueryVariables = Exact<{
    databaseName: Scalars['String']['input'];
    tableName: Scalars['String']['input'];
}>;

export type DataInteractionDatabaseTableQuery = {
    __typename?: 'Query';
    dataInteractionDatabaseTable: {
        __typename?: 'DatabaseTableMetadata';
        databaseName: string;
        tableName: string;
        columns?: Array<{
            __typename?: 'DatabaseTableColumn';
            name: string;
            type: string;
            isKey: boolean;
            isPrimaryKey: boolean;
            keyTableName?: string | null;
            possibleValues?: Array<string> | null;
            isNullable: boolean;
            isGenerated: boolean;
            length: string;
        }> | null;
        relations?: Array<{
            __typename?: 'DatabaseTableRelation';
            fieldName: string;
            type: string;
            tableName: string;
            inverseFieldName?: string | null;
            inverseType?: string | null;
            inverseTableName?: string | null;
        }> | null;
    };
};

export type DataInteractionDatabaseTablesQueryVariables = Exact<{
    databaseName: Scalars['String']['input'];
    pagination: PaginationInput;
}>;

export type DataInteractionDatabaseTablesQuery = {
    __typename?: 'Query';
    dataInteractionDatabaseTables: {
        __typename?: 'DatabaseTablesResult';
        items: Array<{ __typename?: 'DatabaseTableMetadata'; databaseName: string; tableName: string }>;
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            pagesTotal: number;
            page: number;
        };
    };
};

export type DataInteractionDatabasesQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type DataInteractionDatabasesQuery = {
    __typename?: 'Query';
    dataInteractionDatabases: {
        __typename?: 'PagedDatabasesResult';
        items: Array<{ __typename?: 'DatabaseMetadata'; databaseName: string }>;
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            pagesTotal: number;
            page: number;
        };
    };
};

export type EngagementEventsCreateMutationVariables = Exact<{
    inputs: Array<CreateEngagementEventInput> | CreateEngagementEventInput;
}>;

export type EngagementEventsCreateMutation = {
    __typename?: 'Mutation';
    engagementEventsCreate: { __typename?: 'OperationResult'; success: boolean };
};

export type PostDeleteMutationVariables = Exact<{
    id: Scalars['String']['input'];
}>;

export type PostDeleteMutation = { __typename?: 'Mutation'; postDelete: string };

export type PostByIdentifierQueryVariables = Exact<{
    identifier: Scalars['String']['input'];
}>;

export type PostByIdentifierQuery = { __typename?: 'Query'; post: { __typename?: 'Post'; id: string } };

export type PostTopicDeleteMutationVariables = Exact<{
    id: Scalars['String']['input'];
}>;

export type PostTopicDeleteMutation = {
    __typename?: 'Mutation';
    postTopicDelete: { __typename?: 'OperationResult'; success: boolean };
};

export type PostUpdateMutationVariables = Exact<{
    id: Scalars['String']['input'];
    input: PostUpdateInput;
}>;

export type PostUpdateMutation = {
    __typename?: 'Mutation';
    postUpdate: {
        __typename?: 'Post';
        id: string;
        status: PostStatus;
        title: string;
        contentType: RichContentFormat;
        content?: string | null;
        settings?: any | null;
        upvoteCount: number;
        downvoteCount: number;
        metadata?: any | null;
        updatedAt: any;
        createdAt: any;
    };
};

export type PostReactionCreateMutationVariables = Exact<{
    postId: Scalars['String']['input'];
    content: Scalars['String']['input'];
}>;

export type PostReactionCreateMutation = {
    __typename?: 'Mutation';
    postReactionCreate: { __typename?: 'OperationResult'; success: boolean };
};

export type PostReportCreateMutationVariables = Exact<{
    input: PostReportInput;
}>;

export type PostReportCreateMutation = {
    __typename?: 'Mutation';
    postReportCreate: { __typename?: 'PostReport'; id: string };
};

export type PostVoteMutationVariables = Exact<{
    postId: Scalars['String']['input'];
    type: PostVoteType;
}>;

export type PostVoteMutation = {
    __typename?: 'Mutation';
    postVote: { __typename?: 'OperationResult'; success: boolean };
};

export type PostUnvoteMutationVariables = Exact<{
    postId: Scalars['String']['input'];
}>;

export type PostUnvoteMutation = {
    __typename?: 'Mutation';
    postUnvote: { __typename?: 'OperationResult'; success: boolean };
};

export type PostReactionProfilesQueryVariables = Exact<{
    postId: Scalars['String']['input'];
    content: Scalars['String']['input'];
    pagination: PaginationInput;
}>;

export type PostReactionProfilesQuery = {
    __typename?: 'Query';
    postReactionProfiles: {
        __typename?: 'PagedPostReactionProfile';
        items: Array<{
            __typename?: 'PostReactionProfile';
            username: string;
            displayName?: string | null;
            profileId: string;
        }>;
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            pagesTotal: number;
            page: number;
        };
    };
};

export type PostReactionDeleteMutationVariables = Exact<{
    postId: Scalars['String']['input'];
    content: Scalars['String']['input'];
}>;

export type PostReactionDeleteMutation = {
    __typename?: 'Mutation';
    postReactionDelete: { __typename?: 'OperationResult'; success: boolean };
};

export type PostQueryVariables = Exact<{
    id?: InputMaybe<Scalars['String']['input']>;
    slug?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
}>;

export type PostQuery = {
    __typename?: 'Query';
    post: {
        __typename?: 'Post';
        id: string;
        identifier: string;
        slug: string;
        status: PostStatus;
        title: string;
        createdByProfileId: string;
        content?: string | null;
        upvoteCount: number;
        downvoteCount: number;
        voteType?: PostVoteType | null;
        reportedCount: number;
        reportStatus?: PostReportStatus | null;
        metadata?: any | null;
        latestRevisionId?: string | null;
        updatedAt: any;
        createdAt: any;
        createdByProfile?: {
            __typename?: 'PublicProfile';
            displayName?: string | null;
            username: string;
            images?: Array<{
                __typename?: 'ImageObject';
                url: string;
                type: MediaObjectType;
                variant?: string | null;
            }> | null;
        } | null;
        reactions?: Array<{ __typename?: 'PostReaction'; content: string; count: number; reacted: boolean }> | null;
    };
};

export type PostsQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type PostsQuery = {
    __typename?: 'Query';
    posts: {
        __typename?: 'PagedPosts';
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
            pagesTotal: number;
            page: number;
        };
        items: Array<{
            __typename?: 'Post';
            id: string;
            identifier: string;
            slug: string;
            status: PostStatus;
            title: string;
            createdByProfileId: string;
            content?: string | null;
            upvoteCount: number;
            downvoteCount: number;
            voteType?: PostVoteType | null;
            reportedCount: number;
            reportStatus?: PostReportStatus | null;
            metadata?: any | null;
            latestRevisionId?: string | null;
            updatedAt: any;
            createdAt: any;
            createdByProfile?: {
                __typename?: 'PublicProfile';
                displayName?: string | null;
                username: string;
                images?: Array<{
                    __typename?: 'ImageObject';
                    url: string;
                    type: MediaObjectType;
                    variant?: string | null;
                }> | null;
            } | null;
            reactions?: Array<{ __typename?: 'PostReaction'; content: string; count: number; reacted: boolean }> | null;
        }>;
    };
};

export type PostCreateMutationVariables = Exact<{
    input: PostCreateInput;
}>;

export type PostCreateMutation = {
    __typename?: 'Mutation';
    postCreatePrivileged: {
        __typename?: 'Post';
        id: string;
        status: PostStatus;
        title: string;
        contentType: RichContentFormat;
        content?: string | null;
        settings?: any | null;
        upvoteCount: number;
        downvoteCount: number;
        metadata?: any | null;
        updatedAt: any;
        createdAt: any;
    };
};

export type SupportTicketCreateMutationVariables = Exact<{
    input: SupportTicketCreateInput;
}>;

export type SupportTicketCreateMutation = {
    __typename?: 'Mutation';
    supportTicketCreate: {
        __typename?: 'SupportTicket';
        id: string;
        type: string;
        status: SupportTicketStatus;
        userEmailAddress: string;
        title: string;
        description?: string | null;
        comments: Array<{ __typename?: 'SupportTicketComment'; content: string }>;
    };
};

export type PostTopicCreateMutationVariables = Exact<{
    input: PostTopicCreateInput;
}>;

export type PostTopicCreateMutation = {
    __typename?: 'Mutation';
    postTopicCreate: {
        __typename?: 'PostTopic';
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        postCount: number;
        createdAt: any;
    };
};

export type PostTopicUpdateMutationVariables = Exact<{
    input: PostTopicUpdateInput;
}>;

export type PostTopicUpdateMutation = {
    __typename?: 'Mutation';
    postTopicUpdate: {
        __typename?: 'PostTopic';
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        postCount: number;
        createdAt: any;
    };
};

export type PostTopicByIdQueryVariables = Exact<{
    id: Scalars['String']['input'];
}>;

export type PostTopicByIdQuery = {
    __typename?: 'Query';
    postTopicById: {
        __typename?: 'PostTopic';
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        postCount: number;
        createdAt: any;
    };
};

export class TypedDocumentString<TResult, TVariables>
    extends String
    implements DocumentTypeDecoration<TResult, TVariables>
{
    __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
    private value: string;
    public __meta__?: Record<string, any> | undefined;

    constructor(value: string, __meta__?: Record<string, any> | undefined) {
        super(value);
        this.value = value;
        this.__meta__ = __meta__;
    }

    override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
        return this.value;
    }
}

export const NoOpDocument = new TypedDocumentString(`
    query NoOp {
  __typename
}
    `) as unknown as TypedDocumentString<NoOpQuery, NoOpQueryVariables>;
export const AccountMaintenanceSessionCreateDocument = new TypedDocumentString(`
    mutation AccountMaintenanceSessionCreate {
  accountMaintenanceSessionCreate {
    status
    scopeType
    currentChallenge {
      challengeType
      status
    }
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    AccountMaintenanceSessionCreateMutation,
    AccountMaintenanceSessionCreateMutationVariables
>;
export const AccountAdministratorSessionCreateDocument = new TypedDocumentString(`
    mutation AccountAdministratorSessionCreate {
  accountAdministratorSessionCreate {
    status
    scopeType
    currentChallenge {
      challengeType
      status
    }
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    AccountAdministratorSessionCreateMutation,
    AccountAdministratorSessionCreateMutationVariables
>;
export const AccountAuthenticatedSessionCheckDocument = new TypedDocumentString(`
    query AccountAuthenticatedSessionCheck {
  accountAuthentication {
    status
    scopeType
    currentChallenge {
      challengeType
      status
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticatedSessionCheckQuery,
    AccountAuthenticatedSessionCheckQueryVariables
>;
export const AccountMaintenanceDialogAuthenticationDocument = new TypedDocumentString(`
    query AccountMaintenanceDialogAuthentication {
  accountAuthentication {
    status
    scopeType
    currentChallenge {
      challengeType
      status
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountMaintenanceDialogAuthenticationQuery,
    AccountMaintenanceDialogAuthenticationQueryVariables
>;
export const AccountAccessRolesPrivilegedDocument = new TypedDocumentString(`
    query AccountAccessRolesPrivileged {
  accountAccessRolesPrivileged {
    type
    description
  }
}
    `) as unknown as TypedDocumentString<AccountAccessRolesPrivilegedQuery, AccountAccessRolesPrivilegedQueryVariables>;
export const AccountPrivilegedDocument = new TypedDocumentString(`
    query AccountPrivileged($input: AccountInput!) {
  accountPrivileged(input: $input) {
    profiles {
      username
      displayName
      images {
        url
        variant
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AccountPrivilegedQuery, AccountPrivilegedQueryVariables>;
export const AccountAccessRoleAssignmentCreatePrivilegedDocument = new TypedDocumentString(`
    mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {
  accountAccessRoleAssignmentCreatePrivileged(input: $input) {
    id
    accessRole {
      id
      type
      description
    }
    status
    profile {
      username
      displayName
      images {
        url
        variant
      }
      createdAt
    }
    expiresAt
    createdAt
    updatedAt
  }
}
    `) as unknown as TypedDocumentString<
    AccountAccessRoleAssignmentCreatePrivilegedMutation,
    AccountAccessRoleAssignmentCreatePrivilegedMutationVariables
>;
export const AccountProfileImageRemoveDocument = new TypedDocumentString(`
    mutation AccountProfileImageRemove {
  accountProfileImageRemove {
    images {
      url
      variant
    }
  }
}
    `) as unknown as TypedDocumentString<AccountProfileImageRemoveMutation, AccountProfileImageRemoveMutationVariables>;
export const AccountEmailsDocument = new TypedDocumentString(`
    query AccountEmails {
  accountEmailAddresses {
    emailAddresses {
      id
      emailAddress
      type
      isVerified
    }
  }
}
    `) as unknown as TypedDocumentString<AccountEmailsQuery, AccountEmailsQueryVariables>;
export const AccountAuthenticationDocument = new TypedDocumentString(`
    query AccountAuthentication {
  accountAuthentication {
    status
    scopeType
    currentChallenge {
      challengeType
      status
    }
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<AccountAuthenticationQuery, AccountAuthenticationQueryVariables>;
export const AccountAuthenticationRegistrationCompleteDocument = new TypedDocumentString(`
    mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {
  accountAuthenticationRegistrationComplete(input: $input) {
    success
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationRegistrationCompleteMutation,
    AccountAuthenticationRegistrationCompleteMutationVariables
>;
export const AccountAuthenticationSignInCompleteDocument = new TypedDocumentString(`
    mutation AccountAuthenticationSignInComplete {
  accountAuthenticationSignInComplete {
    success
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationSignInCompleteMutation,
    AccountAuthenticationSignInCompleteMutationVariables
>;
export const AccountAuthenticationRegistrationOrSignInCreateDocument = new TypedDocumentString(`
    mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {
  accountAuthenticationRegistrationOrSignInCreate(input: $input) {
    emailAddress
    authentication {
      status
      scopeType
      currentChallenge {
        challengeType
        status
      }
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationRegistrationOrSignInCreateMutation,
    AccountAuthenticationRegistrationOrSignInCreateMutationVariables
>;
export const AccountAuthenticationPasswordVerifyDocument = new TypedDocumentString(`
    mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {
  accountAuthenticationPasswordVerify(input: $input) {
    success
    authentication {
      status
      scopeType
      currentChallenge {
        challengeType
        status
      }
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationPasswordVerifyMutation,
    AccountAuthenticationPasswordVerifyMutationVariables
>;
export const AccountAuthenticationEmailVerificationVerifyDocument = new TypedDocumentString(`
    mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {
  accountAuthenticationEmailVerificationVerify(input: $input) {
    verification {
      status
      emailAddress
      lastEmailSentAt
    }
    authentication {
      status
      scopeType
      currentChallenge {
        challengeType
        status
      }
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationEmailVerificationVerifyMutation,
    AccountAuthenticationEmailVerificationVerifyMutationVariables
>;
export const AccountAuthenticationEmailVerificationSendDocument = new TypedDocumentString(`
    mutation AccountAuthenticationEmailVerificationSend {
  accountAuthenticationEmailVerificationSend {
    verification {
      status
      emailAddress
      lastEmailSentAt
    }
    authentication {
      status
      scopeType
      currentChallenge {
        challengeType
        status
      }
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAuthenticationEmailVerificationSendMutation,
    AccountAuthenticationEmailVerificationSendMutationVariables
>;
export const ContactListCreatePrivilegedDocument = new TypedDocumentString(`
    mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {
  contactListCreatePrivileged(data: $data) {
    id
    identifier
    title
    description
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<
    ContactListCreatePrivilegedMutation,
    ContactListCreatePrivilegedMutationVariables
>;
export const ContactListsPrivilegedDocument = new TypedDocumentString(`
    query ContactListsPrivileged($pagination: PaginationInput!) {
  contactListsPrivileged(pagination: $pagination) {
    pagination {
      itemIndex
      itemIndexForNextPage
      itemIndexForPreviousPage
      itemsPerPage
      itemsTotal
      page
      pagesTotal
    }
    items {
      id
      identifier
      title
      description
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<ContactListsPrivilegedQuery, ContactListsPrivilegedQueryVariables>;
export const AccountsPrivilegedDocument = new TypedDocumentString(`
    query AccountsPrivileged($pagination: PaginationInput!) {
  accountsPrivileged(pagination: $pagination) {
    items {
      emailAddress
      profiles {
        username
        displayName
        givenName
        familyName
        countryCode
        images {
          url
          variant
        }
        updatedAt
        createdAt
      }
    }
    pagination {
      itemsTotal
      itemsPerPage
      page
      pagesTotal
      itemIndex
      itemIndexForNextPage
      itemIndexForPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<AccountsPrivilegedQuery, AccountsPrivilegedQueryVariables>;
export const AccountDeletePrivilegedDocument = new TypedDocumentString(`
    mutation AccountDeletePrivileged($input: AccountDeleteInput!) {
  accountDeletePrivileged(input: $input) {
    success
  }
}
    `) as unknown as TypedDocumentString<AccountDeletePrivilegedMutation, AccountDeletePrivilegedMutationVariables>;
export const AccountAccessRoleAssignmentsPrivilegedDocument = new TypedDocumentString(`
    query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {
  accountAccessRoleAssignmentsPrivileged(
    statuses: $statuses
    pagination: $pagination
  ) {
    items {
      id
      accessRole {
        id
        type
        description
      }
      status
      emailAddress
      profile {
        username
        displayName
        images {
          url
          variant
        }
        createdAt
      }
      expiresAt
      createdAt
      updatedAt
    }
    pagination {
      itemsTotal
      itemsPerPage
      page
      pagesTotal
      itemIndex
      itemIndexForNextPage
      itemIndexForPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<
    AccountAccessRoleAssignmentsPrivilegedQuery,
    AccountAccessRoleAssignmentsPrivilegedQueryVariables
>;
export const AccountAccessRoleAssignmentRevokePrivilegedDocument = new TypedDocumentString(`
    mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {
  accountAccessRoleAssignmentRevokePrivileged(input: $input) {
    success
  }
}
    `) as unknown as TypedDocumentString<
    AccountAccessRoleAssignmentRevokePrivilegedMutation,
    AccountAccessRoleAssignmentRevokePrivilegedMutationVariables
>;
export const AccountProfileUpdateDocument = new TypedDocumentString(`
    mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {
  accountProfileUpdate(input: $input) {
    username
    displayName
    givenName
    familyName
    images {
      url
      variant
    }
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<AccountProfileUpdateMutation, AccountProfileUpdateMutationVariables>;
export const AccountProfileUsernameValidateDocument = new TypedDocumentString(`
    query AccountProfileUsernameValidate($username: String!) {
  accountProfileUsernameValidate(username: $username)
}
    `) as unknown as TypedDocumentString<
    AccountProfileUsernameValidateQuery,
    AccountProfileUsernameValidateQueryVariables
>;
export const AccountEnrolledChallengesDocument = new TypedDocumentString(`
    query AccountEnrolledChallenges {
  account {
    enrolledChallenges
  }
}
    `) as unknown as TypedDocumentString<AccountEnrolledChallengesQuery, AccountEnrolledChallengesQueryVariables>;
export const AccountPasswordUpdateDocument = new TypedDocumentString(`
    mutation AccountPasswordUpdate($input: AccountPasswordUpdateInput!) {
  accountPasswordUpdate(input: $input) {
    success
  }
}
    `) as unknown as TypedDocumentString<AccountPasswordUpdateMutation, AccountPasswordUpdateMutationVariables>;
export const AccountDeleteDocument = new TypedDocumentString(`
    mutation AccountDelete($reason: String) {
  accountDelete(reason: $reason) {
    success
  }
}
    `) as unknown as TypedDocumentString<AccountDeleteMutation, AccountDeleteMutationVariables>;
export const AccountProfilePublicDocument = new TypedDocumentString(`
    query AccountProfilePublic($username: String!) {
  accountProfilePublic(username: $username) {
    username
    displayName
    images {
      url
      variant
    }
    createdAt
  }
}
    `) as unknown as TypedDocumentString<AccountProfilePublicQuery, AccountProfilePublicQueryVariables>;
export const AccountSignOutDocument = new TypedDocumentString(`
    mutation AccountSignOut {
  accountSignOut {
    success
  }
}
    `) as unknown as TypedDocumentString<AccountSignOutMutation, AccountSignOutMutationVariables>;
export const AccountDocument = new TypedDocumentString(`
    query Account {
  account {
    emailAddress
    profile {
      id
      username
      displayName
      givenName
      familyName
      images {
        url
        variant
      }
      updatedAt
      createdAt
    }
    accessRoles
    createdAt
  }
}
    `) as unknown as TypedDocumentString<AccountQuery, AccountQueryVariables>;
export const ContactListEntryCreateDocument = new TypedDocumentString(`
    mutation ContactListEntryCreate($data: ContactListEntryInput!) {
  contactListEntryCreate(data: $data) {
    id
    emailAddress
  }
}
    `) as unknown as TypedDocumentString<ContactListEntryCreateMutation, ContactListEntryCreateMutationVariables>;
export const DataInteractionDatabaseTableRowsDocument = new TypedDocumentString(`
    query DataInteractionDatabaseTableRows($databaseName: String!, $tableName: String!, $pagination: PaginationInput!, $filters: ColumnFilterGroupInput) {
  dataInteractionDatabaseTableRows(
    databaseName: $databaseName
    tableName: $tableName
    pagination: $pagination
    filters: $filters
  ) {
    items
    databaseName
    tableName
    rowCount
    columns {
      name
      type
      isKey
      isPrimaryKey
      keyTableName
      possibleValues
      isNullable
      isGenerated
      length
    }
    relations {
      fieldName
      tableName
      type
      inverseFieldName
      inverseType
      inverseTableName
    }
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
      pagesTotal
      page
    }
  }
}
    `) as unknown as TypedDocumentString<
    DataInteractionDatabaseTableRowsQuery,
    DataInteractionDatabaseTableRowsQueryVariables
>;
export const DataInteractionDatabaseTableMetricsDocument = new TypedDocumentString(`
    query DataInteractionDatabaseTableMetrics($input: DataInteractionDatabaseTableMetricsQueryInput!) {
  dataInteractionDatabaseTableMetrics(input: $input) {
    timeInterval
    data
  }
}
    `) as unknown as TypedDocumentString<
    DataInteractionDatabaseTableMetricsQuery,
    DataInteractionDatabaseTableMetricsQueryVariables
>;
export const DataInteractionDatabaseTableDocument = new TypedDocumentString(`
    query DataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {
  dataInteractionDatabaseTable(databaseName: $databaseName, tableName: $tableName) {
    databaseName
    tableName
    columns {
      name
      type
      isKey
      isPrimaryKey
      keyTableName
      possibleValues
      isNullable
      isGenerated
      length
    }
    relations {
      fieldName
      type
      tableName
      inverseFieldName
      inverseType
      inverseTableName
    }
  }
}
    `) as unknown as TypedDocumentString<DataInteractionDatabaseTableQuery, DataInteractionDatabaseTableQueryVariables>;
export const DataInteractionDatabaseTablesDocument = new TypedDocumentString(`
    query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {
  dataInteractionDatabaseTables(
    databaseName: $databaseName
    pagination: $pagination
  ) {
    items {
      databaseName
      tableName
    }
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
      pagesTotal
      page
    }
  }
}
    `) as unknown as TypedDocumentString<
    DataInteractionDatabaseTablesQuery,
    DataInteractionDatabaseTablesQueryVariables
>;
export const DataInteractionDatabasesDocument = new TypedDocumentString(`
    query DataInteractionDatabases($pagination: PaginationInput!) {
  dataInteractionDatabases(pagination: $pagination) {
    items {
      databaseName
    }
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
      pagesTotal
      page
    }
  }
}
    `) as unknown as TypedDocumentString<DataInteractionDatabasesQuery, DataInteractionDatabasesQueryVariables>;
export const EngagementEventsCreateDocument = new TypedDocumentString(`
    mutation EngagementEventsCreate($inputs: [CreateEngagementEventInput!]!) {
  engagementEventsCreate(inputs: $inputs) {
    success
  }
}
    `) as unknown as TypedDocumentString<EngagementEventsCreateMutation, EngagementEventsCreateMutationVariables>;
export const PostDeleteDocument = new TypedDocumentString(`
    mutation PostDelete($id: String!) {
  postDelete(id: $id)
}
    `) as unknown as TypedDocumentString<PostDeleteMutation, PostDeleteMutationVariables>;
export const PostByIdentifierDocument = new TypedDocumentString(`
    query PostByIdentifier($identifier: String!) {
  post(identifier: $identifier) {
    id
  }
}
    `) as unknown as TypedDocumentString<PostByIdentifierQuery, PostByIdentifierQueryVariables>;
export const PostTopicDeleteDocument = new TypedDocumentString(`
    mutation PostTopicDelete($id: String!) {
  postTopicDelete(id: $id) {
    success
  }
}
    `) as unknown as TypedDocumentString<PostTopicDeleteMutation, PostTopicDeleteMutationVariables>;
export const PostUpdateDocument = new TypedDocumentString(`
    mutation PostUpdate($id: String!, $input: PostUpdateInput!) {
  postUpdate(id: $id, input: $input) {
    id
    status
    title
    contentType
    content
    settings
    upvoteCount
    downvoteCount
    metadata
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostUpdateMutation, PostUpdateMutationVariables>;
export const PostReactionCreateDocument = new TypedDocumentString(`
    mutation PostReactionCreate($postId: String!, $content: String!) {
  postReactionCreate(postId: $postId, content: $content) {
    success
  }
}
    `) as unknown as TypedDocumentString<PostReactionCreateMutation, PostReactionCreateMutationVariables>;
export const PostReportCreateDocument = new TypedDocumentString(`
    mutation PostReportCreate($input: PostReportInput!) {
  postReportCreate(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<PostReportCreateMutation, PostReportCreateMutationVariables>;
export const PostVoteDocument = new TypedDocumentString(`
    mutation PostVote($postId: String!, $type: PostVoteType!) {
  postVote(postId: $postId, type: $type) {
    success
  }
}
    `) as unknown as TypedDocumentString<PostVoteMutation, PostVoteMutationVariables>;
export const PostUnvoteDocument = new TypedDocumentString(`
    mutation PostUnvote($postId: String!) {
  postUnvote(postId: $postId) {
    success
  }
}
    `) as unknown as TypedDocumentString<PostUnvoteMutation, PostUnvoteMutationVariables>;
export const PostReactionProfilesDocument = new TypedDocumentString(`
    query PostReactionProfiles($postId: String!, $content: String!, $pagination: PaginationInput!) {
  postReactionProfiles(
    postId: $postId
    content: $content
    pagination: $pagination
  ) {
    items {
      username
      displayName
      profileId
    }
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
      pagesTotal
      page
    }
  }
}
    `) as unknown as TypedDocumentString<PostReactionProfilesQuery, PostReactionProfilesQueryVariables>;
export const PostReactionDeleteDocument = new TypedDocumentString(`
    mutation PostReactionDelete($postId: String!, $content: String!) {
  postReactionDelete(postId: $postId, content: $content) {
    success
  }
}
    `) as unknown as TypedDocumentString<PostReactionDeleteMutation, PostReactionDeleteMutationVariables>;
export const PostDocument = new TypedDocumentString(`
    query Post($id: String, $slug: String, $identifier: String) {
  post(id: $id, slug: $slug, identifier: $identifier) {
    id
    identifier
    slug
    status
    title
    createdByProfileId
    createdByProfile {
      displayName
      username
      images {
        url
        type
        variant
      }
    }
    content
    reactions {
      content
      count
      reacted
    }
    upvoteCount
    downvoteCount
    voteType
    reportedCount
    reportStatus
    metadata
    latestRevisionId
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostQuery, PostQueryVariables>;
export const PostsDocument = new TypedDocumentString(`
    query Posts($pagination: PaginationInput!) {
  posts(pagination: $pagination) {
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
      pagesTotal
      page
    }
    items {
      id
      identifier
      slug
      status
      title
      createdByProfileId
      createdByProfile {
        displayName
        username
        images {
          url
          type
          variant
        }
      }
      content
      reactions {
        content
        count
        reacted
      }
      upvoteCount
      downvoteCount
      voteType
      reportedCount
      reportStatus
      metadata
      latestRevisionId
      updatedAt
      createdAt
    }
  }
}
    `) as unknown as TypedDocumentString<PostsQuery, PostsQueryVariables>;
export const PostCreateDocument = new TypedDocumentString(`
    mutation PostCreate($input: PostCreateInput!) {
  postCreatePrivileged(input: $input) {
    id
    status
    title
    contentType
    content
    settings
    upvoteCount
    downvoteCount
    metadata
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostCreateMutation, PostCreateMutationVariables>;
export const SupportTicketCreateDocument = new TypedDocumentString(`
    mutation SupportTicketCreate($input: SupportTicketCreateInput!) {
  supportTicketCreate(input: $input) {
    id
    type
    status
    userEmailAddress
    title
    description
    comments {
      content
    }
  }
}
    `) as unknown as TypedDocumentString<SupportTicketCreateMutation, SupportTicketCreateMutationVariables>;
export const PostTopicCreateDocument = new TypedDocumentString(`
    mutation PostTopicCreate($input: PostTopicCreateInput!) {
  postTopicCreate(input: $input) {
    id
    title
    slug
    description
    postCount
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostTopicCreateMutation, PostTopicCreateMutationVariables>;
export const PostTopicUpdateDocument = new TypedDocumentString(`
    mutation PostTopicUpdate($input: PostTopicUpdateInput!) {
  postTopicUpdate(input: $input) {
    id
    title
    slug
    description
    postCount
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostTopicUpdateMutation, PostTopicUpdateMutationVariables>;
export const PostTopicByIdDocument = new TypedDocumentString(`
    query PostTopicById($id: String!) {
  postTopicById(id: $id) {
    id
    title
    slug
    description
    postCount
    createdAt
  }
}
    `) as unknown as TypedDocumentString<PostTopicByIdQuery, PostTopicByIdQueryVariables>;
export type GraphQLInputTypeMetadata =
    | GraphQLInputScalarTypeMetadata
    | GraphQLInputEnumTypeMetadata
    | GraphQLInputObjectTypeMetadata;

interface BaseGraphQLInputTypeMetadata {
    readonly type: string;
    readonly description?: string;
}

export interface GraphQLInputScalarTypeMetadata extends BaseGraphQLInputTypeMetadata {
    readonly kind: 'scalar';
}

export interface GraphQLInputEnumTypeMetadata extends BaseGraphQLInputTypeMetadata {
    readonly kind: 'enum';
    readonly values: Array<string>;
}

export interface GraphQLInputObjectTypeMetadata extends BaseGraphQLInputTypeMetadata {
    readonly kind: 'object';
    readonly fields: ReadonlyArray<GraphQLInputObjectFieldMetadata>;
}

export type GraphQLInputObjectFieldMetadata =
    | GraphQLInputObjectScalarFieldMetadata
    | GraphQLInputObjectEnumFieldMetadata
    | GraphQLInputObjectObjectFieldMetadata
    | GraphQLInputObjectListFieldMetadata
    | GraphQLInputObjectScalarListFieldMetadata;

interface BaseGraphQLInputObjectFieldMetadata {
    readonly name: string;
    readonly required: boolean;
    readonly validation?: ReadonlyArray<GraphQLInputObjectFieldValidationMetadata>;
}

export interface GraphQLInputObjectScalarFieldMetadata extends BaseGraphQLInputObjectFieldMetadata {
    readonly kind: 'scalar';
    readonly type: string;
}

export interface GraphQLInputObjectEnumFieldMetadata extends BaseGraphQLInputObjectFieldMetadata {
    readonly kind: 'enum';
    readonly type: GraphQLInputEnumTypeMetadata;
}

export interface GraphQLInputObjectObjectFieldMetadata extends BaseGraphQLInputObjectFieldMetadata {
    readonly kind: 'object';
    readonly type: GraphQLInputObjectTypeMetadata;
}

interface BaseGraphQLInputObjectListFieldMetadata extends BaseGraphQLInputObjectFieldMetadata {
    readonly kind: 'list';
    readonly allowsEmpty: boolean;
}

export interface GraphQLInputObjectListFieldMetadata extends BaseGraphQLInputObjectListFieldMetadata {
    readonly itemKind: 'enum' | 'object';
    readonly type: GraphQLInputTypeMetadata;
}

export interface GraphQLInputObjectScalarListFieldMetadata extends BaseGraphQLInputObjectListFieldMetadata {
    readonly itemKind: 'scalar';
    readonly type: string;
}

export interface GraphQLInputObjectFieldValidationMetadata {
    readonly type: string;
    readonly constraints?: ReadonlyArray<any>;
    readonly each?: boolean;
    readonly context?: any;
    readonly options?: any;
}

export namespace GraphQLInputTypes {
    export const PostTopicUpdateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PostTopicUpdateInput',
        fields: [
            {
                name: 'id',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [64],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [1024],
                    },
                ],
            },
            {
                name: 'slug',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [160],
                    },
                ],
            },
        ],
    };

    export const PostTopicCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PostTopicCreateInput',
        fields: [
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [64],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [1024],
                    },
                ],
            },
            {
                name: 'type',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isIn',
                        constraints: [['Principle', 'Idea', 'SupportArticle']],
                    },
                    {
                        type: 'maxLength',
                        constraints: [24],
                    },
                ],
            },
            {
                name: 'slug',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [160],
                    },
                ],
            },
            {
                name: 'parentId',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'position',
                kind: 'scalar',
                type: 'Float',
                required: false,
                validation: [
                    {
                        type: 'isInt',
                    },
                ],
            },
        ],
    };

    export const SupportTicketCommentVisibility: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'SupportTicketCommentVisibility',
        values: ['Public', 'Internal'],
    };

    export const SupportTicketCommentCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'SupportTicketCommentCreateInput',
        fields: [
            {
                name: 'ticketIdentifier',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'content',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'contentType',
                kind: 'enum',
                type: GraphQLInputTypes.RichContentFormat,
                required: false,
            },
            {
                name: 'replyToCommentId',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'visibility',
                kind: 'enum',
                type: GraphQLInputTypes.SupportTicketCommentVisibility,
                required: false,
            },
        ],
    };

    export const SupportTicketCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'SupportTicketCreateInput',
        fields: [
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [256],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'type',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [36],
                    },
                    {
                        type: 'isIn',
                        constraints: [['Contact', 'SupportArticleFeedback']],
                    },
                ],
            },
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
            {
                name: 'initialComment',
                kind: 'object',
                type: GraphQLInputTypes.SupportTicketCommentCreateInput,
                required: false,
            },
        ],
    };

    export const PostStatus: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'PostStatus',
        values: ['Draft', 'Published', 'Deleted'],
    };

    export const PostCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PostCreateInput',
        fields: [
            {
                name: 'status',
                kind: 'enum',
                type: GraphQLInputTypes.PostStatus,
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isEnum',
                        constraints: [
                            { Draft: 'Draft', Published: 'Published', Deleted: 'Deleted' },
                            ['Draft', 'Published', 'Deleted'],
                        ],
                    },
                ],
            },
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [1024],
                    },
                ],
            },
            {
                name: 'type',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isIn',
                        constraints: [['Principle', 'Idea', 'SupportArticle']],
                    },
                    {
                        type: 'maxLength',
                        constraints: [24],
                    },
                ],
            },
            {
                name: 'slug',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [160],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'content',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'contentType',
                kind: 'enum',
                type: GraphQLInputTypes.RichContentFormat,
                required: false,
            },
            {
                name: 'topicIds',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'arrayUnique',
                    },
                    {
                        type: 'isArray',
                    },
                ],
            },
            {
                name: 'allowComment',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowVote',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowDownvote',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowReaction',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'metadata',
                kind: 'scalar',
                type: 'JSON',
                required: false,
            },
        ],
    };

    export const PostVoteType: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'PostVoteType',
        values: ['Upvote', 'Downvote'],
    };

    export const PostReportInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PostReportInput',
        fields: [
            {
                name: 'postId',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'commentId',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'reason',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [256],
                    },
                ],
            },
            {
                name: 'note',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
        ],
    };

    export const RichContentFormat: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'RichContentFormat',
        values: ['Markdown', 'Html', 'PlainText'],
    };

    export const PostUpdateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PostUpdateInput',
        fields: [
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [1024],
                    },
                ],
            },
            {
                name: 'type',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isIn',
                        constraints: [['Principle', 'Idea', 'SupportArticle']],
                    },
                    {
                        type: 'maxLength',
                        constraints: [24],
                    },
                ],
            },
            {
                name: 'slug',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [160],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'content',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'contentType',
                kind: 'enum',
                type: GraphQLInputTypes.RichContentFormat,
                required: false,
            },
            {
                name: 'publishedAt',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
            },
            {
                name: 'allowComment',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowVote',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowDownvote',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'allowReaction',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'metadata',
                kind: 'scalar',
                type: 'JSON',
                required: false,
            },
        ],
    };

    export const EngagementEventContextInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'EngagementEventContextInput',
        fields: [
            {
                name: 'viewIdentifier',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [512],
                    },
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
            {
                name: 'traceId',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isUuid',
                    },
                ],
            },
            {
                name: 'traceSequenceNumber',
                kind: 'scalar',
                type: 'Int',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isInt',
                    },
                ],
            },
            {
                name: 'referrer',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isUrl',
                    },
                    {
                        type: 'maxLength',
                        constraints: [512],
                    },
                ],
            },
            {
                name: 'viewTitle',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isNotEmpty',
                    },
                    {
                        type: 'maxLength',
                        constraints: [512],
                    },
                ],
            },
            {
                name: 'sessionDurationInMilliseconds',
                kind: 'scalar',
                type: 'Int',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isPositive',
                    },
                    {
                        type: 'isInt',
                    },
                ],
            },
            {
                name: 'loggedAt',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isDate',
                    },
                ],
            },
            {
                name: 'additionalData',
                kind: 'scalar',
                type: 'JSON',
                required: false,
            },
        ],
    };

    export const ClientPropertiesInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'ClientPropertiesInput',
        fields: [
            {
                name: 'environment',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [64],
                    },
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
        ],
    };

    export const DeviceOrientation: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'DeviceOrientation',
        values: ['Portrait', 'Landscape', 'NotAvailable'],
    };

    export const DevicePropertiesInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'DevicePropertiesInput',
        fields: [
            {
                name: 'orientation',
                kind: 'enum',
                type: GraphQLInputTypes.DeviceOrientation,
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isEnum',
                        constraints: [
                            { Portrait: 'Portrait', Landscape: 'Landscape', NotAvailable: 'NotAvailable' },
                            ['Portrait', 'Landscape', 'NotAvailable'],
                        ],
                    },
                ],
            },
        ],
    };

    export const CreateEngagementEventInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'CreateEngagementEventInput',
        fields: [
            {
                name: 'name',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [64],
                    },
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
            {
                name: 'category',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [64],
                    },
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
            {
                name: 'deviceProperties',
                kind: 'object',
                type: GraphQLInputTypes.DevicePropertiesInput,
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                ],
            },
            {
                name: 'clientProperties',
                kind: 'object',
                type: GraphQLInputTypes.ClientPropertiesInput,
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                ],
            },
            {
                name: 'eventContext',
                kind: 'object',
                type: GraphQLInputTypes.EngagementEventContextInput,
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                ],
            },
        ],
    };

    export const TimeInterval: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'TimeInterval',
        values: ['Hour', 'HourOfDay', 'Day', 'DayOfWeek', 'DayOfMonth', 'Month', 'MonthOfYear', 'Quarter', 'Year'],
    };

    export const DataInteractionDatabaseTableMetricsQueryInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'DataInteractionDatabaseTableMetricsQueryInput',
        fields: [
            {
                name: 'columnName',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'startTime',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
            },
            {
                name: 'endTime',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
            },
            {
                name: 'timeIntervals',
                kind: 'enum',
                type: GraphQLInputTypes.TimeInterval,
                required: true,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'arrayNotEmpty',
                    },
                    {
                        type: 'isArray',
                    },
                ],
            },
            {
                name: 'tableName',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'databaseName',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
        ],
    };

    export const ColumnFilterGroupOperator: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'ColumnFilterGroupOperator',
        values: ['And', 'Or'],
    };

    export const ColumnFilterGroupInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'ColumnFilterGroupInput',
        fields: [
            {
                name: 'operator',
                kind: 'enum',
                type: GraphQLInputTypes.ColumnFilterGroupOperator,
                required: false,
            },
            {
                name: 'conditions',
                kind: 'object',
                type: GraphQLInputTypes.ColumnFilterInput,
                required: true,
            },
            {
                name: 'filters',
                kind: 'object',
                type: GraphQLInputTypes.ColumnFilterGroupInput,
                required: true,
            },
        ],
    };

    export const ContactListEntryInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'ContactListEntryInput',
        fields: [
            {
                name: 'contactListIdentifier',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [16],
                    },
                ],
            },
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
            {
                name: 'name',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [256],
                    },
                ],
            },
        ],
    };

    export const AccountPasswordUpdateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountPasswordUpdateInput',
        fields: [
            {
                name: 'newPassword',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
        ],
    };

    export const AccountProfileUpdateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountProfileUpdateInput',
        fields: [
            {
                name: 'username',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isLength',
                        constraints: [3, 32],
                    },
                    {
                        type: 'isString',
                    },
                ],
            },
            {
                name: 'displayName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
            {
                name: 'givenName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
            {
                name: 'familyName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
            {
                name: 'middleName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
            {
                name: 'preferredName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
            {
                name: 'phoneNumber',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'IsPhoneNumberLite',
                        constraints: [{}],
                    },
                ],
            },
            {
                name: 'birthday',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isDate',
                    },
                ],
            },
            {
                name: 'gender',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [32],
                    },
                ],
            },
        ],
    };

    export const AccessRoleAssignmentRevokeInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccessRoleAssignmentRevokeInput',
        fields: [
            {
                name: 'accessRole',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
            {
                name: 'username',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
        ],
    };

    export const AccessRoleStatus: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'AccessRoleStatus',
        values: ['Active', 'Expired', 'Revoked'],
    };

    export const AccountDeleteInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountDeleteInput',
        fields: [
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
            {
                name: 'reason',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isNotEmpty',
                    },
                    {
                        type: 'maxLength',
                        constraints: [128],
                    },
                ],
            },
        ],
    };

    export const OrderByDirection: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'OrderByDirection',
        values: ['Ascending', 'Descending'],
    };

    export const OrderByInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'OrderByInput',
        fields: [
            {
                name: 'key',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'direction',
                kind: 'enum',
                type: GraphQLInputTypes.OrderByDirection,
                required: false,
            },
        ],
    };

    export const ColumnFilterConditionOperator: GraphQLInputEnumTypeMetadata = {
        kind: 'enum',
        type: 'ColumnFilterConditionOperator',
        values: [
            'Equal',
            'NotEqual',
            'GreaterThan',
            'GreaterThanOrEqual',
            'LessThan',
            'LessThanOrEqual',
            'Like',
            'NotLike',
            'In',
            'NotIn',
            'IsNull',
            'IsNotNull',
        ],
    };

    export const ColumnFilterInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'ColumnFilterInput',
        fields: [
            {
                name: 'operator',
                kind: 'enum',
                type: GraphQLInputTypes.ColumnFilterConditionOperator,
                required: true,
            },
            {
                name: 'caseSensitive',
                kind: 'scalar',
                type: 'Boolean',
                required: false,
            },
            {
                name: 'column',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'value',
                kind: 'scalar',
                type: 'JSON',
                required: true,
            },
        ],
    };

    export const PaginationInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'PaginationInput',
        fields: [
            {
                name: 'itemsPerPage',
                kind: 'scalar',
                type: 'Int',
                required: true,
            },
            {
                name: 'itemIndex',
                kind: 'scalar',
                type: 'Int',
                required: false,
            },
            {
                name: 'filters',
                kind: 'object',
                type: GraphQLInputTypes.ColumnFilterInput,
                required: true,
            },
            {
                name: 'orderBy',
                kind: 'object',
                type: GraphQLInputTypes.OrderByInput,
                required: true,
            },
        ],
    };

    export const ContactListCreationInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'ContactListCreationInput',
        fields: [
            {
                name: 'identifier',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [16],
                    },
                ],
            },
            {
                name: 'title',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'maxLength',
                        constraints: [256],
                    },
                ],
            },
            {
                name: 'description',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'maxLength',
                        constraints: [512],
                    },
                ],
            },
        ],
    };

    export const AccountEmailVerificationVerifyInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountEmailVerificationVerifyInput',
        fields: [
            {
                name: 'code',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
        ],
    };

    export const AccountPasswordVerifyInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountPasswordVerifyInput',
        fields: [
            {
                name: 'password',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isNotEmpty',
                    },
                ],
            },
        ],
    };

    export const AccountRegistrationOrSignInCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountRegistrationOrSignInCreateInput',
        fields: [
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
        ],
    };

    export const AccountEncryptionConfiguration: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountEncryptionConfiguration',
        fields: [
            {
                name: 'transitKeyId',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'publicKey',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
        ],
    };

    export const AccountRegistrationCompleteInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountRegistrationCompleteInput',
        fields: [
            {
                name: 'password',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'minLength',
                        constraints: [8],
                    },
                    {
                        type: 'maxLength',
                        constraints: [90],
                    },
                ],
            },
            {
                name: 'username',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isLength',
                        constraints: [3, 32],
                    },
                ],
            },
            {
                name: 'displayName',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'isLength',
                        constraints: [3, 32],
                    },
                ],
            },
            {
                name: 'givenName',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'familyName',
                kind: 'scalar',
                type: 'String',
                required: false,
            },
            {
                name: 'phoneNumber',
                kind: 'scalar',
                type: 'String',
                required: false,
                validation: [
                    {
                        type: 'isOptional',
                    },
                    {
                        type: 'IsPhoneNumberLite',
                        constraints: [{}],
                    },
                ],
            },
            {
                name: 'encryptionConfiguration',
                kind: 'object',
                type: GraphQLInputTypes.AccountEncryptionConfiguration,
                required: false,
            },
        ],
    };

    export const AccessRoleAssignmentCreateInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccessRoleAssignmentCreateInput',
        fields: [
            {
                name: 'expiresAt',
                kind: 'scalar',
                type: 'DateTimeISO',
                required: false,
            },
            {
                name: 'accessRole',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
            {
                name: 'username',
                kind: 'scalar',
                type: 'String',
                required: true,
            },
        ],
    };

    export const AccountInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'AccountInput',
        fields: [
            {
                name: 'emailAddress',
                kind: 'scalar',
                type: 'String',
                required: true,
                validation: [
                    {
                        type: 'isEmail',
                    },
                ],
            },
        ],
    };
}

export interface GraphQLOperationMetadata<DocumentType> {
    readonly operation: string;
    readonly operationType: 'query' | 'mutation' | 'subscription';
    readonly document: DocumentType;
    readonly parameters?: ReadonlyArray<GraphQLOperationParameterMetadata>;
}

export type GraphQLOperationParameterMetadata =
    | GraphQLOperationScalarParameterMetadata
    | GraphQLOperationUnitParameterMetadata
    | GraphQLOperationListParameterMetadata
    | GraphQLOperationScalarListParameterMetadata;

interface BaseGraphQLOperationParameterMetadata {
    readonly parameter: string;
    readonly required: boolean;
}

export interface GraphQLOperationScalarParameterMetadata extends BaseGraphQLOperationParameterMetadata {
    readonly kind: 'scalar';
    readonly type: string;
}

export interface GraphQLOperationUnitParameterMetadata extends BaseGraphQLOperationParameterMetadata {
    readonly kind: 'enum' | 'object';
    readonly type: GraphQLInputTypeMetadata;
}

interface BaseGraphQLOperationListParameterMetadata extends BaseGraphQLOperationParameterMetadata {
    readonly kind: 'list';
    readonly allowsEmpty: boolean;
}

export interface GraphQLOperationListParameterMetadata extends BaseGraphQLOperationListParameterMetadata {
    readonly itemKind: 'enum' | 'object';
    readonly type: GraphQLInputTypeMetadata;
}

export interface GraphQLOperationScalarListParameterMetadata extends BaseGraphQLOperationListParameterMetadata {
    readonly itemKind: 'scalar';
    readonly type: string;
}

export const AccountPrivilegedOperation: GraphQLOperationMetadata<typeof AccountPrivilegedDocument> = {
    operation: 'AccountPrivileged',
    operationType: 'query',
    document: AccountPrivilegedDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountInput,
        },
    ],
};

export const AccountAccessRoleAssignmentCreatePrivilegedOperation: GraphQLOperationMetadata<
    typeof AccountAccessRoleAssignmentCreatePrivilegedDocument
> = {
    operation: 'AccountAccessRoleAssignmentCreatePrivileged',
    operationType: 'mutation',
    document: AccountAccessRoleAssignmentCreatePrivilegedDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccessRoleAssignmentCreateInput,
        },
    ],
};

export const AccountAuthenticationRegistrationCompleteOperation: GraphQLOperationMetadata<
    typeof AccountAuthenticationRegistrationCompleteDocument
> = {
    operation: 'AccountAuthenticationRegistrationComplete',
    operationType: 'mutation',
    document: AccountAuthenticationRegistrationCompleteDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountRegistrationCompleteInput,
        },
    ],
};

export const AccountAuthenticationRegistrationOrSignInCreateOperation: GraphQLOperationMetadata<
    typeof AccountAuthenticationRegistrationOrSignInCreateDocument
> = {
    operation: 'AccountAuthenticationRegistrationOrSignInCreate',
    operationType: 'mutation',
    document: AccountAuthenticationRegistrationOrSignInCreateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountRegistrationOrSignInCreateInput,
        },
    ],
};

export const AccountAuthenticationPasswordVerifyOperation: GraphQLOperationMetadata<
    typeof AccountAuthenticationPasswordVerifyDocument
> = {
    operation: 'AccountAuthenticationPasswordVerify',
    operationType: 'mutation',
    document: AccountAuthenticationPasswordVerifyDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountPasswordVerifyInput,
        },
    ],
};

export const AccountAuthenticationEmailVerificationVerifyOperation: GraphQLOperationMetadata<
    typeof AccountAuthenticationEmailVerificationVerifyDocument
> = {
    operation: 'AccountAuthenticationEmailVerificationVerify',
    operationType: 'mutation',
    document: AccountAuthenticationEmailVerificationVerifyDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountEmailVerificationVerifyInput,
        },
    ],
};

export const ContactListCreatePrivilegedOperation: GraphQLOperationMetadata<
    typeof ContactListCreatePrivilegedDocument
> = {
    operation: 'ContactListCreatePrivileged',
    operationType: 'mutation',
    document: ContactListCreatePrivilegedDocument,
    parameters: [
        {
            parameter: 'data',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.ContactListCreationInput,
        },
    ],
};

export const ContactListsPrivilegedOperation: GraphQLOperationMetadata<typeof ContactListsPrivilegedDocument> = {
    operation: 'ContactListsPrivileged',
    operationType: 'query',
    document: ContactListsPrivilegedDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const AccountsPrivilegedOperation: GraphQLOperationMetadata<typeof AccountsPrivilegedDocument> = {
    operation: 'AccountsPrivileged',
    operationType: 'query',
    document: AccountsPrivilegedDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const AccountDeletePrivilegedOperation: GraphQLOperationMetadata<typeof AccountDeletePrivilegedDocument> = {
    operation: 'AccountDeletePrivileged',
    operationType: 'mutation',
    document: AccountDeletePrivilegedDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountDeleteInput,
        },
    ],
};

export const AccountAccessRoleAssignmentsPrivilegedOperation: GraphQLOperationMetadata<
    typeof AccountAccessRoleAssignmentsPrivilegedDocument
> = {
    operation: 'AccountAccessRoleAssignmentsPrivileged',
    operationType: 'query',
    document: AccountAccessRoleAssignmentsPrivilegedDocument,
    parameters: [
        {
            parameter: 'statuses',
            required: true,
            kind: 'list',
            itemKind: 'enum',
            type: GraphQLInputTypes.AccessRoleStatus,
            allowsEmpty: false,
        },
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const AccountAccessRoleAssignmentRevokePrivilegedOperation: GraphQLOperationMetadata<
    typeof AccountAccessRoleAssignmentRevokePrivilegedDocument
> = {
    operation: 'AccountAccessRoleAssignmentRevokePrivileged',
    operationType: 'mutation',
    document: AccountAccessRoleAssignmentRevokePrivilegedDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccessRoleAssignmentRevokeInput,
        },
    ],
};

export const AccountProfileUpdateOperation: GraphQLOperationMetadata<typeof AccountProfileUpdateDocument> = {
    operation: 'AccountProfileUpdate',
    operationType: 'mutation',
    document: AccountProfileUpdateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountProfileUpdateInput,
        },
    ],
};

export const AccountProfileUsernameValidateOperation: GraphQLOperationMetadata<
    typeof AccountProfileUsernameValidateDocument
> = {
    operation: 'AccountProfileUsernameValidate',
    operationType: 'query',
    document: AccountProfileUsernameValidateDocument,
    parameters: [
        {
            parameter: 'username',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const AccountPasswordUpdateOperation: GraphQLOperationMetadata<typeof AccountPasswordUpdateDocument> = {
    operation: 'AccountPasswordUpdate',
    operationType: 'mutation',
    document: AccountPasswordUpdateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.AccountPasswordUpdateInput,
        },
    ],
};

export const AccountDeleteOperation: GraphQLOperationMetadata<typeof AccountDeleteDocument> = {
    operation: 'AccountDelete',
    operationType: 'mutation',
    document: AccountDeleteDocument,
    parameters: [
        {
            parameter: 'reason',
            required: false,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const AccountProfilePublicOperation: GraphQLOperationMetadata<typeof AccountProfilePublicDocument> = {
    operation: 'AccountProfilePublic',
    operationType: 'query',
    document: AccountProfilePublicDocument,
    parameters: [
        {
            parameter: 'username',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const ContactListEntryCreateOperation: GraphQLOperationMetadata<typeof ContactListEntryCreateDocument> = {
    operation: 'ContactListEntryCreate',
    operationType: 'mutation',
    document: ContactListEntryCreateDocument,
    parameters: [
        {
            parameter: 'data',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.ContactListEntryInput,
        },
    ],
};

export const DataInteractionDatabaseTableRowsOperation: GraphQLOperationMetadata<
    typeof DataInteractionDatabaseTableRowsDocument
> = {
    operation: 'DataInteractionDatabaseTableRows',
    operationType: 'query',
    document: DataInteractionDatabaseTableRowsDocument,
    parameters: [
        {
            parameter: 'databaseName',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'tableName',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
        {
            parameter: 'filters',
            required: false,
            kind: 'object',
            type: GraphQLInputTypes.ColumnFilterGroupInput,
        },
    ],
};

export const DataInteractionDatabaseTableMetricsOperation: GraphQLOperationMetadata<
    typeof DataInteractionDatabaseTableMetricsDocument
> = {
    operation: 'DataInteractionDatabaseTableMetrics',
    operationType: 'query',
    document: DataInteractionDatabaseTableMetricsDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.DataInteractionDatabaseTableMetricsQueryInput,
        },
    ],
};

export const DataInteractionDatabaseTableOperation: GraphQLOperationMetadata<
    typeof DataInteractionDatabaseTableDocument
> = {
    operation: 'DataInteractionDatabaseTable',
    operationType: 'query',
    document: DataInteractionDatabaseTableDocument,
    parameters: [
        {
            parameter: 'databaseName',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'tableName',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const DataInteractionDatabaseTablesOperation: GraphQLOperationMetadata<
    typeof DataInteractionDatabaseTablesDocument
> = {
    operation: 'DataInteractionDatabaseTables',
    operationType: 'query',
    document: DataInteractionDatabaseTablesDocument,
    parameters: [
        {
            parameter: 'databaseName',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const DataInteractionDatabasesOperation: GraphQLOperationMetadata<typeof DataInteractionDatabasesDocument> = {
    operation: 'DataInteractionDatabases',
    operationType: 'query',
    document: DataInteractionDatabasesDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const EngagementEventsCreateOperation: GraphQLOperationMetadata<typeof EngagementEventsCreateDocument> = {
    operation: 'EngagementEventsCreate',
    operationType: 'mutation',
    document: EngagementEventsCreateDocument,
    parameters: [
        {
            parameter: 'inputs',
            required: true,
            kind: 'list',
            itemKind: 'object',
            type: GraphQLInputTypes.CreateEngagementEventInput,
            allowsEmpty: false,
        },
    ],
};

export const PostDeleteOperation: GraphQLOperationMetadata<typeof PostDeleteDocument> = {
    operation: 'PostDelete',
    operationType: 'mutation',
    document: PostDeleteDocument,
    parameters: [
        {
            parameter: 'id',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostByIdentifierOperation: GraphQLOperationMetadata<typeof PostByIdentifierDocument> = {
    operation: 'PostByIdentifier',
    operationType: 'query',
    document: PostByIdentifierDocument,
    parameters: [
        {
            parameter: 'identifier',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostTopicDeleteOperation: GraphQLOperationMetadata<typeof PostTopicDeleteDocument> = {
    operation: 'PostTopicDelete',
    operationType: 'mutation',
    document: PostTopicDeleteDocument,
    parameters: [
        {
            parameter: 'id',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostUpdateOperation: GraphQLOperationMetadata<typeof PostUpdateDocument> = {
    operation: 'PostUpdate',
    operationType: 'mutation',
    document: PostUpdateDocument,
    parameters: [
        {
            parameter: 'id',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PostUpdateInput,
        },
    ],
};

export const PostReactionCreateOperation: GraphQLOperationMetadata<typeof PostReactionCreateDocument> = {
    operation: 'PostReactionCreate',
    operationType: 'mutation',
    document: PostReactionCreateDocument,
    parameters: [
        {
            parameter: 'postId',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'content',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostReportCreateOperation: GraphQLOperationMetadata<typeof PostReportCreateDocument> = {
    operation: 'PostReportCreate',
    operationType: 'mutation',
    document: PostReportCreateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PostReportInput,
        },
    ],
};

export const PostVoteOperation: GraphQLOperationMetadata<typeof PostVoteDocument> = {
    operation: 'PostVote',
    operationType: 'mutation',
    document: PostVoteDocument,
    parameters: [
        {
            parameter: 'postId',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'type',
            required: true,
            kind: 'enum',
            type: GraphQLInputTypes.PostVoteType,
        },
    ],
};

export const PostUnvoteOperation: GraphQLOperationMetadata<typeof PostUnvoteDocument> = {
    operation: 'PostUnvote',
    operationType: 'mutation',
    document: PostUnvoteDocument,
    parameters: [
        {
            parameter: 'postId',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostReactionProfilesOperation: GraphQLOperationMetadata<typeof PostReactionProfilesDocument> = {
    operation: 'PostReactionProfiles',
    operationType: 'query',
    document: PostReactionProfilesDocument,
    parameters: [
        {
            parameter: 'postId',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'content',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const PostReactionDeleteOperation: GraphQLOperationMetadata<typeof PostReactionDeleteDocument> = {
    operation: 'PostReactionDelete',
    operationType: 'mutation',
    document: PostReactionDeleteDocument,
    parameters: [
        {
            parameter: 'postId',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'content',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostOperation: GraphQLOperationMetadata<typeof PostDocument> = {
    operation: 'Post',
    operationType: 'query',
    document: PostDocument,
    parameters: [
        {
            parameter: 'id',
            required: false,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'slug',
            required: false,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'identifier',
            required: false,
            kind: 'scalar',
            type: 'String',
        },
    ],
};

export const PostsOperation: GraphQLOperationMetadata<typeof PostsDocument> = {
    operation: 'Posts',
    operationType: 'query',
    document: PostsDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};

export const PostCreateOperation: GraphQLOperationMetadata<typeof PostCreateDocument> = {
    operation: 'PostCreate',
    operationType: 'mutation',
    document: PostCreateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PostCreateInput,
        },
    ],
};

export const SupportTicketCreateOperation: GraphQLOperationMetadata<typeof SupportTicketCreateDocument> = {
    operation: 'SupportTicketCreate',
    operationType: 'mutation',
    document: SupportTicketCreateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.SupportTicketCreateInput,
        },
    ],
};

export const PostTopicCreateOperation: GraphQLOperationMetadata<typeof PostTopicCreateDocument> = {
    operation: 'PostTopicCreate',
    operationType: 'mutation',
    document: PostTopicCreateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PostTopicCreateInput,
        },
    ],
};

export const PostTopicUpdateOperation: GraphQLOperationMetadata<typeof PostTopicUpdateDocument> = {
    operation: 'PostTopicUpdate',
    operationType: 'mutation',
    document: PostTopicUpdateDocument,
    parameters: [
        {
            parameter: 'input',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PostTopicUpdateInput,
        },
    ],
};

export const PostTopicByIdOperation: GraphQLOperationMetadata<typeof PostTopicByIdDocument> = {
    operation: 'PostTopicById',
    operationType: 'query',
    document: PostTopicByIdDocument,
    parameters: [
        {
            parameter: 'id',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
    ],
};
