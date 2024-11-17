import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
} from "@/components/BottomSheet/BottomSheet";
import InputWrapper from "@/components/Forms/InputWrapper";
import Flag from "@/components/RoundFlags";
import Text from "@/components/Text";
import { COUNTRIES, COUNTRIES_LIST } from "@/constants/countries";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import type { OnBoardingStepProps } from "../OnBoarding";

const OnBoardingStep2 = ({
  formValues,
  focused,
  handleChange,
  handleFocus,
  dirtyFields,
  handleBlur,
  onValidationChange,
}: OnBoardingStepProps) => {
  const { t } = useTranslation();

  const countriesModal = useRef<BottomSheetModal>(null);

  const validationSchema = z.object({
    country_code: z.string().min(1, t("onBoarding.country_code_field.error")),
    tax_id_number: z.string().min(1, t("onBoarding.tax_id_number_field.error")),
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

  const handleShowCountries = () => {
    countriesModal.current?.present();
  };

  const handleHideCountries = () => {
    countriesModal.current?.dismiss();
  };

  const handleCountryChange = (value: string) => {
    handleChange("country_code", value);
    handleHideCountries();
  };

  const renderCountryItem = (item: { code: string; name: string }) => {
    return (
      <TouchableOpacity
        onPress={() => handleCountryChange(item.code)}
        className="flex-row items-center justify-start py-4 px-4 gap"
      >
        <Flag code={item.code} className="h-10 w-10" />
        <Text className="text-white text-body-s">{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <InputWrapper
        label={t("onBoarding.country_field.label")}
        isFocused={Boolean(formValues.country_code)}
        error={getError("country_code")}
        hint={t("onBoarding.country_field.hint")}
        leftSlot={
          Boolean(formValues.country_code) ? (
            <View className="w-12 h-12">
              <Flag code={formValues.country_code} className="h-12 w-12" />
            </View>
          ) : null
        }
      >
        <TouchableOpacity
          className="flex w-full flex-row items-center justify-start pb-4"
          onPress={handleShowCountries}
        >
          <Text className="text-white flex-1 text-body-s">
            {COUNTRIES?.[formValues.country_code]?.name}
          </Text>
          <View>
            <Ionicons name="chevron-down" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </InputWrapper>
      <InputWrapper
        label={t("onBoarding.tax_id_number_field.label")}
        isFocused={
          focused === "tax_id_number" || Boolean(formValues.tax_id_number)
        }
        error={getError("tax_id_number")}
      >
        <TextInput
          className="text-white text-body-m pb-4"
          value={formValues.tax_id_number}
          onChangeText={(e) => handleChange("tax_id_number", e)}
          autoComplete="off"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType="name-phone-pad"
          autoCapitalize="none"
          onFocus={() => handleFocus("tax_id_number")}
          onBlur={() => handleBlur("tax_id_number")}
        />
      </InputWrapper>
      <BottomSheet ref={countriesModal}>
        <BottomSheetFlatList
          data={COUNTRIES_LIST}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => renderCountryItem(item)}
        />
      </BottomSheet>
    </>
  );
};

OnBoardingStep2.displayName = "OnBoardingStep2";

export default OnBoardingStep2;
