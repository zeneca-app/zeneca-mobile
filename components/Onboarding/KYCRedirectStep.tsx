import { useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { OnBoardingStepProps } from './config';
import { View } from 'react-native';

const KYCRedirectStep = ({ formValues, onValidationChange }: OnBoardingStepProps) => {
    const navigation = useNavigation();

    useEffect(() => {
        // Set validation to true so the next button is enabled
        onValidationChange(true);
    }, []);

    useEffect(() => {
        // Automatically navigate to KYC provider when this step is mounted
        navigation.navigate("KYCProvider", {
            country_code: formValues.country_code,
            full_address: {
                address_street_1: formValues.address_street_1,
                address_street_2: formValues.address_street_2,
                address_city: formValues.address_city,
                address_state: formValues.address_state,
                address_zip_code: formValues.address_postal_code || "00000",
                address_country: formValues.country_code,
            },
        });
    }, []);

    return <View />; // Empty view since we're redirecting
};

export default KYCRedirectStep;