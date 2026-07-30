import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useMyBusinesses } from "../../hooks/useBusinesses";
import { useCreateQueue } from "../../hooks/useQueue";
import {
  createQueueSchema,
  CreateQueueFormValues,
} from "../../utils/validation";

export default function CreateQueueScreen() {
  const { data: businesses, isLoading } = useMyBusinesses();
  const business = businesses?.[0];
  const createQueue = useCreateQueue(business?._id ?? "");
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateQueueFormValues>({
    resolver: zodResolver(createQueueSchema),
  });

  const onSubmit = async (values: CreateQueueFormValues) => {
    if (!business) return;
    setServerError("");
    try {
      await createQueue.mutateAsync(values);
      reset();
      Alert.alert("Queue created", `"${values.name}" is now live.`, [
        {
          text: "Go to Dashboard",
          onPress: () => router.push("/(business)/dashboard"),
        },
      ]);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen label="Loading..." />;

  if (!business) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark items-center justify-center px-6">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Register a business first from your Profile tab before creating
          queues.
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
          New Queue
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-6">
          for {business.name}
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Queue name"
              placeholder="e.g. Doctor A, Table Service"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="avgServiceTimeMins"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Avg. service time per person (minutes)"
              placeholder="10"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString()}
              error={errors.avgServiceTimeMins?.message}
            />
          )}
        />

        {serverError ? (
          <Text className="text-danger text-sm mb-4">{serverError}</Text>
        ) : null}

        <Button
          label="Create Queue"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
