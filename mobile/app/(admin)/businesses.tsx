import React from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface AdminBusiness {
  _id: string;
  name: string;
  category: string;
  isVerified: boolean;
  isBanned: boolean;
  owner: { name: string; email: string };
}

export default function AdminBusinessesScreen() {
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery<AdminBusiness[]>({
    queryKey: ["admin", "businesses"],
    queryFn: async () => (await api.get("/admin/businesses")).data.businesses,
  });

  const verify = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/businesses/${id}/verify`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] }),
  });

  const ban = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/businesses/${id}/ban`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] }),
  });

  const confirmBan = (id: string, name: string) => {
    Alert.alert("Ban business", `Are you sure you want to ban "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Ban", style: "destructive", onPress: () => ban.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Businesses
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          Verify or moderate platform businesses.
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner label="Loading businesses..." />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </Text>
                {item.isBanned ? (
                  <Badge status="closed" />
                ) : item.isVerified ? (
                  <Badge status="active" />
                ) : (
                  <Badge status="paused" />
                )}
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                {item.category} · owner: {item.owner?.name} ({item.owner?.email}
                )
              </Text>
              <View className="flex-row gap-3">
                {!item.isVerified && !item.isBanned ? (
                  <View className="flex-1">
                    <Button
                      label="Verify"
                      onPress={() => verify.mutate(item._id)}
                      isLoading={verify.isPending}
                    />
                  </View>
                ) : null}
                {!item.isBanned ? (
                  <View className="flex-1">
                    <Button
                      label="Ban"
                      variant="danger"
                      onPress={() => confirmBan(item._id, item.name)}
                    />
                  </View>
                ) : null}
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
