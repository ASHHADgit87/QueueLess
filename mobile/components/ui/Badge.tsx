import React from "react";
import { View, Text } from "react-native";

type BadgeStatus =
  | "waiting"
  | "called"
  | "served"
  | "cancelled"
  | "no-show"
  | "active"
  | "paused"
  | "closed";

const statusConfig: Record<
  BadgeStatus,
  { bg: string; text: string; label: string }
> = {
  waiting: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    label: "Waiting",
  },
  called: { bg: "bg-warning-light/30", text: "text-warning", label: "Called" },
  served: { bg: "bg-success-light/30", text: "text-success", label: "Served" },
  cancelled: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-500",
    label: "Cancelled",
  },
  "no-show": {
    bg: "bg-danger-light/30",
    text: "text-danger",
    label: "No-show",
  },
  active: { bg: "bg-success-light/30", text: "text-success", label: "Active" },
  paused: { bg: "bg-warning-light/30", text: "text-warning", label: "Paused" },
  closed: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-500",
    label: "Closed",
  },
};

export const Badge: React.FC<{ status: BadgeStatus }> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <View className={`${config.bg} rounded-full px-3 py-1 self-start`}>
      <Text className={`${config.text} text-xs font-semibold`}>
        {config.label}
      </Text>
    </View>
  );
};
