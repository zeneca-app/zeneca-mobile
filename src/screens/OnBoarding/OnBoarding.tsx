import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import LoggedLayout, { LeftNav } from "@/components/LoggedLayout";
import ProgressBar from "@/components/ProgressBar";
import Text from "@/components/Text";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import OnBoardingStep1 from "./components/OnBoardingStep1";
import OnBoardingStep2 from "./components/OnBoardingStep2";
import OnBoardingStep3 from "./components/OnBoardingStep3";
import OnBoardingStep4 from "./components/OnBoardingStep4";

const steps = [
  OnBoardingStep1,
  OnBoardingStep2,
  OnBoardingStep3,
  OnBoardingStep4,
];

type FormValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: Date;
  country_code: string;
  tax_id_number: string;
  address_street_1: string;
  address_street_2: string;
  address_city: string;
  address_subdivision: string;
  address_postal_code: string;
};

export type OnBoardingStepProps = {
  formValues: FormValues;
  focused: string | boolean | null;
  handleChange: (field: keyof FormValues, value: string | Date) => void;
  handleFocus: (field: string) => void;
  handleBlur: (field: string) => void;
  onValidationChange: (isValid: boolean) => void;
  touchedFields: { [key: string]: boolean };
};

const OnBoarding = () => {
  const { t } = useTranslation();

  const initialFormValues = {
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: new Date(),
    country_code: "",
    tax_id_number: "",
    address_street_1: "",
    address_street_2: "",
    address_city: "",
    address_subdivision: "",
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    console.log("submitting form");
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
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
              {t("onBoarding.title")}
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
        <View className="flex justify-center items-stretch gap-l px-layout">
          <Button
            className="bg-primary-500 text-white"
            onPress={handleNext}
            disabled={!isCurrentStepValid}
          >
            <Text className="text-body-m">
              {t("onBoarding.continue_button")}
            </Text>
          </Button>
        </View>
      </LoggedLayout>
      <FullScreenLoader visible={isSubmitting} />
    </KeyboardAvoidingView>
  );
};

OnBoarding.displayName = "OnBoarding";

export default OnBoarding;
