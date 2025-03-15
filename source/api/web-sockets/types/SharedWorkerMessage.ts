// Types for messages exchanged between SharedWorker and clients

// Client-to-Server Message Types (sent from client to SharedWorker)
export enum ClientToWorkerMessageType {
    Pong = 'Pong',
    RequestClientConnections = 'RequestClientConnections'
}

// Server-to-Client Message Types (sent from SharedWorker to client)
export enum WorkerToClientMessageType {
    Ping = 'Ping',
    ClientIdAssigned = 'ClientIdAssigned',
    ClientConnections = 'ClientConnections'
}

// Message Interfaces

// Pong message - Client responds to ping
export interface PongMessage {
    type: ClientToWorkerMessageType.Pong;
}

// RequestClientConnections message - Client requests list of connections
export interface RequestClientConnectionsMessage {
    type: ClientToWorkerMessageType.RequestClientConnections;
}

// Ping message - Server checks if client is alive
export interface PingMessage {
    type: WorkerToClientMessageType.Ping;
}

// ClientIdAssigned message - Server assigns client ID
export interface ClientIdAssignedMessage {
    type: WorkerToClientMessageType.ClientIdAssigned;
    clientId: string;
}

// Client connection information
export interface SharedWorkerServerClientConnection {
    id: string;
    firstConnected: number;
    lastActive: number;
}

// ClientConnections message - Server provides list of connections
export interface ClientConnectionsMessage {
    type: WorkerToClientMessageType.ClientConnections;
    clientConnections: SharedWorkerServerClientConnection[];
}

// Union type for all client-to-server messages
export type ClientToWorkerMessage = 
    | PongMessage
    | RequestClientConnectionsMessage;

// Union type for all server-to-client messages
export type WorkerToClientMessage = 
    | PingMessage
    | ClientIdAssignedMessage
    | ClientConnectionsMessage;