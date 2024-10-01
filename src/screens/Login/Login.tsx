import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithOAuth } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Logo from "../../../assets/logo-light.svg";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";
import LogoLetter from "../../../assets/zeneca-logo-letters.svg";
import GradientCircle from "../../../assets/zeneca-gradient-circle.svg";

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
        <View style={styles.backgroundContainer}>
          <GradientCircle style={styles.gradientCircle} />
          <View style={styles.logoOverlay}>
            <Logo width={60} height={60} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <LogoLetter style={styles.logoLetters} />
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{t("login.description_line_1")}</Text>
              <Text style={styles.description}>{t("login.description_line_2")}</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.commonButton} onPress={loginWithGmail}>
              <Ionicons
                name="logo-google"
                size={24}
                color={colors.darkHighlight}
                style={styles.buttonIcon}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#0D0B0D",
  },
  container: {
    flex: 1,
    backgroundColor: "#0D0B0D",
  },
  backgroundContainer: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientCircle: {
    position: "absolute",
  },
  logoOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    marginTop: '60%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoLetters: {
    marginBottom: 20,
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
    textAlign: 'center',
    fontSize: 28,
    fontFamily: "Manrope_500Medium",
    color: "white",
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: "center",
  },
  commonButton: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonIcon: {
    marginRight: 10,
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
