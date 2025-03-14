import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="crypto"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="bank"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}

Layout.displayName = "Layout";
