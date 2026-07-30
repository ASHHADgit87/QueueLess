import React, { useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { Input } from "../../components/ui/Input";
import { BusinessListItem } from "../../components/BusinessListItem";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useBusinesses } from "../../hooks/useBusinesses";
import { useAuth } from "../../hooks/useAuth";

const CATEGORIES = [
  "All",
  "Clinic",
  "Salon",
  "Restaurant",
  "Bank",
  "Repair Shop",
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const {
    data: businesses,
    isLoading,
    isFetching,
    refetch,
  } = useBusinesses(
    search || undefined,
    category === "All" ? undefined : category,
  );

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-surface-dark"
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
          Find a queue and join remotely.
        </Text>

        <Input
          placeholder="Search clinics, salons, restaurants..."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerClassName="gap-2 pb-2"
          renderItem={({ item }) => (
            <Text
              onPress={() => setCategory(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium overflow-hidden ${
                category === item
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {item}
            </Text>
          )}
        />
      </View>

      {isLoading ? (
        <LoadingSpinner label="Finding businesses near you..." />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          contentContainerClassName="px-5 pb-6"
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => <BusinessListItem business={item} />}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Search color="#9CA3AF" size={32} />
              <Text className="text-gray-400 mt-3">
                No businesses found. Try a different search.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
