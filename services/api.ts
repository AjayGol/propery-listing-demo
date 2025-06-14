import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property, Booking } from '@/stores/usePropertyStore';

const API_BASE_URL = 'http://192.168.1.13:3001'

export const useProperties = () => {
  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/properties`);
      console.log(JSON.stringify(response),"----response")
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    },
  });
};

export const useProperty = (id: number) => {
  return useQuery<Property>({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      return response.json();
    },
  });
};

export const useBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return response.json();
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...booking,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
