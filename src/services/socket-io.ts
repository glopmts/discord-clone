import io from "socket.io-client"

const URL_API = "http://localhost:5001"

export const socket = io("http://localhost:5001", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
})

export const SOCKET_URL = URL_API

