import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithOAuth } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Logo from "../../../assets/logo-light.svg";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { login } = useLoginWithOAuth({
    onSuccess: (user, isNewUser) => {
      update(true);
      navigation.navigate("MainTabs");
      if (isNewUser) {
        toast({
          title: t("login.welcome_zeneca"),
          preset: "done",
        });
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
  const { update } = useAuthStore((state) => ({
    update: state.update,
  }));

  const loginWithGmail = async () => {
    try {
      await login({ provider: "google" });
    } catch (error) {
      const e = error as Error;
      console.log("error", e);
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.wrapperLogo}>
            <Logo width={100} height={100} />
          </View>
        </View>
        <Text style={styles.title}>Zeneca</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{t("login.description")}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.commonButton} onPress={loginWithGmail}>
            <Ionicons
              name="logo-google"
              size={24}
              color={colors.darkHighlight}
            />
            <View style={styles.textContainer}>
              <Text style={styles.loginText}>
                {t("login.continue_with_google")}
              </Text>
            </View>
          </Pressable>
          {/* TODO: Enable email login without SSO */}
          {/* <View style={styles.buttonEmailContainer}>
            <Pressable style={styles.commonButton} onPress={onLogout}>
              <Ionicons name="mail" size={24} color="white" />
              <View style={styles.textContainer}>
                <Text style={styles.loginText}>Continue with Email</Text>
              </View>
            </Pressable>
          </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.darkHighlight,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: colors.darkHighlight,
  },
  logoContainer: {
    width: "100%",
    height: 150,
    alignItems: "center",
  },
  wrapperLogo: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 40,
  },
  title: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    color: "white",
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    fontFamily: "Manrope_400Regular",
    color: "white",
  },
  buttonsContainer: {
    paddingTop: 50,
    justifyContent: "center",
  },
  commonButton: {
    width: 300,
    height: 50,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonEmailContainer: {
    marginTop: 30,
  },
  loginText: {
    color: colors.darkHighlight,
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
  },
  textContainer: {
    marginLeft: 15,
  },
});

export default Login;
