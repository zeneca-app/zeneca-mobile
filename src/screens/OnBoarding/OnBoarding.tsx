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

export type OnBoardingStepProps = {
  formValues: { country_code?: string; tax_id_number?: string };
  focused: string | boolean;
  handleChange: (field: string, value: string) => void;
  handleFocus: (field: string) => void;
  handleBlur: (field: string) => void;
  onValidationChange: (isValid: boolean) => void;
  dirtyFields: { [key: string]: boolean };
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

  const [formValues, setFormValues] = useState(initialFormValues);
  const [error, setError] = useState<Partial<FormValues>>({});
  const [focused, setFocused] = useState<keyof FormValues | null>(null);
  const [dirtyFields, setDirtyFields] = useState({});
  const [activeStep, setActiveStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

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

  const handleChange = (fieldName: string, value: string) => {
    markFieldDirty(fieldName);
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const markFieldDirty = (fieldName: string) => {
    if (!dirtyFields[fieldName]) {
      setDirtyFields((prev) => ({ ...prev, [fieldName]: true }));
    }
    return;
  };

  const isFieldDirty = (fieldName: string) => {
    return dirtyFields[fieldName] ? true : false;
  };

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    return console.log(errors);
  };

  const handleFocus = (fieldName) => {
    setFocused(fieldName);
  };

  const handleBlur = (fieldName) => {
    if (fieldName === focused) setFocused(null);
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
                error={error}
                focused={focused}
                dirtyFields={dirtyFields}
                handleChange={handleChange}
                onError={onError}
                markFieldDirty={markFieldDirty}
                isFieldDirty={isFieldDirty}
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
