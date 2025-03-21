import screenConfigs from '@/components/screenOptions';
import { Stack } from 'expo-router';

export default function KYCLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="steps"
        options={screenConfigs.noHeader}
      />

      <Stack.Screen
        name="preview"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="provider"
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="success"
        options={screenConfigs.noHeader}
      />
    </Stack>
  );
} 