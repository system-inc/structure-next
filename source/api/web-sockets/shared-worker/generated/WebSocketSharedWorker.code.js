// WebSocketSharedWorker Build Time: 2025-04-18T06:08:29.588Z

'use strict';
(() => {
    var W = Object.defineProperty;
    var A = (s, e, t) => (e in s ? W(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (s[e] = t));
    var c = (s, e) => W(s, 'name', { value: e, configurable: !0 });
    var o = (s, e, t) => (A(s, typeof e != 'symbol' ? e + '' : e, t), t);
    var r = ((t) => ((t.Pong = 'Pong'), (t.RequestClientConnections = 'RequestClientConnections'), t))(r || {});
    function S(s) {
        return {
            type: 'WebSocketConnectionInformation',
            url: s.url || '',
            state: s.state,
            readyState: s.readyState !== void 0 ? s.readyState : null,
            reconnectAttempts: s.reconnectAttempts || 0,
            nextReconnectAt: s.nextReconnectAt,
            maximumReconnectDelayInMilliseconds: s.maximumReconnectDelayInMilliseconds || 3e4,
            statistics: s.statistics,
            createdAt: Date.now(),
        };
    }
    c(S, 'createWebSocketConnectionInformationMessage');
    function p(s) {
        return { type: 'WebSocketMessage', data: s };
    }
    c(p, 'createWebSocketDataMessage');
    function u(s) {
        return { type: 'WebSocketError', message: s, createdAt: Date.now() };
    }
    c(u, 'createWebSocketErrorMessage');
    var k = class k {
        constructor(e, t) {
            o(this, 'id');
            o(this, 'messagePort');
            o(this, 'heartbeatInterval', null);
            o(this, 'lastActiveAt');
            o(this, 'firstConnectedAt');
            (this.id = e),
                (this.messagePort = t),
                (this.firstConnectedAt = new Date()),
                (this.lastActiveAt = new Date());
        }
        sendMessage(e, t) {
            try {
                return this.messagePort.postMessage(e), !0;
            }
            catch(n) {
                return console.log('[SharedWorkerClientConnection] Failed to send message:', n), t(this), !1;
            }
        }
        updateLastActive() {
            return (this.lastActiveAt = new Date()), this.lastActiveAt;
        }
        handleDisconnect() {
            this.heartbeatInterval && (clearInterval(this.heartbeatInterval), (this.heartbeatInterval = null));
        }
    };
    c(k, 'SharedWorkerClientConnection');
    var l = k;
    var C = class C {
        constructor() {
            o(this, 'clientConnections');
            (this.clientConnections = new Map()),
                typeof self != 'undefined' && (self.onconnect = this.onClientConnect.bind(this));
        }
        onClientConnect(e) {
            console.log('onClientConnect', e);
            let t = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                n = e.ports[0];
            this.addClientConnection(t, n);
        }
        addClientConnection(e, t) {
            let n = new l(e, t);
            return (
                this.clientConnections.set(e, n),
                (t.onmessage = this.onClientConnectionMessage.bind(this, n)),
                this.setupClientConnectionHeartbeat(n),
                this.sendMessage(n, { type: 'ClientIdAssigned', clientId: e }),
                this.broadcastClientConnections(),
                console.log('Total clients connected:', this.clientConnections.size),
                n
            );
        }
        handleClientDisconnection(e) {
            console.log('handleClientDisconnection:', e),
                this.clientConnections.has(e.id) &&
                    (e.handleDisconnect(), this.clientConnections.delete(e.id), this.broadcastClientConnections()),
                console.log('Total clients connected:', this.clientConnections.size);
        }
        setupClientConnectionHeartbeat(e) {
            e.heartbeatInterval = setInterval(() => {
                try {
                    let t = this.clientConnections.get(e.id);
                    if(!t) {
                        console.log('Client no longer exists:', e.id);
                        return;
                    }
                    if(!t.sendMessage({ type: 'Ping' }, this.handleClientDisconnection.bind(this))) return;
                    Date.now() - t.lastActiveAt.getTime() > 1e4 &&
                        (console.log('Client timed out:', t.id), this.handleClientDisconnection(t));
                }
                catch(t) {
                    console.log('Heartbeat error, client disconnected:', e.id, t), this.handleClientDisconnection(e);
                }
            }, 3e3);
        }
        sendMessage(e, t) {
            return e.sendMessage(t, this.handleClientDisconnection.bind(this));
        }
        broadcastMessage(e) {
            this.clientConnections.forEach((t) => {
                this.sendMessage(t, e);
            });
        }
        onClientConnectionMessage(e, t) {
            switch(
                (t.data &&
                    (!t.data.type || t.data.type !== 'Pong') &&
                    console.log('[SharedWorkerServer] Received message from client:', t.data),
                t.data.type)
            ) {
                case 'Pong':
                    e.updateLastActive();
                    break;
                case 'RequestClientConnections':
                    this.sendMessage(e, this.createClientConnectionsMessage());
                    break;
            }
        }
        createClientConnectionsMessage() {
            let e = Array.from(this.clientConnections.values()).map((t) => ({
                id: t.id,
                firstConnectedAt: t.firstConnectedAt,
                lastActiveAt: t.lastActiveAt,
            }));
            return { type: 'ClientConnections', clientConnections: e };
        }
        broadcastClientConnections() {
            let e = this.createClientConnectionsMessage();
            this.broadcastMessage(e);
        }
    };
    c(C, 'SharedWorkerServer');
    var d = C;
    var b = class b {
        constructor(e, t) {
            o(this, 'socket', null);
            o(this, 'protocols', null);
            o(this, 'url', null);
            o(this, 'state', 'Disconnected');
            o(this, 'connectionTimeout', null);
            o(this, 'reconnectAttempts', 0);
            o(this, 'reconnectTimeout', null);
            o(this, 'nextReconnectAt', null);
            o(this, 'maximumReconnectDelayInMilliseconds', 3e4);
            o(this, 'isReconnecting', !1);
            o(this, 'pingInterval', null);
            o(this, 'intentionallyDisconnected', !1);
            o(this, 'statistics');
            o(this, 'lastError', null);
            o(this, 'createdAt', Date.now());
            o(this, 'onMessage');
            o(this, 'onStateChange');
            o(this, 'boundHandleInternetAvailable', null);
            o(this, 'boundHandleInternetUnavailable', null);
            (this.statistics = {
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
            }),
                (this.onMessage = e),
                (this.onStateChange = t);
        }
        connect(e, t) {
            (this.url = e),
                (this.protocols = t || null),
                (this.intentionallyDisconnected = !1),
                (this.isReconnecting = !1),
                this.connectionTimeout && (clearTimeout(this.connectionTimeout), (this.connectionTimeout = null)),
                this.updateState('Connecting'),
                this.socket && this.socket.close();
            try {
                return (
                    (this.socket = t ? new WebSocket(e, t) : new WebSocket(e)),
                    (this.socket.onopen = this.handleOpen.bind(this)),
                    (this.socket.onmessage = this.handleMessage.bind(this)),
                    (this.socket.onerror = this.handleError.bind(this)),
                    (this.socket.onclose = this.handleClose.bind(this)),
                    (this.connectionTimeout = setTimeout(() => {
                        if(
                            (console.error(`[WebSocketConnection] Connection attempt timed out after ${15e3}ms`),
                            (this.connectionTimeout = null),
                            (this.lastError = {
                                message: 'WebSocket connection attempt timed out',
                                code: 5002,
                                data: { url: this.url },
                                createdAt: new Date(),
                            }),
                            this.socket && this.socket.readyState === WebSocket.CONNECTING)
                        ) {
                            console.log(
                                '[WebSocketConnection] Closing socket that is still in CONNECTING state due to timeout',
                            ),
                                (this.socket.onopen = null),
                                (this.socket.onmessage = null),
                                (this.socket.onerror = null),
                                (this.socket.onclose = null);
                            try {
                                this.socket.close();
                            }
                            catch(n) {
                                console.error('[WebSocketConnection] Error closing timed out WebSocket:', n);
                            }
                            this.socket = null;
                        }
                        else if(this.socket && this.socket.readyState === WebSocket.OPEN) {
                            console.log(
                                '[WebSocketConnection] Socket connected successfully despite timeout - keeping connection',
                            ),
                                (this.lastError = null);
                            return;
                        }
                        this.updateState('Failed'), this.reconnect();
                    }, 15e3)),
                    console.log('[WebSocketConnection] Connecting to', e),
                    !0
                );
            }
            catch(n) {
                return (
                    console.error('[WebSocketConnection] Failed to create WebSocket:', n),
                    (this.lastError = {
                        message: 'Failed to create WebSocket connection',
                        code: 5003,
                        data: n,
                        createdAt: new Date(),
                    }),
                    this.connectionTimeout && (clearTimeout(this.connectionTimeout), (this.connectionTimeout = null)),
                    this.updateState('Failed'),
                    this.reconnect(),
                    !1
                );
            }
        }
        disconnect(e, t) {
            if(
                (console.log('[WebSocketConnection] Disconnecting', e, t),
                (this.intentionallyDisconnected = !0),
                (this.isReconnecting = !1),
                this.reconnectTimeout && (clearTimeout(this.reconnectTimeout), (this.reconnectTimeout = null)),
                (this.nextReconnectAt = null),
                this.stopPingInterval(),
                this.connectionTimeout && (clearTimeout(this.connectionTimeout), (this.connectionTimeout = null)),
                this.socket)
            ) {
                try {
                    this.socket.close(e, t);
                }
                catch(n) {
                    console.error('[WebSocketConnection] Error closing WebSocket:', n);
                }
                (this.socket.onopen = null),
                    (this.socket.onmessage = null),
                    (this.socket.onerror = null),
                    (this.socket.onclose = null),
                    (this.socket = null);
            }
            return this.updateState('Disconnected'), !0;
        }
        send(e) {
            var t, n, i, m;
            if(!this.socket || this.socket.readyState !== WebSocket.OPEN)
                return (
                    console.error('[WebSocketConnection] Cannot send message: WebSocket not connected'),
                    (this.lastError = {
                        message: 'Cannot send message: WebSocket not connected',
                        code: 5003,
                        data: {
                            readyState: (t = this.socket) == null ? void 0 : t.readyState,
                            attempted_message_type: typeof e,
                            timestamp: new Date().toISOString(),
                        },
                        createdAt: new Date(),
                    }),
                    !1
                );
            try {
                let a = typeof e == 'string' ? e : JSON.stringify(e);
                return (
                    this.socket.send(a),
                    this.statistics.messagesSent++,
                    (this.statistics.bytesSent += a.length),
                    (this.statistics.lastMessageSentAt = Date.now()),
                    ((n = this.lastError) == null ? void 0 : n.code) === 5003 &&
                        (m = (i = this.lastError) == null ? void 0 : i.message) != null &&
                        m.includes('sending WebSocket message') &&
                        (this.lastError = null),
                    this.updateState(this.state),
                    !0
                );
            }
            catch(a) {
                return (
                    console.error('[WebSocketConnection] Error sending message:', a),
                    (this.lastError = {
                        message: 'Error sending WebSocket message',
                        code: 5003,
                        data: {
                            error: a instanceof Error ? { name: a.name, message: a.message, stack: a.stack } : a,
                            dataType: typeof e,
                            timestamp: new Date().toISOString(),
                        },
                        createdAt: new Date(),
                    }),
                    this.updateState(this.state),
                    !1
                );
            }
        }
        handleOpen() {
            console.log('[WebSocketConnection] Connected to', this.url),
                this.connectionTimeout && (clearTimeout(this.connectionTimeout), (this.connectionTimeout = null)),
                (this.reconnectAttempts = 0),
                (this.nextReconnectAt = null),
                (this.statistics.connectedAt = Date.now()),
                this.startPingInterval(),
                this.updateState('Connected');
        }
        handleMessage(e) {
            this.statistics.messagesReceived++,
                (this.statistics.lastMessageReceivedAt = Date.now()),
                e.data && typeof e.data == 'string'
                    ? (this.statistics.bytesReceived += e.data.length)
                    : e.data instanceof Blob && (this.statistics.bytesReceived += e.data.size);
            let t;
            try {
                if(typeof e.data == 'string') {
                    let n = e.data.trim();
                    if(n.startsWith('{') || n.startsWith('[')) {
                        if(
                            ((t = JSON.parse(n)),
                            t &&
                                typeof t == 'object' &&
                                'type' in t &&
                                t.type === 'Pong' &&
                                ((this.statistics.lastPongReceivedAt = Date.now()), this.statistics.lastPingSentAt))
                        ) {
                            let i = this.statistics.lastPongReceivedAt - this.statistics.lastPingSentAt;
                            this.statistics.averageLatencyInMilliseconds === null
                                ? (this.statistics.averageLatencyInMilliseconds = i)
                                : (this.statistics.averageLatencyInMilliseconds =
                                      this.statistics.averageLatencyInMilliseconds * 0.7 + i * 0.3);
                        }
                    }
                    else t = { type: 'Raw', content: e.data, createdAt: Date.now() };
                }
            }
            catch(n) {
                console.error('[WebSocketConnection] Error parsing message:', n),
                    (t = {
                        type: 'Unparseable',
                        content: e.data,
                        error: n instanceof Error ? n.message : 'Unknown error',
                        createdAt: Date.now(),
                    });
            }
            this.onMessage && this.onMessage(t), this.updateState(this.state);
        }
        handleError(e) {
            var t;
            console.error('[WebSocketConnection] Error:', e),
                (this.lastError = {
                    message: 'WebSocket error event received',
                    code: 5003,
                    data: { readyState: (t = this.socket) == null ? void 0 : t.readyState, event: e },
                    createdAt: new Date(),
                }),
                this.updateState('Failed'),
                this.intentionallyDisconnected ||
                    (console.log('[WebSocketConnection] Attempting reconnection after error'), this.reconnect());
        }
        handleClose(e) {
            console.log('[WebSocketConnection] Disconnected:', e.code, e.reason),
                (this.statistics.connectedAt = null),
                this.stopPingInterval(),
                e.wasClean
                    ? (this.lastError = null)
                    : (console.error('[WebSocketConnection] WebSocket closed unexpectedly:', e.code, e.reason),
                      (this.lastError = {
                          message: 'WebSocket closed unexpectedly',
                          code: e.code >= 1e3 && e.code < 5e3 ? e.code : 5004,
                          data: {
                              standardCode: e.code,
                              reason: e.reason || 'No reason provided',
                              wasClean: e.wasClean,
                          },
                          createdAt: new Date(),
                      })),
                this.updateState('Disconnected'),
                !e.wasClean && !this.intentionallyDisconnected
                    ? (console.log('[WebSocketConnection] Attempting reconnection after unexpected closure'),
                      this.reconnect())
                    : this.intentionallyDisconnected &&
                      console.log('[WebSocketConnection] Not reconnecting, disconnection was intentional');
        }
        reconnect() {
            if(this.reconnectTimeout || this.isReconnecting) {
                console.log('[WebSocketConnection] Reconnect already in progress, skipping duplicate attempt');
                return;
            }
            if(((this.isReconnecting = !0), this.intentionallyDisconnected)) {
                console.log('[WebSocketConnection] Skipping reconnect attempt, disconnection was intentional'),
                    (this.isReconnecting = !1);
                return;
            }
            this.reconnectAttempts++;
            let e = Math.min(1e3 * Math.pow(1.5, this.reconnectAttempts - 1), 3e4),
                t = 0.8 + Math.random() * 0.4,
                n = Math.floor(e * t);
            console.log(`[WebSocketConnection] Reconnecting in ${n}ms (attempt ${this.reconnectAttempts})`),
                (this.nextReconnectAt = new Date(Date.now() + n)),
                (this.reconnectTimeout = setTimeout(() => {
                    (this.reconnectTimeout = null),
                        (this.nextReconnectAt = null),
                        this.url && this.connect(this.url, this.protocols || void 0),
                        (this.isReconnecting = !1);
                }, n));
        }
        getWebSocketConnectionInformation() {
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
        startPingInterval() {
            this.stopPingInterval(),
                (this.pingInterval = setInterval(() => {
                    this.socket && this.socket.readyState === WebSocket.OPEN && this.sendPing();
                }, 6e4)),
                console.log(`[WebSocketConnection] Started ping interval (every ${6e4 / 1e3}s)`);
        }
        stopPingInterval() {
            this.pingInterval &&
                (clearInterval(this.pingInterval),
                (this.pingInterval = null),
                console.log('[WebSocketConnection] Stopped ping interval'));
        }
        sendPing() {
            if(!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
            this.statistics.lastPingSentAt = Date.now();
            let e = { type: 'Ping', createdAt: Date.now() };
            try {
                this.send(e), console.log('[WebSocketConnection] Sent ping');
            }
            catch(t) {
                console.error('[WebSocketConnection] Error sending ping:', t);
            }
        }
        updateState(e) {
            (this.state = e), this.onStateChange && this.onStateChange(this.getWebSocketConnectionInformation());
        }
    };
    c(b, 'WebSocketConnection');
    var g = b;
    var f = class f extends d {
        constructor() {
            super();
            o(this, 'webSocketConnection');
            o(this, 'handledFirstConnectWebSocketRequest', !1);
            this.webSocketConnection = new g(
                this.handleWebSocketConnectionMessage.bind(this),
                this.handleWebSocketConnectionStateChange.bind(this),
            );
        }
        addClientConnection(t, n) {
            let i = super.addClientConnection(t, n);
            return (
                (this.clientConnections.size > 1 || this.webSocketConnection.state !== 'Disconnected') &&
                    this.sendMessage(i, S(this.webSocketConnection)),
                i
            );
        }
        onClientConnectionMessage(t, n) {
            if(n.data && n.data.type && Object.values(r).includes(n.data.type)) super.onClientConnectionMessage(t, n);
            else {
                let i = n.data;
                switch(i.type) {
                    case 'ConnectWebSocket':
                        this.handleConnectWebSocketRequest(t, i);
                        break;
                    case 'SendWebSocketMessage':
                        this.handleSendWebSocketMessageRequest(t, i);
                        break;
                    case 'DisconnectWebSocket':
                        console.log(
                            '[WebSocketSharedWorkerServer] Disconnect WebSocket request received but not yet implemented',
                        );
                        break;
                    default: {
                        console.log('[WebSocketSharedWorkerServer] Unhandled message type:', i);
                        break;
                    }
                }
            }
        }
        handleConnectWebSocketRequest(t, n) {
            if(
                (console.log('[WebSocketSharedWorkerServer] Connect WebSocket request:', n),
                !this.handledFirstConnectWebSocketRequest)
            ) {
                if(!n.url) {
                    console.error('[WebSocketSharedWorkerServer] Missing WebSocket URL'),
                        this.broadcastWebSocketErrorMessage('Missing WebSocket URL');
                    return;
                }
                (this.handledFirstConnectWebSocketRequest = !0),
                    this.webSocketConnection.connect(n.url, n.protocols) ||
                        this.broadcastWebSocketErrorMessage('Failed to connect to URL: ' + n.url);
            }
        }
        handleSendWebSocketMessageRequest(t, n) {
            if(
                (console.log('[WebSocketSharedWorkerServer] Send WebSocket message request from', t.id, n),
                n.data === void 0)
            ) {
                console.error('[WebSocketSharedWorkerServer] Missing WebSocket message data'),
                    this.sendWebSocketErrorMessage(t, 'Missing WebSocket message data');
                return;
            }
            this.webSocketConnection.send(n.data) ||
                this.sendWebSocketErrorMessage(t, 'Failed to send message, WebSocket not connected');
        }
        handleWebSocketConnectionMessage(t) {
            console.log('[WebSocketSharedWorkerServer] Received WebSocket message:', t), this.broadcastMessage(p(t));
        }
        handleWebSocketConnectionStateChange(t) {
            console.log('[WebSocketSharedWorkerServer] WebSocket state changed:', t), this.broadcastMessage(S(t));
        }
        sendWebSocketErrorMessage(t, n) {
            this.sendMessage(t, u(n));
        }
        broadcastWebSocketErrorMessage(t) {
            this.broadcastMessage(u(t));
        }
    };
    c(f, 'WebSocketSharedWorkerServer');
    var h = f;
    var T = new h(),
        be = T;
})();
