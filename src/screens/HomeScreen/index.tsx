import Balance from "@/components/Balance";
import OrdersListCard from "@/components/Cards/OrdersListCard";
import VerifyCtaCard from "@/components/Cards/VerifyCtaCard";
import LoggedLayout from "@/components/LoggedLayout";
import { useAuthInterceptor } from "@/hooks/apiInterceptor";
import { View } from "react-native";
import HomeActions from "./components/HomeActions";

const HomeScreen = () => {
  useAuthInterceptor();

  return (
    <LoggedLayout>
      <View className="pt-12 pb-6">
        <Balance />
      </View>
      <VerifyCtaCard />
      <OrdersListCard />
      <HomeActions />
    </LoggedLayout>
  );
};

export default HomeScreen;
