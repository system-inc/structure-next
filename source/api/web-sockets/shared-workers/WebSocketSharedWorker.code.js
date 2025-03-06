/**
 * SharedWorker for WebSocket Connections
 * 
 * This worker provides a single shared WebSocket connection across multiple browser tabs.
 * It implements connection sharing, automatic reconnection, message queuing, health 
 * monitoring, and performance metrics tracking.
 */

// Message type constants
const MESSAGE_TYPES = {
    // Client to worker messages
    INITIALIZE: 'initialize',
    SEND: 'send',
    PING: 'ping',
    PONG: 'pong', // Client to worker pong response
    GET_METRICS: 'getMetrics',
    GET_CONNECTION_STATUS: 'getConnectionStatus',
    SET_CONFIGURATION: 'setConfiguration',
    CLEANUP: 'cleanup', // For explicit client cleanup

    // Worker to client messages
    CONNECTION_STATE: 'connectionState',
    INCOMING_MESSAGE: 'incomingMessage',
    ERROR: 'error',
    METRICS: 'metrics',
    CONFIGURATION_UPDATED: 'configurationUpdated',
    SEND_ACK: 'sendAck', // Acknowledgement for sent messages
};

// Connection status constants
const CONNECTION_STATUS = {
    CONNECTED: 'connected',
    CONNECTING: 'connecting',
    DISCONNECTED: 'disconnected'
};

// Debugging flag - set to true to enable extensive logging
const DEBUG_MODE = true;

// WebSocket ready state constants (for code readability)
const READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    NOT_INITIALIZED: -1
};

// Time constants (in milliseconds)
const TIME = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    ZOMBIE_TIMEOUT: 60 * 1000, // 1 minute
    HEARTBEAT_INTERVAL: 30 * 1000 // 30 seconds
};

// Configuration options
const configuration = {
    // Connection settings
    connection: {
        // Automatically reconnect when connection is lost
        autoReconnect: true
    },

    // Reconnection strategy
    reconnection: {
        // Maximum reconnection delay (30 seconds)
        maximumDelay: 30 * TIME.SECOND,
        // Base reconnection delay (1 second)
        baseDelay: TIME.SECOND,
        // Maximum number of reconnection attempts (0 = unlimited)
        maximumAttempts: 0,
        // Whether to implement adaptive backoff based on consecutive failures
        adaptiveBackoff: true,
        // Factor to reduce backoff after a successful connection (0.5 = halve the delay)
        backoffReductionFactor: 0.5
    },

    // Message handling
    messaging: {
        // Maximum size of message queue when offline
        maximumQueueSize: 100,
        // Whether to automatically queue messages when disconnected
        autoQueue: true,
        // Maximum memory usage in bytes for the queue (approximate, 1MB default)
        maximumQueueMemory: 1024 * 1024
    },

    // Health checks
    health: {
        // Whether to enable zombie connection detection
        zombieDetection: true,
        // Whether to send heartbeat pings
        heartbeat: true,
        // Whether to use WebSocket protocol ping/pong frames
        useProtocolPings: true,
        // How often to send protocol pings (in ms)
        protocolPingInterval: 45 * TIME.SECOND
    },

    // Debugging
    debug: {
        // Whether to enable verbose logging
        verboseLogging: false,
        // Whether to include timestamps in logs
        includeTimestamps: true,
        // Whether to log message sizes
        logMessageSizes: false
    }
};

// Performance metrics tracking
const metrics = {
    // Message statistics
    messages: {
        received: 0,
        sent: 0,
        queued: 0,
        dropped: 0,
        errors: 0
    },

    // Connection statistics
    connection: {
        reconnections: 0,
        lastConnectedAt: 0,
        lastMessageAt: 0,
        connectDuration: 0,
        totalUptime: 0
    }
};

/**
 * Helper function to reset metrics to their initial values
 */
function resetMetrics() {
    metrics.messages.received = 0;
    metrics.messages.sent = 0;
    metrics.messages.queued = 0;
    metrics.messages.dropped = 0;
    metrics.messages.errors = 0;

    metrics.connection.reconnections = 0;
    metrics.connection.lastConnectedAt = 0;
    metrics.connection.lastMessageAt = 0;
    metrics.connection.connectDuration = 0;
    metrics.connection.totalUptime = 0;
}

/**
 * Helper function to get current timestamp
 * @returns {number} Current timestamp in milliseconds
 */
function getTimestamp() {
    return Date.now();
}

/**
 * Helper function to format a timestamp
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted timestamp string
 */
function formatTimestamp(timestamp) {
    return new Date(timestamp).toISOString();
}

// Module state
const state = {
    // Client tracking - using a Map to store client ports with metadata
    clients: new Map(),

    // Client counter for generating unique IDs
    clientCounter: 0,

    // Debug flag to reset state on reload
    debugReset: true,

    // WebSocket state
    webSocket: null,
    webSocketUrl: '',
    connectionState: CONNECTION_STATUS.DISCONNECTED,
    connectionStartTime: 0,

    // Reconnection tracking
    reconnection: {
        attemptsCount: 0,
        timer: null,
        isInProgress: false
    },

    // Timers
    timers: {
        heartbeat: null,
        uptime: null,
        metrics: null,
        cleanup: null
    },

    // Message queuing
    messageQueue: [],
    highPriorityQueue: []  // For important messages that should be sent first
};

/**
 * Logs messages with timestamp and optional error highlighting
 * 
 * @param {string} message - The message to log
 * @param {boolean} isError - Whether this is an error message
 * @param {boolean} forceLog - Whether to force logging regardless of verbose setting
 */
function log(message, isError = false, forceLog = DEBUG_MODE) { // Controlled by DEBUG_MODE flag
    // Only log in verbose mode unless it's an error or force logging is enabled
    if(configuration.debug.verboseLogging || isError || forceLog) {
        let formattedMessage = message;

        // Add timestamp if configured
        if(configuration.debug.includeTimestamps) {
            formattedMessage = `[${formatTimestamp(getTimestamp())}] ${message}`;
        }

        // Add module identifier
        formattedMessage = `[WebSocketSharedWorker] ${formattedMessage}`;

        // Log with appropriate method
        const method = isError ? 'error' : 'log';
        console[method](formattedMessage);
    }
}

/**
 * Creates a standard error object for consistent error reporting
 * 
 * @param {string} message - The error message
 * @param {string} code - Optional error code
 * @param {any} data - Optional additional data
 * @returns {Object} - Standardized error object
 */
function createErrorObject(message, code = 'ERROR', data = null) {
    return {
        message: message,
        code: code,
        timestamp: getTimestamp(),
        data: data
    };
}

/**
 * Checks WebSocket health and detects zombie connections
 * Sends periodic pings to keep the connection alive
 * 
 * @returns {boolean} - Whether the health check was successful
 */
function checkWebSocketHealth() {
    // Skip check if health features are disabled
    if(!configuration.health.heartbeat && !configuration.health.zombieDetection) {
        return true;
    }

    // Skip if no active connection
    if(!state.webSocket || state.webSocket.readyState !== READY_STATE.OPEN) {
        return false;
    }

    // Check for zombie connections
    if(configuration.health.zombieDetection) {
        const now = getTimestamp();
        if(metrics.connection.lastMessageAt > 0 &&
            now - metrics.connection.lastMessageAt > TIME.ZOMBIE_TIMEOUT) {
            log(`Possible zombie connection detected (no messages for >${TIME.ZOMBIE_TIMEOUT / 1000}s), reconnecting`, true);
            closeWebSocket();
            return false;
        }
    }

    // Send heartbeat ping
    if(configuration.health.heartbeat) {
        try {
            state.webSocket.send(JSON.stringify({ type: MESSAGE_TYPES.PING }));
            log('Health check ping sent');
            return true;
        } catch(error) {
            log(`Health check error: ${error.message}`, true);
            metrics.messages.errors++;
            return false;
        }
    }

    return true;
}

/**
 * Gracefully closes the WebSocket connection
 * 
 * @param {number} code - Optional close code
 * @param {string} reason - Optional close reason
 */
function closeWebSocket(code = 1000, reason = 'Normal closure') {
    if(state.webSocket) {
        try {
            state.webSocket.close(code, reason);
        } catch(error) {
            log(`Error closing WebSocket: ${error.message}`, true);
        }
        state.webSocket = null;
    }

    // Reset connection state
    state.connectionState = CONNECTION_STATUS.DISCONNECTED;
}

/**
 * Gets the current number of active tabs
 * Counts by unique stable tab IDs to avoid duplicates from React StrictMode
 * 
 * @returns {number} - The count of active browser tabs
 */
function getActiveTabCount() {
    // If no tabs have stable IDs yet, use the raw count
    let unstableTabCount = 0;
    const stableTabIds = new Set();

    // Count unique stable tab IDs
    for(const [tabId, tabData] of state.clients.entries()) {
        if(tabData.stableTabId) {
            stableTabIds.add(tabData.stableTabId);
        } else {
            // If any tab doesn't have a stable ID yet, count it separately
            unstableTabCount++;
        }
    }

    // Log the current tab state for debugging
    if(DEBUG_MODE) {
        log(`Active tabs - Raw count: ${state.clients.size}, Unique stable IDs: ${stableTabIds.size}, Unstable: ${unstableTabCount}`);
        let i = 0;
        for(const [tabId, tabData] of state.clients.entries()) {
            log(`  Tab ${i++}: ID=${tabId}, stableID=${tabData.stableTabId || 'none'}, connected=${formatTimestamp(tabData.connectedAt)}`);
        }
    }

    // Return the combined count
    return stableTabIds.size + unstableTabCount;
}

/**
 * Performs a cleanup of stale connections
 * 
 * @returns {number} - The number of connections removed
 */
function cleanupStaleConnections() {
    const before = state.clients.size;

    // Iterate over all clients
    for(const [clientId, clientData] of state.clients.entries()) {
        try {
            // Try sending a simple ping message
            clientData.port.postMessage({ type: 'ping' });
        } catch(error) {
            // If sending fails, the connection is stale
            log(`Removing stale connection ${clientId}: ${error.message}`, true);
            state.clients.delete(clientId);
        }
    }

    const removed = before - state.clients.size;
    if(removed > 0) {
        log(`Removed ${removed} stale connections, ${state.clients.size} remaining`, true);
    }

    return removed;
}

/**
 * Broadcasts a message to all connected clients
 * 
 * @param {Object} message - The message to broadcast to all clients
 * @returns {number} - Number of clients that received the message
 */
/**
 * Helper to find a client by its port
 * 
 * @param {MessagePort} port - The port to find
 * @returns {Array|null} - [clientId, clientData] tuple or null if not found
 */
function findClientByPort(port) {
    for(const [clientId, clientData] of state.clients.entries()) {
        if(clientData.port === port) {
            return [clientId, clientData];
        }
    }
    return null;
}

/**
 * Helper to find a tab by its stable ID
 * 
 * @param {string} stableTabId - The stable tab ID to find
 * @returns {Array|null} - [clientId, clientData] tuple or null if not found
 */
function findClientByStableId(stableTabId) {
    if(!stableTabId) return null;

    for(const [clientId, clientData] of state.clients.entries()) {
        if(clientData.stableTabId === stableTabId) {
            return [clientId, clientData];
        }
    }
    return null;
}

/**
 * Broadcasts a message to all connected clients
 * 
 * @param {Object} message - The message to broadcast to all clients
 * @returns {number} - Number of clients that received the message
 */
function broadcastToClients(message) {
    let successCount = 0;

    // First clean up any stale connections
    cleanupStaleConnections();

    // Performance optimization: create a single copy of metrics
    // instead of creating a new copy for each client
    const messageToSend = {
        ...message
    };

    // If message contains metrics, update with latest client count
    if(message.metrics) {
        messageToSend.metrics = { ...metrics };
    }

    // Always include the current tab count in the state
    if(!messageToSend.state) {
        messageToSend.state = {};
    }
    messageToSend.state = {
        ...(messageToSend.state || {}),
        tabCount: getActiveTabCount()
    };

    // Iterate through client entries in the Map
    for(const [clientId, clientData] of state.clients.entries()) {
        try {
            clientData.port.postMessage(messageToSend);
            successCount++;
        } catch(error) {
            log(`Error broadcasting to client ${clientId}: ${error.message}`, true);
            metrics.messages.errors++;

            // Remove the client if we can't reach it
            state.clients.delete(clientId);
        }
    }

    return successCount;
}

/**
 * Estimates the size of an object in bytes
 * 
 * @param {any} object - The object to measure
 * @returns {number} - Approximate size in bytes
 */
function estimateObjectSize(object) {
    // Convert to JSON string and measure
    const jsonString = JSON.stringify(object);
    // Approximate size: 2 bytes per character (UTF-16)
    return jsonString.length * 2;
}

/**
 * Gets the combined memory usage of both standard and high-priority queues
 * 
 * @returns {number} - Total approximate memory usage in bytes
 */
function getQueueMemoryUsage() {
    let totalSize = 0;
    // Check regular queue
    for(const message of state.messageQueue) {
        totalSize += estimateObjectSize(message);
    }
    // Check high priority queue
    for(const message of state.highPriorityQueue) {
        totalSize += estimateObjectSize(message);
    }
    return totalSize;
}

/**
 * Determines if a message should be treated as high priority
 * 
 * @param {any} message - The message to evaluate
 * @returns {boolean} - Whether this is a high priority message
 */
function isHighPriorityMessage(message) {
    // Consider messages with certain types or properties as high priority
    // For example, authentication messages, critical updates, etc.
    if(typeof message === 'object' && message !== null) {
        // Check for priority flag first if it exists
        if(message.priority === 'high') {
            return true;
        }

        // Check message type
        if(message.type) {
            const highPriorityTypes = ['auth', 'heartbeat', 'critical'];
            return highPriorityTypes.includes(message.type);
        }
    }
    return false;
}

/**
 * Queues a message to be sent when the connection is restored
 * 
 * @param {any} message - The message to queue (will be serialized if not a string)
 * @param {boolean} highPriority - Force message to be high priority regardless of content
 * @returns {boolean} - Whether the message was successfully queued
 */
function queueMessage(message, highPriority = false) {
    // Skip if queuing is disabled
    if(!configuration.messaging.autoQueue) {
        return false;
    }

    // Check if size limit is reached
    const messageSize = estimateObjectSize(message);
    const currentMemoryUsage = getQueueMemoryUsage();
    const totalQueueLength = state.messageQueue.length + state.highPriorityQueue.length;

    // Determine if this is a high priority message
    const isPriority = highPriority || isHighPriorityMessage(message);
    const targetQueue = isPriority ? state.highPriorityQueue : state.messageQueue;

    // Log message size if configured
    if(configuration.debug.logMessageSizes) {
        log(`Message size: ${messageSize} bytes, current queue memory: ${currentMemoryUsage} bytes, priority: ${isPriority ? 'high' : 'normal'}`);
    }

    // Only queue if we have space (both count and memory constraints)
    if(totalQueueLength < configuration.messaging.maximumQueueSize &&
        currentMemoryUsage + messageSize <= configuration.messaging.maximumQueueMemory) {

        targetQueue.push(message);
        metrics.messages.queued++;
        log(`Message queued with ${isPriority ? 'high' : 'normal'} priority. Queue size: ${totalQueueLength + 1}, memory: ${currentMemoryUsage + messageSize} bytes`);
        return true;
    } else {
        // If queues are full but this is high priority, try to make room by removing a low priority message
        if(isPriority && state.messageQueue.length > 0) {
            // Remove the oldest low-priority message to make room
            const removedMessage = state.messageQueue.shift();
            const removedSize = estimateObjectSize(removedMessage);

            // Now add this high priority message
            state.highPriorityQueue.push(message);
            metrics.messages.queued++;
            metrics.messages.dropped++; // Count the displaced message as dropped

            log(`Displaced low priority message to make room for high priority message. Queue size: ${totalQueueLength}, memory: ${currentMemoryUsage - removedSize + messageSize} bytes`);
            return true;
        }

        metrics.messages.dropped++;
        if(totalQueueLength >= configuration.messaging.maximumQueueSize) {
            log(`Message queue count limit reached (${totalQueueLength}/${configuration.messaging.maximumQueueSize}), dropping message`, true);
        } else {
            log(`Message queue memory limit reached (${currentMemoryUsage}/${configuration.messaging.maximumQueueMemory} bytes), dropping message`, true);
        }
        return false;
    }
}

/**
 * Sends all queued messages when connection is restored
 * 
 * @returns {number} - Number of messages successfully sent
 */
function sendQueuedMessages() {
    const totalQueueLength = state.highPriorityQueue.length + state.messageQueue.length;

    if(totalQueueLength === 0 ||
        !state.webSocket ||
        state.webSocket.readyState !== READY_STATE.OPEN) {
        return 0;
    }

    log(`Sending ${totalQueueLength} queued messages (${state.highPriorityQueue.length} high priority, ${state.messageQueue.length} normal priority)`);
    let sentCount = 0;

    // First send all high priority messages
    while(state.highPriorityQueue.length > 0) {
        const message = state.highPriorityQueue.shift();
        try {
            state.webSocket.send(typeof message === 'string' ? message : JSON.stringify(message));
            metrics.messages.sent++;
            sentCount++;
        } catch(error) {
            log(`Error sending high priority queued message: ${error.message}`, true);
            metrics.messages.errors++;
            // Stop processing queue if there's an error
            return sentCount;
        }
    }

    // Then send regular priority messages
    while(state.messageQueue.length > 0) {
        const message = state.messageQueue.shift();
        try {
            state.webSocket.send(typeof message === 'string' ? message : JSON.stringify(message));
            metrics.messages.sent++;
            sentCount++;
        } catch(error) {
            log(`Error sending queued message: ${error.message}`, true);
            metrics.messages.errors++;
            // Stop processing queue if there's an error
            break;
        }
    }

    return sentCount;
}

/**
 * Establishes a WebSocket connection to the server
 * Handles connection lifecycle and reconnection
 * 
 * @returns {boolean} - Whether connection was initiated (true) or skipped (false)
 */
function connectWebSocket() {
    // Don't attempt to connect if there's no URL
    if(!state.webSocketUrl) {
        log('Cannot connect: No WebSocket URL provided', true);
        return false;
    }

    // Don't attempt to connect if already connecting or connected
    if(state.reconnection.isInProgress ||
        (state.webSocket && state.webSocket.readyState === READY_STATE.OPEN)) {
        return false;
    }

    // Update state
    state.reconnection.isInProgress = true;
    state.connectionState = CONNECTION_STATUS.CONNECTING;

    // Close any existing connections
    closeWebSocket();

    // Attempt connection
    log(`Connecting to WebSocket at ${state.webSocketUrl}`);
    state.webSocket = new WebSocket(state.webSocketUrl);

    // Variables to track protocol ping/pong
    let protocolPingTimer = null;
    let lastPongReceived = getTimestamp();

    // Handle WebSocket open event
    state.webSocket.onopen = function () {
        log('WebSocket connected', false, true); // Force log this important event
        state.reconnection.isInProgress = false;

        // Reset retry count only on successful connection
        if(configuration.reconnection.adaptiveBackoff) {
            // If adaptive backoff is enabled, reduce delay for next attempt
            // but don't completely reset to avoid flapping connections
            if(state.reconnection.attemptsCount > 0) {
                state.reconnection.attemptsCount = Math.max(
                    0,
                    Math.floor(state.reconnection.attemptsCount * configuration.reconnection.backoffReductionFactor)
                );
                log(`Reduced reconnection attempt count to ${state.reconnection.attemptsCount} after successful connection`);
            }
        } else {
            // Traditional behavior - reset attempts on success
            state.reconnection.attemptsCount = 0;
        }

        state.connectionState = CONNECTION_STATUS.CONNECTED;

        // Update connection metrics
        const now = getTimestamp();
        metrics.connection.lastConnectedAt = now;
        metrics.connection.lastMessageAt = now;
        state.connectionStartTime = now;

        // Start the heartbeat timer if health checks are enabled
        if(configuration.health.heartbeat) {
            if(state.timers.heartbeat) {
                clearInterval(state.timers.heartbeat);
            }
            state.timers.heartbeat = setInterval(checkWebSocketHealth, TIME.HEARTBEAT_INTERVAL);
        }

        // Start uptime tracking
        if(state.timers.metrics) {
            clearInterval(state.timers.metrics);
        }
        state.timers.metrics = setInterval(function () {
            if(state.connectionState === CONNECTION_STATUS.CONNECTED) {
                const currentTime = getTimestamp();
                const currentDuration = currentTime - state.connectionStartTime;
                metrics.connection.connectDuration = currentDuration;
                metrics.connection.totalUptime += TIME.SECOND / 1000; // Add 1 second to total uptime
            }
        }, TIME.SECOND);

        // Set up protocol-level ping/pong if enabled
        if(configuration.health.useProtocolPings) {
            if(protocolPingTimer) {
                clearInterval(protocolPingTimer);
            }

            // Set initial timestamp
            lastPongReceived = getTimestamp();

            // Setup protocol ping interval
            protocolPingTimer = setInterval(function () {
                if(state.webSocket && state.webSocket.readyState === READY_STATE.OPEN) {
                    try {
                        // Send a WebSocket protocol ping frame
                        state.webSocket.send(new Uint8Array(0));
                        log('Protocol ping sent');

                        // Check if we've been getting pong responses
                        const now = getTimestamp();
                        if(now - lastPongReceived > configuration.health.protocolPingInterval * 2) {
                            log('No protocol pong received recently, connection may be dead', true);
                            // Force reconnection
                            closeWebSocket();
                        }
                    } catch(error) {
                        log(`Error sending protocol ping: ${error.message}`, true);
                    }
                }
            }, configuration.health.protocolPingInterval);
        }

        // Send any queued messages
        const sentCount = sendQueuedMessages();
        if(sentCount > 0) {
            log(`Sent ${sentCount} queued messages after reconnection`);
        }

        // Notify all clients about the connection
        broadcastToClients({
            type: MESSAGE_TYPES.CONNECTION_STATE,
            status: CONNECTION_STATUS.CONNECTED,
            timestamp: getTimestamp(),
            metrics: { ...metrics }
        });

        return true;
    };

    // Handle WebSocket message event
    state.webSocket.onmessage = function (event) {
        try {
            // Update metrics
            metrics.messages.received++;
            metrics.connection.lastMessageAt = getTimestamp();

            // For protocol-level pong detection (zero-length message or binary message)
            if(event.data === '' || (event.data instanceof ArrayBuffer && event.data.byteLength === 0)) {
                lastPongReceived = getTimestamp();
                log('Protocol pong received');
                return;
            }

            // Parse the message
            const data = JSON.parse(event.data);

            // Log message size if configured
            if(configuration.debug.logMessageSizes) {
                log(`Received message: type=${data.type}, size=${estimateObjectSize(data)} bytes`);
            } else {
                log(`WebSocket message received: ${data.type}`);
            }

            // Special case for pong response
            if(data.type === MESSAGE_TYPES.PONG) {
                log('Server pong received');
                return;
            }

            // Broadcast the message to all connected clients
            broadcastToClients({
                type: MESSAGE_TYPES.INCOMING_MESSAGE,
                timestamp: getTimestamp(),
                data: data
            });
        } catch(error) {
            log(`Error parsing WebSocket message: ${error.message}`, true);
            metrics.messages.errors++;

            // Notify clients about the error
            broadcastToClients({
                type: MESSAGE_TYPES.ERROR,
                error: createErrorObject(
                    'Error parsing message from server',
                    'PARSE_ERROR',
                    { originalError: error.message }
                )
            });
        }
    };

    // Handle WebSocket error event
    state.webSocket.onerror = function (error) {
        log(`WebSocket error: ${error.message || 'Unknown error'}`, true, true); // Force log errors
        state.reconnection.isInProgress = false;
        metrics.messages.errors++;

        // Notify clients about the error
        broadcastToClients({
            type: MESSAGE_TYPES.ERROR,
            error: createErrorObject(
                error.message || 'WebSocket connection error',
                'WEBSOCKET_ERROR'
            ),
            metrics: { ...metrics }
        });
    };

    // Handle WebSocket close event
    state.webSocket.onclose = function (event) {
        log(`WebSocket disconnected (code: ${event.code}, reason: ${event.reason || 'No reason provided'})`, true);
        state.reconnection.isInProgress = false;
        state.connectionState = CONNECTION_STATUS.DISCONNECTED;

        // Stop heartbeat
        if(state.timers.heartbeat) {
            clearInterval(state.timers.heartbeat);
            state.timers.heartbeat = null;
        }

        // Clear protocol ping timer if active
        if(protocolPingTimer) {
            clearInterval(protocolPingTimer);
            protocolPingTimer = null;
        }

        // Notify clients about disconnection
        broadcastToClients({
            type: MESSAGE_TYPES.CONNECTION_STATE,
            status: CONNECTION_STATUS.DISCONNECTED,
            timestamp: getTimestamp(),
            code: event.code,
            reason: event.reason,
            metrics: { ...metrics }
        });

        // Skip reconnection if configured not to reconnect
        if(!configuration.connection.autoReconnect) {
            log('Automatic reconnection is disabled, not attempting to reconnect');
            return;
        }

        // Skip if we've reached the maximum reconnection attempts
        if(configuration.reconnection.maximumAttempts > 0 &&
            state.reconnection.attemptsCount >= configuration.reconnection.maximumAttempts) {
            log(`Maximum reconnection attempts (${configuration.reconnection.maximumAttempts}) reached, giving up`);
            return;
        }

        // Calculate backoff delay using exponential strategy
        let backoffDelay;

        if(configuration.reconnection.adaptiveBackoff) {
            // More sophisticated adaptive backoff based on network conditions
            const consecutiveFailures = state.reconnection.attemptsCount + 1;
            const jitter = 0.1 + (Math.random() * 0.3); // 10-40% jitter to avoid thundering herd
            backoffDelay = Math.min(
                configuration.reconnection.baseDelay * Math.pow(1.5, consecutiveFailures) * jitter,
                configuration.reconnection.maximumDelay
            );
        } else {
            // Traditional exponential backoff
            backoffDelay = Math.min(
                configuration.reconnection.baseDelay * Math.pow(2, state.reconnection.attemptsCount),
                configuration.reconnection.maximumDelay
            );
        }

        log(`Reconnecting in ${backoffDelay / 1000}s (attempt #${state.reconnection.attemptsCount + 1})`);
        metrics.connection.reconnections++;

        // Set timer for reconnection
        state.reconnection.timer = setTimeout(function () {
            state.reconnection.attemptsCount++;
            connectWebSocket();
        }, backoffDelay);
    };

    return true;
}

/**
 * Initializes the worker with a WebSocket URL and starts the connection
 * 
 * @param {string} url - The WebSocket server URL to connect to
 * @returns {boolean} - Whether initialization was successful
 */
function initialize(url) {
    if(!url) {
        log('Cannot initialize: No URL provided', true);
        return false;
    }

    state.webSocketUrl = url;
    return connectWebSocket();
}

/**
 * Handles a client message by dispatching to the appropriate handler
 * 
 * @param {MessagePort} port - The client's message port
 * @param {Object} message - The message from the client
 */
function handleClientMessage(port, message) {
    try {
        if(!message || !message.type) {
            log('Received invalid message from client', true);
            port.postMessage({
                type: MESSAGE_TYPES.ERROR,
                error: createErrorObject('Invalid message format', 'INVALID_MESSAGE')
            });
            return;
        }

        // Validate message structure to prevent injection attacks
        if(typeof message !== 'object' || Array.isArray(message)) {
            log('Invalid message format: not an object', true);
            port.postMessage({
                type: MESSAGE_TYPES.ERROR,
                error: createErrorObject('Invalid message format: must be an object', 'INVALID_MESSAGE_FORMAT')
            });
            return;
        }

        switch(message.type) {
            case MESSAGE_TYPES.INITIALIZE:
                // Initialize the WebSocket connection if not already
                if(!state.webSocketUrl) {
                    initialize(message.url);
                }
                else if(message.url !== state.webSocketUrl) {
                    // If URL changed, reconnect
                    log(`WebSocket URL changed from ${state.webSocketUrl} to ${message.url}`);
                    state.webSocketUrl = message.url;
                    connectWebSocket();
                }

                port.postMessage({
                    type: MESSAGE_TYPES.CONNECTION_STATE,
                    status: state.connectionState,
                    timestamp: getTimestamp(),
                    metrics: { ...metrics }
                });
                break;

            case MESSAGE_TYPES.SEND:
                // Validate message data
                if(!message.data) {
                    port.postMessage({
                        type: MESSAGE_TYPES.ERROR,
                        error: createErrorObject('No data provided for send operation', 'MISSING_DATA')
                    });
                    break;
                }

                // Send a message to the WebSocket server
                if(state.webSocket && state.webSocket.readyState === READY_STATE.OPEN) {
                    try {
                        const dataToSend = typeof message.data === 'string'
                            ? message.data
                            : JSON.stringify(message.data);

                        state.webSocket.send(dataToSend);
                        metrics.messages.sent++;

                        // Acknowledge successful send
                        if(message.requireAck) {
                            port.postMessage({
                                type: MESSAGE_TYPES.SEND_ACK,
                                messageId: message.messageId,
                                success: true,
                                timestamp: getTimestamp()
                            });
                        }
                    } catch(error) {
                        log(`Error sending message: ${error.message}`, true);
                        metrics.messages.errors++;
                        port.postMessage({
                            type: MESSAGE_TYPES.ERROR,
                            error: createErrorObject(
                                `Failed to send message: ${error.message}`,
                                'SEND_ERROR'
                            ),
                            messageId: message.messageId,
                            metrics: { ...metrics }
                        });
                    }
                }
                else {
                    // Queue the message for when connection is restored if allowed
                    const autoQueue = message.queue !== undefined ? message.queue : configuration.messaging.autoQueue;
                    const isQueued = autoQueue && queueMessage(message.data);

                    port.postMessage({
                        type: MESSAGE_TYPES.ERROR,
                        error: createErrorObject(
                            'Cannot send message: WebSocket is not connected',
                            'NOT_CONNECTED'
                        ),
                        messageId: message.messageId,
                        queued: isQueued,
                        queueSize: state.messageQueue.length,
                        connectionState: state.connectionState,
                        metrics: { ...metrics }
                    });
                }
                break;

            case MESSAGE_TYPES.PING:
                // Acknowledge ping for health checks
                // No need to send a response, this is just to check if the client is alive
                break;

            case MESSAGE_TYPES.PONG:
                // Client responded to our ping, mark the client as active
                const clientData = findClientByPort(port);
                if(clientData) {
                    const [clientId, data] = clientData;
                    data.lastActive = getTimestamp();
                    state.clients.set(clientId, data);
                }
                break;

            case MESSAGE_TYPES.GET_CONNECTION_STATUS:
                // Send the current connection state to the requester
                port.postMessage({
                    type: MESSAGE_TYPES.CONNECTION_STATE,
                    status: state.connectionState,
                    timestamp: getTimestamp(),
                    state: {
                        tabCount: getActiveTabCount(),
                        connectionState: state.connectionState
                    }
                });

                // If there is an active WebSocket but we're not showing as connected,
                // force a reconnection attempt
                if((state.connectionState !== CONNECTION_STATUS.CONNECTED || !state.webSocket) &&
                    state.webSocketUrl) {
                    log(`Connection status requested but state is ${state.connectionState}, WebSocket: ${!!state.webSocket}, attempting reconnection`);

                    // Check and fix WebSocket connection state
                    if(state.webSocket && state.webSocket.readyState === READY_STATE.OPEN) {
                        // WebSocket is actually open but our state is wrong
                        log(`WebSocket is actually OPEN but our state is ${state.connectionState}, fixing state`);
                        state.connectionState = CONNECTION_STATUS.CONNECTED;

                        // Force broadcast updated state to all clients
                        broadcastToClients({
                            type: MESSAGE_TYPES.CONNECTION_STATE,
                            status: CONNECTION_STATUS.CONNECTED,
                            timestamp: getTimestamp(),
                            state: {
                                tabCount: getActiveTabCount(),
                                connectionState: CONNECTION_STATUS.CONNECTED
                            }
                        });
                    } else if(!state.reconnection.isInProgress) {
                        // Need to reconnect
                        log(`Need to reconnect, current state: ${state.connectionState}`);
                        connectWebSocket();
                    }
                }
                break;

            case MESSAGE_TYPES.CLEANUP:
                // Tab explicitly requesting cleanup
                const stableTabId = message.tabId;
                if(stableTabId) {
                    const tabInfo = findClientByStableId(stableTabId);
                    if(tabInfo) {
                        const [foundClientId, _] = tabInfo;
                        log(`Explicit cleanup for tab with stable ID: ${stableTabId} (worker ID: ${foundClientId})`);
                        state.clients.delete(foundClientId);

                        // Notify other clients about the updated count
                        broadcastToClients({
                            type: MESSAGE_TYPES.METRICS,
                            timestamp: getTimestamp()
                        });
                    } else {
                        log(`Cleanup requested for unknown stable tab ID: ${stableTabId}`);
                    }
                }
                break;

            case MESSAGE_TYPES.GET_METRICS:
                // Return current metrics and state information
                port.postMessage({
                    type: MESSAGE_TYPES.METRICS,
                    timestamp: getTimestamp(),
                    metrics: { ...metrics },
                    state: {
                        queueSize: state.messageQueue.length + state.highPriorityQueue.length,
                        highPriorityQueueSize: state.highPriorityQueue.length,
                        clientCount: state.clients.size,
                        connectionState: state.connectionState,
                        connectionUrl: state.webSocketUrl || null,
                        readyState: state.webSocket ? state.webSocket.readyState : READY_STATE.NOT_INITIALIZED,
                        reconnectionAttempts: state.reconnection.attemptsCount
                    },
                    configuration: { ...configuration }
                });
                break;

            case MESSAGE_TYPES.SET_CONFIGURATION:
                // Update configuration options
                if(message.configuration) {
                    let isValid = true;
                    let validationErrors = [];

                    // Validate configuration before applying
                    if(message.configuration.messaging) {
                        // Validate queue sizes are positive numbers
                        if(message.configuration.messaging.maximumQueueSize !== undefined) {
                            if(typeof message.configuration.messaging.maximumQueueSize !== 'number' ||
                                message.configuration.messaging.maximumQueueSize < 0) {
                                isValid = false;
                                validationErrors.push('maximumQueueSize must be a positive number');
                            }
                        }

                        if(message.configuration.messaging.maximumQueueMemory !== undefined) {
                            if(typeof message.configuration.messaging.maximumQueueMemory !== 'number' ||
                                message.configuration.messaging.maximumQueueMemory < 0) {
                                isValid = false;
                                validationErrors.push('maximumQueueMemory must be a positive number');
                            }
                        }
                    }

                    if(message.configuration.reconnection) {
                        // Validate reconnection parameters
                        if(message.configuration.reconnection.maximumAttempts !== undefined) {
                            if(typeof message.configuration.reconnection.maximumAttempts !== 'number' ||
                                message.configuration.reconnection.maximumAttempts < 0) {
                                isValid = false;
                                validationErrors.push('maximumAttempts must be a positive number');
                            }
                        }

                        if(message.configuration.reconnection.maximumDelay !== undefined) {
                            if(typeof message.configuration.reconnection.maximumDelay !== 'number' ||
                                message.configuration.reconnection.maximumDelay < 0) {
                                isValid = false;
                                validationErrors.push('maximumDelay must be a positive number');
                            }
                        }

                        if(message.configuration.reconnection.baseDelay !== undefined) {
                            if(typeof message.configuration.reconnection.baseDelay !== 'number' ||
                                message.configuration.reconnection.baseDelay < 0) {
                                isValid = false;
                                validationErrors.push('baseDelay must be a positive number');
                            }
                        }
                    }

                    if(isValid) {
                        // Apply changes while preserving nested structure
                        if(message.configuration.connection) {
                            Object.assign(configuration.connection, message.configuration.connection);
                        }
                        if(message.configuration.reconnection) {
                            Object.assign(configuration.reconnection, message.configuration.reconnection);
                        }
                        if(message.configuration.messaging) {
                            Object.assign(configuration.messaging, message.configuration.messaging);
                        }
                        if(message.configuration.health) {
                            Object.assign(configuration.health, message.configuration.health);
                        }
                        if(message.configuration.debug) {
                            Object.assign(configuration.debug, message.configuration.debug);
                        }

                        log('Configuration updated', false, true);
                        port.postMessage({
                            type: MESSAGE_TYPES.CONFIGURATION_UPDATED,
                            timestamp: getTimestamp(),
                            configuration: { ...configuration }
                        });
                    } else {
                        // Report validation errors
                        log(`Invalid configuration: ${validationErrors.join(', ')}`, true);
                        port.postMessage({
                            type: MESSAGE_TYPES.ERROR,
                            error: createErrorObject(
                                `Invalid configuration: ${validationErrors.join(', ')}`,
                                'INVALID_CONFIGURATION',
                                { errors: validationErrors }
                            )
                        });
                    }
                }
                break;

            default:
                log(`Unknown message type received: ${message.type}`, true);
                port.postMessage({
                    type: MESSAGE_TYPES.ERROR,
                    error: createErrorObject(
                        `Unknown message type: ${message.type}`,
                        'UNKNOWN_MESSAGE_TYPE'
                    )
                });
                break;
        }
    } catch(error) {
        // Global error handler to prevent worker crashes
        log(`Unhandled error in handleClientMessage: ${error.message}`, true, true);
        try {
            port.postMessage({
                type: MESSAGE_TYPES.ERROR,
                error: createErrorObject(
                    `Worker internal error: ${error.message}`,
                    'WORKER_ERROR'
                )
            });
        } catch(portError) {
            // In case even the error reporting fails
            log(`Failed to send error to client: ${portError.message}`, true, true);
        }
    }
}

/**
 * Handle connections from clients (browser tabs)
 * Each new tab/client connects via a MessagePort
 */
self.addEventListener('connect', function (event) {
    // DIAGNOSTIC: Log all current clients
    log(`BEFORE CONNECT - Current clients: ${state.clients.size}`);
    state.clients.forEach((data, id) => {
        log(`Client ${id}: connected at ${formatTimestamp(data.connectedAt)}`);
    });

    const port = event.ports[0];

    // Clean up stale connections first
    cleanupStaleConnections();

    // Generate a unique ID for this client
    const clientId = `client_${Date.now()}_${state.clientCounter++}`;

    // Store the tab with its port and metadata
    state.clients.set(clientId, {
        port: port,
        connectedAt: Date.now(),
        lastActive: Date.now(),
        stableTabId: null // Will be set when first message is received
    });

    log(`Client ${clientId} connected (total: ${state.clients.size})`, false, true);

    // DIAGNOSTIC: Log all clients after adding this one
    log(`AFTER CONNECT - Current clients: ${state.clients.size}`);
    state.clients.forEach((data, id) => {
        log(`Client ${id}: connected at ${formatTimestamp(data.connectedAt)}`);
    });

    // Send current connection status to the client
    port.postMessage({
        type: MESSAGE_TYPES.CONNECTION_STATE,
        status: state.connectionState,
        timestamp: getTimestamp(),
        metrics: { ...metrics },
        state: {
            clientCount: state.clients.size,
            clientId: clientId,
            connectionState: state.connectionState
        }
    });

    // Set up message handling for this client - use onmessage instead of addEventListener
    port.onmessage = function (event) {
        // Update last active timestamp
        const clientData = state.clients.get(clientId);
        if(clientData) {
            clientData.lastActive = Date.now();

            // If this is the first message with a stable tab ID, store it
            if(event.data && event.data.tabId && !clientData.stableTabId) {
                clientData.stableTabId = event.data.tabId;
                log(`Associated tab ${clientId} with stable ID: ${event.data.tabId}`);
            }

            state.clients.set(clientId, clientData);
        }

        // Handle the message
        handleClientMessage(port, event.data);
    };

    // Start the port
    port.start();

    /**
     * Handle disconnection from a client
     * Cleanup resources if this was the last client
     */
    port.addEventListener('close', function () {
        // Delete this client by its ID
        state.clients.delete(clientId);
        log(`Client ${clientId} disconnected (remaining: ${state.clients.size})`);

        // DIAGNOSTIC: Log all remaining clients
        log(`AFTER DISCONNECT - Current clients: ${state.clients.size}`);
        state.clients.forEach((data, id) => {
            log(`Client ${id}: connected at ${formatTimestamp(data.connectedAt)}`);
        });

        // If no clients left, clean up resources
        if(state.clients.size === 0) {
            log('No clients remaining, closing WebSocket and cleaning up resources', false, true);

            // Close WebSocket
            closeWebSocket();

            // Clear timers
            if(state.reconnection.timer) {
                clearTimeout(state.reconnection.timer);
                state.reconnection.timer = null;
            }

            if(state.timers.heartbeat) {
                clearInterval(state.timers.heartbeat);
                state.timers.heartbeat = null;
            }

            if(state.timers.metrics) {
                clearInterval(state.timers.metrics);
                state.timers.metrics = null;
            }

            if(state.timers.cleanup) {
                clearInterval(state.timers.cleanup);
                state.timers.cleanup = null;
            }

            // Clear both message queues to free memory
            state.messageQueue.length = 0;
            state.highPriorityQueue.length = 0;

            // Reset metrics
            resetMetrics();

            // Reset state
            state.reconnection.attemptsCount = 0;
            state.connectionState = CONNECTION_STATUS.DISCONNECTED;
            state.connectionStartTime = 0;
            state.clientCounter = 0;
        }
    });

    // Set up periodic cleanup timer if not already running
    if(!state.timers.cleanup) {
        state.timers.cleanup = setInterval(function () {
            const removed = cleanupStaleConnections();
            if(removed > 0) {
                // If connections were removed, notify clients of the updated count
                broadcastToClients({
                    type: MESSAGE_TYPES.METRICS,
                    timestamp: getTimestamp()
                });
            }
        }, 60000); // Check every minute
    }
});

// Check if this is a fresh worker initialization by looking at a global variable
// @ts-expect-error - Access global scope
const globalScope = self || globalThis;

// Check if this is the first initialization of the worker
// @ts-expect-error - Using a property not in type definition
const isFirstInitialization = !globalScope.__workerInitialized;

// Create a Map to track unique stable clients for accurate counting
// This helps handle React StrictMode's double-mounting
// @ts-expect-error - Property not in type definition
globalScope.__uniqueStableClientIds = globalScope.__uniqueStableClientIds || new Map();

// Mark the worker as initialized
// @ts-expect-error - Setting a property not in type definition
globalScope.__workerInitialized = true;
// @ts-expect-error - Setting a property not in type definition
globalScope.__workerStartTime = globalScope.__workerStartTime || Date.now();
// @ts-expect-error - Setting a property not in type definition
globalScope.__connectionCount = (globalScope.__connectionCount || 0) + 1;

log(`==== WORKER INITIALIZATION STATUS ====`, false, true);
log(`First initialization: ${isFirstInitialization}`, false, true);
// @ts-expect-error - Accessing global property
log(`Worker start time: ${formatTimestamp(globalScope.__workerStartTime)}`, false, true);
// @ts-expect-error - Accessing global property
log(`Connection count: ${globalScope.__connectionCount}`, false, true);
log(`Current client count: ${state.clients.size}`, false, true);
log(`======================================`, false, true);

// FORCE RESET OF ALL CLIENTS ON WORKER INITIALIZATION
// This is a drastic measure but will ensure we don't have stale connections
if(state.debugReset) {
    // Clear all clients on first initialization
    if(isFirstInitialization) {
        state.clients.clear();
        log('FIRST INIT: Cleared all client connections', false, true);
    } else {
        log('REUSE: Keeping existing client connections', false, true);
    }
}

// Log initialization - always show this message
log(`WebSocketSharedWorker initialized (version: 2025-03-05-i)`, false, true);
