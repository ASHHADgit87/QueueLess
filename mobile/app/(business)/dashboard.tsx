import React, { useState } from "react";
import { View, Text, FlatList, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { QueueEntryRow } from "../../components/QueueEntryRow";
import { useMyBusinesses } from "../../hooks/useBusinesses";
import {
  useQueuesForBusiness,
  useQueueLive,
  useCallNext,
  useMarkNoShow,
  useUpdateQueue,
} from "../../hooks/useQueue";

function QueueDashboardCard({
  queueId,
  queueName,
  status,
  businessId,
}: {
  queueId: string;
  queueName: string;
  status: string;
  businessId: string;
}) {
  const { entries, isLoading } = useQueueLive(queueId);
  const callNext = useCallNext();
  const markNoShow = useMarkNoShow();
  const updateQueue = useUpdateQueue(businessId);

  const handleCallNext = async () => {
    try {
      await callNext.mutateAsync(queueId);
    } catch (err: any) {
      Alert.alert("Could not call next", err.message);
    }
  };

  const togglePause = async () => {
    await updateQueue.mutateAsync({
      queueId,
      values: { status: status === "active" ? "paused" : "active" },
    });
  };

  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {queueName}
        </Text>
        <Badge status={status as any} />
      </View>

      {isLoading ? (
        <LoadingSpinner label="Loading entries..." />
      ) : entries.length === 0 ? (
        <Text className="text-gray-400 py-4 text-center">
          No one is waiting right now.
        </Text>
      ) : (
        entries.map((entry) => (
          <QueueEntryRow
            key={entry._id}
            entry={entry}
            onMarkNoShow={(id) => markNoShow.mutate(id)}
          />
        ))
      )}

      <View className="flex-row gap-3 mt-4">
        <View className="flex-1">
          <Button
            label="Call Next"
            onPress={handleCallNext}
            isLoading={callNext.isPending}
          />
        </View>
        <View className="flex-1">
          <Button
            label={status === "active" ? "Pause Queue" : "Resume Queue"}
            variant="secondary"
            onPress={togglePause}
          />
        </View>
      </View>
    </Card>
  );
}

export default function BusinessDashboardScreen() {
  const { data: businesses, isLoading: loadingBusinesses } = useMyBusinesses();
  const business = businesses?.[0];
  const { data: queues, isLoading: loadingQueues } = useQueuesForBusiness(
    business?._id,
  );

  if (loadingBusinesses) {
    return <LoadingSpinner fullScreen label="Loading your business..." />;
  }

  if (!business) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark items-center justify-center px-6">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          You haven't registered a business yet. Go to Profile to set one up.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {business.name}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          Live queue management
        </Text>
      </View>

      {loadingQueues ? (
        <LoadingSpinner label="Loading queues..." />
      ) : (
        <FlatList
          data={queues}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => (
            <QueueDashboardCard
              queueId={item._id}
              queueName={item.name}
              status={item.status}
              businessId={business._id}
            />
          )}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-10">
              No queues yet. Create one from the "New Queue" tab.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
