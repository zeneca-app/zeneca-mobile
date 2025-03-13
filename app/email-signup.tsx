import React, { useState } from "react";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import LoggedLayout from "@/components/LoggedLayout";
import Button from "@/components/Button";

const EmailSignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Validate email
    const emailValid = validateEmail(email);
    setIsEmailValid(emailValid);

    if (!emailValid) return;

    try {
      setIsLoading(true);

      await signUp.create({
        emailAddress: email,
      });

      // Start the email verification process
      await signUp.prepareEmailAddressVerification();

      // Navigate to verification screen
      router.push("/verify/[email]");
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-basic-black"
    >
      <LoggedLayout>
        <SafeAreaView className="flex-1">
          <View className="p-5">
            <Text className="text-[32px] text-white mb-5 font-Manrope_500Medium">
              {t("loginWithEmail.title")}
            </Text>

            {/* Email Input */}
            <View className="mt-5">
              <Text className="text-dark-content-30 text-sm mb-1 font-Manrope_300Light">
                {t("loginWithEmail.emailLabel")}
              </Text>
              <TextInput
                className="text-white text-base py-2"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsEmailValid(true);
                }}
                autoComplete="off"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View
                className={`h-[1px] bg-dark-border-80 mt-2 ${!isEmailValid && "border-semantic-danger"
                  }`}
              />
              {!isEmailValid && (
                <Text className="text-semantic-danger text-xs mt-1 font-Manrope_300Light">
                  {t("loginWithEmail.errorText")}
                </Text>
              )}
            </View>
          </View>

          {/* Sign Up Button */}
          <View className="p-5 mt-auto">
            <Button
              disabled={!email || !isLoaded || isLoading}
              onPress={onSignUpPress}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="text-lg text-basic-black font-Manrope_500Medium">
                  {t("loginWithEmail.continueButton")}
                </Text>
              )}
            </Button>
          </View>
        </SafeAreaView>
      </LoggedLayout>
    </KeyboardAvoidingView>
  );
};

export default EmailSignUp; 