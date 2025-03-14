import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';


export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="detail"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="purchase"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="sell"
        options={screenConfigs.defaultHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
