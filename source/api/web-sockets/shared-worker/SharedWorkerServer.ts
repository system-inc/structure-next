// Note: After modifying this code you must manually run `npm run build:websocketsharedworker` to build the SharedWorker.

// Dependencies - Constants
import {
    SharedWorkerClientConnectionHeartbeatIntervalInMilliseconds,
    SharedWorkerClientConnectionHeartbeatTimeoutInMilliseconds,
} from '@structure/source/api/web-sockets/shared-worker/WebSocketSharedWorkerConstants';

// Dependencies - Types
import {
    SharedWorkerServerToClientMessageType,
    ClientToSharedWorkerServerMessageType,
    SharedWorkerServerToClientMessageInterface,
    ClientToSharedWorkerServerMessageInterface,
    PingMessageInterface,
    ClientIdAssignedMessageInterface,
    ClientConnectionsMessageInterface,
} from '@structure/source/api/web-sockets/shared-worker/types/SharedWorkerTypes';

// Dependencies - Classes
import { SharedWorkerClientConnection } from '@structure/source/api/web-sockets/shared-worker/SharedWorkerClientConnection';

// Type - SharedWorkerMessageEvent
// This type is specefic to the SharedWorker API
interface SharedWorkerMessageEvent extends MessageEvent {
    ports: MessagePort[];
}

// Class - SharedWorkerServer
// SharedWorker which communicates with tabs via the SharedWorker API
export class SharedWorkerServer {
    clientConnections: Map<string, SharedWorkerClientConnection>; // Map of client connections

    constructor() {
        // Map for all client connections (a tab or window)
        this.clientConnections = new Map<string, SharedWorkerClientConnection>();

        // Add event listener for incoming connections
        // `self` here refers to the SharedWorkerGlobalScope
        // TypeScript doesn't know about self in the SharedWorker context, so we need to cast it
        if(typeof self !== 'undefined') {
            // console.log('SharedWorkerServer self:', self);
            (
                self as unknown as {
                    onconnect: (event: SharedWorkerMessageEvent) => void;
                }
            ).onconnect = this.onClientConnect.bind(this);
        }
        else {
            // console.error('SharedWorkerServer: self is not defined');
        }
    }

    // Function to handle client connection to the SharedWorker detected by self.onconnect
    onClientConnect(event: SharedWorkerMessageEvent) {
        console.log('onClientConnect', event);

        // Create a unique identifier for the client
        const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // The first port is the one used for communication
        // This will always be the case for SharedWorker connections
        const messagePort = event.ports[0]!;

        // Add the client
        this.addClientConnection(clientId, messagePort);
    }

    // Function to add a client connection
    addClientConnection(clientId: string, messagePort: MessagePort): SharedWorkerClientConnection {
        // Create client connection object
        const clientConnection = new SharedWorkerClientConnection(clientId, messagePort);

        // Save the client connection in the map
        this.clientConnections.set(clientId, clientConnection);

        // Add an event listener for incoming messages from the client
        messagePort.onmessage = this.onClientConnectionMessage.bind(this, clientConnection);

        // Continuously send heartbeats to the client
        this.setupClientConnectionHeartbeat(clientConnection);

        // Send the clientId to the client
        this.sendMessage(clientConnection, {
            type: SharedWorkerServerToClientMessageType.ClientIdAssigned,
            clientId: clientId,
        } as ClientIdAssignedMessageInterface);

        // Broadcast updated client list to all clients
        this.broadcastClientConnections();

        // Log the total number of clients connected
        console.log('Total clients connected:', this.clientConnections.size);

        return clientConnection;
    }

    // Function to handle client disconnection
    handleClientDisconnection(clientConnection: SharedWorkerClientConnection) {
        console.log('handleClientDisconnection:', clientConnection);

        // If the client connection exists in the map
        if(this.clientConnections.has(clientConnection.id)) {
            // console.log('Removing client:', clientConnection);

            // Handle client disconnection
            clientConnection.handleDisconnect();

            // Remove the client connection from the map
            this.clientConnections.delete(clientConnection.id);

            // Broadcast updated client list to all clients
            this.broadcastClientConnections();
        }

        console.log('Total clients connected:', this.clientConnections.size);
    }

    // Function to setup heartbeat mechanism for detecting disconnected clients
    setupClientConnectionHeartbeat(clientConnection: SharedWorkerClientConnection) {
        // Setup interval to check if client is still alive
        clientConnection.heartbeatInterval = setInterval(() => {
            try {
                // Get the client connection
                const currentClientConnection = this.clientConnections.get(clientConnection.id);

                // If the client no longer exists
                if(!currentClientConnection) {
                    console.log('Client no longer exists:', clientConnection.id);
                    return;
                }

                // Send heartbeat message with disconnect handler
                const sendMessageResult = currentClientConnection.sendMessage(
                    {
                        type: SharedWorkerServerToClientMessageType.Ping,
                    } as PingMessageInterface,
                    this.handleClientDisconnection.bind(this),
                );

                // If sending failed, skip further checks
                if(!sendMessageResult) {
                    return;
                }

                // If the client has been inactive for too long, disconnect it
                const inactiveTime = Date.now() - currentClientConnection.lastActiveAt.getTime();
                if(inactiveTime > SharedWorkerClientConnectionHeartbeatTimeoutInMilliseconds) {
                    console.log('Client timed out:', currentClientConnection.id);
                    this.handleClientDisconnection(currentClientConnection);
                }
            }
            catch(error) {
                // If any other error occurs, disconnect the client
                console.log('Heartbeat error, client disconnected:', clientConnection.id, error);
                this.handleClientDisconnection(clientConnection);
            }
        }, SharedWorkerClientConnectionHeartbeatIntervalInMilliseconds);
    }

    // Function to send a message to a client
    sendMessage(
        clientConnection: SharedWorkerClientConnection,
        message: SharedWorkerServerToClientMessageInterface,
    ): boolean {
        return clientConnection.sendMessage(message, this.handleClientDisconnection.bind(this));
    }

    // Function to broadcast a message to all connected clients
    broadcastMessage(message: SharedWorkerServerToClientMessageInterface): void {
        this.clientConnections.forEach((clientConnection) => {
            this.sendMessage(clientConnection, message);
        });
    }

    // Function to handle an incoming message from a tab or window
    onClientConnectionMessage(clientConnection: SharedWorkerClientConnection, event: MessageEvent) {
        // If the message is not a Pong, log
        if(event.data && (!event.data.type || event.data.type !== ClientToSharedWorkerServerMessageType.Pong)) {
            console.log('[SharedWorkerServer] Received message from client:', event.data);
        }

        // console.log('onClientConnectionMessage', clientConnection, event);
        const data = event.data as ClientToSharedWorkerServerMessageInterface;

        // Handle the message based on its type
        switch(data.type) {
            case ClientToSharedWorkerServerMessageType.Pong:
                // Update the last active timestamp for the client
                clientConnection.updateLastActive();
                break;

            case ClientToSharedWorkerServerMessageType.RequestClientConnections:
                // Send the client connections list to the client
                this.sendMessage(clientConnection, this.createClientConnectionsMessage());
                break;
        }
    }

    // Function to create client list message
    createClientConnectionsMessage(): ClientConnectionsMessageInterface {
        // Create array of client data using our ClientConnectionData class
        const clientConnections = Array.from(this.clientConnections.values()).map(function (connection) {
            return {
                id: connection.id,
                firstConnectedAt: connection.firstConnectedAt,
                lastActiveAt: connection.lastActiveAt,
            };
        });

        // Create a properly typed message using our message class
        return {
            type: SharedWorkerServerToClientMessageType.ClientConnections,
            clientConnections: clientConnections,
        };
    }

    // Function to broadcast client list to all connected clients
    broadcastClientConnections() {
        const clientListMessage = this.createClientConnectionsMessage();
        this.broadcastMessage(clientListMessage);
    }
}
