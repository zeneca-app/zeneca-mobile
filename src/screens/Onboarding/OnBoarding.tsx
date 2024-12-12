
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import LoggedLayout, { LeftNav } from "@/components/LoggedLayout";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, View, Keyboard, TouchableOpacity, ScrollView } from "react-native";
import { FormValues, steps } from "@/components/Onboarding/config";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    withTiming,
    withSpring,
    SlideInRight,
    LinearTransition,
    SlideOutRight,
    SlideInLeft,
    SlideOutLeft
} from 'react-native-reanimated';
import { useOnboardingMutations } from "@/components/Onboarding/useOnboardingMutations";
import { useUserStore } from "@/storage/";


export enum OnboardingStatus {
    NAMES_STEP = "NAMES_STEP",
    COUNTRY_STEP = "COUNTRY_STEP",
    ADDRESS_STEP = "ADDRESS_STEP",
    KYC_PROVIDER_STEP = "KYC_PROVIDER_STEP",
}

const STEPS = {
    [OnboardingStatus.NAMES_STEP]: 0,
    [OnboardingStatus.COUNTRY_STEP]: 1,
    [OnboardingStatus.ADDRESS_STEP]: 2,
    [OnboardingStatus.KYC_PROVIDER_STEP]: 3,
} as const;

const getNextStep = (currentStatus: OnboardingStatus | null): OnboardingStatus => {
    switch (currentStatus) {
        case OnboardingStatus.NAMES_STEP:
            return OnboardingStatus.COUNTRY_STEP;
        case OnboardingStatus.COUNTRY_STEP:
            return OnboardingStatus.ADDRESS_STEP;
        case OnboardingStatus.ADDRESS_STEP:
            return OnboardingStatus.KYC_PROVIDER_STEP;
        default:
            return OnboardingStatus.NAMES_STEP;
    }
};

const OnBoarding = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const { user } = useUserStore();

    const initialFormValues = {
        first_name: "",
        last_name: "",
        country_code: "",
        address_street_1: "",
        address_street_2: "",
        address_city: "",
        address_state: "",
        address_postal_code: "",
    };

    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
    const [focused, setFocused] = useState<keyof FormValues | null>(null);
    const [touchedFields, setTouchedFields] = useState<
        Partial<Record<keyof FormValues, boolean>>
    >({});

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);

    const currentStatus = user?.account?.ob_status as OnboardingStatus;
    const nextStep = STEPS[getNextStep(currentStatus)];
    const [activeStep, setActiveStep] = useState<number>(nextStep);

    const { mutations, isPending: isOnboardingPending } = useOnboardingMutations(() => {
        setActiveStep((prev) => prev + 1);
    });

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    const handleNext = () => {

        if (activeStep === STEPS[OnboardingStatus.NAMES_STEP]) {
            mutations.updateNamesStep({
                body: {
                    name: formValues.first_name,
                    last_name: formValues.last_name,
                }
            });
        }

        if (activeStep === STEPS[OnboardingStatus.COUNTRY_STEP]) {
            mutations.updateCountryStep({
                body: {
                    country: formValues.country_code
                }
            });
        }

        if (activeStep === STEPS[OnboardingStatus.ADDRESS_STEP]) {
            mutations.updateAddressStep({
                body: {
                    street_line_1: formValues.address_street_1,
                    city: formValues.address_city,
                    state: formValues.address_state,
                    postal_code: formValues.address_postal_code || "00000",
                }
            });
        }
    };

    const handleBack = () => {
        if (activeStep === STEPS[OnboardingStatus.NAMES_STEP]) {
            navigation.goBack();
            return;
        }
    };

    const handleChange = (fieldName: keyof FormValues, value: string | Date) => {
        markFieldDirty(fieldName);
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    };

    const markFieldDirty = (fieldName: keyof FormValues) => {
        if (!touchedFields[fieldName]) {
            setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
        }
        return;
    };

    const handleFocus = (field: string) => {
        setFocused(field as keyof FormValues);
    };

    const handleBlur = (field: string) => {
        if (field === focused) setFocused(null);
    };


    const Step = steps[activeStep];

    const progress = activeStep / steps.length;
    const isPending = isOnboardingPending;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <LoggedLayout
                navLeft={<LeftNav onPress={handleBack} />}
                navCenter={<ProgressBar progress={progress} />}
            >
                <ScrollView className="flex-1">
                    <View className="flex-1 justify-center items-stretch gap-l px-layout">
                        <Text className="heading-s text-gray-10">
                            {t(`onBoarding.title`)}
                        </Text>
                        <Text className="body-s text-gray-40 font-light">
                            {t(`onBoarding.steps.step_${activeStep + 1}.subtitle`)}
                        </Text>
                        <View className="flex-1 justify-start items-stretch gap">
                            <Step
                                formValues={formValues}
                                focused={focused}
                                touchedFields={touchedFields}
                                handleChange={handleChange}
                                handleFocus={handleFocus}
                                handleBlur={handleBlur}
                                onValidationChange={setIsCurrentStepValid}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View className="flex justify-center items-stretch gap-l px-layout pb-layout">
                    <Animated.View
                        layout={LinearTransition
                            .springify()
                            .mass(1.5)
                            .damping(25)
                            .duration(500)
                        }
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        className={`flex ${keyboardVisible ? 'flex-row justify-end' : ''}`}
                    >
                        {keyboardVisible ? (
                            <TouchableOpacity
                                onPress={() => Keyboard.dismiss()}
                                className="bg-electric-50 rounded-full w-[48px] h-[48px] items-center justify-center shadow-md"
                            >
                                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                            </TouchableOpacity>

                        ) : (
                            <Button
                                onPress={handleNext}
                                disabled={!isCurrentStepValid || isPending}
                            >
                                <Text className="body-m">
                                    {t("onBoarding.continue_button")}
                                </Text>
                            </Button>
                        )}

                    </Animated.View>
                </View>
            </LoggedLayout>
        </KeyboardAvoidingView>
    );
};

OnBoarding.displayName = "OnBoarding";

export default OnBoarding;