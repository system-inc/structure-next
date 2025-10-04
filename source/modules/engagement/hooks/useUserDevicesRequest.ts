'use client'; // This hook uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { UserDeviceInterface } from '@structure/source/modules/engagement/types/EngagementTypes';

// Dependencies - API
import { useDataInteractionDatabaseTableRowsRequest } from '@structure/source/modules/data-interaction/hooks/useDataInteractionDatabaseTableRowsRequest';
import { ColumnFilterConditionOperator, OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useUserDevicesRequest
export function useUserDevicesRequest(deviceIds: string[]) {
    const dataInteractionDatabaseTableRowsRequest = useDataInteractionDatabaseTableRowsRequest(
        'readonly',
        'UserDevice',
        {
            itemsPerPage: 100,
            itemIndex: 0,
            orderBy: [
                {
                    key: 'createdAt',
                    direction: OrderByDirection.Descending,
                },
            ],
        },
        deviceIds.length > 0
            ? {
                  conditions: [
                      {
                          column: 'id',
                          operator: ColumnFilterConditionOperator.In,
                          value: deviceIds,
                      },
                  ],
              }
            : undefined,
        {
            enabled: deviceIds.length > 0,
        },
    );

    // Extract devices and create a map by ID
    const devices = React.useMemo(
        function () {
            return (dataInteractionDatabaseTableRowsRequest.data?.dataInteractionDatabaseTableRows.items ||
                []) as UserDeviceInterface[];
        },
        [dataInteractionDatabaseTableRowsRequest.data],
    );

    const devicesById = React.useMemo(
        function () {
            const map = new Map<string, UserDeviceInterface>();
            devices.forEach(function (device) {
                map.set(device.id, device);
            });
            return map;
        },
        [devices],
    );

    return {
        devicesById,
        devices,
        isLoading: dataInteractionDatabaseTableRowsRequest.isLoading,
        error: dataInteractionDatabaseTableRowsRequest.error,
        refresh: dataInteractionDatabaseTableRowsRequest.refresh,
    };
}
