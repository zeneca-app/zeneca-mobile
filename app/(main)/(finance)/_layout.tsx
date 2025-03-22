import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
  return (
    <Stack>

      <Stack.Screen
        name="deposit"
        options={screenConfigs.defaultHeader}
      />

      <Stack.Screen
        name="assets"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="orders"
        options={screenConfigs.defaultHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
