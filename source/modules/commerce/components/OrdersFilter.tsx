'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - API
import { CommerceOrderStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Interface - OrdersFilterInterface
export interface OrdersFilterInterface {
    emailAddress?: string;
    status?: CommerceOrderStatus;
}

// Component - OrdersFilter
export interface OrdersFilterProperties {
    onFiltersChange: (filters: OrdersFilterInterface) => void;
}

export function OrdersFilter(properties: OrdersFilterProperties) {
    // State
    const [emailAddress, setEmailAddress] = React.useState<string>('');
    const [status, setStatus] = React.useState<string>('all');

    // Functions
    function handleApplyFilters() {
        properties.onFiltersChange({
            emailAddress: emailAddress.trim() || undefined,
            status: status !== 'all' ? (status as CommerceOrderStatus) : undefined,
        });
    }

    function handleReset() {
        setEmailAddress('');
        setStatus('all');
        properties.onFiltersChange({});
    }

    // Generate status options from enum
    const statusOptions = [
        { value: 'all', content: 'All Statuses' },
        ...Object.values(CommerceOrderStatus).map((status) => ({
            value: status,
            content: status,
        })),
    ];

    // Render the component
    return (
        <div className="mb-6 rounded-medium border border-neutral/10 bg-light p-4 dark:bg-dark+2">
            <h3 className="mb-2  text-base font-medium">Search</h3>
            <div className="grid gap-4 md:grid-cols-4">
                {/* Email Search */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <InputText
                        id="email-filter"
                        placeholder="Enter email..."
                        defaultValue={emailAddress}
                        onChange={function (value) {
                            setEmailAddress(value || '');
                        }}
                        onKeyDown={function (event) {
                            if(event.key === 'Enter') {
                                handleApplyFilters();
                            }
                        }}
                        variant="search"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Status</label>
                    <InputSelect
                        items={statusOptions}
                        defaultValue={status}
                        onChange={function (value) {
                            setStatus(value || 'all');
                        }}
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-end gap-2 md:col-span-2">
                    <Button onClick={handleApplyFilters}>Search</Button>
                    <Button variant="ghost" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
