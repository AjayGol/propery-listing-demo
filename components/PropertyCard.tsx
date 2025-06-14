import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Star, MapPin } from 'lucide-react-native';
import { Property } from '@/stores/usePropertyStore';

interface PropertyCardProps {
  property: Property;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

export default function PropertyCard({ property }: PropertyCardProps) {
  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      style={{ width: cardWidth }}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-48"
        resizeMode="cover"
      />

      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-gray-900 flex-1" numberOfLines={1}>
            {property.title}
          </Text>
          <View className="flex-row items-center ml-2">
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-sm font-medium text-gray-700 ml-1">
              {property.rating}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={14} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
          {property.description}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">
              {property.bedrooms} bed • {property.bathrooms} bath • {property.guests} guests
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-lg font-bold text-primary-600">
              ${property.price}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
