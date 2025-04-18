// Note: After modifying this code you must manually run `npm run build:websocketsharedworker` to build the SharedWorker.

// Dependencies - Constants
import {
    WebSocketReconnectDelayBaseInMilliseconds,
    WebSocketMaximumReconnectDelayInMilliseconds,
    WebSocketConnectionTimeoutInMilliseconds,
    WebSocketPingIntervalInMilliseconds,
} from '@structure/source/api/web-sockets/shared-worker/WebSocketSharedWorkerConstants';

// Dependencies - Types
import {
    WebSocketConnectionState,
    WebSocketConnectionStatisticsInterface,
    WebSocketConnectionInformationInterface,
    WebSocketServerToSharedWorkerServerMessageType,
    WebSocketErrorInformationInterface,
    WebSocketErrorCode,
    SharedWorkerServerToWebSocketServerMessageType,
} from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// Class - WebSocketConnection
export class WebSocketConnection implements WebSocketConnectionInformationInterface {
    socket: WebSocket | null = null; // WebSocket connection
    protocols: string | string[] | null = null; // Protocols used for the WebSocket connection
    url: string | null = null; // URL of the WebSocket server
    state: WebSocketConnectionState = WebSocketConnectionState.Disconnected;
    connectionTimeout: number | null = null; // Timeout ID for initial connection attempt
    reconnectAttempts: number = 0;
    reconnectTimeout: number | null = null; // Timeout ID for reconnection
    nextReconnectAt: Date | null = null; // Timestamp of the next reconnection attempt
    maximumReconnectDelayInMilliseconds: number = WebSocketMaximumReconnectDelayInMilliseconds;
    pingInterval: number | null = null; // Interval ID for sending ping messages
    intentionallyDisconnected: boolean = false; // Flag to track if disconnection was intentional
    statistics: WebSocketConnectionStatisticsInterface;
    // Internet connectivity status, default to true if navigator is not defined
    internetAvailable: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
    lastError: WebSocketErrorInformationInterface | null = null; // Last error information
    createdAt: number = Date.now();

    // Callbacks
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

        // Get current internet availability status
        if(typeof navigator !== 'undefined') {
            this.internetAvailable = navigator.onLine;
            console.log(
                `[WebSocketConnection] Initial internet status: ${
                    this.internetAvailable ? 'available' : 'unavailable'
                }`,
            );
        }

        // Bind Internet availability event listeners
        this.bindInternetAvailabilityEvents();
    }

    // Function to bind network connectivity event listeners
    bindInternetAvailabilityEvents(): void {
        // Only bind these events in a browser environment
        if(typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            window.addEventListener('online', this.handleInternetAvailable);
            window.addEventListener('offline', this.handleInternetUnavailable);
        }
    }

    // Function to unbind network connectivity event listeners
    unbindInternetAvailabilityEvents(): void {
        if(typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleInternetAvailable);
            window.removeEventListener('offline', this.handleInternetUnavailable);
        }
    }

    // Function to handle when the Internet is available, using arrow function to preserve 'this' context
    handleInternetAvailable = (): void => {
        console.log('[WebSocketConnection] Internet available');
        this.internetAvailable = true;

        // Clear any previous network-related error
        if(this.lastError && this.lastError.code === WebSocketErrorCode.NetworkUnavailable) {
            this.lastError = null;
        }

        // If we have a URL and the disconnection was not intentional, try to reconnect when in Disconnected or Failed state
        if(
            this.url &&
            !this.intentionallyDisconnected &&
            (this.state === WebSocketConnectionState.Disconnected || this.state === WebSocketConnectionState.Failed)
        ) {
            console.log('[WebSocketConnection] Reconnecting due to network becoming available');

            // Clear any existing reconnect timeout
            if(this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }

            // Connect immediately
            this.connect(this.url, this.protocols || undefined);
        }
        else if(this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Not reconnecting, previous disconnection was intentional');
        }
    };

    // Function to handle when the Internet is unavailable, using arrow function to preserve 'this' context
    handleInternetUnavailable = (): void => {
        console.log('[WebSocketConnection] Internet unavailable');
        this.internetAvailable = false;

        // Update state to reflect network status
        this.updateState(WebSocketConnectionState.Disconnected);

        // Clear any reconnect timeout since it's pointless to try reconnecting without network
        if(this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
            this.nextReconnectAt = null; // Clear the next reconnect timestamp
        }
    };

    // Function to connect to WebSocket server
    connect(url: string, protocols?: string | string[]): boolean {
        // Store connection settings
        this.url = url;
        this.protocols = protocols || null;

        // Reset intentional disconnect flag since we're trying to connect now
        this.intentionallyDisconnected = false;

        // Don't attempt to connect if internet is unavailable
        if(!this.internetAvailable) {
            console.log('[WebSocketConnection] Cannot connect, Internet is unavailable');
            this.updateState(WebSocketConnectionState.Disconnected);
            return false;
        }

        // Clear any existing connection timeout
        if(this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }

        // Update state to connecting
        this.updateState(WebSocketConnectionState.Connecting);

        // Close existing socket if any
        if(this.socket) {
            this.socket.close();
        }

        try {
            // Create new WebSocket
            this.socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

            // Set up event handlers (using arrow functions, no need for bind)
            this.socket.onopen = this.handleOpen;
            this.socket.onmessage = this.handleMessage;
            this.socket.onerror = this.handleError;
            this.socket.onclose = this.handleClose;

            // Set connection timeout
            this.connectionTimeout = setTimeout(() => {
                console.error(
                    `[WebSocketConnection] Connection attempt timed out after ${WebSocketConnectionTimeoutInMilliseconds}ms`,
                );

                // Clear the timeout since it's been triggered
                this.connectionTimeout = null;

                // Track the timeout error
                this.lastError = {
                    message: 'WebSocket connection attempt timed out',
                    code: WebSocketErrorCode.ConnectionTimeout,
                    data: { url: this.url },
                    createdAt: new Date(),
                };

                // Close the socket if it exists
                if(this.socket) {
                    // Remove existing event handlers before closing
                    this.socket.onopen = null;
                    this.socket.onmessage = null;
                    this.socket.onerror = null;
                    this.socket.onclose = null;

                    try {
                        this.socket.close();
                    }
                    catch(error) {
                        console.error('[WebSocketConnection] Error closing timed out WebSocket:', error);
                    }

                    this.socket = null;
                }

                // Update state to failed
                this.updateState(WebSocketConnectionState.Failed);

                // Attempt to reconnect
                this.reconnect();
            }, WebSocketConnectionTimeoutInMilliseconds) as unknown as number;

            console.log('[WebSocketConnection] Connecting to', url);
            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Failed to create WebSocket:', error);

            // Track the error
            this.lastError = {
                message: 'Failed to create WebSocket connection',
                code: WebSocketErrorCode.ConnectionFailed,
                data: error,
                createdAt: new Date(),
            };

            // Clear connection timeout if there was an immediate error
            if(this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
                this.connectionTimeout = null;
            }

            this.updateState(WebSocketConnectionState.Failed);
            this.reconnect();
            return false;
        }
    }

    // Function to disconnect from the WebSocket server
    disconnect(code?: number, reason?: string): boolean {
        console.log('[WebSocketConnection] Disconnecting', code, reason);

        // Mark this as an intentional disconnection
        this.intentionallyDisconnected = true;

        // Clear any reconnection timeout and timestamp
        if(this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.nextReconnectAt = null;

        // Stop ping interval
        this.stopPingInterval();

        // Clear any connection timeout
        if(this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }

        // Close the socket if it exists
        if(this.socket) {
            try {
                this.socket.close(code, reason);
            }
            catch(error) {
                console.error('[WebSocketConnection] Error closing WebSocket:', error);
            }

            // Clear socket event handlers to prevent memory leaks
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
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

    // Function to handle WebSocket open event - using arrow function to preserve 'this' context
    handleOpen = () => {
        console.log('[WebSocketConnection] Connected to', this.url);

        // Clear any connection timeout since we're now connected
        if(this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }

        // Reset reconnection attempts and clear next reconnect timestamp
        this.reconnectAttempts = 0;
        this.nextReconnectAt = null;

        // Update statistics
        this.statistics.connectedAt = Date.now();

        // Start sending ping messages
        this.startPingInterval();

        // Update state - this will broadcast to all clients
        this.updateState(WebSocketConnectionState.Connected);
    };

    // Function to handle WebSocket message event - using arrow function to preserve 'this' context
    handleMessage = (event: MessageEvent) => {
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
    };

    // Function to handle WebSocket error event - using arrow function to preserve 'this' context
    handleError = (event: Event) => {
        console.error('[WebSocketConnection] Error:', event);

        // Store error information
        this.lastError = {
            message: 'WebSocket error event received',
            code: WebSocketErrorCode.ConnectionFailed,
            data: {
                readyState: this.socket?.readyState,
                event: event,
            },
            createdAt: new Date(),
        };

        // Update state to Failed since an error occurred
        this.updateState(WebSocketConnectionState.Failed);

        // Try to reconnect automatically if appropriate
        if(!this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Attempting reconnection after error');
            this.reconnect();
        }
    };

    // Function to handle WebSocket close event - using arrow function to preserve 'this' context
    handleClose = (event: CloseEvent) => {
        console.log('[WebSocketConnection] Disconnected:', event.code, event.reason);

        // Reset connection statistics
        this.statistics.connectedAt = null;

        // Stop the ping interval
        this.stopPingInterval();

        // Track the close event in lastError if not clean
        if(!event.wasClean) {
            console.error('[WebSocketConnection] WebSocket closed unexpectedly:', event.code, event.reason);

            // Store detailed error information about the close event
            this.lastError = {
                message: 'WebSocket closed unexpectedly',
                // If it's a standard WebSocket close code, use it, otherwise use our custom code
                code: event.code >= 1000 && event.code < 5000 ? event.code : WebSocketErrorCode.UnexpectedClose,
                data: {
                    standardCode: event.code, // Always store the original code
                    reason: event.reason || 'No reason provided',
                    wasClean: event.wasClean,
                },
                createdAt: new Date(),
            };
        }
        else {
            // Clean closure, clear any previous error
            this.lastError = null;
        }

        // Update state - this will broadcast to all clients
        this.updateState(WebSocketConnectionState.Disconnected);

        // If connection was not closed cleanly and this wasn't an intentional disconnection, attempt to reconnect
        if(!event.wasClean && !this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Attempting reconnection after unexpected closure');
            this.reconnect();
        }
        else if(this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Not reconnecting, disconnection was intentional');
        }
    };

    // Function to reconnect to the WebSocket server with exponential backoff and jitter
    reconnect(): void {
        // Only reconnect if not already reconnecting
        if(this.reconnectTimeout) {
            return;
        }

        // Don't attempt to reconnect if network is offline
        if(!this.internetAvailable) {
            console.log('[WebSocketConnection] Skipping reconnect attempt, Internet is unavailable');
            return;
        }

        // Don't attempt to reconnect if the disconnection was intentional
        if(this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Skipping reconnect attempt, disconnection was intentional');
            return;
        }

        // Increment reconnect attempts
        this.reconnectAttempts++;

        // Calculate base delay with proper exponential backoff
        // Always use the original base value (WebSocketReconnectDelayBaseInMilliseconds)
        // This ensures true exponential growth from a fixed starting point
        const baseDelay = Math.min(
            WebSocketReconnectDelayBaseInMilliseconds * Math.pow(1.5, this.reconnectAttempts - 1),
            WebSocketMaximumReconnectDelayInMilliseconds,
        );

        // Apply jitter, randomize between 80-120% of the base delay
        const jitterFactor = 0.8 + Math.random() * 0.4; // Random value between 0.8 and 1.2
        const delay = Math.floor(baseDelay * jitterFactor);

        console.log(`[WebSocketConnection] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        // Calculate when the next reconnection attempt will happen
        this.nextReconnectAt = new Date(Date.now() + delay);

        // Set timeout for reconnection
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.nextReconnectAt = null; // Clear the timestamp since we're attempting reconnection now

            // Check if internet is available before attempting to reconnect
            if(this.url && this.internetAvailable) {
                this.connect(this.url, this.protocols || undefined);
            }
            else if(this.url && !this.internetAvailable) {
                // Internet became unavailable during the timeout period
                console.log('[WebSocketConnection] Internet unavailable when reconnection timeout fired');

                // Store error information about the failed reconnection attempt
                this.lastError = {
                    message: 'Reconnection attempt failed - Internet unavailable',
                    code: WebSocketErrorCode.NetworkUnavailable,
                    data: {
                        reconnectAttempts: this.reconnectAttempts,
                        timestamp: new Date().toISOString(),
                    },
                    createdAt: new Date(),
                };

                // Update state to reflect the current situation
                this.updateState(WebSocketConnectionState.Failed);
            }
        }, delay) as unknown as number;
    }

    getWebSocketConnectionInformation(): WebSocketConnectionInformationInterface {
        return {
            url: this.url,
            state: this.state,
            readyState: this.socket ? this.socket.readyState : null,
            reconnectAttempts: this.reconnectAttempts,
            nextReconnectAt: this.nextReconnectAt,
            maximumReconnectDelayInMilliseconds: this.maximumReconnectDelayInMilliseconds,
            statistics: this.statistics,
            lastError: this.lastError,
            createdAt: this.createdAt,
        };
    }

    // Function for starting ping interval
    startPingInterval = (): void => {
        // Clear any existing ping interval first
        this.stopPingInterval();

        // Start a new interval to send pings
        this.pingInterval = setInterval(() => {
            // Only send ping if socket is connected
            if(this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.sendPing();
            }
        }, WebSocketPingIntervalInMilliseconds) as unknown as number;

        console.log(
            `[WebSocketConnection] Started ping interval (every ${WebSocketPingIntervalInMilliseconds / 1000}s)`,
        );
    };

    // Function for stopping ping interval
    stopPingInterval = (): void => {
        if(this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            console.log('[WebSocketConnection] Stopped ping interval');
        }
    };

    // Function to send a ping message
    sendPing = (): void => {
        if(!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        // Store the timestamp for latency calculation
        this.statistics.lastPingSentAt = Date.now();

        // Create and send the ping message
        const pingMessage = {
            type: SharedWorkerServerToWebSocketServerMessageType.Ping,
            createdAt: Date.now(),
        };

        try {
            this.send(pingMessage);
            console.log('[WebSocketConnection] Sent ping');
        }
        catch(error) {
            console.error('[WebSocketConnection] Error sending ping:', error);
        }
    };

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
