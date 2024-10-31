import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";

const useLoggedUserActions = () => {
  const navigation = useNavigation();

  const { logout } = usePrivy();

  const { updateLogged } = useAuthStore((state) => ({
    updateLogged: state.updateLogged,
  }));

  //TODO uncomment logout actions

  const onLogout = async () => {
    try {
      //await logout();
      //nextLogout();
    } catch (err) {
      const e = err as Error;
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
      updateLogged(false);
    }
  };

  const nextLogout = () => {
    updateLogged(false);
    navigation.navigate("Login");
  };

  return { onLogout };
};

export default useLoggedUserActions;
