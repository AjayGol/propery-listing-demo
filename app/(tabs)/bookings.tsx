import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings, useProperties } from '@/services/api';
import BookingCard from '@/components/BookingCard';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/atoms';
import { Booking } from '@/stores/usePropertyStore';

export default function BookingsScreen() {
  const [user] = useAtom(userAtom);
  const { data: bookings, isLoading, refetch } = useBookings();
  const { data: properties } = useProperties();

  const userBookings = bookings?.filter(booking => booking.userId === user.id) || [];

  const renderBooking = ({ item }: {item: Booking}) => {
    const property = properties?.find(p => p.id === item.propertyId);
    return <BookingCard booking={item} property={property} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="px-4 py-6 bg-white">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Your Bookings
          </Text>
          <Text className="text-gray-600">
            Manage your upcoming and past reservations
          </Text>
        </View>

        <FlatList
          data={userBookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-center text-lg mb-2">
                No bookings yet
              </Text>
              <Text className="text-gray-400 text-center">
                Book your first property to see it here
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
