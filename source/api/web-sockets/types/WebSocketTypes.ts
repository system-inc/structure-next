/**
 * Consolidated WebSocket Types
 *
 * This file contains all type definitions related to WebSocket communications including:
 * 1. Base WebSocket message types
 * 2. WebSocket connection states
 * 3. SharedWorker communication interfaces
 * 4. Client-Worker message interfaces
 */

// -----------------------------------------------------------------------------
// WebSocket Connection States
// -----------------------------------------------------------------------------

/**
 * WebSocket Connection States
 */
export enum WebSocketConnectionState {
    Connecting = 'Connecting',
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting',
    Failed = 'Failed',
}

// -----------------------------------------------------------------------------
// Base WebSocket Event Types
// -----------------------------------------------------------------------------

/**
 * Base interface for WebSocket events
 */
export interface WebSocketEvent {
    /**
     * The type of the event. This determines how the event should be handled.
     */
    readonly type: string;

    /**
     * The origin of the event.
     * This is the worker that the event originated from.
     */
    readonly origin: string;

    /**
     * The arguments that were passed as part of the event.
     * These will be passed to the event handler.
     */
    readonly arguments?: unknown[];
}

/**
 * Check if an object is a WebSocketEvent
 */
export function isWebSocketEvent(event: unknown): event is WebSocketEvent {
    return (
        typeof event === 'object' &&
        event !== null &&
        'type' in event &&
        typeof (event as WebSocketEvent).type === 'string' &&
        'origin' in event &&
        typeof (event as WebSocketEvent).origin === 'string'
    );
}

/**
 * Check if a WebSocketEvent is an error event
 */
export function isWebSocketErrorEvent(event: WebSocketEvent): event is WebSocketErrorEvent {
    return event.type === 'error';
}

/**
 * Check if a WebSocketEvent is a forwarding event
 */
export function isWebSocketForwardingEvent(event: WebSocketEvent): event is WebSocketForwardingEvent {
    return event.type === 'forwarding';
}

/**
 * WebSocket forwarding event
 */
export interface WebSocketForwardingEvent extends WebSocketEvent {
    /**
     * Designates this event as a forwarding event.
     */
    readonly type: 'forwarding';

    /**
     * The event that is being forwarded.
     */
    readonly originatingType: string;

    /**
     * The target of the event.
     * This is the worker that the event is being forwarded to.
     */
    readonly target: string;

    /**
     * The rpc endpoint on the target.
     */
    readonly rpcEndpoint?: string;
}

/**
 * WebSocket error event
 */
export interface WebSocketErrorEvent extends WebSocketEvent {
    /**
     * Designates this event as an error event.
     */
    readonly type: 'error';

    /**
     * The error that occurred.
     */
    readonly errorType: string;

    /**
     * The error message.
     */
    readonly message?: string;

    /**
     * The web socket event that was being handled when the error occurred.
     */
    readonly originatingType?: string;
}

// -----------------------------------------------------------------------------
// WebSocket Message Types (Client-Server Communication)
// -----------------------------------------------------------------------------

/**
 * Request/Response message identifiers
 */
export type MessageId = string;

/**
 * WebSocket server-specific message types
 */
export enum WebSocketMessageType {
    // Request types (client → server)
    Request = 'Request', // Generic request
    Subscribe = 'Subscribe', // Subscribe to topic/channel
    Unsubscribe = 'Unsubscribe', // Unsubscribe from topic/channel

    // Response types (server → client)
    Response = 'Response', // Response to a request
    Error = 'Error', // Error response

    // Event types (server → client)
    Event = 'Event', // Server-sent event

    // Connection management (bidirectional)
    ConnectionState = 'ConnectionState', // Connection state updates
    Ping = 'Ping', // WebSocket ping
    Pong = 'Pong', // WebSocket pong
}

/**
 * Base interface for all WebSocket messages
 */
export interface WebSocketMessageBase {
    type: WebSocketMessageType;
    id?: MessageId; // Correlation ID for request/response pairs
    clientId?: string; // ID of the client tab that sent/should receive the message
    timestamp?: number; // When the message was created
}

/**
 * Request message (client → server)
 */
export interface WebSocketRequestMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Request;
    endpoint: string; // API endpoint or action
    data?: unknown; // Request payload
}

/**
 * Subscribe message (client → server)
 */
export interface WebSocketSubscribeMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Subscribe;
    topic: string; // Topic to subscribe to
    options?: Record<string, unknown>; // Subscription options
}

/**
 * Unsubscribe message (client → server)
 */
export interface WebSocketUnsubscribeMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Unsubscribe;
    topic: string; // Topic to unsubscribe from
}

/**
 * Response message (server → client)
 */
export interface WebSocketResponseMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Response;
    success: boolean; // Whether the request was successful
    data?: unknown; // Response data
}

/**
 * Error message (server → client)
 */
export interface WebSocketErrorMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Error;
    code: string; // Error code
    message: string; // Error message
    details?: Record<string, unknown>; // Additional error details
}

/**
 * Event message (server → client)
 */
export interface WebSocketEventMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.Event;
    topic: string; // Topic the event relates to
    event: string; // Event name
    data?: unknown; // Event data
}

/**
 * Connection state message (bidirectional)
 */
export interface WebSocketConnectionStateMessage extends WebSocketMessageBase {
    type: WebSocketMessageType.ConnectionState;
    state: WebSocketConnectionState;
    details?: string; // Additional details about the state
}

/**
 * Union type for all WebSocket messages
 */
export type WebSocketMessage =
    | WebSocketRequestMessage
    | WebSocketSubscribeMessage
    | WebSocketUnsubscribeMessage
    | WebSocketResponseMessage
    | WebSocketErrorMessage
    | WebSocketEventMessage
    | WebSocketConnectionStateMessage;

// -----------------------------------------------------------------------------
// SharedWorker to WebSocket Communication
// -----------------------------------------------------------------------------

/**
 * Message types for SharedWorker to WebSocket communication
 */
export enum SharedWorkerToWebSocketMessageType {
    Connect = 'Connect', // Connect to WebSocket server
    Disconnect = 'Disconnect', // Disconnect from WebSocket server
    Send = 'Send', // Send a message to WebSocket server
}

/**
 * Connect message (SharedWorker → WebSocket)
 */
export interface SharedWorkerToWebSocketConnectMessage {
    type: SharedWorkerToWebSocketMessageType.Connect;
    url: string; // WebSocket URL
    protocols?: string | string[];
}

/**
 * Disconnect message (SharedWorker → WebSocket)
 */
export interface SharedWorkerToWebSocketDisconnectMessage {
    type: SharedWorkerToWebSocketMessageType.Disconnect;
    code?: number;
    reason?: string;
}

/**
 * Send message (SharedWorker → WebSocket)
 */
export interface SharedWorkerToWebSocketSendMessage {
    type: SharedWorkerToWebSocketMessageType.Send;
    data: WebSocketMessage; // Message to send to the WebSocket server
}

/**
 * Union type for all SharedWorker to WebSocket messages
 */
export type SharedWorkerToWebSocketMessage =
    | SharedWorkerToWebSocketConnectMessage
    | SharedWorkerToWebSocketDisconnectMessage
    | SharedWorkerToWebSocketSendMessage;

// -----------------------------------------------------------------------------
// WebSocket to SharedWorker Communication
// -----------------------------------------------------------------------------

/**
 * WebSocket to SharedWorker message types
 */
export enum WebSocketToSharedWorkerMessageType {
    Connected = 'Connected', // WebSocket connected
    Disconnected = 'Disconnected', // WebSocket disconnected
    Error = 'Error', // WebSocket error
    Message = 'Message', // Message from WebSocket server
}

/**
 * Connected message (WebSocket → SharedWorker)
 */
export interface WebSocketToSharedWorkerConnectedMessage {
    type: WebSocketToSharedWorkerMessageType.Connected;
    url: string; // Connected WebSocket URL
}

/**
 * Disconnected message (WebSocket → SharedWorker)
 */
export interface WebSocketToSharedWorkerDisconnectedMessage {
    type: WebSocketToSharedWorkerMessageType.Disconnected;
    code: number;
    reason: string;
    wasClean: boolean;
}

/**
 * Error message (WebSocket → SharedWorker)
 */
export interface WebSocketToSharedWorkerErrorMessage {
    type: WebSocketToSharedWorkerMessageType.Error;
    error: Error | string | Record<string, unknown>; // Error object
}

/**
 * Message message (WebSocket → SharedWorker)
 */
export interface WebSocketToSharedWorkerMessageMessage {
    type: WebSocketToSharedWorkerMessageType.Message;
    data: WebSocketMessage; // Message from the WebSocket server
}

/**
 * Union type for all WebSocket to SharedWorker messages
 */
export type WebSocketToSharedWorkerMessage =
    | WebSocketToSharedWorkerConnectedMessage
    | WebSocketToSharedWorkerDisconnectedMessage
    | WebSocketToSharedWorkerErrorMessage
    | WebSocketToSharedWorkerMessageMessage;

// -----------------------------------------------------------------------------
// SharedWorker to Client Communication
// -----------------------------------------------------------------------------

/**
 * Base interface for SharedWorker messages
 */
export interface SharedWorkerMessage {
    /**
     * The type of message
     */
    type: string;

    /**
     * Optional tab ID to identify the specific browser tab
     */
    tabId?: string;
}

/**
 * Message to initialize the SharedWorker with a WebSocket URL
 */
export interface SharedWorkerInitializeMessage extends SharedWorkerMessage {
    type: 'initialize';
    /**
     * WebSocket URL to connect to
     */
    url: string;
}

/**
 * Message to send data through the WebSocket
 */
export interface SharedWorkerSendMessage extends SharedWorkerMessage {
    type: 'send';
    /**
     * Data to send (will be serialized if not a string)
     */
    data: unknown;
}

/**
 * Message for health checks
 */
export interface SharedWorkerPingMessage extends SharedWorkerMessage {
    type: 'ping';
}

/**
 * Response message for ping
 */
export interface SharedWorkerPongMessage extends SharedWorkerMessage {
    type: 'pong';
    /**
     * Current timestamp
     */
    timestamp: number;
}

/**
 * Message to clean up a client connection
 */
export interface SharedWorkerCleanupMessage extends SharedWorkerMessage {
    type: 'cleanup';
}

/**
 * Message to get connection status
 */
export interface SharedWorkerGetConnectionStatusMessage extends SharedWorkerMessage {
    type: 'getConnectionStatus';
}

/**
 * WebSocket status message
 */
export interface SharedWorkerStatusMessage extends SharedWorkerMessage {
    type: 'connectionState';
    /**
     * Current WebSocket status
     */
    status: 'connected' | 'connecting' | 'disconnected';
    /**
     * Close code (if status is 'disconnected')
     */
    code?: number;
    /**
     * Close reason (if status is 'disconnected')
     */
    reason?: string;
    /**
     * State information, including tab count
     */
    state?: {
        tabCount?: number;
        tabId?: string;
        connectionState?: string;
    };
}

/**
 * WebSocket message forwarded from the server
 */
export interface SharedWorkerWebSocketMessage extends SharedWorkerMessage {
    type: 'incomingMessage';
    /**
     * Parsed WebSocket event from the server
     */
    data: WebSocketEvent;
}

/**
 * WebSocket error message
 */
export interface SharedWorkerErrorMessage extends SharedWorkerMessage {
    type: 'error';
    /**
     * Error message
     */
    error:
        | string
        | {
              message: string;
              code: string;
              timestamp: number;
              data: unknown;
          };
}

/**
 * WebSocket metrics message
 */
export interface SharedWorkerMetricsMessage extends SharedWorkerMessage {
    type: 'metrics';
    /**
     * Timestamp of the metrics data
     */
    timestamp: number;
    /**
     * Metrics data
     */
    metrics?: Record<string, unknown>;
    /**
     * State information, including tab count
     */
    state?: {
        tabCount?: number;
        queueSize?: number;
        highPriorityQueueSize?: number;
        connectionState?: string;
        connectionUrl?: string;
        readyState?: number;
        reconnectionAttempts?: number;
    };
}

// -----------------------------------------------------------------------------
// SharedWorker Server Message Types
// -----------------------------------------------------------------------------

/**
 * Message types handled by base SharedWorkerServer
 */
export const SharedWorkerMessageType = {
    // Client to Server (sent from client to SharedWorker)
    ClientToServer: {
        Pong: 'Pong',
        RequestClientConnections: 'RequestClientConnections',
    },
    // Server to Client (sent from SharedWorker to client)
    ServerToClient: {
        Ping: 'Ping',
        ClientIdAssigned: 'ClientIdAssigned',
        ClientConnections: 'ClientConnections',
    },
} as const;

/**
 * Message types specific to WebSocket functionality
 */
export const WebSocketSharedWorkerMessageType = {
    // Client to Server (sent from client to SharedWorker)
    ClientToServer: {
        ConnectWebSocket: 'ConnectWebSocket', // Request to connect to WebSocket server
        DisconnectWebSocket: 'DisconnectWebSocket', // Request to disconnect from WebSocket server
        SendWebSocketMessage: 'SendWebSocketMessage', // Send message to WebSocket server
    },
    // Server to Client (sent from SharedWorker to client)
    ServerToClient: {
        WebSocketStateChanged: 'WebSocketStateChanged', // WebSocket connection state change
        WebSocketMessage: 'WebSocketMessage', // Message from WebSocket server
    },
} as const;

/**
 * Comprehensive WebSocket State interface
 */
export interface WebSocketState {
    // Basic connection state
    connectionState: WebSocketConnectionState;
    createdAt: number; // When this state object was created

    // Connection details
    url?: string; // WebSocket URL (undefined if not connected)

    // Socket status
    readyState?: number; // WebSocket.readyState (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)

    // Reconnection details
    reconnectAttempts?: number; // Number of reconnection attempts
    reconnecting?: boolean; // Whether currently attempting to reconnect
    reconnectDelayInMilliseconds?: number; // Current backoff delay in ms
    maximumReconnectDelayInMilliseconds?: number; // Maximum reconnection delay in ms

    // Statistics organized in a sub-object
    statistics?: {
        // Timing information
        connectedAt?: number; // Timestamp when the connection was established
        lastMessageSentAt?: number; // Timestamp of last message sent
        lastMessageReceivedAt?: number; // Timestamp of last message received
        lastPingSentAt?: number; // Timestamp of last ping sent
        lastPongReceivedAt?: number; // Timestamp of last pong received

        // Message counts
        messagesSent?: number; // Number of messages sent
        messagesReceived?: number; // Number of messages received
        bytesSent?: number; // Number of bytes sent
        bytesReceived?: number; // Number of bytes received

        // Performance metrics
        averageLatencyInMilliseconds?: number; // Average round-trip time in ms
    };

    // Error information
    lastError?: {
        message: string;
        code?: number;
        timestamp: number;
    };
}

// -----------------------------------------------------------------------------
// SharedWorker Server Message Interfaces
// -----------------------------------------------------------------------------

/**
 * Pong message - Client responds to ping
 */
export interface PongMessage {
    type: typeof SharedWorkerMessageType.ClientToServer.Pong;
}

/**
 * RequestClientConnections message - Client requests list of connections
 */
export interface RequestClientConnectionsMessage {
    type: typeof SharedWorkerMessageType.ClientToServer.RequestClientConnections;
}

/**
 * Ping message - Server checks if client is alive
 */
export interface PingMessage {
    type: typeof SharedWorkerMessageType.ServerToClient.Ping;
}

/**
 * ClientIdAssigned message - Server assigns client ID
 */
export interface ClientIdAssignedMessage {
    type: typeof SharedWorkerMessageType.ServerToClient.ClientIdAssigned;
    clientId: string;
}

/**
 * Client connection information
 */
export interface SharedWorkerServerClientConnection {
    id: string;
    firstConnected: number;
    lastActive: number;
}

/**
 * ClientConnections message - Server provides list of connections
 */
export interface ClientConnectionsMessage {
    type: typeof SharedWorkerMessageType.ServerToClient.ClientConnections;
    clientConnections: SharedWorkerServerClientConnection[];
}

/**
 * WebSocketStateChanged message - Server notifies about WebSocket state change
 */
export interface WebSocketStateChangedMessage extends WebSocketState {
    type: typeof WebSocketSharedWorkerMessageType.ServerToClient.WebSocketStateChanged;
}

/**
 * WebSocketMessage message - Server forwards message from WebSocket server
 */
export interface WebSocketMessageMessage {
    type: typeof WebSocketSharedWorkerMessageType.ServerToClient.WebSocketMessage;
    data: unknown;
}

/**
 * Connect WebSocket message - Client requests to connect to WebSocket server
 */
export interface ConnectWebSocketMessage {
    type: typeof WebSocketSharedWorkerMessageType.ClientToServer.ConnectWebSocket;
    url: string;
    protocols?: string | string[];
}

/**
 * Disconnect WebSocket message - Client requests to disconnect from WebSocket server
 */
export interface DisconnectWebSocketMessage {
    type: typeof WebSocketSharedWorkerMessageType.ClientToServer.DisconnectWebSocket;
    code?: number;
    reason?: string;
}

/**
 * Send WebSocket message - Client sends message to WebSocket server
 */
export interface SendWebSocketMessageMessage {
    type: typeof WebSocketSharedWorkerMessageType.ClientToServer.SendWebSocketMessage;
    data: unknown;
}

/**
 * Union type for all client-to-worker messages
 */
export type ClientToWorkerMessage =
    // Base SharedWorkerServer messages
    | PongMessage
    | RequestClientConnectionsMessage
    // WebSocket extension messages
    | ConnectWebSocketMessage
    | DisconnectWebSocketMessage
    | SendWebSocketMessageMessage;

/**
 * Union type for all worker-to-client messages
 */
export type WorkerToClientMessage =
    // Base SharedWorkerServer messages
    | PingMessage
    | ClientIdAssignedMessage
    | ClientConnectionsMessage
    // WebSocket extension messages
    | WebSocketStateChangedMessage
    | WebSocketMessageMessage;
