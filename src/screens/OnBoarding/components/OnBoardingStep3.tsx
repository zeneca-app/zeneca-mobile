import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { z } from "zod";
import type { OnBoardingStepProps } from "../OnBoarding";

const OnBoardingStep3 = ({
  formValues,
  focused,
  handleChange,
  handleFocus,
  touchedFields,
  handleBlur,
  onValidationChange,
}: OnBoardingStepProps) => {
  const { t } = useTranslation();

  const validationSchema = z.object({
    address_street_1: z
      .string()
      .min(1, t("onBoarding.address_street_1_field.error")),
    address_city: z.string().min(1, t("onBoarding.address_city_field.error")),
  });

  const formErrors = validationSchema.safeParse(formValues);

  if (onValidationChange) {
    onValidationChange(formErrors.success);
  }

  const getError = (field: string) => {
    if (touchedFields[field]) {
      const error = formErrors.error?.errors.find(
        (e) => e.path[0] === field,
      )?.message;
      return error || "";
    }
    return "";
  };

  return (
    <>
      <InputWrapper
        label={t("onBoarding.address_street_1_field.label")}
        isFocused={
          focused === "address_street_1" || Boolean(formValues.address_street_1)
        }
        error={getError("address_street_1")}
        hint={t("onBoarding.address_street_1_field.hint")}
        required={true}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.address_street_1}
          onChangeText={(e) => handleChange("address_street_1", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("address_street_1")}
          onBlur={() => handleBlur("address_street_1")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.address_street_2_field.label")}
        isFocused={
          focused === "address_street_2" || Boolean(formValues.address_street_2)
        }
        error={getError("address_street_2")}
        hint={t("onBoarding.address_street_2_field.hint")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.address_street_2}
          onChangeText={(e) => handleChange("address_street_2", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("address_street_2")}
          onBlur={() => handleBlur("address_street_2")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.address_city_field.label")}
        isFocused={
          focused === "address_city" || Boolean(formValues.address_city)
        }
        error={getError("address_city")}
        hint={t("onBoarding.address_city_field.hint")}
        required={true}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.address_city}
          onChangeText={(e) => handleChange("address_city", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("address_city")}
          onBlur={() => handleBlur("address_city")}
        />
      </InputWrapper>
    </>
  );
};

OnBoardingStep3.displayName = "OnBoardingStep3";

export default OnBoardingStep3;
