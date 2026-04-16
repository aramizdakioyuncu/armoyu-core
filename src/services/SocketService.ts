import { ArmoyuLogger, ConsoleLogger } from '../api/Logger';

export type SocketEvent =
  | 'message'
  | 'status'
  | 'typing'
  | 'notification'
  | 'post'
  | 'post_like'
  | 'post_delete'
  | 'post_repost_count'
  | 'connect'
  | 'disconnect';

type SocketListener = (data: unknown) => void;

/**
 * A production-ready WebSocket service for the ARMOYU platform.
 * Connects to the standalone armoyu-socket-server for real-time updates.
 * @checked 2026-04-12
 */
export class SocketService {
  private socket: any = null;
  public isConnected: boolean = false;
  private listeners: Map<SocketEvent, SocketListener[]> = new Map();
  private socketUrl: string = 'https://socket.armoyu.com';
  private logger: ArmoyuLogger;

  constructor(logger?: ArmoyuLogger) {
    this.logger = logger || new ConsoleLogger('[SocketService]');
    // Initialize only on the client side
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  setSocketUrl(url: string) {
    this.socketUrl = url;
  }

  private async connect() {
    try {
      // Dynamic import to avoid SSR issues
      const { io } = await import('socket.io-client');
      this.logger.info('Connecting to socket server:', this.socketUrl);

      const sock = io(this.socketUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
      });

      this.socket = sock;

      sock.on('connect', () => {
        this.logger.info('Connected! ID:', sock.id);
        this.isConnected = true;
        this.emitInternal('connect', { status: 'online', socketId: sock.id });
      });

      sock.on('disconnect', () => {
        this.logger.info('Disconnected.');
        this.isConnected = false;
        this.emitInternal('disconnect', { status: 'offline' });
      });

      const events: SocketEvent[] = [
        'message',
        'typing',
        'notification',
        'status',
        'post',
        'post_like',
        'post_delete',
        'post_repost_count',
      ];

      events.forEach((event) => {
        sock.on(event, (data: unknown) => {
          this.emitInternal(event, data);
        });
      });
    } catch (err) {
      this.logger.error('Connection failed:', err);
    }
  }

  private emitInternal(event: SocketEvent, data: unknown) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((cb) => cb(data));
  }

  on(event: SocketEvent, callback: SocketListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    if (event === 'connect' && this.isConnected) {
      callback({ status: 'online', alreadyConnected: true });
    }

    return () => {
      const cbs = this.listeners.get(event) || [];
      this.listeners.set(event, cbs.filter((cb) => cb !== callback));
    };
  }

  emit(event: SocketEvent, data: unknown) {
    const sock = this.socket as { connected: boolean; emit: (e: string, d: unknown) => void } | null;
    if (sock && (this.isConnected || sock.connected)) {
      sock.emit(event, data);
    } else {
      this.logger.warn(`Cannot emit '${event}', not connected.`);
    }
  }
}



