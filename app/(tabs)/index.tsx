import React, { useMemo } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings, useProperties } from '@/services/api';
import { usePropertyStore } from '@/stores/usePropertyStore';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';

export default function HomeScreen() {
  const { data: properties, isLoading, refetch } = useProperties();

  const { searchQuery, setSearchQuery } = usePropertyStore();

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    if (!searchQuery.trim()) return properties;

    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [properties, searchQuery]);

  const renderProperty = ({ item }: any) => <PropertyCard property={item} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="px-4 py-2 bg-white">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Find your perfect stay
          </Text>
          <Text className="text-gray-600 mb-4">
            Discover amazing places to stay around the world
          </Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by location, title, or description..."
        />

        <FlatList
          data={filteredProperties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-center">
                {searchQuery
                  ? 'No properties found matching your search'
                  : 'No properties available'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
