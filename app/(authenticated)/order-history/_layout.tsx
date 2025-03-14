import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
  return (
    <Stack screenOptions={screenConfigs.noHeader}>
      <Stack.Screen
        name="index"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="[id]"
        options={screenConfigs.defaultHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
