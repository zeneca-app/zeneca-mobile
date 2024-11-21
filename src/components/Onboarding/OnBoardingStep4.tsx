import { useState } from "react";
import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import { z } from "zod";
import { OnBoardingStepProps } from "./config";


const OnBoardingStep4 = ({
  formValues,
  focused,
  handleChange,
  handleFocus,
  touchedFields,
  handleBlur,
  onValidationChange,
}: OnBoardingStepProps) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const { t } = useTranslation();

  const validationSchema = z.object({
    birth_date: z
      .date()
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
        message: t("onBoarding.birth_date_field.error.min_age", { age: 18 }),
      }),
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

  const handleDobChange = (date: Date) => {
    handleChange("birth_date", new Date(date));
    setShowDateTimePicker(false);
  };

  return (
    <>
      <InputWrapper
        label={t("onBoarding.birth_date_field.label")}
        isFocused={
          focused === "birth_date" || Boolean(touchedFields?.birth_date)
        }
        error={getError("birth_date")}
        required={true}
      >
        <TouchableOpacity
          className="flex-row items-center justify-between pb-4"
          onPress={() => setShowDateTimePicker(!showDateTimePicker)}
        >
          <Text className="text-white text-body-s h-6">
            {Boolean(touchedFields?.birth_date) &&
              formValues.birth_date.toLocaleDateString()}
          </Text>
          <Feather
            name="calendar"
            size={20}
            color="white"
            style={{ marginTop: -16 }}
          />
        </TouchableOpacity>
        {/* <DateTimePickerModal
          isVisible={showDateTimePicker}
          mode="date"
          date={formValues.birth_date}
          onConfirm={handleDobChange}
          onCancel={() => setShowDateTimePicker(false)}
        /> */}
      </InputWrapper>
    </>
  );
};

OnBoardingStep4.displayName = "OnBoardingStep4";

export default OnBoardingStep4;