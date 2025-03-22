import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
    id: 'inactivty-storage',
});

export const UserInactivityProvider = ({ children }: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        // Check if app was killed while in background
        const wasInBackground = storage.getBoolean('was_in_background');
        if (wasInBackground && isSignedIn) {
            router.replace('/(main)/modals/lock');
            storage.set('was_in_background', false);
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        console.log('🚀 ~ handleAppStateChange ~ nextAppState', nextAppState);

        if (nextAppState === 'background') {
            if (isSignedIn) {
                storage.set('was_in_background', true);
                router.replace('/(main)/modals/lock');
            }
        } else if (nextAppState === 'active') {
            storage.set('was_in_background', false);
        }

        appState.current = nextAppState;
    };

    return children;
};