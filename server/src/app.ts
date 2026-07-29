import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFound } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import businessRoutes from "./routes/businessRoutes";
import queueRoutes from "./routes/queueRoutes";
import queueEntryRoutes from "./routes/queueEntryRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import adminRoutes from "./routes/adminRoutes";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN === "*" ? "*" : env.CLIENT_ORIGIN.split(","),
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", apiLimiter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "QueueLess API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/queue-entries", queueEntryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
