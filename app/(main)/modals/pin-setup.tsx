import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useState } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
    id: 'pin-storage',
});

const PinSetup = () => {
    const [step, setStep] = useState<'first' | 'confirm'>('first');
    const [firstPin, setFirstPin] = useState<number[]>([]);
    const [confirmPin, setConfirmPin] = useState<number[]>([]);
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

    const handlePinComplete = (pin: number[]) => {
        if (step === 'first') {
            setFirstPin(pin);
            setStep('confirm');
        } else {
            if (pin.join('') === firstPin.join('')) {
                // Store PIN
                storage.set('user-pin', pin.join(''));
                // Navigate to home
                router.replace('/(main)/home');
            } else {
                // Show error animation
                offset.value = withSequence(
                    withTiming(-OFFSET, { duration: TIME / 2 }),
                    withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
                    withTiming(0, { duration: TIME / 2 })
                );
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setConfirmPin([]);
            }
        }
    };

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const currentPin = step === 'first' ? firstPin : confirmPin;
        const newPin = [...currentPin, number];

        if (step === 'first') {
            setFirstPin(newPin);
        } else {
            setConfirmPin(newPin);
        }

        if (newPin.length === 6) {
            handlePinComplete(newPin);
        }
    };

    const numberBackspace = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (step === 'first') {
            setFirstPin(firstPin.slice(0, -1));
        } else {
            setConfirmPin(confirmPin.slice(0, -1));
        }
    };

    const currentPin = step === 'first' ? firstPin : confirmPin;

    return (
        <SafeAreaView className="flex-1 bg-basic-black">
            <Stack.Screen options={{
                presentation: 'modal',
                animation: 'none',
                headerShown: false
            }} />
            <Text className="text-2xl font-bold mt-20 text-white self-center">
                {step === 'first' ? 'Set your PIN' : 'Confirm your PIN'}
            </Text>

            <Animated.View className="flex-row justify-center items-center gap-5 my-24" style={style}>
                {codeLength.map((_, index) => (
                    <View
                        key={index}
                        className={`w-5 h-5 rounded-full ${currentPin[index] ? 'bg-electric-40' : 'bg-dark-gray-alpha-3'}`}
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
                    <View className="min-w-[30px]" />
                    <TouchableOpacity onPress={() => onNumberPress(0)}>
                        <Text className="text-3xl text-white">0</Text>
                    </TouchableOpacity>
                    <View className="min-w-[30px]">
                        {currentPin.length > 0 && (
                            <TouchableOpacity onPress={numberBackspace}>
                                <Text className="text-3xl text-white">
                                    <MaterialCommunityIcons name="backspace-outline" size={26} color="white" />
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PinSetup; 