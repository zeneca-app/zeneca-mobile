import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuthStore from "../../storage/authStore";

const HomeScreen = () => {
  const { logout } = usePrivy();
  const { update } = useAuthStore((state) => ({ update: state.update }));
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onLogout = async () => {
    try {
      await logout();
      update(false);
      navigation.navigate("Login");
    } catch (err) {
      const e = err as Error;
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
      update(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileButton} onPress={onLogout}>
            <Ionicons name="person-sharp" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["#A48BF1", "#80B0F9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceAmount}>100.65</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down" size={20} color="white" />
              <Text style={styles.buttonText}>{t("home.deposit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-up" size={20} color="white" />
              <Text style={styles.buttonText}>{t("home.send")}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18171A",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: "white",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontFamily: "Manrope_400Regular",
  },
});

export default HomeScreen;
