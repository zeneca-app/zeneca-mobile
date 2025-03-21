import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  View,
  Alert,
} from "react-native";
import { useSignUp, isClerkAPIResponseError, useSSO, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import LoggedLayout from "@/components/LoggedLayout";
import LoginButton from "@/components/login/button";
import { useLocalCredentials } from '@clerk/clerk-expo/local-credentials'
import * as AuthSession from 'expo-auth-session'
import { loginLoginOrCreate } from "@/client";
import { loginLoginOrCreateMutation } from "@/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";


const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoaded } = useSignUp();
  const { startSSOFlow } = useSSO()
  const { user } = useUser()

  const { hasCredentials, setCredentials, authenticate, biometricType } = useLocalCredentials()

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { mutate: loginOrCreate, isPending } = useMutation({
    ...loginLoginOrCreateMutation(),
    onSuccess: (data) => {
      console.log('loginOrCreate', data);
    },
  });

  const onEmailSignUpPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setIsEmailLoading(true);

      // Start the email sign-up process
      router.push("/email-signup");
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }
    } finally {
      setIsEmailLoading(false);
    }
  }, []);


  const onGoogleSignUpPress = useCallback(async () => {
    try {
      setIsGoogleLoading(true);

      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      console.log('signUp', signUp?.emailAddress);
      console.log('signIn', signIn?.userData);
      console.log('user', user);
      
      if (createdSessionId) {
        // Set the active session
        setActive!({ session: createdSessionId });
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Something went wrong with Google sign up"
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  return (
    <LoggedLayout>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-layout pb-layout">
          {/* Header Section */}
          <View className="pt-12">
            <Text
              testID="signup-title"
              className="heading-s text-dark-content-white mb-layout-s"
            >
              {t("loginOptions.title")}
            </Text>
          </View>

          {/* Main Content */}
          <View className="flex-1">
            <View className="space-y-4">
              <LoginButton
                testID="email-signup-button"
                icon="mail"
                text={t("loginOptions.emailOption")}
                onPress={onEmailSignUpPress}
                isPrimary={true}
                isLoading={isEmailLoading}
                disabled={isEmailLoading || !isLoaded}
              />
              <LoginButton
                testID="google-signup-button"
                icon="logo-google"
                text={t("loginOptions.googleOption")}
                onPress={onGoogleSignUpPress}
                isPrimary={false}
                isLoading={isGoogleLoading}
                disabled={isGoogleLoading || !isLoaded}
              />
            </View>
          </View>

          {/* Footer Section */}
          <View className="pb-safe mb-6">
            <Text
              testID="terms-text"
              className="text-dark-content-white caption-l text-center"
            >
              {t("loginOptions.terms")}{" "}
              <Text className="text-dark-content-white caption-l font-medium underline">
                {t("loginOptions.termsLink")}
              </Text>
              .
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LoggedLayout>
  );
};

export default SignUp;
