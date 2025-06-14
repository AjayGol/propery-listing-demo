import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useProperty, useCreateBooking, useBookings, useProperties } from '@/services/api';
import { usePropertyStore } from '@/stores/usePropertyStore';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/atoms';
import MapView, { Marker } from 'react-native-maps';
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Share,
  Heart,
  Calendar,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user] = useAtom(userAtom);
  const { data: property, isLoading } = useProperty(Number(id));
  const { data: bookings } = useBookings();

  const userBookings = bookings?.map(booking => {
    if(booking.userId === user.id) {
       return Number(booking.propertyId)
    }
  }) || [];

  const isAlreadyBooked = userBookings.includes(Number(id));


  const { addBooking } = usePropertyStore();
  const createBookingMutation = useCreateBooking();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleBooking = () => {
    if (!property) return;

    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 1);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    const booking = {
      propertyId: property.id,
      userId: user.id,
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      guests: 2,
      totalPrice: property.price * 2,
      status: 'confirmed' as const,
    };

    createBookingMutation.mutate(booking, {
      onSuccess: () => {
        addBooking(booking);
        Alert.alert(
          'Booking Confirmed!',
          'Your booking has been confirmed successfully.',
          [
            { text: 'View Bookings', onPress: () => router.push('/bookings') },
            { text: 'OK' },
          ],
        );
      },
      onError: () => {
        Alert.alert('Error', 'Failed to create booking. Please try again.');
      },
    });
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} color="#6b7280" />;
      case 'parking':
        return <Car size={16} color="#6b7280" />;
      default:
        return <View className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  if (isLoading || !property) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image
            source={{ uri: property.images[selectedImageIndex] }}
            style={{ width, height: 250 }}
            resizeMode="cover"
          />
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
            >
              <ArrowLeft size={20} color="#1f2937" />
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center mr-2">
                <Share size={20} color="#1f2937" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center">
                <Heart size={20} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          {property.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {property.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-4 py-6">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {property.title}
              </Text>
              <View className="flex-row items-center mb-2">
                <MapPin size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-1">{property.address}</Text>
              </View>
              <View className="flex-row items-center">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-gray-700 ml-1">
                  {property.rating} ({property.reviews} reviews)
                </Text>
              </View>
            </View>
            <View className="ml-4 items-end">
              <Text className="text-2xl font-bold text-primary-600">
                ${property.price}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <View className="flex-row items-center mr-4">
              <Users size={18} color="#6b7280" />
              <Text className="text-gray-700 ml-1">
                {property.guests} guests
              </Text>
            </View>
            <View className="flex-row items-center mr-4">
              <Bed size={18} color="#6b7280" />
              <Text className="text-gray-700 ml-1">
                {property.bedrooms} bedrooms
              </Text>
            </View>
            <View className="flex-row items-center">
              <Bath size={18} color="#6b7280" />
              <Text className="text-gray-700 ml-1">
                {property.bathrooms} bathrooms
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6 p-4 bg-gray-50 rounded-xl">
            <Image
              source={{ uri: property.host.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">
                Hosted by {property.host.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                {property.host.verified ? 'Verified Host' : 'Host'}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              About this place
            </Text>
            <Text className="text-gray-700 leading-6">
              {property.description}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </Text>
            <View className="flex-row flex-wrap">
              {property.features.map((feature, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-gray-100 rounded-full px-3 py-2 mr-2 mb-2"
                >
                  {getFeatureIcon(feature)}
                  <Text className="text-gray-700 ml-2 text-sm">{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Location
            </Text>
            <MapView
              style={{ height: 200, borderRadius: 12 }}
              initialRegion={{
                latitude: property.coordinates.latitude,
                longitude: property.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: property.coordinates.latitude,
                  longitude: property.coordinates.longitude,
                }}
                title={property.title}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleBooking}
          disabled={createBookingMutation.isPending || isAlreadyBooked}
          className="bg-primary-600 rounded-xl py-4 items-center"
        >
          <View className="flex-row items-center">
            <Calendar size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              {isAlreadyBooked ? 'Booked' : createBookingMutation.isPending ? 'Booking...' : 'Book Now'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
