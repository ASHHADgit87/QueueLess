import React from "react";
import { View, Text, Pressable } from "react-native";
import { Badge } from "./ui/Badge";
import { QueueEntry } from "../types/queue";
import { formatRelativeTime } from "../utils/formatTime";

interface QueueEntryRowProps {
  entry: QueueEntry;
  onMarkNoShow?: (entryId: string) => void;
}

export const QueueEntryRow: React.FC<QueueEntryRowProps> = ({
  entry,
  onMarkNoShow,
}) => {
  const displayName = entry.isWalkIn
    ? entry.walkInName || "Walk-in"
    : typeof entry.user === "object"
      ? entry.user?.name
      : "Customer";

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-row items-center flex-1">
        <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center mr-3">
          <Text className="text-primary font-bold">{entry.position}</Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-gray-900 dark:text-white font-medium"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            Joined {formatRelativeTime(entry.joinedAt)}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Badge status={entry.status} />
        {entry.status === "called" && onMarkNoShow ? (
          <Pressable onPress={() => onMarkNoShow(entry._id)} className="mt-1.5">
            <Text className="text-danger text-xs font-medium">
              Mark no-show
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
