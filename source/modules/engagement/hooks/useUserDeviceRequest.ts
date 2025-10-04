'use client'; // This hook uses client-only features

// Dependencies - Types
import { UserDeviceInterface } from '@structure/source/modules/engagement/types/EngagementTypes';

// Dependencies - API
import { useDataInteractionDatabaseTableRowsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRowsRequest';
import { ColumnFilterConditionOperator, OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useUserDeviceRequest
export function useUserDeviceRequest(databaseName: string, deviceId: string) {
    const dataInteractionDatabaseTableRowsRequest = useDataInteractionDatabaseTableRowsRequest(
        databaseName,
        'UserDevice',
        {
            itemsPerPage: 1,
            itemIndex: 0,
            orderBy: [
                {
                    key: 'createdAt',
                    direction: OrderByDirection.Descending,
                },
            ],
        },
        {
            conditions: [
                {
                    column: 'id',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: deviceId,
                },
            ],
        },
    );

    // Extract the device from the response
    const device = (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows.items?.[0] ||
        null) as UserDeviceInterface | null;

    return {
        device,
        isLoading: dataInteractionDatabaseTableRowsRequest.isLoading,
        error: dataInteractionDatabaseTableRowsRequest.error,
        refresh: dataInteractionDatabaseTableRowsRequest.refresh,
    };
}
