import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={screenConfigs.homeHeader} />

      <Stack.Screen
        name="deposit"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="explore"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="profile"
        options={{
          ...screenConfigs.profileScreen,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="asset"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="order-history"
        options={screenConfigs.defaultHeader}
      />
    </Stack>
  );
}

Layout.displayName = "Layout";
