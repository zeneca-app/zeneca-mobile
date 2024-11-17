import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { z } from "zod";
import type { OnBoardingStepProps } from "../OnBoarding";

const OnBoardingStep4 = ({
  formValues,
  focused,
  handleChange,
  handleFocus,
  dirtyFields,
  handleBlur,
  onValidationChange,
}: OnBoardingStepProps) => {
  const { t } = useTranslation();

  const validationSchema = z.object({
    address_subdivision: z
      .string()
      .min(1, t("onBoarding.address_subdivision_field.error")),
    address_postal_code: z
      .string()
      .min(1, t("onBoarding.address_postal_code_field.error")),
  });

  const formErrors = validationSchema.safeParse(formValues);

  if (onValidationChange) {
    onValidationChange(formErrors.success);
  }

  const getError = (field: string) => {
    if (dirtyFields[field]) {
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
        label={t("onBoarding.address_subdivision_field.label")}
        isFocused={
          focused === "address_subdivision" ||
          Boolean(formValues.address_subdivision)
        }
        error={getError("address_subdivision")}
        hint={t("onBoarding.address_subdivision_field.hint")}
        required={true}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.address_subdivision}
          onChangeText={(e) => handleChange("address_subdivision", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("address_subdivision")}
          onBlur={() => handleBlur("address_subdivision")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.address_postal_code_field.label")}
        isFocused={
          focused === "address_postal_code" ||
          Boolean(formValues.address_postal_code)
        }
        error={getError("address_postal_code")}
        hint={t("onBoarding.address_postal_code_field.hint")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.address_postal_code}
          onChangeText={(e) => handleChange("address_postal_code", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("address_postal_code")}
          onBlur={() => handleBlur("address_postal_code")}
        />
      </InputWrapper>
    </>
  );
};

OnBoardingStep4.displayName = "OnBoardingStep4";

export default OnBoardingStep4;
