import { Stack } from 'expo-router';
import screenConfigs from '@/components/screenOptions';

export default function Layout() {
    return (
        <Stack
            screenOptions={screenConfigs.defaultHeader}
        >
            <Stack.Screen
                name="crypto"
                options={screenConfigs.noHeader}
            />
            <Stack.Screen
                name="bank"
                options={screenConfigs.noHeader}
            />
        </Stack>
    );
}

Layout.displayName = "Layout";
