// Dependencies - Types
import { SharedWorkerClientConnectionInterface } from '@structure/source/api/web-sockets/shared-worker/SharedWorkerClientConnection';
import {
    WebSocketSharedWorkerServerToClientMessageInterface,
    ClientToWebSocketSharedWorkerServerMessageInterface,
} from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// SharedWorkerServer-to-Client Message Types
export enum SharedWorkerServerToClientMessageType {
    Ping = 'Ping',
    ClientIdAssigned = 'ClientIdAssigned',
    ClientConnections = 'ClientConnections',
}

// Client-to-SharedWorkerServer Message Types
export enum ClientToSharedWorkerServerMessageType {
    Pong = 'Pong',
    RequestClientConnections = 'RequestClientConnections',
}

// SharedWorker Message Base Interface
export interface SharedWorkerBaseMessageInterface {
    type: string;
}

// Server-to-client - Ping Message Interface
export interface PingMessageInterface extends SharedWorkerBaseMessageInterface {
    type: SharedWorkerServerToClientMessageType.Ping;
}

// Server-to-client - ClientIdAssigned Message Interface
export interface ClientIdAssignedMessageInterface extends SharedWorkerBaseMessageInterface {
    type: SharedWorkerServerToClientMessageType.ClientIdAssigned;
    clientId: string;
}

// Server-to-client - ClientConnections Message Interface
export interface ClientConnectionsMessageInterface extends SharedWorkerBaseMessageInterface {
    type: SharedWorkerServerToClientMessageType.ClientConnections;
    clientConnections: SharedWorkerClientConnectionInterface[];
}

// All Server-to-client Messages Union Type
export type SharedWorkerServerToClientMessageInterface =
    | PingMessageInterface
    | ClientIdAssignedMessageInterface
    | ClientConnectionsMessageInterface
    | WebSocketSharedWorkerServerToClientMessageInterface;

// Client-to-server - Pong Message Interface
export interface PongMessageInterface extends SharedWorkerBaseMessageInterface {
    type: ClientToSharedWorkerServerMessageType.Pong;
}

// Client-to-server - RequestClientConnections Message Interface
export interface RequestClientConnectionsMessageInterface extends SharedWorkerBaseMessageInterface {
    type: ClientToSharedWorkerServerMessageType.RequestClientConnections;
}

// All Client-to-server Messages Union Type
export type ClientToSharedWorkerServerMessageInterface =
    | PongMessageInterface
    | RequestClientConnectionsMessageInterface
    | ClientToWebSocketSharedWorkerServerMessageInterface;
