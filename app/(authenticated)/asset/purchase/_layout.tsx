import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';


export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="purchase"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="confirm"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="success"
        options={screenConfigs.noHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
