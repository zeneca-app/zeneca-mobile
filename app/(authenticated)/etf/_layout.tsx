import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';



export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="etf/detail"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="etf/purchase/purchase"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="etf/purchase/confirm"
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="etf/purchase/success"
        options={screenConfigs.noHeader}
      />
  
    </Stack>
  );
}

Layout.displayName = "Layout";
