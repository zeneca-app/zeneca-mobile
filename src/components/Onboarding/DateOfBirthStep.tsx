import { useState, useEffect } from "react";
import { z } from "zod";
import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { OnBoardingStepProps } from "./config";



const DateOfBirthStep = ({
  formValues,
  focused,
  handleChange,
  handleFocus,
  touchedFields,
  handleBlur,
  onValidationChange
}: OnBoardingStepProps) => {
  const { t } = useTranslation();

  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [isDateValid, setIsDateValid] = useState(false);

  const validationSchema = z.object({
    birth_date: z
      .date()
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
        message: t("onBoarding.birth_date_field.error.min_age", { age: 18 }),
      }),
  });

  const formErrors = validationSchema.safeParse(formValues);

  useEffect(() => {
    console.log(formValues);
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


  useEffect(() => {
    if (isDateValid) {
      const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      handleChange("birth_date", date);
    }
  }, [month, day, year, isDateValid]);

  useEffect(() => {
    const formData = { month, day, year };
    const validation = validationSchema.safeParse(formData);
    if (onValidationChange) {
      onValidationChange(validation.success);
    }
  }, [month, day, year]);

  const handleInputChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    switch (field) {
      case 'month':
        if (numericValue.length <= 2) {
          const num = parseInt(numericValue);
          if (numericValue === '' || (num > 0 && num <= 12)) {
            setMonth(numericValue);
          }
        }
        break;
      case 'day':
        if (numericValue.length <= 2) {
          const num = parseInt(numericValue);
          if (numericValue === '' || (num > 0 && num <= 31)) {
            setDay(numericValue);
          }
        }
        break;
      case 'year':
        if (numericValue.length <= 4) {
          setYear(numericValue);
          // Only validate if year has exactly 4 digits
          if (numericValue.length === 4) {
            const yearNum = parseInt(numericValue);
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - 100;

            if (yearNum > 0 && yearNum <= currentYear && yearNum >= minYear) {
              setIsDateValid(true);
            } else {
              setIsDateValid(false);
              if (onValidationChange) {
                onValidationChange(false);
              }
            }
          } else if (onValidationChange) {
            // If year is partially filled or empty, set validation to false
            onValidationChange(false);
            setIsDateValid(false);
          }
        }
        break;
    }
  };

  return (
    <>
      <InputWrapper
        label={""}
        isFocused={focused === "birth_date" || Boolean(touchedFields?.birth_date)}
        error={getError("birth_date")}
        required={true}
      >
        <View className="flex-row justify-between space-x-4 pb-1.5">
          <View className="flex-1 rounded-lg px-4 py-2">
            <Text className="text-gray-400 text-s mb-1">{t("onBoarding.birth_date_field.day")}</Text>
            <TextInput
              className="text-white text-lg"
              keyboardType="number-pad"
              maxLength={2}
              placeholder="DD"
              placeholderTextColor="#666"
              value={day}
              onChangeText={(value) => handleInputChange('day', value)}
            />
          </View>
          <View className="flex-1 rounded-lg px-4 py-2">
            <Text className="text-gray-400 text-s mb-1">{t("onBoarding.birth_date_field.month")}</Text>
            <TextInput
              className="text-white text-lg"
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor="#666"
              value={month}
              onChangeText={(value) => handleInputChange('month', value)}
            />
          </View>
          <View className="flex-1  rounded-lg px-4 py-2">
            <Text className="text-gray-400 text-s mb-1">{t("onBoarding.birth_date_field.year")}</Text>
            <TextInput
              className="text-white text-lg"
              keyboardType="number-pad"
              maxLength={4}
              placeholder="YYYY"
              placeholderTextColor="#666"
              value={year}
              onChangeText={(value) => handleInputChange('year', value)}
            />
          </View>
        </View>
      </InputWrapper>
    </>
  );
};

DateOfBirthStep.displayName = "DateOfBirthStep";

export default DateOfBirthStep;