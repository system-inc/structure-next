// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import type { PaginationInput } from '@structure/source/api/graphql/GraphQlGeneratedCode';

export function useCommerceOrdersPrivilegedRequest(pagination: PaginationInput) {
    return networkService.useGraphQlQuery(
        gql(`
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
        `),
        {
            pagination: pagination,
        },
    );
}
