import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo-light.svg";

const Login = () => {
  const { t } = useTranslation();
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Login;
