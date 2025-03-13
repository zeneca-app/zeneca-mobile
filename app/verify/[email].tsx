import React, { useEffect, useState } from "react";
import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import LoginButton from "@/components/login/button";


const VerifyEmail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { email, signin } = useLocalSearchParams<{ email: string; signin: string }>();
  const [code, setCode] = useState('');
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      if (signin === 'true') {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      await signUp!.attemptEmailAddressVerification({
        code,
      });
      console.log('signUp!.createdSessionId', signUp!.createdSessionId);
      await setActive!({ session: signUp!.createdSessionId });
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }
    }
  };

  const verifySignIn = async () => {
    try {
      await signIn!.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });
      await setActive!({ session: signIn!.createdSessionId });
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-basic-black"
    >
      <View className="p-layout">
        <Text className="heading-s text-dark-content-white mb-layout-s">
          {t("emailOtpValidation.title")}
        </Text>
        <Text className="caption-xl text-gray-50 mb-[30px]">
          {t("emailOtpValidation.subtitle")}
        </Text>
        <Text>
          Code sent to {email} unless you already have an account
        </Text>
        <View className="mb-[30px]">
          <TextInput
            className="w-full h-[50px] border-0 border-b border-[#313036] bg-transparent text-white text-2xl text-center tracking-[8px]"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#313036"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
      <View className="p-layout mt-auto">
        <LoginButton
          icon="checkmark"
          text={t("emailOtpValidation.continueButton")}
          onPress={setCode}
          isPrimary={true}
          isLoading={isVerifying}
          disabled={code.length !== 6 || isVerifying || !isLoaded}
        />
      </View>


    </KeyboardAvoidingView>
  );
};

export default VerifyEmail;