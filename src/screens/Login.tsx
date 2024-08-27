import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Logo from "../../assets/logo-light.svg";

const Login = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={100} height={100} />
        </View>
        <Text style={styles.title}>Zeneca</Text>
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
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Login;
