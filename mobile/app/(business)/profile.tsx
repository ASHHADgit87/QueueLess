import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useMyBusinesses, useCreateBusiness } from "../../hooks/useBusinesses";
import {
  createBusinessSchema,
  CreateBusinessFormValues,
} from "../../utils/validation";

export default function BusinessProfileScreen() {
  const { user, logout } = useAuth();
  const { data: businesses, isLoading } = useMyBusinesses();
  const createBusiness = useCreateBusiness();
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
  });

  const onSubmit = async (values: CreateBusinessFormValues) => {
    setServerError("");
    try {
      await createBusiness.mutateAsync(values);
      Alert.alert(
        "Business registered",
        "Your business is now live on QueueLess.",
      );
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (isLoading) return <LoadingSpinner fullScreen label="Loading..." />;

  const business = businesses?.[0];

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <ScrollView contentContainerClassName="px-5 pt-2 pb-10">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Profile
        </Text>
        <Text className="text-gray-400 mb-6">{user?.email}</Text>

        {business ? (
          <Card className="mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {business.name}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {business.category}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              {business.address}
            </Text>
          </Card>
        ) : (
          <>
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Register your business
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Business name"
                  placeholder="City Clinic"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Category"
                  placeholder="Clinic, Salon, Restaurant..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.category?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Address"
                  placeholder="Street, area, city"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="openingHours"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Opening hours (optional)"
                  placeholder="9am - 9pm"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {serverError ? (
              <Text className="text-danger text-sm mb-4">{serverError}</Text>
            ) : null}
            <Button
              label="Register Business"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            />
          </>
        )}

        <View className="mt-6">
          <Button label="Log Out" variant="secondary" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
