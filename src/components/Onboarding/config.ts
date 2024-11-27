import CountryStep from "@/components/Onboarding/CountryStep";
import DateOfBirthStep from "@/components/Onboarding/DateOfBirthStep";
import FullAddressStep from "@/components/Onboarding/FullAddressStep";
import FullNameStep from "@/components/Onboarding/FullNameStep";

export const steps = [
  FullNameStep,
  CountryStep,
  FullAddressStep,
];

export type FormValues = {
  first_name: string;
  last_name: string;
  country_code: string;
  address_street_1: string;
  address_street_2: string;
  address_city: string;
  address_state: string;
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
