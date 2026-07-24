type Listener = (packet: any) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private isConnected = false;

  public connect(userId: string, coupleId: string) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const wsUrl = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:4000/v1/sync';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('⚡ Connected to MyKink WebSocket sync server');
        this.isConnected = true;
        this.send('REGISTER', { userId, coupleId });
      };

      this.ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          this.listeners.forEach((fn) => fn(packet));
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WS disconnected, retrying in 3s...');
        this.isConnected = false;
        setTimeout(() => this.connect(userId, coupleId), 3000);
      };
    } catch (e) {
      console.error('WS connection error', e);
    }
  }

  public send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  public subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const socketClient = new SocketClient();
