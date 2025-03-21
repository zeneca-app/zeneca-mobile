import React, { Fragment, useEffect, useState } from "react";
import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import LoginButton from "@/components/login/button";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import LoggedLayout from "@/components/LoggedLayout";
import { colors } from "@/styles/colors";

const CELL_COUNT = 6;


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
      <LoggedLayout>
        <SafeAreaView className="flex-1">
          <View className="p-layout">
            <Text className="heading-s text-dark-content-white mb-layout-s">
              {t("emailOtpValidation.title")}
            </Text>
            <Text className="caption-xl text-gray-50 mb-[30px]">
              {t("emailOtpValidation.subtitle")} {email}
            </Text>
            <View className="mb-[30px]">
              <CodeField
                ref={ref}
                {...props}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Fragment key={index}>
                    <View
                      // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                      onLayout={getCellOnLayoutHandler(index)}
                      key={index}
                      style={[styles.cellRoot, isFocused && styles.focusCell]}>
                      <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
                    </View>
                    {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
                  </Fragment>
                )}
              />
            </View>
            <View className="p-layout mt-auto">
              <LoginButton
                icon="checkmark"
                text={t("emailOtpValidation.continueButton")}
                onPress={verifyCode}
                isPrimary={true}
                isLoading={false}
                disabled={code.length !== 6}
              />

            </View>
          </View>
        </SafeAreaView>
      </LoggedLayout>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkHighlight,
    borderRadius: 8,
  },
  cellText: {
    color: "#FFFFFF",
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: colors.darkHighlight,
    alignSelf: 'center',
  },
});