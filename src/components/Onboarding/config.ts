import OnBoardingStep1 from "@/components/Onboarding/OnBoardingStep1";
import OnBoardingStep2 from "@/components/Onboarding/OnBoardingStep2";
import OnBoardingStep3 from "@/components/Onboarding/OnBoardingStep3";
import OnBoardingStep4 from "@/components/Onboarding/OnBoardingStep4";

export const steps = [
  OnBoardingStep1,
  OnBoardingStep2,
  OnBoardingStep3,
  OnBoardingStep4,
];

export type FormValues = {
  names: string;
  last_names: string;
  birth_date: Date;
  country_code: string;
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
