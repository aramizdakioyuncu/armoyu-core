"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
/**
 * A production-ready WebSocket service for the ARMOYU platform.
 * Connects to the standalone armoyu-socket-server.
 */
class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.socketUrl = 'https://socket.armoyu.com';
        // Initialize only on the client side
        if (typeof window !== 'undefined') {
            this.connect();
        }
    }
    setSocketUrl(url) {
        this.socketUrl = url;
    }
    async connect() {
        try {
            // Dynamic import to avoid SSR issues
            const { io } = await Promise.resolve().then(() => __importStar(require('socket.io-client')));
            console.log('[SocketService] Connecting to socket server...');
            const sock = io(this.socketUrl, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 10,
            });
            this.socket = sock;
            sock.on('connect', () => {
                console.log('[SocketService] Connected! ID:', sock.id);
                this.isConnected = true;
                this.emitInternal('connect', { status: 'online', socketId: sock.id });
            });
            sock.on('disconnect', () => {
                console.log('[SocketService] Disconnected.');
                this.isConnected = false;
                this.emitInternal('disconnect', { status: 'offline' });
            });
            const events = [
                'message',
                'typing',
                'notification',
                'status',
                'post',
                'post_like',
                'post_repost_count',
            ];
            events.forEach((event) => {
                sock.on(event, (data) => {
                    this.emitInternal(event, data);
                });
            });
        }
        catch (err) {
            console.error('[SocketService] Connection failed:', err);
        }
    }
    emitInternal(event, data) {
        const handlers = this.listeners.get(event) || [];
        handlers.forEach((cb) => cb(data));
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        if (event === 'connect' && this.isConnected) {
            callback({ status: 'online', alreadyConnected: true });
        }
        return () => {
            const cbs = this.listeners.get(event) || [];
            this.listeners.set(event, cbs.filter((cb) => cb !== callback));
        };
    }
    emit(event, data) {
        const sock = this.socket;
        if (sock && (this.isConnected || sock.connected)) {
            sock.emit(event, data);
        }
        else {
            console.warn(`[SocketService] Cannot emit '${event}', not connected.`);
        }
    }
}
exports.socketService = new SocketService();
