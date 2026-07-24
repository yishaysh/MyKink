import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  coupleId: string;
}

export class SocketServerService {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, ClientConnection> = new Map(); // userId -> Connection

  public initialize(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/v1/sync' });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('⚡ WebSocket client connected');

      let clientInfo: ClientConnection | null = null;

      ws.on('message', (message: string) => {
        try {
          const packet = JSON.parse(message.toString());

          // Handle Authentication / Connection Register
          if (packet.type === 'REGISTER') {
            const { userId, coupleId } = packet.payload;
            clientInfo = { ws, userId, coupleId };
            this.connections.set(userId, clientInfo);
            console.log(`👤 Client registered WS: User=${userId}, Couple=${coupleId}`);

            ws.send(JSON.stringify({ type: 'REGISTERED', status: 'OK' }));
            return;
          }

          // Broadcast E2EE Chat / Typing / State events to partner
          if (clientInfo && packet.type) {
            this.broadcastToPartner(clientInfo.coupleId, clientInfo.userId, packet);
          }
        } catch (e) {
          console.error('❌ WS Packet parse error:', e);
        }
      });

      ws.on('close', () => {
        if (clientInfo) {
          this.connections.delete(clientInfo.userId);
          console.log(`🔌 Client disconnected WS: User=${clientInfo.userId}`);
        }
      });
    });

    console.log('🚀 WebSocket server running on path /v1/sync');
  }

  public broadcastToCouple(coupleId: string, packet: any) {
    for (const [, conn] of this.connections) {
      if (conn.coupleId === coupleId && conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(packet));
      }
    }
  }

  public broadcastToPartner(coupleId: string, senderUserId: string, packet: any) {
    for (const [, conn] of this.connections) {
      if (conn.coupleId === coupleId && conn.userId !== senderUserId && conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.send(JSON.stringify(packet));
      }
    }
  }
}

export const socketServer = new SocketServerService();
