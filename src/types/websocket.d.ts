// types/websocket.d.ts
declare global {
  interface WebSocket {
    isAlive?: boolean;
  }
}

export type AppWebSocket = WebSocket & { isAlive?: boolean };