import OrdersListCard from "@/components/Cards/OrdersListCard";
import LoggedLayout from "@/components/LoggedLayout";
import HomeActions from "./components/HomeActions";

const HomeScreen = () => {
  return (
    <LoggedLayout>
      <OrdersListCard />
      <HomeActions /> 
    </LoggedLayout>
  );
};

export default HomeScreen;
