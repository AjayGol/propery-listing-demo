import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Users } from 'lucide-react-native';
import { Booking } from '@/stores/usePropertyStore';
import { router } from 'expo-router';

interface BookingCardProps {
  booking: Booking;
  property?: any;
}

export default function BookingCard({ booking, property }: BookingCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleNavigation = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      onPress={handleNavigation}
    >
      {property && (
        <Image
          source={{ uri: property.images[0] }}
          className="w-full h-32"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        {property && (
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {property.title}
          </Text>
        )}

        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Users size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {booking.guests} guests
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View
            className={`px-2 py-1 rounded-full bg-green-100 text-green-800`}
          >
            <Text className="text-xs font-medium capitalize">
              {booking.status}
            </Text>
          </View>
          <Text className="text-lg font-bold text-primary-600">
            ${booking.totalPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
