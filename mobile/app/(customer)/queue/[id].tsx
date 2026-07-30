import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { QueuePositionCard } from "../../../components/QueuePositionCard";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useQueueLive,
  useLeaveQueue,
  useMyQueuePosition,
} from "../../../hooks/useQueue";
import { useAuth } from "../../../hooks/useAuth";

export default function QueueTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { entries, isLoading } = useQueueLive(id);
  const leaveQueue = useLeaveQueue();
  const [isLeaving, setIsLeaving] = useState(false);

  const myPosition = useMyQueuePosition(entries, user?.id);
  const translateX = useSharedValue(0);

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveQueue.mutateAsync(id);
      router.back();
    } catch (err: any) {
      Alert.alert("Could not leave queue", err.message);
      setIsLeaving(false);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -120) {
        runOnJS(handleLeave)();
      } else {
        translateX.value = 0;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Connecting to queue..." />;
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#3730A3", "#4F46E5", "#1F2937"]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 items-center justify-between py-10">
          <Text className="text-white/80 text-base mt-4">
            You're in the queue
          </Text>

          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={animatedStyle}>
              <QueuePositionCard
                position={myPosition}
                avgServiceTimeMins={10}
                queueName="Live position"
              />
            </Animated.View>
          </GestureDetector>

          <View className="w-full px-8">
            <Text className="text-white/60 text-center text-xs mb-3">
              Swipe the ring left, or tap below, to leave
            </Text>
            <Button
              label="Leave Queue"
              variant="danger"
              onPress={handleLeave}
              isLoading={isLeaving}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
