'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';

// Dependencies - Provider
import { useWebSocketViaSharedWorker } from '@structure/source/api/web-sockets/providers/WebSocketViaSharedWorkerProvider';
import { WebSocketConnectionState } from '@structure/source/api/web-sockets/shared-worker/types/WebSocketSharedWorkerTypes';

// Components
import { Button } from '@structure/source/common/buttons/Button';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Component - WebSocketsPage
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
    const webSocketViaSharedWorker = useWebSocketViaSharedWorker();

    // Effects - Update time formats on client side only
    React.useEffect(
        function () {
            const clientTimes: Record<string, { connectedTime: string; lastActiveTime: string }> = {};

            // Format client connection times
            webSocketViaSharedWorker.sharedWorkerServerClientConnections.forEach(function (client) {
                clientTimes[client.id] = {
                    connectedTime: client.firstConnectedAt.toLocaleString(),
                    lastActiveTime: client.lastActiveAt.toLocaleString(),
                };
            });

            // Update all formatted times
            setFormattedTimes({
                stateUpdatedAt: new Date(
                    webSocketViaSharedWorker.webSocketConnectionInformation.createdAt,
                ).toLocaleString(),
                connectedSince: webSocketViaSharedWorker.webSocketConnectionInformation.statistics?.connectedAt
                    ? new Date(
                          webSocketViaSharedWorker.webSocketConnectionInformation.statistics.connectedAt,
                      ).toLocaleString()
                    : '',
                lastMessageSent: webSocketViaSharedWorker.webSocketConnectionInformation.statistics?.lastMessageSentAt
                    ? new Date(
                          webSocketViaSharedWorker.webSocketConnectionInformation.statistics.lastMessageSentAt,
                      ).toLocaleString()
                    : '',
                lastMessageReceived: webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                    ?.lastMessageReceivedAt
                    ? new Date(
                          webSocketViaSharedWorker.webSocketConnectionInformation.statistics.lastMessageReceivedAt,
                      ).toLocaleString()
                    : '',
                clientConnectedTimes: clientTimes,
            });
        },
        [
            webSocketViaSharedWorker.webSocketConnectionInformation.createdAt,
            webSocketViaSharedWorker.webSocketConnectionInformation.statistics?.connectedAt,
            webSocketViaSharedWorker.webSocketConnectionInformation.statistics?.lastMessageSentAt,
            webSocketViaSharedWorker.webSocketConnectionInformation.statistics?.lastMessageReceivedAt,
            webSocketViaSharedWorker.sharedWorkerServerClientConnections,
        ],
    );

    // Functions
    function handleConnect() {
        webSocketViaSharedWorker.connectWebSocket(webSocketUrl);
    }

    function handleDisconnect() {
        webSocketViaSharedWorker.disconnectWebSocket(1000, 'User initiated disconnect');
    }

    function handleSendMessage() {
        webSocketViaSharedWorker.sendWebSocketMessage({ text: message });
    }

    // Get connection status color and text
    function getConnectionStatusInfo() {
        switch(webSocketViaSharedWorker.webSocketConnectionInformation.state) {
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
                <p>{webSocketViaSharedWorker.isSharedWorkerSupported ? 'Yes' : 'No'}</p>

                <p>SharedWorker Connected?</p>
                <p>{webSocketViaSharedWorker.isSharedWorkerConnected ? 'Yes' : 'No'}</p>

                <p>Client ID</p>
                <p>{webSocketViaSharedWorker.sharedWorkerClientIdAssignedFromServer}</p>
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

                    {webSocketViaSharedWorker.webSocketConnectionInformation.url && (
                        <>
                            <p className="font-bold">Connected URL</p>
                            <p>{webSocketViaSharedWorker.webSocketConnectionInformation.url}</p>
                        </>
                    )}

                    {webSocketViaSharedWorker.webSocketConnectionInformation.readyState !== undefined && (
                        <>
                            <p className="font-bold">Socket Ready State</p>
                            <p>
                                {webSocketViaSharedWorker.webSocketConnectionInformation.readyState} (
                                {webSocketViaSharedWorker.webSocketConnectionInformation.readyState === 0
                                    ? 'CONNECTING'
                                    : webSocketViaSharedWorker.webSocketConnectionInformation.readyState === 1
                                      ? 'OPEN'
                                      : webSocketViaSharedWorker.webSocketConnectionInformation.readyState === 2
                                        ? 'CLOSING'
                                        : webSocketViaSharedWorker.webSocketConnectionInformation.readyState === 3
                                          ? 'CLOSED'
                                          : 'UNKNOWN'}
                                )
                            </p>
                        </>
                    )}

                    {/* Reconnection details */}
                    {webSocketViaSharedWorker.webSocketConnectionInformation.reconnectAttempts !== undefined && (
                        <>
                            <p className="font-bold">Reconnection Attempts</p>
                            <p>{webSocketViaSharedWorker.webSocketConnectionInformation.reconnectAttempts}</p>
                        </>
                    )}

                    {webSocketViaSharedWorker.webSocketConnectionInformation.nextReconnectAt !== undefined && (
                        <>
                            <p className="font-bold">Next Reconnect At</p>
                            <p>
                                {webSocketViaSharedWorker.webSocketConnectionInformation.nextReconnectAt?.toLocaleString()}
                            </p>
                        </>
                    )}

                    {webSocketViaSharedWorker.webSocketConnectionInformation.maximumReconnectDelayInMilliseconds !==
                        undefined && (
                        <>
                            <p className="font-bold">Max Reconnect Delay</p>
                            <p>
                                {
                                    webSocketViaSharedWorker.webSocketConnectionInformation
                                        .maximumReconnectDelayInMilliseconds
                                }
                                ms
                            </p>
                        </>
                    )}

                    {/* Statistics */}
                    {webSocketViaSharedWorker.webSocketConnectionInformation.statistics && (
                        <>
                            <p className="col-span-2 mt-4 border-t pt-2 text-lg font-bold">WebSocket Statistics</p>

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.connectedAt && (
                                <>
                                    <p className="font-bold">Connected Since</p>
                                    <p>{formattedTimes.connectedSince}</p>
                                </>
                            )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.messagesSent !==
                                undefined && (
                                <>
                                    <p className="font-bold">Messages Sent</p>
                                    <p>
                                        {
                                            webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                                .messagesSent
                                        }
                                    </p>
                                </>
                            )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.messagesReceived !==
                                undefined && (
                                <>
                                    <p className="font-bold">Messages Received</p>
                                    <p>
                                        {
                                            webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                                .messagesReceived
                                        }
                                    </p>
                                </>
                            )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.bytesSent !==
                                undefined && (
                                <>
                                    <p className="font-bold">Bytes Sent</p>
                                    <p>
                                        {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.bytesSent}{' '}
                                        bytes
                                    </p>
                                </>
                            )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.bytesReceived !==
                                undefined && (
                                <>
                                    <p className="font-bold">Bytes Received</p>
                                    <p>
                                        {
                                            webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                                .bytesReceived
                                        }{' '}
                                        bytes
                                    </p>
                                </>
                            )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics.lastMessageSentAt !==
                                undefined &&
                                webSocketViaSharedWorker.webSocketConnectionInformation.statistics.lastMessageSentAt !==
                                    null && (
                                    <>
                                        <p className="font-bold">Last Message Sent</p>
                                        <p>{formattedTimes.lastMessageSent}</p>
                                    </>
                                )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                .lastMessageReceivedAt !== undefined &&
                                webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                    .lastMessageReceivedAt !== null && (
                                    <>
                                        <p className="font-bold">Last Message Received</p>
                                        <p>{formattedTimes.lastMessageReceived}</p>
                                    </>
                                )}

                            {webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                .averageLatencyInMilliseconds !== undefined &&
                                webSocketViaSharedWorker.webSocketConnectionInformation.statistics
                                    .averageLatencyInMilliseconds !== null && (
                                    <>
                                        <p className="font-bold">Average Latency</p>
                                        <p>
                                            {Math.round(
                                                webSocketViaSharedWorker.webSocketConnectionInformation.statistics
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
                            webSocketViaSharedWorker.webSocketConnectionInformation.state ===
                                WebSocketConnectionState.Connected ||
                            webSocketViaSharedWorker.webSocketConnectionInformation.state ===
                                WebSocketConnectionState.Connecting
                        }
                    >
                        Connect
                    </Button>
                    <Button
                        onClick={handleDisconnect}
                        variant="light"
                        disabled={
                            webSocketViaSharedWorker.webSocketConnectionInformation.state ===
                                WebSocketConnectionState.Disconnected ||
                            webSocketViaSharedWorker.webSocketConnectionInformation.state ===
                                WebSocketConnectionState.Failed
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
                    disabled={
                        webSocketViaSharedWorker.webSocketConnectionInformation.state !==
                        WebSocketConnectionState.Connected
                    }
                >
                    Send Message
                </Button>
            </div>

            <div className="mb-6">
                <div className="mb-4 flex items-center gap-4">
                    <h2 className="text-xl font-bold">Connected Clients</h2>
                    <Button onClick={webSocketViaSharedWorker.requestSharedWorkerServerClientConnections}>
                        Refresh
                    </Button>
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
                            {webSocketViaSharedWorker.sharedWorkerServerClientConnections.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center">
                                        No clients connected
                                    </td>
                                </tr>
                            ) : (
                                webSocketViaSharedWorker.sharedWorkerServerClientConnections.map(function (client) {
                                    const clientTimes = formattedTimes.clientConnectedTimes[client.id] || {
                                        connectedTime: '',
                                        lastActiveTime: '',
                                    };
                                    const isCurrentClient =
                                        client.id === webSocketViaSharedWorker.sharedWorkerClientIdAssignedFromServer;

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
