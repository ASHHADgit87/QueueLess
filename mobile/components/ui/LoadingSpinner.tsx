import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  label,
}) => {
  return (
    <View
      className={
        fullScreen
          ? "flex-1 items-center justify-center bg-surface dark:bg-surface-dark"
          : "py-8 items-center justify-center"
      }
    >
      <ActivityIndicator size="large" color="#4F46E5" />
      {label ? (
        <Text className="text-gray-500 dark:text-gray-400 mt-3">{label}</Text>
      ) : null}
    </View>
  );
};
