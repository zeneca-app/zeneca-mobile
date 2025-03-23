import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={screenConfigs.homeHeader} />
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
