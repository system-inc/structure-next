// Interface - EngagementEventInterface
export interface EngagementEventInterface {
    id: string;
    createdAt: string;
    name: string;
    category?: string;
    data?: EngagementEventDataInterface;
    viewIdentifier?: string;
    viewTitle?: string;
    visitStartAt?: string;
    visitId?: string;
    traceId?: string;
    traceSequence?: number;
    referrer?: string;
    requestId?: string;
    clientEnvironment?: string;
    ipAddress?: string;
    deviceId?: string;
    deviceOrientation?: string;
    accountId?: string;
    profileId?: string;
    sessionId?: string;
    loggedAt?: string;
}

// Interface - EngagementEventDataInterface
export interface EngagementEventDataInterface {
    asn?: number;
    city?: string;
    colo?: string;
    region?: string;
    country?: string;
    latitude?: string;
    timezone?: string;
    continent?: string;
    longitude?: string;
    tlsCipher?: string;
    postalCode?: string;
    regionCode?: string;
    tlsVersion?: string;
    isEUCountry?: boolean;
    clientTcpRtt?: number;
    eventContext?: {
        visitId?: string;
        loggedAt?: string;
        viewTitle?: string;
        visitStartAt?: string;
        additionalData?: Record<string, unknown>;
        viewIdentifier?: string;
    };
    httpProtocol?: string;
    tlsClientAuth?: Record<string, unknown>;
    asOrganization?: string;
    requestPriority?: string;
    tlsClientRandom?: string;
    deviceProperties?: {
        orientation?: string;
    };
    requestHeaderNames?: Record<string, unknown>;
    verifiedBotCategory?: string;
    clientAcceptEncoding?: string;
    tlsClientCiphersSha1?: string;
    tlsClientHelloLength?: string;
    tlsClientExtensionsSha1?: string;
    tlsClientExtensionsSha1Le?: string;
    edgeRequestKeepAliveStatus?: number;
}

// Interface - UserDeviceInterface
export interface UserDeviceInterface {
    id: string;
    lastIpAddress?: string;
    userAgent?: string;
    client?: string;
    clientVersion?: string;
    clientCategory?: string;
    deviceCategory?: string;
    manufacturer?: string;
    model?: string;
    operatingSystem?: string;
    operatingSystemVersion?: string;
    locale?: string;
    updatedAt: string;
    createdAt: string;
}
