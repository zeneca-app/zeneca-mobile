import { Text, View } from "react-native";
import useAuthStore from "../storage/authStore";

const Login = () => {
  const { logged } = useAuthStore();
  console.log("Logged: ", logged);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login Screen</Text>
    </View>
  );
};

export default Login;
