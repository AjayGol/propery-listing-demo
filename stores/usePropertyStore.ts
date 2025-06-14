import { create } from 'zustand';

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  features: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  rating: number;
  reviews: number;
  host: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

export interface Booking {
  id: number;
  propertyId: number;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface PropertyStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedProperty: null,
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  bookings: [],
  addBooking: (booking) =>
    set((state) => ({
      bookings: [
        ...state.bookings,
        {
          ...booking,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
}));