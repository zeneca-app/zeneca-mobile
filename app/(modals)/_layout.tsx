import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';


export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="lock"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="pin-setup"
        options={screenConfigs.noHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
