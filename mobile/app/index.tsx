import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading QueueLess..." />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === "business") {
    return <Redirect href="/(business)/dashboard" />;
  }

  if (user.role === "admin") {
    return <Redirect href="/(admin)/businesses" />;
  }

  return <Redirect href="/(customer)/home" />;
}
