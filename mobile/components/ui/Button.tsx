import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
} from "react-native";
import * as Haptics from "expo-haptics";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: "bg-primary active:bg-primary-dark", text: "text-white" },
  secondary: {
    bg: "bg-gray-100 active:bg-gray-200 dark:bg-gray-800",
    text: "text-gray-900 dark:text-white",
  },
  danger: {
    bg: "bg-red-50 active:bg-red-100 border border-red-200",
    text: "text-danger",
  },
  outline: {
    bg: "bg-transparent border border-primary active:bg-primary/10",
    text: "text-primary",
  },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  isLoading = false,
  disabled = false,
  onPress,
  ...rest
}) => {
  const styles = variantStyles[variant];

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      className={`${styles.bg} rounded-xl py-3.5 px-6 items-center justify-center ${
        disabled || isLoading ? "opacity-50" : ""
      }`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#4F46E5"} />
      ) : (
        <Text className={`${styles.text} font-semibold text-base`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};
