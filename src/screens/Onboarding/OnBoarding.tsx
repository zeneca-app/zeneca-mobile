
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

const OnBoarding = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const initialFormValues = {
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        birth_date: new Date(),
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
    const [activeStep, setActiveStep] = useState<number>(0); //This is used to render the current step
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);
    //const [error, setError] = useState<string | undefined>(""); //This can be used to render errors from submit

    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    const handleSubmit = () => {
        setIsSubmitting(true);
        console.log("submitting form");
        setTimeout(() => {
            setIsSubmitting(false);
        }, 3000);
        console.log(formValues);
        navigation.navigate("KYCProvider", {
            country_code: formValues.country_code,
            full_address: {
                address_street_1: formValues.address_street_1,
                address_street_2: formValues.address_street_2,
                address_city: formValues.address_city,
                address_state: formValues.address_state,
                address_zip_code: formValues.address_postal_code,
                address_country: formValues.country_code,
            },
        });
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleSubmit();
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (activeStep === 0) return;
        setActiveStep((prev) => prev - 1);
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
                        <Text className="text-heading-s text-gray-10">
                            {t(`onBoarding.title`)}
                        </Text>
                        <Text className="text-body-s text-gray-40 font-light">
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
                                disabled={!isCurrentStepValid}
                            >
                                <Text className="text-body-m">
                                    {t("onBoarding.continue_button")}
                                </Text>
                            </Button>
                        )}

                    </Animated.View>
                </View>
            </LoggedLayout>
            {/* <FullScreenLoader visible={isSubmitting} /> */}
        </KeyboardAvoidingView>
    );
};

OnBoarding.displayName = "OnBoarding";

export default OnBoarding;