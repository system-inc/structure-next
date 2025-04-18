// Note: After modifying this code you must manually run `npm run build:websocketsharedworker` to build the SharedWorker.

// Dependencies - Constants
import {
    WebSocketReconnectDelayBaseInMilliseconds,
    WebSocketMaximumReconnectDelayInMilliseconds,
} from '@structure/source/api/web-sockets/shared-worker/WebSocketSharedWorkerConstants';

// Dependencies - Types
import {
    WebSocketConnectionState,
    WebSocketConnectionStatisticsInterface,
    WebSocketConnectionInformationInterface,
    WebSocketServerToSharedWorkerServerMessageType,
} from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// Class - WebSocketConnection
export class WebSocketConnection implements WebSocketConnectionInformationInterface {
    socket: WebSocket | null = null; // WebSocket connection
    protocols: string | string[] | null = null; // Protocols used for the WebSocket connection
    url: string | null = null; // URL of the WebSocket server
    state: WebSocketConnectionState = WebSocketConnectionState.Disconnected;
    reconnecting: boolean = false;
    reconnectAttempts: number = 0;
    reconnectTimeout: number | null = null; // Timeout ID for reconnection
    reconnectDelayInMilliseconds: number = WebSocketReconnectDelayBaseInMilliseconds;
    maximumReconnectDelayInMilliseconds: number = WebSocketMaximumReconnectDelayInMilliseconds;
    statistics: WebSocketConnectionStatisticsInterface;
    createdAt: number = Date.now();
    onMessage: (data: unknown) => void; // Callback for handling incoming messages
    onStateChange: (state: WebSocketConnectionInformationInterface) => void; // Callback for handling state changes

    constructor(
        onMessage: (data: unknown) => void,
        onStateChange: (state: WebSocketConnectionInformationInterface) => void,
    ) {
        // Statistics and metrics
        this.statistics = {
            messagesSent: 0,
            messagesReceived: 0,
            bytesSent: 0,
            bytesReceived: 0,
            averageLatencyInMilliseconds: null,
            lastMessageSentAt: null,
            lastMessageReceivedAt: null,
            lastPingSentAt: null,
            lastPongReceivedAt: null,
            connectedAt: null,
        };

        // Callbacks
        this.onMessage = onMessage;
        this.onStateChange = onStateChange;
    }

    // Function to connect to WebSocket server
    connect(url: string, protocols?: string | string[]): boolean {
        // Store connection settings
        this.url = url;
        this.protocols = protocols || null;

        // Update state to connecting
        this.updateState(WebSocketConnectionState.Connecting);

        // Close existing socket if any
        if(this.socket) {
            this.socket.close();
        }

        try {
            // Create new WebSocket
            this.socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

            // Set up event handlers
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);
            this.socket.onclose = this.handleClose.bind(this);

            console.log('[WebSocketConnection] Connecting to', url);
            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Failed to create WebSocket:', error);
            this.updateState(WebSocketConnectionState.Failed);
            this.reconnect();
            return false;
        }
    }

    // Function to disconnect from the WebSocket server
    disconnect(code?: number, reason?: string): boolean {
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
        this.updateState(WebSocketConnectionState.Disconnected);
        return true;
    }

    // Function to send message to WebSocket server
    send(data: unknown): boolean {
        // Check if socket is connected
        if(!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('[WebSocketConnection] Cannot send message: WebSocket not connected');
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

            // Broadcast the updated state
            this.updateState(this.state);

            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Error sending message:', error);
            // Broadcast the updated state
            this.updateState(this.state);
            return false;
        }
    }

    // Function to handle WebSocket open event
    handleOpen() {
        console.log('[WebSocketConnection] Connected to', this.url);

        // Reset reconnection attempts and backoff
        this.reconnectAttempts = 0;
        this.reconnectDelayInMilliseconds = WebSocketReconnectDelayBaseInMilliseconds;

        // Update statistics
        this.statistics.connectedAt = Date.now();

        // Update state - this will broadcast to all clients
        this.updateState(WebSocketConnectionState.Connected);
    }

    // Function to handle WebSocket message event
    handleMessage(event: MessageEvent) {
        // Update statistics
        this.statistics.messagesReceived++;
        this.statistics.lastMessageReceivedAt = Date.now();

        // Track message size if available
        if(event.data && typeof event.data === 'string') {
            this.statistics.bytesReceived += event.data.length;
        }
        else if(event.data instanceof Blob) {
            this.statistics.bytesReceived += event.data.size;
        }

        // Parse message data
        let data: unknown;
        try {
            // First check if the message is JSON
            if(typeof event.data === 'string' && (event.data.startsWith('{') || event.data.startsWith('['))) {
                data = JSON.parse(event.data);

                // Check for pong messages to calculate latency
                if(
                    data &&
                    typeof data === 'object' &&
                    'type' in data &&
                    data.type === WebSocketServerToSharedWorkerServerMessageType.Pong
                ) {
                    this.statistics.lastPongReceivedAt = Date.now();

                    // Calculate latency if we have both ping and pong timestamps
                    if(this.statistics.lastPingSentAt) {
                        const latency = this.statistics.lastPongReceivedAt - this.statistics.lastPingSentAt;

                        // Update average latency
                        if(this.statistics.averageLatencyInMilliseconds === null) {
                            this.statistics.averageLatencyInMilliseconds = latency;
                        }
                        else {
                            // Simple moving average
                            this.statistics.averageLatencyInMilliseconds =
                                this.statistics.averageLatencyInMilliseconds * 0.7 + latency * 0.3;
                        }
                    }
                }
            }
            else {
                // Not JSON, use a structured format for non-JSON messages
                data = {
                    type: 'Raw',
                    content: event.data,
                    timestamp: Date.now(),
                };
            }
        }
        catch(error) {
            console.error('[WebSocketConnection] Error parsing message:', error);
            // Create a structured format for non-JSON messages
            data = {
                type: 'Unparseable',
                content: event.data,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
            };
        }

        // Notify message handler
        if(this.onMessage) {
            this.onMessage(data);
        }

        // Broadcast the updated state with new statistics to all clients
        this.updateState(this.state);
    }

    // Function to handle WebSocket error event
    handleError(event: Event) {
        console.error('[WebSocketConnection] Error:', event);

        // Broadcast the updated state with error information to all clients
        this.updateState(this.state);
    }

    // Function to handle WebSocket close event
    handleClose(event: CloseEvent) {
        console.log('[WebSocketConnection] Disconnected:', event.code, event.reason);

        // Track the close event in lastError if not clean
        if(!event.wasClean) {
            console.error('[WebSocketConnection] WebSocket closed unexpectedly:', event.code, event.reason);
        }

        // Reset connection statistics
        this.statistics.connectedAt = null;

        // Update state - this will broadcast to all clients
        this.updateState(WebSocketConnectionState.Disconnected);

        // If connection was not closed cleanly, attempt to reconnect
        if(!event.wasClean) {
            this.reconnect();
        }
    }

    // Function to reconnect to the WebSocket server with exponential backoff and jitter
    reconnect(): void {
        // Only reconnect if not already reconnecting
        if(this.reconnectTimeout) {
            return;
        }

        // Increment reconnect attempts
        this.reconnectAttempts++;

        // Calculate base delay with exponential backoff
        const baseDelay = Math.min(
            this.reconnectDelayInMilliseconds * Math.pow(1.5, this.reconnectAttempts - 1),
            WebSocketMaximumReconnectDelayInMilliseconds,
        );

        // Apply jitter, randomize between 80-120% of the base delay
        const jitterFactor = 0.8 + Math.random() * 0.4; // Random value between 0.8 and 1.2
        const delay = Math.floor(baseDelay * jitterFactor);

        console.log(`[WebSocketConnection] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        // Update and broadcast reconnecting state
        this.updateState(WebSocketConnectionState.Reconnecting);

        // Set timeout for reconnection
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            if(this.url) {
                this.connect(this.url, this.protocols || undefined);
            }
        }, delay) as unknown as number;
    }

    getWebSocketConnectionInformation(): WebSocketConnectionInformationInterface {
        return {
            url: this.url,
            state: this.state,
            readyState: this.socket ? this.socket.readyState : null,
            reconnectAttempts: this.reconnectAttempts,
            reconnecting: this.reconnecting,
            reconnectDelayInMilliseconds: this.reconnectDelayInMilliseconds,
            maximumReconnectDelayInMilliseconds: this.maximumReconnectDelayInMilliseconds,
            statistics: this.statistics,
            createdAt: this.createdAt,
        };
    }

    // Function to update connection state and notify handler
    updateState(connectionState: WebSocketConnectionState): void {
        // Update internal state
        this.state = connectionState;

        // Notify state change handler with complete state object
        if(this.onStateChange) {
            this.onStateChange(this.getWebSocketConnectionInformation());
        }
    }
}

// Export - Default
export default WebSocketConnection;
