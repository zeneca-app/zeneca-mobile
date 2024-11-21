import { useEffect } from "react";
import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import InputWrapper from "@/components/Forms/InputWrapper";
import { Country } from "country-state-city";

import Text from "@/components/Text";
import {
    COUNTRIES,
    COUNTRIES_LIST,
    LATIN_AMERICA_FLAGS,
} from "@/constants/countries";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { OnBoardingStepProps } from "./config";


const CountryStep = ({
    formValues,
    focused,
    handleChange,
    handleFocus,
    touchedFields,
    handleBlur,
    onValidationChange,
}: OnBoardingStepProps) => {
    const { t } = useTranslation();

    const countriesModal = useRef<BottomSheetModal>(null);

    const validationSchema = z.object({
        country_code: z.string().min(1, t("onBoarding.country_code_field.error")),
    });

    const formErrors = validationSchema.safeParse(formValues);

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

    const handleShowCountries = () => {
        countriesModal.current?.present();
    };

    const handleHideCountries = () => {
        countriesModal.current?.dismiss();
    };

    const handleCountryChange = (value: string) => {
        console.log(value);
        handleChange("country_code", value);
        handleHideCountries();
    };

    const renderCountryItem = (item: { isoCode: string; name: string }) => {
        return (
            <TouchableOpacity
                onPress={() => handleCountryChange(item.isoCode)}
                className="flex-row items-center justify-start py-6 px-8 gap-4"
            >
                <Text className="text-white text-body-s">
                    {LATIN_AMERICA_FLAGS[item.isoCode]}
                </Text>
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

                leftSlot={
                    Boolean(formValues.country_code) ? (
                        <Text className="text-white text-body-m">
                            {LATIN_AMERICA_FLAGS[formValues.country_code]}
                        </Text>
                    ) : null
                }
            >
                <TouchableOpacity
                    className="flex w-full flex-row items-center justify-start pb-4"
                    onPress={handleShowCountries}
                >
                    <Text className="text-white flex-1 text-body-s">
                        {
                            Country.getCountryByCode(formValues.country_code)?.name
                        }
                    </Text>
                    <View>
                        <Ionicons name="chevron-down" size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </InputWrapper>

            <BottomSheet ref={countriesModal}>
                <BottomSheetFlatList
                    data={COUNTRIES_LIST}
                    keyExtractor={(item) => item.isoCode}
                    renderItem={({ item }) => renderCountryItem(item)}
                />
            </BottomSheet>
        </>
    );
};

CountryStep.displayName = "CountryStep";

export default CountryStep;