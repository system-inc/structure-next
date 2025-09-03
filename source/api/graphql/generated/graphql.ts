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
    /** Decimal custom scalar type */
    Decimal: { input: any; output: any };
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: { input: any; output: any };
    /** Monetary decimal custom scalar type, we stored and operate the value in cents, and this scalar will convert the value to dollar when read and convert the value to cents when write. */
    MonetaryDecimal: { input: any; output: any };
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
    accessRole: AccessRole;
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

export type AppleStoreTransactionOrderMapping = {
    __typename?: 'AppleStoreTransactionOrderMapping';
    commerceOrder: CommerceOrder;
    commerceOrderId: Scalars['String']['output'];
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    transactionId: Scalars['String']['output'];
};

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

export type AvailableMetadata = {
    __typename?: 'AvailableMetadata';
    dataType: Scalars['String']['output'];
    key: Scalars['String']['output'];
};

export type AvailableMetadataInput = {
    dataType: Scalars['String']['input'];
    key: Scalars['String']['input'];
};

export type CampaignDeliveryStage = {
    __typename?: 'CampaignDeliveryStage';
    completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    emailTemplateContentId?: Maybe<Scalars['String']['output']>;
    emailTemplateId?: Maybe<Scalars['String']['output']>;
    emailsSent?: Maybe<Scalars['Int']['output']>;
    indexId: Scalars['Int']['output'];
    percentSent?: Maybe<Scalars['Int']['output']>;
    percentToSend: Scalars['Int']['output'];
    stageStatus: CampaignDeliveryStageStatus;
    startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

/** The status of the delivery stage */
export enum CampaignDeliveryStageStatus {
    Complete = 'Complete',
    InProgress = 'InProgress',
    NotStarted = 'NotStarted',
    PausingForError = 'PausingForError',
}

export type CheckoutSessionCreateDirectItemInput = {
    productVariantId: Scalars['String']['input'];
    quantity: Scalars['Int']['input'];
};

export type ClientPropertiesInput = {
    environment?: InputMaybe<Scalars['String']['input']>;
};

export type ColumnFilter = {
    caseSensitive?: InputMaybe<Scalars['Boolean']['input']>;
    column: Scalars['String']['input'];
    operator: ColumnFilterConditionOperator;
    value: Scalars['JSON']['input'];
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

export type CommerceCheckoutSession = {
    __typename?: 'CommerceCheckoutSession';
    appliedDiscounts?: Maybe<Array<CommerceOrderDiscount>>;
    closedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    externalMetadata?: Maybe<Scalars['JSON']['output']>;
    failedCount: Scalars['Float']['output'];
    id: Scalars['String']['output'];
    order?: Maybe<CommerceOrder>;
    orderMetadata?: Maybe<Scalars['JSON']['output']>;
    paymentProcessorType: PaymentProcessorType;
    priceInfo?: Maybe<CommerceOrderPrice>;
    status: CommerceCheckoutSessionStatus;
};

export type CommerceCheckoutSessionCreateDirectInput = {
    emailAddress?: InputMaybe<Scalars['String']['input']>;
    items: Array<CheckoutSessionCreateDirectItemInput>;
    orderMetadata?: InputMaybe<Scalars['JSON']['input']>;
    paymentProcessorType?: PaymentProcessorType;
    returnBaseUrl: Scalars['String']['input'];
};

export enum CommerceCheckoutSessionStatus {
    Closed = 'Closed',
    Complete = 'Complete',
    Expired = 'Expired',
    Failed = 'Failed',
    Pending = 'Pending',
}

export type CommerceOrder = {
    __typename?: 'CommerceOrder';
    appliedDiscounts?: Maybe<Array<CommerceOrderDiscount>>;
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    fulfillmentSource?: Maybe<Scalars['String']['output']>;
    fulfillmentStatus: CommerceOrderFulfillmentStatus;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    lineItems?: Maybe<Array<CommerceOrderLineItem>>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    payment?: Maybe<Payment>;
    paymentStatus?: Maybe<PaymentStatus>;
    priceInfo: CommerceOrderPrice;
    refunds?: Maybe<Array<Refund>>;
    shipments?: Maybe<Array<Shipment>>;
    shippingInfo?: Maybe<CommerceOrderShippingInfo>;
    source: Scalars['String']['output'];
    status: CommerceOrderStatus;
    statusRecords?: Maybe<Array<StatusRecord>>;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type CommerceOrderDiscount = {
    __typename?: 'CommerceOrderDiscount';
    amount: Scalars['MonetaryDecimal']['output'];
    code?: Maybe<Scalars['String']['output']>;
    colorOption?: Maybe<LabelColorOption>;
    iconAlt?: Maybe<Scalars['String']['output']>;
    iconUrl?: Maybe<Scalars['String']['output']>;
    items?: Maybe<Array<CommerceOrderLineItemDiscount>>;
};

/** The fulfillment status of the order */
export enum CommerceOrderFulfillmentStatus {
    Cancelled = 'Cancelled',
    Fulfilled = 'Fulfilled',
    NotStart = 'NotStart',
    PartiallyFulfilled = 'PartiallyFulfilled',
    Shipped = 'Shipped',
    Unfulfilled = 'Unfulfilled',
}

export type CommerceOrderLineItem = {
    __typename?: 'CommerceOrderLineItem';
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    indexId: Scalars['Int']['output'];
    originalQuantity?: Maybe<Scalars['Int']['output']>;
    productVariantId: Scalars['String']['output'];
    quantity: Scalars['Int']['output'];
    status: CommerceOrderLineItemStatus;
    statusRecords?: Maybe<Array<StatusRecord>>;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type CommerceOrderLineItemDiscount = {
    __typename?: 'CommerceOrderLineItemDiscount';
    amount: Scalars['MonetaryDecimal']['output'];
    indexId: Scalars['Int']['output'];
    unitAmount?: Maybe<Scalars['MonetaryDecimal']['output']>;
};

export type CommerceOrderLineItemPrice = {
    __typename?: 'CommerceOrderLineItemPrice';
    indexId: Scalars['Int']['output'];
    originalSubtotal: Scalars['MonetaryDecimal']['output'];
    originalUnitPrice?: Maybe<Scalars['MonetaryDecimal']['output']>;
    subtotal: Scalars['MonetaryDecimal']['output'];
    unitPrice?: Maybe<Scalars['MonetaryDecimal']['output']>;
};

/** The status of the order line item */
export enum CommerceOrderLineItemStatus {
    Cancelled = 'Cancelled',
    Pending = 'Pending',
    Shipped = 'Shipped',
}

export type CommerceOrderPrice = {
    __typename?: 'CommerceOrderPrice';
    amount: Scalars['MonetaryDecimal']['output'];
    currencyCode: Scalars['String']['output'];
    lineItemPrices: Array<CommerceOrderLineItemPrice>;
    originalSubtotal: Scalars['MonetaryDecimal']['output'];
    shippingRate: CommerceOrderShippingRate;
    subtotal: Scalars['MonetaryDecimal']['output'];
    tax: CommerceOrderTax;
};

export type CommerceOrderResult = CommerceOrder | PublicCommerceOrder;

export type CommerceOrderShippingInfo = {
    __typename?: 'CommerceOrderShippingInfo';
    shippingAddress: StreetAddressObject;
};

export type CommerceOrderShippingRate = {
    __typename?: 'CommerceOrderShippingRate';
    amount: Scalars['MonetaryDecimal']['output'];
    originalAmount: Scalars['MonetaryDecimal']['output'];
};

/** The status of the order */
export enum CommerceOrderStatus {
    Cancelled = 'Cancelled',
    Complete = 'Complete',
    Open = 'Open',
    OutOfStock = 'OutOfStock',
    Pending = 'Pending',
    Refunded = 'Refunded',
    WaitPayment = 'WaitPayment',
}

export type CommerceOrderTax = {
    __typename?: 'CommerceOrderTax';
    shipping: Scalars['MonetaryDecimal']['output'];
    total: Scalars['MonetaryDecimal']['output'];
};

export type Contact = {
    __typename?: 'Contact';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    fields?: Maybe<Array<ContactField>>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    name: Scalars['String']['output'];
    note?: Maybe<Scalars['String']['output']>;
    source: Scalars['String']['output'];
    type: ContactType;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type ContactCreateInput = {
    fields?: InputMaybe<Array<ContactFieldCreateInput>>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    name: Scalars['String']['input'];
    note?: InputMaybe<Scalars['String']['input']>;
    source: Scalars['String']['input'];
    type: ContactType;
};

export type ContactField = {
    __typename?: 'ContactField';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    label?: Maybe<Scalars['String']['output']>;
    type: ContactFieldType;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
    value: Scalars['JSON']['output'];
};

export type ContactFieldCreateInput = {
    label?: InputMaybe<Scalars['String']['input']>;
    type: ContactFieldType;
    value: Scalars['JSON']['input'];
};

/** Type of contact field */
export enum ContactFieldType {
    EmailAddress = 'EmailAddress',
    PhoneNumber = 'PhoneNumber',
    StreetAddress = 'StreetAddress',
}

export type ContactFieldUpdateInput = {
    action: ListEntryAction;
    id?: InputMaybe<Scalars['String']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<ContactFieldType>;
    value?: InputMaybe<Scalars['JSON']['input']>;
};

/** Type of contact */
export enum ContactType {
    Company = 'Company',
    Person = 'Person',
}

export type ContactUpdateInput = {
    id: Scalars['String']['input'];
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    note?: InputMaybe<Scalars['String']['input']>;
    source?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEmailListEntryInput = {
    emailAddress: Scalars['String']['input'];
    familyName?: InputMaybe<Scalars['String']['input']>;
    givenName?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateEmailListInput = {
    entries: Array<CreateEmailListEntryInput>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    title: Scalars['String']['input'];
};

export type CreateEmailTemplateContentInput = {
    body: Scalars['String']['input'];
    contentFormat?: InputMaybe<EmailContentFormat>;
    languageCode?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<EmailTemplateMetadataInput>;
    notes?: InputMaybe<Scalars['String']['input']>;
    subject: Scalars['String']['input'];
};

export type CreateEmailTemplateInput = {
    alias?: InputMaybe<Scalars['String']['input']>;
    connectToAutomationKey?: InputMaybe<Scalars['String']['input']>;
    content: CreateEmailTemplateContentInput;
    description?: InputMaybe<Scalars['String']['input']>;
    title: Scalars['String']['input'];
};

export type CreateEngagementEventInput = {
    category?: InputMaybe<Scalars['String']['input']>;
    clientProperties?: InputMaybe<ClientPropertiesInput>;
    deviceProperties?: InputMaybe<DevicePropertiesInput>;
    eventContext?: InputMaybe<EngagementEventContextInput>;
    name: Scalars['String']['input'];
};

export type CreateFulfillmentInput = {
    baseUrl: Scalars['String']['input'];
    items: Array<CreateFulfillmentItemInput>;
    orderIdentifier: Scalars['String']['input'];
    originAddress: StreetAddressInput;
    trackingInfo: CreateFulfillmentTrackingInfoInput;
};

export type CreateFulfillmentItemInput = {
    id: Scalars['Float']['input'];
    quantity: Scalars['Float']['input'];
};

export type CreateFulfillmentTrackingInfoInput = {
    company: Scalars['String']['input'];
    number: Scalars['String']['input'];
    serviceType: ShippingServiceType;
    url: Scalars['String']['input'];
};

export type CreateOrderRefundInput = {
    lineItems: Array<CreateOrderRefundLineItemInput>;
    orderId: Scalars['String']['input'];
    reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrderRefundLineItemInput = {
    orderLineItemId: Scalars['Float']['input'];
    quantity: Scalars['Float']['input'];
};

export type CreateProductInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
    status?: InputMaybe<ProductStatus>;
    variants: Array<CreateProductVariantInput>;
    vendorId: Scalars['String']['input'];
};

export type CreateProductVariantInput = {
    attributes?: InputMaybe<Array<ProductVariantAttributeInput>>;
    barcode?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    gtin?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    inventoryPolicy?: InputMaybe<ProductVariantInventoryPolicy>;
    isVirtual?: InputMaybe<Scalars['Boolean']['input']>;
    name: Scalars['String']['input'];
    position?: InputMaybe<Scalars['Float']['input']>;
    price: ProductVariantPriceInput;
    productId?: InputMaybe<Scalars['String']['input']>;
    setDefault?: InputMaybe<Scalars['Boolean']['input']>;
    sku?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<ProductVariantStatus>;
    taxCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
};

export enum CreditCardType {
    Amex = 'Amex',
    Discover = 'Discover',
    Mastercard = 'Mastercard',
    Unknown = 'Unknown',
    Visa = 'Visa',
}

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

export type DatebaseMetadata = {
    __typename?: 'DatebaseMetadata';
    databaseName: Scalars['String']['output'];
};

/** The status of the delivery */
export enum DeliveryStatus {
    AttemptedDelivery = 'AttemptedDelivery',
    Delivered = 'Delivered',
    InTransit = 'InTransit',
    OutForDelivery = 'OutForDelivery',
    ReadyForPickup = 'ReadyForPickup',
}

export enum DeviceOrientation {
    Landscape = 'Landscape',
    NotAvailable = 'NotAvailable',
    Portrait = 'Portrait',
}

export type DevicePropertiesInput = {
    orientation?: InputMaybe<DeviceOrientation>;
};

export type DiscordWebhookMessageCreateEmbedInput = {
    authorName?: InputMaybe<Scalars['String']['input']>;
    color?: InputMaybe<Scalars['Int']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    timestamp?: InputMaybe<Scalars['DateTimeISO']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
    url?: InputMaybe<Scalars['String']['input']>;
};

export type DiscordWebhookMessageCreateInput = {
    content?: InputMaybe<Scalars['String']['input']>;
    embeds?: InputMaybe<Array<DiscordWebhookMessageCreateEmbedInput>>;
    token: Scalars['String']['input'];
    username?: InputMaybe<Scalars['String']['input']>;
    webhookId: Scalars['String']['input'];
};

export type EmailAutomation = {
    __typename?: 'EmailAutomation';
    automationKey: Scalars['String']['output'];
    availableMetadata?: Maybe<Array<AvailableMetadata>>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    emailTemplate?: Maybe<EmailTemplate>;
    emailTemplateId?: Maybe<Scalars['String']['output']>;
    fromEmail: Scalars['String']['output'];
    fromName: Scalars['String']['output'];
    id: Scalars['String']['output'];
    subject: Scalars['String']['output'];
    type: EmailAutomationType;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EmailAutomationResult = {
    __typename?: 'EmailAutomationResult';
    items: Array<EmailAutomation>;
    pagination?: Maybe<Pagination>;
};

/** Email automation type */
export enum EmailAutomationType {
    BuiltIn = 'BuiltIn',
    Custom = 'Custom',
}

export type EmailCampaign = {
    __typename?: 'EmailCampaign';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    currentStageIndexId: Scalars['Int']['output'];
    deliveryStages: Array<CampaignDeliveryStage>;
    description?: Maybe<Scalars['String']['output']>;
    fromEmail: Scalars['String']['output'];
    fromName: Scalars['String']['output'];
    id: Scalars['String']['output'];
    pagedEmailAddresses?: Maybe<PagedEmailCampaignEmailAddress>;
    status: EmailCampaignStatus;
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EmailCampaignPagedEmailAddressesArgs = {
    pagination?: InputMaybe<PaginationInput>;
};

export type EmailCampaignCreateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    emailAddressInputs?: InputMaybe<Array<EmailCampaignEmailAddressInput>>;
    emailListInputs?: InputMaybe<Array<EmailCampaignEmailListInput>>;
    emailTemplateContentId?: InputMaybe<Scalars['String']['input']>;
    emailTemplateId?: InputMaybe<Scalars['String']['input']>;
    fromEmail: Scalars['String']['input'];
    fromName: Scalars['String']['input'];
    stageInputs: Array<EmailCampaignStageInput>;
    title: Scalars['String']['input'];
};

export type EmailCampaignEmailAddress = {
    __typename?: 'EmailCampaignEmailAddress';
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    emailContent?: Maybe<EmailCampaignEmailContent>;
    id: Scalars['String']['output'];
    presetSendStage?: Maybe<Scalars['Int']['output']>;
    sendAttempts?: Maybe<Scalars['Int']['output']>;
    sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
    sentStage?: Maybe<Scalars['Int']['output']>;
    status: EmailCampaignEmailAddressStatus;
    statusDescription?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type EmailCampaignEmailAddressInput = {
    emailAddress: Scalars['String']['input'];
    presetSendStage?: InputMaybe<Scalars['Int']['input']>;
};

/** The status of an email address in an email campaign */
export enum EmailCampaignEmailAddressStatus {
    Pending = 'Pending',
    PermanentFailure = 'PermanentFailure',
    SendFailed = 'SendFailed',
    Sent = 'Sent',
}

export type EmailCampaignEmailAddressUpdateInput = {
    action: ListEntryAction;
    emailAddress: Scalars['String']['input'];
    presetSendStage?: InputMaybe<Scalars['Int']['input']>;
};

export type EmailCampaignEmailContent = {
    __typename?: 'EmailCampaignEmailContent';
    content: Scalars['String']['output'];
    contentFormat: EmailContentFormat;
    fromEmailAddress: Scalars['String']['output'];
    fromName: Scalars['String']['output'];
    subject: Scalars['String']['output'];
};

export type EmailCampaignEmailListInput = {
    emailListId: Scalars['String']['input'];
    presetSendStage?: InputMaybe<Scalars['Int']['input']>;
};

export type EmailCampaignStageInput = {
    emailTemplateContentId?: InputMaybe<Scalars['String']['input']>;
    emailTemplateId?: InputMaybe<Scalars['String']['input']>;
    indexId: Scalars['Int']['input'];
    percentToSend: Scalars['Int']['input'];
};

export type EmailCampaignStageUpdateInput = {
    action: ListEntryAction;
    emailTemplateContentId?: InputMaybe<Scalars['String']['input']>;
    emailTemplateId?: InputMaybe<Scalars['String']['input']>;
    indexId: Scalars['Int']['input'];
    percentToSend?: InputMaybe<Scalars['Int']['input']>;
};

/** The status of the email campaign */
export enum EmailCampaignStatus {
    Active = 'Active',
    Archive = 'Archive',
    Complete = 'Complete',
    Draft = 'Draft',
    InProgress = 'InProgress',
}

export type EmailCampaignUpdateInput = {
    id: Scalars['String']['input'];
    newDescription?: InputMaybe<Scalars['String']['input']>;
    newFromEmail?: InputMaybe<Scalars['String']['input']>;
    newFromName?: InputMaybe<Scalars['String']['input']>;
    newTitle?: InputMaybe<Scalars['String']['input']>;
    stagesToUpdate?: InputMaybe<Array<EmailCampaignStageUpdateInput>>;
};

export type EmailContactInput = {
    content: Scalars['String']['input'];
    contentFormat?: InputMaybe<EmailContentFormat>;
    fromAddress: Scalars['String']['input'];
    fromName?: InputMaybe<Scalars['String']['input']>;
    subject: Scalars['String']['input'];
};

/** The format of an email content */
export enum EmailContentFormat {
    Html = 'HTML',
    Plain = 'Plain',
    ToContentType = 'toContentType',
}

export type EmailList = {
    __typename?: 'EmailList';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    pagedEmailListEntries?: Maybe<PagedEmailListEntries>;
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EmailListPagedEmailListEntriesArgs = {
    pagination?: InputMaybe<PaginationInput>;
};

export type EmailListEntry = {
    __typename?: 'EmailListEntry';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    emailAddress: Scalars['String']['output'];
    familyName?: Maybe<Scalars['String']['output']>;
    givenName?: Maybe<Scalars['String']['output']>;
    hashCode: Scalars['String']['output'];
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EmailTemplate = {
    __typename?: 'EmailTemplate';
    alias: Scalars['String']['output'];
    contentHistory: Array<EmailTemplateContent>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    currentContent?: Maybe<EmailTemplateContent>;
    currentVersion: Scalars['Float']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    status: EmailTemplateStatus;
    title: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type EmailTemplateContent = {
    __typename?: 'EmailTemplateContent';
    activatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    body: Scalars['String']['output'];
    contentFormat: EmailContentFormat;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    languageCode: Scalars['String']['output'];
    metadata?: Maybe<EmailTemplateMetadataObject>;
    notes?: Maybe<Scalars['String']['output']>;
    subject: Scalars['String']['output'];
    version: Scalars['Float']['output'];
};

export type EmailTemplateContentEngagementMetrics = {
    __typename?: 'EmailTemplateContentEngagementMetrics';
    links: Array<EmailTemplateContentLinkEngagementMetrics>;
    opened: Scalars['Int']['output'];
    openedUnique: Scalars['Int']['output'];
    sent: Scalars['Int']['output'];
    sentError: Scalars['Int']['output'];
    sentErrorUnique: Scalars['Int']['output'];
    sentUnique: Scalars['Int']['output'];
};

export type EmailTemplateContentLinkEngagementMetrics = {
    __typename?: 'EmailTemplateContentLinkEngagementMetrics';
    clicked: Scalars['Int']['output'];
    clickedUnique: Scalars['Int']['output'];
    url: Scalars['String']['output'];
};

export type EmailTemplateImageAsset = {
    __typename?: 'EmailTemplateImageAsset';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    imageUrl: Scalars['String']['output'];
};

export type EmailTemplateImageAssetsResult = {
    __typename?: 'EmailTemplateImageAssetsResult';
    items: Array<EmailTemplateImageAsset>;
    pagination?: Maybe<Pagination>;
};

export type EmailTemplateLinkMetadataInput = {
    linkUrl: Scalars['String']['input'];
    replaceKey: Scalars['String']['input'];
};

export type EmailTemplateLinkMetadataObject = {
    __typename?: 'EmailTemplateLinkMetadataObject';
    linkUrl: Scalars['String']['output'];
    replaceKey: Scalars['String']['output'];
};

export type EmailTemplateMediaMetadataInput = {
    assetId: Scalars['String']['input'];
    replaceKey?: InputMaybe<Scalars['String']['input']>;
};

export type EmailTemplateMediaMetadataObject = {
    __typename?: 'EmailTemplateMediaMetadataObject';
    assetId: Scalars['String']['output'];
    replaceKey?: Maybe<Scalars['String']['output']>;
};

export type EmailTemplateMetadataInput = {
    links: Array<EmailTemplateLinkMetadataInput>;
    mediaAssets: Array<EmailTemplateMediaMetadataInput>;
    replaceableMarkups: Array<EmailTemplateReplaceableMarkupInput>;
};

export type EmailTemplateMetadataObject = {
    __typename?: 'EmailTemplateMetadataObject';
    links: Array<EmailTemplateLinkMetadataObject>;
    mediaAssets: Array<EmailTemplateMediaMetadataObject>;
    replaceableMarkups: Array<EmailTemplateReplaceableMarkupObject>;
};

export type EmailTemplateReplaceableMarkupInput = {
    markup: Scalars['String']['input'];
    placeHoldValue: Scalars['String']['input'];
    replaceKey: Scalars['String']['input'];
};

export type EmailTemplateReplaceableMarkupObject = {
    __typename?: 'EmailTemplateReplaceableMarkupObject';
    markup: Scalars['String']['output'];
    placeHoldValue: Scalars['String']['output'];
    replaceKey: Scalars['String']['output'];
};

/** The status of an email template */
export enum EmailTemplateStatus {
    Active = 'Active',
    Draft = 'Draft',
    Inactive = 'Inactive',
}

export type EmailTemplatesResult = {
    __typename?: 'EmailTemplatesResult';
    items: Array<EmailTemplate>;
    pagination?: Maybe<Pagination>;
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

export type FontConfig = {
    __typename?: 'FontConfig';
    fontFamily: Scalars['String']['output'];
    fontSize: Scalars['Int']['output'];
};

export type FontConfigInput = {
    fontFamily: Scalars['String']['input'];
    fontSize: Scalars['Int']['input'];
};

export type Form = {
    __typename?: 'Form';
    archivedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    components?: Maybe<Array<FormComponent>>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    metadata?: Maybe<FormMetadata>;
    originalFormId?: Maybe<Scalars['String']['output']>;
    publishedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    status: FormStatus;
    title?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type FormComponent =
    | FormComponentDataCheckbox
    | FormComponentDataCheckboxGrid
    | FormComponentDataDate
    | FormComponentDataDropdown
    | FormComponentDataHeight
    | FormComponentDataLinearScale
    | FormComponentDataMultipleChoice
    | FormComponentDataMultipleChoiceGrid
    | FormComponentDataNumber
    | FormComponentDataParagraph
    | FormComponentDataRating
    | FormComponentDataSectionHeader
    | FormComponentDataShortAnswer
    | FormComponentDataTime
    | FormComponentDataTitleAndDescription
    | FormComponentDataWeight;

export type FormComponentCreateInput = {
    data?: InputMaybe<Scalars['JSON']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    required: Scalars['Boolean']['input'];
    section: Scalars['Int']['input'];
    title?: InputMaybe<Scalars['String']['input']>;
    type: FormComponentType;
};

export type FormComponentDataCheckbox = {
    __typename?: 'FormComponentDataCheckbox';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    maxSelections?: Maybe<Scalars['Int']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    options: Array<Scalars['String']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataCheckboxGrid = {
    __typename?: 'FormComponentDataCheckboxGrid';
    allowEmpty?: Maybe<Scalars['Boolean']['output']>;
    columns: Array<Scalars['String']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    maxSelectionsPerRow?: Maybe<Scalars['Int']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    rows: Array<Scalars['String']['output']>;
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataDate = {
    __typename?: 'FormComponentDataDate';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    initialDate?: Maybe<Scalars['DateTimeISO']['output']>;
    maxDate?: Maybe<Scalars['DateTimeISO']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    minDate?: Maybe<Scalars['DateTimeISO']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataDropdown = {
    __typename?: 'FormComponentDataDropdown';
    defaultOption?: Maybe<Scalars['Int']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    options: Array<Scalars['String']['output']>;
    placeholder?: Maybe<Scalars['String']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataHeight = {
    __typename?: 'FormComponentDataHeight';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataLinearScale = {
    __typename?: 'FormComponentDataLinearScale';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    leftLabel?: Maybe<Scalars['String']['output']>;
    max: Scalars['Int']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    min: Scalars['Int']['output'];
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    rightLabel?: Maybe<Scalars['String']['output']>;
    section: Scalars['Int']['output'];
    step: Scalars['Decimal']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataMultipleChoice = {
    __typename?: 'FormComponentDataMultipleChoice';
    defaultOption?: Maybe<Scalars['Int']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    options: Array<Scalars['String']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataMultipleChoiceGrid = {
    __typename?: 'FormComponentDataMultipleChoiceGrid';
    columns: Array<Scalars['String']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    rows: Array<Scalars['String']['output']>;
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataNumber = {
    __typename?: 'FormComponentDataNumber';
    allowFloat?: Maybe<Scalars['Boolean']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    max?: Maybe<Scalars['Decimal']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    min?: Maybe<Scalars['Decimal']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataParagraph = {
    __typename?: 'FormComponentDataParagraph';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    placeholder?: Maybe<Scalars['String']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataRating = {
    __typename?: 'FormComponentDataRating';
    allowHalf?: Maybe<Scalars['Boolean']['output']>;
    allowZero?: Maybe<Scalars['Boolean']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    icon: Scalars['String']['output'];
    id: Scalars['String']['output'];
    max: Scalars['Int']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataSectionHeader = {
    __typename?: 'FormComponentDataSectionHeader';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataShortAnswer = {
    __typename?: 'FormComponentDataShortAnswer';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    placeholder?: Maybe<Scalars['String']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataTime = {
    __typename?: 'FormComponentDataTime';
    allowSeconds?: Maybe<Scalars['Boolean']['output']>;
    ampm?: Maybe<Scalars['Boolean']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    initialTime?: Maybe<Scalars['DateTimeISO']['output']>;
    maxTime?: Maybe<Scalars['DateTimeISO']['output']>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    minTime?: Maybe<Scalars['DateTimeISO']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataTitleAndDescription = {
    __typename?: 'FormComponentDataTitleAndDescription';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

export type FormComponentDataWeight = {
    __typename?: 'FormComponentDataWeight';
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    metadata?: Maybe<Scalars['JSON']['output']>;
    position: Scalars['Int']['output'];
    required: Scalars['Boolean']['output'];
    section: Scalars['Int']['output'];
    title?: Maybe<Scalars['String']['output']>;
    type: FormComponentType;
};

/** The type of component in a form */
export enum FormComponentType {
    Checkbox = 'Checkbox',
    CheckboxGrid = 'CheckboxGrid',
    Date = 'Date',
    Dropdown = 'Dropdown',
    Height = 'Height',
    LinearScale = 'LinearScale',
    MultipleChoice = 'MultipleChoice',
    MultipleChoiceGrid = 'MultipleChoiceGrid',
    Number = 'Number',
    Paragraph = 'Paragraph',
    Rating = 'Rating',
    SectionHeader = 'SectionHeader',
    ShortAnswer = 'ShortAnswer',
    Time = 'Time',
    TitleAndDescription = 'TitleAndDescription',
    Weight = 'Weight',
}

export type FormCreateInput = {
    components?: InputMaybe<Array<FormComponentCreateInput>>;
    description?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<FormMetadataInput>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type FormMetadata = {
    __typename?: 'FormMetadata';
    theme?: Maybe<FormThemeMetadata>;
};

export type FormMetadataInput = {
    theme?: InputMaybe<FormThemeMetadataInput>;
};

export enum FormStatus {
    Archived = 'Archived',
    Draft = 'Draft',
    Published = 'Published',
}

export type FormThemeMetadata = {
    __typename?: 'FormThemeMetadata';
    backgroundColor?: Maybe<Scalars['String']['output']>;
    header?: Maybe<FontConfig>;
    primaryColor?: Maybe<Scalars['String']['output']>;
    question?: Maybe<FontConfig>;
    text?: Maybe<FontConfig>;
};

export type FormThemeMetadataInput = {
    backgroundColor?: InputMaybe<Scalars['String']['input']>;
    header?: InputMaybe<FontConfigInput>;
    primaryColor?: InputMaybe<Scalars['String']['input']>;
    question?: InputMaybe<FontConfigInput>;
    text?: InputMaybe<FontConfigInput>;
};

export type FormUpdateInput = {
    components?: InputMaybe<Array<FormComponentCreateInput>>;
    description?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<FormMetadataInput>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type FormUserData = {
    __typename?: 'FormUserData';
    accountId?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    data: Scalars['JSON']['output'];
    emailAddress?: Maybe<Scalars['String']['output']>;
    formId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    profileId?: Maybe<Scalars['String']['output']>;
    userIdentifier?: Maybe<Scalars['String']['output']>;
};

export type FulfillmentOrder = {
    __typename?: 'FulfillmentOrder';
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    holdOnShipping: Scalars['Boolean']['output'];
    identifier: Scalars['String']['output'];
    lineItems: Array<FulfillmentOrderLineItem>;
    shipments: Array<Shipment>;
    shippingAddress: StreetAddressObject;
};

export type FulfillmentOrderLineItem = {
    __typename?: 'FulfillmentOrderLineItem';
    orderLineItemId: Scalars['String']['output'];
    productVariant: FulfillmentProductVariant;
    productVariantId: Scalars['String']['output'];
    quantity: Scalars['Int']['output'];
};

export type FulfillmentProductVariant = {
    __typename?: 'FulfillmentProductVariant';
    barcode?: Maybe<Scalars['String']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    gtin?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    name: Scalars['String']['output'];
    sku?: Maybe<Scalars['String']['output']>;
};

export type ImageObject = {
    __typename?: 'ImageObject';
    type: MediaObjectType;
    url: Scalars['String']['output'];
    variant?: Maybe<Scalars['String']['output']>;
};

/** The label color to be used for display */
export enum LabelColorOption {
    Blue = 'Blue',
    Green = 'Green',
}

export enum ListEntryAction {
    Add = 'Add',
    Remove = 'Remove',
    Update = 'Update',
}

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
    commerceCheckoutSessionCreateDirect: CommerceCheckoutSession;
    commerceCreateFulfillment: Shipment;
    commerceOrderCancel: OperationResult;
    commerceOrderRefund: Refund;
    commerceProductCreate: Product;
    commerceProductUpdate: Product;
    commerceRefundRequestRejectPrivileged: Refund;
    commerceVendorCreate: Vendor;
    commerceVendorUpdate: Vendor;
    contactCreate: Contact;
    contactDelete: OperationResult;
    contactFieldUpdate: Contact;
    contactUpdate: Contact;
    dataInteractionDatabaseTableRowCreate: Scalars['JSON']['output'];
    dataInteractionDatabaseTableRowDelete: OperationResult;
    dataInteractionDatabaseTableRowUpdate: Scalars['JSON']['output'];
    dataInteractionDatabaseTableRowsDelete: Scalars['Int']['output'];
    discordWebhookMessageCreate: OperationResult;
    emailAutomationUpsert: EmailAutomation;
    emailCampaignCreate: EmailCampaign;
    emailCampaignEditEmailAddresses: EmailCampaign;
    emailCampaignStartStage: EmailCampaign;
    emailCampaignUpdate: EmailCampaign;
    emailCampaignUpdateStatus: EmailCampaign;
    emailContact: Scalars['String']['output'];
    emailListCreate: EmailList;
    emailListUpdate: EmailList;
    emailTemplateContentUpsert: EmailTemplate;
    emailTemplateCreate: EmailTemplate;
    emailTemplateImageAssetDelete: Scalars['Boolean']['output'];
    emailTemplateImageAssetSetDescription: EmailTemplateImageAsset;
    emailTemplatePreview: Scalars['String']['output'];
    emailTemplateUpdate: EmailTemplate;
    engagementEventCreate: OperationResult;
    engagementEventsCreate: OperationResult;
    formArchive: Form;
    formCreate: Form;
    formFork: Form;
    formPublish: Form;
    formUpdate: Form;
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
    productVariantRemoveGalleryAsset: ProductVariant;
    productVariantReorderGallery: ProductVariant;
    sendEmail: Scalars['String']['output'];
    stripePaymentCreateSetupIntent: StripeSetupIntentCreateResult;
    submitForm: FormUserData;
    supportTicketAssign: SupportTicket;
    supportTicketCommentCreate: SupportTicketComment;
    supportTicketCommentCreatePrivileged: SupportTicketComment;
    supportTicketCreate: SupportTicket;
    supportTicketCreatePrivileged: SupportTicket;
    supportTicketUpdatePrivileged: SupportTicket;
    supportTicketUpdateStatusPrivileged: SupportTicket;
    waitListCreatePrivileged: WaitList;
    waitListDeletePrivileged: OperationResult;
    waitListEntryCreate: WaitListEntry;
    waitListEntryDelete: OperationResult;
    waitListUpdatePrivileged: WaitList;
    warehouseCreate: Warehouse;
    warehouseDelete: OperationResult;
    warehouseInventoryCreate: WarehouseInventory;
    warehouseInventoryDelete: OperationResult;
    warehouseInventoryUpdate: WarehouseInventory;
    warehouseUpdate: Warehouse;
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

export type MutationCommerceCheckoutSessionCreateDirectArgs = {
    input: CommerceCheckoutSessionCreateDirectInput;
};

export type MutationCommerceCreateFulfillmentArgs = {
    input: CreateFulfillmentInput;
};

export type MutationCommerceOrderCancelArgs = {
    orderId: Scalars['String']['input'];
};

export type MutationCommerceOrderRefundArgs = {
    input: CreateOrderRefundInput;
};

export type MutationCommerceProductCreateArgs = {
    input: CreateProductInput;
};

export type MutationCommerceProductUpdateArgs = {
    input: UpdateProductInput;
};

export type MutationCommerceRefundRequestRejectPrivilegedArgs = {
    id: Scalars['String']['input'];
    reason?: InputMaybe<Scalars['String']['input']>;
};

export type MutationCommerceVendorCreateArgs = {
    input: CreateVendorInput;
};

export type MutationCommerceVendorUpdateArgs = {
    input: UpdateVendorInput;
};

export type MutationContactCreateArgs = {
    input: ContactCreateInput;
};

export type MutationContactDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationContactFieldUpdateArgs = {
    contactId: Scalars['String']['input'];
    input: ContactFieldUpdateInput;
};

export type MutationContactUpdateArgs = {
    input: ContactUpdateInput;
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

export type MutationDiscordWebhookMessageCreateArgs = {
    input: DiscordWebhookMessageCreateInput;
};

export type MutationEmailAutomationUpsertArgs = {
    input: UpsertEmailAutomationInput;
};

export type MutationEmailCampaignCreateArgs = {
    input: EmailCampaignCreateInput;
};

export type MutationEmailCampaignEditEmailAddressesArgs = {
    campaignId: Scalars['String']['input'];
    emailAddressInputs: Array<EmailCampaignEmailAddressUpdateInput>;
};

export type MutationEmailCampaignStartStageArgs = {
    id: Scalars['String']['input'];
};

export type MutationEmailCampaignUpdateArgs = {
    input: EmailCampaignUpdateInput;
};

export type MutationEmailCampaignUpdateStatusArgs = {
    id: Scalars['String']['input'];
    status: EmailCampaignStatus;
};

export type MutationEmailContactArgs = {
    input: EmailContactInput;
};

export type MutationEmailListCreateArgs = {
    input: CreateEmailListInput;
};

export type MutationEmailListUpdateArgs = {
    input: UpdateEmailListInput;
};

export type MutationEmailTemplateContentUpsertArgs = {
    data: UpsertEmailTemplateContentInput;
};

export type MutationEmailTemplateCreateArgs = {
    data: CreateEmailTemplateInput;
};

export type MutationEmailTemplateImageAssetDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationEmailTemplateImageAssetSetDescriptionArgs = {
    description: Scalars['String']['input'];
    id: Scalars['String']['input'];
};

export type MutationEmailTemplatePreviewArgs = {
    input: PreviewEmailTemplateInput;
};

export type MutationEmailTemplateUpdateArgs = {
    data: UpdateEmailTemplateInput;
};

export type MutationEngagementEventCreateArgs = {
    input: CreateEngagementEventInput;
};

export type MutationEngagementEventsCreateArgs = {
    inputs: Array<CreateEngagementEventInput>;
};

export type MutationFormArchiveArgs = {
    id: Scalars['String']['input'];
};

export type MutationFormCreateArgs = {
    input: FormCreateInput;
};

export type MutationFormForkArgs = {
    id: Scalars['String']['input'];
};

export type MutationFormPublishArgs = {
    id: Scalars['String']['input'];
};

export type MutationFormUpdateArgs = {
    id: Scalars['String']['input'];
    input: FormUpdateInput;
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

export type MutationProductVariantRemoveGalleryAssetArgs = {
    assetId: Scalars['String']['input'];
    id: Scalars['String']['input'];
};

export type MutationProductVariantReorderGalleryArgs = {
    assetIds: Array<Scalars['String']['input']>;
    id: Scalars['String']['input'];
};

export type MutationSendEmailArgs = {
    data: SendEmailInput;
};

export type MutationSubmitFormArgs = {
    data: Scalars['JSON']['input'];
    emailAddress?: InputMaybe<Scalars['String']['input']>;
    identifier: Scalars['String']['input'];
    userIdentifier?: InputMaybe<Scalars['String']['input']>;
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

export type MutationWaitListCreatePrivilegedArgs = {
    data: WaitListCreationInput;
};

export type MutationWaitListDeletePrivilegedArgs = {
    forceDelete?: InputMaybe<Scalars['Boolean']['input']>;
    id: Scalars['String']['input'];
};

export type MutationWaitListEntryCreateArgs = {
    emailAddress: Scalars['String']['input'];
    waitListIdentifier: Scalars['String']['input'];
};

export type MutationWaitListEntryDeleteArgs = {
    emailAddress?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    reason?: InputMaybe<Scalars['String']['input']>;
    waitListIdentifier?: InputMaybe<Scalars['String']['input']>;
};

export type MutationWaitListUpdatePrivilegedArgs = {
    input: WaitListUpdateInput;
};

export type MutationWarehouseCreateArgs = {
    input: WarehouseCreateInput;
};

export type MutationWarehouseDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationWarehouseInventoryCreateArgs = {
    input: WarehouseInventoryCreateInput;
};

export type MutationWarehouseInventoryDeleteArgs = {
    id: Scalars['String']['input'];
};

export type MutationWarehouseInventoryUpdateArgs = {
    input: WarehouseInventoryUpdateInput;
};

export type MutationWarehouseUpdateArgs = {
    input: WarehouseUpdateInput;
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

export type OrderLineItemInput = {
    indexId: Scalars['Int']['input'];
    productVariantId: Scalars['String']['input'];
    quantity: Scalars['Int']['input'];
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

export type PagedContactResult = {
    __typename?: 'PagedContactResult';
    items: Array<Contact>;
    pagination: Pagination;
};

export type PagedDatabasesResult = {
    __typename?: 'PagedDatabasesResult';
    items: Array<DatebaseMetadata>;
    pagination: Pagination;
};

export type PagedEmailCampaignEmailAddress = {
    __typename?: 'PagedEmailCampaignEmailAddress';
    items: Array<EmailCampaignEmailAddress>;
    pagination?: Maybe<Pagination>;
};

export type PagedEmailCampaigns = {
    __typename?: 'PagedEmailCampaigns';
    items: Array<EmailCampaign>;
    pagination?: Maybe<Pagination>;
};

export type PagedEmailListEntries = {
    __typename?: 'PagedEmailListEntries';
    items: Array<EmailListEntry>;
    pagination?: Maybe<Pagination>;
};

export type PagedEmailLists = {
    __typename?: 'PagedEmailLists';
    items: Array<EmailList>;
    pagination?: Maybe<Pagination>;
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

export type PaginationFormResult = {
    __typename?: 'PaginationFormResult';
    items: Array<Form>;
    pagination: Pagination;
};

export type PaginationFulfillmentOrderResult = {
    __typename?: 'PaginationFulfillmentOrderResult';
    items: Array<FulfillmentOrder>;
    pagination: Pagination;
};

export type PaginationInput = {
    filters?: InputMaybe<Array<ColumnFilterInput>>;
    itemIndex?: InputMaybe<Scalars['Int']['input']>;
    itemsPerPage: Scalars['Int']['input'];
    orderBy?: InputMaybe<Array<OrderByInput>>;
};

export type PaginationInputWithFilters = {
    filters?: InputMaybe<Array<ColumnFilter>>;
    itemIndex?: InputMaybe<Scalars['Int']['input']>;
    itemsPerPage: Scalars['Int']['input'];
};

export type PaginationOrderResult = {
    __typename?: 'PaginationOrderResult';
    items: Array<CommerceOrder>;
    pagination: Pagination;
};

export type PaginationRefundResult = {
    __typename?: 'PaginationRefundResult';
    items: Array<Refund>;
    pagination: Pagination;
};

export type PaginationSupportTicketResult = {
    __typename?: 'PaginationSupportTicketResult';
    items: Array<SupportTicket>;
    pagination: Pagination;
};

export type Payment = {
    __typename?: 'Payment';
    amount: Scalars['MonetaryDecimal']['output'];
    authorizedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    cancelledAt?: Maybe<Scalars['DateTimeISO']['output']>;
    capturedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    confirmedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    currencyCode: Scalars['String']['output'];
    externalReferenceId?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    paymentMethod?: Maybe<PaymentMethod>;
    paymentProcessorType: PaymentProcessorType;
    status: PaymentStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type PaymentMethod = {
    externalResourceId?: Maybe<Scalars['String']['output']>;
    paymentProcessorType: PaymentProcessorType;
    type: PaymentMethodType;
};

export type PaymentMethodAppleInAppPurchase = PaymentMethod & {
    __typename?: 'PaymentMethodAppleInAppPurchase';
    externalResourceId?: Maybe<Scalars['String']['output']>;
    paymentProcessorType: PaymentProcessorType;
    type: PaymentMethodType;
};

export type PaymentMethodCreditCard = PaymentMethod & {
    __typename?: 'PaymentMethodCreditCard';
    billingAddress: StreetAddressObject;
    cardType: CreditCardType;
    expirationMonth: Scalars['Int']['output'];
    expirationYear: Scalars['Int']['output'];
    externalResourceId?: Maybe<Scalars['String']['output']>;
    last4: Scalars['String']['output'];
    paymentProcessorType: PaymentProcessorType;
    type: PaymentMethodType;
};

export enum PaymentMethodType {
    AppleInAppPurchase = 'AppleInAppPurchase',
    CreditCard = 'CreditCard',
}

export enum PaymentProcessorType {
    AppleInAppPurchase = 'AppleInAppPurchase',
    Stripe = 'Stripe',
    StripeEmbedded = 'StripeEmbedded',
    Test = 'Test',
}

/** The status of the payment */
export enum PaymentStatus {
    Authorized = 'Authorized',
    Cancelled = 'Cancelled',
    Captured = 'Captured',
    Confirmed = 'Confirmed',
    FailToAuthorize = 'FailToAuthorize',
    Pending = 'Pending',
}

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

export type PreviewEmailTemplateInput = {
    contentId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    languageCode: Scalars['String']['input'];
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    toAddress: Scalars['String']['input'];
    withEngagement?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Product = {
    __typename?: 'Product';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    defaultVariantId?: Maybe<Scalars['String']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    name: Scalars['String']['output'];
    status: ProductStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
    variants?: Maybe<Array<ProductVariant>>;
    vendor?: Maybe<Vendor>;
    vendorId?: Maybe<Scalars['String']['output']>;
};

export enum ProductStatus {
    Active = 'Active',
    Archived = 'Archived',
    Draft = 'Draft',
}

export type ProductVariant = {
    __typename?: 'ProductVariant';
    attributes?: Maybe<Array<ProductVariantAttributeObject>>;
    barcode?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    galleryUrls?: Maybe<Array<ProductVariantGalleryUrl>>;
    gtin?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    inventoryPolicy: ProductVariantInventoryPolicy;
    isVirtual: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    position?: Maybe<Scalars['Float']['output']>;
    price: ProductVariantPriceObject;
    sku?: Maybe<Scalars['String']['output']>;
    status: ProductVariantStatus;
    taxCode?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type ProductVariantAttributeInput = {
    displayName: Scalars['String']['input'];
    key: ProductVariantAttributeKey;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    value: Scalars['String']['input'];
};

export enum ProductVariantAttributeKey {
    AppStore = 'AppStore',
    Color = 'Color',
    Credits = 'Credits',
    Size = 'Size',
    SubscriptionPlan = 'SubscriptionPlan',
}

export type ProductVariantAttributeObject = {
    __typename?: 'ProductVariantAttributeObject';
    createdAt: Scalars['DateTimeISO']['output'];
    displayName: Scalars['String']['output'];
    id: Scalars['String']['output'];
    key: ProductVariantAttributeKey;
    metadata?: Maybe<Scalars['JSON']['output']>;
    value: Scalars['String']['output'];
};

export type ProductVariantGalleryUrl = {
    __typename?: 'ProductVariantGalleryURL';
    variants: Array<MediaObject>;
};

/** Whether customers are allowed to place an order for the product variant when it's out of stock. */
export enum ProductVariantInventoryPolicy {
    AllowBackorder = 'AllowBackorder',
    AllowWaitlist = 'AllowWaitlist',
    Deny = 'Deny',
}

export type ProductVariantPriceInput = {
    amount: Scalars['MonetaryDecimal']['input'];
    currencyCode: Scalars['String']['input'];
};

export type ProductVariantPriceObject = {
    __typename?: 'ProductVariantPriceObject';
    amount: Scalars['MonetaryDecimal']['output'];
    currencyCode: Scalars['String']['output'];
};

/** The status of the product variant. */
export enum ProductVariantStatus {
    Active = 'Active',
    Archived = 'Archived',
    Draft = 'Draft',
}

export type ProductsPaginationResult = {
    __typename?: 'ProductsPaginationResult';
    items: Array<Product>;
    pagination: Pagination;
};

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

export type PublicCommerceOrder = {
    __typename?: 'PublicCommerceOrder';
    appliedDiscounts?: Maybe<Array<CommerceOrderDiscount>>;
    createdAt: Scalars['DateTimeISO']['output'];
    fulfillmentStatus: CommerceOrderFulfillmentStatus;
    identifier: Scalars['String']['output'];
    lineItems?: Maybe<Array<PublicCommerceOrderLineItem>>;
    paymentStatus?: Maybe<PaymentStatus>;
    priceInfo: CommerceOrderPrice;
    shipments?: Maybe<Array<PublicShipment>>;
    source: Scalars['String']['output'];
    status: CommerceOrderStatus;
};

export type PublicCommerceOrderLineItem = {
    __typename?: 'PublicCommerceOrderLineItem';
    id: Scalars['String']['output'];
    indexId: Scalars['Int']['output'];
    productVariantId: Scalars['String']['output'];
    quantity: Scalars['Int']['output'];
    status: CommerceOrderLineItemStatus;
};

export type PublicProfile = {
    __typename?: 'PublicProfile';
    createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
    displayName?: Maybe<Scalars['String']['output']>;
    images?: Maybe<Array<ImageObject>>;
    username: Scalars['String']['output'];
};

export type PublicShipment = {
    __typename?: 'PublicShipment';
    cancelledAt?: Maybe<Scalars['DateTimeISO']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    deliveredAt?: Maybe<Scalars['DateTimeISO']['output']>;
    deliveryStatus: DeliveryStatus;
    label?: Maybe<ShippingLabel>;
    orderIndexId: Scalars['Int']['output'];
    packageInfo: ShippingPackageInfo;
    shippedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    status: ShipmentStatus;
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
    appleStoreTransactionWithOrderInfo?: Maybe<AppleStoreTransactionOrderMapping>;
    commerceCheckoutSession: CommerceCheckoutSession;
    commerceCheckoutSessionLatest: CommerceCheckoutSession;
    commerceOrder: CommerceOrderResult;
    commerceOrderPrivileged: CommerceOrder;
    commerceOrders: PaginationOrderResult;
    commerceOrdersByCheckoutSession: Array<CommerceOrderResult>;
    commerceOrdersPrivileged: PaginationOrderResult;
    commerceOrdersReadyToFulfill: PaginationFulfillmentOrderResult;
    commerceProduct: Product;
    commerceProductPrivileged: Product;
    commerceProducts: ProductsPaginationResult;
    commerceProductsPrivileged: ProductsPaginationResult;
    commerceRefundRequestsPrivileged: PaginationRefundResult;
    commerceVendor: Vendor;
    commerceVendors: VendorsResult;
    contact: Contact;
    contacts: PagedContactResult;
    dataInteractionDatabaseTable: DatabaseTableMetadata;
    dataInteractionDatabaseTableMetrics: Array<DataInteractionDatabaseMetrics>;
    dataInteractionDatabaseTableRow: DatabaseTableRowData;
    dataInteractionDatabaseTableRows: DatabaseTableMetadataWithRows;
    dataInteractionDatabaseTables: DatabaseTablesResult;
    dataInteractionDatabases: PagedDatabasesResult;
    deviceId: OperationResult;
    discordWebhookQuery: OperationResult;
    emailAutomation: EmailAutomation;
    emailAutomationBuiltInAvailable: Array<EmailAutomation>;
    emailAutomations: EmailAutomationResult;
    emailCampaign: EmailCampaign;
    emailCampaigns: PagedEmailCampaigns;
    emailList: EmailList;
    emailListEntries: PagedEmailLists;
    emailListEntry: EmailList;
    emailLists: PagedEmailLists;
    emailTemplate: EmailTemplate;
    emailTemplateContentEngagementMetrics: EmailTemplateContentEngagementMetrics;
    emailTemplateImageAssets: EmailTemplateImageAssetsResult;
    emailTemplates: EmailTemplatesResult;
    engagementEvents: Array<EngagementEvent>;
    engagementOverview: EngagementOverview;
    form: Form;
    formPrivileged: Form;
    formsPrivileged: PaginationFormResult;
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
    queryOrderPrice: QueryCommerceOrderPriceResult;
    supportAllSupportProfiles: Array<PublicProfile>;
    supportTicket: SupportTicket;
    supportTickets: PaginationSupportTicketResult;
    supportTicketsPrivileged: PaginationSupportTicketResult;
    waitListEntriesPrivileged: WaitListEntriesResult;
    waitLists: WaitListResult;
    waitListsPrivileged: WaitListResult;
    warehouse: Warehouse;
    warehouses: Array<Warehouse>;
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

export type QueryAppleStoreTransactionWithOrderInfoArgs = {
    originalTransactionId?: InputMaybe<Scalars['String']['input']>;
    transactionId: Scalars['String']['input'];
};

export type QueryCommerceCheckoutSessionArgs = {
    id: Scalars['String']['input'];
};

export type QueryCommerceOrderArgs = {
    identifier: Scalars['String']['input'];
};

export type QueryCommerceOrderPrivilegedArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCommerceOrdersArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceOrdersByCheckoutSessionArgs = {
    checkoutSessionId: Scalars['String']['input'];
};

export type QueryCommerceOrdersPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceOrdersReadyToFulfillArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceProductArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCommerceProductPrivilegedArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCommerceProductsArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceProductsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceRefundRequestsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryCommerceVendorArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCommerceVendorsArgs = {
    pagination: PaginationInput;
};

export type QueryContactArgs = {
    id: Scalars['String']['input'];
};

export type QueryContactsArgs = {
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

export type QueryEmailAutomationArgs = {
    automationKey: Scalars['String']['input'];
};

export type QueryEmailAutomationsArgs = {
    input?: InputMaybe<PaginationInput>;
};

export type QueryEmailCampaignArgs = {
    id: Scalars['String']['input'];
};

export type QueryEmailCampaignsArgs = {
    input?: InputMaybe<PaginationInputWithFilters>;
};

export type QueryEmailListArgs = {
    identifier: Scalars['String']['input'];
};

export type QueryEmailListEntriesArgs = {
    pagination?: InputMaybe<PaginationInput>;
};

export type QueryEmailListEntryArgs = {
    emailAddress?: InputMaybe<Scalars['String']['input']>;
    hashCode?: InputMaybe<Scalars['String']['input']>;
};

export type QueryEmailListsArgs = {
    pagination?: InputMaybe<PaginationInput>;
};

export type QueryEmailTemplateArgs = {
    alias?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
};

export type QueryEmailTemplateContentEngagementMetricsArgs = {
    emailTemplateContentId: Scalars['String']['input'];
};

export type QueryEmailTemplateImageAssetsArgs = {
    input?: InputMaybe<PaginationInputWithFilters>;
};

export type QueryEmailTemplatesArgs = {
    input?: InputMaybe<PaginationInputWithFilters>;
};

export type QueryEngagementOverviewArgs = {
    input?: InputMaybe<EngagementOverviewInput>;
};

export type QueryFormArgs = {
    identifier: Scalars['String']['input'];
};

export type QueryFormPrivilegedArgs = {
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFormsPrivilegedArgs = {
    pagination: PaginationInput;
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

export type QueryQueryOrderPriceArgs = {
    input: QueryCommerceOrderPriceInput;
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

export type QueryWaitListEntriesPrivilegedArgs = {
    pagination: PaginationInput;
    waitListId?: InputMaybe<Scalars['String']['input']>;
    waitListIdentifier?: InputMaybe<Scalars['String']['input']>;
};

export type QueryWaitListsArgs = {
    pagination: PaginationInput;
};

export type QueryWaitListsPrivilegedArgs = {
    pagination: PaginationInput;
};

export type QueryWarehouseArgs = {
    id: Scalars['String']['input'];
};

export type QueryCommerceOrderPriceInput = {
    emailAddress?: InputMaybe<Scalars['String']['input']>;
    lineItems: Array<OrderLineItemInput>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
    shippingAddress?: InputMaybe<StreetAddressInput>;
};

export type QueryCommerceOrderPriceResult = {
    __typename?: 'QueryCommerceOrderPriceResult';
    appliedDiscounts: Array<CommerceOrderDiscount>;
    orderPrice: CommerceOrderPrice;
};

export type Refund = {
    __typename?: 'Refund';
    amount?: Maybe<Scalars['MonetaryDecimal']['output']>;
    commerceOrder?: Maybe<CommerceOrder>;
    commerceOrderId: Scalars['String']['output'];
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    items: Array<RefundItem>;
    metadata?: Maybe<Scalars['JSON']['output']>;
    reason?: Maybe<Scalars['String']['output']>;
    status: RefundStatus;
    statusRecords?: Maybe<Array<StatusRecord>>;
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type RefundItem = {
    __typename?: 'RefundItem';
    lineItemId: Scalars['Float']['output'];
    quantity: Scalars['Float']['output'];
};

/** The status of a refund. */
export enum RefundStatus {
    Cancelled = 'Cancelled',
    Created = 'Created',
    Failed = 'Failed',
    Issued = 'Issued',
    Pending = 'Pending',
    Rejected = 'Rejected',
    RequiresAction = 'RequiresAction',
}

/** The format of the string rich-content */
export enum RichContentFormat {
    Html = 'Html',
    Markdown = 'Markdown',
    PlainText = 'PlainText',
}

export type SendEmailInput = {
    content: Scalars['String']['input'];
    contentFormat?: InputMaybe<EmailContentFormat>;
    fromAddress: Scalars['String']['input'];
    fromName?: InputMaybe<Scalars['String']['input']>;
    subject: Scalars['String']['input'];
    toAddress: Scalars['String']['input'];
};

export type Shipment = {
    __typename?: 'Shipment';
    cancelledAt?: Maybe<Scalars['DateTimeISO']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId?: Maybe<Scalars['String']['output']>;
    createdByProfileId?: Maybe<Scalars['String']['output']>;
    deliveredAt?: Maybe<Scalars['DateTimeISO']['output']>;
    deliveryStatus: DeliveryStatus;
    id: Scalars['String']['output'];
    label?: Maybe<ShippingLabel>;
    orderIndexId: Scalars['Int']['output'];
    packageInfo: ShippingPackageInfo;
    shippedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    source: Scalars['String']['output'];
    status: ShipmentStatus;
    toAddress: StreetAddressObject;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

/** The status of the shipping */
export enum ShipmentStatus {
    Cancelled = 'Cancelled',
    Delivered = 'Delivered',
    LabelPrinted = 'LabelPrinted',
    LabelPurchased = 'LabelPurchased',
    Pending = 'Pending',
    Shipped = 'Shipped',
}

export type ShippingLabel = {
    __typename?: 'ShippingLabel';
    carrier: Scalars['String']['output'];
    serviceType: ShippingServiceType;
    trackingNumber: Scalars['String']['output'];
    trackingUrl?: Maybe<Scalars['String']['output']>;
};

export type ShippingPackageInfo = {
    __typename?: 'ShippingPackageInfo';
    items: Array<ShippingPackageItem>;
    packageIndexId: Scalars['Float']['output'];
};

export type ShippingPackageItem = {
    __typename?: 'ShippingPackageItem';
    indexId: Scalars['Float']['output'];
    quantity: Scalars['Float']['output'];
};

export enum ShippingServiceType {
    UpsGround = 'UPSGround',
    UspsStandard = 'USPSStandard',
}

export type StatusRecord = {
    __typename?: 'StatusRecord';
    description?: Maybe<Scalars['String']['output']>;
    status: Scalars['String']['output'];
    timestamp: Scalars['DateTimeISO']['output'];
};

export type StreetAddressInput = {
    city: Scalars['String']['input'];
    company?: InputMaybe<Scalars['String']['input']>;
    country: Scalars['String']['input'];
    firstName: Scalars['String']['input'];
    lastName: Scalars['String']['input'];
    line1: Scalars['String']['input'];
    line2?: InputMaybe<Scalars['String']['input']>;
    phoneNumber?: InputMaybe<Scalars['String']['input']>;
    postalCode: Scalars['String']['input'];
    state: Scalars['String']['input'];
};

export type StreetAddressObject = {
    __typename?: 'StreetAddressObject';
    city: Scalars['String']['output'];
    company?: Maybe<Scalars['String']['output']>;
    country: Scalars['String']['output'];
    firstName: Scalars['String']['output'];
    lastName: Scalars['String']['output'];
    line1: Scalars['String']['output'];
    line2?: Maybe<Scalars['String']['output']>;
    phoneNumber?: Maybe<Scalars['String']['output']>;
    postalCode: Scalars['String']['output'];
    state: Scalars['String']['output'];
};

export type StripeSetupIntentCreateResult = {
    __typename?: 'StripeSetupIntentCreateResult';
    clientSecret: Scalars['String']['output'];
    setupIntentId: Scalars['String']['output'];
    stripeCustomerId: Scalars['String']['output'];
};

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

export type UpdateEmailListEntryInput = {
    action: ListEntryAction;
    emailAddress: Scalars['String']['input'];
    familyName?: InputMaybe<Scalars['String']['input']>;
    givenName?: InputMaybe<Scalars['String']['input']>;
    metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateEmailListInput = {
    emailListEntryInputs?: InputMaybe<Array<UpdateEmailListEntryInput>>;
    id: Scalars['String']['input'];
    newIdentifier?: InputMaybe<Scalars['String']['input']>;
    newTitle?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmailTemplateInput = {
    alias?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    status?: InputMaybe<EmailTemplateStatus>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    newVariants?: InputMaybe<Array<CreateProductVariantInput>>;
    removedVariantIds?: InputMaybe<Array<Scalars['String']['input']>>;
    status?: InputMaybe<ProductStatus>;
    updatedVariants?: InputMaybe<Array<UpdateProductVariantInput>>;
};

export type UpdateProductVariantAttributeInput = {
    attributeToUpsert?: InputMaybe<ProductVariantAttributeInput>;
    idToDelete?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductVariantInput = {
    attributes?: InputMaybe<Array<UpdateProductVariantAttributeInput>>;
    barcode?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    gtin?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    inventoryPolicy?: InputMaybe<ProductVariantInventoryPolicy>;
    isVirtual?: InputMaybe<Scalars['Boolean']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    position?: InputMaybe<Scalars['Float']['input']>;
    price?: InputMaybe<ProductVariantPriceInput>;
    setDefault?: InputMaybe<Scalars['Boolean']['input']>;
    sku?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<ProductVariantStatus>;
    taxCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    identifier?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<VendorStatus>;
};

export type UpsertEmailAutomationInput = {
    automationKey: Scalars['String']['input'];
    availableMetadata?: InputMaybe<Array<AvailableMetadataInput>>;
    description?: InputMaybe<Scalars['String']['input']>;
    emailTemplateId?: InputMaybe<Scalars['String']['input']>;
    fromEmail?: InputMaybe<Scalars['String']['input']>;
    fromName?: InputMaybe<Scalars['String']['input']>;
    subject?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertEmailTemplateContentInput = {
    body?: InputMaybe<Scalars['String']['input']>;
    contentFormat?: InputMaybe<EmailContentFormat>;
    emailTemplateId: Scalars['String']['input'];
    languageCode?: InputMaybe<Scalars['String']['input']>;
    markCurrent?: InputMaybe<Scalars['Boolean']['input']>;
    metadata?: InputMaybe<EmailTemplateMetadataInput>;
    notes?: InputMaybe<Scalars['String']['input']>;
    referencedContentId?: InputMaybe<Scalars['String']['input']>;
    subject?: InputMaybe<Scalars['String']['input']>;
};

export type Vendor = {
    __typename?: 'Vendor';
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    description?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    identifier: Scalars['String']['output'];
    name: Scalars['String']['output'];
    pagedProducts?: Maybe<ProductsPaginationResult>;
    products: ProductsPaginationResult;
    status: VendorStatus;
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type VendorProductsArgs = {
    pagination: PaginationInput;
};

export enum VendorStatus {
    Active = 'Active',
    Archived = 'Archived',
    Inactive = 'Inactive',
}

export type VendorsResult = {
    __typename?: 'VendorsResult';
    items: Array<Vendor>;
    pagination: Pagination;
};

export type WaitList = {
    __typename?: 'WaitList';
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

export type WaitListCreationInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    title: Scalars['String']['input'];
};

export type WaitListEntriesResult = {
    __typename?: 'WaitListEntriesResult';
    items: Array<WaitListEntry>;
    pagination: Pagination;
};

export type WaitListEntry = {
    __typename?: 'WaitListEntry';
    accountId?: Maybe<Scalars['String']['output']>;
    contactedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    countryCode?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['DateTimeISO']['output'];
    emailAddress: Scalars['String']['output'];
    id: Scalars['String']['output'];
    ipAddress?: Maybe<Scalars['String']['output']>;
    message?: Maybe<Scalars['String']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    notifiedAt?: Maybe<Scalars['DateTimeISO']['output']>;
    profileId?: Maybe<Scalars['String']['output']>;
    referredBy?: Maybe<Scalars['String']['output']>;
    updatedAt: Scalars['DateTimeISO']['output'];
    userAgent?: Maybe<Scalars['String']['output']>;
    waitList?: Maybe<WaitList>;
    waitListId: Scalars['String']['output'];
};

export type WaitListResult = {
    __typename?: 'WaitListResult';
    items: Array<WaitList>;
    pagination: Pagination;
};

export type WaitListUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    identifier?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type Warehouse = {
    __typename?: 'Warehouse';
    address: StreetAddressObject;
    createdAt: Scalars['DateTimeISO']['output'];
    createdByAccountId: Scalars['String']['output'];
    createdByProfileId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    name: Scalars['String']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
    updatedByAccountId?: Maybe<Scalars['String']['output']>;
    updatedByProfileId?: Maybe<Scalars['String']['output']>;
};

export type WarehouseCreateInput = {
    address: StreetAddressInput;
    id?: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
};

export type WarehouseInventory = {
    __typename?: 'WarehouseInventory';
    createdAt: Scalars['DateTimeISO']['output'];
    id: Scalars['String']['output'];
    lowInventoryThreshold?: Maybe<Scalars['Int']['output']>;
    quantity: Scalars['Int']['output'];
    updatedAt: Scalars['DateTimeISO']['output'];
};

export type WarehouseInventoryCreateInput = {
    lowInventoryThreshold?: InputMaybe<Scalars['Int']['input']>;
    productVariantId: Scalars['String']['input'];
    quantity: Scalars['Int']['input'];
    warehouseId: Scalars['String']['input'];
};

export type WarehouseInventoryUpdateInput = {
    id: Scalars['String']['input'];
    lowInventoryThreshold?: InputMaybe<Scalars['Int']['input']>;
    quantity?: InputMaybe<Scalars['Int']['input']>;
    quantityUpdateType?: InputMaybe<WarehouseInventoryUpdateType>;
};

export enum WarehouseInventoryUpdateType {
    Add = 'Add',
    Set = 'Set',
    Subtract = 'Subtract',
}

export type WarehouseUpdateInput = {
    address?: InputMaybe<StreetAddressInput>;
    id: Scalars['String']['input'];
    name?: InputMaybe<Scalars['String']['input']>;
};

export type NoOpQueryVariables = Exact<{ [key: string]: never }>;

export type NoOpQuery = { __typename: 'Query' };

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
        accessRole: { __typename?: 'AccessRole'; id: string; type: string; description?: string | null };
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
            accessRole: { __typename?: 'AccessRole'; id: string; type: string; description?: string | null };
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

export type WaitListCreatePrivilegedMutationVariables = Exact<{
    data: WaitListCreationInput;
}>;

export type WaitListCreatePrivilegedMutation = {
    __typename?: 'Mutation';
    waitListCreatePrivileged: {
        __typename?: 'WaitList';
        id: string;
        identifier: string;
        title: string;
        description?: string | null;
        updatedAt: any;
        createdAt: any;
    };
};

export type WaitListsPrivilegedQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type WaitListsPrivilegedQuery = {
    __typename?: 'Query';
    waitListsPrivileged: {
        __typename?: 'WaitListResult';
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
            __typename?: 'WaitList';
            id: string;
            identifier: string;
            title: string;
            description?: string | null;
            updatedAt: any;
            createdAt: any;
        }>;
    };
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

export type CommerceOrdersPrivilegedQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type CommerceOrdersPrivilegedQuery = {
    __typename?: 'Query';
    commerceOrdersPrivileged: {
        __typename?: 'PaginationOrderResult';
        items: Array<{
            __typename?: 'CommerceOrder';
            createdAt: any;
            emailAddress: string;
            fulfillmentSource?: string | null;
            fulfillmentStatus: CommerceOrderFulfillmentStatus;
            id: string;
            identifier: string;
            metadata?: any | null;
            paymentStatus?: PaymentStatus | null;
            source: string;
            status: CommerceOrderStatus;
            updatedAt: any;
            lineItems?: Array<{
                __typename?: 'CommerceOrderLineItem';
                createdAt: any;
                id: string;
                indexId: number;
                productVariantId: string;
                quantity: number;
                status: CommerceOrderLineItemStatus;
                updatedAt: any;
            }> | null;
            payment?: {
                __typename?: 'Payment';
                amount: any;
                authorizedAt?: any | null;
                cancelledAt?: any | null;
                capturedAt?: any | null;
                confirmedAt?: any | null;
                createdAt: any;
                currencyCode: string;
                externalReferenceId?: string | null;
                id: string;
                paymentProcessorType: PaymentProcessorType;
                status: PaymentStatus;
                updatedAt: any;
                paymentMethod?:
                    | {
                          __typename?: 'PaymentMethodAppleInAppPurchase';
                          externalResourceId?: string | null;
                          paymentProcessorType: PaymentProcessorType;
                          type: PaymentMethodType;
                      }
                    | {
                          __typename?: 'PaymentMethodCreditCard';
                          externalResourceId?: string | null;
                          cardType: CreditCardType;
                          expirationMonth: number;
                          expirationYear: number;
                          last4: string;
                          paymentProcessorType: PaymentProcessorType;
                          type: PaymentMethodType;
                          billingAddress: {
                              __typename?: 'StreetAddressObject';
                              city: string;
                              company?: string | null;
                              country: string;
                              firstName: string;
                              lastName: string;
                              line1: string;
                              line2?: string | null;
                              postalCode: string;
                              state: string;
                              phoneNumber?: string | null;
                          };
                      }
                    | null;
            } | null;
            priceInfo: {
                __typename?: 'CommerceOrderPrice';
                amount: any;
                currencyCode: string;
                originalSubtotal: any;
                subtotal: any;
                lineItemPrices: Array<{
                    __typename?: 'CommerceOrderLineItemPrice';
                    indexId: number;
                    originalSubtotal: any;
                    subtotal: any;
                }>;
                shippingRate: { __typename?: 'CommerceOrderShippingRate'; amount: any; originalAmount: any };
                tax: { __typename?: 'CommerceOrderTax'; shipping: any; total: any };
            };
            shipments?: Array<{
                __typename?: 'Shipment';
                cancelledAt?: any | null;
                createdAt: any;
                createdByAccountId?: string | null;
                createdByProfileId?: string | null;
                deliveredAt?: any | null;
                deliveryStatus: DeliveryStatus;
                id: string;
                orderIndexId: number;
                shippedAt?: any | null;
                source: string;
                status: ShipmentStatus;
                updatedAt: any;
                updatedByAccountId?: string | null;
                updatedByProfileId?: string | null;
                label?: {
                    __typename?: 'ShippingLabel';
                    carrier: string;
                    serviceType: ShippingServiceType;
                    trackingNumber: string;
                    trackingUrl?: string | null;
                } | null;
                toAddress: {
                    __typename?: 'StreetAddressObject';
                    city: string;
                    company?: string | null;
                    country: string;
                    firstName: string;
                    lastName: string;
                    line1: string;
                    line2?: string | null;
                    phoneNumber?: string | null;
                    state: string;
                    postalCode: string;
                };
            }> | null;
            shippingInfo?: {
                __typename?: 'CommerceOrderShippingInfo';
                shippingAddress: {
                    __typename?: 'StreetAddressObject';
                    city: string;
                    country: string;
                    company?: string | null;
                    lastName: string;
                    firstName: string;
                    line1: string;
                    line2?: string | null;
                    phoneNumber?: string | null;
                    postalCode: string;
                    state: string;
                };
            } | null;
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

export type WaitListEntryCreateMutationVariables = Exact<{
    emailAddress: Scalars['String']['input'];
    waitListIdentifier?: Scalars['String']['input'];
}>;

export type WaitListEntryCreateMutation = {
    __typename?: 'Mutation';
    waitListEntryCreate: { __typename?: 'WaitListEntry'; id: string; emailAddress: string };
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

export type EngagementOverviewQueryVariables = Exact<{
    input?: InputMaybe<EngagementOverviewInput>;
}>;

export type EngagementOverviewQuery = {
    __typename?: 'Query';
    engagementOverview: {
        __typename?: 'EngagementOverview';
        uniqueDeviceIds: number;
        deviceCategoryPercentages?: any | null;
        views?: Array<{
            __typename?: 'EngagementViewOverview';
            uniqueDeviceCount: number;
            viewIdentifier?: string | null;
        }> | null;
        locations: Array<{
            __typename?: 'EngagementLocationOverview';
            uniqueDeviceCount: number;
            countryCode?: string | null;
            latitude?: string | null;
            longitude?: string | null;
        }>;
        referrers?: Array<{
            __typename?: 'EngagementReferrerOverview';
            referrer?: string | null;
            uniqueDeviceCount: number;
        }> | null;
    };
};

export type CommerceOrdersPrivilegedChartQueryVariables = Exact<{
    pagination: PaginationInput;
}>;

export type CommerceOrdersPrivilegedChartQuery = {
    __typename?: 'Query';
    commerceOrdersPrivileged: {
        __typename?: 'PaginationOrderResult';
        items: Array<{ __typename?: 'CommerceOrder'; createdAt: any }>;
        pagination: {
            __typename?: 'Pagination';
            itemIndex: number;
            itemIndexForPreviousPage?: number | null;
            itemIndexForNextPage?: number | null;
            itemsPerPage: number;
            itemsTotal: number;
        };
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
export const WaitListCreatePrivilegedDocument = new TypedDocumentString(`
    mutation WaitListCreatePrivileged($data: WaitListCreationInput!) {
  waitListCreatePrivileged(data: $data) {
    id
    identifier
    title
    description
    updatedAt
    createdAt
  }
}
    `) as unknown as TypedDocumentString<WaitListCreatePrivilegedMutation, WaitListCreatePrivilegedMutationVariables>;
export const WaitListsPrivilegedDocument = new TypedDocumentString(`
    query WaitListsPrivileged($pagination: PaginationInput!) {
  waitListsPrivileged(pagination: $pagination) {
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
    `) as unknown as TypedDocumentString<WaitListsPrivilegedQuery, WaitListsPrivilegedQueryVariables>;
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
export const CommerceOrdersPrivilegedDocument = new TypedDocumentString(`
    query CommerceOrdersPrivileged($pagination: PaginationInput!) {
  commerceOrdersPrivileged(pagination: $pagination) {
    items {
      createdAt
      emailAddress
      fulfillmentSource
      fulfillmentStatus
      id
      identifier
      lineItems {
        createdAt
        id
        indexId
        productVariantId
        quantity
        status
        updatedAt
      }
      metadata
      payment {
        amount
        authorizedAt
        cancelledAt
        capturedAt
        confirmedAt
        createdAt
        currencyCode
        externalReferenceId
        id
        paymentMethod {
          externalResourceId
          paymentProcessorType
          type
          ... on PaymentMethodCreditCard {
            externalResourceId
            billingAddress {
              city
              company
              country
              firstName
              lastName
              line1
              line2
              postalCode
              state
              phoneNumber
            }
            cardType
            expirationMonth
            expirationYear
            last4
            paymentProcessorType
            type
          }
          ... on PaymentMethodAppleInAppPurchase {
            externalResourceId
            paymentProcessorType
            type
          }
        }
        paymentProcessorType
        status
        updatedAt
      }
      paymentStatus
      priceInfo {
        amount
        currencyCode
        lineItemPrices {
          indexId
          originalSubtotal
          subtotal
        }
        originalSubtotal
        shippingRate {
          amount
          originalAmount
        }
        subtotal
        tax {
          shipping
          total
        }
      }
      shipments {
        cancelledAt
        createdAt
        createdByAccountId
        createdByProfileId
        deliveredAt
        deliveryStatus
        id
        orderIndexId
        label {
          carrier
          serviceType
          trackingNumber
          trackingUrl
        }
        shippedAt
        source
        status
        toAddress {
          city
          company
          country
          firstName
          lastName
          line1
          line2
          phoneNumber
          state
          postalCode
        }
        updatedAt
        updatedByAccountId
        updatedByProfileId
      }
      shippingInfo {
        shippingAddress {
          city
          country
          company
          lastName
          firstName
          line1
          line2
          phoneNumber
          postalCode
          state
        }
      }
      source
      status
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
    `) as unknown as TypedDocumentString<CommerceOrdersPrivilegedQuery, CommerceOrdersPrivilegedQueryVariables>;
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
export const WaitListEntryCreateDocument = new TypedDocumentString(`
    mutation WaitListEntryCreate($emailAddress: String!, $waitListIdentifier: String! = "earlyAccess") {
  waitListEntryCreate(
    emailAddress: $emailAddress
    waitListIdentifier: $waitListIdentifier
  ) {
    id
    emailAddress
  }
}
    `) as unknown as TypedDocumentString<WaitListEntryCreateMutation, WaitListEntryCreateMutationVariables>;
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
export const EngagementOverviewDocument = new TypedDocumentString(`
    query EngagementOverview($input: EngagementOverviewInput) {
  engagementOverview(input: $input) {
    uniqueDeviceIds
    views {
      uniqueDeviceCount
      viewIdentifier
    }
    locations {
      uniqueDeviceCount
      countryCode
      latitude
      longitude
    }
    referrers {
      referrer
      uniqueDeviceCount
    }
    deviceCategoryPercentages
  }
}
    `) as unknown as TypedDocumentString<EngagementOverviewQuery, EngagementOverviewQueryVariables>;
export const CommerceOrdersPrivilegedChartDocument = new TypedDocumentString(`
    query CommerceOrdersPrivilegedChart($pagination: PaginationInput!) {
  commerceOrdersPrivileged(pagination: $pagination) {
    items {
      createdAt
    }
    pagination {
      itemIndex
      itemIndexForPreviousPage
      itemIndexForNextPage
      itemsPerPage
      itemsTotal
    }
  }
}
    `) as unknown as TypedDocumentString<
    CommerceOrdersPrivilegedChartQuery,
    CommerceOrdersPrivilegedChartQueryVariables
>;
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
    export const EngagementOverviewInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'EngagementOverviewInput',
        fields: [
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
                    {
                        type: 'unknown',
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
                    {
                        type: 'unknown',
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
                    {
                        type: 'unknown',
                    },
                ],
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
                        type: 'isPhoneNumber',
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
                        type: 'maxLength',
                        constraints: [32],
                    },
                ],
            },
        ],
    };

    export const WaitListCreationInput: GraphQLInputObjectTypeMetadata = {
        kind: 'object',
        type: 'WaitListCreationInput',
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
                        type: 'isPhoneNumber',
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

export const WaitListCreatePrivilegedOperation: GraphQLOperationMetadata<typeof WaitListCreatePrivilegedDocument> = {
    operation: 'WaitListCreatePrivileged',
    operationType: 'mutation',
    document: WaitListCreatePrivilegedDocument,
    parameters: [
        {
            parameter: 'data',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.WaitListCreationInput,
        },
    ],
};

export const WaitListsPrivilegedOperation: GraphQLOperationMetadata<typeof WaitListsPrivilegedDocument> = {
    operation: 'WaitListsPrivileged',
    operationType: 'query',
    document: WaitListsPrivilegedDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
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

export const CommerceOrdersPrivilegedOperation: GraphQLOperationMetadata<typeof CommerceOrdersPrivilegedDocument> = {
    operation: 'CommerceOrdersPrivileged',
    operationType: 'query',
    document: CommerceOrdersPrivilegedDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
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

export const WaitListEntryCreateOperation: GraphQLOperationMetadata<typeof WaitListEntryCreateDocument> = {
    operation: 'WaitListEntryCreate',
    operationType: 'mutation',
    document: WaitListEntryCreateDocument,
    parameters: [
        {
            parameter: 'emailAddress',
            required: true,
            kind: 'scalar',
            type: 'String',
        },
        {
            parameter: 'waitListIdentifier',
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

export const EngagementOverviewOperation: GraphQLOperationMetadata<typeof EngagementOverviewDocument> = {
    operation: 'EngagementOverview',
    operationType: 'query',
    document: EngagementOverviewDocument,
    parameters: [
        {
            parameter: 'input',
            required: false,
            kind: 'object',
            type: GraphQLInputTypes.EngagementOverviewInput,
        },
    ],
};

export const CommerceOrdersPrivilegedChartOperation: GraphQLOperationMetadata<
    typeof CommerceOrdersPrivilegedChartDocument
> = {
    operation: 'CommerceOrdersPrivilegedChart',
    operationType: 'query',
    document: CommerceOrdersPrivilegedChartDocument,
    parameters: [
        {
            parameter: 'pagination',
            required: true,
            kind: 'object',
            type: GraphQLInputTypes.PaginationInput,
        },
    ],
};
