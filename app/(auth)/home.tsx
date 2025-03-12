import { View, Text } from 'react-native';
import { usePrivy } from '@privy-io/expo';

export default function Home() {
  const { user } = usePrivy();

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-2xl font-bold text-white">Welcome {user?.id}</Text>
    </View>
  );
} 