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
import { loginSchema, LoginFormValues } from "../../utils/validation";

export default function LoginScreen() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      await login(values);
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
        contentContainerClassName="flex-grow justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-8">
          Log in to track your queues in real time.
        </Text>

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
              placeholder="••••••••"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        {serverError ? (
          <Text className="text-danger text-sm mb-4">{serverError}</Text>
        ) : null}

        <Button
          label="Log In"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />

        <Pressable
          onPress={() => router.push("/(auth)/register")}
          className="mt-6 items-center"
        >
          <Text className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Text className="text-primary font-semibold">Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
