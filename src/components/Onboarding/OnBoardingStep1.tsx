import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { z } from "zod";
import { OnBoardingStepProps } from "./config";

const OnBoardingStep1 = ({
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
    names: z.string().min(1, t("onBoarding.first_name_field.error")),
    last_names: z.string().min(1, t("onBoarding.last_name_field.error")),
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
        label={t("onBoarding.first_name_field.label")}
        isFocused={focused === "names" || Boolean(formValues.names)}
        error={getError("names")}
        required={true}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.names}
          onChangeText={(e) => handleChange("names", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("first_name")}
          onBlur={() => handleBlur("first_name")}
        />
      </InputWrapper>

      <InputWrapper
        label={t("onBoarding.last_name_field.label")}
        isFocused={
          focused === "last_names" || Boolean(formValues.last_names)
        }
        error={getError("last_names")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.last_names}
          onChangeText={(e) => handleChange("last_names", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("last_names")}
          onBlur={() => handleBlur("last_names")}
        />
      </InputWrapper>

    </>
  );
};

OnBoardingStep1.displayName = "OnBoardingStep1";

export default OnBoardingStep1;