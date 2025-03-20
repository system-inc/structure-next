// Note: After modifying this code you must manually run `npm run build:websocketsharedworker` to build the SharedWorker.

// Dependencies - Types
import { SharedWorkerServerToClientMessageInterface } from '@structure/source/api/web-sockets/shared-worker/types/SharedWorkerTypes';

// Class - SharedWorkerClientConnection
// Represents a client connection (browser tab or window) connected to the SharedWorkerServer
export interface SharedWorkerClientConnectionInterface {
    id: string;
    lastActiveAt: Date;
    firstConnectedAt: Date;
}
export class SharedWorkerClientConnection implements SharedWorkerClientConnectionInterface {
    id: string; // Unique ID for this client connection
    messagePort: MessagePort; // MessagePort for communication with the client
    heartbeatInterval: NodeJS.Timeout | null = null; // Interval for sending heartbeat messages
    lastActiveAt: Date; // Date when the client was last active
    firstConnectedAt: Date; // Date when the client first connected

    constructor(id: string, messagePort: MessagePort) {
        this.id = id;
        this.messagePort = messagePort;
        this.firstConnectedAt = new Date();
        this.lastActiveAt = new Date();
    }

    // Function to send a message to this client
    sendMessage(
        message: SharedWorkerServerToClientMessageInterface,
        onDisconnect: (client: SharedWorkerClientConnection) => void,
    ): boolean {
        // console.log('Sending message:', message, 'to', this.id);

        // Try to send the message
        try {
            this.messagePort.postMessage(message);
            return true;
        }
        catch(error) {
            // If an error occurs, handle disconnection
            console.log('[SharedWorkerClientConnection] Failed to send message:', error);
            // Call the provided disconnection handler
            onDisconnect(this);
            return false;
        }
    }

    // Function to update the last active date for this client
    updateLastActive(): Date {
        this.lastActiveAt = new Date();
        return this.lastActiveAt;
    }

    // Function to handle disconnection
    handleDisconnect(): void {
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}

// Export - Default
export default SharedWorkerClientConnection;
