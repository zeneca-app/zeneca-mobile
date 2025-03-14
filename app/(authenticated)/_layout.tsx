import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={screenConfigs.homeHeader} />
      <Stack.Screen
        name="modals"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="deposit"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="explore"
        options={screenConfigs.defaultHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
