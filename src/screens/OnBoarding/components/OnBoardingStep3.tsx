import BottomSheet, {
  BottomSheetButton,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import InputWrapper from "@/components/Forms/InputWrapper";
import Flag from "@/components/RoundFlags";
import Text from "@/components/Text";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { continents, countries, languages } from "countries-list";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const OnBoardingStep3 = ({
  error,
  formValues,
  focused,
  handleChange,
  handleFocus,
  handleValidation,
  handleBlur,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <InputWrapper
        label={t("onBoarding.address_street_1_field.label")}
        isFocused={
          focused === "address_street_1" || Boolean(formValues.address_street_1)
        }
        error={error?.address_street_1}
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
        error={error?.address_street_2}
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
        error={error?.address_city}
        hint={t("onBoarding.address_city_field.hint")}
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
