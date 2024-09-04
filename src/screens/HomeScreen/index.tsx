import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";

const HomeScreen = () => {
  const { logout } = usePrivy();
  const { update } = useAuthStore((state) => ({ update: state.update }));
  const navigation = useNavigation();

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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Pressable style={styles.commonButton} onPress={onLogout}>
        <View style={styles.textContainer}>
          <Text style={styles.loginText}>Logout</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  commonButton: {
    width: 300,
    height: 50,
    backgroundColor: colors.darkHighlight,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
  },
  textContainer: {
    marginLeft: 15,
  },
});

export default HomeScreen;
