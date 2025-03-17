// Constants
const SharedWorkerClientConnectionHeartbeatIntervalInMilliseconds = 3000; // How often to check if clients are still alive (3 seconds)
const SharedWorkerClientConnectionHeartbeatTimeoutInMilliseconds = 10000; // How long before considering a client disconnected (10 seconds)
const WebSocketReconnectDelayBaseInMilliseconds = 1000; // Base delay for WebSocket reconnection (1 second)
const WebSocketMaximumReconnectDelayInMilliseconds = 30000; // Maximum WebSocket reconnection delay (30 seconds)

// Type - Base Message Types for SharedWorkerServer (for tab/window to SharedWorker communication)
const SharedWorkerMessages = {
    // Client to Server (tab/window to SharedWorker)
    ClientToServer: {
        Pong: 'Pong',
        RequestClientConnections: 'RequestClientConnections',
    },
    // Server to Client (SharedWorker to tab/window)
    ServerToClient: {
        Ping: 'Ping',
        ClientIdAssigned: 'ClientIdAssigned',
        ClientConnections: 'ClientConnections',
    }
};

// Type - WebSocket specific Message Types
const WebSocketMessages = {
    // Client to Server (tab/window to SharedWorker)
    ClientToServer: {
        ConnectWebSocket: 'ConnectWebSocket',     // Request to connect to WebSocket server
        DisconnectWebSocket: 'DisconnectWebSocket', // Request to disconnect from WebSocket server
        SendWebSocketMessage: 'SendWebSocketMessage', // Send message to WebSocket server
    },
    // Server to Client (SharedWorker to tab/window)
    ServerToClient: {
        WebSocketStateChanged: 'WebSocketStateChanged', // WebSocket connection state change
        WebSocketMessage: 'WebSocketMessage',    // Message from WebSocket server
    }
};

// Type - WebSocket Connection States
const WebSocketConnectionState = {
    Connecting: 'Connecting',
    Connected: 'Connected',
    Disconnected: 'Disconnected',
    Reconnecting: 'Reconnecting',
    Failed: 'Failed',
};

// Class - SharedWorkerServer
// SharedWorker which communicates with tabs via the SharedWorker API
class SharedWorkerServer {
    constructor() {
        // Map for all client connections (a tab or window)
        this.clientConnections = new Map();

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

    // Function to add a client connection
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
            type: SharedWorkerMessages.ServerToClient.ClientIdAssigned,
            clientId: clientId
        });

        // Broadcast updated client list to all clients
        this.broadcastClientConnections();

        // Log the total number of clients connected
        console.log('Total clients connected:', this.clientConnections.size);

        return clientConnection;
    }

    // Function to handle client disconnection
    handleClientDisconnection(clientConnection) {
        console.log('handleClientDisconnection:', clientConnection);

        if(this.clientConnections.has(clientConnection.id)) {
            // console.log('Removing client:', clientConnection);
            clientConnection.handleDisconnect();
            this.clientConnections.delete(clientConnection.id);
            this.broadcastClientConnections();
        }

        console.log('Total clients connected:', this.clientConnections.size);
    }

    // Function to setup heartbeat mechanism for detecting disconnected clients
    setupClientConnectionHeartbeat(clientConnection) {
        // Setup interval to check if client is still alive
        clientConnection.heartbeatInterval = setInterval(
            function () {
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
                            type: SharedWorkerMessages.ServerToClient.Ping
                        },
                        this.handleClientDisconnection.bind(this),
                    );

                    // If sending failed, skip further checks
                    if(!sendMessageResult) {
                        return;
                    }

                    // If the client has been inactive for too long, disconnect it
                    const inactiveTime = Date.now() - currentClientConnection.lastActive;
                    if(inactiveTime > SharedWorkerClientConnectionHeartbeatTimeoutInMilliseconds) {
                        console.log('Client timed out:', currentClientConnection.id);
                        this.handleClientDisconnection(currentClientConnection); // Use currentClientConnection consistently
                    }
                }
                catch(error) {
                    // If any other error occurs, disconnect the client
                    console.log('Heartbeat error, client disconnected:', clientConnection.id, error);
                    this.handleClientDisconnection(clientConnection);
                }
            }.bind(this),
            SharedWorkerClientConnectionHeartbeatIntervalInMilliseconds,
        );
    }

    // Function to send a message to a client
    sendMessage(clientConnection, message) {
        return clientConnection.sendMessage(
            message,
            this.handleClientDisconnection.bind(this)
        );
    }

    // Function to broadcast a message to all connected clients
    broadcastMessage(message) {
        this.clientConnections.forEach(function (clientConnection) {
            this.sendMessage(clientConnection, message);
        }.bind(this));
    }

    // Function to handle an incoming message from a tab
    onClientConnectionMessage(clientConnection, event) {
        // console.log('onClientConnectionMessage', clientConnection, event);

        // If the message is a pong
        if(event.data && event.data.type === SharedWorkerMessages.ClientToServer.Pong) {
            // Update the last active timestamp for the client
            clientConnection.updateLastActive();
        }
        // If the message is a request for client connections
        else if(event.data && event.data.type === SharedWorkerMessages.ClientToServer.RequestClientConnections) {
            // Send the client connections list to the client
            this.sendMessage(clientConnection, this.createClientConnectionsMessage());
        }
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
            type: SharedWorkerMessages.ServerToClient.ClientConnections,
            clientConnections: clientConnections
        };
    }

    // Function to broadcast client list to all connected clients
    broadcastClientConnections() {
        const clientListMessage = this.createClientConnectionsMessage();
        this.broadcastMessage(clientListMessage);
    }
}

// Class - SharedWorkerClientConnection
// Represents a client connection (browser tab or window) connected to the SharedWorkerServer
class SharedWorkerClientConnection {
    constructor(clientId, messagePort) {
        this.id = clientId;
        this.messagePort = messagePort;
        this.heartbeatInterval = null;
        this.firstConnected = Date.now();
        this.lastActive = Date.now();
    }

    // Function to send a message to this client
    sendMessage(message, onDisconnect) {
        // console.log('Sending message:', message, 'to', this.id);

        // Try to send the message
        try {
            this.messagePort.postMessage(message);
            return true;
        }
        // If an error occurs, handle disconnection
        catch(error) {
            console.log('[SharedWorkerClientConnection] Failed to send message:', error);
            // Call the provided disconnection handler
            onDisconnect(this);
            return false;
        }
    }

    // Function to update the last active timestamp
    updateLastActive() {
        this.lastActive = Date.now();
        return this.lastActive;
    }

    // Function to handle disconnection and clean up resources
    handleDisconnect() {
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}

// Class - WebSocketSharedWorker
// SharedWorker implementation for handling WebSocket connections
class WebSocketSharedWorkerServer extends SharedWorkerServer {
    constructor() {
        super();

        // WebSocket connection instance
        this.webSocketConnection = null;

        // WebSocket connection state
        this.webSocketState = WebSocketConnectionState.Disconnected;

        // Flag to track if we've handled an initial connection request
        this.handledFirstConnectWebSocketRequest = false;

        // Initialize WebSocket related functionality
        this.initializeWebSocket();
    }

    // Function to initialize the WebSocket
    initializeWebSocket() {
        // Create WebSocket connection with message and state change handlers
        this.webSocketConnection = new WebSocketConnection(
            this.handleWebSocketMessage.bind(this),
            this.handleWebSocketConnectionStateChange.bind(this)
        );
    }

    // Function to add a client connection
    addClientConnection(clientId, messagePort) {
        // Call the parent method to handle the basic client connection setup
        const clientConnection = super.addClientConnection(clientId, messagePort);

        // Create a comprehensive WebSocket state object
        const webSocketState = this.webSocketConnection ? this.webSocketConnection.getState() : {
            connectionState: this.webSocketState,
            createdAt: Date.now()
        };

        // Send the current WebSocket state to the new client
        console.log('[WebSocketSharedWorkerServer] Sending current WebSocket state to new client:', webSocketState);
        this.sendMessage(
            clientConnection,
            {
                type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
                ...webSocketState
            }
        );

        return clientConnection;
    }

    // Function to handle an incoming message from a tab (overriding parent method)
    onClientConnectionMessage(clientConnection, event) {
        // If the message is not a Pong, log
        if(event.data && event.data.type !== SharedWorkerMessages.ClientToServer.Pong) {
            console.log('[WebSocketSharedWorkerServer] Received message from client:', event.data);
        }

        // Call the parent method to handle basic client messages
        super.onClientConnectionMessage(clientConnection, event);

        // If no data or no type, ignore
        if(!event.data || !event.data.type) {
            return;
        }

        // Handle WebSocket-specific message types
        switch(event.data.type) {
            case WebSocketMessages.ClientToServer.ConnectWebSocket:
                this.handleConnectWebSocketRequest(clientConnection, event.data);
                break;

            case WebSocketMessages.ClientToServer.DisconnectWebSocket:
                this.handleDisconnectWebSocketRequest(clientConnection, event.data);
                break;

            case WebSocketMessages.ClientToServer.SendWebSocketMessage:
                this.handleSendWebSocketMessageRequest(clientConnection, event.data);
                break;
        }
    }

    // Handle request to connect to WebSocket server
    handleConnectWebSocketRequest(clientConnection, message) {
        console.log('[WebSocketSharedWorkerServer] Connect WebSocket request:', message);

        // If we've already handled an initial connection request, don't allow others
        if(this.handledFirstConnectWebSocketRequest) {
            console.log('[WebSocketSharedWorkerServer] Already handled initial connection, sending current state to client');

            // Send the current state to the client
            const webSocketState = this.webSocketConnection.getState();
            this.sendMessage(clientConnection, {
                type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
                ...webSocketState
            });
            return;
        }

        // Extract connection details
        const url = message.url;
        const protocols = message.protocols;

        if(!url) {
            console.error('[WebSocketSharedWorkerServer] Missing WebSocket URL');
            this.sendMessage(clientConnection, {
                type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
                state: WebSocketConnectionState.Failed,
                error: 'Missing WebSocket URL'
            });
            return;
        }

        // Mark that we've handled the first connection request
        this.handledFirstConnectWebSocketRequest = true;

        // Connect to WebSocket server
        const result = this.webSocketConnection.connect(url, protocols);

        // Notify the requesting client about the result
        if(!result) {
            this.sendMessage(clientConnection, {
                type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
                state: WebSocketConnectionState.Failed,
                error: 'Failed to connect'
            });
        }
    }

    // Handle request to disconnect from WebSocket server
    handleDisconnectWebSocketRequest(clientConnection, message) {
        console.log('[WebSocketSharedWorkerServer] Disconnect WebSocket request:', message);

        // Extract disconnect details
        const code = message.code;
        const reason = message.reason;

        // Disconnect from WebSocket server
        this.webSocketConnection.disconnect(code, reason);

        // Reset the connection request flag to allow reconnections
        this.handledFirstConnectWebSocketRequest = false;
    }

    // Handle request to send a message to the WebSocket server
    handleSendWebSocketMessageRequest(clientConnection, message) {
        console.log('[WebSocketSharedWorkerServer] Send WebSocket message request:', message);

        // Extract message data
        const data = message.data;

        if(!data) {
            console.error('[WebSocketSharedWorkerServer] Missing WebSocket message data');
            return;
        }

        // Add the sender's client ID to the message if not already present
        if(data && typeof data === 'object' && !data.clientId) {
            data.clientId = clientConnection.id;
        }

        // Send the message
        const result = this.webSocketConnection.send(data);

        // Optionally notify the client about send failures
        if(!result) {
            this.sendMessage(clientConnection, {
                type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
                state: this.webSocketState,
                error: 'Failed to send message, WebSocket not connected'
            });
        }
    }

    // Handle messages received from the WebSocket server
    handleWebSocketMessage(data) {
        console.log('[WebSocketSharedWorkerServer] Received WebSocket message:', data);

        // Create a message to send to clients
        const message = {
            type: WebSocketMessages.ServerToClient.WebSocketMessage,
            data: data
        };

        // If the message contains a specific client ID, send only to that client
        if(data && data.clientId && this.clientConnections.has(data.clientId)) {
            const targetClient = this.clientConnections.get(data.clientId);
            this.sendMessage(targetClient, message);
        }
        else {
            // Otherwise broadcast to all clients
            this.broadcastMessage(message);
        }
    }

    // Handle WebSocket connection state changes
    handleWebSocketConnectionStateChange(webSocketState) {
        console.log('[WebSocketSharedWorkerServer] WebSocket state changed:', webSocketState);

        // Update internal connection state
        this.webSocketState = webSocketState.connectionState;

        // Broadcast comprehensive state change to all clients
        this.broadcastMessage({
            type: WebSocketMessages.ServerToClient.WebSocketStateChanged,
            ...webSocketState
        });
    }
}

// Class - WebSocketConnection
// Manages WebSocket connection, reconnection, and message handling in the SharedWorker
class WebSocketConnection {
    constructor(onMessage, onStateChange) {
        // WebSocket instance
        this.socket = null;

        // Connection settings
        this.url = '';
        this.protocols = null;

        // Connection state
        this.connectionState = WebSocketConnectionState.Disconnected;
        this.reconnectAttempts = 0;
        this.reconnectTimeout = null;
        this.reconnectBackoff = WebSocketReconnectDelayBaseInMilliseconds;

        // Statistics and metrics
        this.statistics = {
            messagesSent: 0,
            messagesReceived: 0,
            bytesSent: 0,
            bytesReceived: 0,
            lastMessageSentAt: null,
            lastMessageReceivedAt: null,
            lastPingSentAt: null,
            lastPongReceivedAt: null,
            connectedAt: null,
            averageLatencyInMilliseconds: null
        };

        // Error tracking
        this.lastError = null;

        // Callbacks
        this.onMessage = onMessage;
        this.onStateChange = onStateChange;

        // Bind methods to preserve 'this' context
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.send = this.send.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.reconnect = this.reconnect.bind(this);
        this.updateConnectionState = this.updateConnectionState.bind(this);
        this.getState = this.getState.bind(this);
    }

    // Connect to WebSocket server
    connect(url, protocols) {
        // Store connection settings
        this.url = url;
        this.protocols = protocols;

        // Update state to connecting
        this.updateConnectionState(WebSocketConnectionState.Connecting);

        // Close existing socket if any
        if(this.socket) {
            this.socket.close();
        }

        try {
            // Create new WebSocket
            this.socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

            // Set up event handlers
            this.socket.onopen = this.handleOpen;
            this.socket.onmessage = this.handleMessage;
            this.socket.onerror = this.handleError;
            this.socket.onclose = this.handleClose;

            console.log('[WebSocketConnection] Connecting to', url);
            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Failed to create WebSocket:', error);
            this.updateConnectionState(WebSocketConnectionState.Failed);
            this.reconnect();
            return false;
        }
    }

    // Disconnect from WebSocket server
    disconnect(code, reason) {
        console.log('[WebSocketConnection] Disconnecting', code, reason);

        // Clear any reconnection timeout
        if(this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        // Close the socket if it exists
        if(this.socket) {
            try {
                this.socket.close(code, reason);
            }
            catch(error) {
                console.error('[WebSocketConnection] Error closing WebSocket:', error);
            }

            this.socket = null;
        }

        // Update state
        this.updateConnectionState(WebSocketConnectionState.Disconnected);
        return true;
    }

    // Send message to WebSocket server
    send(data) {
        // Check if socket is connected
        if(!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('[WebSocketConnection] Cannot send message: WebSocket not connected');
            this.lastError = {
                message: 'Cannot send message: WebSocket not connected',
                timestamp: Date.now()
            };
            // Notify about the error by updating state
            this.updateConnectionState(this.connectionState);
            return false;
        }

        try {
            // Convert data to JSON string if needed
            const message = typeof data === 'string' ? data : JSON.stringify(data);

            // Send the message
            this.socket.send(message);

            // Update statistics
            this.statistics.messagesSent++;
            this.statistics.bytesSent += message.length;
            this.statistics.lastMessageSentAt = Date.now();

            // Track ping messages for latency calculation
            if(data && data.type === 'ping') {
                this.statistics.lastPingSentAt = Date.now();
            }

            // Broadcast the updated state to notify about statistics changes
            this.updateConnectionState(this.connectionState);

            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Error sending message:', error);
            this.lastError = {
                message: `Error sending message: ${error.message}`,
                timestamp: Date.now()
            };
            // Notify about the error by updating state
            this.updateConnectionState(this.connectionState);
            return false;
        }
    }

    // Handle WebSocket open event
    handleOpen() {
        console.log('[WebSocketConnection] Connected to', this.url);

        // Reset reconnection attempts and backoff
        this.reconnectAttempts = 0;
        this.reconnectBackoff = WebSocketReconnectDelayBaseInMilliseconds;

        // Update statistics
        this.statistics.connectedAt = Date.now();

        // Reset error tracking on successful connection
        this.lastError = null;

        // Update state - this will broadcast to all clients
        this.updateConnectionState(WebSocketConnectionState.Connected);
    }

    // Get comprehensive WebSocket state
    getState() {
        return {
            // Basic connection state
            connectionState: this.connectionState,
            createdAt: Date.now(),

            // Connection details
            url: this.url,

            // Socket status
            readyState: this.socket ? this.socket.readyState : undefined,

            // Reconnection details
            reconnectAttempts: this.reconnectAttempts,
            reconnecting: this.reconnectTimeout !== null,
            reconnectDelayInMilliseconds: this.reconnectBackoff,
            maximumReconnectDelayInMilliseconds: WebSocketMaximumReconnectDelayInMilliseconds,

            // Statistics organized in a sub-object
            statistics: { ...this.statistics },

            // Error information
            lastError: this.lastError
        };
    }

    // Handle WebSocket message event
    handleMessage(event) {
        // Update statistics
        this.statistics.messagesReceived++;
        this.statistics.lastMessageReceivedAt = Date.now();

        // Track message size if available
        if(event.data && typeof event.data === 'string') {
            this.statistics.bytesReceived += event.data.length;
        } else if(event.data instanceof Blob) {
            this.statistics.bytesReceived += event.data.size;
        }

        // Parse message data
        let data;
        try {
            // First check if the message is JSON
            if(
                typeof event.data === 'string' &&
                (event.data.startsWith('{') || event.data.startsWith('['))
            ) {
                data = JSON.parse(event.data);

                // Check for pong messages to calculate latency
                if(data && data.type === 'pong') {
                    this.statistics.lastPongReceivedAt = Date.now();

                    // Calculate latency if we have both ping and pong timestamps
                    if(this.statistics.lastPingSentAt) {
                        const latency = this.statistics.lastPongReceivedAt - this.statistics.lastPingSentAt;

                        // Update average latency
                        if(this.statistics.averageLatencyInMilliseconds === null) {
                            this.statistics.averageLatencyInMilliseconds = latency;
                        } else {
                            // Simple moving average
                            this.statistics.averageLatencyInMilliseconds =
                                (this.statistics.averageLatencyInMilliseconds * 0.7) + (latency * 0.3);
                        }
                    }
                }
            }
            else {
                // Not JSON, use a structured format for non-JSON messages
                data = {
                    type: 'raw',
                    content: event.data,
                    timestamp: Date.now()
                };
            }
        }
        catch(error) {
            console.error('[WebSocketConnection] Error parsing message:', error);
            // Create a structured format for non-JSON messages
            data = {
                type: 'unparseable',
                content: event.data,
                error: error.message,
                timestamp: Date.now()
            };
        }

        // Notify message handler
        if(this.onMessage) {
            this.onMessage(data);
        }

        // Broadcast the updated state with new statistics to all clients
        this.updateConnectionState(this.connectionState);
    }

    // Handle WebSocket error event
    handleError(event) {
        console.error('[WebSocketConnection] Error:', event);

        // Track the error
        this.lastError = {
            message: event.message || 'WebSocket error',
            code: event.code,
            timestamp: Date.now()
        };

        // Broadcast the updated state with error information to all clients
        this.updateConnectionState(this.connectionState);
    }

    // Handle WebSocket close event
    handleClose(event) {
        console.log('[WebSocketConnection] Disconnected:', event.code, event.reason);

        // Track the close event in lastError if not clean
        if(!event.wasClean) {
            this.lastError = {
                message: `WebSocket closed unexpectedly${event.reason ? ': ' + event.reason : ''}`,
                code: event.code,
                timestamp: Date.now()
            };
        }

        // Reset connection statistics
        this.statistics.connectedAt = null;

        // Update state - this will broadcast to all clients
        this.updateConnectionState(WebSocketConnectionState.Disconnected);

        // If connection was not closed cleanly, attempt to reconnect
        if(!event.wasClean) {
            this.reconnect();
        }
    }

    // Reconnect to WebSocket server with exponential backoff
    reconnect() {
        // Only reconnect if not already reconnecting
        if(this.reconnectTimeout) {
            return;
        }

        // Increment reconnect attempts
        this.reconnectAttempts++;

        // Calculate delay with exponential backoff
        const delay = Math.min(
            this.reconnectBackoff * Math.pow(1.5, this.reconnectAttempts - 1),
            WebSocketMaximumReconnectDelayInMilliseconds
        );

        console.log(`[WebSocketConnection] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        // Update and broadcast reconnecting state
        this.updateConnectionState(WebSocketConnectionState.Reconnecting);

        // Set timeout for reconnection
        this.reconnectTimeout = setTimeout(
            function () {
                this.reconnectTimeout = null;
                this.connect(this.url, this.protocols);
            }.bind(this),
            delay,
        );
    }

    // Update connection state and notify handler
    updateConnectionState(state) {
        // Update internal state
        this.connectionState = state;

        // Get the complete state object
        const currentState = this.getState();

        // Notify state change handler with complete state object
        if(this.onStateChange) {
            this.onStateChange(currentState);
        }
    }
}

// Create the SharedWorker instance
new WebSocketSharedWorkerServer();
