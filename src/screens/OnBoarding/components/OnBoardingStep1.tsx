import InputWrapper from "@/components/Forms/InputWrapper";
import Text from "@/components/Text";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const OnBoardingStep1 = ({
  error,
  formValues,
  focused,
  handleChange,
  handleFocus,
  handleValidation,
  handleBlur,
}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const { t } = useTranslation();

  const handleDobChange = (date: Date) => {
    handleChange("dob", new Date(date));
    setShowDateTimePicker(false);
  };

  return (
    <>
      <InputWrapper
        label={t("onBoarding.first_name_field.label")}
        isFocused={focused === "first_name" || Boolean(formValues.first_name)}
        error={error?.first_name}
        hint={t("onBoarding.first_name_field.hint")}
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
          autoCapitalize="none"
          onFocus={() => handleFocus("first_name")}
          onBlur={() => handleBlur("first_name")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.middle_name_field.label")}
        isFocused={focused === "middle_name" || Boolean(formValues.middle_name)}
        error={error?.middle_name}
        hint={t("onBoarding.middle_name_field.hint")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.middle_name}
          onChangeText={(e) => handleChange("middle_name", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="middle_name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("middle_name")}
          onBlur={() => handleBlur("middle_name")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.lastname_field.label")}
        isFocused={focused === "lastname" || Boolean(formValues.lastname)}
        error={error?.lastname}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.lastname}
          onChangeText={(e) => handleChange("lastname", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("lastname")}
          onBlur={() => handleBlur("lastname")}
        />
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.birth_date_field.label")}
        isFocused={focused === "birth_date" || Boolean(formValues.birth_date)}
        error={error?.birth_date}
        required={true}
      >
        <TouchableOpacity
          className="flex-row items-center justify-between pb-4"
          onPress={() => setShowDateTimePicker(!showDateTimePicker)}
        >
          <Text className="text-white text-body-s h-6">
            {formValues.birth_date.toLocaleDateString()}
          </Text>
          <Feather
            name="calendar"
            size={20}
            color="white"
            style={{ marginTop: -16 }}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDateTimePicker}
          mode="date"
          date={formValues.birth_date}
          onConfirm={handleDobChange}
          onCancel={() => setShowDateTimePicker(false)}
        />
      </InputWrapper>
    </>
  );
};

OnBoardingStep1.displayName = "OnBoardingStep1";

export default OnBoardingStep1;
