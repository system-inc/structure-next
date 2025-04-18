'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { SharedWorkerClientConnectionInterface } from '@structure/source/api/web-sockets/shared-worker/SharedWorkerClientConnection';
import {
    SharedWorkerServerToClientMessageType,
    ClientToSharedWorkerServerMessageType,
    SharedWorkerServerToClientMessageInterface,
    ClientToSharedWorkerServerMessageInterface,
} from '@structure/source/api/web-sockets/shared-worker/types/SharedWorkerTypes';
import {
    WebSocketConnectionState,
    WebSocketConnectionInformationInterface,
    WebSocketSharedWorkerServerToClientMessageType,
    ClientToWebSocketSharedWorkerServerMessageType,
} from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// Types - WebSocketMessageEventInterface
export interface WebSocketMessageEventInterface {
    data: unknown;
}

// Type - WebSocketMessageHandler
export type WebSocketMessageHandler = (message: WebSocketMessageEventInterface) => void;

// Context - WebSocketViaSharedWorkerContext
export interface WebSocketViaSharedWorkerContextInterface {
    // SharedWorker connection
    isSharedWorkerSupported: boolean; // Whether SharedWorker is supported by the browser
    isSharedWorkerConnected: boolean;
    sharedWorkerClientIdAssignedFromServer?: string;

    // Client connections
    sharedWorkerServerClientConnections: SharedWorkerClientConnectionInterface[];
    requestSharedWorkerServerClientConnections: () => void;

    // WebSocket connection information, use a getter to ensure we always access the latest state
    readonly webSocketConnectionInformation: WebSocketConnectionInformationInterface; // Comprehensive WebSocket state object

    // WebSocket actions
    connectWebSocket: (url: string, protocols?: string | string[]) => void;
    disconnectWebSocket: (code?: number, reason?: string) => void;
    sendWebSocketMessage: (data: unknown) => void;
    onWebSocketMessage: (handler: WebSocketMessageHandler) => () => void;
}
const WebSocketViaSharedWorkerContext = React.createContext<WebSocketViaSharedWorkerContextInterface | undefined>(
    undefined,
);

// Component - WebSocketViaSharedWorkerProvider
export interface WebSocketViaSharedWorkerProviderInterface {
    children: React.ReactNode;
}
export function WebSocketViaSharedWorkerProvider(properties: WebSocketViaSharedWorkerProviderInterface) {
    // State
    const [isSharedWorkerSupported, setIsSharedWorkerSupported] = React.useState<boolean>(false);
    const [isSharedWorkerConnected, setIsSharedWorkerConnected] = React.useState<boolean>(false);
    const [sharedWorkerServerClientConnections, setSharedWorkerServerClientConnections] = React.useState<
        SharedWorkerClientConnectionInterface[]
    >([]);

    // References
    const isInitializedReference = React.useRef<boolean>(false);
    const sharedWorkerReference = React.useRef<SharedWorker>();
    const sharedWorkerClientIdAssignedFromServerReference = React.useRef<string>();
    const webSocketMessageHandlersReference = React.useRef<WebSocketMessageHandler[]>([]);
    // Use a reference for web socket connection information to avoid React state update delays
    const webSocketConnectionInformationReference = React.useRef<WebSocketConnectionInformationInterface>({
        url: null,
        state: WebSocketConnectionState.Disconnected,
        createdAt: Date.now(),
    });

    // Calculate the WebSocket URL from ProjectSettings
    const webSocketUrl =
        ProjectSettings.apis.base.host && ProjectSettings.apis.base.webSocketPath
            ? 'wss://' + ProjectSettings.apis.base.host + ProjectSettings.apis.base.webSocketPath
            : null;

    // Function to send a message to the SharedWorker
    const sendMessage = React.useCallback(function (message: ClientToSharedWorkerServerMessageInterface) {
        // If the SharedWorker is connected
        if(sharedWorkerReference.current && sharedWorkerReference.current.port) {
            // Send the message
            sharedWorkerReference.current.port.postMessage(message);
        }
    }, []);

    // Function to handle messages from the SharedWorker
    const handleMessage = React.useCallback(
        function (messageEvent: MessageEvent<SharedWorkerServerToClientMessageInterface>) {
            if(!messageEvent.data) return;

            switch(messageEvent.data.type) {
                // Handle heartbeat ping messages
                case SharedWorkerServerToClientMessageType.Ping:
                    // console.log('[SharedWorker] Received ping, sending pong');
                    sendMessage({ type: ClientToSharedWorkerServerMessageType.Pong });
                    break;

                // Handle client ID assignment
                case SharedWorkerServerToClientMessageType.ClientIdAssigned:
                    // console.log('[SharedWorker] Received client ID:', messageEvent.data.clientId);
                    sharedWorkerClientIdAssignedFromServerReference.current = messageEvent.data.clientId;
                    break;

                // Handle client connections list
                case SharedWorkerServerToClientMessageType.ClientConnections:
                    // console.log('[SharedWorker] Received client connections:', messageEvent.data.clientConnections);
                    setSharedWorkerServerClientConnections(messageEvent.data.clientConnections);
                    break;

                // Handle WebSocket state changes
                case WebSocketSharedWorkerServerToClientMessageType.WebSocketConnectionInformation:
                    // Log WebSocket state change with detailed info
                    // console.log(
                    //     '[SharedWorker] WebSocket state updated:',
                    //     'Old:',
                    //     webSocketConnectionInformationReference.current.state,
                    //     '→ New:',
                    //     messageEvent.data.state,
                    //     'Timestamp:',
                    //     new Date().toISOString(),
                    // );

                    // The message extends WebSocketState, so we can set it directly on the reference
                    // This ensures immediate access to the latest state
                    webSocketConnectionInformationReference.current = {
                        ...messageEvent.data,
                        // Make sure we always have at least these required fields
                        createdAt: messageEvent.data.createdAt || Date.now(),
                    };
                    break;

                // Handle WebSocket messages
                case WebSocketSharedWorkerServerToClientMessageType.WebSocketMessage:
                    // console.log('[SharedWorker] WebSocket message received:', messageEvent.data);
                    // console.log(
                    //     '[SharedWorker] Registered message handlers:',
                    //     webSocketMessageHandlersReference.current.length,
                    // );

                    // Create an event message object from the received data
                    const eventMessage: WebSocketMessageEventInterface = {
                        data: messageEvent.data.data,
                    };

                    // Notify all registered handlers
                    const handlers = webSocketMessageHandlersReference.current;
                    if(handlers.length > 0) {
                        // console.log('[SharedWorker] Notifying handlers:', handlers.length);
                        handlers.forEach(function (handler) {
                            try {
                                handler(eventMessage);
                            }
                            catch(error) {
                                console.error('[WebSocketViaSharedWorkerProvider] Error in message handler:', error);
                            }
                        });
                    }
                    else {
                        // console.warn('[SharedWorker] No handlers registered for WebSocket messages');
                    }
                    break;
                // Handle unknown message types
                default:
                    console.warn('[SharedWorker] Unknown message type:', messageEvent.data.type);
                    break;
            }
        },
        [sendMessage],
    );

    // Function to initialize SharedWorker
    const initialize = React.useCallback(
        function () {
            // console.log('[WebSocketViaSharedWorkerProvider] Initializing');

            // If the component is initialized, return
            if(isInitializedReference.current) {
                return;
            }

            // Update the isInitialized reference
            isInitializedReference.current = true;

            // Determine if SharedWorker is supported
            const isSharedWorkerSupported = typeof SharedWorker !== 'undefined';

            // Update the state
            setIsSharedWorkerSupported(isSharedWorkerSupported);

            // If the browser supports SharedWorker, connect to the SharedWorker
            if(isSharedWorkerSupported) {
                try {
                    // Create the SharedWorker
                    const sharedWorker = new SharedWorker(
                        '/api/web-sockets/shared-workers/web-socket-shared-worker.js?v=2025-03-16-a',
                    );
                    // console.log('[WebSocketViaSharedWorkerProvider] Initialized');

                    // Update the reference
                    sharedWorkerReference.current = sharedWorker;

                    // Set up message handler for the worker
                    sharedWorker.port.onmessage = handleMessage;

                    // Update connected state
                    setIsSharedWorkerConnected(true);
                }
                catch(error) {
                    console.error('[WebSocketViaSharedWorkerProvider] Failed to initialize:', error);

                    // Update connected state
                    setIsSharedWorkerConnected(false);
                }
            }
        },
        [handleMessage],
    );

    // Function to request client connections from the SharedWorker
    const requestSharedWorkerServerClientConnections = React.useCallback(
        function () {
            console.log('[WebSocketViaSharedWorkerProvider] Asking SharedWorker for client connections');
            sendMessage({ type: ClientToSharedWorkerServerMessageType.RequestClientConnections });
        },
        [sendMessage],
    );

    // Function to connect to a WebSocket server
    const connectWebSocket = React.useCallback(
        function (url: string, protocols?: string | string[]) {
            // console.log(
            //     '[WebSocketViaSharedWorkerProvider] Sending WebSocket connect request:',
            //     url,
            //     'Current state:',
            //     webSocketConnectionInformationReference.current.state,
            //     'Timestamp:',
            //     new Date().toISOString(),
            // );
            sendMessage({
                type: ClientToWebSocketSharedWorkerServerMessageType.ConnectWebSocket,
                url,
                protocols,
            });
        },
        [sendMessage],
    );

    // Function to disconnect from the WebSocket server
    const disconnectWebSocket = React.useCallback(
        function (code?: number, reason?: string) {
            console.log('[WebSocketViaSharedWorkerProvider] Asking SharedWorker to disconnect from WebSocket');
            sendMessage({
                type: ClientToWebSocketSharedWorkerServerMessageType.DisconnectWebSocket,
                code,
                reason,
            });
        },
        [sendMessage],
    );

    // Function to send a message to the WebSocket server
    const sendWebSocketMessage = React.useCallback(
        function (data: unknown) {
            console.log('[WebSocketViaSharedWorkerProvider] Asking SharedWorker to send message:', data);
            sendMessage({
                type: ClientToWebSocketSharedWorkerServerMessageType.SendWebSocketMessage,
                data,
            });
        },
        [sendMessage],
    );

    // Function to register a handler for WebSocket messages
    const onWebSocketMessage = React.useCallback(function (handler: WebSocketMessageHandler) {
        // Add the handler to the array
        webSocketMessageHandlersReference.current = [...webSocketMessageHandlersReference.current, handler];

        // Return a function to unregister the handler
        return function () {
            webSocketMessageHandlersReference.current = webSocketMessageHandlersReference.current.filter(
                function (currentHandler) {
                    return currentHandler !== handler;
                },
            );
        };
    }, []);

    // Effect to run on mount to initialize
    React.useEffect(
        function () {
            // Initialize the SharedWorker
            initialize();

            // On unmount
            return function () {
                // Do nothing, leave the SharedWorker running and connected
            };
        },
        [initialize],
    );

    // Automatically connect to WebSocket when SharedWorker is connected
    React.useEffect(
        function () {
            if(isSharedWorkerConnected && webSocketUrl) {
                // console.log(
                //     '[WebSocketViaSharedWorkerProvider] Auto-connecting to WebSocket:',
                //     webSocketUrl,
                //     'Current state:',
                //     webSocketConnectionInformationReference.current.state,
                //     'Timestamp:',
                //     new Date().toISOString(),
                // );
                connectWebSocket(webSocketUrl);

                // No clean up on unmount - WebSocket should remain connected in the SharedWorker even when individual tabs close
                return function () {
                    // We intentionally do NOT disconnect the WebSocket here, this allows the connection to persist between tabs
                    // console.log(
                    //     '[WebSocketViaSharedWorkerProvider] Tab closing, but keeping WebSocket alive in SharedWorker',
                    // );
                };
            }
        },
        [isSharedWorkerConnected, webSocketUrl, connectWebSocket],
    );

    // Create the context value
    const contextValue: WebSocketViaSharedWorkerContextInterface = {
        // SharedWorker connection
        isSharedWorkerSupported,
        isSharedWorkerConnected,
        sharedWorkerClientIdAssignedFromServer: sharedWorkerClientIdAssignedFromServerReference.current,

        // Client connections
        sharedWorkerServerClientConnections: sharedWorkerServerClientConnections,
        requestSharedWorkerServerClientConnections: requestSharedWorkerServerClientConnections,

        // Use a getter to ensure we always access the latest state
        get webSocketConnectionInformation() {
            return webSocketConnectionInformationReference.current;
        },

        // WebSocket actions
        connectWebSocket: connectWebSocket,
        disconnectWebSocket: disconnectWebSocket,
        sendWebSocketMessage: sendWebSocketMessage,
        onWebSocketMessage: onWebSocketMessage,
    };

    // Render the component
    return (
        <WebSocketViaSharedWorkerContext.Provider value={contextValue}>
            {properties.children}
        </WebSocketViaSharedWorkerContext.Provider>
    );
}

// Hook - useSharedWebSocketContext
export function useWebSocketViaSharedWorker(): WebSocketViaSharedWorkerContextInterface {
    const useWebSocketViaSharedWorkerContext = React.useContext(WebSocketViaSharedWorkerContext);
    if(!useWebSocketViaSharedWorkerContext) {
        throw new Error('useSharedWebSocketContext must be used within a WebSocketViaSharedWorkerProvider.');
    }
    return useWebSocketViaSharedWorkerContext as WebSocketViaSharedWorkerContextInterface;
}

// Export - Default
export default WebSocketViaSharedWorkerProvider;
