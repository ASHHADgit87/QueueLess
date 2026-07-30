import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../services/socketService";
import { useAuth } from "./useAuth";

export const useSocket = (): { socket: Socket | null; connected: boolean } => {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, token]);

  return { socket, connected };
};
