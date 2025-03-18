/**
 * WebSocket SharedWorker Constants
 */

// Heartbeat configuration
export const SharedWorkerClientConnectionHeartbeatIntervalInMilliseconds = 3000; // How often to check if clients are still alive (3 seconds)
export const SharedWorkerClientConnectionHeartbeatTimeoutInMilliseconds = 10000; // How long before considering a client disconnected (10 seconds)

// WebSocket reconnection configuration
export const WebSocketReconnectDelayBaseInMilliseconds = 1000; // Base delay for WebSocket reconnection (1 second)
export const WebSocketMaximumReconnectDelayInMilliseconds = 30000; // Maximum WebSocket reconnection delay (30 seconds)
