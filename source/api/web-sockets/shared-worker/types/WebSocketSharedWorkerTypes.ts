// Dependencies - Types
import { SharedWorkerBaseMessageInterface } from '@structure/source/api/web-sockets/shared-worker/types/SharedWorkerTypes';

// WebSocketSharedWorkerServer-to-Client Message Types
export enum WebSocketSharedWorkerServerToClientMessageType {
    WebSocketConnectionInformation = 'WebSocketConnectionInformation',
    WebSocketMessage = 'WebSocketMessage',
    WebSocketError = 'WebSocketError',
}

// Client-to-WebSocketSharedWorkerServer Message Types
export enum ClientToWebSocketSharedWorkerServerMessageType {
    ConnectWebSocket = 'ConnectWebSocket',
    DisconnectWebSocket = 'DisconnectWebSocket',
    SendWebSocketMessage = 'SendWebSocketMessage',
}

// SharedWorkerServer-to-WebSocketServer Message Types
export enum SharedWorkerServerToWebSocketServerMessageType {
    Ping = 'Ping',
    Connect = 'Connect',
    Disconnect = 'Disconnect',
    SendMessage = 'SendMessage',
}

// WebSocketServer-to-SharedWorkerServer Message Types
export enum WebSocketServerToSharedWorkerServerMessageType {
    Pong = 'Pong',
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    MessageReceived = 'MessageReceived',
    Error = 'Error',
}

// WebSocket Connection State Enum
export enum WebSocketConnectionState {
    Connecting = 'Connecting',
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting',
    Failed = 'Failed',
}

// WebSocket Connection Statistics Interface
export interface WebSocketConnectionStatisticsInterface {
    messagesSent: number;
    messagesReceived: number;
    bytesSent: number;
    bytesReceived: number;
    averageLatencyInMilliseconds: number | null;
    lastMessageSentAt: number | null;
    lastMessageReceivedAt: number | null;
    lastPingSentAt: number | null;
    lastPongReceivedAt: number | null;
    connectedAt: number | null;
}

// WebSocket Connection Information Interface
export interface WebSocketConnectionInformationInterface {
    url: string | null;
    state: WebSocketConnectionState;
    readyState?: number | null;
    reconnectAttempts?: number;
    reconnecting?: boolean;
    reconnectDelayInMilliseconds?: number;
    maximumReconnectDelayInMilliseconds?: number;
    statistics?: WebSocketConnectionStatisticsInterface;
    createdAt: number;
}

// Client-to-WebSocketSharedWorkerServer - Connect Message Interface
export interface ConnectWebSocketMessageInterface extends SharedWorkerBaseMessageInterface {
    type: ClientToWebSocketSharedWorkerServerMessageType.ConnectWebSocket;
    url: string;
    protocols?: string | string[];
}

// Client-to-WebSocketSharedWorkerServer - Disconnect Message Interface
export interface DisconnectWebSocketMessageInterface extends SharedWorkerBaseMessageInterface {
    type: ClientToWebSocketSharedWorkerServerMessageType.DisconnectWebSocket;
    code?: number;
    reason?: string;
}

// Client-to-WebSocketSharedWorkerServer - Send Message Interface
export interface SendWebSocketMessageInterface extends SharedWorkerBaseMessageInterface {
    type: ClientToWebSocketSharedWorkerServerMessageType.SendWebSocketMessage;
    // Using 'unknown' type for maximum flexibility as WebSocket can send various data types
    // This could be string, JSON-serializable objects, or any other data
    data: unknown;
}

// All Client-to-WebSocketSharedWorkerServer Messages Union Type
export type ClientToWebSocketSharedWorkerServerMessageInterface =
    | ConnectWebSocketMessageInterface
    | DisconnectWebSocketMessageInterface
    | SendWebSocketMessageInterface;

// WebSocketSharedWorkerServer-to-Client - WebSocket Information Message Interface
export interface WebSocketConnectionInformationMessageInterface
    extends WebSocketConnectionInformationInterface,
        SharedWorkerBaseMessageInterface {
    type: WebSocketSharedWorkerServerToClientMessageType.WebSocketConnectionInformation;
}

// WebSocketSharedWorkerServer-to-Client - WebSocket Data Message Interface
export interface WebSocketDataMessageInterface extends SharedWorkerBaseMessageInterface {
    type: WebSocketSharedWorkerServerToClientMessageType.WebSocketMessage;
    // Using 'unknown' type for maximum flexibility as WebSocket can receive various data types
    // Could be parsed JSON objects, raw message data, or other structured content
    data: unknown;
}

// WebSocketSharedWorkerServer-to-Client - WebSocket Error Message Interface
export interface WebSocketErrorMessageInterface extends SharedWorkerBaseMessageInterface {
    type: WebSocketSharedWorkerServerToClientMessageType.WebSocketError;
    message: string;
    createdAt: number;
}

// All WebSocketSharedWorkerServer-to-Client Messages Union Type
export type WebSocketSharedWorkerServerToClientMessageInterface =
    | WebSocketConnectionInformationMessageInterface
    | WebSocketDataMessageInterface
    | WebSocketErrorMessageInterface;

// Factory function to create WebSocket information message
export function createWebSocketConnectionInformationMessage(
    webSocketConnection: WebSocketConnectionInformationInterface,
): WebSocketConnectionInformationMessageInterface {
    return {
        type: WebSocketSharedWorkerServerToClientMessageType.WebSocketConnectionInformation,
        url: webSocketConnection.url || '',
        state: webSocketConnection.state,
        readyState: webSocketConnection.readyState !== undefined ? webSocketConnection.readyState : null,
        reconnectAttempts: webSocketConnection.reconnectAttempts || 0,
        reconnecting: webSocketConnection.reconnecting || false,
        reconnectDelayInMilliseconds: webSocketConnection.reconnectDelayInMilliseconds || 1000,
        maximumReconnectDelayInMilliseconds: webSocketConnection.maximumReconnectDelayInMilliseconds || 30000,
        statistics: webSocketConnection.statistics,
        createdAt: Date.now(),
    };
}

// Factory function to create WebSocket data message
export function createWebSocketDataMessage(data: unknown): WebSocketDataMessageInterface {
    return {
        type: WebSocketSharedWorkerServerToClientMessageType.WebSocketMessage,
        data: data,
    };
}

// Factory function to create WebSocket error message
export function createWebSocketErrorMessage(message: string): WebSocketErrorMessageInterface {
    return {
        type: WebSocketSharedWorkerServerToClientMessageType.WebSocketError,
        message,
        createdAt: Date.now(),
    };
}
