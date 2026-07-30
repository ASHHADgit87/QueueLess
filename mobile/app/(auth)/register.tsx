import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, RegisterFormValues } from "../../utils/validation";

export default function RegisterScreen() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const role = watch("role");

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    try {
      await registerUser(values);
      router.replace("/");
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface dark:bg-surface-dark"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Create account
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-6">
          Join QueueLess and skip the wait.
        </Text>

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          I am a...
        </Text>
        <View className="flex-row mb-6 gap-3">
          <Pressable
            onPress={() => setValue("role", "customer")}
            className={`flex-1 py-3 rounded-xl items-center border ${
              role === "customer"
                ? "bg-primary border-primary"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <Text
              className={
                role === "customer"
                  ? "text-white font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              Customer
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setValue("role", "business")}
            className={`flex-1 py-3 rounded-xl items-center border ${
              role === "business"
                ? "bg-primary border-primary"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <Text
              className={
                role === "business"
                  ? "text-white font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              Business Owner
            </Text>
          </Pressable>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name"
              placeholder="Ali Khan"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone (optional)"
              placeholder="+92 300 1234567"
              keyboardType="phone-pad"
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
          label="Create Account"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />

        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="mt-6 items-center"
        >
          <Text className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Text className="text-primary font-semibold">Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
