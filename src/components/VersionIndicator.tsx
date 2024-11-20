import * as Updates from 'expo-updates';
import { Text, View } from 'react-native';

export const VersionIndicator = () => {
  if (__DEV__) return null;
  
  return (
    <View className="absolute bottom-2 right-2">
      <Text className="text-gray-500 text-xs">
        Channel: {Updates.channel}{'\n'}
        Update ID: {Updates.updateId?.slice(0, 7)}
      </Text>
    </View>
  );
};