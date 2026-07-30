import React from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
}

export default function AdminUsersScreen() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => (await api.get("/admin/users")).data.users,
  });

  const ban = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/ban`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const confirmBan = (id: string, name: string) => {
    Alert.alert("Ban user", `Are you sure you want to ban "${name}"?`, [
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
          Users
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          Manage platform users.
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner label="Loading users..." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => (
            <Card className="mb-3 flex-row justify-between items-center">
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.email}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5 capitalize">
                  {item.role}
                </Text>
              </View>
              {!item.isBanned ? (
                <Button
                  label="Ban"
                  variant="danger"
                  onPress={() => confirmBan(item._id, item.name)}
                />
              ) : (
                <Text className="text-danger text-xs font-semibold">
                  BANNED
                </Text>
              )}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
