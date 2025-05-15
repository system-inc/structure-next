// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    OrderByDirection,
    SupportTicketAccountAndCommerceOrdersPrivelegedDocument,
    SupportTicketAccountAndCommerceOrdersPrivelegedQuery,
    ColumnFilterConditionOperator,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

export function useAccountAndCommerceOrdersByEmail(email?: string) {
    // Queries
    const accountAndCommerceOrdersByEmailQuery = useQuery<SupportTicketAccountAndCommerceOrdersPrivelegedQuery>(
        SupportTicketAccountAndCommerceOrdersPrivelegedDocument,
        {
            variables: email
                ? {
                      email,
                      pagination: {
                          filters: [
                              {
                                  column: 'emailAddress',
                                  operator: ColumnFilterConditionOperator.Equal,
                                  value: email,
                              },
                          ],
                          orderBy: [
                              {
                                  key: 'createdAt',
                                  direction: OrderByDirection.Descending,
                              },
                          ],
                          itemsPerPage: 10,
                      },
                  }
                : undefined,
            skip: !email,
            fetchPolicy: 'cache-and-network',
            // notifyOnNetworkStatusChange: true,
        },
    );

    // Return the query state
    return {
        accountAndCommerceOrdersByEmailQuery,
    };
}
