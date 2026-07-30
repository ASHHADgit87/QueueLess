import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...rest
}) => {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-base text-gray-900 dark:text-white ${
          error ? "border-danger" : "border-gray-200 dark:border-gray-700"
        } ${className}`}
        {...rest}
      />
      {error ? <Text className="text-danger text-xs mt-1">{error}</Text> : null}
    </View>
  );
};
