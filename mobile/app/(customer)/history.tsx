import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { formatDateTime } from "../../utils/formatTime";

interface HistoryItem {
  _id: string;
  status: string;
  joinedAt: string;
  servedAt?: string;
  queue: { name: string };
  business: { name: string; category: string };
}

export default function HistoryScreen() {
  const { data: history, isLoading } = useQuery<HistoryItem[]>({
    queryKey: ["history"],
    queryFn: authService.getHistory,
  });

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Your History
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          Past visits and queue outcomes.
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner label="Loading history..." />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {item.business?.name}
                </Text>
                <Badge status={item.status as any} />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {item.queue?.name}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {formatDateTime(item.joinedAt)}
              </Text>
            </Card>
          )}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-16">
              No queue history yet — join your first queue!
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
