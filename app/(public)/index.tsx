import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-2xl font-bold text-white">Welcome to Zeneca</Text>
      <Link href="/login" className="mt-4">
        <Text className="text-blue-500">Login</Text>
      </Link>
    </View>
  );
} 