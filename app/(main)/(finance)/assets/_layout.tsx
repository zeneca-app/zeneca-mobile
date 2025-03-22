import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="purchase"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="purchase-confirmation"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="purchase-success"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="sell"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="sell-confirmation"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="sell-success"
        options={screenConfigs.noHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
