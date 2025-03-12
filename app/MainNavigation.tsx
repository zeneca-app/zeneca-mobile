import { Stack } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MainNavigation = () => {
  const navigation = useNavigation();

  const backButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={22} color="white" />
    </TouchableOpacity>
  );

  // Common header options
  const defaultScreenOptions = {
    title: '',
    headerBackTitle: '',
    headerStyle: { backgroundColor: Colors.basicBlack },
    headerShadowVisible: false,
    headerTransparent: true,
    headerLeft: backButton,
  };

  return (
    <Stack
      screenOptions={defaultScreenOptions}
      // Define default screen options that can be overridden
      initialRouteName="home"
    >
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(public)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="etf"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="deposit"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="kyc"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default MainNavigation;