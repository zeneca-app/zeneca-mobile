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

const OnBoardingStep4 = ({
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
        label={t("onBoarding.address_subdivision_field.label")}
        isFocused={
          focused === "address_subdivision" ||
          Boolean(formValues.address_subdivision)
        }
        error={error?.address_subdivision}
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
        error={error?.address_postal_code}
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
