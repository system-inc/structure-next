/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** Decimal custom scalar type */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** Monetary decimal custom scalar type, we stored and operate the value in cents, and this scalar will convert the value to dollar when read and convert the value to cents when write. */
  MonetaryDecimal: { input: any; output: any; }
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
  Revoked = 'Revoked'
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
  Secondary = 'Secondary'
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
  accessRoles: AccessRoleAssignment;
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
  Revoked = 'Revoked'
}

/** The status of an account */
export enum AccountStatus {
  Active = 'Active',
  Archived = 'Archived',
  Locked = 'Locked'
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
  Success = 'Success'
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
  OpenStatuses = 'openStatuses'
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
  PausingForError = 'PausingForError'
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
  NotLike = 'NotLike'
}

export type ColumnFilterGroupInput = {
  conditions?: InputMaybe<Array<ColumnFilterInput>>;
  filters?: InputMaybe<Array<ColumnFilterGroupInput>>;
  operator?: InputMaybe<ColumnFilterGroupOperator>;
};

export enum ColumnFilterGroupOperator {
  And = 'And',
  Or = 'Or'
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
  Pending = 'Pending'
}

export type CommerceOrder = {
  __typename?: 'CommerceOrder';
  appliedDiscounts?: Maybe<Array<CommerceOrderDiscount>>;
  batchIdentifier: Scalars['String']['output'];
  beneficiaryEmailAddress?: Maybe<Scalars['String']['output']>;
  checkoutSessionId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  discounts?: Maybe<Array<Discount>>;
  emailAddress: Scalars['String']['output'];
  fulfillmentSource?: Maybe<Scalars['String']['output']>;
  fulfillmentStatus: CommerceOrderFulfillmentStatus;
  holdOnShipping: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  lineItems?: Maybe<Array<CommerceOrderLineItem>>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  orderLogs?: Maybe<Array<CommerceOrderLog>>;
  payment?: Maybe<Payment>;
  paymentId?: Maybe<Scalars['String']['output']>;
  paymentStatus?: Maybe<PaymentStatus>;
  priceInfo: CommerceOrderPrice;
  refunds?: Maybe<Array<Refund>>;
  shipments?: Maybe<Array<Shipment>>;
  shippingInfo?: Maybe<CommerceOrderShippingInfo>;
  source: Scalars['String']['output'];
  status: CommerceOrderStatus;
  statusDescription?: Maybe<Scalars['String']['output']>;
  statusRecords?: Maybe<Array<StatusRecord>>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CommerceOrderDiscount = {
  __typename?: 'CommerceOrderDiscount';
  amount: Scalars['MonetaryDecimal']['output'];
  code?: Maybe<Scalars['String']['output']>;
  colorOption?: Maybe<LabelColorOption>;
  items?: Maybe<Array<CommerceOrderLineItemDiscount>>;
};

/** The fulfillment status of the order */
export enum CommerceOrderFulfillmentStatus {
  Cancelled = 'Cancelled',
  Fulfilled = 'Fulfilled',
  NotStart = 'NotStart',
  PartiallyFulfilled = 'PartiallyFulfilled',
  Shipped = 'Shipped',
  Unfulfilled = 'Unfulfilled'
}

export type CommerceOrderLineItem = {
  __typename?: 'CommerceOrderLineItem';
  commerceOrderId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  fulfilledQuantity: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  indexId: Scalars['Int']['output'];
  originalQuantity?: Maybe<Scalars['Int']['output']>;
  productVariantId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  shippedQuantity: Scalars['Int']['output'];
  status: CommerceOrderLineItemStatus;
  statusDescription?: Maybe<Scalars['String']['output']>;
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
  amount: Scalars['MonetaryDecimal']['output'];
  indexId: Scalars['Int']['output'];
  originalSubtotal: Scalars['MonetaryDecimal']['output'];
  originalUnitPrice?: Maybe<Scalars['MonetaryDecimal']['output']>;
  subtotal: Scalars['MonetaryDecimal']['output'];
  tax: Scalars['MonetaryDecimal']['output'];
  unitPrice?: Maybe<Scalars['MonetaryDecimal']['output']>;
};

/** The status of the order line item */
export enum CommerceOrderLineItemStatus {
  Cancelled = 'Cancelled',
  Pending = 'Pending',
  Shipped = 'Shipped'
}

export type CommerceOrderLog = {
  __typename?: 'CommerceOrderLog';
  commerceOrderId: Scalars['String']['output'];
  content?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  source: CommerceOrderLogSource;
  visibility: CommerceOrderLogVisibility;
};

/** The source of the order log. */
export enum CommerceOrderLogSource {
  CustomerSupport = 'CustomerSupport',
  System = 'System',
  User = 'User'
}

/** The visibility of the order log. */
export enum CommerceOrderLogVisibility {
  Internal = 'Internal',
  Public = 'Public'
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
  breakdown: Array<CommerceOrderShippingRateBreakdown>;
  originalAmount: Scalars['MonetaryDecimal']['output'];
};

export type CommerceOrderShippingRateBreakdown = {
  __typename?: 'CommerceOrderShippingRateBreakdown';
  freeShipping: Scalars['Boolean']['output'];
  items: Array<CommerceOrderShippingRateBreakdownItem>;
  originalShippingRate: Scalars['MonetaryDecimal']['output'];
  packageIndexId: Scalars['Int']['output'];
  shippingRate: Scalars['MonetaryDecimal']['output'];
};

export type CommerceOrderShippingRateBreakdownItem = {
  __typename?: 'CommerceOrderShippingRateBreakdownItem';
  indexId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
};

/** The status of the order */
export enum CommerceOrderStatus {
  Archived = 'Archived',
  Cancelled = 'Cancelled',
  Complete = 'Complete',
  FailToConfirm = 'FailToConfirm',
  Open = 'Open',
  OutOfStock = 'OutOfStock',
  Pending = 'Pending',
  Refunded = 'Refunded',
  WaitPayment = 'WaitPayment'
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
  metadata: Scalars['JSON']['output'];
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
  StreetAddress = 'StreetAddress'
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
  Person = 'Person'
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

export type CreateProductBundleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  items: Array<CreateProductBundleItemInput>;
  name: Scalars['String']['input'];
  visibility?: InputMaybe<ProductBundleVisibility>;
};

export type CreateProductBundleItemInput = {
  productVariantId: Scalars['String']['input'];
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
  Visa = 'Visa'
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
  ReadyForPickup = 'ReadyForPickup'
}

export enum DeviceOrientation {
  Landscape = 'Landscape',
  NotAvailable = 'NotAvailable',
  Portrait = 'Portrait'
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

export type Discount = {
  __typename?: 'Discount';
  code?: Maybe<Scalars['String']['output']>;
  conditions: Array<DiscountCondition>;
  createdAt: Scalars['DateTimeISO']['output'];
  endsAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  rule?: Maybe<DiscountRule>;
  startsAt?: Maybe<Scalars['DateTimeISO']['output']>;
  type: DiscountType;
  updatedAt: Scalars['DateTimeISO']['output'];
  usageCount: Scalars['Int']['output'];
};

export enum DiscountAllocationMethod {
  BuyXGetFollowing = 'BuyXGetFollowing',
  BuyXGetY = 'BuyXGetY',
  Flat = 'Flat'
}

export type DiscountAllocationObject = {
  __typename?: 'DiscountAllocationObject';
  buyThisGetY?: Maybe<Scalars['Int']['output']>;
  buyThisGetYAmount?: Maybe<Scalars['MonetaryDecimal']['output']>;
  buyXAmountGetThis?: Maybe<Scalars['MonetaryDecimal']['output']>;
  buyXGetThis?: Maybe<Scalars['Int']['output']>;
  maxAllocationLimit: Scalars['Float']['output'];
  method: DiscountAllocationMethod;
  target: DiscountAllocationTarget;
  value: Scalars['MonetaryDecimal']['output'];
  valueType: DiscountValueType;
};

export enum DiscountAllocationTarget {
  Across = 'Across',
  Each = 'Each',
  ShippingAmount = 'ShippingAmount',
  ShippingBreakdown = 'ShippingBreakdown'
}

export type DiscountCondition = {
  __typename?: 'DiscountCondition';
  createdAt: Scalars['DateTimeISO']['output'];
  discountRuleId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  quantityRequirement?: Maybe<DiscountConditionRequirementObject>;
  referenceId: Scalars['String']['output'];
  subtotalRequirement?: Maybe<DiscountConditionRequirementObject>;
  target: DiscountConditionTarget;
  type: DiscountConditionType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type DiscountConditionRequirementObject = {
  __typename?: 'DiscountConditionRequirementObject';
  maxValue?: Maybe<Scalars['Int']['output']>;
  minValue?: Maybe<Scalars['Int']['output']>;
  requiredValue?: Maybe<Scalars['Int']['output']>;
};

export enum DiscountConditionTarget {
  EntireOrder = 'EntireOrder',
  LineItem = 'LineItem'
}

export enum DiscountConditionType {
  ProductVariants = 'ProductVariants',
  Products = 'Products',
  Vendors = 'Vendors'
}

export type DiscountRule = {
  __typename?: 'DiscountRule';
  allocation: DiscountAllocationObject;
  conditions: Array<DiscountCondition>;
  createdAt: Scalars['DateTimeISO']['output'];
  displayTitle: Scalars['String']['output'];
  id: Scalars['String']['output'];
  oncePerCustomer: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

/** The type of the discount. */
export enum DiscountType {
  Automatic = 'Automatic',
  Code = 'Code'
}

export enum DiscountValueType {
  FixedAmount = 'FixedAmount',
  Percentage = 'Percentage'
}

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
  Custom = 'Custom'
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
  Sent = 'Sent'
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
  InProgress = 'InProgress'
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
  ToContentType = 'toContentType'
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
  Inactive = 'Inactive'
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
  Verified = 'Verified'
}

/** Enabled filter type */
export enum EnabledFilterType {
  All = 'All',
  Disabled = 'Disabled',
  Enabled = 'Enabled'
}

export type EngagementEvent = {
  __typename?: 'EngagementEvent';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  loggedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
};

export type EngagementEventContextInput = {
  loadDurationInMilliseconds?: InputMaybe<Scalars['Int']['input']>;
  loggedAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  previousViewDurationInMilliseconds?: InputMaybe<Scalars['Int']['input']>;
  previousViewIdentifier?: InputMaybe<Scalars['String']['input']>;
  previousViewTitle?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  sessionDurationInMilliseconds?: InputMaybe<Scalars['Int']['input']>;
  traceId?: InputMaybe<Scalars['String']['input']>;
  traceSequenceNumber?: InputMaybe<Scalars['Int']['input']>;
  viewDurationInMilliseconds?: InputMaybe<Scalars['Int']['input']>;
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
  deviceCategoryPercentages: Scalars['JSON']['output'];
  locations: Array<EngagementLocationOverview>;
  uniqueDeviceIds: Scalars['Int']['output'];
  views: Array<EngagementViewOverview>;
};

export type EngagementOverviewInput = {
  endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
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

export type FlowEntity = {
  __typename?: 'FlowEntity';
  activeVersion?: Maybe<FlowVersionEntity>;
  activeVersionId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdByAccountId: Scalars['String']['output'];
  createdByProfileId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  executions: Array<FlowExecution>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedByAccountId?: Maybe<Scalars['String']['output']>;
  updatedByProfileId?: Maybe<Scalars['String']['output']>;
  versions: Array<FlowVersionEntity>;
};

export type FlowExecution = {
  __typename?: 'FlowExecution';
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdByAccountId: Scalars['String']['output'];
  createdByProfileId: Scalars['String']['output'];
  elapsedTimeMs?: Maybe<Scalars['Float']['output']>;
  errors?: Maybe<Array<Scalars['JSON']['output']>>;
  flowEntity?: Maybe<FlowEntity>;
  flowType: FlowType;
  flowTypeId: Scalars['String']['output'];
  flowVersionEntity?: Maybe<FlowVersionEntity>;
  flowVersionId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  input?: Maybe<Scalars['JSON']['output']>;
  logs?: Maybe<Array<Scalars['JSON']['output']>>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  output?: Maybe<Scalars['JSON']['output']>;
  startedAt: Scalars['DateTimeISO']['output'];
  status: FlowExecutionStatus;
  stepExecutions: Array<FlowStepExecution>;
  triggerId?: Maybe<Scalars['String']['output']>;
  triggerType: FlowTriggerType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type FlowExecutionHistoryInput = {
  flowId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<FlowExecutionStatus>>;
  triggerId?: InputMaybe<Scalars['String']['input']>;
};

export type FlowExecutionInput = {
  executionId: Scalars['String']['input'];
};

export enum FlowExecutionStatus {
  Canceled = 'Canceled',
  Failed = 'Failed',
  NotStarted = 'NotStarted',
  Running = 'Running',
  Success = 'Success'
}

export type FlowStepExecution = {
  __typename?: 'FlowStepExecution';
  actionType: Scalars['String']['output'];
  attempt: Scalars['Float']['output'];
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  elapsedTimeMs?: Maybe<Scalars['Float']['output']>;
  errors?: Maybe<Scalars['JSON']['output']>;
  flowExecution: FlowExecution;
  flowExecutionId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  input?: Maybe<Scalars['JSON']['output']>;
  logs?: Maybe<Array<Scalars['JSON']['output']>>;
  output?: Maybe<Scalars['JSON']['output']>;
  startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  status: FlowStepExecutionStatus;
  stepId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum FlowStepExecutionStatus {
  Failed = 'Failed',
  NotStarted = 'NotStarted',
  Running = 'Running',
  Success = 'Success'
}

export type FlowSubscribeInput = {
  triggerId: Scalars['String']['input'];
};

export enum FlowTriggerType {
  Manual = 'Manual',
  Recurring = 'Recurring',
  Webhook = 'Webhook'
}

export enum FlowType {
  Custom = 'Custom',
  Entity = 'Entity',
  Static = 'Static'
}

export type FlowVersionEntity = {
  __typename?: 'FlowVersionEntity';
  createdAt: Scalars['DateTimeISO']['output'];
  createdByAccountId: Scalars['String']['output'];
  createdByProfileId: Scalars['String']['output'];
  executions: Array<FlowExecution>;
  flow: FlowEntity;
  flowId: Scalars['String']['output'];
  graph: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
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

export type FormComponent = FormComponentDataCheckbox | FormComponentDataCheckboxGrid | FormComponentDataDate | FormComponentDataDropdown | FormComponentDataLinearScale | FormComponentDataMultipleChoice | FormComponentDataMultipleChoiceGrid | FormComponentDataParagraph | FormComponentDataRating | FormComponentDataSectionHeader | FormComponentDataShortAnswer | FormComponentDataTime | FormComponentDataTitleAndDescription;

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

/** The type of component in a form */
export enum FormComponentType {
  Checkbox = 'Checkbox',
  CheckboxGrid = 'CheckboxGrid',
  Date = 'Date',
  Dropdown = 'Dropdown',
  LinearScale = 'LinearScale',
  MultipleChoice = 'MultipleChoice',
  MultipleChoiceGrid = 'MultipleChoiceGrid',
  Paragraph = 'Paragraph',
  Rating = 'Rating',
  SectionHeader = 'SectionHeader',
  ShortAnswer = 'ShortAnswer',
  Time = 'Time',
  TitleAndDescription = 'TitleAndDescription'
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
  Published = 'Published'
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

export type GridCapability = {
  __typename?: 'GridCapability';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridCapabilityCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type GridCapabilityInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridCapabilityUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridCloudProvider = {
  __typename?: 'GridCloudProvider';
  adapter: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridCloudProviderCreateInput = {
  adapter: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type GridCloudProviderInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridCloudProviderListInput = {
  adapter?: InputMaybe<Scalars['String']['input']>;
  enabledOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GridCloudProviderUpdateInput = {
  adapter?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type GridNode = {
  __typename?: 'GridNode';
  createdAt: Scalars['DateTimeISO']['output'];
  enabled: Scalars['Boolean']['output'];
  healthEndpoint: Scalars['String']['output'];
  host: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastSeenAt?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  online: Scalars['Boolean']['output'];
  providerRegionId: Scalars['String']['output'];
  settings?: Maybe<Scalars['JSON']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridNodeCapability = {
  __typename?: 'GridNodeCapability';
  capabilityId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
};

export type GridNodeCapabilityAssignInput = {
  capabilityId: Scalars['String']['input'];
  nodeId: Scalars['String']['input'];
};

export type GridNodeCapabilityListInput = {
  capabilityId?: InputMaybe<Scalars['String']['input']>;
  nodeId?: InputMaybe<Scalars['String']['input']>;
};

export type GridNodeCapabilityRemoveInput = {
  capabilityId: Scalars['String']['input'];
  nodeId: Scalars['String']['input'];
};

export type GridNodeCreateInput = {
  host: Scalars['String']['input'];
  name: Scalars['String']['input'];
  port?: InputMaybe<Scalars['Float']['input']>;
  providerRegionId: Scalars['String']['input'];
};

export type GridNodeInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridNodeListInput = {
  providerRegionId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type GridNodeUpdateInput = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridProviderRegion = {
  __typename?: 'GridProviderRegion';
  cloudProviderId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  healthEndpoint?: Maybe<Scalars['String']['output']>;
  host?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  key?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  online: Scalars['Boolean']['output'];
  providerRegionCode: Scalars['String']['output'];
  regionId: Scalars['String']['output'];
  secure: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridProviderRegionCapability = {
  __typename?: 'GridProviderRegionCapability';
  capabilityId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  providerRegionId: Scalars['String']['output'];
};

export type GridProviderRegionCapabilityAssignInput = {
  capabilityId: Scalars['String']['input'];
  providerRegionId: Scalars['String']['input'];
};

export type GridProviderRegionCapabilityListInput = {
  capabilityId?: InputMaybe<Scalars['String']['input']>;
  providerRegionId?: InputMaybe<Scalars['String']['input']>;
};

export type GridProviderRegionCapabilityRemoveInput = {
  capabilityId: Scalars['String']['input'];
  providerRegionId: Scalars['String']['input'];
};

export type GridProviderRegionCreateInput = {
  cloudProviderId: Scalars['String']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  healthEndpoint?: InputMaybe<Scalars['String']['input']>;
  host?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  online?: InputMaybe<Scalars['Boolean']['input']>;
  providerRegionCode: Scalars['String']['input'];
  regionId: Scalars['String']['input'];
  secure?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GridProviderRegionInput = {
  cloudProviderId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  providerRegionCode?: InputMaybe<Scalars['String']['input']>;
  regionId?: InputMaybe<Scalars['String']['input']>;
};

export type GridProviderRegionListInput = {
  cloudProviderId?: InputMaybe<Scalars['String']['input']>;
  enabledOnly?: InputMaybe<Scalars['Boolean']['input']>;
  regionId?: InputMaybe<Scalars['String']['input']>;
};

export type GridProviderRegionUpdateInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  providerRegionCode?: InputMaybe<Scalars['String']['input']>;
};

export type GridRegion = {
  __typename?: 'GridRegion';
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  division: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locality: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  region: Scalars['String']['output'];
  site?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridRegionCreateInput = {
  country: Scalars['String']['input'];
  division: Scalars['String']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  locality: Scalars['String']['input'];
  region: Scalars['String']['input'];
  site?: InputMaybe<Scalars['String']['input']>;
};

export type GridRegionInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Grid region level */
export enum GridRegionLevel {
  Country = 'Country',
  Division = 'Division',
  Locality = 'Locality',
  Region = 'Region',
  Site = 'Site'
}

export type GridRegionLevels = {
  __typename?: 'GridRegionLevels';
  country?: Maybe<Scalars['String']['output']>;
  division?: Maybe<Scalars['String']['output']>;
  locality?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  site?: Maybe<Scalars['String']['output']>;
};

export type GridRegionLevelsInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Scalars['String']['input']>;
  locality?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['String']['input']>;
};

export type GridRegionLevelsListInput = {
  level: GridRegionLevel;
};

export type GridRegionListInput = {
  enabled?: InputMaybe<EnabledFilterType>;
};

export type GridRegionUpdateInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  locality?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['String']['input']>;
};

export type GridTask = {
  __typename?: 'GridTask';
  allowAsync: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  timeoutMs: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridTaskCapability = {
  __typename?: 'GridTaskCapability';
  capabilityId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  taskId: Scalars['String']['output'];
};

export type GridTaskCapabilityCreateInput = {
  capabilityId: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
  taskId: Scalars['String']['input'];
};

export type GridTaskCapabilityDeleteInput = {
  capabilityId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};

export type GridTaskCapabilityListInput = {
  capabilityId?: InputMaybe<Scalars['String']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
};

export type GridTaskCapabilityUpdateInput = {
  capabilityId: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  taskId: Scalars['String']['input'];
};

export type GridTaskCreateInput = {
  allowAsync?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  timeoutMs?: InputMaybe<Scalars['Float']['input']>;
};

export type GridTaskExecution = {
  __typename?: 'GridTaskExecution';
  attempt: Scalars['Float']['output'];
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error?: Maybe<Scalars['JSON']['output']>;
  flowId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inputData?: Maybe<Scalars['JSON']['output']>;
  isAsync?: Maybe<Scalars['Boolean']['output']>;
  maxAttempts?: Maybe<Scalars['Float']['output']>;
  nodeId?: Maybe<Scalars['String']['output']>;
  outputData?: Maybe<Scalars['JSON']['output']>;
  providerRegionId?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  status: GridTaskExecutionStatus;
  taskTypeId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GridTaskExecutionInput = {
  flowId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodeId?: InputMaybe<Scalars['String']['input']>;
  providerRegionId?: InputMaybe<Scalars['String']['input']>;
  taskTypeId?: InputMaybe<Scalars['String']['input']>;
};

export type GridTaskExecutionListInput = {
  flowId?: InputMaybe<Scalars['String']['input']>;
  nodeId?: InputMaybe<Scalars['String']['input']>;
  providerRegionId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<GridTaskExecutionStatus>;
  taskTypeId?: InputMaybe<Scalars['String']['input']>;
};

/** The possible states of a task ran on the Grid. */
export enum GridTaskExecutionStatus {
  Failed = 'Failed',
  Pending = 'Pending',
  Retry = 'Retry',
  Running = 'Running',
  Success = 'Success'
}

export type GridTaskInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GridTaskListInput = {
  enabledOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GridTaskProviderSupport = {
  __typename?: 'GridTaskProviderSupport';
  cloudProviderId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  taskId: Scalars['String']['output'];
};

export type GridTaskProviderSupportCreateInput = {
  cloudProviderId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};

export type GridTaskProviderSupportDeleteInput = {
  cloudProviderId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};

export type GridTaskUpdateInput = {
  allowAsync?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  timeoutMs?: InputMaybe<Scalars['Float']['input']>;
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
  Green = 'Green'
}

export enum ListEntryAction {
  Add = 'Add',
  Remove = 'Remove',
  Update = 'Update'
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
  Video = 'Video'
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
  accountProfileEntitlementDeletePrivileged: OperationResult;
  accountProfileImageRemove: Profile;
  accountProfileUpdate: Profile;
  accountSessionDelete: OperationResult;
  accountSignOut: OperationResult;
  commerceCheckoutSessionCreateDirect: CommerceCheckoutSession;
  commerceCreateFulfillment: Shipment;
  commerceOrderCancel: OperationResult;
  commerceOrderRefund: Refund;
  commerceProductBundleCreate: ProductBundle;
  commerceProductBundleDelete: OperationResult;
  commerceProductBundleUpdate: ProductBundle;
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
  flowAbortPrivileged: OperationResult;
  flowCancelPrivileged: OperationResult;
  flowPurgeByDatePrivileged: OperationResult;
  flowPurgePrivileged: OperationResult;
  flowSubscribe: FlowExecution;
  flowUnsubscribe: FlowExecution;
  formArchive: Form;
  formCreate: Form;
  formFork: Form;
  formPublish: Form;
  formUpdate: Form;
  /** Create a new capability. */
  gridCapabilityCreatePrivileged: GridCapability;
  /** Delete a capability. */
  gridCapabilityDeletePrivileged: OperationResult;
  /** Update a capability. */
  gridCapabilityUpdatePrivileged: GridCapability;
  /** Create a new grid cloud provider. */
  gridCloudProviderCreatePrivileged: GridCloudProvider;
  /** Delete a grid cloud provider. */
  gridCloudProviderDeletePrivileged: OperationResult;
  /** Update a grid cloud provider. */
  gridCloudProviderUpdatePrivileged: GridCloudProvider;
  /** Assign a capability to a node. */
  gridNodeCapabilityCreatePrivileged: GridNodeCapability;
  /** Remove a capability from a node. */
  gridNodeCapabilityDeletePrivileged: OperationResult;
  /** Create a new node. */
  gridNodeCreatePrivileged: GridNode;
  /** Delete a node. */
  gridNodeDeletePrivileged: OperationResult;
  /** Update a node. */
  gridNodeUpdatePrivileged: GridNode;
  /** Assign a capability to a provider region. */
  gridProviderRegionCapabilityCreatePrivileged: GridProviderRegionCapability;
  /** Remove a capability from a provider region. */
  gridProviderRegionCapabilityDeletePrivileged: OperationResult;
  /** Create a new provider region. */
  gridProviderRegionCreatePrivileged: GridProviderRegion;
  /** Delete a provider region. */
  gridProviderRegionDeletePrivileged: OperationResult;
  /** Update a provider region. */
  gridProviderRegionUpdatePrivileged: GridProviderRegion;
  /** Create a new region. */
  gridRegionCreatePrivileged: GridRegion;
  /** Delete a region. */
  gridRegionDeletePrivileged: OperationResult;
  /** Update a region. */
  gridRegionUpdatePrivileged: GridRegion;
  /** Assign a capability to a task type. */
  gridTaskCapabilityCreatePrivileged: GridTaskCapability;
  /** Remove a capability from a task type. */
  gridTaskCapabilityDeletePrivileged: OperationResult;
  /** Update a task type capability. */
  gridTaskCapabilityUpdatePrivileged: GridTaskCapability;
  /** Create a new task type. */
  gridTaskCreatePrivileged: GridTask;
  /** Delete a task type. */
  gridTaskDeletePrivileged: OperationResult;
  /** Assign a task type to a cloud provider. */
  gridTaskProviderSupportCreatePrivileged: GridTaskProviderSupport;
  /** Remove a task type from a cloud provider. */
  gridTaskProviderSupportDeletePrivileged: OperationResult;
  /** Update a task. */
  gridTaskUpdatePrivileged: GridTask;
  portCheckCreate: Scalars['String']['output'];
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
  submitForm: FormUserData;
  supportTicketAssign: SupportTicket;
  supportTicketCommentCreatePrivileged: SupportTicketComment;
  supportTicketCreate: SupportTicket;
  supportTicketUpdatePrivileged: SupportTicket;
  supportTicketUpdateStatusPrivileged: SupportTicket;
  waitListCreate: WaitList;
  waitListDelete: OperationResult;
  waitListEntryCreate: WaitListEntry;
  waitListEntryDelete: OperationResult;
  waitListUpdate: WaitList;
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


export type MutationAccountProfileEntitlementDeletePrivilegedArgs = {
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


export type MutationCommerceProductBundleCreateArgs = {
  input: CreateProductBundleInput;
};


export type MutationCommerceProductBundleDeleteArgs = {
  id: Scalars['String']['input'];
};


export type MutationCommerceProductBundleUpdateArgs = {
  input: UpdateProductBundleInput;
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


export type MutationFlowAbortPrivilegedArgs = {
  objectId: Scalars['String']['input'];
};


export type MutationFlowCancelPrivilegedArgs = {
  objectId: Scalars['String']['input'];
  timeout?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationFlowPurgeByDatePrivilegedArgs = {
  date: Scalars['DateTimeISO']['input'];
};


export type MutationFlowPurgePrivilegedArgs = {
  objectId: Scalars['String']['input'];
};


export type MutationFlowSubscribeArgs = {
  input: FlowSubscribeInput;
};


export type MutationFlowUnsubscribeArgs = {
  input: FlowSubscribeInput;
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


export type MutationGridCapabilityCreatePrivilegedArgs = {
  input: GridCapabilityCreateInput;
};


export type MutationGridCapabilityDeletePrivilegedArgs = {
  input: GridCapabilityInput;
};


export type MutationGridCapabilityUpdatePrivilegedArgs = {
  input: GridCapabilityUpdateInput;
};


export type MutationGridCloudProviderCreatePrivilegedArgs = {
  input: GridCloudProviderCreateInput;
};


export type MutationGridCloudProviderDeletePrivilegedArgs = {
  input: GridCloudProviderInput;
};


export type MutationGridCloudProviderUpdatePrivilegedArgs = {
  input: GridCloudProviderUpdateInput;
};


export type MutationGridNodeCapabilityCreatePrivilegedArgs = {
  input: GridNodeCapabilityAssignInput;
};


export type MutationGridNodeCapabilityDeletePrivilegedArgs = {
  input: GridNodeCapabilityRemoveInput;
};


export type MutationGridNodeCreatePrivilegedArgs = {
  input: GridNodeCreateInput;
};


export type MutationGridNodeDeletePrivilegedArgs = {
  input: GridNodeInput;
};


export type MutationGridNodeUpdatePrivilegedArgs = {
  input: GridNodeUpdateInput;
};


export type MutationGridProviderRegionCapabilityCreatePrivilegedArgs = {
  input: GridProviderRegionCapabilityAssignInput;
};


export type MutationGridProviderRegionCapabilityDeletePrivilegedArgs = {
  input: GridProviderRegionCapabilityRemoveInput;
};


export type MutationGridProviderRegionCreatePrivilegedArgs = {
  input: GridProviderRegionCreateInput;
};


export type MutationGridProviderRegionDeletePrivilegedArgs = {
  input: GridProviderRegionInput;
};


export type MutationGridProviderRegionUpdatePrivilegedArgs = {
  input: GridProviderRegionUpdateInput;
};


export type MutationGridRegionCreatePrivilegedArgs = {
  input: GridRegionCreateInput;
};


export type MutationGridRegionDeletePrivilegedArgs = {
  input: GridRegionInput;
};


export type MutationGridRegionUpdatePrivilegedArgs = {
  input: GridRegionUpdateInput;
};


export type MutationGridTaskCapabilityCreatePrivilegedArgs = {
  input: GridTaskCapabilityCreateInput;
};


export type MutationGridTaskCapabilityDeletePrivilegedArgs = {
  input: GridTaskCapabilityDeleteInput;
};


export type MutationGridTaskCapabilityUpdatePrivilegedArgs = {
  input: GridTaskCapabilityUpdateInput;
};


export type MutationGridTaskCreatePrivilegedArgs = {
  input: GridTaskCreateInput;
};


export type MutationGridTaskDeletePrivilegedArgs = {
  input: GridTaskInput;
};


export type MutationGridTaskProviderSupportCreatePrivilegedArgs = {
  input: GridTaskProviderSupportCreateInput;
};


export type MutationGridTaskProviderSupportDeletePrivilegedArgs = {
  input: GridTaskProviderSupportDeleteInput;
};


export type MutationGridTaskUpdatePrivilegedArgs = {
  input: GridTaskUpdateInput;
};


export type MutationPortCheckCreateArgs = {
  input: PortCheckCreateInput;
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
};


export type MutationSupportTicketAssignArgs = {
  ticketId: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSupportTicketCommentCreatePrivilegedArgs = {
  input: SupportTicketCommentCreateInput;
};


export type MutationSupportTicketCreateArgs = {
  input: SupportTicketCreateInput;
};


export type MutationSupportTicketUpdatePrivilegedArgs = {
  input: SupportTicketUpdateInput;
};


export type MutationSupportTicketUpdateStatusPrivilegedArgs = {
  id: Scalars['String']['input'];
  status: SupportTicketStatus;
};


export type MutationWaitListCreateArgs = {
  data: WaitListCreationInput;
};


export type MutationWaitListDeleteArgs = {
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
  waitListIdentifier?: InputMaybe<Scalars['String']['input']>;
};


export type MutationWaitListUpdateArgs = {
  data: WaitListUpdateInput;
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
  Descending = 'Descending'
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

export type PaginationFlowExecutionResult = {
  __typename?: 'PaginationFlowExecutionResult';
  items: Array<FlowExecution>;
  pagination: Pagination;
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

export type PaginationGridCapability = {
  __typename?: 'PaginationGridCapability';
  items: Array<GridCapability>;
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

export type PaginationPortCheckResult = {
  __typename?: 'PaginationPortCheckResult';
  items: Array<FlowExecution>;
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
  statusDescription?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  walletEntryId?: Maybe<Scalars['String']['output']>;
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
  CreditCard = 'CreditCard'
}

export enum PaymentProcessorType {
  AppleInAppPurchase = 'AppleInAppPurchase',
  Stripe = 'Stripe',
  StripeEmbedded = 'StripeEmbedded',
  StripeProxy = 'StripeProxy',
  Test = 'Test'
}

/** The status of the payment */
export enum PaymentStatus {
  Authorized = 'Authorized',
  Cancelled = 'Cancelled',
  Captured = 'Captured',
  Confirmed = 'Confirmed',
  FailToAuthorize = 'FailToAuthorize',
  Pending = 'Pending'
}

export type PortCheckCreateInput = {
  host: Scalars['String']['input'];
  port: Scalars['Float']['input'];
  region: GridRegionLevelsInput;
};

export type PortCheckInput = {
  executionId: Scalars['String']['input'];
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
  Rejected = 'Rejected'
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
  Published = 'Published'
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
  Upvote = 'Upvote'
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

export type ProductBundle = {
  __typename?: 'ProductBundle';
  createdAt: Scalars['DateTimeISO']['output'];
  createdByAccountId: Scalars['String']['output'];
  createdByProfileId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  items: Array<ProductBundleItem>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedByAccountId?: Maybe<Scalars['String']['output']>;
  updatedByProfileId?: Maybe<Scalars['String']['output']>;
  visibility: ProductBundleVisibility;
};

export type ProductBundleItem = {
  __typename?: 'ProductBundleItem';
  indexId: Scalars['String']['output'];
  productVariant?: Maybe<ProductVariant>;
  productVariantId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
};

export enum ProductBundleVisibility {
  Public = 'Public',
  Unlisted = 'Unlisted'
}

export type ProductBundlesPaginationResult = {
  __typename?: 'ProductBundlesPaginationResult';
  items: Array<ProductBundle>;
  pagination: Pagination;
};

export enum ProductStatus {
  Active = 'Active',
  Archived = 'Archived',
  Draft = 'Draft'
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
  SubscriptionPlan = 'SubscriptionPlan'
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
  Deny = 'Deny'
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
  Draft = 'Draft'
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
  commerceProductBundle: ProductBundle;
  commerceProductBundles: ProductBundlesPaginationResult;
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
  flowExecution?: Maybe<FlowExecution>;
  flowExecutionHistory: PaginationFlowExecutionResult;
  flowInfoPrivileged: Scalars['JSON']['output'];
  form: Form;
  formPrivileged: Form;
  formsPrivileged: PaginationFormResult;
  /** Get all capabilities. */
  gridCapabilitiesPrivileged: Array<PaginationGridCapability>;
  /** Get a capability by ID or name. */
  gridCapabilityPrivileged?: Maybe<GridCapability>;
  /** Get a grid cloud provider by ID or name. */
  gridCloudProviderPrivileged?: Maybe<GridCloudProvider>;
  /** Get all grid cloud providers. */
  gridCloudProvidersPrivileged: Array<GridCloudProvider>;
  /** Get all node capabilities. */
  gridNodeCapabilitiesPrivileged: Array<GridNodeCapability>;
  /** Get a node by ID or name. */
  gridNodePrivileged?: Maybe<GridNode>;
  /** Get all nodes. */
  gridNodesPrivileged: Array<GridNode>;
  /** Get all provider region capabilities. */
  gridProviderRegionCapabilitiesPrivileged: Array<GridProviderRegionCapability>;
  /** Get a provider region by ID or other criteria. */
  gridProviderRegionPrivleged?: Maybe<GridProviderRegion>;
  /** Get all provider regions. */
  gridProviderRegionsPrivileged: Array<GridProviderRegion>;
  /** Get all regions. */
  gridRegionLevels: Array<GridRegionLevels>;
  /** Get a region by ID or name. */
  gridRegionPrivileged?: Maybe<GridRegion>;
  /** Get all regions. */
  gridRegionsPrivileged: Array<GridRegion>;
  /** Get all task type capabilities. */
  gridTaskCapabilitiesPrivileged: Array<GridTaskCapability>;
  /** Get a specific task execution. */
  gridTaskExecutionPrivileged?: Maybe<GridTaskExecution>;
  /** Get task executions. */
  gridTaskExecutionsPrivileged: Array<GridTaskExecution>;
  /** Get a task type by ID, name, or name and version. */
  gridTaskPrivileged?: Maybe<GridTask>;
  /** Get all task provider supports. */
  gridTaskProviderSupportPrivileged: Array<GridTaskProviderSupport>;
  /** Get all task types. */
  gridTasksPrivileged: Array<GridTask>;
  portCheck?: Maybe<FlowExecution>;
  portCheckHistory: PaginationPortCheckResult;
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
  supportTickets: PaginationSupportTicketResult;
  supportTicketsPrivileged: PaginationSupportTicketResult;
  waitListEntries: WaitListEntriesResult;
  waitLists: WaitListResult;
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


export type QueryCommerceProductBundleArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommerceProductBundlesArgs = {
  pagination: PaginationInput;
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
  databaseName?: InputMaybe<Scalars['String']['input']>;
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
  live?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryFlowExecutionArgs = {
  input: FlowExecutionInput;
};


export type QueryFlowExecutionHistoryArgs = {
  input: FlowExecutionHistoryInput;
  pagination: PaginationInput;
};


export type QueryFlowInfoPrivilegedArgs = {
  objectId: Scalars['String']['input'];
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


export type QueryGridCapabilitiesPrivilegedArgs = {
  pagination: PaginationInput;
};


export type QueryGridCapabilityPrivilegedArgs = {
  input: GridCapabilityInput;
};


export type QueryGridCloudProviderPrivilegedArgs = {
  input: GridCloudProviderInput;
};


export type QueryGridCloudProvidersPrivilegedArgs = {
  input?: InputMaybe<GridCloudProviderListInput>;
};


export type QueryGridNodeCapabilitiesPrivilegedArgs = {
  input?: InputMaybe<GridNodeCapabilityListInput>;
  pagination: PaginationInput;
};


export type QueryGridNodePrivilegedArgs = {
  input: GridNodeInput;
};


export type QueryGridNodesPrivilegedArgs = {
  input?: InputMaybe<GridNodeListInput>;
  pagination: PaginationInput;
};


export type QueryGridProviderRegionCapabilitiesPrivilegedArgs = {
  input?: InputMaybe<GridProviderRegionCapabilityListInput>;
};


export type QueryGridProviderRegionPrivlegedArgs = {
  input: GridProviderRegionInput;
};


export type QueryGridProviderRegionsPrivilegedArgs = {
  input?: InputMaybe<GridProviderRegionListInput>;
};


export type QueryGridRegionLevelsArgs = {
  input: GridRegionLevelsListInput;
};


export type QueryGridRegionPrivilegedArgs = {
  input: GridRegionInput;
};


export type QueryGridRegionsPrivilegedArgs = {
  input?: InputMaybe<GridRegionListInput>;
};


export type QueryGridTaskCapabilitiesPrivilegedArgs = {
  input?: InputMaybe<GridTaskCapabilityListInput>;
};


export type QueryGridTaskExecutionPrivilegedArgs = {
  input: GridTaskExecutionInput;
};


export type QueryGridTaskExecutionsPrivilegedArgs = {
  input?: InputMaybe<GridTaskExecutionListInput>;
  pagination: PaginationInput;
};


export type QueryGridTaskPrivilegedArgs = {
  input: GridTaskInput;
};


export type QueryGridTaskProviderSupportPrivilegedArgs = {
  input?: InputMaybe<TaskProviderSupportListInput>;
};


export type QueryGridTasksPrivilegedArgs = {
  input?: InputMaybe<GridTaskListInput>;
};


export type QueryPortCheckArgs = {
  input: PortCheckInput;
};


export type QueryPortCheckHistoryArgs = {
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


export type QuerySupportTicketsArgs = {
  pagination: PaginationInput;
};


export type QuerySupportTicketsPrivilegedArgs = {
  pagination: PaginationInput;
};


export type QueryWaitListEntriesArgs = {
  pagination: PaginationInput;
  waitListId?: InputMaybe<Scalars['String']['input']>;
  waitListIdentifier?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWaitListsArgs = {
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
  RequiresAction = 'RequiresAction'
}

/** The format of the string rich-content */
export enum RichContentFormat {
  Html = 'Html',
  Markdown = 'Markdown',
  PlainText = 'PlainText'
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
  orderSlip?: Maybe<ShippingOrderSlip>;
  packageInfo: ShippingPackageInfo;
  shippedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  source: Scalars['String']['output'];
  status: ShipmentStatus;
  statusDescription?: Maybe<Scalars['String']['output']>;
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
  Shipped = 'Shipped'
}

export type ShippingLabel = {
  __typename?: 'ShippingLabel';
  carrier: Scalars['String']['output'];
  labelId: Scalars['String']['output'];
  serviceType: ShippingServiceType;
  source: ShippingLabelSource;
  trackingNumber: Scalars['String']['output'];
  trackingUrl?: Maybe<Scalars['String']['output']>;
};

export enum ShippingLabelSource {
  Others = 'Others',
  Stamps = 'Stamps'
}

export type ShippingOrderSlip = {
  __typename?: 'ShippingOrderSlip';
  storedObjectUrl?: Maybe<Scalars['String']['output']>;
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
  UspsFirstClassMail = 'USPSFirstClassMail',
  UspsMediaMail = 'USPSMediaMail',
  UspsParcelSelect = 'USPSParcelSelect',
  UspsPriorityMail = 'USPSPriorityMail',
  UspsPriorityMailExpress = 'USPSPriorityMailExpress'
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
  User = 'User'
}

export enum SupportTicketCommentVisibility {
  Internal = 'Internal',
  Public = 'Public'
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
  Open = 'Open'
}

export type SupportTicketUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type TaskProviderSupportListInput = {
  cloudProviderId?: InputMaybe<Scalars['String']['input']>;
  taskId?: InputMaybe<Scalars['String']['input']>;
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
  Year = 'Year'
}

export enum UniqueFieldValidationResult {
  Available = 'Available',
  Forbidden = 'Forbidden',
  Invalid = 'Invalid',
  Taken = 'Taken'
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

export type UpdateProductBundleInput = {
  addItems?: InputMaybe<Array<CreateProductBundleItemInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  identifier?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  removeItems?: InputMaybe<Array<Scalars['String']['input']>>;
  updateItems?: InputMaybe<Array<UpdateProductBundleItemInput>>;
  visibility?: InputMaybe<ProductBundleVisibility>;
};

export type UpdateProductBundleItemInput = {
  indexId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
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
  Inactive = 'Inactive'
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
};

export type WaitListCreationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  emailAutomationKey?: InputMaybe<Scalars['String']['input']>;
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
  emailAutomationKey?: InputMaybe<Scalars['String']['input']>;
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
  Subtract = 'Subtract'
}

export type WarehouseUpdateInput = {
  address?: InputMaybe<StreetAddressInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AccountAuthenticationRegistrationOrSignInCreateMutationVariables = Exact<{
  input: AccountRegistrationOrSignInCreateInput;
}>;


export type AccountAuthenticationRegistrationOrSignInCreateMutation = { __typename?: 'Mutation', accountAuthenticationRegistrationOrSignInCreate: { __typename?: 'AuthenticationRegistrationOrSignIn', emailAddress: string, authentication: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } } };

export type AccountAuthenticationQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountAuthenticationQuery = { __typename?: 'Query', accountAuthentication?: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } | null };

export type AccountAuthenticationEmailVerificationQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountAuthenticationEmailVerificationQuery = { __typename?: 'Query', accountAuthenticationEmailVerification?: { __typename?: 'AuthenticationEmailVerification', verification: { __typename?: 'EmailVerification', status: EmailVerificationStatus, emailAddress: string, lastEmailSentAt?: any | null }, authentication: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } } | null };

export type AccountAuthenticationEmailVerificationSendMutationVariables = Exact<{ [key: string]: never; }>;


export type AccountAuthenticationEmailVerificationSendMutation = { __typename?: 'Mutation', accountAuthenticationEmailVerificationSend: { __typename?: 'AuthenticationEmailVerification', verification: { __typename?: 'EmailVerification', status: EmailVerificationStatus, emailAddress: string, lastEmailSentAt?: any | null }, authentication: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } } };

export type AccountAuthenticationEmailVerificationVerifyMutationVariables = Exact<{
  input: AccountEmailVerificationVerifyInput;
}>;


export type AccountAuthenticationEmailVerificationVerifyMutation = { __typename?: 'Mutation', accountAuthenticationEmailVerificationVerify: { __typename?: 'AuthenticationEmailVerification', verification: { __typename?: 'EmailVerification', status: EmailVerificationStatus, emailAddress: string, lastEmailSentAt?: any | null }, authentication: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } } };

export type AccountAuthenticationPasswordVerifyMutationVariables = Exact<{
  input: AccountPasswordVerifyInput;
}>;


export type AccountAuthenticationPasswordVerifyMutation = { __typename?: 'Mutation', accountAuthenticationPasswordVerify: { __typename?: 'AuthenticationOperationResult', success: boolean, authentication: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } } };

export type AccountMaintenanceSessionCreateMutationVariables = Exact<{ [key: string]: never; }>;


export type AccountMaintenanceSessionCreateMutation = { __typename?: 'Mutation', accountMaintenanceSessionCreate: { __typename?: 'AuthenticationSession', status: AuthenticationSessionStatus, scopeType: string, updatedAt: any, createdAt: any, currentChallenge?: { __typename?: 'AuthenticationChallenge', challengeType: string, status: AuthenticationChallengeStatus } | null } };

export type AccountAuthenticationRegistrationCompleteMutationVariables = Exact<{
  input: AccountRegistrationCompleteInput;
}>;


export type AccountAuthenticationRegistrationCompleteMutation = { __typename?: 'Mutation', accountAuthenticationRegistrationComplete: { __typename?: 'AuthenticationOperationResult', success: boolean } };

export type AccountAuthenticationSignInCompleteMutationVariables = Exact<{ [key: string]: never; }>;


export type AccountAuthenticationSignInCompleteMutation = { __typename?: 'Mutation', accountAuthenticationSignInComplete: { __typename?: 'AuthenticationOperationResult', success: boolean } };

export type AccountPasswordUpdateMutationVariables = Exact<{
  input: AccountPasswordUpdateInput;
}>;


export type AccountPasswordUpdateMutation = { __typename?: 'Mutation', accountPasswordUpdate: { __typename?: 'OperationResult', success: boolean } };

export type AccountSignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type AccountSignOutMutation = { __typename?: 'Mutation', accountSignOut: { __typename?: 'OperationResult', success: boolean } };

export type AccountQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountQuery = { __typename?: 'Query', account: { __typename?: 'Account', emailAddress: string, accessRoles: Array<string>, createdAt: any, profile: { __typename?: 'Profile', id: string, username: string, displayName?: string | null, givenName?: string | null, familyName?: string | null, updatedAt: any, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null } } };

export type AccountPrivilegedQueryVariables = Exact<{
  input: AccountInput;
}>;


export type AccountPrivilegedQuery = { __typename?: 'Query', accountPrivileged?: { __typename?: 'Account', emailAddress: string, accessRoles: Array<string>, createdAt: any, profiles: Array<{ __typename?: 'Profile', username: string, displayName?: string | null, givenName?: string | null, familyName?: string | null, updatedAt: any, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null }> } | null };

export type AccountsPrivilegedQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type AccountsPrivilegedQuery = { __typename?: 'Query', accountsPrivileged: { __typename?: 'PagedAccounts', items: Array<{ __typename?: 'Account', emailAddress: string, profiles: Array<{ __typename?: 'Profile', username: string, displayName?: string | null, givenName?: string | null, familyName?: string | null, countryCode?: string | null, updatedAt: any, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null }> }>, pagination: { __typename?: 'Pagination', itemsTotal: number, itemsPerPage: number, page: number, pagesTotal: number, itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null } } };

export type AccountProfileUsernameValidateQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type AccountProfileUsernameValidateQuery = { __typename?: 'Query', accountProfileUsernameValidate: UniqueFieldValidationResult };

export type AccountEnrolledChallengesQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountEnrolledChallengesQuery = { __typename?: 'Query', account: { __typename?: 'Account', enrolledChallenges: Array<string> } };

export type AccountProfileUpdateMutationVariables = Exact<{
  input: AccountProfileUpdateInput;
}>;


export type AccountProfileUpdateMutation = { __typename?: 'Mutation', accountProfileUpdate: { __typename?: 'Profile', username: string, displayName?: string | null, givenName?: string | null, familyName?: string | null, updatedAt: any, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null } };

export type AccountProfilePublicQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type AccountProfilePublicQuery = { __typename?: 'Query', accountProfilePublic?: { __typename?: 'PublicProfile', username: string, displayName?: string | null, createdAt?: any | null, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null } | null };

export type AccountAccessRolesPrivilegedQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountAccessRolesPrivilegedQuery = { __typename?: 'Query', accountAccessRolesPrivileged: Array<{ __typename?: 'AccessRole', id: string, type: string, description?: string | null }> };

export type AccountAccessRoleAssignmentsPrivilegedQueryVariables = Exact<{
  statuses?: InputMaybe<Array<AccessRoleStatus> | AccessRoleStatus>;
  pagination: PaginationInput;
}>;


export type AccountAccessRoleAssignmentsPrivilegedQuery = { __typename?: 'Query', accountAccessRoleAssignmentsPrivileged: { __typename?: 'PagedAccessRoleAssignments', items: Array<{ __typename?: 'AccessRoleAssignment', id: string, status: AccessRoleStatus, emailAddress?: string | null, expiresAt?: any | null, createdAt: any, updatedAt: any, accessRole: { __typename?: 'AccessRole', id: string, type: string, description?: string | null }, profile: { __typename?: 'Profile', username: string, displayName?: string | null, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null } }>, pagination: { __typename?: 'Pagination', itemsTotal: number, itemsPerPage: number, page: number, pagesTotal: number, itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null } } };

export type AccountAccessRoleAssignmentRevokePrivilegedMutationVariables = Exact<{
  input: AccessRoleAssignmentRevokeInput;
}>;


export type AccountAccessRoleAssignmentRevokePrivilegedMutation = { __typename?: 'Mutation', accountAccessRoleAssignmentRevokePrivileged: { __typename?: 'OperationResult', success: boolean } };

export type AccountAccessRoleAssignmentCreatePrivilegedMutationVariables = Exact<{
  input: AccessRoleAssignmentCreateInput;
}>;


export type AccountAccessRoleAssignmentCreatePrivilegedMutation = { __typename?: 'Mutation', accountAccessRoleAssignmentCreatePrivileged: { __typename?: 'AccessRoleAssignment', id: string, status: AccessRoleStatus, expiresAt?: any | null, createdAt: any, updatedAt: any, accessRole: { __typename?: 'AccessRole', id: string, type: string, description?: string | null }, profile: { __typename?: 'Profile', username: string, displayName?: string | null, createdAt: any, images?: Array<{ __typename?: 'ImageObject', type: MediaObjectType, url: string, variant?: string | null }> | null } } };

export type AccountDeleteMutationVariables = Exact<{
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountDeleteMutation = { __typename?: 'Mutation', accountDelete: { __typename?: 'OperationResult', success: boolean } };

export type AccountDeletePrivilegedMutationVariables = Exact<{
  input: AccountDeleteInput;
}>;


export type AccountDeletePrivilegedMutation = { __typename?: 'Mutation', accountDeletePrivileged: { __typename?: 'OperationResult', success: boolean } };

export type AccountProfileImageRemoveMutationVariables = Exact<{ [key: string]: never; }>;


export type AccountProfileImageRemoveMutation = { __typename?: 'Mutation', accountProfileImageRemove: { __typename?: 'Profile', id: string, username: string, displayName?: string | null, updatedAt: any, createdAt: any, images?: Array<{ __typename?: 'ImageObject', url: string, variant?: string | null }> | null } };

export type CommerceCheckoutSessionCreateDirectMutationVariables = Exact<{
  input: CommerceCheckoutSessionCreateDirectInput;
}>;


export type CommerceCheckoutSessionCreateDirectMutation = { __typename?: 'Mutation', commerceCheckoutSessionCreateDirect: { __typename?: 'CommerceCheckoutSession', id: string, externalMetadata?: any | null, createdAt: any } };

export type CommerceOrdersByCheckoutSessionQueryVariables = Exact<{
  checkoutSessionId: Scalars['String']['input'];
}>;


export type CommerceOrdersByCheckoutSessionQuery = { __typename?: 'Query', commerceOrdersByCheckoutSession: Array<{ __typename?: 'CommerceOrder', identifier: string, status: CommerceOrderStatus, paymentStatus?: PaymentStatus | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, emailAddress: string, createdAt: any, lineItems?: Array<{ __typename?: 'CommerceOrderLineItem', id: string, status: CommerceOrderLineItemStatus, productVariantId: string, quantity: number, updatedAt: any, createdAt: any }> | null, shippingInfo?: { __typename?: 'CommerceOrderShippingInfo', shippingAddress: { __typename?: 'StreetAddressObject', firstName: string, lastName: string, company?: string | null, phoneNumber?: string | null, line1: string, line2?: string | null, city: string, state: string, postalCode: string, country: string } } | null, payment?: { __typename?: 'Payment', paymentMethod?: { __typename?: 'PaymentMethodAppleInAppPurchase' } | { __typename?: 'PaymentMethodCreditCard', type: PaymentMethodType, last4: string, cardType: CreditCardType, billingAddress: { __typename?: 'StreetAddressObject', firstName: string, lastName: string, company?: string | null, phoneNumber?: string | null, line1: string, line2?: string | null, city: string, state: string, postalCode: string, country: string } } | null } | null, priceInfo: { __typename?: 'CommerceOrderPrice', currencyCode: string, originalSubtotal: any, subtotal: any, amount: any, shippingRate: { __typename?: 'CommerceOrderShippingRate', originalAmount: any, amount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } }, appliedDiscounts?: Array<{ __typename?: 'CommerceOrderDiscount', amount: any, code?: string | null }> | null } | { __typename?: 'PublicCommerceOrder', identifier: string, status: CommerceOrderStatus, paymentStatus?: PaymentStatus | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, createdAt: any, lineItems?: Array<{ __typename?: 'PublicCommerceOrderLineItem', id: string, status: CommerceOrderLineItemStatus, productVariantId: string, quantity: number }> | null, priceInfo: { __typename?: 'CommerceOrderPrice', currencyCode: string, originalSubtotal: any, subtotal: any, amount: any, shippingRate: { __typename?: 'CommerceOrderShippingRate', originalAmount: any, amount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } } }> };

export type CommerceOrdersQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type CommerceOrdersQuery = { __typename?: 'Query', commerceOrders: { __typename?: 'PaginationOrderResult', items: Array<{ __typename?: 'CommerceOrder', id: string, identifier: string, status: CommerceOrderStatus, paymentStatus?: PaymentStatus | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, updatedAt: any, createdAt: any, lineItems?: Array<{ __typename?: 'CommerceOrderLineItem', id: string, status: CommerceOrderLineItemStatus, productVariantId: string, quantity: number }> | null, priceInfo: { __typename?: 'CommerceOrderPrice', amount: any, originalSubtotal: any }, appliedDiscounts?: Array<{ __typename?: 'CommerceOrderDiscount', amount: any, code?: string | null }> | null }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number } } };

export type CommerceOrderQueryVariables = Exact<{
  orderIdentifier: Scalars['String']['input'];
}>;


export type CommerceOrderQuery = { __typename?: 'Query', commerceOrder: { __typename?: 'CommerceOrder', identifier: string, status: CommerceOrderStatus, paymentStatus?: PaymentStatus | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, emailAddress: string, createdAt: any, statusRecords?: Array<{ __typename?: 'StatusRecord', status: string, timestamp: any, description?: string | null }> | null, lineItems?: Array<{ __typename?: 'CommerceOrderLineItem', id: string, indexId: number, status: CommerceOrderLineItemStatus, productVariantId: string, quantity: number, updatedAt: any, createdAt: any }> | null, shipments?: Array<{ __typename?: 'Shipment', id: string, orderIndexId: number, status: ShipmentStatus, shippedAt?: any | null, deliveredAt?: any | null, cancelledAt?: any | null, updatedAt: any, createdAt: any, label?: { __typename?: 'ShippingLabel', carrier: string, serviceType: ShippingServiceType, trackingNumber: string, trackingUrl?: string | null } | null, packageInfo: { __typename?: 'ShippingPackageInfo', items: Array<{ __typename?: 'ShippingPackageItem', indexId: number, quantity: number }> } }> | null, shippingInfo?: { __typename?: 'CommerceOrderShippingInfo', shippingAddress: { __typename?: 'StreetAddressObject', firstName: string, lastName: string, company?: string | null, phoneNumber?: string | null, line1: string, line2?: string | null, city: string, state: string, postalCode: string, country: string } } | null, payment?: { __typename?: 'Payment', paymentMethod?: { __typename?: 'PaymentMethodAppleInAppPurchase' } | { __typename?: 'PaymentMethodCreditCard', type: PaymentMethodType, last4: string, cardType: CreditCardType, billingAddress: { __typename?: 'StreetAddressObject', firstName: string, lastName: string, company?: string | null, phoneNumber?: string | null, line1: string, line2?: string | null, city: string, state: string, postalCode: string, country: string } } | null } | null, priceInfo: { __typename?: 'CommerceOrderPrice', currencyCode: string, originalSubtotal: any, subtotal: any, amount: any, shippingRate: { __typename?: 'CommerceOrderShippingRate', originalAmount: any, amount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } }, appliedDiscounts?: Array<{ __typename?: 'CommerceOrderDiscount', amount: any, code?: string | null }> | null } | { __typename?: 'PublicCommerceOrder', identifier: string, status: CommerceOrderStatus, paymentStatus?: PaymentStatus | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, createdAt: any, lineItems?: Array<{ __typename?: 'PublicCommerceOrderLineItem', id: string, status: CommerceOrderLineItemStatus, productVariantId: string, quantity: number }> | null, priceInfo: { __typename?: 'CommerceOrderPrice', currencyCode: string, originalSubtotal: any, subtotal: any, amount: any, shippingRate: { __typename?: 'CommerceOrderShippingRate', originalAmount: any, amount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } } } };

export type CommerceOrdersPrivilegedQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type CommerceOrdersPrivilegedQuery = { __typename?: 'Query', commerceOrdersPrivileged: { __typename?: 'PaginationOrderResult', items: Array<{ __typename?: 'CommerceOrder', createdAt: any, emailAddress: string, fulfillmentSource?: string | null, fulfillmentStatus: CommerceOrderFulfillmentStatus, id: string, identifier: string, metadata?: any | null, paymentStatus?: PaymentStatus | null, source: string, status: CommerceOrderStatus, updatedAt: any, lineItems?: Array<{ __typename?: 'CommerceOrderLineItem', createdAt: any, id: string, indexId: number, productVariantId: string, quantity: number, status: CommerceOrderLineItemStatus, updatedAt: any }> | null, payment?: { __typename?: 'Payment', amount: any, authorizedAt?: any | null, cancelledAt?: any | null, capturedAt?: any | null, confirmedAt?: any | null, createdAt: any, currencyCode: string, externalReferenceId?: string | null, id: string, paymentProcessorType: PaymentProcessorType, status: PaymentStatus, updatedAt: any, paymentMethod?: { __typename?: 'PaymentMethodAppleInAppPurchase', externalResourceId?: string | null, paymentProcessorType: PaymentProcessorType, type: PaymentMethodType } | { __typename?: 'PaymentMethodCreditCard', externalResourceId?: string | null, cardType: CreditCardType, expirationMonth: number, expirationYear: number, last4: string, paymentProcessorType: PaymentProcessorType, type: PaymentMethodType, billingAddress: { __typename?: 'StreetAddressObject', city: string, company?: string | null, country: string, firstName: string, lastName: string, line1: string, line2?: string | null, postalCode: string, state: string, phoneNumber?: string | null } } | null } | null, priceInfo: { __typename?: 'CommerceOrderPrice', amount: any, currencyCode: string, originalSubtotal: any, subtotal: any, lineItemPrices: Array<{ __typename?: 'CommerceOrderLineItemPrice', indexId: number, originalSubtotal: any, subtotal: any }>, shippingRate: { __typename?: 'CommerceOrderShippingRate', amount: any, originalAmount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } }, shipments?: Array<{ __typename?: 'Shipment', cancelledAt?: any | null, createdAt: any, createdByAccountId?: string | null, createdByProfileId?: string | null, deliveredAt?: any | null, deliveryStatus: DeliveryStatus, id: string, orderIndexId: number, shippedAt?: any | null, source: string, status: ShipmentStatus, updatedAt: any, updatedByAccountId?: string | null, updatedByProfileId?: string | null, label?: { __typename?: 'ShippingLabel', carrier: string, serviceType: ShippingServiceType, trackingNumber: string, trackingUrl?: string | null } | null, toAddress: { __typename?: 'StreetAddressObject', city: string, company?: string | null, country: string, firstName: string, lastName: string, line1: string, line2?: string | null, phoneNumber?: string | null, state: string, postalCode: string } }> | null, shippingInfo?: { __typename?: 'CommerceOrderShippingInfo', shippingAddress: { __typename?: 'StreetAddressObject', city: string, country: string, company?: string | null, lastName: string, firstName: string, line1: string, line2?: string | null, phoneNumber?: string | null, postalCode: string, state: string } } | null }>, pagination: { __typename?: 'Pagination', itemsTotal: number, itemsPerPage: number, page: number, pagesTotal: number, itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null } } };

export type DataInteractionDatabasesQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type DataInteractionDatabasesQuery = { __typename?: 'Query', dataInteractionDatabases: { __typename?: 'PagedDatabasesResult', items: Array<{ __typename?: 'DatebaseMetadata', databaseName: string }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type DataInteractionDatabaseTableQueryVariables = Exact<{
  databaseName: Scalars['String']['input'];
  tableName: Scalars['String']['input'];
}>;


export type DataInteractionDatabaseTableQuery = { __typename?: 'Query', dataInteractionDatabaseTable: { __typename?: 'DatabaseTableMetadata', databaseName: string, tableName: string, columns?: Array<{ __typename?: 'DatabaseTableColumn', name: string, type: string, isKey: boolean, isPrimaryKey: boolean, keyTableName?: string | null, possibleValues?: Array<string> | null, isNullable: boolean, isGenerated: boolean, length: string }> | null, relations?: Array<{ __typename?: 'DatabaseTableRelation', fieldName: string, type: string, tableName: string, inverseFieldName?: string | null, inverseType?: string | null, inverseTableName?: string | null }> | null } };

export type DataInteractionDatabaseTableMetricsQueryVariables = Exact<{
  input: DataInteractionDatabaseTableMetricsQueryInput;
}>;


export type DataInteractionDatabaseTableMetricsQuery = { __typename?: 'Query', dataInteractionDatabaseTableMetrics: Array<{ __typename?: 'DataInteractionDatabaseMetrics', timeInterval: TimeInterval, data: Array<any> }> };

export type DataInteractionDatabaseTablesQueryVariables = Exact<{
  databaseName?: InputMaybe<Scalars['String']['input']>;
  pagination: PaginationInput;
}>;


export type DataInteractionDatabaseTablesQuery = { __typename?: 'Query', dataInteractionDatabaseTables: { __typename?: 'DatabaseTablesResult', items: Array<{ __typename?: 'DatabaseTableMetadata', databaseName: string, tableName: string }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type DataInteractionDatabaseTableRowsQueryVariables = Exact<{
  databaseName: Scalars['String']['input'];
  tableName: Scalars['String']['input'];
  pagination: PaginationInput;
  filters?: InputMaybe<ColumnFilterGroupInput>;
}>;


export type DataInteractionDatabaseTableRowsQuery = { __typename?: 'Query', dataInteractionDatabaseTableRows: { __typename?: 'DatabaseTableMetadataWithRows', items: Array<any>, databaseName: string, tableName: string, rowCount: number, columns?: Array<{ __typename?: 'DatabaseTableColumn', name: string, type: string, isKey: boolean, isPrimaryKey: boolean, keyTableName?: string | null, possibleValues?: Array<string> | null, isNullable: boolean, isGenerated: boolean, length: string }> | null, relations?: Array<{ __typename?: 'DatabaseTableRelation', fieldName: string, tableName: string, type: string, inverseFieldName?: string | null, inverseType?: string | null, inverseTableName?: string | null }> | null, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type EngagementEventCreateMutationVariables = Exact<{
  input: CreateEngagementEventInput;
}>;


export type EngagementEventCreateMutation = { __typename?: 'Mutation', engagementEventCreate: { __typename?: 'OperationResult', success: boolean } };

export type EngagementEventsCreateMutationVariables = Exact<{
  input: Array<CreateEngagementEventInput> | CreateEngagementEventInput;
}>;


export type EngagementEventsCreateMutation = { __typename?: 'Mutation', engagementEventsCreate: { __typename?: 'OperationResult', success: boolean } };

export type EngagementOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type EngagementOverviewQuery = { __typename?: 'Query', engagementOverview: { __typename?: 'EngagementOverview', uniqueDeviceIds: number, deviceCategoryPercentages: any, views: Array<{ __typename?: 'EngagementViewOverview', uniqueDeviceCount: number, viewIdentifier?: string | null }>, locations: Array<{ __typename?: 'EngagementLocationOverview', uniqueDeviceCount: number, countryCode?: string | null, latitude?: string | null, longitude?: string | null }> } };

export type FormQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type FormQuery = { __typename?: 'Query', form: { __typename?: 'Form', identifier: string, title?: string | null, description?: string | null, status: FormStatus, updatedAt: any, createdAt: any, metadata?: { __typename?: 'FormMetadata', theme?: { __typename?: 'FormThemeMetadata', backgroundColor?: string | null, primaryColor?: string | null, header?: { __typename?: 'FontConfig', fontFamily: string, fontSize: number } | null, question?: { __typename?: 'FontConfig', fontFamily: string, fontSize: number } | null, text?: { __typename?: 'FontConfig', fontFamily: string, fontSize: number } | null } | null } | null, components?: Array<{ __typename?: 'FormComponentDataCheckbox', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, options: Array<string>, maxSelections?: number | null } | { __typename?: 'FormComponentDataCheckboxGrid', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, columns: Array<string>, rows: Array<string>, maxSelectionsPerRow?: number | null, allowEmpty?: boolean | null } | { __typename?: 'FormComponentDataDate', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, initialDate?: any | null, minDate?: any | null, maxDate?: any | null } | { __typename?: 'FormComponentDataDropdown', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, options: Array<string>, placeholder?: string | null, defaultOption?: number | null } | { __typename?: 'FormComponentDataLinearScale', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, min: number, max: number, step: any, leftLabel?: string | null, rightLabel?: string | null } | { __typename?: 'FormComponentDataMultipleChoice', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, options: Array<string>, defaultOption?: number | null } | { __typename?: 'FormComponentDataMultipleChoiceGrid', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, columns: Array<string>, rows: Array<string> } | { __typename?: 'FormComponentDataParagraph', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, placeholder?: string | null } | { __typename?: 'FormComponentDataRating', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, icon: string, max: number, allowHalf?: boolean | null, allowZero?: boolean | null } | { __typename?: 'FormComponentDataSectionHeader', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean } | { __typename?: 'FormComponentDataShortAnswer', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, placeholder?: string | null } | { __typename?: 'FormComponentDataTime', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean, initialTime?: any | null, minTime?: any | null, maxTime?: any | null, allowSeconds?: boolean | null, ampm?: boolean | null } | { __typename?: 'FormComponentDataTitleAndDescription', id: string, position: number, section: number, type: FormComponentType, title?: string | null, description?: string | null, required: boolean }> | null } };

export type SubmitFormMutationVariables = Exact<{
  identifier: Scalars['String']['input'];
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['JSON']['input'];
}>;


export type SubmitFormMutation = { __typename?: 'Mutation', submitForm: { __typename?: 'FormUserData', id: string, formId: string } };

export type PostsQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PagedPosts', items: Array<{ __typename?: 'Post', id: string, identifier: string, slug: string, status: PostStatus, title: string, createdByProfileId: string, content?: string | null, upvoteCount: number, downvoteCount: number, voteType?: PostVoteType | null, reportedCount: number, reportStatus?: PostReportStatus | null, metadata?: any | null, latestRevisionId?: string | null, updatedAt: any, createdAt: any, createdByProfile?: { __typename?: 'PublicProfile', displayName?: string | null, username: string, images?: Array<{ __typename?: 'ImageObject', url: string, type: MediaObjectType, variant?: string | null }> | null } | null, topics?: Array<{ __typename?: 'PostTopic', id: string, title: string, slug: string }> | null, reactions?: Array<{ __typename?: 'PostReaction', content: string, count: number, reacted: boolean }> | null }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type PostsMineQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type PostsMineQuery = { __typename?: 'Query', postsMine: { __typename?: 'PagedPosts', items: Array<{ __typename?: 'Post', id: string, identifier: string, slug: string, status: PostStatus, title: string, createdByProfileId: string, content?: string | null, upvoteCount: number, downvoteCount: number, voteType?: PostVoteType | null, reportedCount: number, reportStatus?: PostReportStatus | null, metadata?: any | null, latestRevisionId?: string | null, updatedAt: any, createdAt: any, createdByProfile?: { __typename?: 'PublicProfile', displayName?: string | null, username: string, images?: Array<{ __typename?: 'ImageObject', url: string, type: MediaObjectType, variant?: string | null }> | null } | null, topics?: Array<{ __typename?: 'PostTopic', id: string, title: string, slug: string }> | null, reactions?: Array<{ __typename?: 'PostReaction', content: string, count: number, reacted: boolean }> | null }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type PostQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', id: string, identifier: string, slug: string, status: PostStatus, title: string, createdByProfileId: string, content?: string | null, upvoteCount: number, downvoteCount: number, voteType?: PostVoteType | null, reportedCount: number, reportStatus?: PostReportStatus | null, type: string, metadata?: any | null, latestRevisionId?: string | null, updatedAt: any, createdAt: any, createdByProfile?: { __typename?: 'PublicProfile', displayName?: string | null, username: string, images?: Array<{ __typename?: 'ImageObject', url: string, type: MediaObjectType, variant?: string | null }> | null } | null, topics?: Array<{ __typename?: 'PostTopic', id: string, title: string }> | null, reactions?: Array<{ __typename?: 'PostReaction', content: string, count: number, reacted: boolean }> | null } };

export type PostCreateMutationVariables = Exact<{
  input: PostCreateInput;
}>;


export type PostCreateMutation = { __typename?: 'Mutation', postCreatePrivileged: { __typename?: 'Post', id: string, status: PostStatus, title: string, contentType: RichContentFormat, content?: string | null, settings?: any | null, upvoteCount: number, downvoteCount: number, metadata?: any | null, updatedAt: any, createdAt: any } };

export type PostUpdateMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: PostUpdateInput;
}>;


export type PostUpdateMutation = { __typename?: 'Mutation', postUpdate: { __typename?: 'Post', id: string, status: PostStatus, title: string, contentType: RichContentFormat, content?: string | null, settings?: any | null, upvoteCount: number, downvoteCount: number, metadata?: any | null, updatedAt: any, createdAt: any } };

export type PostDeleteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PostDeleteMutation = { __typename?: 'Mutation', postDelete: string };

export type PostVoteMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  type: PostVoteType;
}>;


export type PostVoteMutation = { __typename?: 'Mutation', postVote: { __typename?: 'OperationResult', success: boolean } };

export type PostUnvoteMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type PostUnvoteMutation = { __typename?: 'Mutation', postUnvote: { __typename?: 'OperationResult', success: boolean } };

export type PostReactionCreateMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type PostReactionCreateMutation = { __typename?: 'Mutation', postReactionCreate: { __typename?: 'OperationResult', success: boolean } };

export type PostReactionDeleteMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type PostReactionDeleteMutation = { __typename?: 'Mutation', postReactionDelete: { __typename?: 'OperationResult', success: boolean } };

export type PostReactionProfilesQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  pagination: PaginationInput;
}>;


export type PostReactionProfilesQuery = { __typename?: 'Query', postReactionProfiles: { __typename?: 'PagedPostReactionProfile', items: Array<{ __typename?: 'PostReactionProfile', username: string, displayName?: string | null, profileId: string }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } };

export type PostReportCreateMutationVariables = Exact<{
  input: PostReportInput;
}>;


export type PostReportCreateMutation = { __typename?: 'Mutation', postReportCreate: { __typename?: 'PostReport', id: string } };

export type PostTopicByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PostTopicByIdQuery = { __typename?: 'Query', postTopicById: { __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any } };

export type PostTopicsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PostTopicsQuery = { __typename?: 'Query', postTopics: Array<{ __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any }> };

export type PostTopicCreateMutationVariables = Exact<{
  input: PostTopicCreateInput;
}>;


export type PostTopicCreateMutation = { __typename?: 'Mutation', postTopicCreate: { __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any } };

export type PostTopicUpdateMutationVariables = Exact<{
  input: PostTopicUpdateInput;
}>;


export type PostTopicUpdateMutation = { __typename?: 'Mutation', postTopicUpdate: { __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any } };

export type PostTopicDeleteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PostTopicDeleteMutation = { __typename?: 'Mutation', postTopicDelete: { __typename?: 'OperationResult', success: boolean } };

export type SupportPostQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
}>;


export type SupportPostQuery = { __typename?: 'Query', post: { __typename?: 'Post', identifier: string, slug: string, status: PostStatus, title: string, description?: string | null, content?: string | null, updatedAt: any, createdAt: any } };

export type SupportPostsQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type SupportPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PagedPosts', pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number }, items: Array<{ __typename?: 'Post', identifier: string, slug: string, status: PostStatus, title: string, description?: string | null, content?: string | null, updatedAt: any, createdAt: any, topics?: Array<{ __typename?: 'PostTopic', id: string, title: string, slug: string }> | null }> } };

export type SupportPostTopicQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  path?: InputMaybe<Scalars['String']['input']>;
  pagination: PaginationInput;
}>;


export type SupportPostTopicQuery = { __typename?: 'Query', postTopic: { __typename?: 'PostTopicQueryResult', topic: { __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any }, subTopics?: Array<{ __typename?: 'PostTopic', id: string, title: string, slug: string, description?: string | null, postCount: number, createdAt: any }> | null, pagedPosts: { __typename?: 'PagedPosts', items: Array<{ __typename?: 'Post', id: string, identifier: string, slug: string, status: PostStatus, title: string, description?: string | null, content?: string | null, metadata?: any | null, updatedAt: any, createdAt: any }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemsPerPage: number, itemsTotal: number, pagesTotal: number, page: number } } } };

export type SupportTicketCreateMutationVariables = Exact<{
  input: SupportTicketCreateInput;
}>;


export type SupportTicketCreateMutation = { __typename?: 'Mutation', supportTicketCreate: { __typename?: 'SupportTicket', id: string, type: string, status: SupportTicketStatus, userEmailAddress: string, title: string, description?: string | null, comments: Array<{ __typename?: 'SupportTicketComment', content: string }> } };

export type SupportTicketUpdateStatusPrivilegedMutationVariables = Exact<{
  id: Scalars['String']['input'];
  status: SupportTicketStatus;
}>;


export type SupportTicketUpdateStatusPrivilegedMutation = { __typename?: 'Mutation', supportTicketUpdateStatusPrivileged: { __typename?: 'SupportTicket', id: string, status: SupportTicketStatus } };

export type SupportTicketsPrivilegedQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type SupportTicketsPrivilegedQuery = { __typename?: 'Query', supportTicketsPrivileged: { __typename?: 'PaginationSupportTicketResult', items: Array<{ __typename?: 'SupportTicket', id: string, identifier: string, status: SupportTicketStatus, type: string, title: string, description?: string | null, userEmailAddress: string, assignedToProfileId?: string | null, createdAt: any, updatedAt: any, lastUserCommentedAt?: any | null, answeredAt?: any | null, answered: boolean, assignedToProfile?: { __typename?: 'PublicProfile', username: string, displayName?: string | null, images?: Array<{ __typename?: 'ImageObject', type: MediaObjectType, url: string, variant?: string | null }> | null } | null, comments: Array<{ __typename?: 'SupportTicketComment', id: string, source: SupportTicketCommentSource, visibility: SupportTicketCommentVisibility, content: string, contentType: RichContentFormat, createdAt: any, attachments?: Array<{ __typename?: 'MediaObject', type: MediaObjectType, url: string, variant?: string | null }> | null }> }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number } } };

export type SupportTicketAssignMutationVariables = Exact<{
  ticketId: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type SupportTicketAssignMutation = { __typename?: 'Mutation', supportTicketAssign: { __typename?: 'SupportTicket', id: string, assignedToProfileId?: string | null, assignedToProfile?: { __typename?: 'PublicProfile', username: string, displayName?: string | null, images?: Array<{ __typename?: 'ImageObject', type: MediaObjectType, url: string, variant?: string | null }> | null } | null } };

export type SupportTicketCommentCreatePrivilegedMutationVariables = Exact<{
  input: SupportTicketCommentCreateInput;
}>;


export type SupportTicketCommentCreatePrivilegedMutation = { __typename?: 'Mutation', supportTicketCommentCreatePrivileged: { __typename?: 'SupportTicketComment', id: string, content: string, contentType: RichContentFormat, source: SupportTicketCommentSource, visibility: SupportTicketCommentVisibility, createdAt: any } };

export type SupportAllSupportProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type SupportAllSupportProfilesQuery = { __typename?: 'Query', supportAllSupportProfiles: Array<{ __typename?: 'PublicProfile', username: string, displayName?: string | null, images?: Array<{ __typename?: 'ImageObject', type: MediaObjectType, url: string, variant?: string | null }> | null }> };

export type SupportTicketAccountAndCommerceOrdersPrivelegedQueryVariables = Exact<{
  email: Scalars['String']['input'];
  pagination: PaginationInput;
}>;


export type SupportTicketAccountAndCommerceOrdersPrivelegedQuery = { __typename?: 'Query', accountPrivileged?: { __typename?: 'Account', defaultProfileId: string, emailAddress: string, status: AccountStatus, defaultProfile: { __typename?: 'Profile', id: string, displayName?: string | null, givenName?: string | null, familyName?: string | null, preferredName?: string | null, username: string, createdAt: any, images?: Array<{ __typename?: 'ImageObject', type: MediaObjectType, url: string, variant?: string | null }> | null } } | null, commerceOrdersPrivileged: { __typename?: 'PaginationOrderResult', items: Array<{ __typename?: 'CommerceOrder', id: string, fulfillmentStatus: CommerceOrderFulfillmentStatus, emailAddress: string, identifier: string, paymentStatus?: PaymentStatus | null, source: string, status: CommerceOrderStatus, metadata?: any | null, createdAt: any, updatedAt: any, lineItems?: Array<{ __typename?: 'CommerceOrderLineItem', createdAt: any, id: string, indexId: number, productVariantId: string, quantity: number, status: CommerceOrderLineItemStatus, updatedAt: any }> | null, priceInfo: { __typename?: 'CommerceOrderPrice', amount: any, currencyCode: string, originalSubtotal: any, subtotal: any, lineItemPrices: Array<{ __typename?: 'CommerceOrderLineItemPrice', indexId: number, originalSubtotal: any, subtotal: any }>, shippingRate: { __typename?: 'CommerceOrderShippingRate', amount: any, originalAmount: any }, tax: { __typename?: 'CommerceOrderTax', shipping: any, total: any } }, discounts?: Array<{ __typename?: 'Discount', code?: string | null }> | null, shippingInfo?: { __typename?: 'CommerceOrderShippingInfo', shippingAddress: { __typename?: 'StreetAddressObject', line1: string, line2?: string | null, city: string, company?: string | null, country: string, firstName: string, lastName: string, phoneNumber?: string | null, postalCode: string, state: string } } | null }>, pagination: { __typename?: 'Pagination', pagesTotal: number, page: number, itemsTotal: number, itemsPerPage: number, itemIndexForPreviousPage?: number | null, itemIndexForNextPage?: number | null, itemIndex: number } } };

export type ProfileSupportTicketsQueryVariables = Exact<{
  openTicketsIndex: Scalars['Int']['input'];
  closedTicketsIndex: Scalars['Int']['input'];
}>;


export type ProfileSupportTicketsQuery = { __typename?: 'Query', openTickets: { __typename?: 'PaginationSupportTicketResult', items: Array<{ __typename?: 'SupportTicket', id: string, identifier: string, status: SupportTicketStatus, type: string, title: string, description?: string | null, userEmailAddress: string, createdAt: any, updatedAt: any, comments: Array<{ __typename?: 'SupportTicketComment', id: string, source: SupportTicketCommentSource, visibility: SupportTicketCommentVisibility, content: string, contentType: RichContentFormat, createdAt: any }> }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number } }, closedTickets: { __typename?: 'PaginationSupportTicketResult', items: Array<{ __typename?: 'SupportTicket', id: string, identifier: string, status: SupportTicketStatus, type: string, title: string, description?: string | null, userEmailAddress: string, createdAt: any, updatedAt: any, comments: Array<{ __typename?: 'SupportTicketComment', id: string, source: SupportTicketCommentSource, visibility: SupportTicketCommentVisibility, content: string, contentType: RichContentFormat, createdAt: any }> }>, pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number } } };

export type ProfileSupportTicketQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type ProfileSupportTicketQuery = { __typename?: 'Query', supportTickets: { __typename?: 'PaginationSupportTicketResult', items: Array<{ __typename?: 'SupportTicket', id: string, identifier: string, status: SupportTicketStatus, type: string, title: string, description?: string | null, userEmailAddress: string, createdAt: any, updatedAt: any, comments: Array<{ __typename?: 'SupportTicketComment', id: string, source: SupportTicketCommentSource, visibility: SupportTicketCommentVisibility, content: string, contentType: RichContentFormat, createdAt: any, attachments?: Array<{ __typename?: 'MediaObject', type: MediaObjectType, url: string, variant?: string | null }> | null }> }> } };

export type WaitListsQueryVariables = Exact<{
  pagination: PaginationInput;
}>;


export type WaitListsQuery = { __typename?: 'Query', waitLists: { __typename?: 'WaitListResult', pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number }, items: Array<{ __typename?: 'WaitList', id: string, identifier: string, title: string, description?: string | null, updatedAt: any, createdAt: any }> } };

export type WaitListCreateMutationVariables = Exact<{
  data: WaitListCreationInput;
}>;


export type WaitListCreateMutation = { __typename?: 'Mutation', waitListCreate: { __typename?: 'WaitList', id: string, identifier: string, title: string, description?: string | null, updatedAt: any, createdAt: any } };

export type WaitListEntriesQueryVariables = Exact<{
  waitListIdentifier: Scalars['String']['input'];
  pagination: PaginationInput;
}>;


export type WaitListEntriesQuery = { __typename?: 'Query', waitListEntries: { __typename?: 'WaitListEntriesResult', pagination: { __typename?: 'Pagination', itemIndex: number, itemIndexForNextPage?: number | null, itemIndexForPreviousPage?: number | null, itemsPerPage: number, itemsTotal: number, page: number, pagesTotal: number }, items: Array<{ __typename?: 'WaitListEntry', id: string, emailAddress: string, message?: string | null, userAgent?: string | null, countryCode?: string | null, referredBy?: string | null, contactedAt?: any | null, updatedAt: any, createdAt: any }> } };

export type WaitListEntryCreateMutationVariables = Exact<{
  emailAddress: Scalars['String']['input'];
  waitlistIdentifier?: Scalars['String']['input'];
}>;


export type WaitListEntryCreateMutation = { __typename?: 'Mutation', waitListEntryCreate: { __typename?: 'WaitListEntry', id: string, emailAddress: string } };


export const AccountAuthenticationRegistrationOrSignInCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationRegistrationOrSignInCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountRegistrationOrSignInCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationRegistrationOrSignInCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"authentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationRegistrationOrSignInCreateMutation, AccountAuthenticationRegistrationOrSignInCreateMutationVariables>;
export const AccountAuthenticationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountAuthentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationQuery, AccountAuthenticationQueryVariables>;
export const AccountAuthenticationEmailVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountAuthenticationEmailVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationEmailVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lastEmailSentAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationEmailVerificationQuery, AccountAuthenticationEmailVerificationQueryVariables>;
export const AccountAuthenticationEmailVerificationSendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationEmailVerificationSend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationEmailVerificationSend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lastEmailSentAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationEmailVerificationSendMutation, AccountAuthenticationEmailVerificationSendMutationVariables>;
export const AccountAuthenticationEmailVerificationVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationEmailVerificationVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountEmailVerificationVerifyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationEmailVerificationVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lastEmailSentAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationEmailVerificationVerifyMutation, AccountAuthenticationEmailVerificationVerifyMutationVariables>;
export const AccountAuthenticationPasswordVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationPasswordVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountPasswordVerifyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationPasswordVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"authentication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationPasswordVerifyMutation, AccountAuthenticationPasswordVerifyMutationVariables>;
export const AccountMaintenanceSessionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountMaintenanceSessionCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountMaintenanceSessionCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}},{"kind":"Field","name":{"kind":"Name","value":"currentChallenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challengeType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountMaintenanceSessionCreateMutation, AccountMaintenanceSessionCreateMutationVariables>;
export const AccountAuthenticationRegistrationCompleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationRegistrationComplete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountRegistrationCompleteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationRegistrationComplete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationRegistrationCompleteMutation, AccountAuthenticationRegistrationCompleteMutationVariables>;
export const AccountAuthenticationSignInCompleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAuthenticationSignInComplete"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAuthenticationSignInComplete"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountAuthenticationSignInCompleteMutation, AccountAuthenticationSignInCompleteMutationVariables>;
export const AccountPasswordUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountPasswordUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountPasswordUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountPasswordUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountPasswordUpdateMutation, AccountPasswordUpdateMutationVariables>;
export const AccountSignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountSignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountSignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountSignOutMutation, AccountSignOutMutationVariables>;
export const AccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountQuery, AccountQueryVariables>;
export const AccountPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountPrivilegedQuery, AccountPrivilegedQueryVariables>;
export const AccountsPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountsPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountsPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<AccountsPrivilegedQuery, AccountsPrivilegedQueryVariables>;
export const AccountProfileUsernameValidateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountProfileUsernameValidate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountProfileUsernameValidate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<AccountProfileUsernameValidateQuery, AccountProfileUsernameValidateQueryVariables>;
export const AccountEnrolledChallengesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountEnrolledChallenges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledChallenges"}}]}}]}}]} as unknown as DocumentNode<AccountEnrolledChallengesQuery, AccountEnrolledChallengesQueryVariables>;
export const AccountProfileUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountProfileUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountProfileUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountProfileUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountProfileUpdateMutation, AccountProfileUpdateMutationVariables>;
export const AccountProfilePublicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountProfilePublic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountProfilePublic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountProfilePublicQuery, AccountProfilePublicQueryVariables>;
export const AccountAccessRolesPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountAccessRolesPrivileged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAccessRolesPrivileged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<AccountAccessRolesPrivilegedQuery, AccountAccessRolesPrivilegedQueryVariables>;
export const AccountAccessRoleAssignmentsPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountAccessRoleAssignmentsPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessRoleStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAccessRoleAssignmentsPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<AccountAccessRoleAssignmentsPrivilegedQuery, AccountAccessRoleAssignmentsPrivilegedQueryVariables>;
export const AccountAccessRoleAssignmentRevokePrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAccessRoleAssignmentRevokePrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessRoleAssignmentRevokeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAccessRoleAssignmentRevokePrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountAccessRoleAssignmentRevokePrivilegedMutation, AccountAccessRoleAssignmentRevokePrivilegedMutationVariables>;
export const AccountAccessRoleAssignmentCreatePrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountAccessRoleAssignmentCreatePrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessRoleAssignmentCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountAccessRoleAssignmentCreatePrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AccountAccessRoleAssignmentCreatePrivilegedMutation, AccountAccessRoleAssignmentCreatePrivilegedMutationVariables>;
export const AccountDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountDeleteMutation, AccountDeleteMutationVariables>;
export const AccountDeletePrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountDeletePrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountDeleteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountDeletePrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AccountDeletePrivilegedMutation, AccountDeletePrivilegedMutationVariables>;
export const AccountProfileImageRemoveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountProfileImageRemove"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountProfileImageRemove"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AccountProfileImageRemoveMutation, AccountProfileImageRemoveMutationVariables>;
export const CommerceCheckoutSessionCreateDirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommerceCheckoutSessionCreateDirect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommerceCheckoutSessionCreateDirectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commerceCheckoutSessionCreateDirect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CommerceCheckoutSessionCreateDirectMutation, CommerceCheckoutSessionCreateDirectMutationVariables>;
export const CommerceOrdersByCheckoutSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommerceOrdersByCheckoutSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkoutSessionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commerceOrdersByCheckoutSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"checkoutSessionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkoutSessionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommerceOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethodCreditCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appliedDiscounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicCommerceOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CommerceOrdersByCheckoutSessionQuery, CommerceOrdersByCheckoutSessionQueryVariables>;
export const CommerceOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommerceOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commerceOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appliedDiscounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}}]}}]}}]} as unknown as DocumentNode<CommerceOrdersQuery, CommerceOrdersQueryVariables>;
export const CommerceOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommerceOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commerceOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommerceOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"statusRecords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndexId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"serviceType"}},{"kind":"Field","name":{"kind":"Name","value":"trackingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"trackingUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"packageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethodCreditCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"appliedDiscounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicCommerceOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CommerceOrderQuery, CommerceOrderQueryVariables>;
export const CommerceOrdersPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommerceOrdersPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commerceOrdersPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"authorizedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"capturedAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"externalReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalResourceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentProcessorType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethodCreditCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalResourceId"}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"expirationMonth"}},{"kind":"Field","name":{"kind":"Name","value":"expirationYear"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"paymentProcessorType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethodAppleInAppPurchase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"externalResourceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentProcessorType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentProcessorType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"lineItemPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndexId"}},{"kind":"Field","name":{"kind":"Name","value":"label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"carrier"}},{"kind":"Field","name":{"kind":"Name","value":"serviceType"}},{"kind":"Field","name":{"kind":"Name","value":"trackingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"trackingUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippedAt"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"toAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedByAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedByProfileId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<CommerceOrdersPrivilegedQuery, CommerceOrdersPrivilegedQueryVariables>;
export const DataInteractionDatabasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataInteractionDatabases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataInteractionDatabases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databaseName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<DataInteractionDatabasesQuery, DataInteractionDatabasesQueryVariables>;
export const DataInteractionDatabaseTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataInteractionDatabaseTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataInteractionDatabaseTable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databaseName"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isKey"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryKey"}},{"kind":"Field","name":{"kind":"Name","value":"keyTableName"}},{"kind":"Field","name":{"kind":"Name","value":"possibleValues"}},{"kind":"Field","name":{"kind":"Name","value":"isNullable"}},{"kind":"Field","name":{"kind":"Name","value":"isGenerated"}},{"kind":"Field","name":{"kind":"Name","value":"length"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"inverseFieldName"}},{"kind":"Field","name":{"kind":"Name","value":"inverseType"}},{"kind":"Field","name":{"kind":"Name","value":"inverseTableName"}}]}}]}}]}}]} as unknown as DocumentNode<DataInteractionDatabaseTableQuery, DataInteractionDatabaseTableQueryVariables>;
export const DataInteractionDatabaseTableMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataInteractionDatabaseTableMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataInteractionDatabaseTableMetricsQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataInteractionDatabaseTableMetrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeInterval"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<DataInteractionDatabaseTableMetricsQuery, DataInteractionDatabaseTableMetricsQueryVariables>;
export const DataInteractionDatabaseTablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataInteractionDatabaseTables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataInteractionDatabaseTables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"databaseName"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<DataInteractionDatabaseTablesQuery, DataInteractionDatabaseTablesQueryVariables>;
export const DataInteractionDatabaseTableRowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataInteractionDatabaseTableRows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ColumnFilterGroupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataInteractionDatabaseTableRows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"databaseName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"databaseName"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"databaseName"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isKey"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryKey"}},{"kind":"Field","name":{"kind":"Name","value":"keyTableName"}},{"kind":"Field","name":{"kind":"Name","value":"possibleValues"}},{"kind":"Field","name":{"kind":"Name","value":"isNullable"}},{"kind":"Field","name":{"kind":"Name","value":"isGenerated"}},{"kind":"Field","name":{"kind":"Name","value":"length"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"inverseFieldName"}},{"kind":"Field","name":{"kind":"Name","value":"inverseType"}},{"kind":"Field","name":{"kind":"Name","value":"inverseTableName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<DataInteractionDatabaseTableRowsQuery, DataInteractionDatabaseTableRowsQueryVariables>;
export const EngagementEventCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EngagementEventCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEngagementEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagementEventCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EngagementEventCreateMutation, EngagementEventCreateMutationVariables>;
export const EngagementEventsCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EngagementEventsCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEngagementEventInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagementEventsCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EngagementEventsCreateMutation, EngagementEventsCreateMutationVariables>;
export const EngagementOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EngagementOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagementOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uniqueDeviceIds"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uniqueDeviceCount"}},{"kind":"Field","name":{"kind":"Name","value":"viewIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uniqueDeviceCount"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deviceCategoryPercentages"}}]}}]}}]} as unknown as DocumentNode<EngagementOverviewQuery, EngagementOverviewQueryVariables>;
export const FormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Form"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"primaryColor"}},{"kind":"Field","name":{"kind":"Name","value":"header"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"components"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataCheckbox"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataCheckboxGrid"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"columns"}},{"kind":"Field","name":{"kind":"Name","value":"rows"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelectionsPerRow"}},{"kind":"Field","name":{"kind":"Name","value":"allowEmpty"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataDate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"initialDate"}},{"kind":"Field","name":{"kind":"Name","value":"minDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxDate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataDropdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOption"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataLinearScale"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"leftLabel"}},{"kind":"Field","name":{"kind":"Name","value":"rightLabel"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataMultipleChoice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOption"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataMultipleChoiceGrid"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"columns"}},{"kind":"Field","name":{"kind":"Name","value":"rows"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataParagraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataRating"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"allowHalf"}},{"kind":"Field","name":{"kind":"Name","value":"allowZero"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataSectionHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataShortAnswer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"initialTime"}},{"kind":"Field","name":{"kind":"Name","value":"minTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxTime"}},{"kind":"Field","name":{"kind":"Name","value":"allowSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"ampm"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormComponentDataTitleAndDescription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<FormQuery, FormQueryVariables>;
export const SubmitFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formId"}}]}}]}}]} as unknown as DocumentNode<SubmitFormMutation, SubmitFormMutationVariables>;
export const PostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Posts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"reacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"downvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteType"}},{"kind":"Field","name":{"kind":"Name","value":"reportedCount"}},{"kind":"Field","name":{"kind":"Name","value":"reportStatus"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"latestRevisionId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<PostsQuery, PostsQueryVariables>;
export const PostsMineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostsMine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postsMine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"reacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"downvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteType"}},{"kind":"Field","name":{"kind":"Name","value":"reportedCount"}},{"kind":"Field","name":{"kind":"Name","value":"reportStatus"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"latestRevisionId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<PostsMineQuery, PostsMineQueryVariables>;
export const PostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Post"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"reacted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"downvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteType"}},{"kind":"Field","name":{"kind":"Name","value":"reportedCount"}},{"kind":"Field","name":{"kind":"Name","value":"reportStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"latestRevisionId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostQuery, PostQueryVariables>;
export const PostCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postCreatePrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"upvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"downvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostCreateMutation, PostCreateMutationVariables>;
export const PostUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"upvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"downvoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostUpdateMutation, PostUpdateMutationVariables>;
export const PostDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<PostDeleteMutation, PostDeleteMutationVariables>;
export const PostVoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostVote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostVoteType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postVote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PostVoteMutation, PostVoteMutationVariables>;
export const PostUnvoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostUnvote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postUnvote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PostUnvoteMutation, PostUnvoteMutationVariables>;
export const PostReactionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostReactionCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postReactionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PostReactionCreateMutation, PostReactionCreateMutationVariables>;
export const PostReactionDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostReactionDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postReactionDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PostReactionDeleteMutation, PostReactionDeleteMutationVariables>;
export const PostReactionProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostReactionProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postReactionProfiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"profileId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]} as unknown as DocumentNode<PostReactionProfilesQuery, PostReactionProfilesQueryVariables>;
export const PostReportCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostReportCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postReportCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PostReportCreateMutation, PostReportCreateMutationVariables>;
export const PostTopicByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostTopicById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopicById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostTopicByIdQuery, PostTopicByIdQueryVariables>;
export const PostTopicsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostTopics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostTopicsQuery, PostTopicsQueryVariables>;
export const PostTopicCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostTopicCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostTopicCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopicCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostTopicCreateMutation, PostTopicCreateMutationVariables>;
export const PostTopicUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostTopicUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostTopicUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopicUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostTopicUpdateMutation, PostTopicUpdateMutationVariables>;
export const PostTopicDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostTopicDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopicDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PostTopicDeleteMutation, PostTopicDeleteMutationVariables>;
export const SupportPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SupportPostQuery, SupportPostQueryVariables>;
export const SupportPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SupportPostsQuery, SupportPostsQueryVariables>;
export const SupportPostTopicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportPostTopic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postTopic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"StringValue","value":"SupportArticle","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTopics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagedPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SupportPostTopicQuery, SupportPostTopicQueryVariables>;
export const SupportTicketCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupportTicketCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportTicketCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTicketCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<SupportTicketCreateMutation, SupportTicketCreateMutationVariables>;
export const SupportTicketUpdateStatusPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupportTicketUpdateStatusPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportTicketStatus"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTicketUpdateStatusPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<SupportTicketUpdateStatusPrivilegedMutation, SupportTicketUpdateStatusPrivilegedMutationVariables>;
export const SupportTicketsPrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportTicketsPrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTicketsPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUserCommentedAt"}},{"kind":"Field","name":{"kind":"Name","value":"answeredAt"}},{"kind":"Field","name":{"kind":"Name","value":"answered"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}}]}}]}}]} as unknown as DocumentNode<SupportTicketsPrivilegedQuery, SupportTicketsPrivilegedQueryVariables>;
export const SupportTicketAssignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupportTicketAssign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTicketAssign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ticketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ticketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SupportTicketAssignMutation, SupportTicketAssignMutationVariables>;
export const SupportTicketCommentCreatePrivilegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SupportTicketCommentCreatePrivileged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SupportTicketCommentCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTicketCommentCreatePrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SupportTicketCommentCreatePrivilegedMutation, SupportTicketCommentCreatePrivilegedMutationVariables>;
export const SupportAllSupportProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportAllSupportProfiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportAllSupportProfiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}}]}}]}}]} as unknown as DocumentNode<SupportAllSupportProfilesQuery, SupportAllSupportProfilesQueryVariables>;
export const SupportTicketAccountAndCommerceOrdersPrivelegedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SupportTicketAccountAndCommerceOrdersPriveleged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"defaultProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"preferredName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"commerceOrdersPrivileged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"priceInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"lineItemPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexId"}},{"kind":"Field","name":{"kind":"Name","value":"originalSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shippingInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}}]}}]}}]}}]} as unknown as DocumentNode<SupportTicketAccountAndCommerceOrdersPrivelegedQuery, SupportTicketAccountAndCommerceOrdersPrivelegedQueryVariables>;
export const ProfileSupportTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileSupportTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"openTicketsIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"closedTicketsIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"openTickets"},"name":{"kind":"Name","value":"supportTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"itemsPerPage"},"value":{"kind":"IntValue","value":"3"}},{"kind":"ObjectField","name":{"kind":"Name","value":"itemIndex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"openTicketsIndex"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"filters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"column"},"value":{"kind":"StringValue","value":"status","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"operator"},"value":{"kind":"EnumValue","value":"Equal"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"StringValue","value":"Open","block":false}}]}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"createdAt","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Descending"}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"closedTickets"},"name":{"kind":"Name","value":"supportTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"itemsPerPage"},"value":{"kind":"IntValue","value":"3"}},{"kind":"ObjectField","name":{"kind":"Name","value":"itemIndex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"closedTicketsIndex"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"filters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"column"},"value":{"kind":"StringValue","value":"status","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"operator"},"value":{"kind":"EnumValue","value":"Equal"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"StringValue","value":"Closed","block":false}}]}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"createdAt","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Descending"}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileSupportTicketsQuery, ProfileSupportTicketsQueryVariables>;
export const ProfileSupportTicketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileSupportTicket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"supportTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileSupportTicketQuery, ProfileSupportTicketQueryVariables>;
export const WaitListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WaitLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<WaitListsQuery, WaitListsQueryVariables>;
export const WaitListCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WaitListCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WaitListCreationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitListCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<WaitListCreateMutation, WaitListCreateMutationVariables>;
export const WaitListEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WaitListEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"waitListIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitListEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"waitListIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"waitListIdentifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemIndex"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemIndexForPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"itemsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pagesTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"referredBy"}},{"kind":"Field","name":{"kind":"Name","value":"contactedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<WaitListEntriesQuery, WaitListEntriesQueryVariables>;
export const WaitListEntryCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WaitListEntryCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"waitlistIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"StringValue","value":"earlyAccess","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitListEntryCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"waitListIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"waitlistIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}}]}}]}}]} as unknown as DocumentNode<WaitListEntryCreateMutation, WaitListEntryCreateMutationVariables>;
export type GraphQLInputTypeMetadata =
  GraphQLInputScalarTypeMetadata |
  GraphQLInputEnumTypeMetadata |
  GraphQLInputObjectTypeMetadata;

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
  GraphQLInputObjectScalarFieldMetadata |
  GraphQLInputObjectEnumFieldMetadata |
  GraphQLInputObjectObjectFieldMetadata |
  GraphQLInputObjectListFieldMetadata |
  GraphQLInputObjectScalarListFieldMetadata;

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
            type: 'maxLength',
            constraints: [
              16
            ],
          }
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
            constraints: [
              256
            ],
          }
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
            constraints: [
              512
            ],
          }
        ],
      },
      {
        name: 'emailAutomationKey',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'maxLength',
            constraints: [
              64
            ],
          }
        ],
      }
    ],
  }

  export const SupportTicketStatus: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'SupportTicketStatus',
    values: [
      'Open',
      'Closed',
      'Deleted'
    ],
  }

  export const SupportTicketCommentVisibility: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'SupportTicketCommentVisibility',
    values: [
      'Public',
      'Internal'
    ],
  }

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
            type: 'isUuid',
          }
        ],
      },
      {
        name: 'visibility',
        kind: 'enum',
        type: GraphQLInputTypes.SupportTicketCommentVisibility,
        required: false,
      }
    ],
  }

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
            constraints: [
              256
            ],
          }
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
            constraints: [
              36
            ],
          },
          {
            type: 'isIn',
            constraints: [
              ["Contact","SupportArticleFeedback"]
            ],
          }
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
          }
        ],
      },
      {
        name: 'initialComment',
        kind: 'object',
        type: GraphQLInputTypes.SupportTicketCommentCreateInput,
        required: false,
      }
    ],
  }

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
          }
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
            constraints: [
              64
            ],
          }
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
            constraints: [
              1024
            ],
          }
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
            constraints: [
              160
            ],
          }
        ],
      }
    ],
  }

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
            constraints: [
              64
            ],
          }
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
            constraints: [
              1024
            ],
          }
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
            constraints: [
              ["Principle","Idea","SupportArticle"]
            ],
          },
          {
            type: 'maxLength',
            constraints: [
              24
            ],
          }
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
            constraints: [
              160
            ],
          }
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
          }
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
          }
        ],
      }
    ],
  }

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
          }
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
          }
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
            constraints: [
              256
            ],
          }
        ],
      },
      {
        name: 'note',
        kind: 'scalar',
        type: 'String',
        required: false,
      }
    ],
  }

  export const PostVoteType: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'PostVoteType',
    values: [
      'Upvote',
      'Downvote'
    ],
  }

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
            constraints: [
              1024
            ],
          }
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
            constraints: [
              ["Principle","Idea","SupportArticle"]
            ],
          },
          {
            type: 'maxLength',
            constraints: [
              24
            ],
          }
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
            constraints: [
              160
            ],
          }
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
      }
    ],
  }

  export const RichContentFormat: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'RichContentFormat',
    values: [
      'Markdown',
      'Html',
      'PlainText'
    ],
  }

  export const PostStatus: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'PostStatus',
    values: [
      'Draft',
      'Published',
      'Deleted'
    ],
  }

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
              {"Draft":"Draft","Published":"Published","Deleted":"Deleted"},
              ["Draft","Published","Deleted"]
            ],
          }
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
            constraints: [
              1024
            ],
          }
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
            constraints: [
              ["Principle","Idea","SupportArticle"]
            ],
          },
          {
            type: 'maxLength',
            constraints: [
              24
            ],
          }
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
            constraints: [
              160
            ],
          }
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
          }
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
      }
    ],
  }

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
            type: 'maxLength',
            constraints: [
              512
            ],
          },
          {
            type: 'isNotEmpty',
          }
        ],
      },
      {
        name: 'previousViewIdentifier',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'maxLength',
            constraints: [
              512
            ],
          },
          {
            type: 'isNotEmpty',
          }
        ],
      },
      {
        name: 'traceId',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'isUuid',
          }
        ],
      },
      {
        name: 'traceSequenceNumber',
        kind: 'scalar',
        type: 'Int',
        required: false,
        validation: [
          {
            type: 'isInt',
          }
        ],
      },
      {
        name: 'referrer',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'isUrl',
          },
          {
            type: 'maxLength',
            constraints: [
              512
            ],
          }
        ],
      },
      {
        name: 'viewTitle',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'isNotEmpty',
          },
          {
            type: 'maxLength',
            constraints: [
              512
            ],
          }
        ],
      },
      {
        name: 'previousViewTitle',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'isNotEmpty',
          },
          {
            type: 'maxLength',
            constraints: [
              512
            ],
          }
        ],
      },
      {
        name: 'loadDurationInMilliseconds',
        kind: 'scalar',
        type: 'Int',
        required: false,
        validation: [
          {
            type: 'isPositive',
          },
          {
            type: 'isInt',
          }
        ],
      },
      {
        name: 'viewDurationInMilliseconds',
        kind: 'scalar',
        type: 'Int',
        required: false,
        validation: [
          {
            type: 'isPositive',
          },
          {
            type: 'isInt',
          }
        ],
      },
      {
        name: 'previousViewDurationInMilliseconds',
        kind: 'scalar',
        type: 'Int',
        required: false,
        validation: [
          {
            type: 'isPositive',
          },
          {
            type: 'isInt',
          }
        ],
      },
      {
        name: 'sessionDurationInMilliseconds',
        kind: 'scalar',
        type: 'Int',
        required: false,
        validation: [
          {
            type: 'isPositive',
          },
          {
            type: 'isInt',
          }
        ],
      },
      {
        name: 'loggedAt',
        kind: 'scalar',
        type: 'DateTimeISO',
        required: false,
        validation: [
          {
            type: 'isDate',
          }
        ],
      }
    ],
  }

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
            type: 'maxLength',
            constraints: [
              64
            ],
          },
          {
            type: 'isNotEmpty',
          }
        ],
      }
    ],
  }

  export const DeviceOrientation: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'DeviceOrientation',
    values: [
      'Portrait',
      'Landscape',
      'NotAvailable'
    ],
  }

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
            type: 'isEnum',
            constraints: [
              {"Portrait":"Portrait","Landscape":"Landscape","NotAvailable":"NotAvailable"},
              ["Portrait","Landscape","NotAvailable"]
            ],
          }
        ],
      }
    ],
  }

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
            constraints: [
              64
            ],
          },
          {
            type: 'isNotEmpty',
          }
        ],
      },
      {
        name: 'category',
        kind: 'scalar',
        type: 'String',
        required: false,
        validation: [
          {
            type: 'maxLength',
            constraints: [
              64
            ],
          },
          {
            type: 'isNotEmpty',
          }
        ],
      },
      {
        name: 'deviceProperties',
        kind: 'object',
        type: GraphQLInputTypes.DevicePropertiesInput,
        required: false,
        validation: [
          {
            type: 'unknown',
          }
        ],
      },
      {
        name: 'clientProperties',
        kind: 'object',
        type: GraphQLInputTypes.ClientPropertiesInput,
        required: false,
        validation: [
          {
            type: 'unknown',
          }
        ],
      },
      {
        name: 'eventContext',
        kind: 'object',
        type: GraphQLInputTypes.EngagementEventContextInput,
        required: false,
        validation: [
          {
            type: 'unknown',
          }
        ],
      }
    ],
  }

  export const ColumnFilterGroupOperator: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'ColumnFilterGroupOperator',
    values: [
      'And',
      'Or'
    ],
  }

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
      }
    ],
  }

  export const TimeInterval: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'TimeInterval',
    values: [
      'Hour',
      'HourOfDay',
      'Day',
      'DayOfWeek',
      'DayOfMonth',
      'Month',
      'MonthOfYear',
      'Quarter',
      'Year'
    ],
  }

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
          }
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
      }
    ],
  }

  export const PaymentProcessorType: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'PaymentProcessorType',
    values: [
      'StripeProxy',
      'StripeEmbedded',
      'AppleInAppPurchase'
    ],
  }

  export const CheckoutSessionCreateDirectItemInput: GraphQLInputObjectTypeMetadata = {
    kind: 'object',
    type: 'CheckoutSessionCreateDirectItemInput',
    fields: [
      {
        name: 'productVariantId',
        kind: 'scalar',
        type: 'String',
        required: true,
        validation: [
          {
            type: 'isUuid',
          }
        ],
      },
      {
        name: 'quantity',
        kind: 'scalar',
        type: 'Int',
        required: true,
        validation: [
          {
            type: 'isPositive',
          }
        ],
      }
    ],
  }

  export const CommerceCheckoutSessionCreateDirectInput: GraphQLInputObjectTypeMetadata = {
    kind: 'object',
    type: 'CommerceCheckoutSessionCreateDirectInput',
    fields: [
      {
        name: 'items',
        kind: 'object',
        type: GraphQLInputTypes.CheckoutSessionCreateDirectItemInput,
        required: true,
        validation: [
          {
            type: 'arrayNotEmpty',
          }
        ],
      },
      {
        name: 'emailAddress',
        kind: 'scalar',
        type: 'String',
        required: false,
      },
      {
        name: 'paymentProcessorType',
        kind: 'enum',
        type: GraphQLInputTypes.PaymentProcessorType,
        required: true,
      },
      {
        name: 'returnBaseUrl',
        kind: 'scalar',
        type: 'String',
        required: true,
        validation: [
          {
            type: 'isUrl',
          }
        ],
      },
      {
        name: 'orderMetadata',
        kind: 'scalar',
        type: 'JSON',
        required: false,
      }
    ],
  }

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
          }
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
            constraints: [
              128
            ],
          }
        ],
      }
    ],
  }

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
          }
        ],
      },
      {
        name: 'username',
        kind: 'scalar',
        type: 'String',
        required: true,
      }
    ],
  }

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
          }
        ],
      },
      {
        name: 'username',
        kind: 'scalar',
        type: 'String',
        required: true,
      }
    ],
  }

  export const AccessRoleStatus: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'AccessRoleStatus',
    values: [
      'Active',
      'Expired',
      'Revoked'
    ],
  }

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
            constraints: [
              3,
              32
            ],
          },
          {
            type: 'isString',
          }
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
            constraints: [
              128
            ],
          }
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
            constraints: [
              128
            ],
          }
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
            constraints: [
              128
            ],
          }
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
            constraints: [
              128
            ],
          }
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
            constraints: [
              128
            ],
          }
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
          }
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
          }
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
            constraints: [
              32
            ],
          }
        ],
      }
    ],
  }

  export const OrderByDirection: GraphQLInputEnumTypeMetadata = {
    kind: 'enum',
    type: 'OrderByDirection',
    values: [
      'Ascending',
      'Descending'
    ],
  }

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
      }
    ],
  }

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
      'IsNotNull'
    ],
  }

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
      }
    ],
  }

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
      }
    ],
  }

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
          }
        ],
      }
    ],
  }

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
          }
        ],
      }
    ],
  }

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
      }
    ],
  }

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
            constraints: [
              8
            ],
          },
          {
            type: 'maxLength',
            constraints: [
              90
            ],
          }
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
            constraints: [
              3,
              32
            ],
          }
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
            constraints: [
              3,
              32
            ],
          }
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
          }
        ],
      },
      {
        name: 'encryptionConfiguration',
        kind: 'object',
        type: GraphQLInputTypes.AccountEncryptionConfiguration,
        required: false,
      }
    ],
  }

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
          }
        ],
      }
    ],
  }

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
          }
        ],
      }
    ],
  }

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
          }
        ],
      }
    ],
  }
}

export interface GraphQLOperationMetadata<DocumentType> {
  readonly operation: string;
  readonly operationType: 'query' | 'mutation' | 'subscription';
  readonly document: DocumentType;
  readonly parameters?: ReadonlyArray<GraphQLOperationParameterMetadata>;
}

export type GraphQLOperationParameterMetadata =
  GraphQLOperationScalarParameterMetadata |
  GraphQLOperationUnitParameterMetadata |
  GraphQLOperationListParameterMetadata |
  GraphQLOperationScalarListParameterMetadata;

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

export const AccountAuthenticationRegistrationOrSignInCreateOperation: GraphQLOperationMetadata<typeof AccountAuthenticationRegistrationOrSignInCreateDocument> = {
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
}
  
export const AccountAuthenticationEmailVerificationVerifyOperation: GraphQLOperationMetadata<typeof AccountAuthenticationEmailVerificationVerifyDocument> = {
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
}
  
export const AccountAuthenticationPasswordVerifyOperation: GraphQLOperationMetadata<typeof AccountAuthenticationPasswordVerifyDocument> = {
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
}
  
export const AccountAuthenticationRegistrationCompleteOperation: GraphQLOperationMetadata<typeof AccountAuthenticationRegistrationCompleteDocument> = {
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
}
  
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
}
  
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
}
  
export const AccountProfileUsernameValidateOperation: GraphQLOperationMetadata<typeof AccountProfileUsernameValidateDocument> = {
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
}
  
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
}
  
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
}
  
export const AccountAccessRoleAssignmentsPrivilegedOperation: GraphQLOperationMetadata<typeof AccountAccessRoleAssignmentsPrivilegedDocument> = {
  operation: 'AccountAccessRoleAssignmentsPrivileged',
  operationType: 'query',
  document: AccountAccessRoleAssignmentsPrivilegedDocument,
  parameters: [
    {
      parameter: 'statuses',
      required: false,
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
}
  
export const AccountAccessRoleAssignmentRevokePrivilegedOperation: GraphQLOperationMetadata<typeof AccountAccessRoleAssignmentRevokePrivilegedDocument> = {
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
}
  
export const AccountAccessRoleAssignmentCreatePrivilegedOperation: GraphQLOperationMetadata<typeof AccountAccessRoleAssignmentCreatePrivilegedDocument> = {
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
}
  
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
}
  
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
}
  
export const CommerceCheckoutSessionCreateDirectOperation: GraphQLOperationMetadata<typeof CommerceCheckoutSessionCreateDirectDocument> = {
  operation: 'CommerceCheckoutSessionCreateDirect',
  operationType: 'mutation',
  document: CommerceCheckoutSessionCreateDirectDocument,
  parameters: [
    {
      parameter: 'input',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.CommerceCheckoutSessionCreateDirectInput,
    },
  ],
}
  
export const CommerceOrdersByCheckoutSessionOperation: GraphQLOperationMetadata<typeof CommerceOrdersByCheckoutSessionDocument> = {
  operation: 'CommerceOrdersByCheckoutSession',
  operationType: 'query',
  document: CommerceOrdersByCheckoutSessionDocument,
  parameters: [
    {
      parameter: 'checkoutSessionId',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
export const CommerceOrdersOperation: GraphQLOperationMetadata<typeof CommerceOrdersDocument> = {
  operation: 'CommerceOrders',
  operationType: 'query',
  document: CommerceOrdersDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const CommerceOrderOperation: GraphQLOperationMetadata<typeof CommerceOrderDocument> = {
  operation: 'CommerceOrder',
  operationType: 'query',
  document: CommerceOrderDocument,
  parameters: [
    {
      parameter: 'orderIdentifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
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
}
  
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
}
  
export const DataInteractionDatabaseTableOperation: GraphQLOperationMetadata<typeof DataInteractionDatabaseTableDocument> = {
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
}
  
export const DataInteractionDatabaseTableMetricsOperation: GraphQLOperationMetadata<typeof DataInteractionDatabaseTableMetricsDocument> = {
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
}
  
export const DataInteractionDatabaseTablesOperation: GraphQLOperationMetadata<typeof DataInteractionDatabaseTablesDocument> = {
  operation: 'DataInteractionDatabaseTables',
  operationType: 'query',
  document: DataInteractionDatabaseTablesDocument,
  parameters: [
    {
      parameter: 'databaseName',
      required: false,
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
}
  
export const DataInteractionDatabaseTableRowsOperation: GraphQLOperationMetadata<typeof DataInteractionDatabaseTableRowsDocument> = {
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
}
  
export const EngagementEventCreateOperation: GraphQLOperationMetadata<typeof EngagementEventCreateDocument> = {
  operation: 'EngagementEventCreate',
  operationType: 'mutation',
  document: EngagementEventCreateDocument,
  parameters: [
    {
      parameter: 'input',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.CreateEngagementEventInput,
    },
  ],
}
  
export const EngagementEventsCreateOperation: GraphQLOperationMetadata<typeof EngagementEventsCreateDocument> = {
  operation: 'EngagementEventsCreate',
  operationType: 'mutation',
  document: EngagementEventsCreateDocument,
  parameters: [
    {
      parameter: 'input',
      required: true,
      kind: 'list',
      itemKind: 'object',
      type: GraphQLInputTypes.CreateEngagementEventInput,
      allowsEmpty: false,
    },
  ],
}
  
export const FormOperation: GraphQLOperationMetadata<typeof FormDocument> = {
  operation: 'Form',
  operationType: 'query',
  document: FormDocument,
  parameters: [
    {
      parameter: 'identifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
export const SubmitFormOperation: GraphQLOperationMetadata<typeof SubmitFormDocument> = {
  operation: 'SubmitForm',
  operationType: 'mutation',
  document: SubmitFormDocument,
  parameters: [
    {
      parameter: 'identifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
    {
      parameter: 'emailAddress',
      required: false,
      kind: 'scalar',
      type: 'String',
    },
    {
      parameter: 'data',
      required: true,
      kind: 'scalar',
      type: 'JSON',
    },
  ],
}
  
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
}
  
export const PostsMineOperation: GraphQLOperationMetadata<typeof PostsMineDocument> = {
  operation: 'PostsMine',
  operationType: 'query',
  document: PostsMineDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const PostOperation: GraphQLOperationMetadata<typeof PostDocument> = {
  operation: 'Post',
  operationType: 'query',
  document: PostDocument,
  parameters: [
    {
      parameter: 'identifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
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
}
  
export const PostTopicsOperation: GraphQLOperationMetadata<typeof PostTopicsDocument> = {
  operation: 'PostTopics',
  operationType: 'query',
  document: PostTopicsDocument,
  parameters: [
    {
      parameter: 'ids',
      required: false,
      kind: 'list',
      itemKind: 'scalar',
      type: 'String',
      allowsEmpty: false,
    },
  ],
}
  
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
}
  
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
}
  
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
}
  
export const SupportPostOperation: GraphQLOperationMetadata<typeof SupportPostDocument> = {
  operation: 'SupportPost',
  operationType: 'query',
  document: SupportPostDocument,
  parameters: [
    {
      parameter: 'identifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
export const SupportPostsOperation: GraphQLOperationMetadata<typeof SupportPostsDocument> = {
  operation: 'SupportPosts',
  operationType: 'query',
  document: SupportPostsDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const SupportPostTopicOperation: GraphQLOperationMetadata<typeof SupportPostTopicDocument> = {
  operation: 'SupportPostTopic',
  operationType: 'query',
  document: SupportPostTopicDocument,
  parameters: [
    {
      parameter: 'slug',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
    {
      parameter: 'path',
      required: false,
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
}
  
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
}
  
export const SupportTicketUpdateStatusPrivilegedOperation: GraphQLOperationMetadata<typeof SupportTicketUpdateStatusPrivilegedDocument> = {
  operation: 'SupportTicketUpdateStatusPrivileged',
  operationType: 'mutation',
  document: SupportTicketUpdateStatusPrivilegedDocument,
  parameters: [
    {
      parameter: 'id',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
    {
      parameter: 'status',
      required: true,
      kind: 'enum',
      type: GraphQLInputTypes.SupportTicketStatus,
    },
  ],
}
  
export const SupportTicketsPrivilegedOperation: GraphQLOperationMetadata<typeof SupportTicketsPrivilegedDocument> = {
  operation: 'SupportTicketsPrivileged',
  operationType: 'query',
  document: SupportTicketsPrivilegedDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const SupportTicketAssignOperation: GraphQLOperationMetadata<typeof SupportTicketAssignDocument> = {
  operation: 'SupportTicketAssign',
  operationType: 'mutation',
  document: SupportTicketAssignDocument,
  parameters: [
    {
      parameter: 'ticketId',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
    {
      parameter: 'username',
      required: false,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  
export const SupportTicketCommentCreatePrivilegedOperation: GraphQLOperationMetadata<typeof SupportTicketCommentCreatePrivilegedDocument> = {
  operation: 'SupportTicketCommentCreatePrivileged',
  operationType: 'mutation',
  document: SupportTicketCommentCreatePrivilegedDocument,
  parameters: [
    {
      parameter: 'input',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.SupportTicketCommentCreateInput,
    },
  ],
}
  
export const SupportTicketAccountAndCommerceOrdersPrivelegedOperation: GraphQLOperationMetadata<typeof SupportTicketAccountAndCommerceOrdersPrivelegedDocument> = {
  operation: 'SupportTicketAccountAndCommerceOrdersPriveleged',
  operationType: 'query',
  document: SupportTicketAccountAndCommerceOrdersPrivelegedDocument,
  parameters: [
    {
      parameter: 'email',
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
}
  
export const ProfileSupportTicketsOperation: GraphQLOperationMetadata<typeof ProfileSupportTicketsDocument> = {
  operation: 'ProfileSupportTickets',
  operationType: 'query',
  document: ProfileSupportTicketsDocument,
  parameters: [
    {
      parameter: 'openTicketsIndex',
      required: true,
      kind: 'scalar',
      type: 'Int',
    },
    {
      parameter: 'closedTicketsIndex',
      required: true,
      kind: 'scalar',
      type: 'Int',
    },
  ],
}
  
export const ProfileSupportTicketOperation: GraphQLOperationMetadata<typeof ProfileSupportTicketDocument> = {
  operation: 'ProfileSupportTicket',
  operationType: 'query',
  document: ProfileSupportTicketDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const WaitListsOperation: GraphQLOperationMetadata<typeof WaitListsDocument> = {
  operation: 'WaitLists',
  operationType: 'query',
  document: WaitListsDocument,
  parameters: [
    {
      parameter: 'pagination',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.PaginationInput,
    },
  ],
}
  
export const WaitListCreateOperation: GraphQLOperationMetadata<typeof WaitListCreateDocument> = {
  operation: 'WaitListCreate',
  operationType: 'mutation',
  document: WaitListCreateDocument,
  parameters: [
    {
      parameter: 'data',
      required: true,
      kind: 'object',
      type: GraphQLInputTypes.WaitListCreationInput,
    },
  ],
}
  
export const WaitListEntriesOperation: GraphQLOperationMetadata<typeof WaitListEntriesDocument> = {
  operation: 'WaitListEntries',
  operationType: 'query',
  document: WaitListEntriesDocument,
  parameters: [
    {
      parameter: 'waitListIdentifier',
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
}
  
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
      parameter: 'waitlistIdentifier',
      required: true,
      kind: 'scalar',
      type: 'String',
    },
  ],
}
  