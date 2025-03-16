'use client'; // This hook uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React
import React from 'react';

// Dependencies - Types
import {
    SharedWorkerServerClientConnection,
    SharedWorkerMessageType,
    WebSocketSharedWorkerMessageType,
    WebSocketConnectionState,
    WebSocketState,
    ClientToWorkerMessage,
    WorkerToClientMessage,
    WebSocketEventMessage,
    WebSocketMessageType,
} from '@structure/source/api/web-sockets/types/WebSocketTypes';

// Type definition for message handler function
export type WebSocketMessageHandler = (event: WebSocketEventMessage) => void;

// Hook - useWebSocketViaSharedWorker
// Provides WebSocket functionality using a SharedWorker
export function useWebSocketViaSharedWorker() {
    // State
    const [isSharedWorkerSupported, setIsSharedWorkerSupported] = React.useState<boolean>(false);
    const [isSharedWorkerConnected, setIsSharedWorkerConnected] = React.useState<boolean>(false);
    const [sharedWorkerServerClientConnections, setSharedWorkerServerClientConnections] = React.useState<
        SharedWorkerServerClientConnection[]
    >([]);
    const [webSocketState, setWebSocketState] = React.useState<WebSocketState>({
        connectionState: WebSocketConnectionState.Disconnected,
        createdAt: Date.now(),
    });

    // References
    const isInitializedReference = React.useRef<boolean>(false);
    const sharedWorkerReference = React.useRef<SharedWorker>();
    const sharedWorkerClientIdAssignedFromServerReference = React.useRef<string>();
    const webSocketMessageHandlersReference = React.useRef<WebSocketMessageHandler[]>([]);

    // Calculate the WebSocket URL from ProjectSettings
    const webSocketUrl =
        ProjectSettings.apis.base.host && ProjectSettings.apis.base.webSocketPath
            ? 'wss://' + ProjectSettings.apis.base.host + ProjectSettings.apis.base.webSocketPath
            : null;

    // Function to send a message to the SharedWorker
    const sendMessage = React.useCallback(function (message: ClientToWorkerMessage) {
        // If the SharedWorker is connected
        if(sharedWorkerReference.current && sharedWorkerReference.current.port) {
            // Send the message
            sharedWorkerReference.current.port.postMessage(message);
        }
    }, []);

    // Function to handle messages from the SharedWorker
    const handleMessage = React.useCallback(
        function (messageEvent: MessageEvent<WorkerToClientMessage>) {
            // console.log('[SharedWorker] Received message:', messageEvent);

            if(!messageEvent.data) return;

            switch(messageEvent.data.type) {
                // Handle heartbeat ping messages
                case SharedWorkerMessageType.ServerToClient.Ping:
                    // console.log('[SharedWorker] Received ping, sending pong');
                    sendMessage({ type: SharedWorkerMessageType.ClientToServer.Pong });
                    break;

                // Handle client ID assignment
                case SharedWorkerMessageType.ServerToClient.ClientIdAssigned:
                    console.log('[SharedWorker] Received client ID:', messageEvent.data.clientId);
                    sharedWorkerClientIdAssignedFromServerReference.current = messageEvent.data.clientId;
                    break;

                // Handle client connections list
                case SharedWorkerMessageType.ServerToClient.ClientConnections:
                    console.log('[SharedWorker] Received client connections:', messageEvent.data.clientConnections);
                    setSharedWorkerServerClientConnections(messageEvent.data.clientConnections);
                    break;

                // Handle WebSocket state changes
                case WebSocketSharedWorkerMessageType.ServerToClient.WebSocketStateChanged:
                    console.log('[SharedWorker] WebSocket state changed:', messageEvent.data);

                    // The message extends WebSocketState, so we can set it directly
                    setWebSocketState({
                        ...messageEvent.data,
                        // Make sure we always have at least these required fields
                        createdAt: messageEvent.data.createdAt || Date.now(),
                    });
                    break;

                // Handle WebSocket messages
                case WebSocketSharedWorkerMessageType.ServerToClient.WebSocketMessage:
                    console.log('[SharedWorker] WebSocket message received:', messageEvent.data);

                    // Create an event message object from the received data
                    const eventMessage: WebSocketEventMessage = {
                        type: WebSocketMessageType.Event,
                        topic: 'websocket',
                        event: 'message',
                        data: messageEvent.data.data,
                        timestamp: Date.now(),
                    };

                    // Notify all registered handlers
                    const handlers = webSocketMessageHandlersReference.current;
                    if(handlers.length > 0) {
                        handlers.forEach(function (handler) {
                            try {
                                handler(eventMessage);
                            }
                            catch(error) {
                                console.error('[useWebSocketViaSharedWorker] Error in message handler:', error);
                            }
                        });
                    }
                    break;
            }
        },
        [sendMessage],
    );

    // Function to initialize SharedWorker
    const initialize = React.useCallback(
        function () {
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
                        '/api/web-socket/shared-workers/web-socket-shared-worker.js?v=3',
                    );
                    console.log('[useWebSocketViaSharedWorker] Initialized');

                    // Update the reference
                    sharedWorkerReference.current = sharedWorker;

                    // Set up message handler for the worker
                    sharedWorker.port.onmessage = handleMessage;

                    // Update connected state
                    setIsSharedWorkerConnected(true);
                }
                catch(error) {
                    console.error('[SharedWorker] Failed to initialize:', error);

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
            console.log('[SharedWorker] Requesting client connections');
            sendMessage({ type: SharedWorkerMessageType.ClientToServer.RequestClientConnections });
        },
        [sendMessage],
    );

    // Function to connect to a WebSocket server
    const connectWebSocket = React.useCallback(
        function (url: string, protocols?: string | string[]) {
            console.log('[SharedWorker] Connecting to WebSocket:', url);
            sendMessage({
                type: WebSocketSharedWorkerMessageType.ClientToServer.ConnectWebSocket,
                url,
                protocols,
            });
        },
        [sendMessage],
    );

    // Function to disconnect from the WebSocket server
    const disconnectWebSocket = React.useCallback(
        function (code?: number, reason?: string) {
            console.log('[SharedWorker] Disconnecting from WebSocket');
            sendMessage({
                type: WebSocketSharedWorkerMessageType.ClientToServer.DisconnectWebSocket,
                code,
                reason,
            });
        },
        [sendMessage],
    );

    // Function to send a message to the WebSocket server
    const sendWebSocketMessage = React.useCallback(
        function (data: unknown) {
            console.log('[SharedWorker] Sending WebSocket message:', data);
            sendMessage({
                type: WebSocketSharedWorkerMessageType.ClientToServer.SendWebSocketMessage,
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
                console.log('[useWebSocketViaSharedWorker] Auto-connecting to WebSocket:', webSocketUrl);
                connectWebSocket(webSocketUrl);

                // Clean up on unmount
                return function () {
                    disconnectWebSocket();
                };
            }
        },
        [isSharedWorkerConnected, webSocketUrl, connectWebSocket, disconnectWebSocket],
    );

    // Return the hook's interface
    return {
        // SharedWorker
        isSharedWorkerSupported: isSharedWorkerSupported,
        isSharedWorkerConnected: isSharedWorkerConnected,
        sharedWorkerClientIdAssignedFromServer: sharedWorkerClientIdAssignedFromServerReference.current,
        sharedWorkerServerClientConnections,
        requestSharedWorkerServerClientConnections,

        // WebSocket
        webSocketState,
        connectWebSocket,
        disconnectWebSocket,
        sendWebSocketMessage,
        onWebSocketMessage,
    };
}

// Export - Default
export default useWebSocketViaSharedWorker;
