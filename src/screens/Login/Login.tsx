import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/logo-light.svg";
// import { useLoginWithEmail } from "@privy-io/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../styles/colors";

const Login = () => {
  const { t } = useTranslation();
  // const { sendCode } = useLoginWithEmail();

  // const sendCodeAsync = async () => {
  //   try {
  //     const res = await sendCode({ email: "augusto@zeneca.app" });
  //     console.log("Res: ", res);
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={100} height={100} />
        </View>
        <Text style={styles.title}>Zeneca</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{t("login.description")}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.commonButton}>
            <Ionicons name="logo-google" size={24} color="white" />
            <View style={styles.gmailTextContainer}>
              <Text style={styles.gmailText}>Continue with Google</Text>
            </View>
          </Pressable>
          <View style={styles.buttonEmailContainer}>
            <Pressable style={styles.commonButton}>
              <Ionicons name="mail" size={24} color="white" />
              <View style={styles.gmailTextContainer}>
                <Text style={styles.gmailText}>Continue with Email</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    fontFamily: "Manrope_400Regular",
  },
  buttonsContainer: {
    paddingTop: 50,
    justifyContent: "center",
  },
  commonButton: {
    width: 300,
    height: 50,
    backgroundColor: colors.darkHighlight,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonEmailContainer: {
    marginTop: 30,
  },
  gmailText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
  },
  gmailTextContainer: {
    marginLeft: 15,
  },
});

export default Login;
