'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import OpsNavigationTrail from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Dependencies - Provider
import { useWebSocketViaSharedWorker } from '@structure/source/api/web-sockets/providers/WebSocketViaSharedWorkerProvider';
import { WebSocketConnectionState } from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

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
                    connectedTime: client.firstConnectedAt.toLocaleString(),
                    lastActiveTime: client.lastActiveAt.toLocaleString(),
                };
            });

            // Update all formatted times
            setFormattedTimes({
                stateUpdatedAt: new Date(webSocket.webSocketConnectionInformation.createdAt).toLocaleString(),
                connectedSince: webSocket.webSocketConnectionInformation.statistics?.connectedAt
                    ? new Date(webSocket.webSocketConnectionInformation.statistics.connectedAt).toLocaleString()
                    : '',
                lastMessageSent: webSocket.webSocketConnectionInformation.statistics?.lastMessageSentAt
                    ? new Date(webSocket.webSocketConnectionInformation.statistics.lastMessageSentAt).toLocaleString()
                    : '',
                lastMessageReceived: webSocket.webSocketConnectionInformation.statistics?.lastMessageReceivedAt
                    ? new Date(
                          webSocket.webSocketConnectionInformation.statistics.lastMessageReceivedAt,
                      ).toLocaleString()
                    : '',
                clientConnectedTimes: clientTimes,
            });
        },
        [
            webSocket.webSocketConnectionInformation.createdAt,
            webSocket.webSocketConnectionInformation.statistics?.connectedAt,
            webSocket.webSocketConnectionInformation.statistics?.lastMessageSentAt,
            webSocket.webSocketConnectionInformation.statistics?.lastMessageReceivedAt,
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
        switch(webSocket.webSocketConnectionInformation.state) {
            case WebSocketConnectionState.Connected:
                return { color: 'bg-green-500', text: 'Connected' };
            case WebSocketConnectionState.Connecting:
                return { color: 'bg-yellow-500', text: 'Connecting' };
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
            <OpsNavigationTrail />

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

                    {webSocket.webSocketConnectionInformation.url && (
                        <>
                            <p className="font-bold">Connected URL</p>
                            <p>{webSocket.webSocketConnectionInformation.url}</p>
                        </>
                    )}

                    {webSocket.webSocketConnectionInformation.readyState !== undefined && (
                        <>
                            <p className="font-bold">Socket Ready State</p>
                            <p>
                                {webSocket.webSocketConnectionInformation.readyState} (
                                {webSocket.webSocketConnectionInformation.readyState === 0
                                    ? 'CONNECTING'
                                    : webSocket.webSocketConnectionInformation.readyState === 1
                                      ? 'OPEN'
                                      : webSocket.webSocketConnectionInformation.readyState === 2
                                        ? 'CLOSING'
                                        : webSocket.webSocketConnectionInformation.readyState === 3
                                          ? 'CLOSED'
                                          : 'UNKNOWN'}
                                )
                            </p>
                        </>
                    )}

                    {/* Reconnection details */}
                    {webSocket.webSocketConnectionInformation.reconnectAttempts !== undefined && (
                        <>
                            <p className="font-bold">Reconnection Attempts</p>
                            <p>{webSocket.webSocketConnectionInformation.reconnectAttempts}</p>
                        </>
                    )}

                    {webSocket.webSocketConnectionInformation.nextReconnectAt !== undefined && (
                        <>
                            <p className="font-bold">Next Reconnect At</p>
                            <p>{webSocket.webSocketConnectionInformation.nextReconnectAt?.toLocaleString()}</p>
                        </>
                    )}

                    {webSocket.webSocketConnectionInformation.maximumReconnectDelayInMilliseconds !== undefined && (
                        <>
                            <p className="font-bold">Max Reconnect Delay</p>
                            <p>{webSocket.webSocketConnectionInformation.maximumReconnectDelayInMilliseconds}ms</p>
                        </>
                    )}

                    {/* Statistics */}
                    {webSocket.webSocketConnectionInformation.statistics && (
                        <>
                            <p className="col-span-2 mt-4 border-t pt-2 text-lg font-bold">WebSocket Statistics</p>

                            {webSocket.webSocketConnectionInformation.statistics.connectedAt && (
                                <>
                                    <p className="font-bold">Connected Since</p>
                                    <p>{formattedTimes.connectedSince}</p>
                                </>
                            )}

                            {webSocket.webSocketConnectionInformation.statistics.messagesSent !== undefined && (
                                <>
                                    <p className="font-bold">Messages Sent</p>
                                    <p>{webSocket.webSocketConnectionInformation.statistics.messagesSent}</p>
                                </>
                            )}

                            {webSocket.webSocketConnectionInformation.statistics.messagesReceived !== undefined && (
                                <>
                                    <p className="font-bold">Messages Received</p>
                                    <p>{webSocket.webSocketConnectionInformation.statistics.messagesReceived}</p>
                                </>
                            )}

                            {webSocket.webSocketConnectionInformation.statistics.bytesSent !== undefined && (
                                <>
                                    <p className="font-bold">Bytes Sent</p>
                                    <p>{webSocket.webSocketConnectionInformation.statistics.bytesSent} bytes</p>
                                </>
                            )}

                            {webSocket.webSocketConnectionInformation.statistics.bytesReceived !== undefined && (
                                <>
                                    <p className="font-bold">Bytes Received</p>
                                    <p>{webSocket.webSocketConnectionInformation.statistics.bytesReceived} bytes</p>
                                </>
                            )}

                            {webSocket.webSocketConnectionInformation.statistics.lastMessageSentAt !== undefined &&
                                webSocket.webSocketConnectionInformation.statistics.lastMessageSentAt !== null && (
                                    <>
                                        <p className="font-bold">Last Message Sent</p>
                                        <p>{formattedTimes.lastMessageSent}</p>
                                    </>
                                )}

                            {webSocket.webSocketConnectionInformation.statistics.lastMessageReceivedAt !== undefined &&
                                webSocket.webSocketConnectionInformation.statistics.lastMessageReceivedAt !== null && (
                                    <>
                                        <p className="font-bold">Last Message Received</p>
                                        <p>{formattedTimes.lastMessageReceived}</p>
                                    </>
                                )}

                            {webSocket.webSocketConnectionInformation.statistics.averageLatencyInMilliseconds !==
                                undefined &&
                                webSocket.webSocketConnectionInformation.statistics.averageLatencyInMilliseconds !==
                                    null && (
                                    <>
                                        <p className="font-bold">Average Latency</p>
                                        <p>
                                            {Math.round(
                                                webSocket.webSocketConnectionInformation.statistics
                                                    .averageLatencyInMilliseconds,
                                            )}
                                            ms
                                        </p>
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
                            webSocket.webSocketConnectionInformation.state === WebSocketConnectionState.Connected ||
                            webSocket.webSocketConnectionInformation.state === WebSocketConnectionState.Connecting
                        }
                    >
                        Connect
                    </Button>
                    <Button
                        onClick={handleDisconnect}
                        variant="light"
                        disabled={
                            webSocket.webSocketConnectionInformation.state === WebSocketConnectionState.Disconnected ||
                            webSocket.webSocketConnectionInformation.state === WebSocketConnectionState.Failed
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
                    disabled={webSocket.webSocketConnectionInformation.state !== WebSocketConnectionState.Connected}
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
