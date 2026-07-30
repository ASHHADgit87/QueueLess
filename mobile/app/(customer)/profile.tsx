import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function CustomerProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { authService } = await import("../../services/authService");
      await authService.updateProfile({ name });
      await refreshUser();
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (err: any) {
      Alert.alert("Update failed", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        <Card className="mb-4">
          <Input label="Full name" value={name} onChangeText={setName} />
          <Text className="text-gray-400 text-sm mb-4">{user?.email}</Text>
          <Button
            label="Save Changes"
            onPress={handleSave}
            isLoading={isSaving}
          />
        </Card>

        <Button label="Log Out" variant="secondary" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
