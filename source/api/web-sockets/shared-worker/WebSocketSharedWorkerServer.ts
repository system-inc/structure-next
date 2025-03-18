// Dependencies - Types
import { ClientToSharedWorkerServerMessageType } from '@structure/source/api/web-sockets/shared-worker/types/SharedWorkerTypes';
import {
    ClientToWebSocketSharedWorkerServerMessageType,
    ClientToWebSocketSharedWorkerServerMessageInterface,
    WebSocketConnectionInformationInterface,
    ConnectWebSocketMessageInterface,
    SendWebSocketMessageInterface,
    createWebSocketConnectionInformationMessage,
    createWebSocketDataMessage,
    createWebSocketErrorMessage,
} from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// Dependencies - Classes
import { SharedWorkerServer } from '@structure/source/api/web-sockets/shared-worker/SharedWorkerServer';
import { SharedWorkerClientConnection } from '@structure/source/api/web-sockets/shared-worker/SharedWorkerClientConnection';
import { WebSocketConnection } from '@structure/source/api/web-sockets/shared-worker/WebSocketConnection';

// Class - WebSocketSharedWorkerServer
// SharedWorkerServer implementation which handles WebSocket connections
export class WebSocketSharedWorkerServer extends SharedWorkerServer {
    webSocketConnection: WebSocketConnection;
    handledFirstConnectWebSocketRequest: boolean = false;

    constructor() {
        super();

        // Create WebSocket connection with message and state change handlers
        this.webSocketConnection = new WebSocketConnection(
            this.handleWebSocketConnectionMessage.bind(this),
            this.handleWebSocketConnectionStateChange.bind(this),
        );
    }

    // Function to extend parent addClientConnection to send WebSocket state to new clients
    addClientConnection(clientId: string, messagePort: MessagePort): SharedWorkerClientConnection {
        // Call the parent method to handle the basic client connection setup
        const clientConnection = super.addClientConnection(clientId, messagePort);

        // Send the WebSocket information to the new client directly using the webSocketConnection
        this.sendMessage(clientConnection, createWebSocketConnectionInformationMessage(this.webSocketConnection));

        return clientConnection;
    }

    // Function to handle an incoming message from a tab (overriding parent method)
    onClientConnectionMessage(clientConnection: SharedWorkerClientConnection, event: MessageEvent) {
        // If this is a standard SharedWorkerServer message type
        if(
            event.data &&
            event.data.type &&
            Object.values(ClientToSharedWorkerServerMessageType).includes(event.data.type)
        ) {
            // Let the parent handle the message
            super.onClientConnectionMessage(clientConnection, event);
        }
        // Otherwise, this is a WebSocketSharedWorkerServer message
        else {
            const data = event.data as ClientToWebSocketSharedWorkerServerMessageInterface;

            // Handle the message based on its type
            switch(data.type) {
                case ClientToWebSocketSharedWorkerServerMessageType.ConnectWebSocket:
                    this.handleConnectWebSocketRequest(clientConnection, data as ConnectWebSocketMessageInterface);
                    break;

                case ClientToWebSocketSharedWorkerServerMessageType.SendWebSocketMessage:
                    this.handleSendWebSocketMessageRequest(clientConnection, data as SendWebSocketMessageInterface);
                    break;

                case ClientToWebSocketSharedWorkerServerMessageType.DisconnectWebSocket:
                    // Handle disconnect if needed
                    console.log(
                        '[WebSocketSharedWorkerServer] Disconnect WebSocket request received but not yet implemented',
                    );
                    break;

                default: {
                    console.log('[WebSocketSharedWorkerServer] Unhandled message type:', data);
                    break;
                }
            }
        }
    }

    // Handle request to connect to WebSocket server
    handleConnectWebSocketRequest(
        clientConnection: SharedWorkerClientConnection,
        message: ConnectWebSocketMessageInterface,
    ) {
        console.log('[WebSocketSharedWorkerServer] Connect WebSocket request:', message);

        // If we haven't handled the initial connection request yet
        if(!this.handledFirstConnectWebSocketRequest) {
            // Broadcast error if URL is missing
            if(!message.url) {
                console.error('[WebSocketSharedWorkerServer] Missing WebSocket URL');
                this.broadcastWebSocketErrorMessage('Missing WebSocket URL');
                return;
            }

            // Mark that we've handled the first connection request
            this.handledFirstConnectWebSocketRequest = true;

            // Connect to WebSocket server
            const webSocketConnectionConnectResult = this.webSocketConnection.connect(message.url, message.protocols);

            // Broadcast error if connection failed
            if(!webSocketConnectionConnectResult) {
                this.broadcastWebSocketErrorMessage('Failed to connect to URL: ' + message.url);
            }
        }
    }

    // Function to handle requests to send a message to the WebSocket server
    handleSendWebSocketMessageRequest(
        clientConnection: SharedWorkerClientConnection,
        message: SendWebSocketMessageInterface,
    ) {
        console.log('[WebSocketSharedWorkerServer] Send WebSocket message request from', clientConnection.id, message);

        // Validate message data is present
        if(message.data === undefined) {
            console.error('[WebSocketSharedWorkerServer] Missing WebSocket message data');
            this.sendWebSocketErrorMessage(clientConnection, 'Missing WebSocket message data');
            return;
        }

        // Send the message on the WebSocket connection
        const webSocketConnectionSendResult = this.webSocketConnection.send(message.data);

        // If the message failed to send
        if(!webSocketConnectionSendResult) {
            // Send the error message to the client
            this.sendWebSocketErrorMessage(clientConnection, 'Failed to send message, WebSocket not connected');
        }
    }

    // Function to handle messages received from the WebSocket server
    // We use unknown type here as the WebSocket can receive any type of data
    handleWebSocketConnectionMessage(data: unknown) {
        console.log('[WebSocketSharedWorkerServer] Received WebSocket message:', data);

        // Broadcast the message to all connected clients
        this.broadcastMessage(createWebSocketDataMessage(data));
    }

    // Handle WebSocket connection state changes
    handleWebSocketConnectionStateChange(webSocketInformation: WebSocketConnectionInformationInterface) {
        console.log('[WebSocketSharedWorkerServer] WebSocket state changed:', webSocketInformation);
        // Broadcast the updated information to all clients
        this.broadcastMessage(createWebSocketConnectionInformationMessage(webSocketInformation));
    }

    // Function to send a web socket error message to a client
    sendWebSocketErrorMessage(clientConnection: SharedWorkerClientConnection, message: string) {
        this.sendMessage(clientConnection, createWebSocketErrorMessage(message));
    }

    // Function to broadcast a web socket error message to all clients
    broadcastWebSocketErrorMessage(message: string) {
        this.broadcastMessage(createWebSocketErrorMessage(message));
    }
}

// Export - Default
export default WebSocketSharedWorkerServer;
