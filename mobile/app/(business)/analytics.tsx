import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingUp, Clock, UserX, Activity } from "lucide-react-native";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import {
  useMyBusinesses,
  useBusinessAnalytics,
} from "../../hooks/useBusinesses";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex-1 items-start">
      <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center mb-3">
        {icon}
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
        {label}
      </Text>
    </Card>
  );
}

export default function BusinessAnalyticsScreen() {
  const { data: businesses, isLoading: loadingBusinesses } = useMyBusinesses();
  const business = businesses?.[0];
  const { data: analytics, isLoading: loadingAnalytics } = useBusinessAnalytics(
    business?._id,
  );

  if (loadingBusinesses || loadingAnalytics) {
    return <LoadingSpinner fullScreen label="Crunching the numbers..." />;
  }

  if (!business || !analytics) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark items-center justify-center px-6">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          No analytics available yet.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <ScrollView contentContainerClassName="px-5 pt-4 pb-10">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Analytics
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-6">
          Today's performance for {business.name}
        </Text>

        <View className="flex-row gap-3 mb-3">
          <StatCard
            icon={<Activity color="#4F46E5" size={18} />}
            label="Served today"
            value={String(analytics.servedToday)}
          />
          <StatCard
            icon={<Clock color="#4F46E5" size={18} />}
            label="Avg wait (mins)"
            value={String(analytics.avgWaitMins)}
          />
        </View>
        <View className="flex-row gap-3">
          <StatCard
            icon={<UserX color="#4F46E5" size={18} />}
            label="No-show rate"
            value={`${analytics.noShowRate}%`}
          />
          <StatCard
            icon={<TrendingUp color="#4F46E5" size={18} />}
            label="Peak hour"
            value={
              analytics.peakHour !== null ? `${analytics.peakHour}:00` : "—"
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
