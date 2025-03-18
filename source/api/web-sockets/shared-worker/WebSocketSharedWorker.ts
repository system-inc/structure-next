/**
 * WebSocketSharedWorker instance
 *
 * Main entry point for the WebSocket SharedWorker instance.
 * The resulting SharedWorker code is transpiled and placed in:
 * ./libraries/structure/source/api/web-sockets/shared-worker/generated/WebSocketSharedWorker.code.js
 *
 * Web browsers can download the SharedWorker script from /api/web-sockets/shared-workers/web-socket-shared-worker.js
 *
 */

// Dependencies - Classes
import { WebSocketSharedWorkerServer } from '@structure/source/api/web-sockets/shared-worker/WebSocketSharedWorkerServer';

// Create the WebSocket SharedWorker instance
const webSocketSharedWorkerServer = new WebSocketSharedWorkerServer();

// Export - Default
export default webSocketSharedWorkerServer;
