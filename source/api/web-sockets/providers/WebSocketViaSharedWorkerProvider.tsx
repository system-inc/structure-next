'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useWebSocketViaSharedWorker } from '@structure/source/api/web-sockets/hooks/useWebSocketViaSharedWorker';

// Dependencies - Types
import {
    SharedWorkerServerClientConnection,
    WebSocketConnectionState,
    WebSocketState,
} from '@structure/source/api/web-sockets/types/WebSocketTypes';

// Context - WebSocketViaSharedWorkerContext
export interface WebSocketViaSharedWorkerContextInterface {
    // SharedWorker connection
    isSupported: boolean; // Whether SharedWorker is supported by the browser
    isConnected: boolean;
    clientId?: string;

    // Client connections
    sharedWorkerServerClientConnections: SharedWorkerServerClientConnection[];
    requestSharedWorkerServerClientConnections: () => void;

    // WebSocket connection
    webSocketState: WebSocketState; // Comprehensive WebSocket state object

    // WebSocket actions
    connectWebSocket: (url: string, protocols?: string | string[]) => void;
    disconnectWebSocket: (code?: number, reason?: string) => void;
    sendWebSocketMessage: (data: unknown) => void;
}
const WebSocketViaSharedWorkerContext = React.createContext<WebSocketViaSharedWorkerContextInterface>({
    // SharedWorker connection
    isSupported: false,
    isConnected: false,

    // Client connections
    sharedWorkerServerClientConnections: [],
    requestSharedWorkerServerClientConnections: () => {
        // No-op for default context
    },

    // WebSocket connection
    webSocketState: {
        connectionState: WebSocketConnectionState.Disconnected,
        createdAt: Date.now(),
    },

    // WebSocket actions
    connectWebSocket: () => {
        // No-op for default context
    },
    disconnectWebSocket: () => {
        // No-op for default context
    },
    sendWebSocketMessage: () => {
        // No-op for default context
    },
});

// Hook to use shared WebSocket context
export function useSharedWebSocketContext() {
    return React.useContext(WebSocketViaSharedWorkerContext);
}

// Component - WebSocketViaSharedWorkerProvider
export interface WebSocketViaSharedWorkerProviderInterface {
    children: React.ReactNode;
}
export function WebSocketViaSharedWorkerProvider(properties: WebSocketViaSharedWorkerProviderInterface) {
    // Hooks
    const webSocketViaSharedWorker = useWebSocketViaSharedWorker();

    // Create the context value
    const contextValue: WebSocketViaSharedWorkerContextInterface = {
        // SharedWorker connection
        isSupported: webSocketViaSharedWorker.isSharedWorkerSupported ?? false,
        isConnected: webSocketViaSharedWorker.isSharedWorkerConnected ?? false,
        clientId: webSocketViaSharedWorker.sharedWorkerClientIdAssignedFromServer,

        // Client connections
        sharedWorkerServerClientConnections: webSocketViaSharedWorker.sharedWorkerServerClientConnections ?? [],
        requestSharedWorkerServerClientConnections: webSocketViaSharedWorker.requestSharedWorkerServerClientConnections,

        // WebSocket state
        webSocketState: webSocketViaSharedWorker.webSocketState,

        // WebSocket actions
        connectWebSocket: webSocketViaSharedWorker.connectWebSocket,
        disconnectWebSocket: webSocketViaSharedWorker.disconnectWebSocket,
        sendWebSocketMessage: webSocketViaSharedWorker.sendWebSocketMessage,
    };

    // Render the component
    return (
        <WebSocketViaSharedWorkerContext.Provider value={contextValue}>
            {properties.children}
        </WebSocketViaSharedWorkerContext.Provider>
    );
}

// Export - Default
export default WebSocketViaSharedWorkerProvider;
