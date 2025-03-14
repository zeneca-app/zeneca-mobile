import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="etf/detail"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="etf/purchase/purchase"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="etf/purchase/confirm"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="etf/purchase/success"
        options={{
          headerShown: false
        }}
      />
      
    </Stack>
  );
}

Layout.displayName = "Layout";
