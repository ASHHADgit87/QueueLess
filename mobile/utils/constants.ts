import Constants from "expo-constants";
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const APP_NAME = "QueueLess";
export const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  surface: "#F9FAFB",
  surfaceDark: "#111827",
  card: "#FFFFFF",
  cardDark: "#1F2937",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textOnDark: "#F9FAFB",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const SOCKET_EVENTS = {
  SUBSCRIBE: "queue:subscribe",
  UNSUBSCRIBE: "queue:unsubscribe",
  UPDATE: "queue:update",
  YOUR_TURN: "notification:yourTurn",
  GET_READY: "notification:getReady",
} as const;
