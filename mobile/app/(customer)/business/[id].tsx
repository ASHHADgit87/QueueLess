import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ChevronLeft, MapPin, Clock } from "lucide-react-native";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useBusinessDetail,
  useBusinessReviews,
} from "../../../hooks/useBusinesses";
import { useJoinQueue } from "../../../hooks/useQueue";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, refetch } = useBusinessDetail(id);
  const { data: reviews } = useBusinessReviews(id);
  const joinQueue = useJoinQueue();

  if (isLoading || !data) {
    return <LoadingSpinner fullScreen label="Loading business..." />;
  }

  const { business, queues } = data;

  const handleJoin = async (queueId: string) => {
    try {
      await joinQueue.mutateAsync(queueId);
      router.push(`/(customer)/queue/${queueId}`);
    } catch (err: any) {
      await refetch();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <View className="flex-row items-center px-4 py-2">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft color="#111827" size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-10">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {business.name}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-3">
          {business.category}
        </Text>

        <View className="flex-row items-center mb-1">
          <MapPin color="#9CA3AF" size={16} />
          <Text className="text-gray-500 dark:text-gray-400 ml-1.5 flex-1">
            {business.address}
          </Text>
        </View>
        {business.openingHours ? (
          <View className="flex-row items-center mb-4">
            <Clock color="#9CA3AF" size={16} />
            <Text className="text-gray-500 dark:text-gray-400 ml-1.5">
              {business.openingHours}
            </Text>
          </View>
        ) : null}

        <Text className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-3">
          Active Queues
        </Text>

        {queues.length === 0 ? (
          <Card>
            <Text className="text-gray-500 dark:text-gray-400 text-center py-2">
              This business has no active queues right now.
            </Text>
          </Card>
        ) : (
          queues.map((queue) => (
            <Card key={queue._id} className="mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  {queue.name}
                </Text>
                <Badge status={queue.status} />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 mb-3">
                {queue.waitingCount ?? 0} people waiting · ~
                {queue.avgServiceTimeMins} min per person
              </Text>
              <Button
                label="Join Queue"
                onPress={() => handleJoin(queue._id)}
                isLoading={joinQueue.isPending}
                disabled={queue.status !== "active"}
              />
            </Card>
          ))
        )}

        <Text className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-3">
          Reviews
        </Text>
        {!reviews || reviews.length === 0 ? (
          <Text className="text-gray-400">No reviews yet.</Text>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="mb-2">
              <Text className="text-warning font-bold mb-1">
                {"★".repeat(review.rating)}
              </Text>
              {review.comment ? (
                <Text className="text-gray-700 dark:text-gray-300">
                  {review.comment}
                </Text>
              ) : null}
              {review.reply ? (
                <Text className="text-gray-400 text-sm mt-2 italic">
                  Business reply: {review.reply}
                </Text>
              ) : null}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
