import PositionsList from "@/screens/HomeScreen/components/PositionsList";
import HomeActions from "@/screens/HomeScreen/components/HomeActions";
import LoggedLayout from "@/components/LoggedLayout";


const HomeScreen = () => {
  return (
    <LoggedLayout>
      <PositionsList />
      <HomeActions />
    </LoggedLayout>
  );
};

export default HomeScreen;
