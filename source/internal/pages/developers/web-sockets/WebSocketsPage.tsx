'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';

// Dependencies - Provider
import { useWebSocketViaSharedWorker } from '@structure/source/api/web-sockets/providers/WebSocketViaSharedWorkerProvider';
import { WebSocketConnectionState } from '@structure/source/api/web-sockets/types/WebSocketTypes';

// Components
import { Button } from '@structure/source/common/buttons/Button';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Component - WebSocketsPage
export interface WebSocketsPageProperties {}

export function WebSocketsPage() {
    // State
    const [webSocketUrl, setWebSocketUrl] = React.useState<string>('wss://echo.websocket.org');
    const [message, setMessage] = React.useState<string>('Hello, WebSocket!');

    // Time formatting state
    const [formattedTimes, setFormattedTimes] = React.useState({
        stateUpdatedAt: '',
        connectedSince: '',
        lastMessageSent: '',
        lastMessageReceived: '',
        errorTime: '',
        clientConnectedTimes: {} as Record<string, { connectedTime: string; lastActiveTime: string }>,
    });

    // Custom handlers for FormInputText
    const handleWebSocketUrlChange = React.useCallback(function (value: string | undefined) {
        if(value !== undefined) {
            setWebSocketUrl(value);
        }
    }, []);

    const handleMessageChange = React.useCallback(function (value: string | undefined) {
        if(value !== undefined) {
            setMessage(value);
        }
    }, []);

    // Hooks - WebSocket
    const webSocket = useWebSocketViaSharedWorker();

    // Effects - Update time formats on client side only
    React.useEffect(
        function () {
            const clientTimes: Record<string, { connectedTime: string; lastActiveTime: string }> = {};

            // Format client connection times
            webSocket.sharedWorkerServerClientConnections.forEach(function (client) {
                clientTimes[client.id] = {
                    connectedTime: new Date(client.firstConnected).toLocaleString(),
                    lastActiveTime: new Date(client.lastActive).toLocaleString(),
                };
            });

            // Update all formatted times
            setFormattedTimes({
                stateUpdatedAt: new Date(webSocket.webSocketState.createdAt).toLocaleString(),
                connectedSince: webSocket.webSocketState.statistics?.connectedAt
                    ? new Date(webSocket.webSocketState.statistics.connectedAt).toLocaleString()
                    : '',
                lastMessageSent: webSocket.webSocketState.statistics?.lastMessageSentAt
                    ? new Date(webSocket.webSocketState.statistics.lastMessageSentAt).toLocaleString()
                    : '',
                lastMessageReceived: webSocket.webSocketState.statistics?.lastMessageReceivedAt
                    ? new Date(webSocket.webSocketState.statistics.lastMessageReceivedAt).toLocaleString()
                    : '',
                errorTime: webSocket.webSocketState.lastError?.timestamp
                    ? new Date(webSocket.webSocketState.lastError.timestamp).toLocaleString()
                    : '',
                clientConnectedTimes: clientTimes,
            });
        },
        [
            webSocket.webSocketState.createdAt,
            webSocket.webSocketState.statistics?.connectedAt,
            webSocket.webSocketState.statistics?.lastMessageSentAt,
            webSocket.webSocketState.statistics?.lastMessageReceivedAt,
            webSocket.webSocketState.lastError?.timestamp,
            webSocket.sharedWorkerServerClientConnections,
        ],
    );

    // Functions
    function handleConnect() {
        webSocket.connectWebSocket(webSocketUrl);
    }

    function handleDisconnect() {
        webSocket.disconnectWebSocket(1000, 'User initiated disconnect');
    }

    function handleSendMessage() {
        webSocket.sendWebSocketMessage({ text: message });
    }

    // Get connection status color and text
    function getConnectionStatusInfo() {
        switch(webSocket.webSocketState.connectionState) {
            case WebSocketConnectionState.Connected:
                return { color: 'bg-green-500', text: 'Connected' };
            case WebSocketConnectionState.Connecting:
                return { color: 'bg-yellow-500', text: 'Connecting' };
            case WebSocketConnectionState.Reconnecting:
                return { color: 'bg-yellow-500', text: 'Reconnecting' };
            case WebSocketConnectionState.Failed:
                return { color: 'bg-red-500', text: 'Failed' };
            case WebSocketConnectionState.Disconnected:
            default:
                return { color: 'bg-gray-500', text: 'Disconnected' };
        }
    }

    const connectionStatus = getConnectionStatusInfo();

    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6 text-2xl font-bold">WebSocket Testing Dashboard</h1>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <p>SharedWorker Supported?</p>
                <p>{webSocket.isSharedWorkerSupported ? 'Yes' : 'No'}</p>

                <p>SharedWorker Connected?</p>
                <p>{webSocket.isSharedWorkerConnected ? 'Yes' : 'No'}</p>

                <p>Client ID</p>
                <p>{webSocket.sharedWorkerClientIdAssignedFromServer}</p>
            </div>

            <div className="mb-8 rounded-md border p-4">
                <h2 className="mb-4 text-xl font-bold">WebSocket Connection</h2>

                <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <p className="font-bold">WebSocket Status</p>
                    <p>
                        <span className={`mr-2 inline-block h-2 w-2 rounded-full ${connectionStatus.color}`}></span>
                        {connectionStatus.text}
                    </p>

                    {/* Basic connection info */}
                    <p className="font-bold">State Updated At</p>
                    <p>{formattedTimes.stateUpdatedAt}</p>

                    {webSocket.webSocketState.url && (
                        <>
                            <p className="font-bold">Connected URL</p>
                            <p>{webSocket.webSocketState.url}</p>
                        </>
                    )}

                    {webSocket.webSocketState.readyState !== undefined && (
                        <>
                            <p className="font-bold">Socket Ready State</p>
                            <p>
                                {webSocket.webSocketState.readyState} (
                                {webSocket.webSocketState.readyState === 0
                                    ? 'CONNECTING'
                                    : webSocket.webSocketState.readyState === 1
                                      ? 'OPEN'
                                      : webSocket.webSocketState.readyState === 2
                                        ? 'CLOSING'
                                        : webSocket.webSocketState.readyState === 3
                                          ? 'CLOSED'
                                          : 'UNKNOWN'}
                                )
                            </p>
                        </>
                    )}

                    {/* Reconnection details */}
                    {webSocket.webSocketState.reconnectAttempts !== undefined && (
                        <>
                            <p className="font-bold">Reconnection Attempts</p>
                            <p>{webSocket.webSocketState.reconnectAttempts}</p>
                        </>
                    )}

                    {webSocket.webSocketState.reconnecting !== undefined && (
                        <>
                            <p className="font-bold">Reconnecting</p>
                            <p>{webSocket.webSocketState.reconnecting ? 'Yes' : 'No'}</p>
                        </>
                    )}

                    {webSocket.webSocketState.reconnectDelayInMilliseconds !== undefined && (
                        <>
                            <p className="font-bold">Current Reconnect Delay</p>
                            <p>{webSocket.webSocketState.reconnectDelayInMilliseconds}ms</p>
                        </>
                    )}

                    {webSocket.webSocketState.maximumReconnectDelayInMilliseconds !== undefined && (
                        <>
                            <p className="font-bold">Max Reconnect Delay</p>
                            <p>{webSocket.webSocketState.maximumReconnectDelayInMilliseconds}ms</p>
                        </>
                    )}

                    {/* Statistics */}
                    {webSocket.webSocketState.statistics && (
                        <>
                            <p className="col-span-2 mt-4 border-t pt-2 text-lg font-bold">WebSocket Statistics</p>

                            {webSocket.webSocketState.statistics.connectedAt && (
                                <>
                                    <p className="font-bold">Connected Since</p>
                                    <p>{formattedTimes.connectedSince}</p>
                                </>
                            )}

                            {webSocket.webSocketState.statistics.messagesSent !== undefined && (
                                <>
                                    <p className="font-bold">Messages Sent</p>
                                    <p>{webSocket.webSocketState.statistics.messagesSent}</p>
                                </>
                            )}

                            {webSocket.webSocketState.statistics.messagesReceived !== undefined && (
                                <>
                                    <p className="font-bold">Messages Received</p>
                                    <p>{webSocket.webSocketState.statistics.messagesReceived}</p>
                                </>
                            )}

                            {webSocket.webSocketState.statistics.bytesSent !== undefined && (
                                <>
                                    <p className="font-bold">Bytes Sent</p>
                                    <p>{webSocket.webSocketState.statistics.bytesSent} bytes</p>
                                </>
                            )}

                            {webSocket.webSocketState.statistics.bytesReceived !== undefined && (
                                <>
                                    <p className="font-bold">Bytes Received</p>
                                    <p>{webSocket.webSocketState.statistics.bytesReceived} bytes</p>
                                </>
                            )}

                            {webSocket.webSocketState.statistics.lastMessageSentAt !== undefined &&
                                webSocket.webSocketState.statistics.lastMessageSentAt !== null && (
                                    <>
                                        <p className="font-bold">Last Message Sent</p>
                                        <p>{formattedTimes.lastMessageSent}</p>
                                    </>
                                )}

                            {webSocket.webSocketState.statistics.lastMessageReceivedAt !== undefined &&
                                webSocket.webSocketState.statistics.lastMessageReceivedAt !== null && (
                                    <>
                                        <p className="font-bold">Last Message Received</p>
                                        <p>{formattedTimes.lastMessageReceived}</p>
                                    </>
                                )}

                            {webSocket.webSocketState.statistics.averageLatencyInMilliseconds !== undefined &&
                                webSocket.webSocketState.statistics.averageLatencyInMilliseconds !== null && (
                                    <>
                                        <p className="font-bold">Average Latency</p>
                                        <p>
                                            {Math.round(
                                                webSocket.webSocketState.statistics.averageLatencyInMilliseconds,
                                            )}
                                            ms
                                        </p>
                                    </>
                                )}
                        </>
                    )}

                    {/* Error information */}
                    {webSocket.webSocketState.lastError && (
                        <>
                            <p className="col-span-2 mt-4 border-t pt-2 text-lg font-bold text-red-600">Last Error</p>
                            <p className="font-bold">Error Message</p>
                            <p className="text-red-500">{webSocket.webSocketState.lastError.message}</p>

                            {webSocket.webSocketState.lastError.code !== undefined && (
                                <>
                                    <p className="font-bold">Error Code</p>
                                    <p className="text-red-500">{webSocket.webSocketState.lastError.code}</p>
                                </>
                            )}

                            {webSocket.webSocketState.lastError.timestamp !== undefined && (
                                <>
                                    <p className="font-bold">Error Time</p>
                                    <p className="text-red-500">{formattedTimes.errorTime}</p>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="mb-4 flex flex-col">
                    <FormInputText
                        id="websocket-url"
                        label="WebSocket URL"
                        defaultValue={webSocketUrl}
                        onChange={handleWebSocketUrlChange}
                        placeholder="wss://echo.websocket.org"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleConnect}
                        disabled={
                            webSocket.webSocketState.connectionState === WebSocketConnectionState.Connected ||
                            webSocket.webSocketState.connectionState === WebSocketConnectionState.Connecting
                        }
                    >
                        Connect
                    </Button>
                    <Button
                        onClick={handleDisconnect}
                        variant="light"
                        disabled={
                            webSocket.webSocketState.connectionState === WebSocketConnectionState.Disconnected ||
                            webSocket.webSocketState.connectionState === WebSocketConnectionState.Failed
                        }
                    >
                        Disconnect
                    </Button>
                </div>
            </div>

            <div className="mb-8 rounded-md border p-4">
                <h2 className="mb-4 text-xl font-bold">Send Message</h2>

                <div className="mb-4 flex flex-col">
                    <FormInputText
                        id="websocket-message"
                        label="Message"
                        defaultValue={message}
                        onChange={handleMessageChange}
                        placeholder="Enter a message to send"
                    />
                </div>

                <Button
                    onClick={handleSendMessage}
                    disabled={webSocket.webSocketState.connectionState !== WebSocketConnectionState.Connected}
                >
                    Send Message
                </Button>
            </div>

            <div className="mb-6">
                <div className="mb-4 flex items-center gap-4">
                    <h2 className="text-xl font-bold">Connected Clients</h2>
                    <Button onClick={webSocket.requestSharedWorkerServerClientConnections}>Refresh</Button>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="p-3 text-left">Client ID</th>
                                <th className="p-3 text-left">Connected Since</th>
                                <th className="p-3 text-left">Last Active</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {webSocket.sharedWorkerServerClientConnections.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center">
                                        No clients connected
                                    </td>
                                </tr>
                            ) : (
                                webSocket.sharedWorkerServerClientConnections.map(function (client) {
                                    const clientTimes = formattedTimes.clientConnectedTimes[client.id] || {
                                        connectedTime: '',
                                        lastActiveTime: '',
                                    };
                                    const isCurrentClient =
                                        client.id === webSocket.sharedWorkerClientIdAssignedFromServer;

                                    return (
                                        <tr
                                            key={client.id}
                                            className={isCurrentClient ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                        >
                                            <td className="p-3">
                                                {client.id}{' '}
                                                {isCurrentClient && (
                                                    <span className="text-blue-600 dark:text-blue-400">(You)</span>
                                                )}
                                            </td>
                                            <td className="p-3">{clientTimes.connectedTime}</td>
                                            <td className="p-3">{clientTimes.lastActiveTime}</td>
                                            <td className="p-3">
                                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                                Active
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default WebSocketsPage;
