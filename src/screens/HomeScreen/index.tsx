import OrdersListCard from "@/components/Cards/OrdersListCard";
import LoggedLayout from "@/components/LoggedLayout";
import HomeActions from "./components/HomeActions";
import ProfileButton from "@/components/ProfileButton";

const HomeScreen = () => {
  return (
    <LoggedLayout>
      <OrdersListCard />
      <HomeActions />
    </LoggedLayout>
  );
};

export default HomeScreen;
