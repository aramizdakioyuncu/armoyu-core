import { ArmoyuLogger } from '../api/Logger';
export type SocketEvent = 'message' | 'status' | 'typing' | 'notification' | 'post' | 'post_like' | 'post_repost_count' | 'connect' | 'disconnect';
type SocketListener = (data: unknown) => void;
/**
 * A production-ready WebSocket service for the ARMOYU platform.
 * Connects to the standalone armoyu-socket-server.
 */
export declare class SocketService {
    private socket;
    isConnected: boolean;
    private listeners;
    private socketUrl;
    private logger;
    constructor(logger?: ArmoyuLogger);
    setSocketUrl(url: string): void;
    private connect;
    private emitInternal;
    on(event: SocketEvent, callback: SocketListener): () => void;
    emit(event: SocketEvent, data: unknown): void;
}
export {};
