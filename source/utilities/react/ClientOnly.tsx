import React from 'react';

const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if(!isClient) {
        return null;
    }

    return children;
};

export default ClientOnly;
