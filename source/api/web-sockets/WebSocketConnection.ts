'use client'; // This component uses client-only features

import {
    WebSocketState,
    WebSocketConnectionState,
    WebSocketMessageType,
} from '@structure/source/api/web-sockets/types/WebSocketTypes';

// Class - WebSocketConnection
// Manages WebSocket connection, reconnection, and message handling
export class WebSocketConnection {
    // WebSocket instance
    private socket: WebSocket | null = null;

    // Connection settings
    private url: string = '';
    private protocols: string | string[] | null = null;

    // Connection state
    private connectionState: WebSocketConnectionState = WebSocketConnectionState.Disconnected;
    private reconnectAttempts: number = 0;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private reconnectBackoff: number = 1000; // Base delay: 1 second
    private maximumReconnectDelay: number = 30000; // 30 seconds

    // Statistics and metrics
    private statistics = {
        messagesSent: 0,
        messagesReceived: 0,
        bytesSent: 0,
        bytesReceived: 0,
        lastMessageSentAt: undefined as number | undefined,
        lastMessageReceivedAt: undefined as number | undefined,
        lastPingSentAt: undefined as number | undefined,
        lastPongReceivedAt: undefined as number | undefined,
        connectedAt: undefined as number | undefined,
        averageLatencyInMilliseconds: undefined as number | undefined,
    };

    // Error tracking
    private lastError: { message: string; code?: number; timestamp: number } | null = null;

    // Callbacks
    private onStateChange: (state: WebSocketState) => void;
    private onMessage: (data: unknown) => void;

    constructor(onMessage: (data: unknown) => void, onStateChange: (state: WebSocketState) => void) {
        this.onMessage = onMessage;
        this.onStateChange = onStateChange;
    }

    // Connect to WebSocket server
    connect(url: string, protocols?: string | string[]): boolean {
        this.url = url;
        this.protocols = protocols || null;

        this.updateConnectionState(WebSocketConnectionState.Connecting);

        // Close existing socket if any
        if(this.socket) {
            this.socket.close();
            this.socket = null;
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
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.lastError = {
                message: `Failed to create WebSocket: ${errorMessage}`,
                timestamp: Date.now(),
            };
            this.updateConnectionState(WebSocketConnectionState.Failed);
            this.reconnect();
            return false;
        }
    }

    // Disconnect from WebSocket server
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
        this.updateConnectionState(WebSocketConnectionState.Disconnected);
        return true;
    }

    // Send message to WebSocket server
    send(data: unknown): boolean {
        // Check if socket is connected
        if(!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('[WebSocketConnection] Cannot send message: WebSocket not connected');
            this.lastError = {
                message: 'Cannot send message: WebSocket not connected',
                timestamp: Date.now(),
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
            if(typeof data === 'object' && data !== null && 'type' in data && data.type === WebSocketMessageType.Ping) {
                this.statistics.lastPingSentAt = Date.now();
            }

            // Update state
            this.updateConnectionState(this.connectionState);

            return true;
        }
        catch(error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('[WebSocketConnection] Error sending message:', error);
            this.lastError = {
                message: `Error sending message: ${errorMessage}`,
                timestamp: Date.now(),
            };
            // Notify about the error by updating state
            this.updateConnectionState(this.connectionState);
            return false;
        }
    }

    // Get comprehensive WebSocket state
    getState(): WebSocketState {
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
            maximumReconnectDelayInMilliseconds: this.maximumReconnectDelay,

            // Statistics organized in a sub-object
            statistics: { ...this.statistics },

            // Error information
            lastError: this.lastError || undefined,
        };
    }

    // Handle WebSocket open event
    private handleOpen(): void {
        console.log('[WebSocketConnection] Connected to', this.url);

        // Reset reconnection attempts and backoff
        this.reconnectAttempts = 0;
        this.reconnectBackoff = 1000;

        // Update statistics
        this.statistics.connectedAt = Date.now();

        // Reset error tracking on successful connection
        this.lastError = null;

        // Update state
        this.updateConnectionState(WebSocketConnectionState.Connected);
    }

    // Handle WebSocket message event
    private handleMessage(event: MessageEvent): void {
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
        let data;
        try {
            // First check if the message is JSON
            if(typeof event.data === 'string' && (event.data.startsWith('{') || event.data.startsWith('['))) {
                data = JSON.parse(event.data);

                // Check for pong messages to calculate latency
                if(data && data.type === 'pong') {
                    this.statistics.lastPongReceivedAt = Date.now();

                    // Calculate latency if we have both ping and pong timestamps
                    if(this.statistics.lastPingSentAt) {
                        const latency = this.statistics.lastPongReceivedAt - this.statistics.lastPingSentAt;

                        // Update average latency
                        if(this.statistics.averageLatencyInMilliseconds === undefined) {
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
                    type: 'raw',
                    content: event.data,
                    timestamp: Date.now(),
                };
            }
        }
        catch(error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('[WebSocketConnection] Error parsing message:', error);
            // Create a structured format for non-JSON messages
            data = {
                type: 'unparseable',
                content: event.data,
                error: errorMessage,
                timestamp: Date.now(),
            };
        }

        // Notify message handler
        if(this.onMessage) {
            this.onMessage(data);
        }

        // Update state with new statistics
        this.updateConnectionState(this.connectionState);
    }

    // Handle WebSocket error event
    private handleError(event: Event): void {
        console.error('[WebSocketConnection] Error:', event);

        // Track the error
        this.lastError = {
            message: 'WebSocket error',
            timestamp: Date.now(),
        };

        // Update state with error information
        this.updateConnectionState(this.connectionState);
    }

    // Handle WebSocket close event
    private handleClose(event: CloseEvent): void {
        console.log('[WebSocketConnection] Disconnected:', event.code, event.reason);

        // Track the close event in lastError if not clean
        if(!event.wasClean) {
            this.lastError = {
                message: `WebSocket closed unexpectedly${event.reason ? ': ' + event.reason : ''}`,
                code: event.code,
                timestamp: Date.now(),
            };
        }

        // Reset connection statistics
        this.statistics.connectedAt = undefined;

        // Update state
        this.updateConnectionState(WebSocketConnectionState.Disconnected);

        // If connection was not closed cleanly, attempt to reconnect
        if(!event.wasClean) {
            this.reconnect();
        }
    }

    // Reconnect to WebSocket server with exponential backoff
    private reconnect(): void {
        // Only reconnect if not already reconnecting
        if(this.reconnectTimeout) {
            return;
        }

        // Increment reconnect attempts
        this.reconnectAttempts++;

        // Calculate delay with exponential backoff
        const delay = Math.min(
            this.reconnectBackoff * Math.pow(1.5, this.reconnectAttempts - 1),
            this.maximumReconnectDelay,
        );

        console.log(`[WebSocketConnection] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        // Update state
        this.updateConnectionState(WebSocketConnectionState.Reconnecting);

        // Set timeout for reconnection
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect(this.url, this.protocols as string | string[] | undefined);
        }, delay);
    }

    // Update connection state and notify handler
    private updateConnectionState(state: WebSocketConnectionState): void {
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
