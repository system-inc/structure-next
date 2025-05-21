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
    connectionTimeout: ReturnType<typeof setTimeout> | null = null; // Timeout ID for initial connection attempt
    reconnectAttempts: number = 0;
    reconnectTimeout: ReturnType<typeof setTimeout> | null = null; // Timeout ID for reconnection
    nextReconnectAt: Date | null = null; // Timestamp of the next reconnection attempt
    maximumReconnectDelayInMilliseconds: number = WebSocketMaximumReconnectDelayInMilliseconds;
    isReconnecting: boolean = false; // Flag to prevent multiple simultaneous reconnect calls
    pingInterval: ReturnType<typeof setInterval> | null = null; // Interval ID for sending ping messages
    intentionallyDisconnected: boolean = false; // Flag to track if disconnection was intentional
    statistics: WebSocketConnectionStatisticsInterface;
    lastError: WebSocketErrorInformationInterface | null = null; // Last error information
    createdAt: number = Date.now();

    // Callbacks
    onMessage: (data: unknown) => void; // Callback for handling incoming messages
    onStateChange: (state: WebSocketConnectionInformationInterface) => void; // Callback for handling state changes

    // Store bound event listener references to ensure we can properly remove them
    private boundHandleInternetAvailable: EventListener | null = null;
    private boundHandleInternetUnavailable: EventListener | null = null;

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

        // Reset intentional disconnect flag since we're trying to connect now
        this.intentionallyDisconnected = false;

        // Reset reconnecting flag when starting a new connection
        this.isReconnecting = false;

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

            // Set up event handlers
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);
            this.socket.onclose = this.handleClose.bind(this);

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

                // Close the socket only if it exists and is still in CONNECTING state
                // This prevents race conditions where the socket connects successfully just as the timeout fires
                if(this.socket && this.socket.readyState === WebSocket.CONNECTING) {
                    console.log(
                        '[WebSocketConnection] Closing socket that is still in CONNECTING state due to timeout',
                    );

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
                // Socket is already connected, don't close it, just clear the error and return without further action
                else if(this.socket && this.socket.readyState === WebSocket.OPEN) {
                    console.log(
                        '[WebSocketConnection] Socket connected successfully despite timeout - keeping connection',
                    );

                    this.lastError = null;
                    // Don't update state or attempt reconnect since we have a valid connection
                    return;
                }

                // Only update state and reconnect if we haven't returned early due to successful connection
                // Update state to failed
                this.updateState(WebSocketConnectionState.Failed);

                // Attempt to reconnect
                this.reconnect();
            }, WebSocketConnectionTimeoutInMilliseconds);

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

        // Reset reconnecting state when disconnecting
        this.isReconnecting = false;

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

            // Store error information for disconnected socket
            this.lastError = {
                message: 'Cannot send message: WebSocket not connected',
                code: WebSocketErrorCode.ConnectionFailed,
                data: {
                    readyState: this.socket?.readyState,
                    attempted_message_type: typeof data,
                    timestamp: new Date().toISOString(),
                },
                createdAt: new Date(),
            };

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

            // Clear any previous send error
            if(
                this.lastError?.code === WebSocketErrorCode.ConnectionFailed &&
                this.lastError?.message?.includes('sending WebSocket message')
            ) {
                this.lastError = null;
            }

            // Broadcast the updated state
            this.updateState(this.state);

            return true;
        }
        catch(error) {
            console.error('[WebSocketConnection] Error sending message:', error);

            // Store detailed error information
            this.lastError = {
                message: 'Error sending WebSocket message',
                code: WebSocketErrorCode.ConnectionFailed,
                data: {
                    error:
                        error instanceof Error
                            ? {
                                  name: error.name,
                                  message: error.message,
                                  stack: error.stack,
                              }
                            : error,
                    dataType: typeof data,
                    timestamp: new Date().toISOString(),
                },
                createdAt: new Date(),
            };

            // Broadcast the updated state
            this.updateState(this.state);
            return false;
        }
    }

    // Function to handle WebSocket open event
    handleOpen() {
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

        // Update state, this will broadcast to all clients
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
            // Check if the message is a string that might be JSON
            if(typeof event.data === 'string') {
                // Trim whitespace to handle messages with leading whitespace
                const trimmedData = event.data.trim();
                // Check if the trimmed message starts with { or [ which indicates JSON
                if(trimmedData.startsWith('{') || trimmedData.startsWith('[')) {
                    // Use the trimmed data for parsing to handle whitespace properly
                    data = JSON.parse(trimmedData);

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
                        createdAt: Date.now(),
                    };
                }
            }
        }
        catch(error) {
            console.error('[WebSocketConnection] Error parsing message:', error);
            // Create a structured format for non-JSON messages
            data = {
                type: 'Unparseable',
                content: event.data,
                error: error instanceof Error ? error.message : 'Unknown error',
                createdAt: Date.now(),
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
    }

    // Function to handle WebSocket close event
    handleClose(event: CloseEvent) {
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

        // Update state, this will broadcast to all clients
        this.updateState(WebSocketConnectionState.Disconnected);

        // If connection was not closed cleanly and this wasn't an intentional disconnection, attempt to reconnect
        if(!event.wasClean && !this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Attempting reconnection after unexpected closure');
            this.reconnect();
        }
        else if(this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Not reconnecting, disconnection was intentional');
        }
    }

    // Function to reconnect to the WebSocket server with exponential backoff and jitter
    reconnect(): void {
        // Only reconnect if not already reconnecting (check both flag and timeout)
        if(this.reconnectTimeout || this.isReconnecting) {
            console.log('[WebSocketConnection] Reconnect already in progress, skipping duplicate attempt');
            return;
        }

        // Set flag to prevent race conditions from multiple event handlers
        this.isReconnecting = true;

        // Don't attempt to reconnect if the disconnection was intentional
        if(this.intentionallyDisconnected) {
            console.log('[WebSocketConnection] Skipping reconnect attempt, disconnection was intentional');
            this.isReconnecting = false;
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
            if(this.url) {
                this.connect(this.url, this.protocols || undefined);
            }

            // Reset reconnecting flag after attempt completes
            this.isReconnecting = false;
        }, delay);
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
    startPingInterval() {
        // Clear any existing ping interval first
        this.stopPingInterval();

        // Start a new interval to send pings
        this.pingInterval = setInterval(() => {
            // Only send ping if socket is connected
            if(this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.sendPing();
            }
        }, WebSocketPingIntervalInMilliseconds);

        console.log(
            `[WebSocketConnection] Started ping interval (every ${WebSocketPingIntervalInMilliseconds / 1000}s)`,
        );
    }

    // Function for stopping ping interval
    stopPingInterval() {
        if(this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            console.log('[WebSocketConnection] Stopped ping interval');
        }
    }

    // Function to send a ping message
    sendPing() {
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
