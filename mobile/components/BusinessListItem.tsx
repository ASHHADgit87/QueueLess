import React from "react";
import { Pressable, View, Text } from "react-native";
import { router } from "expo-router";
import { Card } from "./ui/Card";
import { Business } from "../types/business";

interface BusinessListItemProps {
  business: Business;
}

export const BusinessListItem: React.FC<BusinessListItemProps> = ({
  business,
}) => {
  return (
    <Pressable
      onPress={() => router.push(`/(customer)/business/${business._id}`)}
      className="active:opacity-80"
    >
      <Card className="mb-3 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Text
              className="text-base font-semibold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {business.name}
            </Text>
            {business.isVerified ? (
              <View className="ml-2 bg-primary/10 rounded-full px-2 py-0.5">
                <Text className="text-primary text-[10px] font-bold">
                  VERIFIED
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {business.category}
          </Text>
          <Text
            className="text-gray-400 dark:text-gray-500 text-xs mt-1"
            numberOfLines={1}
          >
            {business.address}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-warning font-bold">
            ★ {business.avgRating.toFixed(1)}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {business.ratingCount} reviews
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};
