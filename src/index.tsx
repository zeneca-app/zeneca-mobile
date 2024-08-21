import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Suspense } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

const Stack = createNativeStackNavigator();

const AppIndex = () => {
  return (
    <Suspense fallback={<></>}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
}

export default AppIndex;


