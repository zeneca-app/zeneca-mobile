import { useEffect } from "react";
import InputWrapper from "@/components/Forms/InputWrapper";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { z } from "zod";
import { OnBoardingStepProps } from "./config";


const FullAddressStep = ({
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
        address_street_1: z
            .string()
            .min(5, t("onBoarding.full_address.address_street_1_field.error_required"))
            .max(50, t("onBoarding.full_address.address_street_1_field.error_invalid")),
        address_city: z.string()
            .min(1, t("onBoarding.full_address.address_city_field.error_required"))
            .max(20, t("onBoarding.full_address.address_city_field.error_invalid")),
        address_subdivision: z
            .string()
            .min(1, t("onBoarding.full_address.address_subdivision_field.error_required"))
            .max(20, t("onBoarding.full_address.address_subdivision_field.error_invalid")),
        address_postal_code: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true; // Optional field, empty is OK

                // Common postal code patterns by country
                const patterns = {
                    // Latin America
                    AR: /^[A-Z]?\d{4}[A-Z]{0,3}$/, // Argentina
                    BR: /^\d{5}-?\d{3}$/, // Brazil
                    CL: /^\d{7}$/, // Chile
                    CO: /^\d{6}$/, // Colombia
                    MX: /^\d{5}$/, // Mexico
                    PE: /^\d{5}$/, // Peru

                    // Other major regions
                    US: /^\d{5}(-\d{4})?$/, // USA
                    CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$/i, // Canada
                    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, // UK

                    // Generic pattern for other countries
                    DEFAULT: /^[A-Z0-9\s-]{3,10}$/i
                };

                // Try all patterns
                return Object.values(patterns).some(pattern => pattern.test(val));
            }, t("onBoarding.full_address.address_postal_code_field.error_invalid"))
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

    return (
        <>
            <InputWrapper
                label={t("onBoarding.full_address.address_street_1_field.label")}
                isFocused={
                    focused === "address_street_1" || Boolean(formValues.address_street_1)
                }
                error={getError("address_street_1")}
                required={true}
            >
                <TextInput
                    className="text-white text-body-m pb-4"
                    value={formValues.address_street_1}
                    onChangeText={(e) => handleChange("address_street_1", e)}
                    autoComplete="off"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("address_street_1")}
                    onBlur={() => handleBlur("address_street_1")}
                />
            </InputWrapper>
            <InputWrapper
                label={t("onBoarding.full_address.address_street_2_field.label")}
                isFocused={
                    focused === "address_street_2" || Boolean(formValues.address_street_2)
                }
                error={getError("address_street_2")}
                hint="Optional"
            >
                <TextInput
                    className="text-white text-body-m pb-4"
                    value={formValues.address_street_2}
                    onChangeText={(e) => handleChange("address_street_2", e)}
                    autoComplete="off"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("address_street_2")}
                    onBlur={() => handleBlur("address_street_2")}
                />
            </InputWrapper>
            <InputWrapper
                label={t("onBoarding.full_address.address_city_field.label")}
                isFocused={
                    focused === "address_city" || Boolean(formValues.address_city)
                }
                error={getError("address_city")}

                required={true}
            >
                <TextInput
                    className="text-white text-body-m pb-4"
                    value={formValues.address_city}
                    onChangeText={(e) => handleChange("address_city", e)}
                    autoComplete="off"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("address_city")}
                    onBlur={() => handleBlur("address_city")}
                />
            </InputWrapper>
            <InputWrapper
                label={t("onBoarding.full_address.address_subdivision_field.label")}
                isFocused={
                    focused === "address_subdivision" ||
                    Boolean(formValues.address_subdivision)
                }
                error={getError("address_subdivision")}
                required={true}
            >
                <TextInput
                    className="text-white text-body-m pb-4"
                    value={formValues.address_subdivision}
                    onChangeText={(e) => handleChange("address_subdivision", e)}
                    autoComplete="off"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("address_subdivision")}
                    onBlur={() => handleBlur("address_subdivision")}
                />
            </InputWrapper>
            <InputWrapper
                label={t("onBoarding.full_address.address_postal_code_field.label")}
                isFocused={
                    focused === "address_postal_code" ||
                    Boolean(formValues.address_postal_code)
                }
                hint="Optional"
                error={getError("address_postal_code")}

            >
                <TextInput
                    className="text-white text-body-m pb-4"
                    value={formValues.address_postal_code}
                    onChangeText={(e) => handleChange("address_postal_code", e)}
                    autoComplete="off"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("address_postal_code")}
                    onBlur={() => handleBlur("address_postal_code")}
                />
            </InputWrapper>
        </>
    );
};

FullAddressStep.displayName = "FullAddressStep";

export default FullAddressStep;