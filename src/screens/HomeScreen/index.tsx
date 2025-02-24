import MyPositionsList from "@/screens/HomeScreen/components/MyPositionsList";
import HomeActions from "@/screens/HomeScreen/components/HomeActions";
import LoggedLayout from "@/components/LoggedLayout";

const HomeScreen = () => {
  return (
    <LoggedLayout>
      <MyPositionsList />
      <HomeActions />
    </LoggedLayout>
  );
};

export default HomeScreen;
