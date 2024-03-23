// import FulfillmentNavigation from '@project/tmp/components/Internal/Fulfillment/FulfillmentNavigation';
import React from 'react';

type Properties = {
    children: React.ReactNode;
};

const FulfillmentLayout = (properties: Properties) => {
    return (
        <>
            <div className="relative -top-5">{/* <FulfillmentNavigation /> */}</div>

            {properties.children}
        </>
    );
};

export default FulfillmentLayout;
