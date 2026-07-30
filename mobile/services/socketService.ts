import { io, Socket } from "socket.io-client";
import { API_URL } from "../utils/constants";

let socketInstance: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socketInstance?.connected) return socketInstance;

  socketInstance = io(API_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return socketInstance;
};

export const getSocket = (): Socket | null => socketInstance;

export const disconnectSocket = (): void => {
  socketInstance?.disconnect();
  socketInstance = null;
};
