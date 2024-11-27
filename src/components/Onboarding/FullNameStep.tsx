import { useEffect } from "react";
import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { z } from "zod";
import { OnBoardingStepProps } from "./config";


const FullNameStep = ({
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
    first_name: z.string().min(1, t("onBoarding.first_name_field.error_required")),
    last_name: z.string().min(1, t("onBoarding.last_name_field.error_required")),
  });

  const formErrors = validationSchema.safeParse(formValues);

  // Move validation to useEffect
  useEffect(() => {
    const formErrors = validationSchema.safeParse(formValues);
    if (onValidationChange) {
      onValidationChange(formErrors.success);
    }
  }, [formValues, onValidationChange]);

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
        label={t("onBoarding.first_name_field.label")}
        isFocused={focused === "first_name" || Boolean(formValues.first_name)}
        error={getError("first_name")}
        required={true}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.first_name}
          onChangeText={(e) => handleChange("first_name", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="words"
          onFocus={() => handleFocus("first_name")}
          onBlur={() => handleBlur("first_name")}
        />
      </InputWrapper>

      <InputWrapper
        label={t("onBoarding.last_name_field.label")}
        isFocused={
          focused === "last_name" || Boolean(formValues.last_name)
        }
        required={true}
        error={getError("last_name")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.last_name}
          onChangeText={(e) => handleChange("last_name", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="words"
          onFocus={() => handleFocus("last_name")}
          onBlur={() => handleBlur("last_name")}
        />
      </InputWrapper>
    </>
  );
};

FullNameStep.displayName = "FullNameStep";

export default FullNameStep;