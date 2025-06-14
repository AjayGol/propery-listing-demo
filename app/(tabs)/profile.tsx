import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/atoms';
import { Settings, Heart, CreditCard, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight, Star } from 'lucide-react-native';

type MenuItemProps = {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const [user] = useAtom(userAtom);

  const menuItems = [
    { icon: Settings, title: 'Account Settings', subtitle: 'Manage your account' },
    { icon: Heart, title: 'Saved Properties', subtitle: 'Your favorite places' },
    { icon: CreditCard, title: 'Payment Methods', subtitle: 'Manage payments' },
    { icon: Shield, title: 'Privacy & Security', subtitle: 'Control your privacy' },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help when you need it' },
  ];

  const MenuItem = ({ icon: Icon, title, subtitle, onPress }: MenuItemProps) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white p-4 mb-2 rounded-xl"
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Icon size={20} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="bg-white rounded-xl p-6 mb-6 items-center">
            <View className="relative">
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full"
              />
              {user.verified && (
                <View className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
                  <Shield size={12} color="white" />
                </View>
              )}
            </View>
            <Text className="text-xl font-bold text-gray-900 mt-4">
              {user.name}
            </Text>
            <Text className="text-gray-600 mb-4">
              {user.email}
            </Text>
            <View className="flex-row items-center">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                4.9 • Host
              </Text>
            </View>
          </View>

          <View className="mb-6">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => {}}
              />
            ))}
          </View>

          <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-xl">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text className="text-base font-medium text-red-600">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
