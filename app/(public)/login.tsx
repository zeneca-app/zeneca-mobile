import { View, Text, TouchableOpacity } from 'react-native';
import { useLogin } from '@privy-io/expo';

export default function Login() {
  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      await login({
        loginMethods: ['email'],
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-2xl font-bold text-white mb-8">Login to Zeneca</Text>
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Login with Email</Text>
      </TouchableOpacity>
    </View>
  );
} 