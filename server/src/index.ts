import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets";

const server = http.createServer(app);

let ioInstance: Server;

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized yet.");
  }
  return ioInstance;
};

const startServer = async () => {
  await connectDB();

  ioInstance = initSocket(server);

  server.listen(env.PORT, () => {
    console.log(
      `[Server] QueueLess API running on port ${env.PORT} (${env.NODE_ENV})`,
    );
    console.log(
      `[Server] Socket.IO real-time server is attached to the same port.`,
    );
  });
};

startServer();

process.on("SIGTERM", () => {
  console.log("[Server] SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});
