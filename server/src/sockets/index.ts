import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { registerQueueSocketHandlers, roomForUser } from "./queueSocket";

interface SocketAuthPayload {
  id: string;
  role: string;
}

export const initSocket = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORIGIN === "*" ? "*" : env.CLIENT_ORIGIN.split(","),
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error("Unauthorized: no token provided"));
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as SocketAuthPayload;
      (socket.data as any).userId = decoded.id;
      (socket.data as any).role = decoded.role;
      next();
    } catch {
      next(new Error("Unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket.data as any).userId as string;

    socket.join(roomForUser(userId));

    registerQueueSocketHandlers(io, socket);

    socket.on("disconnect", () => {});
  });

  return io;
};
