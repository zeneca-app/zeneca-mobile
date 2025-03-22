import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={screenConfigs.homeHeader} />
      <Stack.Screen
        name="(finance)"
        options={screenConfigs.noHeader}
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
    </Stack>
  );
}

Layout.displayName = "Layout";
