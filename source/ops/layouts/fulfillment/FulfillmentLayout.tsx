// import FulfillmentNavigation from '@project/tmp/components/Internal/Fulfillment/FulfillmentNavigation';
import React from 'react';

type FulfillmentLayoutProperties = {
    children: React.ReactNode;
};
export function FulfillmentLayout(properties: FulfillmentLayoutProperties) {
    return (
        <>
            <div className="relative -top-5">{/* <FulfillmentNavigation /> */}</div>
            {properties.children}
        </>
    );
}
