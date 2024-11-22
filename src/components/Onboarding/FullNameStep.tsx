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
    middle_name: z.string().optional(),
    last_name: z.string().min(1, t("onBoarding.last_name_field.error_required")),
    second_last_name: z.string().optional(),
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
        label={t("onBoarding.middle_name_field.label")}
        isFocused={focused === "middle_name" || Boolean(formValues.middle_name)}
        error={getError("middle_name")}
        required={false}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.middle_name}
          onChangeText={(e) => handleChange("middle_name", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="words"
          onFocus={() => handleFocus("middle_name")}
          onBlur={() => handleBlur("middle_name")}
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
      <InputWrapper
        required={false}
        label={t("onBoarding.second_last_name_field.label")}
        isFocused={
          focused === "second_last_name" || Boolean(formValues.second_last_name)
        }
        error={getError("second_last_name")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.second_last_name}
          onChangeText={(e) => handleChange("second_last_name", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="words"
          onFocus={() => handleFocus("second_last_name")}
          onBlur={() => handleBlur("second_last_name")}
        />
      </InputWrapper>

    </>
  );
};

FullNameStep.displayName = "FullNameStep";

export default FullNameStep;