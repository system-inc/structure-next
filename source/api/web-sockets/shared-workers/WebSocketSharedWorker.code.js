// Constants
const HEARTBEAT_INTERVAL_MS = 3000; // How often to check if clients are still alive (3 seconds)
const HEARTBEAT_TIMEOUT_MS = 10000; // How long before considering a client disconnected (10 seconds)

// Class - SharedWorkerClientConnection
// Represents a client connection (browser tab or window) connected to the SharedWorker
class SharedWorkerClientConnection {
    constructor(clientId, messagePort) {
        this.id = clientId;
        this.messagePort = messagePort;
        this.heartbeatInterval = null;
        this.firstConnected = Date.now();
        this.lastActive = Date.now();
    }

    // Send a message to this client
    sendMessage(message, onClientConnectionDisconnect) {
        console.log('sending message:', message, 'to', this.id);

        try {
            this.messagePort.postMessage(message);
            return true;
        } catch(error) {
            console.log('[SharedWorkerClientConnection] Failed to send message:', error);
            // Call the provided disconnection handler
            onClientConnectionDisconnect(this);
            return false;
        }
    }

    // Update the last active timestamp
    updateLastActive() {
        this.lastActive = Date.now();
        return this.lastActive;
    }

    // Handle disconnection and clean up resources
    handleDisconnect() {
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}

// Class - SharedWorkerServer
// SharedWorker which communicates with tabs via the SharedWorker API
class SharedWorkerServer {
    constructor() {
        this.clientConnections = new Map(); // Map for all client connections (a tab or window)

        // Add event listener for incoming connections (self here refers to the SharedWorkerGlobalScope)
        self.onconnect = this.onClientConnect.bind(this);
    }

    // Function to handle client connection to the SharedWorker detected by self.onconnect
    onClientConnect(event) {
        console.log('onClientConnect', event);

        // Create a unique identifier for the client
        const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Add the client
        this.addClientConnection(clientId, event.ports[0]);
    }

    // Function to add a client to the map
    addClientConnection(clientId, messagePort) {
        // Create client connection object
        const clientConnection = new SharedWorkerClientConnection(clientId, messagePort);

        // Save the client connection in the map
        this.clientConnections.set(clientId, clientConnection);

        // Add event listener for incoming messages from the client
        messagePort.onmessage = this.onClientConnectionMessage.bind(this, clientConnection);

        // Continuously send heartbeats to the client
        this.setupClientConnectionHeartbeat(clientConnection);

        // Send clientId to the client
        this.sendMessage(clientConnection, {
            type: 'ClientIdAssigned',
            clientId: clientId
        });

        // Broadcast updated client list to all clients
        this.broadcastClientConnections();

        // Log the total number of clients connected
        console.log('Total clients connected:', this.clientConnections.size);
    }

    // Function to send a message to a client
    sendMessage(clientConnection, message) {
        return clientConnection.sendMessage(
            message,
            this.onClientConnectionDisconnect.bind(this)
        );
    }

    // Function to handle client disconnection
    handleClientDisconnection(clientConnection) {
        if(this.clientConnections.has(clientConnection.id)) {
            clientConnection.handleDisconnect();
            this.clientConnections.delete(clientConnection.id);
            this.broadcastClientConnections();
        }
    }

    // Function to handle client disconnection detected by failed heartbeats or message posting
    onClientConnectionDisconnect(clientConnection) {
        console.log('onClientConnectionDisconnect:', clientConnection);
        this.handleClientDisconnection(clientConnection);
    }

    // Function to remove a client from the map
    removeClientConnection(clientConnection) {
        console.log('Removing client:', clientConnection);
        this.handleClientDisconnection(clientConnection);
        console.log('Total clients connected:', this.clientConnections.size);
    }

    // Function to handle an incoming message from a tab
    onClientConnectionMessage(clientConnection, event) {
        console.log('onClientMessage', clientConnection, event);

        if(event.data && event.data.type === 'Pong') {
            clientConnection.updateLastActive();
        } else if(event.data && event.data.type === 'RequestClientConnections') {
            this.sendMessage(clientConnection, this.createClientConnectionsMessage());
        }
    }

    // Function to setup heartbeat mechanism for detecting disconnected clients
    setupClientConnectionHeartbeat(clientConnection) {
        // Setup interval to check if client is still alive
        const heartbeatInterval = setInterval(function () {
            try {
                // Get the client connection (it might have been deleted)
                const currentClientConnection = this.clientConnections.get(clientConnection.id);
                if(!currentClientConnection) {
                    console.log('Client no longer exists:', clientConnection.id);
                    clearInterval(heartbeatInterval);
                    return;
                }

                // Send heartbeat message with disconnect handler
                const sendResult = currentClientConnection.sendMessage(
                    { type: 'Ping' },
                    this.onClientConnectionDisconnect.bind(this)
                );

                // If sending failed, skip further checks
                if(!sendResult) {
                    return;
                }

                // Check if client has responded recently
                const inactiveTime = Date.now() - currentClientConnection.lastActive;
                if(inactiveTime > HEARTBEAT_TIMEOUT_MS) {
                    console.log('Client timed out:', clientConnection.id);
                    this.removeClientConnection(clientConnection); // Correct function call
                    clearInterval(heartbeatInterval);
                }
            } catch(error) {
                // If any other error occurs, disconnect the client
                console.log('Heartbeat error, client disconnected:', clientConnection.id, error);
                this.removeClientConnection(clientConnection); // Correct function call
                clearInterval(heartbeatInterval);
            }
        }.bind(this), HEARTBEAT_INTERVAL_MS);

        // Store the interval ID in client connection
        clientConnection.heartbeatInterval = heartbeatInterval;
    }

    // Function to create client list message
    createClientConnectionsMessage() {
        // Create array of client data
        const clientConnections = Array.from(this.clientConnections.values()).map(connection => ({
            id: connection.id,
            firstConnected: connection.firstConnected,
            lastActive: connection.lastActive
        }));

        return {
            type: 'ClientConnections',
            clientConnections: clientConnections
        };
    }

    // Function to broadcast a message to all connected clients
    broadcastMessage(message) {
        this.clientConnections.forEach(function (clientConnection) {
            this.sendMessage(clientConnection, message);
        }.bind(this));
    }

    // Function to broadcast client list to all connected clients
    broadcastClientConnections() {
        const clientListMessage = this.createClientConnectionsMessage();
        this.broadcastMessage(clientListMessage);
    }
}

// Class - WebSocketSharedWorker
// SharedWorker implementation for handling WebSocket connections
class WebSocketSharedWorkerServer extends SharedWorkerServer {
    constructor() {
        super();
    }
}

// Create the SharedWorker instance
new WebSocketSharedWorkerServer();
