import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  View,
  Alert,
} from "react-native";
import { useSignUp, useOAuth, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import LoggedLayout from "@/components/LoggedLayout";
import LoginButton from "@/components/login/button";

const Login = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
  }, [isLoaded, router]);

  const onGoogleSignUpPress = useCallback(async () => {
    try {
      setIsGoogleLoading(true);

      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/(auth)/home"); // Navigate to main app
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Something went wrong with Google sign up"
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }, [startOAuthFlow, router]);

  return (
    <LoggedLayout>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-layout pb-layout">
          {/* Header Section */}
          <View className="pt-12">
            <Text className="heading-s text-dark-content-white mb-layout-s">
              {t("loginOptions.title")}
            </Text>
          </View>

          {/* Main Content */}
          <View className="flex-1">
            <View className="space-y-4">
              <LoginButton
                icon="mail"
                text={t("loginOptions.emailOption")}
                onPress={onEmailSignUpPress}
                isPrimary={true}
                isLoading={isEmailLoading}
                disabled={isEmailLoading || !isLoaded}
              />
              <LoginButton
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
            <Text className="text-dark-content-white caption-l text-center">
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

export default Login;
