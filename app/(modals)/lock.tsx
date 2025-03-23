import COLORS from '@/constants/colors';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
    id: 'pin-storage',
});

const Lock = () => {
    const { user } = useUser();
    const [firstName, setFirstName] = useState(user?.firstName);
    const [code, setCode] = useState<number[]>([]);
    const codeLength = Array(6).fill(0);
    const router = useRouter();

    const offset = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        };
    });

    const OFFSET = 20;
    const TIME = 80;

    const goToHome = () => {
        router.replace('/(main)/home');
    }

    const goToPinSetup = () => {
        router.replace('/(modals)/pin-setup');
    }

    const authenticateWithBiometrics = async () => {
        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access your account',
            fallbackLabel: 'Use PIN instead'
        });
        if (success) {
            goToHome();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    // Check for PIN and trigger biometric auth on mount
    useEffect(() => {
        const checkPinAndAuthenticate = async () => {
            const storedPin = storage.getString('user-pin');
            if (!storedPin) {
                goToPinSetup();
                return;
            }

            // Check if device supports biometric authentication
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
                authenticateWithBiometrics();
            }
        };

        checkPinAndAuthenticate();
    }, []);

    useEffect(() => {
        if (code.length === 6) {
            if (code.join('') === storage.getString('user-pin')) {
                goToHome();
                setCode([]);
            } else {
                offset.value = withSequence(
                    withTiming(-OFFSET, { duration: TIME / 2 }),
                    withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
                    withTiming(0, { duration: TIME / 2 })
                );
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setCode([]);
            }
        }
    }, [code]);

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    };

    const numberBackspace = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    };

    return (
        <SafeAreaView className="flex-1 bg-basic-black">
            <Stack.Screen options={{
                presentation: 'modal',
                animation: 'none',
                headerShown: false
            }} />
            <Text className="text-2xl font-bold mt-20 text-white self-center">
                Welcome back, {firstName}
            </Text>

            <Animated.View className="flex-row justify-center items-center gap-5 my-24" style={style}>
                {codeLength.map((_, index) => (
                    <View
                        key={index}
                        className={`w-5 h-5 rounded-full ${code[index] ? 'bg-electric-40' : 'bg-white'}`}
                    />
                ))}
            </Animated.View>

            <View className="mx-20 gap-[60px]">
                <View className="flex-row justify-between">
                    {[1, 2, 3].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-3xl text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row justify-between">
                    {[4, 5, 6].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-3xl text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row justify-between">
                    {[7, 8, 9].map((number) => (
                        <TouchableOpacity key={number} onPress={() => onNumberPress(number)}>
                            <Text className="text-3xl text-white">{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={authenticateWithBiometrics}>
                        <MaterialCommunityIcons name="face-recognition" size={26} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onNumberPress(0)}>
                        <Text className="text-3xl text-white">0</Text>
                    </TouchableOpacity>

                    <View className="min-w-[30px]">
                        {code.length > 0 && (
                            <TouchableOpacity onPress={numberBackspace}>
                                <Text className="text-3xl text-white">
                                    <MaterialCommunityIcons name="backspace-outline" size={26} color="white" />
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={goToPinSetup}>
                    <Text className="text-lg font-medium text-electric-40 self-center mt-5">
                        Reset your PIN
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Lock;